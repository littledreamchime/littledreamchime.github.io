import { atom } from "nanostores";
import { PRELOAD_ASSETS } from "../config";
import { prefetch } from 'astro:prefetch'; 
import { getImage } from "astro:assets";
import type { ImageMetadata } from "astro";

// 保留这个状态，用于给其他 UI 组件判断“首次重度加载”是否完成
export const isAssetsLoaded = atom(false);

declare global {
    interface Window {
        __AUTO_PRELOAD_URLS__?: string[];
    }
}

export function preloadAssets() {
    if (typeof window === 'undefined') return Promise.resolve();
    
    // 【关键修改】：移除了 if (isAssetsLoaded.get()) return; 
    // 这样每次调用 preloadAssets 都会遍历资源列表进行“存在性检查”
    
    const deepPreloadPage = async (url: string) => {
        if (import.meta.env.DEV) {
            prefetch(url);
            return true;
        }

        try {
            const cache = 'caches' in window ? await caches.open('site-assets-v1') : null;
            
            // 检查 Cache API 中是否已经存在该页面
            let response = cache ? await cache.match(url) : null;
            
            if (!response) {
                // 如果不存在（缓存被清或首次访问），则静默下载并存入缓存
                response = await fetch(url);
                if (response.ok && cache) {
                    await cache.put(url, response.clone());
                }
            }

            const html = await response.text();
            prefetch(url);

            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const subAssets: string[] = [];

            doc.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
                const href = link.getAttribute('href');
                if (href) subAssets.push(href);
            });

            doc.querySelectorAll('script[src]').forEach(script => {
                const src = script.getAttribute('src');
                if (src) subAssets.push(src);
            });

            const subPromises = subAssets.map(async (src) => {
                try {
                    // 同样检查子资源是否已存在
                    let subRes = cache ? await cache.match(src) : null;
                    if (!subRes) {
                        subRes = await fetch(src);
                        if (subRes.ok && cache) {
                            await cache.put(src, subRes.clone());
                        }
                    }
                } catch (e) {
                    console.warn(`Failed to preload sub-asset ${src}:`, e);
                }
            });

            await Promise.all(subPromises);
            return true;

        } catch (error) {
            console.warn(`Failed to deep preload ${url}:`, error);
            return true;
        }
    };

    const assetPromises = PRELOAD_ASSETS.map(asset => {
        return new Promise((resolve) => {
            switch (asset.type) {
                case 'image': {
                    // 浏览器会自动检查 Disk/Memory Cache。若存在，瞬间 resolve；若不存在，静默下载。
                    const img = new Image();
                    img.src = asset.src;
                    img.onload = resolve;
                    img.onerror = resolve; 
                    break;
                }
                case 'audio':
                case 'video': {
                    const media = asset.type === 'audio' ? new Audio() : document.createElement('video');
                    media.preload = 'auto'; 
                    media.src = asset.src;
                    media.onloadeddata = resolve;
                    media.onerror = resolve;
                    setTimeout(resolve, 3000);
                    media.load();
                    break;
                }
                case 'font': {
                    // 【关键修改】：检查 DOM 中是否已经注入过该字体，防止每次页面切换都重复添加 <link>
                    if (document.querySelector(`link[href="${asset.src}"]`)) {
                        resolve(true);
                        break;
                    }
                    const link = document.createElement('link');
                    link.rel = 'preload';
                    link.as = 'font';
                    link.href = asset.src;
                    link.crossOrigin = 'anonymous'; 
                    link.onload = resolve;
                    link.onerror = resolve;
                    document.head.appendChild(link);
                    break;
                }
                case 'page':
                case 'fetch':
                default: {
                    deepPreloadPage(asset.src).then(resolve);
                    break;
                }
            }
        });
    });

    const internalLinks = Array.from(document.querySelectorAll('a'))
        .map(a => a.getAttribute('href'))
        .filter((href): href is string => typeof href === 'string' && href.startsWith('/') && !href.startsWith('//'));
    const uniqueLinks = [...new Set(internalLinks)];
    const pagePromises = uniqueLinks.map(url => deepPreloadPage(url));

    const autoUrls = window.__AUTO_PRELOAD_URLS__ || [];
    const autoPagePromises = autoUrls.map(url => deepPreloadPage(url));

    return Promise.all([...assetPromises, ...pagePromises, ...autoPagePromises]).then(() => {
        // 标记为已加载完成，供其他组件使用
        isAssetsLoaded.set(true);
    });
}

export async function getOptimizedImageUrl(
  src: ImageMetadata, 
  format: 'webp' | 'avif' | 'png' | 'jpeg' = 'webp'
) {
  const optimized = await getImage({ src, format });
  return `url(${optimized.src})`;
}
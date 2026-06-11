import { atom } from "nanostores";
import { PRELOAD_ASSETS } from "../config";
import { prefetch } from 'astro:prefetch'; 

export const isAssetsLoaded = atom(false);

declare global {
    interface Window {
        __AUTO_PRELOAD_URLS__?: string[];
    }
}

export function preloadAssets() {
    if (typeof window === 'undefined') return Promise.resolve();
    if (isAssetsLoaded.get()) return Promise.resolve();
    
    const deepPreloadPage = (url: string) => {
        return new Promise((resolve) => {
            if (import.meta.env.DEV) {
                prefetch(url);
                return resolve(true);
            }
            fetch(url)
                .then(res => res.text())
                .then(html => {
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

                    const subPromises = subAssets.map(src => fetch(src).catch(() => null));
                    return Promise.all(subPromises);
                })
                .then(() => resolve(true))
                .catch(() => resolve(true)); 
        });
    };

    const assetPromises = PRELOAD_ASSETS.map(asset => {
        return new Promise((resolve) => {
            switch (asset.type) {
                case 'image': {
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
        isAssetsLoaded.set(true);
    });
}
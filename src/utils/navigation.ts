// src/utils/navigation.ts
import { 
    currentView, 
    isAnimating, 
    leaveHooks, 
    clearLeaveHooks, 
    layoutLeaveHooks, 
    clearLayoutLeaveHooks 
} from "../store";
import { navigate } from 'astro:transitions/client';

/* Get View From Path */
export interface RouteMeta {
    view: string;
    zoom: 'none' | 'paper' | 'computer';
    showReturnBtn: boolean;
    parent: 'none' | 'Home' | 'Devlog' | 'About' | 'Blog';
}

interface RouteDef extends RouteMeta {
    pattern: RegExp; 
}

export const ROUTES: RouteDef[] = [
    { pattern: /^\/$/, view: 'Home', zoom: 'none', showReturnBtn: false, parent: 'Home'},
    { pattern: /^\/about\/?$/, view: 'About', zoom: 'paper', showReturnBtn: true, parent: 'About'},
    { pattern: /^\/blog\/?$/, view: 'Blog', zoom: 'computer', showReturnBtn: true, parent: 'Blog'},
    { pattern: /^\/blog\/[^\/]+\/?$/, view: 'BlogBinder', zoom: 'computer', showReturnBtn: true, parent: 'Blog' },
    { pattern: /^\/blog\/[^\/]+\/.+$/, view: 'BlogPaper', zoom: 'computer', showReturnBtn: true, parent: 'Blog' },
    { pattern: /^\/devlog\/?$/, view: 'Devlog', zoom: 'none', showReturnBtn: true, parent: 'Devlog' },
    { pattern: /^\/devlog\/[^\/]+\/?$/, view: 'DevlogBinder', zoom: 'none', showReturnBtn: true, parent: 'Devlog' },
    { pattern: /^\/devlog\/[^\/]+\/.+$/, view: 'DevlogPaper', zoom: 'none', showReturnBtn: true, parent: 'Devlog' },
];

const DEFAULT_META: RouteMeta = { view: 'Home', zoom: 'none', showReturnBtn: false, parent:'none' };

export function getViewFromPath(pathname: string): string | undefined {
    let pathOnly = pathname;

    // 修复：处理带有 http/https 的绝对路径时，检查是否为外部链接
    if (pathname.startsWith('http')) {
        try {
            const url = new URL(pathname);
            // 如果在浏览器环境下，且域名不是当前网站域名，说明是外部链接，没有对应的内部 View
            if (typeof window !== 'undefined' && url.hostname !== window.location.hostname) {
                return undefined;
            }
            pathOnly = url.pathname;
        } catch (e) {
            return undefined; // URL 解析失败
        }
    }

    const normalizedPath = pathOnly === '/' ? '/' : pathOnly.replace(/\/$/, '');
    
    const route = ROUTES.find(r => r.pattern.test(normalizedPath));
    return route ? route.view : undefined; 
}

export function getViewMeta(viewName: string): RouteMeta {
    const route = ROUTES.find(r => r.view === viewName);
    return route || DEFAULT_META;
}

/* Control all navigate */
export async function navigateWithAnimation(href: string) {
    const currentPath = window.location.pathname.replace(/\/$/, '');
    const targetPath = new URL(href, window.location.origin).pathname.replace(/\/$/, '');
    if (currentPath === targetPath) return;

    const targetView = getViewFromPath(targetPath) || 'Home';

    if(isAnimating.get()) return;

    isAnimating.set(true);
    document.body.style.pointerEvents = 'none';

    const hooks = leaveHooks.get();
    if (hooks.length > 0) {
        await Promise.all(hooks.map(hook => hook(targetView)));
        clearLeaveHooks(); 
    }
    currentView.set(targetView);
    
    const layoutHooks = layoutLeaveHooks.get();
    if (layoutHooks.length > 0) {
        await Promise.all(layoutHooks.map(hook => hook(targetView)));
        clearLayoutLeaveHooks();
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
    navigate(href);
}

export function handleAnimatedLinkClick(e: Event) {
    const target = e.currentTarget as HTMLAnchorElement;
    const href = target.getAttribute('href');
    if (!href) return;

    // 修复：判断是否为外部链接或要求新标签页打开的链接
    try {
        const url = new URL(href, window.location.origin);
        
        if (!url.protocol.startsWith('http')) {
            return; 
        }
        const isExternal = url.hostname !== window.location.hostname;
        const isBlankTarget = target.target === '_blank';

        if (isExternal || isBlankTarget) {
            // 如果是外部链接，且 <a> 标签没有自带 target="_blank"，则强制在新标签页打开
            if (isExternal && !isBlankTarget) {
                e.preventDefault();
                window.open(href, '_blank');
            }
            // 直接 return，让浏览器处理跳转，不触发后续的动画逻辑
            return;
        }
    } catch (error) {
        // 如果 URL 解析失败（比如是 mailto: 等特殊协议），直接放行
        return;
    }

    const targetView = getViewFromPath(href);
    if (!targetView) return;

    e.preventDefault();
    navigateWithAnimation(href);
}

export function syncViewWithUrl(){
    if(typeof window === 'undefined') return;
    const expectedView = getViewFromPath(window.location.pathname) || 'Home';
    if(currentView.get() !== expectedView){
        currentView.set(expectedView);
    }
}

if(typeof document !== 'undefined'){
    document.addEventListener('astro:page-load', () => {
        syncViewWithUrl();

        isAnimating.set(false);
        document.body.style.pointerEvents = 'auto';
    });
}
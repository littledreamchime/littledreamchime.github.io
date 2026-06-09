// src/utils/navigation.ts
import { currentView,isAnimating, leaveHooks,clearLeaveHooks 
    ,layoutLeaveHooks,clearLayoutLeaveHooks
} from "../store";
import { navigate } from 'astro:transitions/client';

/* Get View From Path */
export interface RouteMeta{
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
    { pattern: /^\/about(\/.*)?$/, view: 'About', zoom: 'paper', showReturnBtn: true, parent: 'About'},
    { pattern: /^\/blog(\/.*)?$/, view: 'Blog', zoom: 'computer', showReturnBtn: true, parent: 'Blog'},
    { pattern: /^\/blog\/[^\/]+\/?$/, view: 'BlogPaper', zoom: 'computer', showReturnBtn: true, parent: 'Blog' },
    { pattern: /^\/devlog\/?$/, view: 'Devlog', zoom: 'none', showReturnBtn: true,parent: 'Devlog' },
    { pattern: /^\/devlog\/[^\/]+\/?$/, view: 'DevlogBinder', zoom: 'none', showReturnBtn: true, parent: 'Devlog' },
    { pattern: /^\/devlog\/[^\/]+\/.+$/, view: 'DevlogPaper', zoom: 'none', showReturnBtn: true, parent: 'Devlog' },
];
const DEFAULT_META: RouteMeta = { view: 'Home', zoom: 'none', showReturnBtn: false, parent:'none' };

export function getViewFromPath(pathname: string): string | undefined {
    const pathOnly = pathname.startsWith('http') ? new URL(pathname).pathname : pathname;
    const normalizedPath = pathOnly === '/' ? '/' : pathOnly.replace(/\/$/, '');
    
    const route = ROUTES.find(r => r.pattern.test(normalizedPath));
    return route ? route.view : undefined; 
}

export function getViewMeta(viewName: string): RouteMeta {
    const route = ROUTES.find(r => r.view === viewName);
    return route || DEFAULT_META;
}

/*Control all navigate*/
export async function navigateWithAnimation(href: string, targetView: string) {
    const currentPath = window.location.pathname.replace(/\/$/, '');
    const targetPath = new URL(href, window.location.origin).pathname.replace(/\/$/, '');
    if (currentPath === targetPath) return;

    if(isAnimating.get())return;

    isAnimating.set(true);
    document.body.style.pointerEvents='none';


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
    window.scrollTo({top:0,behavior:'auto'});
    navigate(href);
}

export function handleAnimatedLinkClick(e: Event) {
    const target = e.currentTarget as HTMLAnchorElement;
    const href = target.getAttribute('href');
    if (!href) return;

    const targetView = getViewFromPath(href);
    if (!targetView) return;

    e.preventDefault();
    navigateWithAnimation(href, targetView);
}

export function syncViewWithUrl(){
    if(typeof window === 'undefined') return;
    const expectedView= getViewFromPath(window.location.pathname) || 'Home';
    if(currentView.get() !== expectedView){
        currentView.set(expectedView);
    }
}


if(typeof document !=='undefined'){
    document.addEventListener('astro:page-load',()=>{
        syncViewWithUrl();

        isAnimating.set(false);
        document.body.style.pointerEvents='auto';
    });
}
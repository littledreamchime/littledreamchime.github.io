// src/utils/navigation.ts
import { currentView,isAnimating, onLeaveHook } from "../store";
import { ANIMATION_TIMES } from "../config";
import { navigate } from 'astro:transitions/client';


export function getViewFromPath(pathname: string): string | undefined {
    const normalizedPath = pathname === '/' ? '/' : pathname.replace(/\/$/, '');
    
    if (normalizedPath === '/' || normalizedPath === '') return 'Home';
    
    if (normalizedPath === '/blog' || normalizedPath.startsWith('/blog/')) return 'Blog';
    if (normalizedPath === '/devlog' || normalizedPath.startsWith('/devlog/')) return 'Devlog';
    if (normalizedPath === '/about' || normalizedPath.startsWith('/about/')) return 'About';
    
    return undefined;
}

function getWaitTime(current: string, target: string):number{
     if ((current === 'Home' && target === 'Devlog') || (current === 'Devlog' && target === 'Home')) {
        return ANIMATION_TIMES.ZOOM_DEVLOG;
    }
    return target === 'Home' ? ANIMATION_TIMES.ZOOM_OUT : ANIMATION_TIMES.ZOOM_IN;
}
function executeTransition(href:string,targetView:string,waitTime:number){
    window.scrollTo({top:0,behavior:'auto'});
    currentView.set(targetView);
    setTimeout(()=>{
        navigate(href)
    },waitTime);
}


export async function navigateWithAnimation(href: string, targetView: string) {
    if(isAnimating.get())return;

    const current = currentView.get();
    if(current === targetView) return;

    isAnimating.set(true);
    document.body.style.pointerEvents='none';

    const leaveHook=onLeaveHook.get();
    if(leaveHook){
        await leaveHook();
        onLeaveHook.set(null);
    }
    const waitTime=getWaitTime(current,targetView);
    executeTransition(href,targetView,waitTime);
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

if(typeof document !=='undefined'){
    document.addEventListener('astro:page-load',()=>{
        isAnimating.set(false);
        document.body.style.pointerEvents='auto';
    });
}
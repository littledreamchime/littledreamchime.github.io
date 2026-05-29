// src/utils/navigation.ts
import { currentView, ANIMATION_TIMES,isAnimating } from "../store";
import { navigate } from 'astro:transitions/client';


export function getViewFromPath(pathname: string): string | undefined {
    const normalizedPath = pathname === '/' ? '/' : pathname.replace(/\/$/, '');
    
    if (normalizedPath === '/' || normalizedPath === '') return 'Home';
    
    if (normalizedPath === '/blog' || normalizedPath.startsWith('/blog/')) return 'Blog';
    if (normalizedPath === '/devlog' || normalizedPath.startsWith('/devlog/')) return 'Devlog';
    if (normalizedPath === '/about' || normalizedPath.startsWith('/about/')) return 'About';
    
    return undefined;
}


export function navigateWithAnimation(href: string, targetView: string) {
    if(isAnimating.get())return;

    const current = currentView.get();

    if(current === targetView) return;

    isAnimating.set(true);
    document.body.style.pointerEvents='none';

    window.scrollTo({ top: 0, behavior: 'auto' });

    currentView.set(targetView);

    var waitTime = targetView === 'Home' ? ANIMATION_TIMES.ZOOM_OUT : ANIMATION_TIMES.ZOOM_IN;
    
    if((current==='Home' && targetView === 'Devlog')|| (current === 'Devlog' && targetView==='Home')){
        waitTime = ANIMATION_TIMES.ZOOM_DEVLOG;
    }

    setTimeout(() => {
        navigate(href);
    }, waitTime);
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
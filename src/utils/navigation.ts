// src/utils/navigation.ts
import { currentView, ANIMATION_TIMES } from "../store";
import { navigate } from 'astro:transitions/client';

export const pathToView = {
    '/': 'Home',
    '/blog': 'Blog',
    '/devlog': 'Devlog',
    '/about': 'About'
};

export function navigateWithAnimation(href: string, targetView: string) {
    const current = currentView.get();

    if (current === targetView) return;

    if(targetView === 'Devlog' || current === 'Devlog'){
        currentView.set(targetView);
        navigate(href);
        return;
    }

    window.scrollTo({ top: 0, behavior: 'auto' });

    currentView.set(targetView);

    const waitTime = targetView === 'Home' ? ANIMATION_TIMES.ZOOM_OUT : ANIMATION_TIMES.ZOOM_IN;

    setTimeout(() => {
        navigate(href);
    }, waitTime);
}

export function handleAnimatedLinkClick(e: Event) {
    const target = e.currentTarget as HTMLAnchorElement;
    const href = target.getAttribute('href');
    if (!href) return;

    const normalizedHref = href === '/' ? '/' : href.replace(/\/$/, '');
    const targetView = pathToView[normalizedHref as keyof typeof pathToView];

    if (!targetView) return;

    e.preventDefault();
    navigateWithAnimation(href, targetView);
}
import { atom } from "nanostores";

export const isWelcomeDismissed=atom(false);

export const currentView = atom('Home');

export const isAnimating=atom(false);

export const ANIMATION_TIMES={
    ZOOM_IN:1200,
    ZOOM_OUT:1200,
    ZOOM_DEVLOG:300,
};


/*Load resources */
export const PRELOAD_IMAGES=[
    '/Images/desk_bg_Template.png',
];
export const isAssetsLoaded=atom(false);

export function preloadAssets(){
    if(typeof window==='undefined')return Promise.resolve();
    if (isAssetsLoaded.get()) return Promise.resolve();
    
    const promises = PRELOAD_IMAGES.map(src => {
        return new Promise((resolve) => {
            const img = new Image();
            img.src = src;
            img.onload = resolve;
            img.onerror = resolve; 
        });
    });

    return Promise.all(promises).then(() => {
        isAssetsLoaded.set(true);
    });
}

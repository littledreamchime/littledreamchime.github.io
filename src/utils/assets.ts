import { atom } from "nanostores";
import { PRELOAD_IMAGES } from "../config";


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

import { atom } from "nanostores";
import { PRELOAD_ASSETS } from "../config";

export const isAssetsLoaded = atom(false);

export function preloadAssets() {
    if (typeof window === 'undefined') return Promise.resolve();
    if (isAssetsLoaded.get()) return Promise.resolve();
    
    const promises = PRELOAD_ASSETS.map(asset => {
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
                    media.src = asset.src;
                    media.oncanplaythrough = resolve;
                    media.onerror = resolve;
                    media.load();
                    break;
                }

                case 'font': {
                    document.fonts.load(asset.src)
                        .then(resolve)
                        .catch(resolve);
                    break;
                }

                case 'fetch':
                default: {
                    fetch(asset.src)
                        .then(resolve)
                        .catch(resolve);
                    break;
                }
            }
        });
    });

    return Promise.all(promises).then(() => {
        isAssetsLoaded.set(true);
    });
}
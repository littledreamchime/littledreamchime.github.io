import { atom } from "nanostores";

export const isWelcomeDismissed=atom(false);

export const currentView = atom('Home');

export const ANIMATION_TIMES={
    ZOOM_IN:1200,
    ZOOM_OUT:1200
};
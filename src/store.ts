
import { atom } from "nanostores";
export const isWelcomeDismissed=atom(false);

export const currentView = atom('Home');
export const isAnimating=atom(false);

type LeaveHookType= ()=>Promise<void>;
export const onLeaveHook = atom< LeaveHookType | null>(null);



import { atom } from "nanostores";
export const isWelcomeDismissed=atom(false);

export const currentView = atom('Home');
export const isAnimating=atom(false);


export const leaveHooks = atom<Array<(targetView: string) => Promise<void>>>([]);

export function addLeaveHook(hook: (targetView: string) => Promise<void>) {
    leaveHooks.set([...leaveHooks.get(), hook]);
}

export function clearLeaveHooks() {
    leaveHooks.set([]);
}
const STORAGE_KEY = 'personalblog:preferred-language';

/** Read the last language name the user picked (exact marker string). */
export function getPreferredLanguage(): string | null {
	if (typeof window === 'undefined') return null;
	try {
		const value = window.localStorage.getItem(STORAGE_KEY);
		return value && value.trim() ? value : null;
	} catch {
		return null;
	}
}

/** Persist the language name shown in the switcher (e.g. "English", "中文"). */
export function setPreferredLanguage(lang: string): void {
	if (typeof window === 'undefined') return;
	const trimmed = lang.trim();
	if (!trimmed) return;
	try {
		window.localStorage.setItem(STORAGE_KEY, trimmed);
	} catch {
		/* ignore quota / private mode */
	}
}

/**
 * Pick which language to show for the current page.
 * Uses the saved preference when it exists in `available`; otherwise the first (default).
 */
export function resolveLanguage(available: string[]): string {
	if (available.length === 0) return '';
	const preferred = getPreferredLanguage();
	if (preferred && available.includes(preferred)) return preferred;
	return available[0]!;
}

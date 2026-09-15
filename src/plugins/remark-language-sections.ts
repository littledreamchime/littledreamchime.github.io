import type { PhrasingContent, Root, RootContent } from 'mdast';

/**
 * Markers may use ASCII `--` or typographic dashes (`—`/`–`) because
 * Astro's built-in remark-smartypants often runs before custom plugins.
 */
const MARKER_RE =
	/^(?:--|\u2013|\u2014)Language(?:--|\u2013|\u2014)\s*(.+?)\s*(?:--|\u2013|\u2014)Language(?:--|\u2013|\u2014)$/;

type LangSectionNode = {
	type: 'langSection';
	data: {
		hName: 'div';
		hProperties: {
			className: string[];
			dataLangSection: string;
		};
	};
	children: RootContent[];
};

/** Lightweight text flatten for marker paragraphs (avoids extra deps). */
function phrasingToString(nodes: PhrasingContent[] | undefined): string {
	if (!nodes) return '';
	let out = '';
	for (const node of nodes) {
		if ('value' in node && typeof node.value === 'string') {
			out += node.value;
		} else if ('children' in node && Array.isArray(node.children)) {
			out += phrasingToString(node.children as PhrasingContent[]);
		}
	}
	return out;
}

function getMarkerName(node: RootContent): string | null {
	if (node.type !== 'paragraph') return null;
	const text = phrasingToString(node.children).trim();
	const match = text.match(MARKER_RE);
	if (!match) return null;
	const name = match[1]!.trim();
	return name.length > 0 ? name : null;
}

/**
 * Remark plugin: split markdown body on `--Language-- Name --Language--` markers.
 * - 0 markers: no-op
 * - 1 marker: strip marker (+ preamble), keep body unwrapped
 * - ≥2 markers: wrap each section in <div class="lang-section" data-lang-section="Name">
 */
export function remarkLanguageSections() {
	return (tree: Root) => {
		const { children } = tree;
		const markers: { index: number; name: string }[] = [];

		for (let i = 0; i < children.length; i++) {
			const name = getMarkerName(children[i]!);
			if (name) markers.push({ index: i, name });
		}

		if (markers.length === 0) return;

		if (markers.length === 1) {
			const only = markers[0]!;
			tree.children = children.slice(only.index + 1);
			return;
		}

		const sections: LangSectionNode[] = [];

		for (let i = 0; i < markers.length; i++) {
			const marker = markers[i]!;
			const start = marker.index + 1;
			const end = i + 1 < markers.length ? markers[i + 1]!.index : children.length;
			const isFirst = i === 0;

			sections.push({
				type: 'langSection',
				data: {
					hName: 'div',
					hProperties: {
						className: ['lang-section', isFirst ? 'is-active' : 'is-hidden'],
						dataLangSection: marker.name,
					},
				},
				children: children.slice(start, end),
			});
		}

		tree.children = sections as unknown as RootContent[];
	};
}

export default remarkLanguageSections;

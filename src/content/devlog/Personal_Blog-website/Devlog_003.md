---
title: Devlog_003
description: Resolving Issues_003, About Page Layout & UI Asset Prep
pubDate: Jun 16 2026
heroImage: ../../../assets/blog-placeholder-3.jpg
---
##### Duration: Jun 15 2026 - Jun 21 2026
##### Tags： `#Fix` `#Layout` `#Design` `#Code`
## Context & Goals:
With the core components in place, this phase was all about refinement and visual preparation. Main objectives here:
- Clear the bug backlog from Issues_003.
- Design and implement the layout for the "About" page.
- Run experiments and lay the groundwork for embedding actual image assets into the UI.
## Approach & Decisions:
- Detail-Oriented Fixes: I focused heavily on polishing the micro-interactions and visual bugs.
- Continuous Tracking: any newly discovered UI quirks or edge cases were immediately aggregated into a new tracker ( Issues_004 ).
## The Result：
- Resolved bugs:
	 - Tooltip Positioning.
	 - Marquee Bug in Devlog-Binder section.
	 - Mobile Responsiveness: ensured the Blog section scales and displays perfectly on narrow viewports.
- Designed and implemented the About page.
	![AboutPage](../_images/Personal_Blog-website/AboutPage.png)
- Added a utility function to fetch optimized image URLs, prepping the system for image loading.
``` js
export async function getOptimizedImageUrl(
  src: ImageMetadata,
  format: 'webp' | 'avif' | 'png' | 'jpeg' = 'webp'
) {
  const optimized = await getImage({ src, format });
  return `url(${optimized.src})`;
}
```
## Nest Steps：
- Tackle the minor UI quirks and bugs accumulated in Issues_004.
- Launch and put the blog into use.
- Shift focus to art direction: illustrate custom image assets and polish the overall visual aesthetics of the site.
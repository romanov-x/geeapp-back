# Motion audit implementation

Baseline: 58ea09e. Read-only audit performed with improve-animations; implementation performed separately under animate and emil-design-eng at the user's explicit request.

| Order | Plan | Status |
| --- | --- | --- |
| 1 | User-controlled video and reduced-motion provider | DONE |
| 2 | Remove hover-only portfolio/max-height transitions; guard carousel scroll | DONE |
| 3 | Semantic hero stagger and one-shot section heading reveal | DONE |

## Self-contained implementation specification

1. In components/UIProvider.tsx, initialize animation preference to disabled on both server and first client render, then read matchMedia('(prefers-reduced-motion: reduce)') in an effect. Subscribe/unsubscribe change events. Wrap HeroUIProvider in MotionConfig reducedMotion='user'. Keep server/client classes identical during hydration.
2. In components/Hero.tsx and app/model/[id]/page.tsx, remove autoPlay/loop; keep poster, preload='metadata' and native controls. In components/WorksCarousel.tsx, remove the effect that calls video.play(), keep captions visible and videos user-controlled, and remove the non-interactive card's focus/click handler. Carousel and brand scrolling use instant under reduced motion, smooth otherwise.
3. Use --ease-out:cubic-bezier(.23,1,.32,1), --ease-in-out:cubic-bezier(.77,0,.175,1), --ease-drawer:cubic-bezier(.32,.72,0,1). Hero groups enter over 300ms with 0/100/200/300ms delays. Position starts translateY(12px), opacity starts 0, hidden state exists only in keyframes. Reduced motion uses a 150ms opacity-only fade. Press is scale .96 over 150ms, enabled controls only, with a staticMotion opt-out. No search/filter card stagger. SiteMotion uses IntersectionObserver once per heading and WAAPI transform/opacity for 300ms, reading the CSS easing token. Cancel active animations on a preference change/unmount.

Verification: inspect computed hero keyframe name/delay; keyboard still reaches controls immediately; videos have no autoplay; production build passes; visual entrance checked at normal speed. Real-device and slow-motion/OS reduced-motion checks remain Not verified in docs/interface-review-2026-11-13.md.

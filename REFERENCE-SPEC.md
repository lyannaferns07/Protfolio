# Reference spec — karolinahess.com

All values measured from the live DOM via computed styles / `getBoundingClientRect`
at the stated viewport, plus screenshots. Animation timings come from the site's own
`#__framer__appearAnimationsContent` payload, which is authoritative.

## Provenance & confidence

| Area | Confidence | Source |
| --- | --- | --- |
| Layout, type, colour, spacing | High | computed styles + rects + screenshots |
| Page-load appear timings/easings | High | site-authored appear JSON |
| Horizontal works scroll | Medium | reconstructed from geometry (see below) |
| Scroll-linked bg/logo colour | Medium | observed at sampled offsets |

### Known reference-side defects (not reproduced)

1. **Framer appear handoff deadlocks.** A single shared 10s placeholder `Animation`
   is cancelled/recreated per appear id, so most ids never get their real animation.
   The hero H1 stays 130/160/116px low inside an `overflow:hidden` mask and is
   invisible. Reproduced as the *intended* reveal (see Appear timings), not the bug.
   `tools/appear.mjs` resolves the real final state for screenshot comparison.
2. **Horizontal works scroll is inert under automation.** Verified inert via four
   independent methods (`window.scrollTo`, `window.lenis.scrollTo`, trusted
   `mouse.wheel` with Lenis restarted, and headful Chrome). Framer Motion mounts
   (`MotionIsMounted === true`) and the background-colour effect *does* respond, so
   this is specific to the track effect in an automated context. Reconstructed from
   self-consistent geometry — see Horizontal works.

## Tokens

```
--bg:            #E9E8E8   light grey page
--green:         #1A5241   dark green (intro card, footer)
--lime:          #BFDB39   accent (CTA pill, "together", "care.", active nav)
--ink:           #18231D   near-black green (header logo, dark icons)
--hero-ink:      #17231D   hero headline
--white:         #FAFAFA
--grey-text:     #5C5C5C   hero subline
--grey-mid:      #C2C2C2
--grey-faint:    #C2C2C2   footer "Drop me an email:"
--radius-card:   12px      works cards
--radius-pill:   200px     CTA + reel button
```

## Typography — Neue Montreal (Regular / Medium)

Loaded by the reference from `framerusercontent.com/assets/…woff2` (PP Neue Montreal,
a commercial licence). This project substitutes a metric-similar free grotesque;
see `src/styles/fonts.css`.

| Element | Size | Weight | Line-height | Letter-spacing | Colour |
| --- | --- | --- | --- | --- | --- |
| Hero H1 "Creative Web" / "Designer" | 140px | 400 | 0.8 | -0.04em | #17231D |
| Footer H2 "Let's work" / "together" | 140px | 400 | 0.8 | -0.04em | #FAFAFA / #BFDB39 |
| "PLAY REEL" | 140px | 400 | 1.1 | -0.04em | #FAFAFA |
| "Recent works" | 56px (112px @994w) | 400 | 1.1 | -0.04em | #1A5241 |
| Section H2/H3 body lines | 38px | 400 | 1.1 | -0.04em | #FAFAFA |
| Sub-label ("Designer/developer hybrid") | 16px | 400 | 1.4 | 0 | #FAFAFA |
| Subline | 18px | 400 | 1.3 | -0.01em | #5C5C5C |
| Footer email | 24px | 400 | 1.2 | -0.04em | #FAFAFA |
| Nav links | 14px Inter | 400 | 1.6 | -0.02em | #3B3B3B |
| CTA "Contact" | 16px Medium | 500 | 1.5 | 0 | #18231D |

## Sections (desktop 1440×900, total scroll height 6840)

1. **Header** — fixed, z 7, 90px tall. Name left, "Contact" pill right
   (lime, 48px tall, white 20px circle + arrow on its right edge).
2. **Hero** — 100vh, `#E9E8E8`.
   - Portrait photo, `object-fit: cover`, centred, overflowing the bottom edge.
   - H1 line 1 "Creative Web" centred; line 2 "Designer" right-aligned,
     both in `overflow:hidden` masks.
   - Subline right-aligned below.
   - Scroll-down button: 60px white circle, bottom-left, grey down-arrow.
   - Socials bottom-right (3 icons, 18px, `#18231D`, 6px gaps, 24px hit areas).
3. **Intro card** — full-bleed `#1A5241`, 20px top radius.
   - "Designer/developer **hybrid**" (hybrid lime), centred.
   - "I design with **care.**" / "No templates, no shortcuts." centred, `care.` lime.
   - **PLAY REEL** — full-width pill (radius 200px) filled by a muted looping video.
4. **Statement** — on `#E9E8E8`, large centred:
   "Just **custom-made**, thoughtful design — built and brought to life with **no-code**."
   Accent words in `#1A5241`.
5. **Recent works** — sticky/pinned, 20px bottom radius, `overflow:hidden`.
   - "Recent works" centred at top.
   - Horizontal card track below (see below).
6. **Footer** — `#1A5241`, 100vh.
   - "Let's work" (white) + "together" (lime), right-aligned, 140px,
     with a 120px circular portrait overlapping the gap between them.
   - "Drop me an email:" (`#C2C2C2`), email 24px white + lime 32px rounded copy button.
   - Socials bottom-right; ©2026 bottom-left.
   - Header fades out once the footer covers it.

### Right-edge vertical tab
White rounded tab pinned to the right edge, ~40px wide, rotated label "Quick info".

## Horizontal works track

Nine cards, `gap: 28px`, `align-items: flex-start`, track height 332px,
radius 12px, `overflow:hidden` per card. Track total width = **2797px**
(5 × 249 + 4 × 332 = 2573, + 8 × 28 gap = 2797 ✓).

Alternating sizes, two visual variants:

- **Fill card** — media covers the card exactly.
  249×332 portrait and 332×249 landscape.
- **Device card** — flat fill background (`#FAFAFA` or `#C2C2C2`) with a smaller
  media centred inside (inset ~54px horizontally / ~39px vertically).

Order: fill-portrait, fill-landscape, fill-portrait, device-light, fill-portrait,
fill-landscape, device-grey, fill-landscape, fill-portrait.

**Track travel = 4000px.** The track is laid out with its right edge 4000px beyond
the viewport's right edge, so it starts fully off-screen right; translating it
−4000px lands its right edge exactly flush with the viewport right edge
(−1357 + 2797 = 1440 ✓). Mapped linearly across the pinned scroll range.

## Scroll behaviour

- Smooth scrolling via **Lenis** (`html.lenis`, `lenis-autoToggle`), exposed as
  `window.lenis`. Exposed CSS `.lenis-content *` overrides.
- **Hero** is `position: sticky` and stays pinned for the whole of `main`
  (unpins at `mainHeight − 100vh`); later sections scroll over it.
- **Recent works** pins with `position: sticky; top: 0` for
  `sectionHeight − stickyHeight`, then releases upward.
- Background darkens across the works section into the footer.

## Appear timings (page load)

| Target | From | To | Delay | Duration | Easing |
| --- | --- | --- | --- | --- | --- |
| Hero H1 line 1 | y +130 | 0 | 0.2s | 0.8s | `cubic-bezier(.53,0,.44,1)` |
| Hero H1 line 2 | y +160 | 0 | 0.4s | 0.8s | `cubic-bezier(.53,0,.44,1)` |
| Hero subline | y +116 | 0 | 0.8s | 0.7s | `cubic-bezier(.53,0,.44,1)` |
| Hero photo | y +270 | 0 | 1.2s | 0.6s | `cubic-bezier(.67,0,.39,1)` |
| Hero socials | opacity 0 | 1 | 1.5s | 0.8s | `cubic-bezier(.44,0,.56,1)` |
| Intro lines | opacity 0 | 1 | 0s | 0.4s spring, bounce 0.2 | spring |

Hero text reveals through `overflow:hidden` masks (slide-up from below).
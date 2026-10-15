/**
 * Reference-capture helper.
 *
 * karolinahess.com uses Framer's "optimized appear" handoff, which deadlocks on
 * load in a headless/background tab: a single shared 10s placeholder Animation
 * (`K`) is cancelled and recreated for every appear id, so most ids never receive
 * their real animation and stay pinned at their `initial` keyframe. The hero
 * headline ends up 130/160/116px below its mask and is clipped by
 * `overflow:hidden`, so the H1 is invisible.
 *
 * The intended final state is still recorded in the page itself, in
 * `#__framer__appearAnimationsContent` / `#__framer__breakpoints`.
 * `finalizeAppear()` replays that spec onto each affected element so screenshots
 * show the designed result rather than the stuck handoff state.
 */
export const FINALIZE_APPEAR = `
(() => {
  const specEl = document.getElementById('__framer__appearAnimationsContent');
  const bpEl   = document.getElementById('__framer__breakpoints');
  if (!specEl || !bpEl) return 'no appear spec';
  const spec = JSON.parse(specEl.textContent);
  const bps  = JSON.parse(bpEl.textContent);
  const active = bps.find(b => matchMedia(b.mediaQuery).matches)?.hash;

  const round = n => Math.round(n * 1e4) / 1e4;
  const build = (v, template) => {
    const parts = [];
    const put = (fn, val, unit) => {
      if (val === undefined || val === null) return;
      if (typeof val === 'number' ? val === 0 : val === '0' || val === 'none') return;
      parts.push(fn + '(' + (typeof val === 'number' ? round(val) + unit : val) + ')');
    };
    if (v.transformPerspective !== undefined && v.transformPerspective !== 0)
      parts.push('perspective(' + v.transformPerspective + 'px)');
    put('translateX', v.x !== undefined ? v.x : v.translateX, 'px');
    put('translateY', v.y !== undefined ? v.y : v.translateY, 'px');
    put('translateZ', v.z !== undefined ? v.z : v.translateZ, 'px');
    put('scale', v.scale, '');
    put('scaleX', v.scaleX, '');
    put('scaleY', v.scaleY, '');
    put('rotate', v.rotate, 'deg');
    put('rotateX', v.rotateX, 'deg');
    put('rotateY', v.rotateY, 'deg');
    put('skewX', v.skewX, 'deg');
    put('skewY', v.skewY, 'deg');
    const inner = parts.join(' ');
    if (!template) return inner || '';
    return template.replace('__Appear_Animation_Transform__', inner);
  };

  let n = 0;
  document.querySelectorAll('[data-framer-appear-id]').forEach(el => {
    const entry = spec[el.dataset.framerAppearId];
    if (!entry) return;
    const cfg = entry[active] || entry.default;
    if (!cfg || !cfg.animate) return;
    // Kill the stuck 10s placeholder / half-played animation for this element.
    el.getAnimations().forEach(a => a.cancel());
    const a = cfg.animate;
    el.style.opacity = String(a.opacity ?? 1);
    const t = build(a, cfg.transformTemplate);
    el.style.transform = t || 'none';
    el.style.willChange = 'auto';
    n++;
  });
  return 'finalized ' + n + ' appear elements';
})()`;
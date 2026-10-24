/* Last Screening · Mobile navigation layer v12.
   Adds a responsive analog touch joystick without changing cinema.js's
   tile collision, door transitions, clue ownership, saves or Firebase sync.
   The engine retains keyboard / WASD input; joystick uses that same input path.
*/
(() => {
  'use strict';
  if (window.__LS_MOBILE_V12__) return;
  window.__LS_MOBILE_V12__ = true;

  const host = document.getElementById('tgHost');
  const shadow = host?.shadowRoot;
  if (!host || !shadow || typeof window.TG_open !== 'function') {
    console.warn('[Last Screening] cinema.js must load before mobile-controls-v12.js');
    return;
  }

  const keys = { up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight' };
  const state = { active: false, pointer: null, x: 0, y: 0, strength: 0, timer: null,
                  release: null, currentKey: null, balance: 0, initialized: false };

  const style = document.createElement('style');
  style.id = 'ls-mobile-v12-style';
  style.textContent = `
    :host { --ls-joy-size: clamp(104px, 29vw, 132px); }
    #game { width: 100%; height: 100%; min-width: 0; min-height: 0; overflow: hidden; }
    #view { width: 100%; height: 100%; display: block; }
    #top { top: 0; left: 0; right: 0; gap: clamp(3px, 1.2vw, 8px);
      padding: max(8px, env(safe-area-inset-top)) max(8px, env(safe-area-inset-right)) 10px max(8px, env(safe-area-inset-left));
      min-height: calc(58px + env(safe-area-inset-top)); }
    #title { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis;
      font-size: clamp(9px, 2.65vw, 12px); line-height: 1.35; }
    #title b { font-size: clamp(11px, 3.45vw, 16px); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    #top button { flex-shrink: 0; padding: 8px clamp(5px, 1.7vw, 10px); font-size: clamp(10px, 2.8vw, 12px); min-height: 35px; }
    #status { top: calc(59px + env(safe-area-inset-top)); left: max(10px, env(safe-area-inset-left));
      right: max(10px, env(safe-area-inset-right)); white-space: nowrap; overflow: hidden;
      text-overflow: ellipsis; font-size: clamp(10px, 2.7vw, 12px); pointer-events: none; }
    #pad { left: max(12px, env(safe-area-inset-left)); bottom: max(12px, env(safe-area-inset-bottom));
      width: var(--ls-joy-size); height: var(--ls-joy-size); z-index: 4; touch-action: none; }
    #pad > button[data-dir] { display: none !important; }
    #ls-joystick { position: relative; width: 100%; height: 100%; border-radius: 50%;
      touch-action: none; user-select: none; -webkit-user-select: none; -webkit-touch-callout: none;
      background: radial-gradient(circle at 50% 50%, #263a4cdb 0%, #162735e8 57%, #0d1927ef 100%);
      border: 2px solid #a78b59c9; box-shadow: 0 3px 20px #000a, inset 0 0 0 8px #d8b46a10;
      -webkit-tap-highlight-color: transparent; display: grid; place-items: center; }
    #ls-joystick:before { content: ''; position: absolute; inset: 15%; border: 1px solid #8e9ba64f;
      border-radius: 50%; pointer-events: none; }
    #ls-joystick:after { content: '＋'; position: absolute; color: #e6c58a35; font-size: 25px;
      pointer-events: none; }
    #ls-joystick.ls-active { border-color: #eed19e; box-shadow: 0 3px 24px #000b, 0 0 0 3px #d6b57824; }
    #ls-joy-knob { position: absolute; z-index: 1; width: 43%; aspect-ratio: 1; border-radius: 50%;
      background: radial-gradient(circle at 35% 28%, #b3ac93, #7c7b71 42%, #394b56 100%);
      border: 2px solid #f3dbab; box-shadow: 0 2px 9px #0009, inset 0 0 0 4px #17293745;
      transform: translate3d(0, 0, 0); pointer-events: none; will-change: transform;
      transition: transform 70ms ease-out; }
    #ls-joystick.ls-active #ls-joy-knob { transition: none; }
    #actions { z-index: 4; right: max(12px, env(safe-area-inset-right));
      bottom: max(15px, env(safe-area-inset-bottom)); gap: clamp(6px, 1.7vw, 10px); }
    #inspect { width: clamp(62px, 18vw, 76px); height: clamp(62px, 18vw, 76px);
      font-size: clamp(14px, 3.9vw, 18px); box-shadow: 0 4px 15px #0008; }
    #book { min-height: 43px; padding: 8px clamp(7px, 2vw, 12px); white-space: nowrap; }
    #hint { bottom: calc(max(12px, env(safe-area-inset-bottom)) + var(--ls-joy-size) + 12px);
      max-width: calc(100% - 24px); text-align: center; white-space: normal; line-height: 1.5;
      overflow-wrap: anywhere; padding: 6px 12px; font-size: clamp(10px, 2.7vw, 12px); z-index: 2;
      pointer-events: none; }
    #sheet { padding: max(12px, env(safe-area-inset-top)) max(12px, env(safe-area-inset-right))
      max(12px, env(safe-area-inset-bottom)) max(12px, env(safe-area-inset-left)); }
    #paper { max-height: min(82dvh, calc(100% - 18px)); overscroll-behavior: contain; }
    @media(max-width: 359px) {
      :host { --ls-joy-size: 104px; }
      #actions { gap: 5px; }
      #inspect { width: 60px; height: 60px; }
      #book { font-size: 11px; padding: 7px 6px; }
      #title { font-size: 9px; }
      #top button { padding: 7px 5px; }
    }
    @media(orientation: landscape) and (max-height: 530px) {
      :host { --ls-joy-size: clamp(76px, 22vh, 102px); }
      #top { min-height: 47px; padding-top: max(4px, env(safe-area-inset-top)); padding-bottom: 5px; }
      #status { top: calc(49px + env(safe-area-inset-top)); }
      #pad { bottom: max(7px, env(safe-area-inset-bottom)); }
      #actions { bottom: max(7px, env(safe-area-inset-bottom)); }
      #inspect { width: 56px; height: 56px; }
      #hint { bottom: calc(max(7px, env(safe-area-inset-bottom)) + var(--ls-joy-size) + 2px);
        font-size: 10px; padding: 4px 9px; }
    }
    @media(min-width: 750px) and (min-height: 531px) {
      :host { --ls-joy-size: 132px; }
      #pad { left: max(24px, env(safe-area-inset-left)); bottom: max(20px, env(safe-area-inset-bottom)); }
      #actions { right: max(24px, env(safe-area-inset-right)); bottom: max(20px, env(safe-area-inset-bottom)); }
    }
  `;
  shadow.appendChild(style);

  // The game engine's original collision / doors / saving logic remains the only movement authority.
  function keyDown(direction) {
    const code = keys[direction];
    if (!code) return;
    state.currentKey = code;
    window.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, cancelable: true, code, key: code }));
  }
  function keyUp() {
    if (!state.currentKey) return;
    const code = state.currentKey;
    state.currentKey = null;
    window.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, cancelable: true, code, key: code }));
  }
  function clearTimers() {
    if (state.timer) clearTimeout(state.timer);
    if (state.release) clearTimeout(state.release);
    state.timer = state.release = null;
  }
  function stop() {
    clearTimers();
    state.active = false;
    state.pointer = null;
    state.x = state.y = state.strength = 0;
    state.balance = 0.5;
    keyUp();
    const pad = shadow.getElementById('ls-joystick');
    const knob = shadow.getElementById('ls-joy-knob');
    pad?.classList.remove('ls-active');
    if (knob) knob.style.transform = 'translate3d(0, 0, 0)';
  }
  function chooseDirection() {
    const x = Math.abs(state.x), y = Math.abs(state.y), sum = x + y;
    if (sum < 0.01) return null;
    state.balance += x / sum;
    const horizontal = state.balance >= 1;
    if (horizontal) state.balance -= 1;
    return horizontal ? (state.x >= 0 ? 'right' : 'left') : (state.y >= 0 ? 'down' : 'up');
  }
  function pulse() {
    state.timer = null;
    if (!window.TG_isOpen?.()) { stop(); return; }
    if (!state.active || state.strength < 0.17) { keyUp(); return; }
    // Short discrete pulses avoid fighting the old 145ms held-key repeat loop.
    keyUp();
    const dir = chooseDirection();
    if (dir) keyDown(dir);
    state.release = setTimeout(() => { state.release = null; keyUp(); }, 62);
    // Low displacement -> slower steps. Far displacement -> faster steps.
    const interval = Math.round(190 - 72 * Math.min(1, (state.strength - 0.17) / 0.83));
    state.timer = setTimeout(pulse, interval);
  }
  function updatePointer(event) {
    const pad = shadow.getElementById('ls-joystick');
    if (!pad) return;
    const r = pad.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const dx = event.clientX - cx, dy = event.clientY - cy;
    const max = r.width * 0.32, distance = Math.hypot(dx, dy);
    const length = Math.min(distance, max);
    const nx = distance ? dx / distance : 0, ny = distance ? dy / distance : 0;
    state.x = nx * length / max;
    state.y = ny * length / max;
    state.strength = Math.hypot(state.x, state.y);
    const knob = shadow.getElementById('ls-joy-knob');
    if (knob) knob.style.transform = `translate3d(${Math.round(nx * length)}px, ${Math.round(ny * length)}px, 0)`;
    if (state.strength < 0.17) keyUp();
  }
  function createJoystick() {
    const base = shadow.getElementById('pad');
    if (!base || shadow.getElementById('ls-joystick')) return;
    const joystick = document.createElement('div');
    joystick.id = 'ls-joystick';
    joystick.setAttribute('role', 'group');
    joystick.setAttribute('aria-label', '드래그 조이스틱: 상하좌우 및 대각선 이동');
    joystick.innerHTML = '<div id="ls-joy-knob" aria-hidden="true"></div>';
    base.appendChild(joystick);
    joystick.addEventListener('pointerdown', event => {
      if (!window.TG_isOpen?.() || state.active || (event.pointerType === 'mouse' && event.button !== 0)) return;
      event.preventDefault();
      stop();
      state.active = true;
      state.balance = 0.5;
      state.pointer = event.pointerId;
      joystick.classList.add('ls-active');
      joystick.setPointerCapture?.(event.pointerId);
      updatePointer(event);
      pulse();
    });
    joystick.addEventListener('pointermove', event => {
      if (!state.active || event.pointerId !== state.pointer) return;
      event.preventDefault();
      const before = state.strength;
      updatePointer(event);
      if (before < 0.17 && state.strength >= 0.17 && !state.timer) pulse();
    });
    for (const eventName of ['pointerup', 'pointercancel', 'lostpointercapture']) {
      joystick.addEventListener(eventName, event => {
        if (state.active && event.pointerId === state.pointer) stop();
      });
    }
  }

  // The original renderer uses 28 CSS pixels per tile at zoom 2 even on very
  // different phones. A modest, bounded increase in virtual canvas resolution
  // expands the visible field without changing tile collision or sprite ratios.
  // zoom 3 and "전체 보기" remain available on the original zoom button.
  function viewportDensity() {
    const r = shadow.getElementById('view')?.getBoundingClientRect();
    if (!r?.width || !r.height) return 1;
    if (r.width > r.height || r.width >= 700) return 1;
    if (r.width < 360) return 1.06;
    if (r.width < 421) return 1.14;
    return 1.2;
  }
  function resizeGame() {
    if (!window.TG_isOpen?.()) return;
    // Tell the original renderer to recalculate pixel dimensions first.
    window.dispatchEvent(new Event('resize'));
    const canvas = shadow.getElementById('view');
    if (!canvas) return;
    const r = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const density = viewportDensity();
    const width = Math.max(1, Math.round(r.width * dpr * density));
    const height = Math.max(1, Math.round(r.height * dpr * density));
    if (canvas.width !== width) canvas.width = width;
    if (canvas.height !== height) canvas.height = height;
    host.dataset.lsViewportDensity = String(density);
  }
  let resizeFrame = 0;
  function scheduleResize() {
    if (resizeFrame) return;
    resizeFrame = requestAnimationFrame(() => { resizeFrame = 0; resizeGame(); });
  }
  function install() {
    createJoystick();
    if (!state.initialized) {
      state.initialized = true;
      shadow.getElementById('exit')?.addEventListener('click', stop);
      const hint = shadow.getElementById('hint');
      if (hint && window.MutationObserver) {
        const updateHint = () => {
          if (hint.textContent.includes('화면 버튼으로 이동'))
            hint.textContent = '원형 조이스틱을 드래그해 이동하세요';
        };
        new MutationObserver(updateHint).observe(hint, { childList: true, characterData: true, subtree: true });
        updateHint();
      }
      window.addEventListener('blur', stop);
      document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else scheduleResize(); });
      window.addEventListener('orientationchange', () => { stop(); scheduleResize(); }, { passive: true });
      window.visualViewport?.addEventListener('resize', scheduleResize, { passive: true });
      if (window.ResizeObserver) new ResizeObserver(scheduleResize).observe(host);
    }
    scheduleResize();
  }
  const originalOpen = window.TG_open;
  const originalClose = window.TG_close;
  window.TG_open = function (...args) {
    const result = originalOpen.apply(this, args);
    install();
    return result;
  };
  window.TG_close = function (...args) {
    stop();
    return originalClose.apply(this, args);
  };
  // A small deterministic inspection hook; no private game data is exposed.
  window.LS_mobileControlsQA = () => ({
    version: 'mobile-v12', installed: !!shadow.getElementById('ls-joystick'),
    active: state.active, vector: [state.x, state.y],
    canvas: (() => { const c = shadow.getElementById('view');
      return c ? { width: c.getBoundingClientRect().width, height: c.getBoundingClientRect().height } : null; })(),
    viewportDensity: Number(host.dataset.lsViewportDensity || 1),
    joystick: (() => { const p = shadow.getElementById('ls-joystick');
      return p ? { size: p.getBoundingClientRect().width, left: p.getBoundingClientRect().left } : null; })()
  });
})();

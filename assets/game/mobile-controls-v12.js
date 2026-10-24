/* EUNHA CINEMA V18 — passive responsive controls.
 * cinema.js exclusively owns keyboard/pointer input, canvas dimensions and RAF.
 * This module deliberately has no synthetic key events, movement timer,
 * resize observer or TG_open/TG_close wrapper.
 */
(() => {
  'use strict';
  if (window.__LS_MOBILE_V18__) return;
  const host = document.getElementById('tgHost');
  const shadow = host?.shadowRoot;
  if (!shadow || typeof window.TG_open !== 'function') return;
  window.__LS_MOBILE_V18__ = true;
  window.__LS_MOBILE_V12__ = true;

  const style = document.createElement('style');
  style.id = 'ls-mobile-v18-style';
  style.textContent = `
    :host { -webkit-tap-highlight-color: transparent; }
    #game { width:100%; height:100%; min-width:0; min-height:0;
      --joy-size:clamp(104px,28vmin,132px);
      --action-size:clamp(66px,18vmin,80px);
      --book-size:clamp(49px,13vmin,58px); }
    #view { display:block; width:100%; height:100%; image-rendering:auto; }
    #top { gap:clamp(5px,1.4vw,10px);
      padding:calc(8px + env(safe-area-inset-top,0px)) max(12px,env(safe-area-inset-right)) 12px max(12px,env(safe-area-inset-left)); }
    #title { min-width:0; line-height:1.45; font-size:clamp(10px,2.7vw,12px); }
    #title b { font-size:clamp(13px,3.5vw,17px); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
    #top button { min-width:44px; min-height:44px; flex:0 0 auto;
      padding:8px clamp(7px,1.8vw,12px); font-size:clamp(11px,2.8vw,13px); }
    #status { left:max(13px,env(safe-area-inset-left)); right:max(13px,env(safe-area-inset-right));
      overflow:hidden; text-overflow:ellipsis; white-space:nowrap; pointer-events:none; }
    #controls { gap:18px; padding:16px max(16px,env(safe-area-inset-right)) max(14px,env(safe-area-inset-bottom)) max(16px,env(safe-area-inset-left));
      background:linear-gradient(transparent,rgba(7,12,20,.48) 38%,rgba(7,12,20,.88)); }
    #joystick { border:1px solid rgba(204,175,121,.58);
      background:radial-gradient(circle at 45% 35%,rgba(96,100,105,.35),rgba(22,30,42,.76) 62%,rgba(9,15,25,.9));
      box-shadow:inset 0 0 0 5px rgba(220,191,137,.035),inset 0 0 24px rgba(0,0,0,.5),0 5px 20px rgba(0,0,0,.36); }
    #joystick::before { inset:13%; border-color:rgba(219,191,139,.2); }
    #joystick::after { inset:28%; border-color:rgba(219,191,139,.12); }
    #joystick.active { border-color:#efd7ab; box-shadow:inset 0 0 0 4px rgba(220,191,137,.08),0 5px 20px rgba(0,0,0,.4); }
    #joyKnob { width:43%; height:43%;
      border:1px solid rgba(239,222,187,.75);
      background:radial-gradient(circle at 35% 28%,#b7b3a2,#687776 52%,#344950);
      box-shadow:inset 0 2px 4px rgba(255,244,211,.22),inset 0 -4px 6px rgba(8,20,28,.5),0 3px 9px rgba(0,0,0,.52);
      transition:none; }
    #joystick .joy-label { letter-spacing:.19em; font-size:9px; color:rgba(230,216,185,.58); }
    #actions { gap:11px; padding-bottom:6px; }
    #inspect { min-width:44px; min-height:44px; border:1px solid #e5c995;
      background:radial-gradient(circle at 35% 25%,#a38455,#745238 72%,#493629);
      color:#fff0d3; font-weight:750;
      box-shadow:inset 0 2px 6px rgba(255,234,194,.15),0 5px 15px rgba(0,0,0,.45); }
    #book { min-width:44px; min-height:44px; border:1px solid rgba(179,166,139,.64);
      color:#e9deca; background:linear-gradient(135deg,#34434c,#1b2937);
      box-shadow:inset 0 1px 5px rgba(233,226,202,.07),0 4px 12px rgba(0,0,0,.4); }
    #hint { max-width:calc(100% - 28px); line-height:1.5; white-space:normal;
      font-size:clamp(10px,2.7vw,12px); padding:7px 13px; pointer-events:none; }
    #sheet { padding:max(12px,env(safe-area-inset-top)) max(12px,env(safe-area-inset-right)) max(12px,env(safe-area-inset-bottom)) max(12px,env(safe-area-inset-left)); }
    #paper { max-height:100%; touch-action:pan-y; overscroll-behavior:contain; }
    #paper button { min-height:44px; }
    #game button:focus-visible, #joystick:focus-visible { outline:2px solid #f5dfad; outline-offset:4px; }
    #game button:active { filter:brightness(1.14); }
    @media(max-width:359px) {
      #game { --joy-size:100px; --action-size:64px; --book-size:48px; }
      #top { gap:5px; padding-left:10px; padding-right:10px; }
      #top button { padding:7px; font-size:11px; }
      #controls { gap:12px; padding-left:12px; padding-right:12px; }
      #actions { gap:9px; }
    }
    @media(orientation:landscape) and (max-height:530px) {
      #game { --joy-size:clamp(76px,23vh,98px); --action-size:62px; --book-size:48px; }
      #top { padding-top:calc(4px + env(safe-area-inset-top,0px)); padding-bottom:6px; }
      #title { font-size:10px; } #title b { font-size:14px; }
      #controls { padding-top:5px; padding-bottom:max(7px,env(safe-area-inset-bottom)); }
      #hint { max-width:min(60%,500px); padding:5px 10px; font-size:11px; }
      #actions { padding-bottom:3px; }
    }
    @media(min-width:700px) and (min-height:531px) {
      #game { --joy-size:138px; --action-size:82px; --book-size:60px; }
      #controls { padding-left:28px; padding-right:28px; padding-bottom:max(22px,env(safe-area-inset-bottom)); }
    }
    @media(prefers-reduced-motion:reduce) {
      #game button, #joystick, #joyKnob { transition:none!important; }
    }
  `;
  shadow.appendChild(style);

  const joystick = shadow.getElementById('joystick');
  if (joystick) {
    joystick.tabIndex = 0;
    joystick.setAttribute('aria-label','이동 조이스틱. 누른 채 원하는 방향으로 끌기. 키보드는 방향키 또는 W A S D.');
    joystick.setAttribute('aria-keyshortcuts','ArrowUp ArrowDown ArrowLeft ArrowRight W A S D');
    joystick.title = '누른 채 이동 · 방향키 / WASD';
  }
  for (const [id,label,shortcut] of [
    ['inspect','가까운 물건 조사','E Enter Space'],
    ['book','수사 수첩 열기','B'],
    ['travel','극장 안내도 열기',''],
    ['exit','극장 탐색 나가기','Escape']
  ]) {
    const button = shadow.getElementById(id);
    if (!button) continue;
    button.setAttribute('type','button');
    button.setAttribute('aria-label',label);
    if (shortcut) button.setAttribute('aria-keyshortcuts',shortcut);
  }

  // Geometry only; all live input information remains owned by the engine.
  window.LS_mobileControlsQA = () => {
    const rect = element => {
      const r=element?.getBoundingClientRect();
      return r?{x:r.x,y:r.y,width:r.width,height:r.height}:null;
    };
    const canvas=shadow.getElementById('view');
    return {
      version:'mobile-v18-native', inputOwner:'cinema.js', installed:!!joystick,
      duplicateJoystick:!!shadow.getElementById('ls-joystick'),
      syntheticKeys:false, movementTimers:0, viewportDensity:1,
      joystick:rect(joystick), canvas:rect(canvas),
      backingStore:canvas?{width:canvas.width,height:canvas.height}:null,
      actions:['inspect','book','travel','exit'].map(id=>({id,...rect(shadow.getElementById(id))}))
    };
  };
})();

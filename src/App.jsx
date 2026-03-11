import { useState, useCallback, useRef, useEffect } from "react";

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0a0a0f; --surface: #111118; --surface2: #18181f; --border: #252530; --border2: #2e2e3a;
    --accent: #c8ff57; --accent2: #57c8ff; --text: #f0f0f8; --text2: #8888aa; --text3: #555570;
    --win: #57ff9e; --loss: #ff5770; --safe: #c8ff57; --fun: #ff9957; --scorer: #d4aaff;
    --radius: 16px; --radius-sm: 10px; --font-head: 'Syne', sans-serif; --font-body: 'DM Sans', sans-serif;
  }
  body { background: var(--bg); color: var(--text); font-family: var(--font-body); }
  .app { max-width: 430px; margin: 0 auto; min-height: 100vh; display: flex; flex-direction: column; background: var(--bg); }
  .header { padding: 20px 20px 0; display: flex; align-items: center; justify-content: space-between; }
  .header-logo { font-family: var(--font-head); font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
  .header-logo span { color: var(--accent); }
  .header-pill { background: var(--surface2); border: 1px solid var(--border); border-radius: 20px; padding: 4px 12px; font-size: 12px; color: var(--text2); font-family: var(--font-head); font-weight: 600; }
  .scroll-area { flex: 1; overflow-y: auto; padding: 16px 16px 100px; scrollbar-width: none; }
  .scroll-area::-webkit-scrollbar { display: none; }
  .bottom-nav { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 430px; background: rgba(10,10,15,0.92); backdrop-filter: blur(20px); border-top: 1px solid var(--border); padding: 8px 0 20px; display: flex; justify-content: space-around; z-index: 100; }
  .nav-item { display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: pointer; padding: 6px 16px; border-radius: var(--radius-sm); border: none; background: none; color: var(--text3); font-family: var(--font-body); transition: color 0.2s; }
  .nav-item.active { color: var(--accent); }
  .nav-item span { font-size: 10px; font-weight: 500; letter-spacing: 0.5px; text-transform: uppercase; }
  .card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 16px; margin-bottom: 12px; }
  .card-title { font-family: var(--font-head); font-size: 13px; font-weight: 700; color: var(--text2); letter-spacing: 1px; text-transform: uppercase; margin-bottom: 12px; }
  .upload-zone { border: 2px dashed var(--border2); border-radius: var(--radius); padding: 48px 24px; text-align: center; cursor: pointer; transition: all 0.3s; background: var(--surface); position: relative; overflow: hidden; }
  .upload-zone:hover, .upload-zone.drag { border-color: var(--accent); background: rgba(200,255,87,0.04); }
  .upload-zone input { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }
  .upload-icon { font-size: 40px; margin-bottom: 12px; }
  .upload-title { font-family: var(--font-head); font-size: 18px; font-weight: 700; margin-bottom: 6px; }
  .upload-sub { font-size: 13px; color: var(--text2); }
  .bookmaker-badges { display: flex; gap: 8px; justify-content: center; margin-top: 16px; }
  .badge { padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; font-family: var(--font-head); letter-spacing: 0.5px; }
  .badge-winamax { background: rgba(255,107,107,0.15); color: var(--loss); border: 1px solid rgba(255,107,107,0.3); }
  .badge-betclic { background: rgba(87,200,255,0.15); color: var(--accent2); border: 1px solid rgba(87,200,255,0.3); }
  .image-preview-wrap { position: relative; border-radius: var(--radius); overflow: hidden; margin-bottom: 12px; background: var(--surface2); border: 1px solid var(--border); }
  .image-preview-wrap img { width: 100%; max-height: 240px; object-fit: cover; display: block; opacity: 0.7; }
  .analyzing-overlay { position: absolute; inset: 0; background: rgba(10,10,15,0.85); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; }
  .spinner { width: 40px; height: 40px; border: 3px solid var(--border2); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .analyzing-text { font-family: var(--font-head); font-size: 15px; font-weight: 700; color: var(--accent); }
  .analyzing-sub { font-size: 12px; color: var(--text2); }
  .competition-detect { display: flex; align-items: flex-start; gap: 10px; background: rgba(87,200,255,0.07); border: 1px solid rgba(87,200,255,0.18); border-radius: var(--radius-sm); padding: 10px 12px; margin-bottom: 12px; }
  .competition-detect-icon { font-size: 16px; margin-top: 1px; flex-shrink: 0; }
  .competition-detect-label { font-size: 11px; color: var(--accent2); margin-bottom: 2px; }
  .competition-detect-name { font-family: var(--font-head); font-size: 14px; font-weight: 700; color: var(--text); }
  .validation-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
  .validation-title { font-family: var(--font-head); font-size: 20px; font-weight: 800; }
  .result-chip { padding: 5px 14px; border-radius: 20px; font-size: 12px; font-weight: 700; font-family: var(--font-head); letter-spacing: 0.5px; text-transform: uppercase; }
  .result-win { background: rgba(87,255,158,0.15); color: var(--win); border: 1px solid rgba(87,255,158,0.3); }
  .result-loss { background: rgba(255,87,112,0.15); color: var(--loss); border: 1px solid rgba(255,87,112,0.3); }
  .field-group { margin-bottom: 14px; }
  .field-label { font-size: 11px; color: var(--text2); font-weight: 500; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 6px; }
  .field-input { width: 100%; background: var(--surface2); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 10px 12px; color: var(--text); font-family: var(--font-body); font-size: 14px; outline: none; transition: border-color 0.2s; appearance: none; }
  .field-input:focus { border-color: var(--accent); }
  select.field-input { cursor: pointer; }
  .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .selection-item { background: var(--surface2); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 10px 12px; margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between; }
  .selection-left { flex: 1; }
  .selection-team { font-size: 13px; font-weight: 500; display: flex; align-items: center; gap: 6px; flex-wrap: wrap; }
  .selection-type { font-size: 11px; color: var(--text2); margin-top: 2px; }
  .selection-odd { font-family: var(--font-head); font-size: 16px; font-weight: 700; color: var(--accent); margin-left: 12px; flex-shrink: 0; }
  .scorer-tag { background: rgba(212,170,255,0.15); color: var(--scorer); border: 1px solid rgba(212,170,255,0.3); border-radius: 6px; font-size: 10px; font-weight: 700; padding: 2px 6px; font-family: var(--font-head); letter-spacing: 0.3px; white-space: nowrap; }
  .freebet-tag { background: rgba(87,200,255,0.15); color: var(--accent2); border: 1px solid rgba(87,200,255,0.3); border-radius: 6px; font-size: 10px; font-weight: 700; padding: 2px 7px; font-family: var(--font-head); letter-spacing: 0.3px; white-space: nowrap; }
  /* Tag selector — supports custom tags */
  .tag-selector { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 14px; }
  .tag-btn { padding: 10px 16px; border-radius: var(--radius-sm); border: 2px solid var(--border); background: var(--surface2); cursor: pointer; text-align: center; transition: all 0.2s; font-family: var(--font-head); font-size: 13px; font-weight: 700; color: var(--text2); }
  .tag-btn.selected { border-color: var(--accent); background: rgba(200,255,87,0.1); color: var(--accent); }
  .btn-primary { width: 100%; padding: 16px; background: var(--accent); color: #0a0a0f; border: none; border-radius: var(--radius); font-family: var(--font-head); font-size: 15px; font-weight: 800; cursor: pointer; letter-spacing: 0.5px; transition: all 0.2s; }
  .btn-primary:hover { background: #d8ff70; transform: translateY(-1px); }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  .btn-secondary { width: 100%; padding: 14px; background: transparent; color: var(--text2); border: 1px solid var(--border); border-radius: var(--radius); font-family: var(--font-head); font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; margin-top: 8px; }
  .btn-secondary:hover { border-color: var(--text2); color: var(--text); }
  /* ── COMPACT BET CARD (new design) ── */
  .bet-row { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 12px 14px; margin-bottom: 8px; cursor: pointer; transition: border-color 0.15s, transform 0.12s; display: flex; align-items: center; gap: 12px; }
  .bet-row:hover { border-color: var(--border2); transform: translateY(-1px); }
  .bet-row:active { transform: scale(0.985); }
  .bet-row-left { flex: 1; min-width: 0; }
  .bet-row-type { font-family: var(--font-head); font-size: 13px; font-weight: 700; color: var(--text); margin-bottom: 3px; display: flex; align-items: center; gap: 6px; }
  .bet-row-meta { font-size: 11px; color: var(--text3); }
  .bet-row-right { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; flex-shrink: 0; }
  .bet-row-odd { font-family: var(--font-head); font-size: 13px; font-weight: 700; color: var(--accent); }
  .bet-row-gain { font-family: var(--font-head); font-size: 14px; font-weight: 800; }
  .bet-row-result { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; flex-shrink: 0; }
  .bet-row-result.win { background: rgba(87,255,158,0.15); }
  .bet-row-result.loss { background: rgba(255,87,112,0.12); }
  /* ── modal ── */
  .modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.75); z-index: 200; display: flex; align-items: flex-end; animation: fadeIn 0.2s; }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .modal-sheet { background: var(--surface); border-radius: 24px 24px 0 0; width: 100%; max-width: 430px; margin: 0 auto; max-height: 90vh; overflow-y: auto; padding-bottom: 40px; animation: slideUp 0.3s cubic-bezier(0.16,1,0.3,1); scrollbar-width: none; position: relative; }
  .modal-sheet::-webkit-scrollbar { display: none; }
  @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
  .modal-handle { width: 40px; height: 4px; background: var(--border2); border-radius: 2px; margin: 12px auto 0; }
  .modal-header { padding: 16px 20px 0; }
  .modal-title { font-family: var(--font-head); font-size: 20px; font-weight: 800; margin-bottom: 4px; }
  .modal-sub { font-size: 13px; color: var(--text2); }
  .modal-body { padding: 16px 20px 0; }
  .modal-close { position: absolute; top: 16px; right: 16px; width: 32px; height: 32px; border-radius: 50%; background: var(--surface2); border: 1px solid var(--border); color: var(--text2); cursor: pointer; font-size: 15px; display: flex; align-items: center; justify-content: center; z-index: 10; }
  .detail-section { margin-bottom: 20px; }
  .detail-section-title { font-size: 11px; color: var(--text3); text-transform: uppercase; letter-spacing: 0.7px; font-weight: 600; margin-bottom: 10px; }
  .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .detail-item { background: var(--surface2); border-radius: var(--radius-sm); padding: 10px 12px; }
  .detail-item-label { font-size: 10px; color: var(--text3); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
  .detail-item-value { font-family: var(--font-head); font-size: 15px; font-weight: 700; }
  .detail-item.full { grid-column: 1/-1; }
  .selection-detail { background: var(--surface2); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 12px; margin-bottom: 8px; }
  .sel-top { display: flex; justify-content: space-between; align-items: flex-start; }
  .sel-team { font-family: var(--font-head); font-size: 14px; font-weight: 700; margin-bottom: 3px; }
  .sel-type { font-size: 12px; color: var(--text2); }
  .sel-odd-big { font-family: var(--font-head); font-size: 22px; font-weight: 800; color: var(--accent); flex-shrink: 0; margin-left: 8px; }
  /* ── stats ── */
  .stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 14px; }
  .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 14px; }
  .stat-card.full { grid-column: 1 / -1; }
  .stat-label { font-size: 10px; color: var(--text2); text-transform: uppercase; letter-spacing: 0.7px; margin-bottom: 6px; font-weight: 600; }
  .stat-value { font-family: var(--font-head); font-size: 26px; font-weight: 800; line-height: 1; }
  .stat-value.positive { color: var(--win); }
  .stat-value.negative { color: var(--loss); }
  .stat-value.neutral { color: var(--accent); }
  .stat-sub { font-size: 11px; color: var(--text3); margin-top: 4px; }
  .bar-chart { display: flex; flex-direction: column; gap: 8px; }
  .bar-row { display: flex; align-items: center; gap: 10px; }
  .bar-label { font-size: 12px; color: var(--text2); width: 80px; flex-shrink: 0; text-align: right; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .bar-track { flex: 1; height: 8px; background: var(--surface2); border-radius: 4px; overflow: hidden; }
  .bar-fill { height: 100%; border-radius: 4px; transition: width 0.8s cubic-bezier(0.16,1,0.3,1); }
  .bar-val { font-family: var(--font-head); font-size: 12px; font-weight: 700; width: 52px; text-align: right; flex-shrink: 0; }
  .player-row { display: flex; align-items: center; gap: 10px; padding: 10px 12px; background: var(--surface2); border-radius: var(--radius-sm); margin-bottom: 6px; }
  .player-rank { font-family: var(--font-head); font-size: 16px; font-weight: 800; width: 24px; flex-shrink: 0; }
  .player-avatar { width: 32px; height: 32px; border-radius: 50%; background: var(--border2); display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
  .player-info { flex: 1; min-width: 0; }
  .player-name { font-family: var(--font-head); font-size: 13px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .player-meta { font-size: 11px; color: var(--text2); margin-top: 2px; }
  .player-profit { font-family: var(--font-head); font-size: 15px; font-weight: 700; flex-shrink: 0; }
  .tab-switch { display: flex; background: var(--surface2); border-radius: var(--radius-sm); padding: 3px; margin-bottom: 14px; gap: 3px; }
  .tab-switch-btn { flex: 1; padding: 8px; border: none; border-radius: 8px; background: transparent; color: var(--text2); font-family: var(--font-head); font-size: 11px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
  .tab-switch-btn.active { background: var(--surface); color: var(--text); }
  .donut-wrap { display: flex; align-items: center; gap: 16px; }
  .donut-legend { display: flex; flex-direction: column; gap: 8px; flex: 1; }
  .legend-item { display: flex; align-items: center; gap: 8px; font-size: 12px; }
  .legend-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
  .insight-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 14px; margin-bottom: 10px; display: flex; gap: 12px; align-items: flex-start; }
  .insight-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
  .icon-positive { background: rgba(87,255,158,0.15); }
  .icon-negative { background: rgba(255,87,112,0.15); }
  .icon-neutral { background: rgba(200,255,87,0.15); }
  .insight-text { flex: 1; }
  .insight-title { font-family: var(--font-head); font-size: 14px; font-weight: 700; margin-bottom: 2px; }
  .insight-sub { font-size: 12px; color: var(--text2); line-height: 1.4; }
  .insight-roi { font-family: var(--font-head); font-size: 18px; font-weight: 800; flex-shrink: 0; }
  .ai-panel { background: linear-gradient(135deg, rgba(200,255,87,0.04), rgba(87,200,255,0.04)); border: 1px solid rgba(200,255,87,0.18); border-radius: var(--radius); padding: 20px; margin-bottom: 16px; }
  .ai-panel-title { font-family: var(--font-head); font-size: 18px; font-weight: 800; margin-bottom: 6px; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .ai-panel-sub { font-size: 13px; color: var(--text2); line-height: 1.6; margin-bottom: 16px; }
  .ai-premium-badge { background: linear-gradient(90deg, #c8ff57, #57c8ff); color: #0a0a0f; font-size: 10px; font-weight: 800; padding: 3px 8px; border-radius: 6px; font-family: var(--font-head); letter-spacing: 0.5px; }
  .ai-features { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
  .ai-feature { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text2); }
  .ai-feature-icon { color: var(--accent); font-size: 14px; flex-shrink: 0; }
  .ai-unlock-btn { width: 100%; padding: 16px; background: linear-gradient(90deg, #c8ff57, #57c8ff); color: #0a0a0f; border: none; border-radius: var(--radius); font-family: var(--font-head); font-size: 15px; font-weight: 800; cursor: pointer; letter-spacing: 0.5px; transition: all 0.2s; }
  .ai-unlock-btn:hover { opacity: 0.9; transform: translateY(-1px); }
  .ai-price { font-size: 12px; text-align: center; color: var(--text3); margin-top: 8px; }
  .ai-response { background: var(--surface2); border: 1px solid var(--border); border-radius: var(--radius); padding: 16px; margin-top: 12px; }
  .ai-response-header { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
  .ai-avatar { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, #c8ff57, #57c8ff); display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; }
  .ai-response-title { font-family: var(--font-head); font-size: 14px; font-weight: 700; }
  .ai-response-body { font-size: 13px; color: var(--text2); line-height: 1.8; white-space: pre-wrap; }
  .ai-typing { display: flex; gap: 4px; align-items: center; padding: 8px 0; justify-content: center; }
  .ai-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--accent); animation: pulse 1.2s infinite; }
  .ai-dot:nth-child(2) { animation-delay: 0.2s; }
  .ai-dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes pulse { 0%,100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.1); } }
  .success-screen { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px 24px; text-align: center; gap: 12px; }
  .success-icon { font-size: 56px; animation: pop 0.5s cubic-bezier(0.16,1,0.3,1); }
  @keyframes pop { 0% { transform: scale(0); } 80% { transform: scale(1.1); } 100% { transform: scale(1); } }
  .success-title { font-family: var(--font-head); font-size: 24px; font-weight: 800; }
  .success-sub { font-size: 14px; color: var(--text2); max-width: 240px; }
  .error-msg { background: rgba(255,87,112,0.1); border: 1px solid rgba(255,87,112,0.3); border-radius: var(--radius-sm); padding: 12px; font-size: 13px; color: var(--loss); margin-bottom: 12px; line-height: 1.5; }
  .empty-state { text-align: center; padding: 48px 24px; color: var(--text3); }
  .empty-state .e-icon { font-size: 40px; margin-bottom: 12px; }
  .empty-state .e-title { font-family: var(--font-head); font-size: 16px; font-weight: 700; color: var(--text2); margin-bottom: 6px; }
  .empty-state .e-sub { font-size: 13px; }
  .section-title { font-family: var(--font-head); font-size: 16px; font-weight: 800; margin-bottom: 12px; margin-top: 4px; letter-spacing: -0.3px; }
  .divider { border: none; border-top: 1px solid var(--border); margin: 16px 0; }
  .combo-total { background: rgba(200,255,87,0.06); border: 1px solid rgba(200,255,87,0.15); border-radius: 10px; padding: 10px 14px; margin-top: 8px; display: flex; justify-content: space-between; align-items: center; }
  .header-user { display: flex; align-items: center; gap: 8px; }
  .header-avatar { width: 30px; height: 30px; border-radius: 50%; background: linear-gradient(135deg, var(--accent), var(--accent2)); display: flex; align-items: center; justify-content: center; font-family: var(--font-head); font-size: 13px; font-weight: 800; color: #0a0a0f; flex-shrink: 0; }
  .login-screen { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 32px 24px; background: var(--bg); max-width: 430px; margin: 0 auto; }
  .login-logo { font-family: var(--font-head); font-size: 36px; font-weight: 800; letter-spacing: -1px; margin-bottom: 6px; }
  .login-logo span { color: var(--accent); }
  .login-tagline { font-size: 13px; color: var(--text3); margin-bottom: 40px; text-align: center; }
  .login-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px; width: 100%; margin-bottom: 12px; }
  .login-card-title { font-family: var(--font-head); font-size: 18px; font-weight: 800; margin-bottom: 4px; }
  .login-card-sub { font-size: 13px; color: var(--text2); margin-bottom: 20px; line-height: 1.5; }
  .login-input { width: 100%; background: var(--surface2); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 14px 16px; color: var(--text); font-family: var(--font-body); font-size: 15px; outline: none; transition: border-color 0.2s; margin-bottom: 10px; }
  .login-input:focus { border-color: var(--accent); }
  .login-input::placeholder { color: var(--text3); }
  .login-error { background: rgba(255,87,112,0.1); border: 1px solid rgba(255,87,112,0.3); border-radius: var(--radius-sm); padding: 10px 14px; font-size: 13px; color: var(--loss); margin-bottom: 10px; }
  .login-toggle { text-align: center; font-size: 13px; color: var(--text2); margin-top: 4px; }
  .login-toggle button { background: none; border: none; color: var(--accent); font-size: 13px; font-weight: 700; cursor: pointer; padding: 0 4px; font-family: var(--font-body); }
  .invite-info { background: rgba(200,255,87,0.06); border: 1px solid rgba(200,255,87,0.15); border-radius: var(--radius-sm); padding: 10px 14px; font-size: 12px; color: var(--text2); line-height: 1.6; margin-bottom: 16px; }
  .invite-info strong { color: var(--accent); font-family: var(--font-head); }
  /* streak cards */
  .streak-row { display: flex; gap: 8px; margin-bottom: 6px; }
  .streak-dot { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; font-family: var(--font-head); flex-shrink: 0; }
  .streak-dot.win { background: rgba(87,255,158,0.2); color: var(--win); }
  .streak-dot.loss { background: rgba(255,87,112,0.15); color: var(--loss); }
  /* date filter pills */
  .date-filter-row { display: flex; gap: 6px; overflow-x: auto; padding-bottom: 4px; margin-bottom: 10px; scrollbar-width: none; }
  .date-filter-row::-webkit-scrollbar { display: none; }
  .date-pill { padding: 5px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; white-space: nowrap; cursor: pointer; border: 1px solid var(--border); background: var(--surface); color: var(--text2); font-family: var(--font-head); transition: all 0.15s; flex-shrink: 0; }
  .date-pill.active { border-color: var(--accent2); background: rgba(87,200,255,0.1); color: var(--accent2); }
  /* freebet checkbox */
  .freebet-toggle { display: flex; align-items: center; gap: 10px; background: rgba(87,200,255,0.06); border: 1px solid rgba(87,200,255,0.2); border-radius: var(--radius-sm); padding: 12px 14px; cursor: pointer; margin-bottom: 14px; user-select: none; }
  .freebet-toggle input { display: none; }
  .freebet-box { width: 18px; height: 18px; border-radius: 5px; border: 2px solid var(--border2); background: var(--surface2); display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.15s; }
  .freebet-box.checked { border-color: var(--accent2); background: var(--accent2); }
  .freebet-toggle-label { font-family: var(--font-head); font-size: 13px; font-weight: 700; color: var(--text2); }
  .freebet-toggle.active .freebet-toggle-label { color: var(--accent2); }
  /* filter-chip (bets tab) */
  .filter-scroll { display: flex; gap: 6px; overflow-x: auto; padding-bottom: 4px; margin-bottom: 14px; scrollbar-width: none; }
  .filter-scroll::-webkit-scrollbar { display: none; }
  .filter-chip { padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 600; white-space: nowrap; cursor: pointer; border: 1px solid var(--border); background: var(--surface); color: var(--text2); font-family: var(--font-head); transition: all 0.2s; flex-shrink: 0; }
  .filter-chip.active { border-color: var(--accent); background: rgba(200,255,87,0.12); color: var(--accent); }
  /* data table */
  .data-table { width: 100%; border-collapse: collapse; font-size: 12px; }
  .data-table th { font-family: var(--font-head); font-size: 10px; font-weight: 700; color: var(--text3); text-transform: uppercase; letter-spacing: 0.5px; padding: 6px 8px; text-align: left; border-bottom: 1px solid var(--border); }
  .data-table td { padding: 8px; border-bottom: 1px solid var(--border); color: var(--text2); vertical-align: middle; }
  .data-table tr:last-child td { border-bottom: none; }
  .data-table .num { font-family: var(--font-head); font-weight: 700; color: var(--text); }
  /* bankroll */
  .bankroll-input-row { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
  .bankroll-input { background: var(--surface2); border: 1px solid var(--border); border-radius: 8px; padding: 6px 10px; color: var(--text); font-family: var(--font-head); font-size: 13px; font-weight: 700; width: 90px; outline: none; text-align: center; }
  .bankroll-input:focus { border-color: var(--accent); }
  /* heatmap sport */
  .heatmap-row { display: flex; align-items: center; gap: 8px; padding: 8px 0; border-bottom: 1px solid var(--border); }
  .heatmap-row:last-child { border-bottom: none; }
  .heatmap-sport { font-family: var(--font-head); font-size: 13px; font-weight: 700; width: 80px; flex-shrink: 0; }
  .heatmap-bar-track { flex: 1; height: 28px; background: var(--surface2); border-radius: 6px; overflow: hidden; position: relative; }
  .heatmap-bar-fill { height: 100%; border-radius: 6px; transition: width 0.8s cubic-bezier(0.16,1,0.3,1); display: flex; align-items: center; padding: 0 10px; }
  .heatmap-bar-text { font-family: var(--font-head); font-size: 11px; font-weight: 800; white-space: nowrap; }
  .heatmap-stats { display: flex; flex-direction: column; align-items: flex-end; flex-shrink: 0; width: 56px; }
  .heatmap-profit { font-family: var(--font-head); font-size: 13px; font-weight: 800; }
  .heatmap-meta { font-size: 10px; color: var(--text3); margin-top: 1px; }
  /* collapsible stat section */
  .stat-section { margin-bottom: 4px; }
  .stat-section-header { display: flex; align-items: center; justify-content: space-between; cursor: pointer; padding: 10px 0 8px; user-select: none; border-bottom: 1px solid var(--border); margin-bottom: 0; }
  .stat-section-header:hover .stat-section-title { color: var(--accent); }
  .stat-section-title { font-family: var(--font-head); font-size: 15px; font-weight: 800; letter-spacing: -0.3px; transition: color 0.15s; }
  .stat-section-arrow { font-size: 11px; color: var(--text3); transition: transform 0.2s; }
  .stat-section-arrow.open { transform: rotate(180deg); }
  .stat-section-body { overflow: hidden; transition: max-height 0.3s ease; }
  .stat-section-body.open { max-height: 2000px; padding-top: 12px; }
  .stat-section-body.closed { max-height: 0; }
  /* tag edit inline */
  .tag-edit-row { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
  .tag-edit-chip { padding: 5px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; font-family: var(--font-head); border: 1.5px solid var(--border); background: var(--surface2); color: var(--text2); cursor: pointer; transition: all 0.15s; }
  .tag-edit-chip.active { border-color: var(--accent); background: rgba(200,255,87,0.12); color: var(--accent); }
  /* multi-upload */
  .multi-upload-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 14px; }
  .multi-thumb { position: relative; border-radius: var(--radius-sm); overflow: hidden; background: var(--surface2); border: 1px solid var(--border); aspect-ratio: 9/16; }
  .multi-thumb img { width: 100%; height: 100%; object-fit: cover; opacity: 0.75; }
  .multi-thumb-badge { position: absolute; top: 6px; left: 6px; background: rgba(10,10,15,0.8); border-radius: 8px; padding: 2px 7px; font-size: 10px; font-weight: 800; font-family: var(--font-head); color: var(--accent); }
  .multi-thumb-remove { position: absolute; top: 5px; right: 5px; width: 22px; height: 22px; border-radius: 50%; background: rgba(255,87,112,0.85); border: none; color: #fff; font-size: 11px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
  .add-more-zone { border: 2px dashed var(--border2); border-radius: var(--radius-sm); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; cursor: pointer; aspect-ratio: 9/16; font-size: 22px; color: var(--text3); position: relative; }
  .add-more-zone input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
  /* step progress */
  .step-progress { display: flex; gap: 6px; margin-bottom: 16px; }
  .step-dot { flex: 1; height: 3px; border-radius: 2px; background: var(--border); transition: background 0.3s; }
  .step-dot.done { background: var(--accent); }
  .step-dot.active { background: var(--accent2); }
  /* manual import */
  .manual-section { margin-bottom: 16px; }
  /* simple stat row */
  .seg-row { display: flex; align-items: center; padding: 9px 0; border-bottom: 1px solid var(--border); gap: 8px; }
  .seg-row:last-child { border-bottom: none; }
  .seg-label { flex: 1; font-size: 13px; font-family: var(--font-head); font-weight: 700; color: var(--text); }
  .seg-count { font-size: 12px; color: var(--text3); min-width: 28px; text-align: center; }
  .seg-rate { font-size: 12px; font-family: var(--font-head); font-weight: 700; min-width: 40px; text-align: center; }
  .seg-profit { font-size: 13px; font-family: var(--font-head); font-weight: 800; min-width: 70px; text-align: right; }
`;

// ─── SUPABASE CONFIG ──────────────────────────────────────────────────────────
const SUPABASE_URL = "https://tpebejuthrbkbjwbdjqz.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwZWJlanV0aHJia2Jqd2JkanF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxMDM4MjEsImV4cCI6MjA4ODY3OTgyMX0.oysT_KLsQhjJmdKSWAwKgqgU0p66Hz0WNNn-1sN19Tk";
const INVITE_CODE = "BETTRACK2026";

const sbHeaders = { "Content-Type": "application/json", "apikey": SUPABASE_ANON, "Authorization": `Bearer ${SUPABASE_ANON}` };

async function sbGet(table, params = "") {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params}`, { headers: { ...sbHeaders, "Prefer": "return=representation" } });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}
async function sbPost(table, body) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, { method: "POST", headers: { ...sbHeaders, "Prefer": "return=representation" }, body: JSON.stringify(body) });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}
async function sbDelete(table, params = "") {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params}`, { method: "DELETE", headers: sbHeaders });
  if (!r.ok) throw new Error(await r.text());
}
async function sbPatch(table, params = "", body = {}) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params}`, { method: "PATCH", headers: { ...sbHeaders, "Prefer": "return=representation" }, body: JSON.stringify(body) });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

// ─── COMPETITION NORMALISATION MAP ───────────────────────────────────────────
const COMP_ALIASES = {
  "UEFA Champions League": "Champions League",
  "UCL": "Champions League",
  "Ligue des Champions": "Champions League",
  "UEFA Europa League": "Europa League",
  "UEL": "Europa League",
  "UEFA Conference League": "Conference League",
  "UECL": "Conference League",
  "English Premier League": "Premier League",
  "EPL": "Premier League",
  "Bundesliga 1": "Bundesliga",
  "1. Bundesliga": "Bundesliga",
  "Serie A TIM": "Serie A",
  "LaLiga": "La Liga",
  "La Liga Santander": "La Liga",
  "Ligue 1 Uber Eats": "Ligue 1",
  "Ligue 1 McDonald's": "Ligue 1",
  "ATP Masters 1000": "ATP Masters",
  "WTA 1000": "WTA",
};
function normalizeCompetition(raw) {
  if (!raw) return raw;
  return COMP_ALIASES[raw] || raw;
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const fmt = (n, d = 2) => (n || 0).toFixed(d);
const fmtEuro = n => `${n >= 0 ? '+' : ''}${fmt(n)}€`;

function normalizePlayerName(raw) {
  if (!raw) return null;
  let s = raw.replace(/\(.*?\)/g, "").trim();
  if (s.toLowerCase().includes(" ou ")) s = s.split(/\s+ou\s+/i)[0].trim();
  const parts = s.split(/\s+/);
  if (parts.length === 1) return parts[0];
  const first = parts[0], rest = parts.slice(1).join(" ");
  if (first.endsWith(".") && first.length <= 3) return `${first}${rest}`;
  if (first.length === 1) return `${first}.${rest}`;
  return `${first[0].toUpperCase()}.${rest}`;
}

// Compute profit for a bet, freebet-aware
function betProfit(bet) {
  if (bet.is_freebet) {
    // Freebet: stake was 0 real money, gain is all profit
    return bet.result === "win" ? bet.actual_win : 0;
  }
  return bet.actual_win - bet.stake;
}

// Stake that counts toward "total misé" (freebets excluded)
function betRealStake(bet) {
  return bet.is_freebet ? 0 : bet.stake;
}

function computeStats(bets) {
  const totalStake = bets.reduce((a, b) => a + betRealStake(b), 0);
  const profit = bets.reduce((a, b) => a + betProfit(b), 0);
  const wins = bets.filter(b => b.result === "win").length;
  const rate = bets.length > 0 ? (wins / bets.length) * 100 : 0;
  const avgOdd = bets.length > 0 ? bets.reduce((a,b)=>a+b.total_odd,0)/bets.length : 0;
  return { totalStake, profit, wins, rate, total: bets.length, avgOdd };
}

function hasScorer(bet) {
  return bet.selections?.some(s => s.selection_type === "buteur" || s.selection_type === "joueur décisif");
}

function getPlayerStats(bets) {
  const map = {};
  bets.forEach(bet => {
    bet.selections?.forEach(sel => {
      if (!sel.player) return;
      const key = sel.player;
      const display = sel.player_display || sel.player;
      if (!map[key]) map[key] = { player: key, display, wins: 0, losses: 0, profit: 0, count: 0 };
      if (display.length > map[key].display.length) map[key].display = display;
      map[key].count++;
      const p = betProfit(bet);
      if (bet.result === "win") { map[key].wins++; map[key].profit += p; }
      else { map[key].losses++; map[key].profit += p; }
    });
  });
  return Object.values(map);
}

// Week key "YYYY-Www"
function weekKey(dateStr) {
  const d = new Date(dateStr);
  const jan1 = new Date(d.getFullYear(), 0, 1);
  const wk = Math.ceil(((d - jan1) / 86400000 + jan1.getDay() + 1) / 7);
  return `${d.getFullYear()}-S${String(wk).padStart(2,"0")}`;
}
function monthKey(dateStr) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;
}

// Date filter helpers
function isToday(dateStr) {
  const today = new Date(); const d = new Date(dateStr);
  return d.toDateString() === today.toDateString();
}
function isThisWeek(dateStr) {
  const now = new Date(); const d = new Date(dateStr);
  const startOfWeek = new Date(now); startOfWeek.setDate(now.getDate() - now.getDay() + 1); startOfWeek.setHours(0,0,0,0);
  return d >= startOfWeek && d <= now;
}
function isThisMonth(dateStr) {
  const now = new Date(); const d = new Date(dateStr);
  return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
}

// Streak analysis: last N bets in chronological order
function getStreaks(bets) {
  const sorted = [...bets].sort((a,b)=>new Date(a.date)-new Date(b.date));
  const results = sorted.map(b => b.result); // "win"|"loss"
  // Current streak
  let cur = 1;
  for (let i = results.length-1; i > 0; i--) {
    if (results[i] === results[i-1]) cur++; else break;
  }
  const curType = results[results.length-1];
  // Best win streak
  let bestWin = 0, bestLoss = 0, tmp = 1;
  for (let i = 1; i < results.length; i++) {
    if (results[i] === results[i-1]) tmp++;
    else tmp = 1;
    if (results[i] === "win" && tmp > bestWin) bestWin = tmp;
    if (results[i] === "loss" && tmp > bestLoss) bestLoss = tmp;
  }
  if (results.length > 0) {
    if (results[0] === "win" && 1 > bestWin) bestWin = 1;
    if (results[0] === "loss" && 1 > bestLoss) bestLoss = 1;
  }
  const last10 = sorted.slice(-10).map(b => b.result);
  return { current: cur, currentType: curType, bestWin, bestLoss, last10 };
}

// Normalize a raw selection_type into one of: résultat | buteur | score exact | autre
function normalizeSelType(raw) {
  if (!raw) return "autre";
  const r = raw.toLowerCase();
  if (r.includes("buteur") || r.includes("joueur décisif") || r.includes("marquer") || r.includes("scorer")) return "buteur";
  if (r.includes("score exact") || r.includes("score précis") || r.includes("correct score")) return "score exact";
  if (r.includes("résultat") || r.includes("victoire") || r.includes("nul") || r.includes("gagnant") || r.includes("1x2") || r.includes("vainqueur") || r.includes("mi-temps") || r.includes("double chance") || r.includes("nombre de points") || r.includes("plus de") || r.includes("moins de") || r.includes("paliers") || r.includes("rebonds") || r.includes("passes")) return "résultat";
  return "autre";
}

// Format a monthKey "YYYY-MM" into "janv-23"
const MONTH_SHORT = ["janv","févr","mars","avr","mai","juin","juil","août","sept","oct","nov","déc"];
function fmtMonthLabel(key) {
  const [y, m] = key.split("-");
  return `${MONTH_SHORT[parseInt(m,10)-1]}-${y.slice(2)}`;
}

// Get all individual selections across all bets (expanded)
function getAllSelections(bets) {
  const result = [];
  bets.forEach(bet => {
    (bet.selections || []).forEach(sel => {
      result.push({ ...sel, _bet: bet, _selType: normalizeSelType(sel.selection_type), _competition: bet.competition || "" });
    });
  });
  return result;
}

// Stats on a set of selections grouped by a key
function getSelGroupStats(selections, keyFn) {
  const map = {};
  selections.forEach(sel => {
    const k = keyFn(sel) || "—";
    if (!map[k]) map[k] = { label: k, total: 0, wins: 0 };
    map[k].total++;
    if (sel._bet.result === "win") map[k].wins++;
  });
  return Object.values(map).map(g => ({ ...g, rate: g.total > 0 ? (g.wins/g.total)*100 : 0 })).sort((a,b)=>b.total-a.total);
}

// Odd range buckets
function getOddRangeStats(bets) {
  const ranges = [
    { label: "1.0 – 1.5", min: 1, max: 1.5 },
    { label: "1.5 – 2.0", min: 1.5, max: 2 },
    { label: "2.0 – 3.0", min: 2, max: 3 },
    { label: "3.0+", min: 3, max: 9999 },
  ];
  return ranges.map(r => {
    const sub = bets.filter(b => b.total_odd > r.min && b.total_odd <= r.max);
    const s = computeStats(sub);
    return { ...r, count: sub.length, profit: s.profit, wins: s.wins, rate: s.rate };
  }).filter(r => r.count > 0);
}

// ─── API ─────────────────────────────────────────────────────────────────────
const API_ENDPOINT = "/api/claude";

async function callClaude(system, userMsg, maxTokens = 1000) {
  const r = await fetch(API_ENDPOINT, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: maxTokens, system, messages: [{ role: "user", content: userMsg }] })
  });
  const data = await r.json();
  return data.content?.find(b => b.type === "text")?.text || "";
}

async function analyzeScreenshot(base64, mimeType) {
  const r = await fetch(API_ENDPOINT, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001", max_tokens: 1400,
      system: `Tu extrais les données d'UN SEUL pari depuis une capture d'écran Winamax/Betclic.

━━━ RÈGLE 1 — QUEL PARI CHOISIR ━━━
L'image peut contenir plusieurs paris. Tu dois identifier et extraire
LE PARI LE PLUS COMPLET : statut visible, au moins une sélection, mise, gains, référence.

━━━ RÈGLE 2 — RÉSULTAT ━━━
1. Label texte coloré : "Gagné" (fond vert) → "win" ; "Perdu" (fond rouge) → "loss"
2. Barre de progression : entièrement verte = win ; rouge présent = loss
3. Gains > 0 → "win" ; Gains = 0,00 € → "loss"

━━━ RÈGLE 3 — FREEBET ━━━
Si tu vois les mots "freebet", "pari gratuit", "free bet" dans l'image : is_freebet = true

━━━ RÈGLE 4 — "NON" dans les sélections ━━━
Si une sélection affiche "Non" : inclus-le dans selection_type ET mets negated:true.

━━━ RÈGLE 5 — JOUEURS ━━━
- "player" : format "I.Nom" (ex: "Bradley Barcola" → "B.Barcola")
- "player_display" : nom complet tel qu'il apparaît

━━━ RÈGLE 6 — COTE MYMATCH ━━━
Pour les paris MyMatch : le badge numérique bleu (ex: 10, 42, 67) est le NUMÉRO DE SÉLECTION MyMatch, PAS la cote.
La cote totale est le multiplicateur flottant (ex: 3.50, 10.25). Si elle n'est pas visible, mets null.

━━━ RÈGLE 7 — TYPE DE SÉLECTION ━━━
Pour chaque sélection, ajoute un champ "sel_type" parmi : "résultat" | "buteur" | "score exact" | "autre"
- résultat : victoire équipe, nul, 1X2, double chance, nombre de points/rebonds/passes (joueur stats)
- buteur : marquer un but, joueur décisif, scorer
- score exact : score précis du match

━━━ FORMAT JSON ━━━
JSON valide sans backticks :
{
  "bet_ref": "référence exacte",
  "sport": "Football",
  "bookmaker": "Winamax",
  "competition": "",
  "date": "YYYY-MM-DD",
  "heure": "HH:MM",
  "team_1": "",
  "team_2": "",
  "bet_structure": "simple|combiné|mymatch",
  "bet_category": "team|player|goals|combo",
  "total_odd": 1.5,
  "stake": 10.0,
  "actual_win": 0.0,
  "result": "win|loss",
  "is_freebet": false,
  "selections": [{"team":"","player":"B.Barcola","player_display":"Bradley Barcola","selection_type":"joueur décisif","sel_type":"buteur","odd":1.38,"negated":false}]
}`,
      messages: [{ role: "user", content: [
        { type: "image", source: { type: "base64", media_type: mimeType, data: base64 } },
        { type: "text", text: "Extrais le pari le plus complet visible sur cette image." }
      ]}]
    })
  });
  const data = await r.json();
  const text = (data.content?.find(b => b.type === "text")?.text || "");
  const raw = extractJSON(text);
  // Normalize competition
  if (raw.competition) raw.competition = normalizeCompetition(raw.competition);
  // Post-process selections
  if (raw.selections) {
    raw.selections = raw.selections.map(sel => {
      if (sel.player && !sel.player.match(/^[A-Za-zÀ-ÿ]\./)) {
        sel.player_display = sel.player_display || sel.player;
        sel.player = normalizePlayerName(sel.player);
      }
      if (sel.negated && !sel.selection_type?.includes("— Non")) {
        sel.selection_type = (sel.selection_type || "") + " — Non";
      }
      // Normalize sel_type if not already set by AI
      if (!sel.sel_type) sel.sel_type = normalizeSelType(sel.selection_type);
      return sel;
    });
  }
  return raw;
}

// Analyse several screenshots and merge duplicates (same bet split across 2 images)
async function analyzeMultipleScreenshots(files) {
  const results = [];
  for (const file of files) {
    const b64 = await new Promise((res,rej) => { const r=new FileReader(); r.onload=()=>res(r.result.split(",")[1]); r.onerror=rej; r.readAsDataURL(file); });
    try {
      const data = await analyzeScreenshot(b64, file.type);
      results.push({ data, file, previewUrl: URL.createObjectURL(file), ok: true });
    } catch(e) {
      results.push({ data: null, file, previewUrl: URL.createObjectURL(file), ok: false, error: e.message });
    }
  }
  // Merge bets that are the same (same bet_ref, or same match+date with one missing ref)
  const merged = [];
  const used = new Set();
  for (let i = 0; i < results.length; i++) {
    if (used.has(i) || !results[i].ok) { if (!results[i].ok) merged.push(results[i]); continue; }
    let base = { ...results[i] };
    for (let j = i+1; j < results.length; j++) {
      if (used.has(j) || !results[j].ok) continue;
      const a = base.data, b = results[j].data;
      const sameRef = a.bet_ref && b.bet_ref && a.bet_ref === b.bet_ref;
      const sameMatch = a.team_1 && b.team_1 && a.team_1 === b.team_1 && a.team_2 === b.team_2 && a.date === b.date;
      if (sameRef || sameMatch) {
        // Merge: keep most complete version
        const merged_data = { ...a };
        if (!merged_data.bet_ref && b.bet_ref) merged_data.bet_ref = b.bet_ref;
        if ((!merged_data.selections || merged_data.selections.length === 0) && b.selections?.length > 0) merged_data.selections = b.selections;
        if (merged_data.selections && b.selections && b.selections.length > merged_data.selections.length) merged_data.selections = b.selections;
        if (!merged_data.total_odd && b.total_odd) merged_data.total_odd = b.total_odd;
        if (!merged_data.stake && b.stake) merged_data.stake = b.stake;
        if (!merged_data.actual_win && b.actual_win) merged_data.actual_win = b.actual_win;
        base = { ...base, data: merged_data, merged: true };
        used.add(j);
      }
    }
    used.add(i);
    merged.push(base);
  }
  return merged;
}

function extractJSON(text) {
  let s = text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
  try { return JSON.parse(s); } catch {}
  const start = s.indexOf("{");
  if (start === -1) throw new Error("No JSON object found in response");
  let depth = 0, inStr = false, escape = false;
  for (let i = start; i < s.length; i++) {
    const c = s[i];
    if (escape) { escape = false; continue; }
    if (c === "\\" && inStr) { escape = true; continue; }
    if (c === '"') { inStr = !inStr; continue; }
    if (inStr) continue;
    if (c === "{") depth++;
    else if (c === "}") { depth--; if (depth === 0) { return JSON.parse(s.slice(start, i + 1)); } }
  }
  throw new Error("Could not find complete JSON object");
}

async function detectCompetition(team1, team2, date) {
  const r = await fetch(API_ENDPOINT, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001", max_tokens: 400,
      system: `Tu identifies la compétition d'un match sportif.
Réponds UNIQUEMENT avec un JSON valide sans backticks: {"competition":"nom exact officiel","type":"championnat|coupe_nationale|ligue_champions|europa_league|conference_league|amical|autre","confidence":"high|medium|low"}`,
      tools: [{ type: "web_search_20250305", name: "web_search" }],
      messages: [{ role: "user", content: `Dans quelle compétition s'est joué "${team1} vs ${team2}" autour du ${date || "2025"} ? JSON uniquement.` }]
    })
  });
  const data = await r.json();
  const textBlock = data.content?.filter(b => b.type === "text").pop();
  const text = textBlock?.text || "";
  try {
    const result = extractJSON(text);
    if (result.competition) result.competition = normalizeCompetition(result.competition);
    return result;
  } catch {
    return { competition: "", type: "autre", confidence: "low" };
  }
}

async function runAIAnalysis(bets) {
  const stats = computeStats(bets);
  const byStruct = {};
  ["simple","combiné","mymatch"].forEach(s => { byStruct[s] = computeStats(bets.filter(b=>b.bet_structure===s)); });
  const players = getPlayerStats(bets);
  const oddRanges = getOddRangeStats(bets);
  const streaks = getStreaks(bets);
  const payload = {
    totalBets: bets.length, winRate: stats.rate, profit: stats.profit,
    totalStake: stats.totalStake, avgOdd: stats.avgOdd,
    byStructure: byStruct,
    oddRanges: oddRanges.map(r=>({range:r.label,count:r.count,profit:r.profit,rate:r.rate})),
    streak: { current: streaks.current, type: streaks.currentType, bestWin: streaks.bestWin },
    freebetCount: bets.filter(b=>b.is_freebet).length,
    tags: [...new Set(bets.map(b=>b.tag))].map(t=>({ tag:t, ...computeStats(bets.filter(b=>b.tag===t)) })),
    topPlayers: players.sort((a,b)=>b.profit-a.profit).slice(0,3),
    bets: bets.map(b=>({ date:b.date, match:`${b.team_1} vs ${b.team_2}`, struct:b.bet_structure, odd:b.total_odd, stake:b.stake, win:b.actual_win, result:b.result, tag:b.tag, freebet:b.is_freebet }))
  };
  return callClaude(
    `Tu es un analyste expert en paris sportifs. Analyse les données et fournis une analyse personnalisée, directe et actionnable en français. Structure : 1) Profil de parieur, 2) Ce qui marche, 3) Ce qui ne marche pas, 4) Recommandations concrètes.`,
    `Voici mes données:\n${JSON.stringify(payload, null, 2)}`, 1000
  );
}

// ─── BET DETAIL MODAL ────────────────────────────────────────────────────────
function BetDetailModal({ bet, onClose, onDelete, onUpdate, allTags }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editingTag, setEditingTag] = useState(false);
  const [newTag, setNewTag] = useState(bet.tag || "SAFE");
  const [customTagInput, setCustomTagInput] = useState("");
  const [savingTag, setSavingTag] = useState(false);
  const profit = betProfit(bet);
  const isCombo = bet.bet_structure === "combiné" || bet.bet_structure === "mymatch";
  const tagColor = bet.tag === "SAFE" ? "var(--safe)" : bet.tag === "FUN" ? "var(--fun)" : "var(--accent2)";

  const handleSaveTag = async () => {
    if (!onUpdate) return;
    setSavingTag(true);
    const finalTag = customTagInput.trim() ? customTagInput.trim().toUpperCase() : newTag;
    await onUpdate(bet.id, { tag: finalTag });
    setEditingTag(false); setSavingTag(false); setCustomTagInput("");
  };

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-sheet">
        <div className="modal-handle" />
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-header">
          <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:8 }}>
            <div className={`result-chip ${bet.result==='win'?'result-win':'result-loss'}`}>{bet.result==='win'?'🏆 Gagné':'❌ Perdu'}</div>
            <span onClick={()=>setEditingTag(t=>!t)} style={{padding:'5px 10px',borderRadius:20,border:`1px solid ${tagColor}33`,background:`${tagColor}18`,fontSize:11,fontWeight:700,fontFamily:'var(--font-head)',color:tagColor,cursor:'pointer',display:'flex',alignItems:'center',gap:4}}>
              {bet.tag} <span style={{fontSize:9,opacity:0.7}}>✎</span>
            </span>
            {bet.is_freebet && <span className="freebet-tag">🎁 Freebet</span>}
            {hasScorer(bet) && <span style={{padding:'5px 10px',borderRadius:20,border:'1px solid rgba(212,170,255,0.3)',background:'rgba(212,170,255,0.1)',fontSize:11,fontWeight:700,fontFamily:'var(--font-head)',color:'var(--scorer)'}}>⚽ Buteur</span>}
          </div>
          {editingTag && (
            <div style={{background:'var(--surface2)',border:'1px solid var(--border)',borderRadius:'var(--radius-sm)',padding:'12px',marginBottom:10}}>
              <div style={{fontSize:11,color:'var(--text2)',fontWeight:600,marginBottom:8,textTransform:'uppercase',letterSpacing:'0.5px'}}>Modifier la catégorie</div>
              <div className="tag-edit-row">
                {["SAFE","FUN",...(allTags||[]).filter(t=>t!=="SAFE"&&t!=="FUN")].map(t=>(
                  <button key={t} className={`tag-edit-chip ${newTag===t&&!customTagInput?'active':''}`} onClick={()=>{setNewTag(t);setCustomTagInput("");}}>{t}</button>
                ))}
              </div>
              <input className="field-input" style={{marginTop:8,fontSize:12,padding:'7px 10px'}} placeholder="Nouvelle catégorie…" value={customTagInput} onChange={e=>setCustomTagInput(e.target.value.toUpperCase())} />
              <div style={{display:'flex',gap:6,marginTop:8}}>
                <button onClick={handleSaveTag} disabled={savingTag} style={{flex:1,padding:'8px',background:'var(--accent)',color:'#0a0a0f',border:'none',borderRadius:8,fontSize:12,fontWeight:800,cursor:'pointer',fontFamily:'var(--font-head)'}}>
                  {savingTag?"…":"✓ Enregistrer"}
                </button>
                <button onClick={()=>{setEditingTag(false);setCustomTagInput("");}} style={{flex:1,padding:'8px',background:'var(--surface)',border:'1px solid var(--border)',borderRadius:8,color:'var(--text2)',fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'var(--font-head)'}}>Annuler</button>
              </div>
            </div>
          )}
          <div className="modal-title">{bet.team_1} vs {bet.team_2}</div>
          <div className="modal-sub">{bet.competition} · {bet.date} à {bet.heure} · {bet.bookmaker}</div>
        </div>
        <div className="modal-body">
          <div className="detail-section">
            <div className="detail-section-title">Financier</div>
            <div className="detail-grid">
              <div className="detail-item"><div className="detail-item-label">Cote totale</div><div className="detail-item-value" style={{color:'var(--accent)'}}>×{fmt(bet.total_odd)}</div></div>
              <div className="detail-item"><div className="detail-item-label">{bet.is_freebet ? "Freebet (valeur)" : "Mise"}</div><div className="detail-item-value">{fmt(bet.stake)}€{bet.is_freebet && <span style={{fontSize:10,color:'var(--accent2)',marginLeft:4}}>gratuit</span>}</div></div>
              <div className="detail-item"><div className="detail-item-label">Gain brut</div><div className="detail-item-value">{fmt(bet.actual_win)}€</div></div>
              <div className="detail-item"><div className="detail-item-label">Profit net</div><div className="detail-item-value" style={{color:profit>=0?'var(--win)':'var(--loss)'}}>{fmtEuro(profit)}</div></div>
            </div>
          </div>
          {bet.selections?.length > 0 && (
            <div className="detail-section">
              <div className="detail-section-title">{isCombo ? `${bet.selections.length} sélections` : "Sélection"}</div>
              {bet.selections.map((sel, i) => {
                const isNeg = sel.negated || sel.selection_type?.includes("— Non");
                return (
                  <div key={i} className="selection-detail" style={isNeg?{borderColor:'rgba(255,153,87,0.3)',background:'rgba(255,153,87,0.04)'}:{}}>
                    <div className="sel-top">
                      <div style={{flex:1}}>
                        <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:3,flexWrap:'wrap'}}>
                          <div className="sel-team">{sel.team}</div>
                          {isNeg && <span style={{background:'rgba(255,153,87,0.15)',color:'var(--fun)',border:'1px solid rgba(255,153,87,0.35)',borderRadius:5,fontSize:10,fontWeight:800,padding:'1px 6px',fontFamily:'var(--font-head)'}}>NON ↩</span>}
                          {sel.sel_type && sel.sel_type !== "autre" && <span style={{background:'rgba(87,200,255,0.1)',border:'1px solid rgba(87,200,255,0.2)',color:'var(--accent2)',borderRadius:5,fontSize:10,fontWeight:700,padding:'1px 6px',fontFamily:'var(--font-head)'}}>{sel.sel_type}</span>}
                        </div>
                        <div className="sel-type">{sel.selection_type}</div>
                        {sel.player && <div style={{marginTop:5}}><span className="scorer-tag">⚽ {sel.player_display||sel.player}</span></div>}
                      </div>
                      <div className="sel-odd-big">×{fmt(sel.odd)}</div>
                    </div>
                  </div>
                );
              })}
              {isCombo && (
                <div className="combo-total">
                  <span style={{fontSize:12,color:'var(--text2)'}}>Cote combinée</span>
                  <span style={{fontFamily:'var(--font-head)',fontSize:20,fontWeight:800,color:'var(--accent)'}}>×{fmt(bet.total_odd)}</span>
                </div>
              )}
            </div>
          )}
          {bet.bet_ref && (
            <div style={{display:'flex',alignItems:'center',gap:8,paddingTop:12,borderTop:'1px solid var(--border)',marginTop:4}}>
              <span style={{fontSize:10,color:'var(--text3)',textTransform:'uppercase',letterSpacing:'0.5px',fontWeight:600}}>Réf. bookmaker</span>
              <span style={{fontFamily:'var(--font-head)',fontSize:12,fontWeight:700,color:'var(--text3)'}}>{bet.bet_ref}</span>
            </div>
          )}
          {onDelete && (
            <div style={{marginTop:16,paddingTop:14,borderTop:'1px solid var(--border)'}}>
              {!confirmDelete ? (
                <button onClick={()=>setConfirmDelete(true)} style={{width:'100%',padding:'11px',background:'rgba(255,87,112,0.08)',border:'1px solid rgba(255,87,112,0.25)',borderRadius:'var(--radius-sm)',color:'var(--loss)',fontSize:13,fontFamily:'var(--font-head)',fontWeight:700,cursor:'pointer',letterSpacing:'0.3px'}}>
                  🗑 Supprimer ce pari
                </button>
              ) : (
                <div style={{background:'rgba(255,87,112,0.1)',border:'1px solid rgba(255,87,112,0.3)',borderRadius:'var(--radius-sm)',padding:'12px'}}>
                  <div style={{fontSize:13,color:'var(--text)',textAlign:'center',marginBottom:10,fontWeight:500}}>Supprimer définitivement ce pari ?</div>
                  <div style={{display:'flex',gap:8}}>
                    <button onClick={()=>setConfirmDelete(false)} style={{flex:1,padding:'9px',background:'var(--surface2)',border:'1px solid var(--border)',borderRadius:8,color:'var(--text2)',fontSize:13,fontFamily:'var(--font-head)',fontWeight:700,cursor:'pointer'}}>Annuler</button>
                    <button onClick={()=>onDelete(bet.id)} style={{flex:1,padding:'9px',background:'var(--loss)',border:'none',borderRadius:8,color:'#0a0a0f',fontSize:13,fontFamily:'var(--font-head)',fontWeight:800,cursor:'pointer'}}>Confirmer</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── MANUAL IMPORT FORM ───────────────────────────────────────────────────────
function ManualImportForm({ bets, addBet, existingTags, onDone, onCancel }) {
  const today = new Date().toISOString().split("T")[0];
  const [d, setD] = useState({
    sport: "", bookmaker: "Winamax", competition: "", team_1: "", team_2: "",
    date: today, heure: "", bet_structure: "simple", result: "win",
    total_odd: "", stake: "", actual_win: "", tag: "SAFE", customTag: "", is_freebet: false,
    bet_ref: ""
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const upd = (k,v) => setD(p => ({...p, [k]:v}));
  const finalTag = d.customTag.trim() ? d.customTag.trim().toUpperCase() : d.tag;

  const handleSave = async () => {
    if (!d.sport || !d.total_odd || !d.stake || !d.result) { setError("Remplis au moins : sport, cote, mise, résultat."); return; }
    setSaving(true);
    try {
      const actualWin = d.actual_win !== "" ? parseFloat(d.actual_win) : (d.result==="win" ? parseFloat(d.stake)*parseFloat(d.total_odd) : 0);
      await addBet({ ...d, tag: finalTag, total_odd: parseFloat(d.total_odd), stake: parseFloat(d.stake), actual_win: actualWin, selections: [], bet_ref: d.bet_ref||null });
      onDone();
    } catch(e) { setError("Erreur : " + (e.message||"")); }
    setSaving(false);
  };
  return (
    <div>
      <div className="validation-title" style={{marginBottom:16}}>✏️ Import manuel</div>
      <div className="card">
        <div className="card-title">Match</div>
        <div className="field-row">
          <div className="field-group"><div className="field-label">Sport</div><input className="field-input" value={d.sport} onChange={e=>upd("sport",e.target.value)} placeholder="Football" /></div>
          <div className="field-group"><div className="field-label">Bookmaker</div><select className="field-input" value={d.bookmaker} onChange={e=>upd("bookmaker",e.target.value)}><option>Winamax</option><option>Betclic</option></select></div>
        </div>
        <div className="field-group"><div className="field-label">Compétition</div><input className="field-input" value={d.competition} onChange={e=>upd("competition",e.target.value)} placeholder="Ligue 1" /></div>
        <div className="field-row">
          <div className="field-group"><div className="field-label">Équipe 1</div><input className="field-input" value={d.team_1} onChange={e=>upd("team_1",e.target.value)} /></div>
          <div className="field-group"><div className="field-label">Équipe 2</div><input className="field-input" value={d.team_2} onChange={e=>upd("team_2",e.target.value)} /></div>
        </div>
        <div className="field-row">
          <div className="field-group"><div className="field-label">Date</div><input className="field-input" type="date" value={d.date} onChange={e=>upd("date",e.target.value)} /></div>
          <div className="field-group"><div className="field-label">Heure</div><input className="field-input" value={d.heure} onChange={e=>upd("heure",e.target.value)} placeholder="20:45" /></div>
        </div>
        <div className="field-group"><div className="field-label">Référence (optionnel)</div><input className="field-input" value={d.bet_ref} onChange={e=>upd("bet_ref",e.target.value)} /></div>
      </div>
      <div className="card">
        <div className="card-title">Paris</div>
        <div className="field-row">
          <div className="field-group"><div className="field-label">Structure</div><select className="field-input" value={d.bet_structure} onChange={e=>upd("bet_structure",e.target.value)}><option value="simple">Simple</option><option value="combiné">Combiné</option><option value="mymatch">MyMatch</option></select></div>
          <div className="field-group"><div className="field-label">Résultat</div><select className="field-input" value={d.result} onChange={e=>upd("result",e.target.value)}><option value="win">Gagné</option><option value="loss">Perdu</option></select></div>
        </div>
        <div className="field-row">
          <div className="field-group"><div className="field-label">Cote</div><input className="field-input" type="number" step="0.01" value={d.total_odd} onChange={e=>upd("total_odd",e.target.value)} /></div>
          <div className="field-group"><div className="field-label">Mise (€)</div><input className="field-input" type="number" step="0.5" value={d.stake} onChange={e=>upd("stake",e.target.value)} /></div>
        </div>
        <div className="field-group"><div className="field-label">Gain réel (€) <span style={{color:'var(--text3)',fontWeight:400}}>auto si vide</span></div><input className="field-input" type="number" step="0.01" value={d.actual_win} onChange={e=>upd("actual_win",e.target.value)} /></div>
        <label className={`freebet-toggle ${d.is_freebet?'active':''}`} onClick={()=>upd("is_freebet",!d.is_freebet)}>
          <div className={`freebet-box ${d.is_freebet?'checked':''}`}>{d.is_freebet && <span style={{color:'#0a0a0f',fontSize:11,fontWeight:800}}>✓</span>}</div>
          <div><div className="freebet-toggle-label">🎁 Freebet</div></div>
        </label>
      </div>
      <div className="card">
        <div className="card-title">Catégorie</div>
        <div className="tag-selector">
          {["SAFE","FUN",...existingTags].map(t => <button key={t} className={`tag-btn ${d.tag===t&&!d.customTag?'selected':''}`} onClick={()=>upd("tag",t)}>{t}</button>)}
        </div>
        <input className="field-input" placeholder="Nouvelle catégorie…" value={d.customTag} onChange={e=>upd("customTag",e.target.value.toUpperCase())} />
      </div>
      {error && <div className="error-msg">❌ {error}</div>}
      <button className="btn-primary" onClick={handleSave} disabled={saving}>{saving?"Enregistrement…":"Enregistrer"}</button>
      <button className="btn-secondary" onClick={onCancel}>Annuler</button>
    </div>
  );
}

// ─── UPLOAD TAB ───────────────────────────────────────────────────────────────
function UploadTab({ setBets, addBet, bets, updateBet }) {
  const [mode, setMode] = useState("idle"); // idle | multi | manual
  // Multi-screenshot state
  const [files, setFiles] = useState([]); // [{file, previewUrl}]
  const [analyzing, setAnalyzing] = useState(false);
  const [queue, setQueue] = useState([]); // [{data, previewUrl, merged, ok, error}]
  const [queueIdx, setQueueIdx] = useState(0);
  // Per-item validation state
  const [extracted, setExtracted] = useState(null);
  const [tag, setTag] = useState("SAFE");
  const [customTag, setCustomTag] = useState("");
  const [isFreebet, setIsFreebet] = useState(false);
  const [compDetect, setCompDetect] = useState(null);
  const [detectingComp, setDetectingComp] = useState(false);
  const [dupWarning, setDupWarning] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const [error, setError] = useState("");
  const fileRef = useRef();
  const addFileRef = useRef();

  const existingTags = [...new Set(bets.map(b=>b.tag).filter(t=>t && t!=="SAFE" && t!=="FUN"))];

  // ── File management ──────────────────────────────────────────────────────────
  const addFiles = (newFiles) => {
    const arr = Array.from(newFiles).filter(f => f.type.startsWith("image/"));
    setFiles(prev => {
      const combined = [...prev, ...arr.map(f => ({ file: f, previewUrl: URL.createObjectURL(f) }))];
      return combined.slice(0, 5);
    });
  };

  const removeFile = (idx) => setFiles(prev => prev.filter((_,i) => i !== idx));

  // ── Analyse ──────────────────────────────────────────────────────────────────
  const handleAnalyze = async () => {
    if (files.length === 0) return;
    setAnalyzing(true); setError("");
    try {
      const results = await analyzeMultipleScreenshots(files.map(f=>f.file));
      setQueue(results);
      setQueueIdx(0);
      loadQueueItem(results, 0);
      setMode("multi");
    } catch(e) { setError("Erreur d'analyse : " + e.message); }
    setAnalyzing(false);
  };

  const loadQueueItem = (q, idx) => {
    const item = q[idx];
    if (!item || !item.ok) return;
    const data = item.data;
    setExtracted(data);
    setIsFreebet(!!data.is_freebet);
    setTag("SAFE"); setCustomTag(""); setCompDetect(null);
    const isDup = data.bet_ref && bets.some(b => b.bet_ref === data.bet_ref);
    setDupWarning(isDup);
    if (data.team_1 && data.team_2) {
      setDetectingComp(true);
      detectCompetition(data.team_1, data.team_2, data.date).then(comp => {
        setCompDetect(comp);
        setExtracted(prev => prev ? ({ ...prev, competition: normalizeCompetition(comp.competition) }) : prev);
      }).catch(()=>{}).finally(() => setDetectingComp(false));
    }
  };

  const upd = (k,v) => setExtracted(p => p ? ({...p, [k]:v}) : p);

  const handleConfirm = async (force=false) => {
    if (!force && dupWarning) return;
    setSaving(true);
    const finalTag = customTag.trim() ? customTag.trim().toUpperCase() : tag;
    try {
      await addBet({ ...extracted, tag: finalTag, is_freebet: isFreebet });
      setSavedCount(c => c+1);
      const nextIdx = queueIdx + 1;
      if (nextIdx < queue.length) {
        setQueueIdx(nextIdx);
        loadQueueItem(queue, nextIdx);
      } else {
        setMode("done");
      }
    } catch(e) { setError("Erreur d'enregistrement : " + (e.message||"")); }
    setSaving(false);
  };

  const handleSkip = () => {
    const nextIdx = queueIdx + 1;
    if (nextIdx < queue.length) { setQueueIdx(nextIdx); loadQueueItem(queue, nextIdx); }
    else setMode("done");
  };

  const reset = () => {
    setMode("idle"); setFiles([]); setQueue([]); setQueueIdx(0); setExtracted(null);
    setTag("SAFE"); setCustomTag(""); setIsFreebet(false); setCompDetect(null);
    setDetectingComp(false); setDupWarning(false); setSaving(false); setSavedCount(0); setError("");
    if(fileRef.current) fileRef.current.value="";
  };

  // ── Render: DONE ─────────────────────────────────────────────────────────────
  if (mode === "done") return (
    <div className="success-screen">
      <div className="success-icon">✅</div>
      <div className="success-title">{savedCount} pari{savedCount>1?"s":""} enregistré{savedCount>1?"s":""}!</div>
      <div className="success-sub">Dashboard et insights mis à jour.</div>
      <button className="btn-primary" style={{marginTop:24,maxWidth:240}} onClick={reset}>Importer d'autres paris</button>
    </div>
  );

  // ── Render: ANALYZING ─────────────────────────────────────────────────────────
  if (analyzing) return (
    <div style={{textAlign:'center',padding:'60px 0'}}>
      <div className="spinner" style={{margin:'0 auto 16px',width:48,height:48}}/>
      <div className="analyzing-text">Analyse de {files.length} capture{files.length>1?"s":""}…</div>
      <div className="analyzing-sub">Extraction IA des données</div>
    </div>
  );

  // ── Render: VALIDATING queue item ─────────────────────────────────────────────
  if (mode === "multi" && queue.length > 0 && extracted) {
    const currentItem = queue[queueIdx];
    return (
      <div>
        {/* Step progress */}
        <div className="step-progress">
          {queue.map((_,i) => <div key={i} className={`step-dot ${i<queueIdx?'done':i===queueIdx?'active':''}`}/>)}
        </div>
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14}}>
          <div className="validation-title">Pari {queueIdx+1}/{queue.length}</div>
          {currentItem.merged && <span style={{background:'rgba(87,200,255,0.12)',border:'1px solid rgba(87,200,255,0.3)',borderRadius:8,padding:'3px 8px',fontSize:10,fontWeight:700,color:'var(--accent2)',fontFamily:'var(--font-head)'}}>🔗 Fusionné</span>}
          <div className={`result-chip ${extracted.result==='win'?'result-win':'result-loss'}`} style={{marginLeft:'auto'}}>{extracted.result==='win'?'🏆 Gagné':'❌ Perdu'}</div>
        </div>

        {currentItem.previewUrl && <div className="image-preview-wrap" style={{maxHeight:180,overflow:'hidden'}}><img src={currentItem.previewUrl} alt="" /></div>}

        {dupWarning && (
          <div style={{background:'rgba(255,153,87,0.1)',border:'1px solid rgba(255,153,87,0.35)',borderRadius:'var(--radius-sm)',padding:'12px',marginBottom:12}}>
            <div style={{fontFamily:'var(--font-head)',fontSize:13,fontWeight:700,color:'var(--fun)',marginBottom:6}}>⚠️ Référence déjà enregistrée</div>
            <div style={{display:'flex',gap:8}}>
              <button onClick={()=>handleConfirm(true)} disabled={saving} style={{flex:1,padding:'8px',background:'rgba(255,153,87,0.15)',border:'1px solid rgba(255,153,87,0.4)',borderRadius:8,color:'var(--fun)',fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'var(--font-head)'}}>Enregistrer quand même</button>
              <button onClick={handleSkip} style={{flex:1,padding:'8px',background:'var(--surface2)',border:'1px solid var(--border)',borderRadius:8,color:'var(--text2)',fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'var(--font-head)'}}>Ignorer</button>
            </div>
          </div>
        )}

        {(detectingComp || compDetect) && (
          <div className="competition-detect">
            <div className="competition-detect-icon">{detectingComp?'🔍':'🏆'}</div>
            <div>{detectingComp ? <div style={{fontSize:12,color:'var(--accent2)'}}>Recherche…</div> : <><div className="competition-detect-label">Compétition détectée</div><div className="competition-detect-name">{compDetect.competition}</div></>}</div>
          </div>
        )}

        <div className="card">
          <div className="card-title">Informations générales</div>
          <div className="field-row">
            <div className="field-group"><div className="field-label">Sport</div><input className="field-input" value={extracted.sport||""} onChange={e=>upd("sport",e.target.value)} /></div>
            <div className="field-group"><div className="field-label">Bookmaker</div><select className="field-input" value={extracted.bookmaker||""} onChange={e=>upd("bookmaker",e.target.value)}><option>Winamax</option><option>Betclic</option></select></div>
          </div>
          <div className="field-group"><div className="field-label">Compétition</div><input className="field-input" value={extracted.competition||""} onChange={e=>upd("competition",normalizeCompetition(e.target.value))} /></div>
          <div className="field-row">
            <div className="field-group"><div className="field-label">Équipe 1</div><input className="field-input" value={extracted.team_1||""} onChange={e=>upd("team_1",e.target.value)} /></div>
            <div className="field-group"><div className="field-label">Équipe 2</div><input className="field-input" value={extracted.team_2||""} onChange={e=>upd("team_2",e.target.value)} /></div>
          </div>
          <div className="field-row">
            <div className="field-group"><div className="field-label">Date</div><input className="field-input" type="date" value={extracted.date||""} onChange={e=>upd("date",e.target.value)} /></div>
            <div className="field-group"><div className="field-label">Heure</div><input className="field-input" value={extracted.heure||""} onChange={e=>upd("heure",e.target.value)} /></div>
          </div>
        </div>

        <div className="card">
          <div className="card-title">Structure & Résultat</div>
          <div className="field-row">
            <div className="field-group"><div className="field-label">Structure</div><select className="field-input" value={extracted.bet_structure||"simple"} onChange={e=>upd("bet_structure",e.target.value)}><option value="simple">Simple</option><option value="combiné">Combiné</option><option value="mymatch">MyMatch</option></select></div>
            <div className="field-group"><div className="field-label">Résultat</div><select className="field-input" value={extracted.result||"win"} onChange={e=>upd("result",e.target.value)}><option value="win">Gagné</option><option value="loss">Perdu</option></select></div>
          </div>
          <div className="field-row">
            <div className="field-group"><div className="field-label">Cote totale</div><input className="field-input" type="number" step="0.01" value={extracted.total_odd||""} onChange={e=>upd("total_odd",parseFloat(e.target.value))} /></div>
            <div className="field-group"><div className="field-label">{isFreebet ? "Valeur freebet (€)" : "Mise (€)"}</div><input className="field-input" type="number" step="0.5" value={extracted.stake||""} onChange={e=>upd("stake",parseFloat(e.target.value))} /></div>
          </div>
          <div className="field-group"><div className="field-label">Gain réel (€)</div><input className="field-input" type="number" step="0.01" value={extracted.actual_win||""} onChange={e=>upd("actual_win",parseFloat(e.target.value))} /></div>
          <label className={`freebet-toggle ${isFreebet?'active':''}`} onClick={()=>setIsFreebet(p=>!p)}>
            <div className={`freebet-box ${isFreebet?'checked':''}`}>{isFreebet && <span style={{color:'#0a0a0f',fontSize:11,fontWeight:800}}>✓</span>}</div>
            <div><div className="freebet-toggle-label">🎁 Freebet</div><div style={{fontSize:11,color:'var(--text3)',marginTop:2}}>Mise réelle 0€</div></div>
          </label>
        </div>

        {extracted.selections?.length > 0 && (
          <div className="card">
            <div className="card-title">Sélections ({extracted.selections.length})</div>
            {extracted.selections.map((s,i) => {
              const isNeg = s.negated || s.selection_type?.includes("— Non");
              return (
                <div key={i} className="selection-item" style={isNeg?{borderColor:'rgba(255,153,87,0.3)'}:{}}>
                  <div className="selection-left">
                    <div className="selection-team">{s.team}{s.player_display||s.player ? ` · ${s.player_display||s.player}` : ""}</div>
                    <div className="selection-type">{s.selection_type} {s.sel_type && s.sel_type!=="autre" && <span style={{color:'var(--accent2)',fontSize:10,fontWeight:700}}>· {s.sel_type}</span>}</div>
                  </div>
                  <div className="selection-odd">×{fmt(s.odd)}</div>
                </div>
              );
            })}
          </div>
        )}

        <div className="card">
          <div className="card-title">Catégorie du pari</div>
          <div className="tag-selector">
            {["SAFE", "FUN", ...existingTags].map(t => (
              <button key={t} className={`tag-btn ${tag===t && !customTag?'selected':''}`} onClick={()=>{setTag(t);setCustomTag("");}}>{t}</button>
            ))}
          </div>
          <div className="field-group" style={{marginBottom:0}}>
            <div className="field-label">Nouvelle catégorie</div>
            <input className="field-input" placeholder="ex: VALUE, NBA…" value={customTag} onChange={e=>setCustomTag(e.target.value.toUpperCase())} />
          </div>
        </div>

        {error && <div className="error-msg">❌ {error}</div>}
        <button className="btn-primary" onClick={()=>handleConfirm(false)} disabled={(dupWarning&&!saving)||saving}>
          {saving ? "Enregistrement…" : `Enregistrer${queue.length>1?` (${queueIdx+1}/${queue.length})`:""}` }
        </button>
        {queue.length > 1 && <button className="btn-secondary" onClick={handleSkip}>Ignorer ce pari →</button>}
        <button className="btn-secondary" onClick={reset} style={{marginTop:4}}>Annuler tout</button>
      </div>
    );
  }

  // ── Render: IDLE — file selection ─────────────────────────────────────────────
  if (mode === "idle") return (
    <div>
      <div className="section-title">Importer des paris</div>
      {/* Mode tabs */}
      <div className="tab-switch" style={{marginBottom:16}}>
        <button className="tab-switch-btn active">📲 Screenshot</button>
        <button className="tab-switch-btn" onClick={()=>setMode("manual")}>✏️ Manuel</button>
      </div>

      {files.length === 0 ? (
        <div className="upload-zone">
          <input ref={fileRef} type="file" accept="image/*" multiple onChange={e=>{ if(e.target.files?.length) addFiles(e.target.files); }} />
          <div className="upload-icon">📲</div>
          <div className="upload-title">Importer des captures</div>
          <div className="upload-sub">Appuyer pour choisir depuis la galerie · jusqu'à 5</div>
          <div className="bookmaker-badges"><span className="badge badge-winamax">Winamax</span><span className="badge badge-betclic">Betclic</span></div>
        </div>
      ) : (
        <div>
          <div className="multi-upload-grid">
            {files.map((f,i) => (
              <div key={i} className="multi-thumb">
                <img src={f.previewUrl} alt="" />
                <div className="multi-thumb-badge">#{i+1}</div>
                <button className="multi-thumb-remove" onClick={()=>removeFile(i)}>✕</button>
              </div>
            ))}
            {files.length < 5 && (
              <div className="add-more-zone">
                <input type="file" accept="image/*" multiple onChange={e=>{ if(e.target.files?.length) addFiles(e.target.files); }} />
                <span style={{fontSize:24}}>+</span>
                <span style={{fontSize:10,color:'var(--text3)'}}>Ajouter</span>
              </div>
            )}
          </div>
          <div style={{fontSize:12,color:'var(--text2)',textAlign:'center',marginBottom:14}}>{files.length} capture{files.length>1?"s":""} sélectionnée{files.length>1?"s":""}</div>
          <button className="btn-primary" onClick={handleAnalyze}>🔍 Analyser avec l'IA</button>
          <button className="btn-secondary" onClick={()=>setFiles([])}>Recommencer</button>
        </div>
      )}
    </div>
  );

  // ── Render: MANUAL ────────────────────────────────────────────────────────────
  if (mode === "manual") return <ManualImportForm bets={bets} addBet={addBet} existingTags={existingTags} onDone={reset} onCancel={reset}/>;

  return null;
}

// ─── BETS TAB ────────────────────────────────────────────────────────────────
function BetsTab({ bets, onDelete, onUpdate }) {
  const [selected, setSelected] = useState(null);
  const [filterResult, setFilterResult] = useState("Tous");
  const [filterTag, setFilterTag] = useState("Tous");
  const [filterDate, setFilterDate] = useState("Tous");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showDateRange, setShowDateRange] = useState(false);

  const allTags = ["Tous", ...Array.from(new Set(bets.map(b=>b.tag).filter(Boolean))).sort()];

  const filtered = bets.filter(b => {
    if (filterResult === "Win" && b.result !== "win") return false;
    if (filterResult === "Loss" && b.result !== "loss") return false;
    if (filterTag !== "Tous" && b.tag !== filterTag) return false;
    if (filterDate === "Aujourd'hui" && !isToday(b.date)) return false;
    if (filterDate === "Cette semaine" && !isThisWeek(b.date)) return false;
    if (filterDate === "Ce mois" && !isThisMonth(b.date)) return false;
    if (filterDate === "Plage" && dateFrom && new Date(b.date) < new Date(dateFrom)) return false;
    if (filterDate === "Plage" && dateTo && new Date(b.date) > new Date(dateTo)) return false;
    return true;
  }).sort((a,b) => new Date(a.date) - new Date(b.date));

  return (
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
        <div className="section-title" style={{marginBottom:0}}>{filtered.length} paris</div>
        {filtered.length !== bets.length && (
          <button onClick={()=>{setFilterResult("Tous");setFilterTag("Tous");setFilterDate("Tous");}} style={{background:'rgba(255,87,112,0.1)',border:'1px solid rgba(255,87,112,0.25)',borderRadius:20,padding:'4px 10px',fontSize:11,color:'var(--loss)',cursor:'pointer',fontFamily:'var(--font-head)',fontWeight:700}}>✕ Reset</button>
        )}
      </div>

      {/* DATE FILTERS */}
      <div className="date-filter-row">
        {["Tous","Aujourd'hui","Cette semaine","Ce mois","Plage"].map(f=>(
          <button key={f} className={`date-pill ${filterDate===f?'active':''}`} onClick={()=>{setFilterDate(f);if(f==="Plage")setShowDateRange(true);else setShowDateRange(false);}}>
            {f}
          </button>
        ))}
      </div>

      {showDateRange && filterDate === "Plage" && (
        <div style={{display:'flex',gap:8,marginBottom:10}}>
          <input className="field-input" type="date" value={dateFrom} onChange={e=>setDateFrom(e.target.value)} style={{fontSize:12,padding:'8px 10px'}} />
          <input className="field-input" type="date" value={dateTo} onChange={e=>setDateTo(e.target.value)} style={{fontSize:12,padding:'8px 10px'}} />
        </div>
      )}

      {/* RESULT + TAG FILTERS */}
      <div className="filter-scroll">
        {["Tous","Win","Loss"].map(f=>(
          <button key={f} className={`filter-chip ${filterResult===f?'active':''}`} onClick={()=>setFilterResult(f)}>
            {f==="Win"?"🏆 Win":f==="Loss"?"❌ Loss":"Tous"}
          </button>
        ))}
        <div style={{width:1,background:'var(--border)',flexShrink:0,margin:'0 2px'}}/>
        {allTags.map(f=>(
          <button key={f} className={`filter-chip ${filterTag===f?'active':''}`} onClick={()=>setFilterTag(f)}>{f}</button>
        ))}
      </div>

      {filtered.length === 0
        ? <div className="empty-state"><div className="e-icon">🔍</div><div className="e-title">Aucun pari</div><div className="e-sub">Aucun résultat pour ces filtres.</div></div>
        : filtered.map(bet => {
          const profit = betProfit(bet);
          const sportEmoji = { Football:"⚽", Tennis:"🎾", Basketball:"🏀", Rugby:"🏉", Hockey:"🏒" }[bet.sport] || "🎯";
          return (
            <div key={bet.id} className="bet-row" onClick={()=>setSelected(bet)}>
              <div className={`bet-row-result ${bet.result}`}>{bet.result==='win'?'✓':'✕'}</div>
              <div className="bet-row-left">
                <div className="bet-row-type">
                  <span>{sportEmoji}</span>
                  <span>{bet.bet_structure === "simple" ? "Simple" : bet.bet_structure === "combiné" ? "Combiné" : "MyMatch"}</span>
                  {bet.is_freebet && <span className="freebet-tag" style={{fontSize:9,padding:'1px 5px'}}>FB</span>}
                  {bet.tag && bet.tag !== "SAFE" && bet.tag !== "FUN" && <span style={{fontSize:10,color:'var(--accent2)',fontFamily:'var(--font-head)',fontWeight:700}}>{bet.tag}</span>}
                </div>
                <div className="bet-row-meta">{bet.sport} · {bet.competition || bet.team_1} · {bet.date}</div>
              </div>
              <div className="bet-row-right">
                <div className="bet-row-odd">×{fmt(bet.total_odd)}</div>
                <div className="bet-row-gain" style={{color:profit>=0?'var(--win)':'var(--loss)'}}>{fmtEuro(profit)}</div>
              </div>
            </div>
          );
        })
      }
      {selected && <BetDetailModal bet={selected} onClose={()=>setSelected(null)} onDelete={onDelete ? (id)=>{ onDelete(id); setSelected(null); } : null} onUpdate={onUpdate} allTags={allTags.filter(t=>t!=="Tous")} />}
    </div>
  );
}

// ─── CHARTS ──────────────────────────────────────────────────────────────────
function BarChart({ data, colorFn }) {
  const maxAbs = Math.max(...data.map(d=>Math.abs(d.value)), 0.01);
  return (
    <div className="bar-chart">
      {data.map((d,i) => (
        <div key={i} className="bar-row">
          <div className="bar-label" title={d.label}>{d.label}</div>
          <div className="bar-track">
            <div className="bar-fill" style={{width:`${(Math.abs(d.value)/maxAbs)*100}%`, background: colorFn ? colorFn(d.value) : (d.value>=0?'var(--win)':'var(--loss)')}} />
          </div>
          <div className="bar-val" style={{color:d.value>=0?'var(--win)':'var(--loss)'}}>{fmtEuro(d.value)}</div>
        </div>
      ))}
    </div>
  );
}

function MonthlyBarChart({ bets }) {
  const [activeIdx, setActiveIdx] = useState(null);
  const grouped = {};
  bets.forEach(b => {
    const k = monthKey(b.date);
    if (!grouped[k]) grouped[k] = [];
    grouped[k].push(b);
  });
  const keys = Object.keys(grouped).sort().slice(-12);
  const data = keys.map(k => {
    const p = grouped[k].reduce((a,b)=>a+betProfit(b), 0);
    return { label: fmtMonthLabel(k), value: p, count: grouped[k].length };
  });
  if (data.length < 2) return <div style={{textAlign:'center',color:'var(--text3)',fontSize:12,padding:'12px 0'}}>Pas assez de données</div>;
  const maxAbs = Math.max(...data.map(d=>Math.abs(d.value)), 0.01);
  const barW = Math.min(40, Math.floor(300 / data.length) - 4);
  return (
    <div>
      {activeIdx !== null && (
        <div style={{textAlign:'center',marginBottom:8,background:'var(--surface2)',borderRadius:8,padding:'6px 0'}}>
          <span style={{fontFamily:'var(--font-head)',fontSize:13,fontWeight:800,color:'var(--text)'}}>{data[activeIdx].label}</span>
          <span style={{fontSize:12,color:'var(--text2)',marginLeft:8}}>{data[activeIdx].count} paris</span>
          <span style={{fontFamily:'var(--font-head)',fontSize:13,fontWeight:800,color:data[activeIdx].value>=0?'var(--win)':'var(--loss)',marginLeft:8}}>{fmtEuro(data[activeIdx].value)}</span>
        </div>
      )}
      <div style={{display:'flex',alignItems:'flex-end',gap:3,height:80,paddingBottom:4}}>
        {data.map((d,i)=>{
          const pct = Math.abs(d.value)/maxAbs;
          const h = Math.max(pct*68, 4);
          return (
            <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:3,cursor:'pointer'}} onClick={()=>setActiveIdx(activeIdx===i?null:i)}>
              <div style={{width:'100%',height:68,display:'flex',alignItems:'flex-end',justifyContent:'center'}}>
                <div style={{width:'100%',maxWidth:barW,height:h,borderRadius:'3px 3px 0 0',background:d.value>=0?'var(--win)':'var(--loss)',opacity:activeIdx===i?1:0.75,minHeight:4,transition:'opacity 0.15s',outline:activeIdx===i?`2px solid ${d.value>=0?'var(--win)':'var(--loss)'}`:''}}/>
              </div>
              <div style={{fontSize:8,color:activeIdx===i?'var(--text)':'var(--text3)',fontFamily:'var(--font-head)',fontWeight:700,letterSpacing:'0.3px',maxWidth:barW+4,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',textAlign:'center'}}>{d.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── PIE CHART — répartition paris par catégorie ─────────────────────────────
function CategoryPieChart({ bets }) {
  const COLORS = ['var(--accent)','var(--accent2)','var(--win)','var(--fun)','var(--scorer)','#ff9957','#a78bfa','#f472b6'];
  const allTags = [...new Set(bets.map(b=>b.tag).filter(Boolean))];
  if (allTags.length === 0) return <div style={{textAlign:'center',color:'var(--text3)',fontSize:12,padding:'12px 0'}}>Aucune catégorie</div>;

  const data = allTags.map((t,i) => ({
    label: t,
    count: bets.filter(b=>b.tag===t).length,
    color: COLORS[i % COLORS.length]
  })).sort((a,b)=>b.count-a.count);

  const total = data.reduce((a,d)=>a+d.count, 0);
  if (total === 0) return null;

  // SVG pie
  const R = 60, cx = 75, cy = 70, size = 150;
  let cumAngle = -Math.PI/2;
  const slices = data.map(d => {
    const angle = (d.count / total) * 2 * Math.PI;
    const start = cumAngle;
    cumAngle += angle;
    const x1 = cx + R * Math.cos(start), y1 = cy + R * Math.sin(start);
    const x2 = cx + R * Math.cos(cumAngle), y2 = cy + R * Math.sin(cumAngle);
    const large = angle > Math.PI ? 1 : 0;
    return { ...d, path: `M${cx},${cy} L${x1.toFixed(2)},${y1.toFixed(2)} A${R},${R},0,${large},1,${x2.toFixed(2)},${y2.toFixed(2)} Z`, angle, midAngle: start + angle/2 };
  });

  return (
    <div style={{display:'flex',alignItems:'center',gap:12}}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{flexShrink:0}}>
        {slices.map((s,i) => <path key={i} d={s.path} fill={s.color} opacity={0.85}/>)}
        <circle cx={cx} cy={cy} r={R*0.5} fill="var(--surface)"/>
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fill="var(--text)" fontSize="13" fontFamily="var(--font-head)" fontWeight="800">{total}</text>
        <text x={cx} y={cy+14} textAnchor="middle" fill="var(--text3)" fontSize="8" fontFamily="var(--font-head)">paris</text>
      </svg>
      <div style={{flex:1}}>
        {data.map((d,i) => (
          <div key={i} style={{display:'flex',alignItems:'center',gap:8,marginBottom:7}}>
            <div style={{width:10,height:10,borderRadius:3,background:d.color,flexShrink:0}}/>
            <div style={{flex:1,fontSize:12,fontFamily:'var(--font-head)',fontWeight:700,color:'var(--text)'}}>{d.label}</div>
            <div style={{fontSize:12,color:'var(--text2)',fontFamily:'var(--font-head)',fontWeight:700}}>{d.count}</div>
            <div style={{fontSize:11,color:'var(--text3)',minWidth:32,textAlign:'right'}}>{fmt(d.count/total*100,0)}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── BANKROLL CHART ───────────────────────────────────────────────────────────
function BankrollChart({ bets }) {
  const [bankrollInput, setBankrollInput] = useState("");
  const [editing, setEditing] = useState(false);
  const [tempVal, setTempVal] = useState("");
  const [hoverIdx, setHoverIdx] = useState(null);
  const svgRef = useRef(null);
  const startCapital = parseFloat(bankrollInput) || 0;

  if (bets.length < 2) return (
    <div style={{textAlign:'center',color:'var(--text3)',fontSize:12,padding:'12px 0'}}>Pas assez de données</div>
  );

  const sorted = [...bets].sort((a,b)=>new Date(a.date)-new Date(b.date));
  let running = startCapital;
  const points = [{ label: "Début", v: startCapital }];
  sorted.forEach(b => { running += betProfit(b); points.push({ label: b.date.slice(5), v: running }); });

  const values = points.map(p=>p.v);
  const mn = Math.min(...values), mx = Math.max(...values);
  const range = Math.max(mx - mn, 0.01);
  const W = 340, H = 100;
  const px = i => (i / (points.length - 1)) * (W - 4) + 2;
  const py = v => H - ((v - mn) / range) * (H - 16) - 2;
  const d = points.map((p,i) => `${i===0?'M':'L'}${px(i).toFixed(1)},${py(p.v).toFixed(1)}`).join(' ');
  const fill = d + ` L${px(points.length-1).toFixed(1)},${H} L${px(0).toFixed(1)},${H} Z`;
  const last = values[values.length-1];
  const color = last >= startCapital ? '#57ff9e' : '#ff5770';
  const zeroY = py(startCapital);
  const maxIdx = values.indexOf(mx), minIdx = values.indexOf(mn);
  const labelIdxs = [...new Set([0, maxIdx, minIdx, points.length-1])].sort((a,b)=>a-b);

  const getIdxFromX = (clientX) => {
    if (!svgRef.current) return null;
    const rect = svgRef.current.getBoundingClientRect();
    const relX = clientX - rect.left;
    const frac = (relX - 2) / (rect.width - 4);
    const idx = Math.round(frac * (points.length - 1));
    return Math.max(0, Math.min(points.length - 1, idx));
  };

  const handlePointerMove = (e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    setHoverIdx(getIdxFromX(clientX));
  };

  const hoverPt = hoverIdx !== null ? points[hoverIdx] : null;
  const hoverX = hoverIdx !== null ? px(hoverIdx) : null;
  const hoverY = hoverPt ? py(hoverPt.v) : null;

  return (
    <div>
      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12}}>
        <span style={{fontSize:11,color:'var(--text3)',textTransform:'uppercase',letterSpacing:'0.5px',fontWeight:600}}>Capital de départ</span>
        {editing ? (
          <div style={{display:'flex',gap:6,alignItems:'center',flex:1}}>
            <input style={{flex:1,background:'var(--surface2)',border:'1px solid var(--accent)',borderRadius:8,padding:'4px 10px',color:'var(--text)',fontFamily:'var(--font-head)',fontSize:13,fontWeight:700,outline:'none'}}
              value={tempVal} onChange={e=>setTempVal(e.target.value)} type="number" placeholder="0" autoFocus
              onKeyDown={e=>{ if(e.key==="Enter"){setBankrollInput(tempVal);setEditing(false);} if(e.key==="Escape")setEditing(false); }}/>
            <span style={{fontSize:13,color:'var(--text2)'}}>€</span>
            <button onClick={()=>{setBankrollInput(tempVal);setEditing(false);}} style={{background:'var(--accent)',color:'#0a0a0f',border:'none',borderRadius:6,padding:'4px 10px',fontFamily:'var(--font-head)',fontSize:12,fontWeight:800,cursor:'pointer'}}>OK</button>
          </div>
        ) : (
          <button onClick={()=>{setTempVal(bankrollInput);setEditing(true);}} style={{background:'var(--surface2)',border:'1px solid var(--border)',borderRadius:8,padding:'4px 12px',color:bankrollInput?'var(--accent)':'var(--text3)',fontFamily:'var(--font-head)',fontSize:13,fontWeight:700,cursor:'pointer'}}>
            {bankrollInput ? `${bankrollInput}€` : "Définir →"}
          </button>
        )}
        <span style={{marginLeft:'auto',fontFamily:'var(--font-head)',fontSize:16,fontWeight:800,color:last>=startCapital?'var(--win)':'var(--loss)'}}>
          {hoverPt ? <>{hoverPt.v>=0?'+':''}{fmt(hoverPt.v,0)}€ <span style={{fontSize:11,color:'var(--text3)',fontWeight:500}}>{hoverPt.label}</span></> : <>{last-startCapital>=0?'+':''}{fmt(last-startCapital,0)}€</>}
        </span>
      </div>
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} width="100%" height="110"
        style={{display:'block',overflow:'visible',cursor:'crosshair',touchAction:'pan-y'}}
        onMouseMove={handlePointerMove} onTouchMove={handlePointerMove}
        onMouseLeave={()=>setHoverIdx(null)} onTouchEnd={()=>setHoverIdx(null)}>
        <defs><linearGradient id="brGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.25"/><stop offset="100%" stopColor={color} stopOpacity="0.02"/></linearGradient></defs>
        {zeroY>=0&&zeroY<=H&&<line x1={0} y1={zeroY.toFixed(1)} x2={W} y2={zeroY.toFixed(1)} stroke="var(--border)" strokeWidth="1" strokeDasharray="4,4"/>}
        <path d={fill} fill="url(#brGrad)"/>
        <path d={d} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        {/* Static endpoint dot */}
        {hoverIdx === null && <circle cx={px(points.length-1).toFixed(1)} cy={py(last).toFixed(1)} r="5" fill={color}/>}
        {/* Static labels (hidden when hovering) */}
        {hoverIdx === null && labelIdxs.map(i => {
          const p=points[i]; const x=px(i); const y=py(p.v); const above=y>20;
          return <g key={i}>
            <circle cx={x.toFixed(1)} cy={y.toFixed(1)} r="3" fill={p.v>=startCapital?'var(--win)':'var(--loss)'} opacity="0.7"/>
            <text x={Math.min(Math.max(x,16),W-16).toFixed(1)} y={above?(y-7).toFixed(1):(y+13).toFixed(1)} textAnchor="middle" fill="var(--text3)" fontSize="8" fontFamily="var(--font-head)" fontWeight="700">
              {p.v>=0?'+':''}{fmt(p.v,0)}€
            </text>
          </g>;
        })}
        {/* Hover indicator */}
        {hoverPt && hoverX !== null && hoverY !== null && <>
          <line x1={hoverX.toFixed(1)} y1={0} x2={hoverX.toFixed(1)} y2={H} stroke="rgba(255,255,255,0.15)" strokeWidth="1" strokeDasharray="3,3"/>
          <circle cx={hoverX.toFixed(1)} cy={hoverY.toFixed(1)} r="6" fill={color} stroke="var(--bg)" strokeWidth="2"/>
        </>}
      </svg>
      <div style={{display:'flex',justifyContent:'space-between',marginTop:6}}>
        <div style={{fontSize:10,color:'var(--text3)'}}>Max : <span style={{color:'var(--win)',fontFamily:'var(--font-head)',fontWeight:700}}>{fmt(mx,0)}€</span></div>
        <div style={{fontSize:10,color:'var(--text3)'}}>Min : <span style={{color:'var(--loss)',fontFamily:'var(--font-head)',fontWeight:700}}>{fmt(mn,0)}€</span></div>
        <div style={{fontSize:10,color:'var(--text3)'}}>{sorted.length} paris</div>
      </div>
    </div>
  );
}

// ─── SPORT HEATMAP ────────────────────────────────────────────────────────────
function SportHeatmap({ bets }) {
  const sports = [...new Set(bets.map(b=>b.sport).filter(Boolean))];
  if (sports.length === 0) return null;
  const rows = sports.map(sp => {
    const sub=bets.filter(b=>b.sport===sp); const st=computeStats(sub);
    return { sport:sp, count:sub.length, profit:st.profit, rate:st.rate };
  }).sort((a,b)=>b.profit-a.profit);
  const sportEmoji = {Football:'⚽',Tennis:'🎾',Basketball:'🏀',Rugby:'🏉',Hockey:'🏒'};
  return (
    <div>
      {rows.map((r,i)=>(
        <div key={i} style={{display:'flex',alignItems:'center',gap:10,padding:'10px 0',borderBottom:i<rows.length-1?'1px solid var(--border)':'none'}}>
          <div style={{fontSize:18,flexShrink:0}}>{sportEmoji[r.sport]||'🎯'}</div>
          <div style={{flex:1,fontFamily:'var(--font-head)',fontSize:13,fontWeight:700,color:'var(--text)'}}>{r.sport}</div>
          <div style={{fontSize:12,color:'var(--text3)',minWidth:40,textAlign:'center'}}>{r.count} paris</div>
          <div style={{fontSize:12,fontFamily:'var(--font-head)',fontWeight:700,color:r.rate>=50?'var(--win)':'var(--text2)',minWidth:36,textAlign:'center'}}>{fmt(r.rate,0)}%</div>
          <div style={{fontFamily:'var(--font-head)',fontSize:14,fontWeight:800,color:r.profit>=0?'var(--win)':'var(--loss)',minWidth:60,textAlign:'right'}}>{fmtEuro(r.profit)}</div>
        </div>
      ))}
    </div>
  );
}

function DonutChart({ segments, size=80 }) {
  const r=(size/2)-8, cx=size/2, cy=size/2, circ=2*Math.PI*r;
  let offset=0, total=segments.reduce((a,s)=>a+s.value,0);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{transform:'rotate(-90deg)',flexShrink:0}}>
      {segments.map((seg,i)=>{ const pct=total>0?seg.value/total:0, dash=pct*circ, gap=circ-dash; const el=<circle key={i} r={r} cx={cx} cy={cy} fill="none" stroke={seg.color} strokeWidth={12} strokeDasharray={`${dash} ${gap}`} strokeDashoffset={-offset*circ}/>; offset+=pct; return el; })}
    </svg>
  );
}

// ─── COLLAPSIBLE STAT SECTION ─────────────────────────────────────────────────
function StatSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="stat-section">
      <div className="stat-section-header" onClick={()=>setOpen(o=>!o)}>
        <span className="stat-section-title">{title}</span>
        <span className={`stat-section-arrow ${open?'open':''}`}>▾</span>
      </div>
      <div className={`stat-section-body ${open?'open':'closed'}`}>
        {children}
      </div>
    </div>
  );
}

// ─── SEGMENT TABLE (générique) ────────────────────────────────────────────────
function SegTable({ rows }) {
  if (!rows || rows.length === 0) return <div style={{textAlign:'center',color:'var(--text3)',fontSize:12,padding:'8px 0'}}>Pas assez de données</div>;
  return (
    <div className="card" style={{padding:0,overflow:'hidden'}}>
      <table className="data-table">
        <thead><tr><th>Segment</th><th style={{textAlign:'center'}}>Paris</th><th style={{textAlign:'center'}}>Réussite</th><th style={{textAlign:'right'}}>Profit</th></tr></thead>
        <tbody>
          {rows.map((r,i)=>(
            <tr key={i}>
              <td className="num">{r.label}</td>
              <td style={{textAlign:'center',color:'var(--text2)'}}>{r.count}</td>
              <td style={{textAlign:'center',fontFamily:'var(--font-head)',fontWeight:700,color:r.rate>=50?'var(--win)':'var(--text2)'}}>{fmt(r.rate,0)}%</td>
              <td style={{textAlign:'right',fontFamily:'var(--font-head)',fontWeight:800,color:r.profit!=null?(r.profit>=0?'var(--win)':'var(--loss)'):'var(--text2)'}}>{r.profit!=null?fmtEuro(r.profit):'—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── SELECTION STATS TABLE ────────────────────────────────────────────────────
function SelTable({ rows, label }) {
  if (!rows || rows.length === 0) return <div style={{textAlign:'center',color:'var(--text3)',fontSize:12,padding:'8px 0'}}>Pas assez de données</div>;
  return (
    <div className="card" style={{padding:0,overflow:'hidden'}}>
      <table className="data-table">
        <thead><tr><th>{label}</th><th style={{textAlign:'center'}}>Paris</th><th style={{textAlign:'center'}}>Réussite</th></tr></thead>
        <tbody>
          {rows.map((r,i)=>(
            <tr key={i}>
              <td className="num">{r.label}</td>
              <td style={{textAlign:'center',color:'var(--text2)'}}>{r.total}</td>
              <td style={{textAlign:'center',fontFamily:'var(--font-head)',fontWeight:700,color:r.rate>=50?'var(--win)':'var(--text2)'}}>{fmt(r.rate,0)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── DASHBOARD TAB (Stats) ────────────────────────────────────────────────────
function DashboardTab({ bets }) {
  const [pView, setPView] = useState("top");
  if(bets.length===0) return <div className="empty-state"><div className="e-icon">📊</div><div className="e-title">Aucune donnée</div><div className="e-sub">Importez vos premiers paris.</div></div>;

  const s = computeStats(bets);
  const freebets = bets.filter(b=>b.is_freebet);

  // Segmentation data
  const allTags = [...new Set(bets.map(b=>b.tag).filter(Boolean))];
  const tagRows = allTags.map(t=>{ const sub=bets.filter(b=>b.tag===t); const st=computeStats(sub); return {label:t,count:sub.length,rate:st.rate,profit:st.profit}; }).sort((a,b)=>b.profit-a.profit);

  const structures = ["simple","combiné","mymatch"];
  const structureRows = structures.map(str=>{ const sub=bets.filter(b=>b.bet_structure===str); if(!sub.length) return null; const st=computeStats(sub); return {label:str==="simple"?"Simple":str==="combiné"?"Combiné":"MyMatch",count:sub.length,rate:st.rate,profit:st.profit}; }).filter(Boolean);

  const sports = [...new Set(bets.map(b=>b.sport).filter(Boolean))];
  const sportRows = sports.map(sp=>{ const sub=bets.filter(b=>b.sport===sp); const st=computeStats(sub); return {label:sp,count:sub.length,rate:st.rate,profit:st.profit}; }).sort((a,b)=>b.profit-a.profit);

  // Selection-level stats
  const allSels = getAllSelections(bets);
  const selTypeRows = getSelGroupStats(allSels, s=>s._selType);
  const compRows = getSelGroupStats(allSels.filter(s=>s._competition), s=>s._competition).slice(0,12);

  // Odd range
  const oddRanges = getOddRangeStats(bets);

  // Streak
  const streaks = getStreaks(bets);

  // Players
  const players = getPlayerStats(bets);
  const topP = [...players].sort((a,b)=>b.profit-a.profit).slice(0,5);
  const worstP = [...players].sort((a,b)=>a.profit-b.profit).slice(0,5);
  const shown = pView==="top" ? topP : worstP;

  return (
    <div>
      {/* ── BLOC 1 : KPIs (always visible) ── */}
      <div className="section-title">Résumé global</div>
      <div className="stat-grid">
        <div className="stat-card"><div className="stat-label">Total paris</div><div className="stat-value neutral">{s.total}</div><div className="stat-sub">{s.wins} gagnés</div></div>
        <div className="stat-card"><div className="stat-label">Taux de réussite</div><div className={`stat-value ${s.rate>=50?'positive':'negative'}`}>{fmt(s.rate,0)}%</div><div className="stat-sub">sur {s.total} paris</div></div>
        <div className="stat-card"><div className="stat-label">Total misé</div><div className="stat-value neutral">{fmt(s.totalStake,0)}€</div><div className="stat-sub">{freebets.length>0?`${freebets.length} freebets exclus`:''}</div></div>
        <div className="stat-card"><div className="stat-label">Cote moyenne</div><div className="stat-value neutral">×{fmt(s.avgOdd)}</div></div>
        <div className="stat-card full">
          <div className="stat-label">Profit total</div>
          <div className={`stat-value ${s.profit>=0?'positive':'negative'}`} style={{fontSize:36}}>{fmtEuro(s.profit)}</div>
          {freebets.length>0 && <div className="stat-sub">dont {fmtEuro(freebets.reduce((a,b)=>a+betProfit(b),0))} de freebets</div>}
        </div>
      </div>

      {/* ── BANKROLL (always visible) ── */}
      <div className="section-title" style={{marginTop:8}}>Évolution de la bankroll</div>
      <div className="card" style={{padding:'14px 14px 10px'}}><BankrollChart bets={bets}/></div>

      {/* ── COLLAPSIBLE SECTIONS below ── */}
      <div style={{marginTop:12}}>

        <StatSection title="📊 Performance par mois">
          <div className="card" style={{padding:'14px 14px 10px'}}><MonthlyBarChart bets={bets}/></div>
        </StatSection>

        <StatSection title="🏷️ Par catégorie">
          <SegTable rows={tagRows}/>
          <div className="card" style={{padding:'16px',marginTop:8}}><CategoryPieChart bets={bets}/></div>
        </StatSection>

        <StatSection title="🏗️ Par structure de pari">
          <SegTable rows={structureRows}/>
        </StatSection>

        <StatSection title="⚽ Par sport">
          <SegTable rows={sportRows}/>
        </StatSection>

        {allSels.length > 0 && (
          <StatSection title="🎯 Par type de sélection">
            <SelTable rows={selTypeRows} label="Type"/>
          </StatSection>
        )}

        {compRows.length > 0 && (
          <StatSection title="🏆 Par compétition">
            <SelTable rows={compRows} label="Compétition"/>
          </StatSection>
        )}

        {oddRanges.length > 0 && (
          <StatSection title="📈 Par tranche de cote">
            <div className="card" style={{padding:0,overflow:'hidden'}}>
              <table className="data-table">
                <thead><tr><th>Cote</th><th>Paris</th><th>Réussite</th><th>Profit</th></tr></thead>
                <tbody>
                  {oddRanges.map((r,i)=>(
                    <tr key={i}>
                      <td className="num">{r.label}</td>
                      <td>{r.count}</td>
                      <td>{fmt(r.rate,0)}%</td>
                      <td className="num" style={{color:r.profit>=0?'var(--win)':'var(--loss)'}}>{fmtEuro(r.profit)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </StatSection>
        )}

        {bets.length >= 2 && (
          <StatSection title="🔥 Séries & Streaks">
            <div className="card">
              <div style={{display:'flex',gap:10,marginBottom:14}}>
                <div style={{flex:1,background:'var(--surface2)',borderRadius:'var(--radius-sm)',padding:'10px 12px',textAlign:'center'}}>
                  <div style={{fontSize:10,color:'var(--text3)',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:4,fontWeight:600}}>Série actuelle</div>
                  <div style={{fontFamily:'var(--font-head)',fontSize:24,fontWeight:800,color:streaks.currentType==='win'?'var(--win)':'var(--loss)'}}>{streaks.current}×</div>
                  <div style={{fontSize:11,color:'var(--text2)'}}>{streaks.currentType==='win'?'Victoires':'Défaites'}</div>
                </div>
                <div style={{flex:1,background:'var(--surface2)',borderRadius:'var(--radius-sm)',padding:'10px 12px',textAlign:'center'}}>
                  <div style={{fontSize:10,color:'var(--text3)',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:4,fontWeight:600}}>Meilleure série</div>
                  <div style={{fontFamily:'var(--font-head)',fontSize:24,fontWeight:800,color:'var(--win)'}}>{streaks.bestWin}×</div>
                  <div style={{fontSize:11,color:'var(--text2)'}}>Victoires consécutives</div>
                </div>
              </div>
              {streaks.last10.length > 0 && (
                <div>
                  <div style={{fontSize:10,color:'var(--text3)',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:8,fontWeight:600}}>Derniers {streaks.last10.length} paris</div>
                  <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
                    {streaks.last10.map((r,i)=>(
                      <div key={i} className={`streak-dot ${r}`}>{r==='win'?'W':'L'}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </StatSection>
        )}

        {players.length > 0 && (
          <StatSection title="⭐ Classement joueurs">
            <div className="card">
              <div className="tab-switch">
                <button className={`tab-switch-btn ${pView==='top'?'active':''}`} onClick={()=>setPView('top')}>🏆 Top performers</button>
                <button className={`tab-switch-btn ${pView==='worst'?'active':''}`} onClick={()=>setPView('worst')}>💀 Portent la poisse</button>
              </div>
              {shown.length === 0
                ? <div style={{textAlign:'center',color:'var(--text3)',fontSize:13,padding:'12px 0'}}>Pas assez de données</div>
                : shown.map((p,i)=>(
                  <div key={p.player} className="player-row">
                    <div className="player-rank" style={{color:i===0?(pView==='top'?'var(--accent)':'var(--loss)'):'var(--text3)'}}>{pView==='worst'?'💀':'🏆'}</div>
                    <div className="player-avatar">⚽</div>
                    <div className="player-info">
                      <div className="player-name">{p.display}</div>
                      <div className="player-meta">{p.count} paris · {p.count>0?fmt(p.wins/p.count*100,0):0}% réussite</div>
                    </div>
                    <div className="player-profit" style={{color:p.profit>=0?'var(--win)':'var(--loss)'}}>{fmtEuro(p.profit)}</div>
                  </div>
                ))
              }
            </div>
          </StatSection>
        )}

      </div>
    </div>
  );
}

// ─── INSIGHTS TAB ────────────────────────────────────────────────────────────
function InsightsTab({ bets }) {
  const [aiPhase, setAiPhase] = useState("locked");
  const [aiText, setAiText] = useState("");

  const handleAnalyze = async () => {
    setAiPhase("loading");
    try {
      const result = await runAIAnalysis(bets);
      setAiText(result);
      setAiPhase("done");
    } catch { setAiPhase("error"); }
  };

  if(bets.length===0) return <div className="empty-state"><div className="e-icon">💡</div><div className="e-title">Pas encore d'insights</div><div className="e-sub">Importez au moins 3 paris.</div></div>;

  const insights=[];
  ["team","player","goals","combo"].forEach(cat=>{
    const sub=bets.filter(b=>b.bet_category===cat); if(sub.length<2) return;
    const st=computeStats(sub);
    const labels={team:"Résultats d'équipe",player:"Paris buteurs",goals:"Paris buts",combo:"Combinés"};
    const icons={team:"⚽",player:"🎯",goals:"🥅",combo:"🎰"};
    insights.push({icon:icons[cat],type:st.profit>=0?'positive':'negative',color:st.profit>=0?'var(--win)':'var(--loss)',title:labels[cat],sub:`${sub.length} paris · ${fmt(st.rate,0)}% réussite`,value:fmtEuro(st.profit)});
  });
  const allTags = [...new Set(bets.map(b=>b.tag).filter(Boolean))];
  allTags.forEach(t=>{
    const sub=bets.filter(b=>b.tag===t); if(sub.length<2) return;
    const st=computeStats(sub);
    const icons={"SAFE":"🛡️","FUN":"🎲"};
    insights.push({icon:icons[t]||"🏷️",type:st.profit>=0?'positive':'negative',color:st.profit>=0?'var(--win)':'var(--loss)',title:`Catégorie ${t}`,sub:`${sub.length} paris · ${fmt(st.rate,0)}% réussite`,value:fmtEuro(st.profit)});
  });
  const sorted=insights.sort((a,b)=>Math.abs(parseFloat(b.value))-Math.abs(parseFloat(a.value)));

  return (
    <div>
      <div className="ai-panel">
        <div className="ai-panel-title">🤖 Analyse IA Personnalisée <span className="ai-premium-badge">PREMIUM</span></div>
        <div className="ai-panel-sub">Claude analyse l'intégralité de tes {bets.length} paris : patterns, biais, forces, faiblesses.</div>
        <div className="ai-features">
          {["Identification de tes patterns de paris","Analyse de tes biais et erreurs récurrentes","Recommandations pour améliorer ton ROI","Profil de parieur et stratégie optimale"].map((f,i)=><div key={i} className="ai-feature"><span className="ai-feature-icon">✦</span>{f}</div>)}
        </div>
        {aiPhase==="locked" && <>
          <button className="ai-unlock-btn" onClick={()=>setAiPhase("unlocked")}>Débloquer l'analyse — 4,99€</button>
          <div className="ai-price">Paiement unique · Analyse illimitée sur ce compte</div>
        </>}
        {aiPhase==="unlocked" && <>
          <div style={{background:'rgba(87,255,158,0.08)',border:'1px solid rgba(87,255,158,0.2)',borderRadius:10,padding:'10px 12px',marginBottom:12,fontSize:13,color:'var(--win)'}}>✅ Accès débloqué — Lance ton analyse</div>
          <button className="btn-primary" onClick={handleAnalyze}>🚀 Lancer l'analyse complète</button>
        </>}
        {aiPhase==="loading" && <div style={{textAlign:'center',padding:'16px 0'}}>
          <div className="ai-typing"><div className="ai-dot"/><div className="ai-dot"/><div className="ai-dot"/></div>
          <div style={{fontSize:13,color:'var(--text2)',marginTop:8}}>Analyse de tes {bets.length} paris en cours…</div>
        </div>}
        {aiPhase==="done" && <div className="ai-response">
          <div className="ai-response-header">
            <div className="ai-avatar">✦</div>
            <div><div className="ai-response-title">Analyse personnalisée</div><div style={{fontSize:11,color:'var(--text3)'}}>{bets.length} paris analysés</div></div>
            <button onClick={handleAnalyze} style={{marginLeft:'auto',background:'var(--surface)',border:'1px solid var(--border)',borderRadius:8,padding:'5px 10px',color:'var(--text2)',fontSize:11,cursor:'pointer',fontFamily:'var(--font-head)',fontWeight:700}}>↺</button>
          </div>
          <div className="ai-response-body">{aiText}</div>
        </div>}
        {aiPhase==="error" && <>
          <div className="error-msg">❌ Erreur. Vérifiez votre connexion.</div>
          <button className="btn-secondary" onClick={()=>setAiPhase("unlocked")}>Réessayer</button>
        </>}
      </div>
      <hr className="divider"/>
      <div className="section-title">Insights automatiques</div>
      {sorted.map((ins,i)=>(
        <div key={i} className="insight-card">
          <div className={`insight-icon icon-${ins.type}`}>{ins.icon}</div>
          <div className="insight-text"><div className="insight-title">{ins.title}</div><div className="insight-sub">{ins.sub}</div></div>
          <div className="insight-roi" style={{color:ins.color}}>{ins.value}</div>
        </div>
      ))}
    </div>
  );
}

// ─── AUTH HOOK ────────────────────────────────────────────────────────────────
function useAuth() {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem("bettrack:user");
    if (saved) setUser(saved);
    setAuthReady(true);
  }, []);
  const login = async (username) => {
    const rows = await sbGet("users", `username=eq.${encodeURIComponent(username)}&select=username`);
    if (!rows.length) throw new Error("Pseudo introuvable. Crée un compte d'abord.");
    localStorage.setItem("bettrack:user", username);
    setUser(username);
  };
  const register = async (username, inviteCode) => {
    if (inviteCode.trim().toUpperCase() !== INVITE_CODE) throw new Error("Code d'invitation invalide.");
    if (!username.trim() || username.length < 2) throw new Error("Pseudo trop court (min 2 caractères).");
    if (username.length > 20) throw new Error("Pseudo trop long (max 20 caractères).");
    if (!/^[a-zA-Z0-9_\-.]+$/.test(username)) throw new Error("Pseudo invalide — lettres, chiffres, _ - . uniquement.");
    const existing = await sbGet("users", `username=eq.${encodeURIComponent(username)}&select=username`);
    if (existing.length) throw new Error("Ce pseudo est déjà pris.");
    await sbPost("users", { username });
    localStorage.setItem("bettrack:user", username);
    setUser(username);
  };
  const logout = () => { localStorage.removeItem("bettrack:user"); setUser(null); };
  return { user, authReady, login, register, logout };
}

// ─── USER BETS HOOK ───────────────────────────────────────────────────────────
function useUserBets(username) {
  const [bets, setBetsState] = useState([]);
  const [storageReady, setStorageReady] = useState(false);
  useEffect(() => {
    if (!username) return;
    setStorageReady(false);
    (async () => {
      try {
        const rows = await sbGet("bets", `username=eq.${encodeURIComponent(username)}&order=created_at.desc&select=*`);
        setBetsState(rows.map(r => ({ ...r, selections: r.selections || [], is_freebet: r.is_freebet || false })));
      } catch { setBetsState([]); }
      setStorageReady(true);
    })();
  }, [username]);
  const addBet = async (bet) => {
    const row = { ...bet, username }; delete row.id;
    const [saved] = await sbPost("bets", row);
    setBetsState(prev => [{ ...saved, selections: saved.selections || [], is_freebet: saved.is_freebet || false }, ...prev]);
  };
  const updateBet = async (betId, fields) => {
    await sbPatch("bets", `id=eq.${betId}&username=eq.${encodeURIComponent(username)}`, fields);
    setBetsState(prev => prev.map(b => b.id === betId ? { ...b, ...fields } : b));
  };
  const setBets = (updater) => {
    if (typeof updater === "function") setBetsState(prev => updater(prev));
    else setBetsState(updater);
  };
  return { bets, storageReady, setBets, addBet, updateBet };
}

// ─── LOGIN SCREEN ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin, onRegister }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    setError("");
    if (!username.trim()) { setError("Entre ton pseudo."); return; }
    setLoading(true);
    try {
      if (mode === "login") await onLogin(username.trim());
      else await onRegister(username.trim(), inviteCode.trim());
    } catch (e) { setError(e.message); }
    setLoading(false);
  };
  return (
    <>
      <style>{CSS}</style>
      <div className="login-screen">
        <div className="login-logo">Bet<span>Track</span></div>
        <div className="login-tagline">Ton tracker de paris sportifs</div>
        <div className="login-card">
          <div className="login-card-title">{mode==="login"?"Connexion":"Créer un compte"}</div>
          <div className="login-card-sub">{mode==="login"?"Entre ton pseudo pour accéder à tes paris.":"Entre le code d'invitation et choisis ton pseudo."}</div>
          {mode==="register" && (
            <><div className="invite-info">🔑 Demande le <strong>code d'invitation</strong> à l'admin pour rejoindre.</div>
            <input className="login-input" placeholder="Code d'invitation" value={inviteCode} onChange={e=>setInviteCode(e.target.value)} autoCapitalize="characters"/></>
          )}
          <input className="login-input" placeholder="Ton pseudo (ex: alex_b)" value={username} onChange={e=>setUsername(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSubmit()} autoCapitalize="none" autoCorrect="off"/>
          {error && <div className="login-error">⚠️ {error}</div>}
          <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? <span style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8}}><span className="spinner" style={{width:16,height:16,borderWidth:2}}/> Chargement…</span> : mode==="login"?"Se connecter":"Créer le compte"}
          </button>
        </div>
        <div className="login-toggle">
          {mode==="login" ? <>Pas encore de compte ? <button onClick={()=>{setMode("register");setError("");}}>Créer un compte</button></> : <>Déjà un compte ? <button onClick={()=>{setMode("login");setError("");}}>Se connecter</button></>}
        </div>
        <div style={{marginTop:32,fontSize:11,color:'var(--text3)',textAlign:'center',lineHeight:1.6}}>Winamax · Betclic · Analyse IA</div>
      </div>
    </>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const { user, authReady, login, register, logout } = useAuth();
  const { bets, storageReady, setBets, addBet, updateBet } = useUserBets(user);
  const [tab, setTab] = useState("upload");

  const deleteBet = async (betId) => {
    try {
      await sbDelete("bets", `id=eq.${betId}&username=eq.${encodeURIComponent(user)}`);
      setBets(prev => prev.filter(b => b.id !== betId));
    } catch(e) { alert("Erreur lors de la suppression : " + e.message); }
  };
  if (!authReady) return null;
  if (!user) return <LoginScreen onLogin={login} onRegister={register} />;
  if (!storageReady) return (
    <><style>{CSS}</style>
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--bg)'}}>
      <div style={{textAlign:'center'}}><div className="spinner" style={{margin:'0 auto 16px'}}/><div style={{fontFamily:'var(--font-head)',fontSize:14,color:'var(--text2)'}}>Chargement de tes paris…</div></div>
    </div></>
  );
  const initials = user.slice(0,2).toUpperCase();
  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        <div className="header">
          <div className="header-logo">Bet<span>Track</span></div>
          <div className="header-user">
            <div className="header-avatar">{initials}</div>
            <div className="header-pill" style={{cursor:'pointer'}} onClick={logout} title="Se déconnecter">{user} ↩</div>
          </div>
        </div>
        <div className="scroll-area">
          {tab==="upload" && <UploadTab addBet={addBet} setBets={setBets} bets={bets} updateBet={updateBet}/>}
          {tab==="bets" && <BetsTab bets={bets} onDelete={deleteBet} onUpdate={updateBet}/>}
          {tab==="dashboard" && <DashboardTab bets={bets}/>}
          {tab==="insights" && <InsightsTab bets={bets}/>}
        </div>
        <nav className="bottom-nav">
          {[["upload","📲","Upload"],["bets","📋","Paris"],["dashboard","📊","Stats"],["insights","💡","Insights"]].map(([key,icon,label])=>(
            <button key={key} className={`nav-item ${tab===key?'active':''}`} onClick={()=>setTab(key)}>
              <span style={{fontSize:20}}>{icon}</span><span>{label}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}

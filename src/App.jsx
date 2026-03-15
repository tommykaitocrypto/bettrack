import { useState, useRef, useEffect, useCallback } from "react";

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0a0a0f; --surface: #111118; --surface2: #18181f; --border: #252530; --border2: #2e2e3a;
    --accent: #c8ff57; --accent2: #57c8ff; --text: #f0f0f8; --text2: #8888aa; --text3: #555570;
    --win: #57ff9e; --loss: #ff5770; --safe: #c8ff57; --fun: #ff9957; --scorer: #d4aaff;
    --radius: 16px; --radius-sm: 10px; --font-head: 'Inter', sans-serif; --font-body: 'Inter', sans-serif;
  }
  body { background: var(--bg); color: var(--text); font-family: var(--font-body); font-size: 14px; line-height: 1.5; -webkit-font-smoothing: antialiased; }
  .app { max-width: 430px; margin: 0 auto; min-height: 100vh; display: flex; flex-direction: column; background: var(--bg); }
  .header { padding: 16px 16px 0; display: flex; align-items: center; justify-content: space-between; }
  .header-logo { font-family: var(--font-head); font-size: 20px; font-weight: 800; letter-spacing: -0.5px; }
  .header-logo span { color: var(--accent); }
  .header-right { display: flex; align-items: center; gap: 8px; }
  .header-avatar { width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, var(--accent), var(--accent2)); display: flex; align-items: center; justify-content: center; font-family: var(--font-head); font-size: 11px; font-weight: 800; color: #0a0a0f; flex-shrink: 0; cursor: pointer; }
  .header-pill { background: var(--surface2); border: 1px solid var(--border); border-radius: 20px; padding: 3px 10px; font-size: 11px; color: var(--text2); font-family: var(--font-head); font-weight: 600; cursor: pointer; }
  .scroll-area { flex: 1; overflow-y: auto; padding: 14px 14px 100px; scrollbar-width: none; }
  .scroll-area::-webkit-scrollbar { display: none; }
  .bottom-nav { position: fixed; bottom: 0; left: 50%; transform: translateX(-50%); width: 100%; max-width: 430px; background: rgba(10,10,15,0.94); backdrop-filter: blur(20px); border-top: 1px solid var(--border); padding: 8px 0 18px; display: flex; justify-content: space-around; z-index: 100; }
  .nav-item { display: flex; flex-direction: column; align-items: center; gap: 3px; cursor: pointer; padding: 4px 14px; border-radius: var(--radius-sm); border: none; background: none; color: var(--text3); font-family: var(--font-body); transition: color 0.2s; }
  .nav-item.active { color: var(--accent); }
  .nav-item span:last-child { font-size: 10px; font-weight: 600; letter-spacing: 0px; text-transform: uppercase; }
  .card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 14px; margin-bottom: 10px; }
  .card-title { font-family: var(--font-head); font-size: 11px; font-weight: 700; color: var(--text2); letter-spacing: 0.3px; text-transform: uppercase; margin-bottom: 10px; }
  .section-title { font-family: var(--font-head); font-size: 15px; font-weight: 800; margin-bottom: 10px; margin-top: 2px; letter-spacing: -0.3px; }
  .divider { border: none; border-top: 1px solid var(--border); margin: 14px 0; }
  /* upload */
  .upload-zone { border: 2px dashed var(--border2); border-radius: var(--radius); padding: 40px 20px; text-align: center; cursor: pointer; transition: all 0.3s; background: var(--surface); position: relative; overflow: hidden; }
  .upload-zone:hover { border-color: var(--accent); background: rgba(200,255,87,0.03); }
  .upload-zone input { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }
  .upload-icon { font-size: 36px; margin-bottom: 10px; }
  .upload-title { font-family: var(--font-head); font-size: 16px; font-weight: 700; margin-bottom: 4px; }
  .upload-sub { font-size: 12px; color: var(--text2); }
  .bookmaker-badges { display: flex; gap: 8px; justify-content: center; margin-top: 14px; }
  .badge { padding: 3px 10px; border-radius: 20px; font-size: 10px; font-weight: 700; font-family: var(--font-head); letter-spacing: 0.2px; }
  .badge-winamax { background: rgba(255,87,112,0.12); color: var(--loss); border: 1px solid rgba(255,87,112,0.25); }
  .badge-betclic { background: rgba(87,200,255,0.12); color: var(--accent2); border: 1px solid rgba(87,200,255,0.25); }
  /* form fields */
  .field-group { margin-bottom: 12px; }
  .field-label { font-size: 10px; color: var(--text2); font-weight: 600; letter-spacing: 0.2px; text-transform: uppercase; margin-bottom: 5px; }
  .field-input { width: 100%; background: var(--surface2); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 9px 11px; color: var(--text); font-family: var(--font-body); font-size: 13px; outline: none; transition: border-color 0.2s; appearance: none; }
  .field-input:focus { border-color: var(--accent); }
  select.field-input { cursor: pointer; }
  .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  /* buttons */
  .btn-primary { width: 100%; padding: 14px; background: var(--accent); color: #0a0a0f; border: none; border-radius: var(--radius); font-family: var(--font-head); font-size: 14px; font-weight: 800; cursor: pointer; transition: all 0.2s; }
  .btn-primary:hover { background: #d8ff70; transform: translateY(-1px); }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  .btn-secondary { width: 100%; padding: 12px; background: transparent; color: var(--text2); border: 1px solid var(--border); border-radius: var(--radius); font-family: var(--font-head); font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.2s; margin-top: 8px; }
  .btn-secondary:hover { border-color: var(--text2); color: var(--text); }
  /* spinner */
  .spinner { width: 36px; height: 36px; border: 3px solid var(--border2); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.8s linear infinite; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .analyzing-text { font-family: var(--font-head); font-size: 14px; font-weight: 700; color: var(--accent); }
  .analyzing-sub { font-size: 12px; color: var(--text2); }
  /* bet row */
  .bet-row { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 10px 12px; margin-bottom: 7px; cursor: pointer; transition: border-color 0.15s; display: flex; align-items: center; gap: 10px; }
  .bet-row:active { opacity: 0.85; }
  .bet-row-left { flex: 1; min-width: 0; }
  .bet-row-type { font-family: var(--font-head); font-size: 12px; font-weight: 700; color: var(--text); margin-bottom: 2px; display: flex; align-items: center; gap: 5px; }
  .bet-row-meta { font-size: 11px; color: var(--text3); }
  .bet-row-right { display: flex; flex-direction: column; align-items: flex-end; gap: 3px; flex-shrink: 0; }
  .bet-row-odd { font-family: var(--font-head); font-size: 12px; font-weight: 700; color: var(--accent); }
  .bet-row-gain { font-family: var(--font-head); font-size: 13px; font-weight: 800; }
  .bet-row-result { width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; flex-shrink: 0; font-family: var(--font-head); }
  .bet-row-result.win { background: rgba(87,255,158,0.15); color: var(--win); }
  .bet-row-result.loss { background: rgba(255,87,112,0.12); color: var(--loss); }
  /* tags */
  .tag-selector { display: flex; flex-wrap: wrap; gap: 7px; margin-bottom: 12px; }
  .tag-btn { padding: 8px 14px; border-radius: var(--radius-sm); border: 2px solid var(--border); background: var(--surface2); cursor: pointer; font-family: var(--font-head); font-size: 12px; font-weight: 700; color: var(--text2); transition: all 0.2s; }
  .tag-btn.selected { border-color: var(--accent); background: rgba(200,255,87,0.1); color: var(--accent); }
  .tag-edit-row { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
  .tag-edit-chip { padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; font-family: var(--font-head); border: 1.5px solid var(--border); background: var(--surface2); color: var(--text2); cursor: pointer; transition: all 0.15s; }
  .tag-edit-chip.active { border-color: var(--accent); background: rgba(200,255,87,0.12); color: var(--accent); }
  /* pills/chips */
  .freebet-tag { background: rgba(87,200,255,0.12); color: var(--accent2); border: 1px solid rgba(87,200,255,0.25); border-radius: 6px; font-size: 10px; font-weight: 700; padding: 2px 6px; font-family: var(--font-head); white-space: nowrap; }
  .result-chip { padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; font-family: var(--font-head); text-transform: uppercase; }
  .result-win { background: rgba(87,255,158,0.12); color: var(--win); border: 1px solid rgba(87,255,158,0.25); }
  .result-loss { background: rgba(255,87,112,0.12); color: var(--loss); border: 1px solid rgba(255,87,112,0.25); }
  /* filter rows */
  .date-filter-row { display: flex; gap: 5px; overflow-x: auto; padding-bottom: 4px; margin-bottom: 8px; scrollbar-width: none; }
  .date-filter-row::-webkit-scrollbar { display: none; }
  .date-pill { padding: 4px 11px; border-radius: 20px; font-size: 11px; font-weight: 600; white-space: nowrap; cursor: pointer; border: 1px solid var(--border); background: var(--surface); color: var(--text2); font-family: var(--font-head); transition: all 0.15s; flex-shrink: 0; }
  .date-pill.active { border-color: var(--accent2); background: rgba(87,200,255,0.1); color: var(--accent2); }
  .filter-scroll { display: flex; gap: 5px; overflow-x: auto; padding-bottom: 4px; margin-bottom: 12px; scrollbar-width: none; }
  .filter-scroll::-webkit-scrollbar { display: none; }
  .filter-chip { padding: 5px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; white-space: nowrap; cursor: pointer; border: 1px solid var(--border); background: var(--surface); color: var(--text2); font-family: var(--font-head); transition: all 0.2s; flex-shrink: 0; }
  .filter-chip.active { border-color: var(--accent); background: rgba(200,255,87,0.1); color: var(--accent); }
  /* freebet toggle */
  .freebet-toggle { display: flex; align-items: center; gap: 10px; background: rgba(87,200,255,0.05); border: 1px solid rgba(87,200,255,0.18); border-radius: var(--radius-sm); padding: 10px 12px; cursor: pointer; margin-bottom: 12px; user-select: none; }
  .freebet-box { width: 17px; height: 17px; border-radius: 4px; border: 2px solid var(--border2); background: var(--surface2); display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.15s; }
  .freebet-box.checked { border-color: var(--accent2); background: var(--accent2); }
  .freebet-toggle-label { font-family: var(--font-head); font-size: 12px; font-weight: 700; color: var(--text2); }
  .freebet-toggle.active .freebet-toggle-label { color: var(--accent2); }
  /* modal */
  .modal-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.75); z-index: 200; display: flex; align-items: flex-end; animation: fadeIn 0.2s; }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .modal-sheet { background: var(--surface); border-radius: 22px 22px 0 0; width: 100%; max-width: 430px; margin: 0 auto; max-height: 92vh; overflow-y: auto; padding-bottom: 36px; animation: slideUp 0.28s cubic-bezier(0.16,1,0.3,1); scrollbar-width: none; position: relative; }
  .modal-sheet::-webkit-scrollbar { display: none; }
  @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
  .modal-handle { width: 38px; height: 4px; background: var(--border2); border-radius: 2px; margin: 10px auto 0; }
  .modal-header { padding: 14px 18px 0; }
  .modal-title { font-family: var(--font-head); font-size: 18px; font-weight: 800; margin-bottom: 3px; }
  .modal-sub { font-size: 12px; color: var(--text2); }
  .modal-body { padding: 14px 18px 0; }
  .modal-close { position: absolute; top: 14px; right: 14px; width: 30px; height: 30px; border-radius: 50%; background: var(--surface2); border: 1px solid var(--border); color: var(--text2); cursor: pointer; font-size: 13px; display: flex; align-items: center; justify-content: center; z-index: 10; }
  .detail-section { margin-bottom: 18px; }
  .detail-section-title { font-size: 10px; color: var(--text3); text-transform: uppercase; letter-spacing: 0.7px; font-weight: 600; margin-bottom: 8px; }
  .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; }
  .detail-item { background: var(--surface2); border-radius: var(--radius-sm); padding: 9px 11px; }
  .detail-item-label { font-size: 10px; color: var(--text3); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px; }
  .detail-item-value { font-family: var(--font-head); font-size: 14px; font-weight: 700; }
  .detail-item.full { grid-column: 1/-1; }
  .selection-detail { background: var(--surface2); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 10px; margin-bottom: 7px; }
  .sel-top { display: flex; justify-content: space-between; align-items: flex-start; }
  .sel-team { font-family: var(--font-head); font-size: 13px; font-weight: 700; margin-bottom: 2px; }
  .sel-type { font-size: 11px; color: var(--text2); }
  .sel-odd-big { font-family: var(--font-head); font-size: 20px; font-weight: 800; color: var(--accent); flex-shrink: 0; margin-left: 8px; }
  /* stats */
  .stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px; }
  .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 12px; }
  .stat-card.full { grid-column: 1/-1; }
  .stat-label { font-size: 10px; color: var(--text2); text-transform: uppercase; letter-spacing: 0.7px; margin-bottom: 5px; font-weight: 600; }
  .stat-value { font-family: var(--font-head); font-size: 24px; font-weight: 800; line-height: 1; }
  .stat-value.positive { color: var(--win); }
  .stat-value.negative { color: var(--loss); }
  .stat-value.neutral { color: var(--accent); }
  .stat-sub { font-size: 11px; color: var(--text3); margin-top: 3px; }
  /* data table */
  .data-table { width: 100%; border-collapse: collapse; font-size: 12px; }
  .data-table th { font-family: var(--font-head); font-size: 10px; font-weight: 700; color: var(--text3); text-transform: uppercase; letter-spacing: 0.5px; padding: 5px 7px; text-align: left; border-bottom: 1px solid var(--border); }
  .data-table td { padding: 7px; border-bottom: 1px solid var(--border); color: var(--text2); vertical-align: middle; }
  .data-table tr:last-child td { border-bottom: none; }
  .data-table .num { font-family: var(--font-head); font-weight: 700; color: var(--text); }
  /* bar chart */
  .bar-chart { display: flex; flex-direction: column; gap: 7px; }
  .bar-row { display: flex; align-items: center; gap: 9px; }
  .bar-label { font-size: 11px; color: var(--text2); width: 74px; flex-shrink: 0; text-align: right; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .bar-track { flex: 1; height: 7px; background: var(--surface2); border-radius: 3px; overflow: hidden; }
  .bar-fill { height: 100%; border-radius: 3px; transition: width 0.8s cubic-bezier(0.16,1,0.3,1); }
  .bar-val { font-family: var(--font-head); font-size: 11px; font-weight: 700; width: 50px; text-align: right; flex-shrink: 0; }
  /* player rows */
  .player-row { display: flex; align-items: center; gap: 9px; padding: 9px 11px; background: var(--surface2); border-radius: var(--radius-sm); margin-bottom: 5px; }
  .player-rank { font-family: var(--font-head); font-size: 15px; font-weight: 800; width: 22px; flex-shrink: 0; }
  .player-avatar { width: 30px; height: 30px; border-radius: 50%; background: var(--border2); display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0; }
  .player-info { flex: 1; min-width: 0; }
  .player-name { font-family: var(--font-head); font-size: 12px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .player-meta { font-size: 10px; color: var(--text2); margin-top: 2px; }
  .player-profit { font-family: var(--font-head); font-size: 14px; font-weight: 700; flex-shrink: 0; }
  /* tab switch */
  .tab-switch { display: flex; background: var(--surface2); border-radius: var(--radius-sm); padding: 3px; margin-bottom: 12px; gap: 3px; }
  .tab-switch-btn { flex: 1; padding: 7px; border: none; border-radius: 7px; background: transparent; color: var(--text2); font-family: var(--font-head); font-size: 10px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
  .tab-switch-btn.active { background: var(--surface); color: var(--text); }
  /* multi upload */
  .multi-upload-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; margin-bottom: 12px; }
  .multi-thumb { position: relative; border-radius: var(--radius-sm); overflow: hidden; background: var(--surface2); border: 1px solid var(--border); aspect-ratio: 9/16; }
  .multi-thumb img { width: 100%; height: 100%; object-fit: cover; opacity: 0.75; }
  .multi-thumb-badge { position: absolute; top: 5px; left: 5px; background: rgba(10,10,15,0.8); border-radius: 7px; padding: 2px 6px; font-size: 10px; font-weight: 800; font-family: var(--font-head); color: var(--accent); }
  .multi-thumb-remove { position: absolute; top: 5px; right: 5px; width: 20px; height: 20px; border-radius: 50%; background: rgba(255,87,112,0.85); border: none; color: #fff; font-size: 10px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
  .add-more-zone { border: 2px dashed var(--border2); border-radius: var(--radius-sm); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; cursor: pointer; aspect-ratio: 9/16; font-size: 20px; color: var(--text3); position: relative; }
  .add-more-zone input { position: absolute; inset: 0; opacity: 0; cursor: pointer; }
  /* step progress */
  .step-progress { display: flex; gap: 5px; margin-bottom: 14px; }
  .step-dot { flex: 1; height: 3px; border-radius: 2px; background: var(--border); transition: background 0.3s; }
  .step-dot.done { background: var(--accent); }
  .step-dot.active { background: var(--accent2); }
  /* stat section collapsible */
  .stat-section { margin-bottom: 3px; }
  .stat-section-header { display: flex; align-items: center; justify-content: space-between; cursor: pointer; padding: 9px 0 7px; user-select: none; border-bottom: 1px solid var(--border); }
  .stat-section-header:hover .stat-section-title { color: var(--accent); }
  .stat-section-title { font-family: var(--font-head); font-size: 14px; font-weight: 800; letter-spacing: -0.2px; transition: color 0.15s; }
  .stat-section-arrow { font-size: 11px; color: var(--text3); transition: transform 0.2s; }
  .stat-section-arrow.open { transform: rotate(180deg); }
  .stat-section-body { overflow: hidden; transition: max-height 0.3s ease; }
  .stat-section-body.open { max-height: 2000px; padding-top: 10px; }
  .stat-section-body.closed { max-height: 0; }
  /* streak */
  .streak-dot { width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 800; font-family: var(--font-head); flex-shrink: 0; }
  .streak-dot.win { background: rgba(87,255,158,0.2); color: var(--win); }
  .streak-dot.loss { background: rgba(255,87,112,0.15); color: var(--loss); }
  /* competition detect */
  .competition-detect { display: flex; align-items: flex-start; gap: 9px; background: rgba(87,200,255,0.06); border: 1px solid rgba(87,200,255,0.15); border-radius: var(--radius-sm); padding: 9px 11px; margin-bottom: 10px; }
  .competition-detect-label { font-size: 10px; color: var(--accent2); margin-bottom: 2px; }
  .competition-detect-name { font-family: var(--font-head); font-size: 13px; font-weight: 700; color: var(--text); }
  /* validation */
  .validation-title { font-family: var(--font-head); font-size: 18px; font-weight: 800; }
  /* login */
  .login-screen { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 28px 20px; background: var(--bg); max-width: 430px; margin: 0 auto; }
  .login-logo { font-family: var(--font-head); font-size: 34px; font-weight: 800; letter-spacing: -1px; margin-bottom: 4px; }
  .login-logo span { color: var(--accent); }
  .login-tagline { font-size: 12px; color: var(--text3); margin-bottom: 36px; text-align: center; }
  .login-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; width: 100%; margin-bottom: 10px; }
  .login-card-title { font-family: var(--font-head); font-size: 17px; font-weight: 800; margin-bottom: 3px; }
  .login-card-sub { font-size: 12px; color: var(--text2); margin-bottom: 18px; line-height: 1.5; }
  .login-input { width: 100%; background: var(--surface2); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 12px 14px; color: var(--text); font-family: var(--font-body); font-size: 14px; outline: none; transition: border-color 0.2s; margin-bottom: 9px; }
  .login-input:focus { border-color: var(--accent); }
  .login-input::placeholder { color: var(--text3); }
  .login-error { background: rgba(255,87,112,0.08); border: 1px solid rgba(255,87,112,0.25); border-radius: var(--radius-sm); padding: 9px 12px; font-size: 12px; color: var(--loss); margin-bottom: 9px; }
  .login-toggle { text-align: center; font-size: 12px; color: var(--text2); margin-top: 4px; }
  .login-toggle button { background: none; border: none; color: var(--accent); font-size: 12px; font-weight: 700; cursor: pointer; padding: 0 4px; font-family: var(--font-body); }
  .invite-info { background: rgba(200,255,87,0.05); border: 1px solid rgba(200,255,87,0.12); border-radius: var(--radius-sm); padding: 9px 12px; font-size: 11px; color: var(--text2); line-height: 1.6; margin-bottom: 14px; }
  .invite-info strong { color: var(--accent); font-family: var(--font-head); }
  /* insights */
  .insight-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 12px; margin-bottom: 9px; display: flex; gap: 11px; align-items: flex-start; }
  .insight-icon { width: 34px; height: 34px; border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
  .icon-positive { background: rgba(87,255,158,0.12); }
  .icon-negative { background: rgba(255,87,112,0.12); }
  .icon-neutral { background: rgba(200,255,87,0.12); }
  .insight-text { flex: 1; }
  .insight-title { font-family: var(--font-head); font-size: 13px; font-weight: 700; margin-bottom: 2px; }
  .insight-sub { font-size: 11px; color: var(--text2); line-height: 1.4; }
  .insight-roi { font-family: var(--font-head); font-size: 16px; font-weight: 800; flex-shrink: 0; }
  /* ai panel */
  .ai-panel { background: linear-gradient(135deg, rgba(200,255,87,0.03), rgba(87,200,255,0.03)); border: 1px solid rgba(200,255,87,0.15); border-radius: var(--radius); padding: 18px; margin-bottom: 14px; }
  .ai-panel-title { font-family: var(--font-head); font-size: 17px; font-weight: 800; margin-bottom: 5px; display: flex; align-items: center; gap: 7px; flex-wrap: wrap; }
  .ai-panel-sub { font-size: 12px; color: var(--text2); line-height: 1.6; margin-bottom: 14px; }
  .ai-premium-badge { background: linear-gradient(90deg, #c8ff57, #57c8ff); color: #0a0a0f; font-size: 9px; font-weight: 800; padding: 3px 7px; border-radius: 5px; font-family: var(--font-head); letter-spacing: 0.2px; }
  .ai-features { display: flex; flex-direction: column; gap: 7px; margin-bottom: 14px; }
  .ai-feature { display: flex; align-items: center; gap: 7px; font-size: 12px; color: var(--text2); }
  .ai-feature-icon { color: var(--accent); font-size: 13px; flex-shrink: 0; }
  .ai-unlock-btn { width: 100%; padding: 14px; background: linear-gradient(90deg, #c8ff57, #57c8ff); color: #0a0a0f; border: none; border-radius: var(--radius); font-family: var(--font-head); font-size: 14px; font-weight: 800; cursor: pointer; transition: all 0.2s; }
  .ai-unlock-btn:hover { opacity: 0.9; transform: translateY(-1px); }
  .ai-price { font-size: 11px; text-align: center; color: var(--text3); margin-top: 7px; }
  .ai-response { background: var(--surface2); border: 1px solid var(--border); border-radius: var(--radius); padding: 14px; margin-top: 10px; }
  .ai-avatar { width: 30px; height: 30px; border-radius: 50%; background: linear-gradient(135deg, #c8ff57, #57c8ff); display: flex; align-items: center; justify-content: center; font-size: 13px; flex-shrink: 0; }
  .ai-response-title { font-family: var(--font-head); font-size: 13px; font-weight: 700; }
  .ai-response-body { font-size: 12px; color: var(--text2); line-height: 1.8; white-space: pre-wrap; }
  .ai-response-body strong { color: var(--text); font-weight: 700; }
  .ai-response-body em { color: var(--accent2); font-style: italic; }
  .qa-bubble.ai strong { color: var(--text); font-weight: 700; }
  .qa-bubble.ai em { color: var(--accent2); font-style: italic; }
  .ai-typing { display: flex; gap: 4px; align-items: center; padding: 8px 0; justify-content: center; }
  .ai-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--accent); animation: pulse 1.2s infinite; }
  .ai-dot:nth-child(2) { animation-delay: 0.2s; }
  .ai-dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes pulse { 0%,100% { opacity: 0.3; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.1); } }
  /* success */
  .success-screen { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 44px 20px; text-align: center; gap: 10px; }
  .success-icon { font-size: 52px; animation: pop 0.5s cubic-bezier(0.16,1,0.3,1); }
  @keyframes pop { 0% { transform: scale(0); } 80% { transform: scale(1.1); } 100% { transform: scale(1); } }
  .success-title { font-family: var(--font-head); font-size: 22px; font-weight: 800; }
  .success-sub { font-size: 13px; color: var(--text2); max-width: 220px; }
  /* errors */
  .error-msg { background: rgba(255,87,112,0.08); border: 1px solid rgba(255,87,112,0.25); border-radius: var(--radius-sm); padding: 10px; font-size: 12px; color: var(--loss); margin-bottom: 10px; line-height: 1.5; }
  /* empty state */
  .empty-state { text-align: center; padding: 44px 20px; color: var(--text3); }
  .empty-state .e-icon { font-size: 36px; margin-bottom: 10px; }
  .empty-state .e-title { font-family: var(--font-head); font-size: 15px; font-weight: 700; color: var(--text2); margin-bottom: 5px; }
  .empty-state .e-sub { font-size: 12px; }
  /* profile modal */
  .profile-team-list { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
  .profile-team-chip { padding: 5px 11px; border-radius: 20px; font-size: 11px; font-weight: 700; font-family: var(--font-head); border: 1.5px solid var(--border); background: var(--surface2); color: var(--text2); cursor: pointer; }
  .profile-team-chip.active { border-color: var(--accent); background: rgba(200,255,87,0.1); color: var(--accent); }
  /* Q&A Chat */
  .qa-input-row { display: flex; gap: 8px; margin-top: 10px; }
  .qa-input { flex: 1; background: var(--surface2); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 10px 12px; color: var(--text); font-family: var(--font-body); font-size: 13px; outline: none; }
  .qa-input:focus { border-color: var(--accent); }
  .qa-send-btn { background: var(--accent); color: #0a0a0f; border: none; border-radius: var(--radius-sm); padding: 10px 14px; font-family: var(--font-head); font-size: 12px; font-weight: 800; cursor: pointer; flex-shrink: 0; }
  .qa-send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .qa-bubble { padding: 10px 12px; border-radius: var(--radius-sm); margin-bottom: 8px; font-size: 12px; line-height: 1.6; }
  .qa-bubble.user { background: rgba(200,255,87,0.08); border: 1px solid rgba(200,255,87,0.15); color: var(--text); font-family: var(--font-head); font-weight: 600; }
  .qa-bubble.ai { background: var(--surface2); border: 1px solid var(--border); color: var(--text2); white-space: pre-wrap; }
  .qa-limit-badge { background: rgba(255,153,87,0.1); border: 1px solid rgba(255,153,87,0.25); border-radius: var(--radius-sm); padding: 8px 12px; font-size: 11px; color: var(--fun); text-align: center; margin-top: 8px; }
  /* carte bettrack */
  .bettrack-card-wrap { border-radius: var(--radius); overflow: hidden; margin-bottom: 14px; }
  /* objectifs */
  .objectif-progress-track { height: 10px; background: var(--surface2); border-radius: 5px; overflow: hidden; margin: 8px 0; }
  .objectif-progress-fill { height: 100%; border-radius: 5px; background: linear-gradient(90deg, var(--accent), var(--accent2)); transition: width 0.8s cubic-bezier(0.16,1,0.3,1); }
  /* image-preview */
  .image-preview-wrap { position: relative; border-radius: var(--radius); overflow: hidden; margin-bottom: 10px; background: var(--surface2); border: 1px solid var(--border); }
  .image-preview-wrap img { width: 100%; max-height: 200px; object-fit: cover; display: block; opacity: 0.7; }
  /* selection item */
  .selection-item { background: var(--surface2); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 9px 11px; margin-bottom: 7px; display: flex; align-items: center; justify-content: space-between; }
  .selection-left { flex: 1; }
  .selection-team { font-size: 12px; font-weight: 500; display: flex; align-items: center; gap: 5px; flex-wrap: wrap; }
  .selection-type { font-size: 10px; color: var(--text2); margin-top: 2px; }
  .selection-odd { font-family: var(--font-head); font-size: 15px; font-weight: 700; color: var(--accent); margin-left: 10px; flex-shrink: 0; }
  .scorer-tag { background: rgba(212,170,255,0.12); color: var(--scorer); border: 1px solid rgba(212,170,255,0.25); border-radius: 5px; font-size: 9px; font-weight: 700; padding: 2px 5px; font-family: var(--font-head); white-space: nowrap; }
  .combo-total { background: rgba(200,255,87,0.05); border: 1px solid rgba(200,255,87,0.12); border-radius: 8px; padding: 9px 12px; margin-top: 7px; display: flex; justify-content: space-between; align-items: center; }
  .bankroll-input { background: var(--surface2); border: 1px solid var(--border); border-radius: 7px; padding: 5px 9px; color: var(--text); font-family: var(--font-head); font-size: 12px; font-weight: 700; width: 80px; outline: none; text-align: center; }
  .bankroll-input:focus { border-color: var(--accent); }
`;

// ─── SUPABASE ─────────────────────────────────────────────────────────────────
const SUPABASE_URL = "https://tpebejuthrbkbjwbdjqz.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwZWJlanV0aHJia2Jqd2JkanF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxMDM4MjEsImV4cCI6MjA4ODY3OTgyMX0.oysT_KLsQhjJmdKSWAwKgqgU0p66Hz0WNNn-1sN19Tk";
const INVITE_CODE = "BETTRACK2026";
const sbH = { "Content-Type":"application/json","apikey":SUPABASE_ANON,"Authorization":`Bearer ${SUPABASE_ANON}` };
async function sbGet(t,p=""){const r=await fetch(`${SUPABASE_URL}/rest/v1/${t}?${p}`,{headers:{...sbH,"Prefer":"return=representation"}});if(!r.ok)throw new Error(await r.text());return r.json();}
async function sbPost(t,b){const r=await fetch(`${SUPABASE_URL}/rest/v1/${t}`,{method:"POST",headers:{...sbH,"Prefer":"return=representation"},body:JSON.stringify(b)});if(!r.ok)throw new Error(await r.text());return r.json();}
async function sbDelete(t,p=""){const r=await fetch(`${SUPABASE_URL}/rest/v1/${t}?${p}`,{method:"DELETE",headers:sbH});if(!r.ok)throw new Error(await r.text());}
async function sbPatch(t,p="",b={}){const r=await fetch(`${SUPABASE_URL}/rest/v1/${t}?${p}`,{method:"PATCH",headers:{...sbH,"Prefer":"return=representation"},body:JSON.stringify(b)});if(!r.ok)throw new Error(await r.text());return r.json();}

// ─── COMPETITION NORMALISATION ────────────────────────────────────────────────
const COMP_ALIASES = {
  "UEFA Champions League":"Champions League","UCL":"Champions League","LDC":"Champions League","Ligue des Champions":"Champions League","Champion League":"Champions League","Champions league":"Champions League","ligue des champions":"Champions League",
  "UEFA Europa League":"Europa League","UEL":"Europa League",
  "UEFA Conference League":"Conference League","UECL":"Conference League",
  "English Premier League":"Premier League","EPL":"Premier League","Barclays Premier League":"Premier League",
  "Bundesliga 1":"Bundesliga","1. Bundesliga":"Bundesliga",
  "Serie A TIM":"Serie A",
  "LaLiga":"La Liga","La Liga Santander":"La Liga","Liga":"La Liga",
  "Ligue 1 Uber Eats":"Ligue 1","Ligue 1 McDonald's":"Ligue 1","Ligue1":"Ligue 1",
  "ATP Masters 1000":"ATP Masters","WTA 1000":"WTA",
  "Coupe de France":"Coupe de France","CDL":"Coupe de la Ligue",
};
function normalizeCompetition(raw) {
  if (!raw) return raw;
  const trimmed = raw.trim();
  return COMP_ALIASES[trimmed] || trimmed;
}

// ─── TEAM NORMALISATION ───────────────────────────────────────────────────────
const TEAM_ALIASES = {
  // PSG
  "Paris Saint-Germain":"PSG","Paris SG":"PSG","Paris Saint Germain":"PSG",
  "Paris":"PSG","Paris FC":"Paris FC",
  // OM
  "Olympique de Marseille":"Marseille","Olympique Marseille":"Marseille","OM":"Marseille",
  // OL
  "Olympique Lyonnais":"Lyon","Olympique de Lyon":"Lyon","OL":"Lyon",
  // Barça
  "FC Barcelone":"Barcelone","FC Barcelona":"Barcelone","Barcelona":"Barcelone","Barça":"Barcelone","Barca":"Barcelone",
  // Real
  "Real Madrid CF":"Real Madrid","Real Madrid C.F.":"Real Madrid",
  // Man City
  "Manchester City":"Man City","Manchester City FC":"Man City",
  // Man Utd
  "Manchester United":"Man Utd","Manchester United FC":"Man Utd","Man United":"Man Utd",
  // Liverpool
  "Liverpool FC":"Liverpool",
  // Arsenal
  "Arsenal FC":"Arsenal",
  // Chelsea
  "Chelsea FC":"Chelsea",
  // Tottenham
  "Tottenham Hotspur":"Tottenham","Tottenham Hotspur FC":"Tottenham","Spurs":"Tottenham",
  // Bayern
  "FC Bayern München":"Bayern Munich","FC Bayern Munich":"Bayern Munich","Bayern München":"Bayern Munich","Bayern":"Bayern Munich",
  // BVB
  "Borussia Dortmund":"Dortmund","BVB":"Dortmund",
  // Juventus
  "Juventus FC":"Juventus","Juventus Turin":"Juventus",
  // Inter
  "Inter Milan":"Inter","FC Internazionale":"Inter","Internazionale":"Inter",
  // AC Milan
  "AC Milan":"Milan","AC Milan FC":"Milan",
  // Atlético
  "Atlético de Madrid":"Atletico","Atletico Madrid":"Atletico","Atlético Madrid":"Atletico",
  // Ajax
  "AFC Ajax":"Ajax",
  // Porto
  "FC Porto":"Porto",
  // Benfica
  "SL Benfica":"Benfica",
  // Celtic
  "Celtic FC":"Celtic",
  // Rangers
  "Rangers FC":"Rangers",
  // Nice
  "OGC Nice":"Nice",
  // Monaco
  "AS Monaco":"Monaco",
  // Lens
  "RC Lens":"Lens",
  // Rennes
  "Stade Rennais":"Rennes","Stade Rennais FC":"Rennes",
  // Lille
  "LOSC Lille":"Lille","LOSC":"Lille",
  // Brest
  "Stade Brestois":"Brest","Stade Brestois 29":"Brest",
  // Sevilla
  "Sevilla FC":"Sevilla","Séville":"Sevilla",
  // Valencia
  "Valencia CF":"Valencia",
  // Villarreal
  "Villarreal CF":"Villarreal",
};

function normalizeTeam(raw) {
  if (!raw) return raw;
  const t = raw.trim();
  return TEAM_ALIASES[t] || t;
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const fmt = (n,d=2) => (n||0).toFixed(d);
const fmtEuro = n => `${n>=0?'+':''}${fmt(n)}€`;
const fmtROI = (profit, stake) => stake > 0 ? `${(profit/stake*100)>=0?'+':''}${fmt(profit/stake*100,1)}%` : "—";

function betProfit(bet) {
  if (bet.is_freebet) return bet.result==="win" ? bet.actual_win : 0;
  return bet.actual_win - bet.stake;
}
function betRealStake(bet) { return bet.is_freebet ? 0 : bet.stake; }

// Weighted avg odd — exclude MyMatch bets (no meaningful odd) and very small stakes
function computeWeightedAvgOdd(bets) {
  const valid = bets.filter(b => b.bet_structure !== "mymatch" && b.total_odd && b.total_odd > 1 && b.total_odd < 100 && b.stake > 0);
  if (!valid.length) return null;
  const totalStake = valid.reduce((a,b)=>a+betRealStake(b),0);
  if (!totalStake) return null;
  const weighted = valid.reduce((a,b)=>a+b.total_odd*betRealStake(b),0);
  return weighted/totalStake;
}

function computeStats(bets) {
  const totalStake = bets.reduce((a,b)=>a+betRealStake(b),0);
  const profit = bets.reduce((a,b)=>a+betProfit(b),0);
  const wins = bets.filter(b=>b.result==="win").length;
  const rate = bets.length>0?(wins/bets.length)*100:0;
  const roi = totalStake>0?(profit/totalStake)*100:null;
  const avgOdd = computeWeightedAvgOdd(bets);
  return { totalStake, profit, wins, rate, total:bets.length, roi, avgOdd };
}

function normalizePlayerName(raw) {
  if (!raw) return null;
  let s = raw.replace(/\(.*?\)/g,"").trim();
  if (s.toLowerCase().includes(" ou ")) s = s.split(/\s+ou\s+/i)[0].trim();
  const parts = s.split(/\s+/);
  if (parts.length===1) return parts[0];
  const first=parts[0], rest=parts.slice(1).join(" ");
  if (first.endsWith(".")&&first.length<=3) return `${first}${rest}`;
  if (first.length===1) return `${first}.${rest}`;
  return `${first[0].toUpperCase()}.${rest}`;
}

function hasScorer(bet) { return bet.selections?.some(s=>s.sel_type==="Buteur/Passeur"||s.sel_type==="Doublé / Triplé"||s.selection_type==="buteur"||s.selection_type==="joueur décisif"); }

function getPlayerStats(bets) {
  const map = {};
  bets.forEach(bet=>{
    bet.selections?.forEach(sel=>{
      if(!sel.player) return;
      const k=sel.player, disp=sel.player_display||sel.player;
      if(!map[k]) map[k]={player:k,display:disp,wins:0,losses:0,profit:0,count:0};
      if(disp.length>map[k].display.length) map[k].display=disp;
      map[k].count++;
      const p=betProfit(bet);
      if(bet.result==="win"){map[k].wins++;map[k].profit+=p;}
      else{map[k].losses++;map[k].profit+=p;}
    });
  });
  return Object.values(map);
}

const MONTH_SHORT=["janv","févr","mars","avr","mai","juin","juil","août","sept","oct","nov","déc"];
function fmtMonthLabel(key){const[y,m]=key.split("-");return `${MONTH_SHORT[parseInt(m,10)-1]}-${y.slice(2)}`;}
function monthKey(ds){const d=new Date(ds);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`;}

function isToday(ds){const t=new Date(),d=new Date(ds);return d.toDateString()===t.toDateString();}
function isThisWeek(ds){const n=new Date(),d=new Date(ds),s=new Date(n);s.setDate(n.getDate()-n.getDay()+1);s.setHours(0,0,0,0);return d>=s&&d<=n;}
function isThisMonth(ds){const n=new Date(),d=new Date(ds);return d.getMonth()===n.getMonth()&&d.getFullYear()===n.getFullYear();}

function getStreaks(bets){
  const sorted=[...bets].sort((a,b)=>new Date(a.date)-new Date(b.date));
  const results=sorted.map(b=>b.result);
  let cur=1;
  for(let i=results.length-1;i>0;i--){if(results[i]===results[i-1])cur++;else break;}
  const curType=results[results.length-1];
  let bestWin=0,bestLoss=0,tmp=1;
  for(let i=1;i<results.length;i++){
    if(results[i]===results[i-1])tmp++;else tmp=1;
    if(results[i]==="win"&&tmp>bestWin)bestWin=tmp;
    if(results[i]==="loss"&&tmp>bestLoss)bestLoss=tmp;
  }
  if(results.length>0){if(results[0]==="win"&&1>bestWin)bestWin=1;if(results[0]==="loss"&&1>bestLoss)bestLoss=1;}
  const last10=sorted.slice(-10).map(b=>b.result);
  return{current:cur,currentType:curType,bestWin,bestLoss,last10};
}

function normalizeSelType(raw){
  if(!raw) return "Autre";
  const r=raw.toLowerCase();
  // Doublé/triplé/quadruplé — y compris "marque 2 buts", "marque 3 buts", "2+ buts", "2 buts ou plus"
  if(r.includes("doublé")||r.includes("triplé")||r.includes("quadruplé")) return "Doublé / Triplé";
  if(/marque\s*[23]\s*buts?/.test(r)||/[23]\+?\s*buts?\s*(ou\s*plus)?/.test(r)||/marque\s*au\s*moins\s*[23]/.test(r)) return "Doublé / Triplé";
  // Joueur décisif / passeur / buteur (1 but, marque exactement 1)
  if(r.includes("passeur")||r.includes("passe décisive")) return "Buteur/Passeur";
  if(r.includes("joueur décisif")) return "Buteur/Passeur";
  if(/marque\s*(exactement\s*)?1\s*but/.test(r)||r.includes("buteur")||r.includes("marquer au moins 1")||r.includes("à marquer")) return "Buteur/Passeur";
  if(r.includes("scorer")) return "Buteur/Passeur";
  // Score exact MT
  if(r.includes("score exact")&&(r.includes("mi-temps")||r.includes("mt")||r.includes("1ère")||r.includes("2ème")||r.includes("première")||r.includes("deuxième"))) return "Score Exact MT";
  if(r.includes("score exact")||r.includes("score précis")||r.includes("correct score")) return "Score Exact";
  if(r.includes("qualification")||r.includes("se qualifie")) return "Qualification";
  // Handicap — "écart de buts (handicap)", "victoire -1.5", "handicap -X"
  if(r.includes("handicap")||r.includes("spread")||/\-[\d\.]+\s*(but|goal)/.test(r)) return "Handicap";
  // Écart buts (sans handicap)
  if(r.includes("écart")||r.includes("marge")) return "Écart de buts";
  if(r.includes("première équipe à marquer")||r.includes("1ère équipe à marquer")||r.includes("first team to score")) return "1ère Équipe à Marquer";
  // Nb buts MT
  if((r.includes("buts")||r.includes("but")||r.includes("goal"))&&(r.includes("mi-temps")||r.includes(" mt ")||r.includes("1ère")||r.includes("première mi")||r.includes("2ème")||r.includes("deuxième mi"))) return "Over/Under MT";
  if(r.includes("btts")||r.includes("les deux équipes marquent")||r.includes("both teams to score")||r.includes("les 2 équipes")) return "BTTS";
  if(r.includes("clean sheet")||r.includes("sans encaisser")||r.includes("0 but encaissé")) return "Clean Sheet";
  // Nb buts (over/under)
  if(r.includes("over")||r.includes("under")||/[\+\-][\d\.]+\s*buts?/.test(r)||r.includes("plus de")||r.includes("moins de")||r.includes("au moins")||r.includes("au plus")) return "Over/Under";
  if(r.includes("nb buts")||r.includes("nombre de but")||r.includes("total buts")||r.includes("total goals")) return "Over/Under";
  // Résultat d'équipe
  if(r.includes("victoire")||r.includes("gagne")||r.includes("nul")||r.includes("défaite")||r.includes("match nul")||r.includes("1x2")||r.includes("vainqueur")||r.includes("double chance")) return "Résultat (1N2)";
  if(r.includes("résultat")||r.includes("gagnant")) return "Résultat (1N2)";
  return "Autre";
}

// Full sel type list for UI
const ALL_SEL_TYPES = ["Résultat (1N2)","Over/Under","Over/Under MT","Score Exact","Score Exact MT","Buteur/Passeur","Doublé / Triplé","Handicap","Qualification","Écart de buts","1ère Équipe à Marquer","BTTS","Clean Sheet","Autre"];

// displayStructure: mymatch → simple
function displayStructure(bet){
  if(bet.bet_structure==="mymatch") return "simple";
  return bet.bet_structure||"simple";
}

function getAllSelections(bets){
  const result=[];
  bets.forEach(bet=>{
    (bet.selections||[]).forEach(sel=>{
      // For combiné, use sel_result if available; else fall back to bet result for simple
      const selWin = sel.sel_result==="win" ? true : sel.sel_result==="loss" ? false : (bet.bet_structure!=="combiné" ? bet.result==="win" : null);
      result.push({...sel,_bet:bet,_selType:normalizeSelType(sel.sel_type||sel.selection_type),_competition:bet.competition||"",_selWin:selWin});
    });
  });
  return result;
}

function getSelGroupStatsIndividual(selections,keyFn){
  const map={};
  selections.forEach(sel=>{
    const k=keyFn(sel)||"—";
    if(!map[k]) map[k]={label:k,total:0,wins:0,known:0};
    map[k].total++;
    if(sel._selWin===true){map[k].wins++;map[k].known++;}
    else if(sel._selWin===false){map[k].known++;}
  });
  return Object.values(map).map(g=>({...g,rate:g.known>0?(g.wins/g.known)*100:0})).sort((a,b)=>b.total-a.total);
}

// Vue par équipe/joueur — séparation stricte équipe vs joueur
function getEntityStats(bets, query){
  const q = query.toLowerCase().trim();
  if(!q) return {bets:[], selStats:[], mode:"none"};

  // Detect mode: is query a team (matches team_1/team_2) or a player (matches selections[].player)?
  // Also check normalized name so "PSG" matches "Paris SG" stored as "PSG" after normalization
  const matchesTeam = bets.some(b=>{
    const t1=normalizeTeam(b.team_1||"").toLowerCase();
    const t2=normalizeTeam(b.team_2||"").toLowerCase();
    if(t1.includes(q)||t2.includes(q)) return true;
    // Also check match_team_1/match_team_2 inside selections (for combinés)
    return (b.selections||[]).some(s=>
      normalizeTeam(s.match_team_1||"").toLowerCase().includes(q)||
      normalizeTeam(s.match_team_2||"").toLowerCase().includes(q)||
      normalizeTeam(s.team||"").toLowerCase().includes(q)
    );
  });
  const matchesPlayer = bets.some(b=>(b.selections||[]).some(s=>(s.player||"").toLowerCase().includes(q)||(s.player_display||"").toLowerCase().includes(q)));

  // Prefer player mode if query is player-like (no team match OR explicit player match)
  // If both match → prefer team (teams are broader)
  const mode = matchesPlayer && !matchesTeam ? "player" : "team";

  let matchedBets, entitySels;
  const allSels = getAllSelections(bets);

  if(mode==="player"){
    // Player mode: only bets where a selection has this player
    matchedBets = bets.filter(b=>(b.selections||[]).some(s=>
      (s.player||"").toLowerCase().includes(q)||(s.player_display||"").toLowerCase().includes(q)
    ));
    const allSelsMatched = getAllSelections(matchedBets);
    entitySels = allSelsMatched.filter(s=>
      (s.player||"").toLowerCase().includes(q)||(s.player_display||"").toLowerCase().includes(q)
    );
  } else {
    // Team mode: only bets where team_1 or team_2 matches — NOT via player selections
    matchedBets = bets.filter(b=>{
      const t1=normalizeTeam(b.team_1||"").toLowerCase();
      const t2=normalizeTeam(b.team_2||"").toLowerCase();
      if(t1.includes(q)||t2.includes(q)) return true;
      // Also match via selections match_team_1/match_team_2 or team (for combinés with empty team_1)
      return (b.selections||[]).some(s=>
        normalizeTeam(s.match_team_1||"").toLowerCase().includes(q)||
        normalizeTeam(s.match_team_2||"").toLowerCase().includes(q)||
        (!s.player && normalizeTeam(s.team||"").toLowerCase().includes(q))
      );
    });
    const allSelsMatched = getAllSelections(matchedBets);
    // Keep only selections where team matches AND no player (pure team selections)
    // Exclude joueur/player selections — those belong to player search only
    entitySels = allSelsMatched.filter(s=>
      !s.player && // no player tag
      (
        normalizeTeam(s.team||"").toLowerCase().includes(q)||
        normalizeTeam(s.match_team_1||"").toLowerCase().includes(q)||
        normalizeTeam(s.match_team_2||"").toLowerCase().includes(q)
      )
    );
    // Fallback: old data without team tags → all non-player sels
    if(entitySels.length===0){
      entitySels = allSelsMatched.filter(s=>!s.player);
    }
  }

  const selStats = getSelGroupStatsIndividual(entitySels, s=>s._selType||"autre");
  return {bets:matchedBets, selStats, mode};
}

// MyMatch combo stats: paris simples ET combinés de MyMatch (groupés par match)
function getMymatchCombos(bets){
  const TYPE_ORDER=["Résultat (1N2)","Over/Under","Over/Under MT","BTTS","Handicap","Écart de buts","1ère Équipe à Marquer","Clean Sheet","Score Exact","Score Exact MT","Qualification","Buteur/Passeur","Doublé / Triplé","Autre"];
  const comboCounts={};

  function addCombo(types, isWin, bet, shareOfBet){
    const sorted=[...types].sort((a,b)=>{const ia=TYPE_ORDER.indexOf(a),ib=TYPE_ORDER.indexOf(b);return(ia===-1?99:ia)-(ib===-1?99:ib);});
    if(sorted.length<2) return;
    const key=sorted.join(" + ");
    if(!comboCounts[key]) comboCounts[key]={label:key,total:0,wins:0,profit:0,stake:0};
    comboCounts[key].total++;
    const p=betProfit(bet)*(shareOfBet||1);
    const st=betRealStake(bet)*(shareOfBet||1);
    comboCounts[key].stake+=st;
    if(isWin){comboCounts[key].wins++;comboCounts[key].profit+=p;}
    else{comboCounts[key].profit-=st;}
  }

  // Groupe les sélections d'un pari par match (match_team_1 en priorité, sinon team)
  function groupByMatch(sels){
    const groups={};
    sels.forEach(s=>{
      // Priorité : match_team_1 (nouveau) → team (ancien) → index de la sélection par ordre
      const key = s.match_team_1 || s.team || null;
      if(!key){
        // Pas de team taggée → on tente de regrouper avec la sélection précédente
        // par défaut on crée un groupe "__orphan__" (sera ignoré s'il n'a qu'1 sel)
        const k="__orphan__";
        if(!groups[k]) groups[k]=[];
        groups[k].push(s);
      } else {
        if(!groups[key]) groups[key]=[];
        groups[key].push(s);
      }
    });
    return Object.values(groups).filter(g=>g.length>=2);
  }

  bets.forEach(bet=>{
    const sels=bet.selections||[];
    if(sels.length<2) return;

    // CAS 1 — Paris simple avec 2+ sélections (MyMatch classique sur 1 match)
    if(bet.bet_structure==="simple"||bet.bet_structure==="mymatch"){
      const rawTypes=[...new Set(sels.map(s=>normalizeSelType(s.sel_type||s.selection_type)))];
      addCombo(rawTypes, bet.result==="win", bet, 1);
      return;
    }

    // CAS 2 — Combiné : on cherche si certains matchs ont 2+ sélections (= MyMatch dans combiné)
    if(bet.bet_structure==="combiné"){
      const groups=groupByMatch(sels);
      if(groups.length===0){
        // Aucun match avec 2+ sels → le combiné entier a des sels uniques par match
        // On affiche quand même le combo global si toutes les sels semblent du même match
        // (cas d'un ancien import sans team taggée)
        const distinctTeams=new Set(sels.map(s=>s.match_team_1||s.team||"").filter(Boolean));
        if(distinctTeams.size<=1&&sels.length>=2){
          const rawTypes=[...new Set(sels.map(s=>normalizeSelType(s.sel_type||s.selection_type)))];
          addCombo(rawTypes, bet.result==="win", bet, 1);
        }
        return;
      }
      const share=1/groups.length;
      groups.forEach(grpSels=>{
        const rawTypes=[...new Set(grpSels.map(s=>normalizeSelType(s.sel_type||s.selection_type)))];
        const grpWin=grpSels.every(s=>s.sel_result==="win")||(bet.result==="win"&&grpSels.every(s=>!s.sel_result));
        addCombo(rawTypes, grpWin, bet, share);
      });
    }
  });

  return Object.values(comboCounts)
    .map(c=>({...c,rate:c.total>0?c.wins/c.total*100:0,roi:c.stake>0?(c.profit/c.stake)*100:null}))
    .sort((a,b)=>b.total-a.total)
    .slice(0,12);
}

function getSelGroupStats(selections,keyFn){
  const map={};
  selections.forEach(sel=>{
    const k=keyFn(sel)||"—";
    if(!map[k]) map[k]={label:k,total:0,wins:0};
    map[k].total++;
    if(sel._selWin===true) map[k].wins++;
    else if(sel._selWin===null&&sel._bet.result==="win") map[k].wins++;
  });
  return Object.values(map).map(g=>({...g,rate:g.total>0?(g.wins/g.total)*100:0})).sort((a,b)=>b.total-a.total);
}

function getOddRangeStats(bets){
  // Exclude mymatch and extreme odds
  const valid = bets.filter(b=>b.total_odd&&b.total_odd>1&&b.total_odd<100);
  const ranges=[{label:"1.0 – 1.5",min:1,max:1.5},{label:"1.5 – 2.0",min:1.5,max:2},{label:"2.0 – 3.0",min:2,max:3},{label:"3.0+",min:3,max:9999}];
  return ranges.map(r=>{const sub=valid.filter(b=>b.total_odd>r.min&&b.total_odd<=r.max);const st=computeStats(sub);return{...r,count:sub.length,profit:st.profit,wins:st.wins,rate:st.rate,roi:st.roi};}).filter(r=>r.count>0);
}

// Group combiné selections by match (team pair)
function groupSelsByMatch(bet) {
  if(bet.bet_structure!=="combiné"||(bet.selections||[]).length===0) return null;
  const groups = [];
  const sels = bet.selections;
  // Try to group by sel._match_team if IA tagged it, else use team field
  sels.forEach(sel => {
    const matchKey = sel.match_team_1&&sel.match_team_2
      ? `${sel.match_team_1}|${sel.match_team_2}`
      : sel.team||"__unknown__";
    let group = groups.find(g => g.key === matchKey || g.sels.some(s => s.team === sel.team));
    if (!group) { group = { key: matchKey, team_1: sel.match_team_1||sel.team||"", team_2: sel.match_team_2||"", sels: [] }; groups.push(group); }
    group.sels.push(sel);
  });
  return groups.length > 1 ? groups : null;
}

// Compute combination's competition: only show if all selections share same competition
function comboCompetition(bet) {
  if (!bet.selections?.length) return bet.competition || "";
  const comps = [...new Set(bet.selections.map(s=>s._competition||s.team||"").filter(Boolean))];
  // For non-combined bets, use bet competition
  if (bet.bet_structure === "simple") return bet.competition || "";
  // For combiné/mymatch: only show if all match (or if explicitly set and sels have no comp)
  const selComps = [...new Set((bet.selections||[]).map(s=>normalizeCompetition(s._competition||"")||"").filter(Boolean))];
  if (selComps.length === 1) return selComps[0];
  if (selComps.length === 0) return bet.competition || "";
  return ""; // multiple competitions → don't show
}

// ─── API ─────────────────────────────────────────────────────────────────────
const API_ENDPOINT = "/api/claude";

async function callClaude(system,userMsg,maxTokens=1000){
  const r=await fetch(API_ENDPOINT,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:maxTokens,system,messages:[{role:"user",content:userMsg}]})});
  const data=await r.json();
  return data.content?.find(b=>b.type==="text")?.text||"";
}

async function analyzeScreenshot(base64,mimeType){
  const r=await fetch(API_ENDPOINT,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
    model:"claude-haiku-4-5-20251001",max_tokens:1400,
    system:`Tu extrais les données d'UN SEUL pari depuis une capture d'écran Winamax/Betclic.

━━━ RÈGLE 1 — QUEL PARI CHOISIR ━━━
Identifie LE PARI LE PLUS COMPLET : statut visible, au moins une sélection, mise, gains, référence.

━━━ RÈGLE 2 — RÉSULTAT GLOBAL ━━━
1. Label texte coloré : "Gagné" (fond vert)→"win" ; "Perdu" (fond rouge)→"loss"
2. Gains > 0 → "win" ; Gains = 0,00€ → "loss"

━━━ RÈGLE 3 — FREEBET ━━━
Si tu vois "freebet", "pari gratuit", "free bet" : is_freebet = true

━━━ RÈGLE 4 — STRUCTURE ━━━
MyMatch (critères cumulés sur UN seul match) → bet_structure="simple"
Combiné = paris sur PLUSIEURS matchs différents → bet_structure="combiné"
Simple classique → bet_structure="simple"
IMPORTANT: plus jamais "mymatch" comme valeur de bet_structure.

━━━ RÈGLE 5 — RÉSULTAT PAR SÉLECTION ━━━
Pour chaque sélection d'un combiné, indique "sel_result":"win"|"loss"|null selon ce qui est visible.

━━━ RÈGLE 6 — "NON" dans les sélections ━━━
Si une sélection affiche "Non" : inclus-le dans selection_type ET mets negated:true.

━━━ RÈGLE 7 — JOUEURS ━━━
"player" : format "I.Nom" (ex: "Bradley Barcola"→"B.Barcola")
"player_display" : nom complet tel qu'il apparaît
BUTEURS MULTI-CHANCES : "Buteur Ruiz OU Hakimi OU Kvaratskhelia" → UNE SEULE sélection :
  player_display = "F.Ruiz / A.Hakimi / K.Kvaratskhelia", player = "F.Ruiz / A.Hakimi / K.Kvaratskhelia", sel_type = "joueur décisif"
  NE PAS créer une sélection par joueur.

━━━ RÈGLE 8 — ÉQUIPE PAR SÉLECTION ━━━
Pour chaque sélection, "team" = l'équipe concernée par ce critère.
Ex: "Victoire PSG"→team:"PSG" ; "Mbappé buteur"→team:"",player:"K.Mbappé"
Pour les COMBINÉS : ajoute aussi "match_team_1" et "match_team_2" = les deux équipes DU MATCH de cette sélection.
Ex: sélection "Victoire PSG" dans PSG-Aston Villa → match_team_1:"PSG", match_team_2:"Aston Villa"
Ex: sélection "Raphinha buteur" dans Barcelone-Dortmund → match_team_1:"Barcelone", match_team_2:"Dortmund"
Cela permet d'identifier quel match correspond à quelle sélection dans un combiné.

━━━ RÈGLE 9 — TYPE DE SÉLECTION ━━━
sel_type parmi: "résultat"|"nb buts"|"nb buts MT"|"score exact"|"score exact MT"|"joueur décisif"|"doublé/triplé"|"handicap"|"qualification"|"écart buts"|"1ère équipe à marquer"|"les 2 marquent"|"clean sheet"|"autre"
"marque 2 buts"/"2 buts ou plus"/"marque 3 buts" → sel_type="doublé/triplé". "marque 1 but"/"buteur" → sel_type="joueur décisif". "Écart de buts (handicap)"/"victoire -X" → sel_type="handicap".

━━━ RÈGLE 10 — SEUIL & DIRECTION (nb buts / handicap) ━━━
Pour sel_type "nb buts", "nb buts MT", "handicap" : ajoute sel_dir:"+" ou "-" et sel_threshold: valeur numérique.
Ex: "Plus de 2.5 buts" → sel_dir:"+", sel_threshold:2.5 | "Moins de 1.5 buts" → sel_dir:"-", sel_threshold:1.5 | "PSG -1.5" → sel_dir:"-", sel_threshold:1.5

━━━ FORMAT JSON ━━━
{"bet_ref":"","sport":"Football","bookmaker":"Winamax","competition":"","date":"YYYY-MM-DD","heure":"HH:MM","team_1":"","team_2":"","bet_structure":"simple|combiné","bet_category":"team|player|goals|combo","total_odd":1.5,"stake":10.0,"actual_win":0.0,"result":"win|loss","is_freebet":false,"selections":[{"team":"PSG","player":"","player_display":"","selection_type":"Victoire PSG","sel_type":"Résultat (1N2)","sel_dir":null,"sel_threshold":null,"sel_result":null,"match_team_1":"PSG","match_team_2":"Aston Villa","odd":1.38,"negated":false}]}`,
    messages:[{role:"user",content:[{type:"image",source:{type:"base64",media_type:mimeType,data:base64}},{type:"text",text:"Extrais le pari le plus complet visible sur cette image."}]}]
  })});
  const data=await r.json();
  const text=(data.content?.find(b=>b.type==="text")?.text||"");
  const raw=extractJSON(text);
  if(raw.competition) raw.competition=normalizeCompetition(raw.competition);
  if(raw.team_1) raw.team_1=normalizeTeam(raw.team_1);
  if(raw.team_2) raw.team_2=normalizeTeam(raw.team_2);
  if(raw.selections) raw.selections=raw.selections.map(s=>({...s,team:s.team?normalizeTeam(s.team):s.team}));
  // MyMatch: null out total_odd if it looks like a selection number
  if(raw.bet_structure==="mymatch"&&raw.total_odd&&(raw.total_odd===Math.round(raw.total_odd))&&raw.total_odd<20) raw.total_odd=null;
  if(raw.selections){
    raw.selections=raw.selections.map(sel=>{
      if(sel.player&&!sel.player.match(/^[A-Za-zÀ-ÿ]\./)){sel.player_display=sel.player_display||sel.player;sel.player=normalizePlayerName(sel.player);}
      if(sel.negated&&!sel.selection_type?.includes("— Non")) sel.selection_type=(sel.selection_type||"")+" — Non";
      if(!sel.sel_type) sel.sel_type=normalizeSelType(sel.selection_type);
      // Auto-extract sel_dir + sel_threshold from selection_type if not set by IA
      if(!sel.sel_dir&&(sel.sel_type==="nb buts"||sel.sel_type==="nb buts MT"||sel.sel_type==="handicap")){
        const st=sel.selection_type||"";
        const mPlus=st.match(/[\+\>]?\s*(plus de|over|au moins|[\+])\s*([\d\.]+)/i);
        const mMinus=st.match(/[\-\<]?\s*(moins de|under|au plus|[\-])\s*([\d\.]+)/i);
        const mRaw=st.match(/([\+\-])\s*([\d\.]+)/);
        if(mPlus){sel.sel_dir="+";sel.sel_threshold=parseFloat(mPlus[2]);}
        else if(mMinus){sel.sel_dir="-";sel.sel_threshold=parseFloat(mMinus[2]);}
        else if(mRaw){sel.sel_dir=mRaw[1];sel.sel_threshold=parseFloat(mRaw[2]);}
      }
      // MyMatch: clear odd
      if(raw.bet_structure==="mymatch") sel.odd=null;
      return sel;
    });
  }
  return raw;
}

async function analyzeMultipleScreenshots(files){
  const results=[];
  for(const file of files){
    const b64=await new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result.split(",")[1]);r.onerror=rej;r.readAsDataURL(file);});
    try{const data=await analyzeScreenshot(b64,file.type);results.push({data,file,previewUrl:URL.createObjectURL(file),ok:true});}
    catch(e){results.push({data:null,file,previewUrl:URL.createObjectURL(file),ok:false,error:e.message});}
  }
  const merged=[],used=new Set();
  for(let i=0;i<results.length;i++){
    if(used.has(i)||!results[i].ok){if(!results[i].ok)merged.push(results[i]);continue;}
    let base={...results[i]};
    for(let j=i+1;j<results.length;j++){
      if(used.has(j)||!results[j].ok)continue;
      const a=base.data,b=results[j].data;
      const sameRef=a.bet_ref&&b.bet_ref&&a.bet_ref===b.bet_ref;
      const sameMatch=a.team_1&&b.team_1&&a.team_1===b.team_1&&a.team_2===b.team_2&&a.date===b.date;
      if(sameRef||sameMatch){
        const md={...a};
        if(!md.bet_ref&&b.bet_ref)md.bet_ref=b.bet_ref;
        if((!md.selections||md.selections.length===0)&&b.selections?.length>0)md.selections=b.selections;
        if(md.selections&&b.selections&&b.selections.length>md.selections.length)md.selections=b.selections;
        if(!md.total_odd&&b.total_odd)md.total_odd=b.total_odd;
        if(!md.stake&&b.stake)md.stake=b.stake;
        if(!md.actual_win&&b.actual_win)md.actual_win=b.actual_win;
        base={...base,data:md,merged:true};used.add(j);
      }
    }
    used.add(i);merged.push(base);
  }
  return merged;
}

async function detectCompetition(team1,team2,date){
  const r=await fetch(API_ENDPOINT,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
    model:"claude-haiku-4-5-20251001",max_tokens:400,
    system:`Tu identifies la compétition d'un match sportif. Réponds UNIQUEMENT avec un JSON valide: {"competition":"nom exact officiel","type":"championnat|coupe_nationale|ligue_champions|europa_league|conference_league|amical|autre","confidence":"high|medium|low"}`,
    tools:[{type:"web_search_20250305",name:"web_search"}],
    messages:[{role:"user",content:`Dans quelle compétition s'est joué "${team1} vs ${team2}" autour du ${date||"2025"} ? JSON uniquement.`}]
  })});
  const data=await r.json();
  const textBlock=data.content?.filter(b=>b.type==="text").pop();
  try{const result=extractJSON(textBlock?.text||"");if(result.competition)result.competition=normalizeCompetition(result.competition);return result;}
  catch{return{competition:"",type:"autre",confidence:"low"};}
}

function extractJSON(text){
  let s=text.replace(/```json\s*/gi,"").replace(/```\s*/g,"").trim();
  try{return JSON.parse(s);}catch{}
  const start=s.indexOf("{");
  if(start===-1) throw new Error("No JSON found");
  let depth=0,inStr=false,escape=false;
  for(let i=start;i<s.length;i++){
    const c=s[i];
    if(escape){escape=false;continue;}
    if(c==="\\"&&inStr){escape=true;continue;}
    if(c==='"'){inStr=!inStr;continue;}
    if(inStr)continue;
    if(c==="{"){ depth++;}else if(c==="}"){depth--;if(depth===0)return JSON.parse(s.slice(start,i+1));}
  }
  throw new Error("Incomplete JSON");
}

function getWeekNum(d){
  const jan1=new Date(d.getFullYear(),0,1);
  return Math.ceil(((d-jan1)/86400000+jan1.getDay()+1)/7);
}

function parseMarkdown(text){
  if(!text) return "";
  return text
    .replace(/\*\*\*(.+?)\*\*\*/g,'<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,'<em>$1</em>')
    .replace(/^### (.+)$/gm,'<span style="font-size:13px;font-weight:800;color:var(--text);font-family:var(--font-head);display:block;margin:10px 0 4px">$1</span>')
    .replace(/^## (.+)$/gm,'<span style="font-size:14px;font-weight:800;color:var(--accent);font-family:var(--font-head);display:block;margin:12px 0 5px">$1</span>')
    .replace(/^# (.+)$/gm,'<span style="font-size:15px;font-weight:800;color:var(--accent);font-family:var(--font-head);display:block;margin:14px 0 6px">$1</span>');
}

async function runAIAnalysis(bets){
  const s=computeStats(bets);
  // Team stats
  const teamFreq2={};
  bets.forEach(b=>{[b.team_1,b.team_2].filter(Boolean).forEach(t=>{teamFreq2[t]=(teamFreq2[t]||0)+1;});});
  const topTeams2=Object.entries(teamFreq2).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([t,n])=>{const sub=bets.filter(b=>b.team_1===t||b.team_2===t);const st=computeStats(sub);return{team:t,count:n,profit:st.profit,rate:st.rate,roi:st.roi};});
  const payload={
    totalBets:bets.length,winRate:s.rate,profit:s.profit,roi:s.roi,totalStake:s.totalStake,avgOdd:s.avgOdd,
    byStructure:["simple","combiné"].reduce((o,k)=>{const sub=bets.filter(b=>k==="simple"?(b.bet_structure==="simple"||b.bet_structure==="mymatch"):b.bet_structure===k);if(sub.length)o[k]=computeStats(sub);return o;},{}),
    oddRanges:getOddRangeStats(bets).map(r=>({range:r.label,count:r.count,profit:r.profit,rate:r.rate,roi:r.roi})),
    tags:[...new Set(bets.map(b=>b.tag))].map(t=>({tag:t,...computeStats(bets.filter(b=>b.tag===t))})),
    topPlayers:getPlayerStats(bets).sort((a,b)=>b.profit-a.profit).slice(0,3),
    topTeams:topTeams2,
    bets:bets.map(b=>({date:b.date,match:`${b.team_1} vs ${b.team_2}`,struct:displayStructure(b),odd:b.total_odd,stake:b.stake,win:b.actual_win,result:b.result,tag:b.tag,freebet:b.is_freebet}))
  };
  return callClaude(
    `Tu es un analyste expert en paris sportifs. Analyse les données et fournis une analyse personnalisée, directe et actionnable en français. Utilise du markdown (gras avec **mot**, titres avec ##). Structure : ## Profil de parieur, ## Ce qui marche ✅, ## Ce qui ne marche pas ❌, ## Par équipe (top équipes rentables vs déficitaires), ## Recommandations concrètes 🎯. Sois direct, factuel, ne dis pas 'je vais analyser', donne des chiffres précis.`,
    `Voici mes données:\n${JSON.stringify(payload,null,2)}`,1000
  );
}

async function runEntityAnalysis(query, mode, matchedBets){
  const betsData = matchedBets.map(b=>({
    date:b.date,
    match:`${b.team_1||"?"} vs ${b.team_2||"?"}`,
    struct:displayStructure(b),
    odd:b.total_odd,
    stake:betRealStake(b),
    profit:betProfit(b),
    result:b.result,
    tag:b.tag,
    selections:(b.selections||[]).map(s=>({
      team:s.team,player:s.player_display||s.player,
      type:s.selection_type,sel_type:s.sel_type,
      sel_result:s.sel_result
    }))
  }));
  const entityType = mode==="player" ? "joueur" : "équipe";
  return callClaude(
    `Tu es un analyste expert en paris sportifs. L'utilisateur te demande une analyse ciblée sur un ${entityType} spécifique à partir de ses paris. Réponds en français avec du markdown (gras avec **mot**, sections avec ##). Sois direct, factuel, utilise les données. Structure : ## Résumé, ## Ce qui ressort, ## Conseil. Max 150 mots. Pas de blabla.`,
    `Analyse mes paris impliquant "${query}" (${entityType}) :
${JSON.stringify(betsData,null,2)}`,
    600
  );
}

async function runQAQuery(bets,question){
  const betsData=bets.map(b=>({date:b.date,match:`${b.team_1} vs ${b.team_2}`,sport:b.sport,competition:b.competition,struct:b.bet_structure,odd:b.total_odd,stake:b.stake,win:b.actual_win,result:b.result,tag:b.tag,freebet:b.is_freebet,profit:betProfit(b),selections:(b.selections||[]).map(s=>({team:s.team,player:s.player_display||s.player,type:s.selection_type,sel_type:s.sel_type}))}));
  return callClaude(
    `Tu analyses les paris sportifs d'un utilisateur et réponds à ses questions. Sois précis, factuel et basé uniquement sur les données. Réponds en français, de façon concise (max 3-4 phrases). Si l'info n'est pas dans les données, dis-le clairement.`,
    `Mes paris (${bets.length} au total):\n${JSON.stringify(betsData,null,2)}\n\nMa question: ${question}`,600
  );
}

async function generateBetTrackCard(bets,username){
  const s=computeStats(bets);
  // Top teams by frequency
  const teamFreq={};
  bets.forEach(b=>{[b.team_1,b.team_2].filter(Boolean).forEach(t=>{teamFreq[t]=(teamFreq[t]||0)+1;});});
  const topTeams=Object.entries(teamFreq).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([t,n])=>({team:t,count:n,...computeStats(bets.filter(b=>b.team_1===t||b.team_2===t))}));
  const payload={
    username,totalBets:bets.length,profit:s.profit,roi:s.roi,winRate:s.rate,avgOdd:s.avgOdd,totalStake:s.totalStake,
    byStructure:["simple","combiné"].reduce((o,k)=>{const sub=bets.filter(b=>(k==="simple"?(b.bet_structure==="simple"||b.bet_structure==="mymatch"):b.bet_structure===k));if(sub.length)o[k]=computeStats(sub);return o;},{}),
    tags:[...new Set(bets.map(b=>b.tag))].map(t=>({tag:t,...computeStats(bets.filter(b=>b.tag===t))})),
    bestBet:bets.map(b=>({...b,profit:betProfit(b)})).sort((a,b)=>b.profit-a.profit)[0],
    biggestOddWin:bets.filter(b=>b.result==="win"&&b.total_odd).sort((a,b)=>b.total_odd-a.total_odd)[0],
    topTeams,
    bets:bets.map(b=>({date:b.date,match:`${b.team_1} vs ${b.team_2}`,odd:b.total_odd,stake:b.stake,profit:betProfit(b),result:b.result,struct:displayStructure(b)}))
  };
  const analysis=await callClaude(
    `Tu génères le contenu d'une "Carte BetTrack" pour un parieur sportif. Réponds UNIQUEMENT en JSON valide (pas de markdown, pas de backticks):
{"score":75,"rank":"Gold","percentile":68,"biases":[{"icon":"🔁","text":"Tu paries plus après une perte"},{"icon":"⚡","text":"Biais sur les favoris maison"}],"insoliteFact":"Ton pari le plus fou : PSG vs Bayern à ×4.20 pour 50€","profilLines":[{"icon":"💪","color":"#c8ff57","label":"Force","text":"Ta vraie force : les paris simples avec ROI +18%"},{"icon":"📉","color":"#ff5770","label":"Faiblesse","text":"Les combinés te coûtent en moyenne -22€ chacun"},{"icon":"🎯","color":"#57c8ff","label":"Pattern","text":"Tu bats les bookmakers quand tu joues les outsiders"},{"icon":"⭐","color":"#d4aaff","label":"Equipe fétiche","text":"PSG : 8 paris, 75% réussite. Ton équipe porte-bonheur"},{"icon":"🔥","color":"#ff9957","label":"Conseil","text":"Mise max 5% bankroll par pari. Tu joues trop gros sur les coups de folie"}]}
Score 0-100 basé sur ROI(50%), cote moy pondérée(30%), taux réussite(20%) vs moyenne (ROI -5%, cote 1.85, 45%).
Rangs: 0-40 Bronze, 41-60 Silver, 61-80 Gold, 81-100 Elite.
profilLines: 5 lignes courtes, percutantes, personnalisées, qu'on a envie de partager. Phrases chocs type story Instagram. Chaque ligne a icon+color+label+text.`,
    `Données: ${JSON.stringify(payload,null,2)}`,1400
  );
  try{return extractJSON(analysis);}catch{return null;}
}

// ─── PROFILE MODAL ────────────────────────────────────────────────────────────
function ProfileModal({ user, profile, onSave, onClose, onDeleteAll }) {
  const [favTeam, setFavTeam] = useState(profile?.fav_team||"");
  const [saving, setSaving] = useState(false);
  const handleSave = async () => {
    setSaving(true);
    await onSave({ fav_team: favTeam.trim() });
    setSaving(false);
    onClose();
  };
  return (
    <div className="modal-backdrop" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal-sheet">
        <div className="modal-handle"/>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-header">
          <div className="modal-title">Mon profil</div>
          <div className="modal-sub" style={{marginTop:4}}>@{user}</div>
        </div>
        <div className="modal-body">
          <div className="card">
            <div className="card-title">Équipe favorite</div>
            <div style={{fontSize:12,color:'var(--text2)',marginBottom:10}}>Utilisée pour détecter le biais de supporter dans ta Carte BetTrack.</div>
            <div className="field-group">
              <div className="field-label">Nom complet (ex: Paris Saint-Germain)</div>
              <input className="field-input" value={favTeam} onChange={e=>setFavTeam(e.target.value)} placeholder="Ex: Paris Saint-Germain" />
            </div>
            <div style={{fontSize:11,color:'var(--text3)'}}>Abréviation reconnue automatiquement (PSG, OM, OL…)</div>
          </div>
          <button className="btn-primary" onClick={handleSave} disabled={saving}>{saving?"Enregistrement…":"Enregistrer"}</button>
          <ResetAccountSection onDeleteAll={onDeleteAll}/>
        </div>
      </div>
    </div>
  );
}

// ─── RESET ACCOUNT ────────────────────────────────────────────────────────────
function ResetAccountSection({ onDeleteAll }) {
  const [step, setStep] = useState(0);
  const [doing, setDoing] = useState(false);
  if(!onDeleteAll) return null;
  return(
    <div style={{marginTop:16,paddingTop:14,borderTop:'1px solid var(--border)'}}>
      {step===0&&<button onClick={()=>setStep(1)} style={{width:'100%',padding:'10px',background:'transparent',border:'1px solid rgba(255,87,112,0.2)',borderRadius:'var(--radius)',color:'var(--text3)',fontSize:11,fontFamily:'var(--font-head)',fontWeight:700,cursor:'pointer'}}>🗑 Nettoyer le compte et recommencer à zéro</button>}
      {step===1&&(
        <div style={{background:'rgba(255,87,112,0.06)',border:'1px solid rgba(255,87,112,0.2)',borderRadius:'var(--radius)',padding:'12px'}}>
          <div style={{fontFamily:'var(--font-head)',fontSize:13,fontWeight:800,color:'var(--loss)',marginBottom:5}}>⚠️ Supprimer tous les paris ?</div>
          <div style={{fontSize:11,color:'var(--text2)',marginBottom:10,lineHeight:1.5}}>Tous tes paris seront définitivement supprimés. Cette action est irréversible.</div>
          <div style={{display:'flex',gap:7}}>
            <button onClick={()=>setStep(0)} style={{flex:1,padding:'8px',background:'var(--surface2)',border:'1px solid var(--border)',borderRadius:8,color:'var(--text2)',fontSize:11,fontFamily:'var(--font-head)',fontWeight:700,cursor:'pointer'}}>Annuler</button>
            <button onClick={()=>setStep(2)} style={{flex:1,padding:'8px',background:'rgba(255,87,112,0.12)',border:'1px solid rgba(255,87,112,0.3)',borderRadius:8,color:'var(--loss)',fontSize:11,fontFamily:'var(--font-head)',fontWeight:800,cursor:'pointer'}}>Continuer →</button>
          </div>
        </div>
      )}
      {step===2&&(
        <div style={{background:'rgba(255,87,112,0.1)',border:'2px solid rgba(255,87,112,0.4)',borderRadius:'var(--radius)',padding:'12px'}}>
          <div style={{fontFamily:'var(--font-head)',fontSize:13,fontWeight:800,color:'var(--loss)',marginBottom:5}}>🚨 Confirmation finale</div>
          <div style={{fontSize:11,color:'var(--text)',marginBottom:10,lineHeight:1.5}}>Action <strong>irréversible</strong>. Toute ta base de données de paris sera effacée.</div>
          <div style={{display:'flex',gap:7}}>
            <button onClick={()=>setStep(0)} style={{flex:1,padding:'8px',background:'var(--surface2)',border:'1px solid var(--border)',borderRadius:8,color:'var(--text2)',fontSize:11,fontFamily:'var(--font-head)',fontWeight:700,cursor:'pointer'}}>Non, garder</button>
            <button onClick={async()=>{setDoing(true);await onDeleteAll();setStep(0);setDoing(false);}} disabled={doing} style={{flex:1,padding:'8px',background:'var(--loss)',border:'none',borderRadius:8,color:'#0a0a0f',fontSize:11,fontFamily:'var(--font-head)',fontWeight:800,cursor:'pointer'}}>{doing?"…":"💥 Tout effacer"}</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── BET DETAIL MODAL ────────────────────────────────────────────────────────
function BetDetailModal({ bet, onClose, onDelete, onUpdate, allTags, objectives }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editingTag, setEditingTag] = useState(false);
  const [editingComp, setEditingComp] = useState(false);
  const [editingObjectif, setEditingObjectif] = useState(false);
  const [newTag, setNewTag] = useState(bet.tag||"SAFE");
  const [customTagInput, setCustomTagInput] = useState("");
  const [newComp, setNewComp] = useState(bet.competition||"");
  const [newObjectifId, setNewObjectifId] = useState(bet.objectif_id||null);
  const [savingTag, setSavingTag] = useState(false);
  const [savingComp, setSavingComp] = useState(false);
  const [savingObjectif, setSavingObjectif] = useState(false);
  const profit = betProfit(bet);
  const tagColor = bet.tag==="SAFE"?"var(--safe)":bet.tag==="FUN"?"var(--fun)":"var(--accent2)";
  const isMymatch = false; // mymatch is now treated as simple

  const handleSaveTag = async () => {
    setSavingTag(true);
    const finalTag = customTagInput.trim()?customTagInput.trim().toUpperCase():newTag;
    await onUpdate(bet.id,{tag:finalTag});
    setEditingTag(false);setSavingTag(false);setCustomTagInput("");
  };
  const handleSaveComp = async () => {
    setSavingComp(true);
    await onUpdate(bet.id,{competition:normalizeCompetition(newComp)});
    setEditingComp(false);setSavingComp(false);
  };
  const handleSaveObjectif = async () => {
    setSavingObjectif(true);
    await onUpdate(bet.id,{objectif_id:newObjectifId});
    setEditingObjectif(false);setSavingObjectif(false);
  };

  const displayComp = comboCompetition(bet) || bet.competition || "";

  return (
    <div className="modal-backdrop" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal-sheet">
        <div className="modal-handle"/>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-header">
          <div style={{display:'flex',gap:5,flexWrap:'wrap',marginBottom:7}}>
            <div className={`result-chip ${bet.result==='win'?'result-win':'result-loss'}`}>{bet.result==='win'?'🏆 Gagné':'❌ Perdu'}</div>
            <span onClick={()=>setEditingTag(t=>!t)} style={{padding:'4px 9px',borderRadius:20,border:`1px solid ${tagColor}33`,background:`${tagColor}18`,fontSize:10,fontWeight:700,fontFamily:'var(--font-head)',color:tagColor,cursor:'pointer',display:'flex',alignItems:'center',gap:3}}>
              {bet.tag} <span style={{fontSize:9,opacity:0.7}}>✎</span>
            </span>
            {bet.is_freebet&&<span className="freebet-tag">🎁 FB</span>}
          </div>
          {editingTag&&(
            <div style={{background:'var(--surface2)',border:'1px solid var(--border)',borderRadius:'var(--radius-sm)',padding:'10px',marginBottom:8}}>
              <div style={{fontSize:10,color:'var(--text2)',fontWeight:600,marginBottom:7,textTransform:'uppercase',letterSpacing:'0.5px'}}>Modifier la catégorie</div>
              <div className="tag-edit-row">
                {["SAFE","FUN",...(allTags||[]).filter(t=>t!=="SAFE"&&t!=="FUN")].map(t=>(
                  <button key={t} className={`tag-edit-chip ${newTag===t&&!customTagInput?'active':''}`} onClick={()=>{setNewTag(t);setCustomTagInput("");}}>
                    {t}
                  </button>
                ))}
              </div>
              <input className="field-input" style={{marginTop:7,fontSize:12,padding:'6px 9px'}} placeholder="Nouvelle catégorie…" value={customTagInput} onChange={e=>setCustomTagInput(e.target.value.toUpperCase())}/>
              <div style={{display:'flex',gap:5,marginTop:7}}>
                <button onClick={handleSaveTag} disabled={savingTag} style={{flex:1,padding:'7px',background:'var(--accent)',color:'#0a0a0f',border:'none',borderRadius:7,fontSize:11,fontWeight:800,cursor:'pointer',fontFamily:'var(--font-head)'}}>{savingTag?"…":"✓ OK"}</button>
                <button onClick={()=>{setEditingTag(false);setCustomTagInput("");}} style={{flex:1,padding:'7px',background:'var(--surface)',border:'1px solid var(--border)',borderRadius:7,color:'var(--text2)',fontSize:11,fontWeight:700,cursor:'pointer',fontFamily:'var(--font-head)'}}>Annuler</button>
              </div>
            </div>
          )}
          <div className="modal-title">{bet.team_1} vs {bet.team_2}</div>
          <div style={{display:'flex',alignItems:'center',gap:6,flexWrap:'wrap',marginTop:3}}>
            {displayComp&&!editingComp&&<span style={{fontSize:11,color:'var(--text2)',cursor:'pointer'}} onClick={()=>setEditingComp(true)}>{displayComp} <span style={{fontSize:9,color:'var(--text3)'}}>✎</span></span>}
            {!displayComp&&!editingComp&&<span style={{fontSize:11,color:'var(--text3)',cursor:'pointer'}} onClick={()=>setEditingComp(true)}>+ Ajouter compétition ✎</span>}
            <span style={{fontSize:11,color:'var(--text3)'}}>· {bet.date}{bet.heure?` à ${bet.heure}`:""} · {bet.bookmaker}</span>
          </div>
          {editingComp&&(
            <div style={{display:'flex',gap:5,marginTop:7,alignItems:'center'}}>
              <input className="field-input" style={{fontSize:12,padding:'6px 9px',flex:1}} value={newComp} onChange={e=>setNewComp(e.target.value)} placeholder="Ligue 1, Champions League…" autoFocus onBlur={()=>{if(!newComp.trim())setEditingComp(false);}}/>
              <button onClick={handleSaveComp} disabled={savingComp} style={{padding:'6px 10px',background:'var(--accent)',color:'#0a0a0f',border:'none',borderRadius:7,fontSize:11,fontWeight:800,cursor:'pointer',fontFamily:'var(--font-head)',flexShrink:0}}>{savingComp?"…":"✓"}</button>
              <button onClick={()=>setEditingComp(false)} style={{padding:'6px 10px',background:'var(--surface2)',border:'1px solid var(--border)',borderRadius:7,color:'var(--text2)',fontSize:11,fontWeight:700,cursor:'pointer',fontFamily:'var(--font-head)',flexShrink:0}}>✕</button>
            </div>
          )}
        </div>
        <div className="modal-body">
          <div className="detail-section">
            <div className="detail-section-title">Financier</div>
            <div className="detail-grid">
              {bet.total_odd&&bet.total_odd>1&&<div className="detail-item"><div className="detail-item-label">Cote totale</div><div className="detail-item-value" style={{color:'var(--accent)'}}>×{fmt(bet.total_odd)}</div></div>}
              <div className="detail-item"><div className="detail-item-label">{bet.is_freebet?"Freebet":"Mise"}</div><div className="detail-item-value">{fmt(bet.stake)}€</div></div>
              <div className="detail-item"><div className="detail-item-label">Gain brut</div><div className="detail-item-value">{fmt(bet.actual_win)}€</div></div>
              <div className="detail-item"><div className="detail-item-label">Profit net</div><div className="detail-item-value" style={{color:profit>=0?'var(--win)':'var(--loss)'}}>{fmtEuro(profit)}</div></div>
              {!bet.is_freebet&&bet.stake>0&&<div className="detail-item"><div className="detail-item-label">ROI</div><div className="detail-item-value" style={{color:profit>=0?'var(--win)':'var(--loss)'}}>{fmtROI(profit,bet.stake)}</div></div>}
            </div>
          </div>

          {bet.selections?.length>0&&(
            <div className="detail-section">
              <div className="detail-section-title">Sélections</div>
              {(()=>{
                const matchGroups = groupSelsByMatch(bet);
                if(matchGroups){
                  // Combiné: group by match
                  return matchGroups.map((grp,gi)=>{
                    const matchLabel = grp.team_2
                      ? `${grp.team_1} vs ${grp.team_2}`
                      : grp.team_1||`Match ${gi+1}`;
                    return(
                      <div key={gi} style={{marginBottom:10}}>
                        <div style={{fontSize:10,color:'var(--accent2)',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:5,display:'flex',alignItems:'center',gap:5}}>
                          <span style={{background:'rgba(87,200,255,0.12)',border:'1px solid rgba(87,200,255,0.2)',borderRadius:5,padding:'1px 7px'}}>Match {gi+1}</span>
                          <span style={{color:'var(--text2)',fontWeight:600,textTransform:'none',letterSpacing:0}}>{matchLabel}</span>
                        </div>
                        {grp.sels.map((s,i)=>{
                          const isNeg=s.negated||s.selection_type?.includes("— Non");
                          const showOdd=s.odd&&s.odd>1;
                          const t=normalizeSelType(s.sel_type||s.selection_type);
                          return(
                            <div key={i} className="selection-detail" style={isNeg?{borderColor:'rgba(255,153,87,0.3)'}:s.sel_result==="win"?{borderColor:'rgba(87,255,158,0.25)'}:s.sel_result==="loss"?{borderColor:'rgba(255,87,112,0.25)'}:{}}>
                              <div className="sel-top">
                                <div style={{flex:1}}>
                                  <div className="sel-team">{s.team}{(s.player_display||s.player)?` · ${s.player_display||s.player}`:""}</div>
                                  <div className="sel-type">
                                    {s.selection_type}
                                    {t&&t!=="autre"&&<span style={{color:'var(--accent2)',fontSize:10,marginLeft:4}}>· {t}</span>}
                                    {s.sel_dir&&s.sel_threshold!=null&&<span style={{color:s.sel_dir==="+"?"var(--win)":"var(--loss)",fontSize:10,fontWeight:800,marginLeft:4,fontFamily:'var(--font-head)'}}>{s.sel_dir}{s.sel_threshold}</span>}
                                  </div>
                                </div>
                                <div style={{display:'flex',alignItems:'center',gap:6,flexShrink:0}}>
                                  {s.sel_result&&<span style={{fontSize:11,fontWeight:800,color:s.sel_result==="win"?"var(--win)":"var(--loss)",fontFamily:'var(--font-head)'}}>{s.sel_result==="win"?"✓":"✗"}</span>}
                                  {showOdd&&<div className="sel-odd-big">×{fmt(s.odd)}</div>}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  });
                }
                // Simple ou pas groupable: affichage normal
                return bet.selections.map((s,i)=>{
                  const isNeg=s.negated||s.selection_type?.includes("— Non");
                  const showOdd=s.odd&&s.odd>1;
                  const t=normalizeSelType(s.sel_type||s.selection_type);
                  return(
                    <div key={i} className="selection-detail" style={isNeg?{borderColor:'rgba(255,153,87,0.3)'}:s.sel_result==="win"?{borderColor:'rgba(87,255,158,0.25)'}:s.sel_result==="loss"?{borderColor:'rgba(255,87,112,0.25)'}:{}}>
                      <div className="sel-top">
                        <div style={{flex:1}}>
                          <div className="sel-team">{s.team}{(s.player_display||s.player)?` · ${s.player_display||s.player}`:""}</div>
                          <div className="sel-type">
                            {s.selection_type}
                            {t&&t!=="autre"&&<span style={{color:'var(--accent2)',fontSize:10,marginLeft:4}}>· {t}</span>}
                            {s.sel_dir&&s.sel_threshold!=null&&<span style={{color:s.sel_dir==="+"?"var(--win)":"var(--loss)",fontSize:10,fontWeight:800,marginLeft:4,fontFamily:'var(--font-head)'}}>{s.sel_dir}{s.sel_threshold}</span>}
                          </div>
                        </div>
                        <div style={{display:'flex',alignItems:'center',gap:6,flexShrink:0}}>
                          {s.sel_result&&<span style={{fontSize:11,fontWeight:800,color:s.sel_result==="win"?"var(--win)":"var(--loss)",fontFamily:'var(--font-head)'}}>{s.sel_result==="win"?"✓":"✗"}</span>}
                          {showOdd&&<div className="sel-odd-big">×{fmt(s.odd)}</div>}
                        </div>
                      </div>
                    </div>
                  );
                });
              })()}
            </div>
          )}

          {/* Objectif perso */}
          {objectives&&objectives.length>0&&(
            <div className="detail-section">
              <div className="detail-section-title">Objectif personnel</div>
              <div style={{display:'flex',alignItems:'center',gap:8}}>
                {bet.objectif_id?(
                  <div style={{flex:1,background:'rgba(200,255,87,0.06)',border:'1px solid rgba(200,255,87,0.15)',borderRadius:8,padding:'7px 10px',fontSize:12,color:'var(--accent)',fontFamily:'var(--font-head)',fontWeight:700}}>
                    🎯 {objectives.find(o=>o.id===bet.objectif_id)?.name||"Objectif"}
                  </div>
                ):(
                  <div style={{flex:1,fontSize:12,color:'var(--text3)'}}>Aucun objectif associé</div>
                )}
                <button onClick={()=>setEditingObjectif(t=>!t)} style={{padding:'6px 10px',background:'var(--surface2)',border:'1px solid var(--border)',borderRadius:7,color:'var(--text2)',fontSize:11,fontFamily:'var(--font-head)',fontWeight:700,cursor:'pointer'}}>✎</button>
              </div>
              {editingObjectif&&(
                <div style={{marginTop:8}}>
                  <select className="field-input" style={{fontSize:12}} value={newObjectifId||""} onChange={e=>setNewObjectifId(e.target.value||null)}>
                    <option value="">Aucun objectif</option>
                    {objectives.map(o=><option key={o.id} value={o.id}>{o.name}</option>)}
                  </select>
                  <div style={{display:'flex',gap:5,marginTop:6}}>
                    <button onClick={handleSaveObjectif} disabled={savingObjectif} style={{flex:1,padding:'7px',background:'var(--accent)',color:'#0a0a0f',border:'none',borderRadius:7,fontSize:11,fontWeight:800,cursor:'pointer',fontFamily:'var(--font-head)'}}>{savingObjectif?"…":"✓ OK"}</button>
                    <button onClick={()=>setEditingObjectif(false)} style={{flex:1,padding:'7px',background:'var(--surface)',border:'1px solid var(--border)',borderRadius:7,color:'var(--text2)',fontSize:11,fontWeight:700,cursor:'pointer',fontFamily:'var(--font-head)'}}>Annuler</button>
                  </div>
                </div>
              )}
            </div>
          )}

          <div style={{marginTop:8}}>
            {!confirmDelete?(
              <button onClick={()=>setConfirmDelete(true)} style={{width:'100%',padding:'11px',background:'transparent',border:'1px solid rgba(255,87,112,0.2)',borderRadius:'var(--radius)',color:'var(--loss)',fontSize:12,fontFamily:'var(--font-head)',fontWeight:700,cursor:'pointer'}}>
                🗑 Supprimer ce pari
              </button>
            ):(
              <div style={{background:'rgba(255,87,112,0.08)',border:'1px solid rgba(255,87,112,0.25)',borderRadius:'var(--radius-sm)',padding:'10px'}}>
                <div style={{fontSize:12,color:'var(--text)',textAlign:'center',marginBottom:9}}>Supprimer définitivement ?</div>
                <div style={{display:'flex',gap:7}}>
                  <button onClick={()=>setConfirmDelete(false)} style={{flex:1,padding:'8px',background:'var(--surface2)',border:'1px solid var(--border)',borderRadius:7,color:'var(--text2)',fontSize:12,fontFamily:'var(--font-head)',fontWeight:700,cursor:'pointer'}}>Annuler</button>
                  <button onClick={()=>onDelete(bet.id)} style={{flex:1,padding:'8px',background:'var(--loss)',border:'none',borderRadius:7,color:'#0a0a0f',fontSize:12,fontFamily:'var(--font-head)',fontWeight:800,cursor:'pointer'}}>Confirmer</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MANUAL IMPORT FORM ───────────────────────────────────────────────────────
function ManualImportForm({ bets, addBet, existingTags, objectives, onDone, onCancel }) {
  const today = new Date().toISOString().split("T")[0];
  const [d, setD] = useState({
    sport:"",bookmaker:"Winamax",competition:"",team_1:"",team_2:"",
    date:today,heure:"",bet_structure:"simple",result:"win",
    total_odd:"",stake:"",actual_win:"",tag:"SAFE",customTag:"",is_freebet:false,
    bet_ref:"",objectif_id:null
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const upd=(k,v)=>setD(p=>({...p,[k]:v}));
  const finalTag=d.customTag.trim()?d.customTag.trim().toUpperCase():d.tag;

  const handleSave=async()=>{
    if(!d.sport||!d.total_odd||!d.stake||!d.result){setError("Remplis au moins : sport, cote, mise, résultat.");return;}
    setSaving(true);
    try{
      const actualWin=d.actual_win!==""?parseFloat(d.actual_win):(d.result==="win"?parseFloat(d.stake)*parseFloat(d.total_odd):0);
      await addBet({...d,tag:finalTag,total_odd:parseFloat(d.total_odd),stake:parseFloat(d.stake),actual_win:actualWin,selections:[],bet_ref:d.bet_ref||null});
      onDone();
    }catch(e){setError("Erreur : "+(e.message||""));}
    setSaving(false);
  };
  return(
    <div>
      <div className="validation-title" style={{marginBottom:14}}>✏️ Import manuel</div>
      <div className="card">
        <div className="card-title">Match</div>
        <div className="field-row">
          <div className="field-group"><div className="field-label">Sport</div><input className="field-input" value={d.sport} onChange={e=>upd("sport",e.target.value)} placeholder="Football"/></div>
          <div className="field-group"><div className="field-label">Bookmaker</div><select className="field-input" value={d.bookmaker} onChange={e=>upd("bookmaker",e.target.value)}><option>Winamax</option><option>Betclic</option></select></div>
        </div>
        <div className="field-group"><div className="field-label">Compétition</div><input className="field-input" value={d.competition} onChange={e=>upd("competition",e.target.value)} placeholder="Ligue 1"/></div>
        <div className="field-row">
          <div className="field-group"><div className="field-label">Équipe 1</div><input className="field-input" value={d.team_1} onChange={e=>upd("team_1",e.target.value)}/></div>
          <div className="field-group"><div className="field-label">Équipe 2</div><input className="field-input" value={d.team_2} onChange={e=>upd("team_2",e.target.value)}/></div>
        </div>
        <div className="field-row">
          <div className="field-group"><div className="field-label">Date</div><input className="field-input" type="date" value={d.date} onChange={e=>upd("date",e.target.value)}/></div>
          <div className="field-group"><div className="field-label">Heure</div><input className="field-input" value={d.heure} onChange={e=>upd("heure",e.target.value)} placeholder="20:45"/></div>
        </div>
      </div>
      <div className="card">
        <div className="card-title">Paris</div>
        <div className="field-row">
          <div className="field-group"><div className="field-label">Structure</div><select className="field-input" value={d.bet_structure} onChange={e=>upd("bet_structure",e.target.value)}><option value="simple">Simple</option><option value="combiné">Combiné</option></select></div>
          <div className="field-group"><div className="field-label">Résultat</div><select className="field-input" value={d.result} onChange={e=>upd("result",e.target.value)}><option value="win">Gagné</option><option value="loss">Perdu</option></select></div>
        </div>
        <div className="field-row">
          <div className="field-group"><div className="field-label">Cote</div><input className="field-input" type="number" step="0.01" value={d.total_odd} onChange={e=>upd("total_odd",e.target.value)}/></div>
          <div className="field-group"><div className="field-label">Mise (€)</div><input className="field-input" type="number" step="0.5" value={d.stake} onChange={e=>upd("stake",e.target.value)}/></div>
        </div>
        <div className="field-group"><div className="field-label">Gain réel (€) <span style={{color:'var(--text3)',fontWeight:400}}>auto si vide</span></div><input className="field-input" type="number" step="0.01" value={d.actual_win} onChange={e=>upd("actual_win",e.target.value)}/></div>
        <label className={`freebet-toggle ${d.is_freebet?'active':''}`} onClick={()=>upd("is_freebet",!d.is_freebet)}>
          <div className={`freebet-box ${d.is_freebet?'checked':''}`}>{d.is_freebet&&<span style={{color:'#0a0a0f',fontSize:10,fontWeight:800}}>✓</span>}</div>
          <div><div className="freebet-toggle-label">🎁 Freebet</div></div>
        </label>
      </div>
      <div className="card">
        <div className="card-title">Catégorie</div>
        <div className="tag-selector">
          {["SAFE","FUN",...existingTags].map(t=><button key={t} className={`tag-btn ${d.tag===t&&!d.customTag?'selected':''}`} onClick={()=>upd("tag",t)}>{t}</button>)}
        </div>
        <input className="field-input" placeholder="Nouvelle catégorie…" value={d.customTag} onChange={e=>upd("customTag",e.target.value.toUpperCase())}/>
      </div>
      {objectives&&objectives.length>0&&(
        <div className="card">
          <div className="card-title">Objectif personnel</div>
          <select className="field-input" value={d.objectif_id||""} onChange={e=>upd("objectif_id",e.target.value||null)}>
            <option value="">Aucun objectif</option>
            {objectives.map(o=><option key={o.id} value={o.id}>{o.name}</option>)}
          </select>
        </div>
      )}
      {error&&<div className="error-msg">❌ {error}</div>}
      <button className="btn-primary" onClick={handleSave} disabled={saving}>{saving?"Enregistrement…":"Enregistrer"}</button>
      <button className="btn-secondary" onClick={onCancel}>Annuler</button>
    </div>
  );
}

// ─── UPLOAD TAB ───────────────────────────────────────────────────────────────
function UploadTab({ setBets, addBet, bets, updateBet, objectives }) {
  const [mode, setMode] = useState("idle");
  const [files, setFiles] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [queue, setQueue] = useState([]);
  const [queueIdx, setQueueIdx] = useState(0);
  const [extracted, setExtracted] = useState(null);
  const [tag, setTag] = useState("SAFE");
  const [customTag, setCustomTag] = useState("");
  const [isFreebet, setIsFreebet] = useState(false);
  const [objectifId, setObjectifId] = useState(null);
  const [compDetect, setCompDetect] = useState(null);
  const [detectingComp, setDetectingComp] = useState(false);
  const [dupWarning, setDupWarning] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const [error, setError] = useState("");
  const fileRef = useRef();

  const existingTags=[...new Set(bets.map(b=>b.tag).filter(t=>t&&t!=="SAFE"&&t!=="FUN"))];

  const addFiles=(newFiles)=>{
    const arr=Array.from(newFiles).filter(f=>f.type.startsWith("image/"));
    setFiles(prev=>[...prev,...arr.map(f=>({file:f,previewUrl:URL.createObjectURL(f)}))].slice(0,5));
  };
  const removeFile=(idx)=>setFiles(prev=>prev.filter((_,i)=>i!==idx));

  const handleAnalyze=async()=>{
    if(files.length===0)return;
    setAnalyzing(true);setError("");
    try{
      const results=await analyzeMultipleScreenshots(files.map(f=>f.file));
      setQueue(results);setQueueIdx(0);loadQueueItem(results,0);setMode("multi");
    }catch(e){setError("Erreur d'analyse : "+e.message);}
    setAnalyzing(false);
  };

  const loadQueueItem=(q,idx)=>{
    const item=q[idx];
    if(!item||!item.ok)return;
    const data=item.data;
    setExtracted(data);setIsFreebet(!!data.is_freebet);setObjectifId(null);
    setTag("SAFE");setCustomTag("");setCompDetect(null);
    const isDup=data.bet_ref&&bets.some(b=>b.bet_ref===data.bet_ref);
    setDupWarning(isDup);
    if(data.team_1&&data.team_2){
      setDetectingComp(true);
      detectCompetition(data.team_1,data.team_2,data.date).then(comp=>{
        setCompDetect(comp);
        setExtracted(prev=>prev?({...prev,competition:normalizeCompetition(comp.competition)}):prev);
      }).catch(()=>{}).finally(()=>setDetectingComp(false));
    }
  };

  const upd=(k,v)=>setExtracted(p=>p?({...p,[k]:v}):p);

  const handleConfirm=async(force=false)=>{
    if(!force&&dupWarning)return;
    setSaving(true);
    const finalTag=customTag.trim()?customTag.trim().toUpperCase():tag;
    try{
      await addBet({...extracted,tag:finalTag,is_freebet:isFreebet,objectif_id:objectifId});
      setSavedCount(c=>c+1);
      const nextIdx=queueIdx+1;
      if(nextIdx<queue.length){setQueueIdx(nextIdx);loadQueueItem(queue,nextIdx);}
      else setMode("done");
    }catch(e){setError("Erreur : "+e.message);}
    setSaving(false);
  };

  const handleSkip=()=>{
    const nextIdx=queueIdx+1;
    if(nextIdx<queue.length){setQueueIdx(nextIdx);loadQueueItem(queue,nextIdx);}
    else setMode("done");
  };

  const reset=()=>{
    setMode("idle");setFiles([]);setQueue([]);setQueueIdx(0);setExtracted(null);
    setAnalyzing(false);setCompDetect(null);setDetectingComp(false);
    setDupWarning(false);setSaving(false);setSavedCount(0);setError("");
    if(fileRef.current)fileRef.current.value="";
  };

  if(mode==="done")return(
    <div className="success-screen">
      <div className="success-icon">✅</div>
      <div className="success-title">{savedCount} pari{savedCount>1?"s":""} enregistré{savedCount>1?"s":""}!</div>
      <div className="success-sub">Tes stats sont à jour.</div>
      <button className="btn-primary" style={{marginTop:20,maxWidth:220}} onClick={reset}>Importer d'autres</button>
    </div>
  );

  if(analyzing)return(
    <div style={{textAlign:'center',padding:'56px 0'}}>
      <div className="spinner" style={{margin:'0 auto 14px',width:44,height:44}}/>
      <div className="analyzing-text">Analyse de {files.length} capture{files.length>1?"s":""}…</div>
      <div className="analyzing-sub">Extraction IA en cours</div>
    </div>
  );

  if(mode==="multi"&&queue.length>0&&extracted){
    const currentItem=queue[queueIdx];
    const isMymatch=false; // mymatch treated as simple
    return(
      <div>
        {queue.length>1&&(
          <div className="step-progress">
            {queue.map((_,i)=><div key={i} className={`step-dot ${i<queueIdx?'done':i===queueIdx?'active':''}`}/>)}
          </div>
        )}
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
          <div className="validation-title">Valider le pari {queue.length>1?`${queueIdx+1}/${queue.length}`:""}</div>
          <div className={`result-chip ${extracted.result==='win'?'result-win':'result-loss'}`}>{extracted.result==='win'?'🏆 Win':'❌ Loss'}</div>
        </div>

        {currentItem.previewUrl&&<div className="image-preview-wrap"><img src={currentItem.previewUrl} alt=""/></div>}

        {dupWarning&&(
          <div style={{background:'rgba(255,153,87,0.08)',border:'1px solid rgba(255,153,87,0.3)',borderRadius:'var(--radius-sm)',padding:'10px',marginBottom:10}}>
            <div style={{fontFamily:'var(--font-head)',fontSize:12,fontWeight:700,color:'var(--fun)',marginBottom:6}}>⚠️ Référence déjà enregistrée</div>
            <div style={{display:'flex',gap:7}}>
              <button onClick={()=>handleConfirm(true)} disabled={saving} style={{flex:1,padding:'7px',background:'rgba(255,153,87,0.12)',border:'1px solid rgba(255,153,87,0.35)',borderRadius:7,color:'var(--fun)',fontSize:11,fontWeight:700,cursor:'pointer',fontFamily:'var(--font-head)'}}>Enregistrer quand même</button>
              <button onClick={handleSkip} style={{flex:1,padding:'7px',background:'var(--surface2)',border:'1px solid var(--border)',borderRadius:7,color:'var(--text2)',fontSize:11,fontWeight:700,cursor:'pointer',fontFamily:'var(--font-head)'}}>Ignorer</button>
            </div>
          </div>
        )}

        {(detectingComp||compDetect)&&(
          <div className="competition-detect">
            <div style={{fontSize:14,flexShrink:0}}>{detectingComp?'🔍':'🏆'}</div>
            <div>{detectingComp?<div style={{fontSize:11,color:'var(--accent2)'}}>Recherche compétition…</div>:<><div className="competition-detect-label">Compétition détectée</div><div className="competition-detect-name">{compDetect.competition}</div></>}</div>
          </div>
        )}

        <div className="card">
          <div className="card-title">Infos match</div>
          <div className="field-row">
            <div className="field-group"><div className="field-label">Sport</div><input className="field-input" value={extracted.sport||""} onChange={e=>upd("sport",e.target.value)}/></div>
            <div className="field-group"><div className="field-label">Bookmaker</div><select className="field-input" value={extracted.bookmaker||""} onChange={e=>upd("bookmaker",e.target.value)}><option>Winamax</option><option>Betclic</option></select></div>
          </div>
          <div className="field-group"><div className="field-label">Compétition</div><input className="field-input" value={extracted.competition||""} onChange={e=>upd("competition",normalizeCompetition(e.target.value))}/></div>
          <div className="field-row">
            <div className="field-group"><div className="field-label">Équipe 1</div><input className="field-input" value={extracted.team_1||""} onChange={e=>upd("team_1",e.target.value)}/></div>
            <div className="field-group"><div className="field-label">Équipe 2</div><input className="field-input" value={extracted.team_2||""} onChange={e=>upd("team_2",e.target.value)}/></div>
          </div>
          <div className="field-row">
            <div className="field-group"><div className="field-label">Date</div><input className="field-input" type="date" value={extracted.date||""} onChange={e=>upd("date",e.target.value)}/></div>
            <div className="field-group"><div className="field-label">Heure</div><input className="field-input" value={extracted.heure||""} onChange={e=>upd("heure",e.target.value)}/></div>
          </div>
        </div>

        <div className="card">
          <div className="card-title">Structure & Résultat</div>
          <div className="field-row">
            <div className="field-group"><div className="field-label">Structure</div><select className="field-input" value={extracted.bet_structure==="mymatch"?"simple":extracted.bet_structure||"simple"} onChange={e=>upd("bet_structure",e.target.value)}><option value="simple">Simple</option><option value="combiné">Combiné</option></select></div>
            <div className="field-group"><div className="field-label">Résultat</div><select className="field-input" value={extracted.result||"win"} onChange={e=>upd("result",e.target.value)}><option value="win">Gagné</option><option value="loss">Perdu</option></select></div>
          </div>
          <div className="field-row">
            <div className="field-group"><div className="field-label">Cote totale</div><input className="field-input" type="number" step="0.01" value={extracted.total_odd||""} onChange={e=>upd("total_odd",parseFloat(e.target.value))}/></div>
            <div className="field-group"><div className="field-label">{isFreebet?"Valeur freebet (€)":"Mise (€)"}</div><input className="field-input" type="number" step="0.5" value={extracted.stake||""} onChange={e=>upd("stake",parseFloat(e.target.value))}/></div>
          </div>
          <div className="field-group"><div className="field-label">Gain réel (€)</div><input className="field-input" type="number" step="0.01" value={extracted.actual_win||""} onChange={e=>upd("actual_win",parseFloat(e.target.value))}/></div>
          <label className={`freebet-toggle ${isFreebet?'active':''}`} onClick={()=>setIsFreebet(p=>!p)}>
            <div className={`freebet-box ${isFreebet?'checked':''}`}>{isFreebet&&<span style={{color:'#0a0a0f',fontSize:10,fontWeight:800}}>✓</span>}</div>
            <div><div className="freebet-toggle-label">🎁 Freebet</div><div style={{fontSize:10,color:'var(--text3)',marginTop:1}}>Mise réelle 0€</div></div>
          </label>
        </div>

        {extracted.selections?.length>0&&(
          <div className="card">
            <div className="card-title">Sélections ({extracted.selections.length})</div>
            {extracted.selections.map((s,i)=>{
              const isNeg=s.negated||s.selection_type?.includes("— Non");
              const showOdd=s.odd&&s.odd>1;
              const selType=normalizeSelType(s.sel_type||s.selection_type)||"autre";
              const showThreshold=selType==="nb buts"||selType==="nb buts MT"||selType==="handicap";
              return(
                <div key={i} className="selection-item" style={isNeg?{borderColor:'rgba(255,153,87,0.3)'}:{}}>
                  <div className="selection-left">
                    <div className="selection-team">{s.team}{(s.player_display||s.player)?` · ${s.player_display||s.player}`:""}</div>
                    <div style={{display:'flex',alignItems:'center',gap:5,marginTop:2,flexWrap:'wrap'}}>
                      <div className="selection-type">{s.selection_type}</div>
                      <select style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:5,fontSize:10,padding:'1px 5px',color:'var(--accent2)',fontFamily:'var(--font-head)',fontWeight:700,cursor:'pointer'}}
                          value={selType}
                          onChange={e=>{const sels=[...extracted.selections];sels[i]={...sels[i],sel_type:e.target.value};upd("selections",sels);}}>
                          {ALL_SEL_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
                        </select>
                      {showThreshold&&(
                        <div style={{display:'flex',alignItems:'center',gap:3}}>
                          <select style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:5,fontSize:11,padding:'2px 5px',color:s.sel_dir==="-"?"var(--loss)":"var(--win)",fontFamily:'var(--font-head)',fontWeight:800,cursor:'pointer',width:36}}
                            value={s.sel_dir||"+"}
                            onChange={e=>{const sels=[...extracted.selections];sels[i]={...sels[i],sel_dir:e.target.value};upd("selections",sels);}}>
                            <option value="+">+</option>
                            <option value="-">−</option>
                          </select>
                          <input type="number" step="0.5" style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:5,fontSize:11,padding:'2px 5px',color:'var(--text)',fontFamily:'var(--font-head)',fontWeight:700,width:48,outline:'none'}}
                            value={s.sel_threshold||""}
                            placeholder="2.5"
                            onChange={e=>{const sels=[...extracted.selections];sels[i]={...sels[i],sel_threshold:parseFloat(e.target.value)||null};upd("selections",sels);}}/>
                        </div>
                      )}
                      {extracted.bet_structure==="combiné"&&(
                        <select style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:5,fontSize:10,padding:'1px 5px',color:s.sel_result==="win"?"var(--win)":s.sel_result==="loss"?"var(--loss)":"var(--text3)",fontFamily:'var(--font-head)',fontWeight:700,cursor:'pointer'}}
                          value={s.sel_result||""}
                          onChange={e=>{const sels=[...extracted.selections];sels[i]={...sels[i],sel_result:e.target.value||null};upd("selections",sels);}}>
                          <option value="">Résultat ?</option>
                          <option value="win">✓ Gagnée</option>
                          <option value="loss">✗ Perdue</option>
                        </select>
                      )}
                    </div>
                  </div>
                  {showOdd&&<div className="selection-odd">×{fmt(s.odd)}</div>}
                </div>
              );
            })}
          </div>
        )}

        <div className="card">
          <div className="card-title">Catégorie</div>
          <div className="tag-selector">
            {["SAFE","FUN",...existingTags].map(t=><button key={t} className={`tag-btn ${tag===t&&!customTag?'selected':''}`} onClick={()=>setTag(t)}>{t}</button>)}
          </div>
          <input className="field-input" placeholder="Nouvelle catégorie…" value={customTag} onChange={e=>setCustomTag(e.target.value.toUpperCase())}/>
        </div>

        {objectives&&objectives.length>0&&(
          <div className="card">
            <div className="card-title">Objectif personnel</div>
            <select className="field-input" value={objectifId||""} onChange={e=>setObjectifId(e.target.value||null)}>
              <option value="">Aucun objectif</option>
              {objectives.map(o=><option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
          </div>
        )}

        {error&&<div className="error-msg">❌ {error}</div>}
        <button className="btn-primary" onClick={()=>handleConfirm(false)} disabled={saving||dupWarning}>{saving?"Enregistrement…":"✓ Enregistrer ce pari"}</button>
        {queue.length>1&&<button className="btn-secondary" onClick={handleSkip}>Ignorer →</button>}
        <button className="btn-secondary" onClick={reset} style={{marginTop:4}}>Annuler tout</button>
      </div>
    );
  }

  if(mode==="manual")return<ManualImportForm bets={bets} addBet={addBet} existingTags={existingTags} objectives={objectives} onDone={reset} onCancel={()=>setMode("idle")}/>;

  return(
    <div>
      <div className="section-title">Importer des paris</div>
      <div className="tab-switch" style={{marginBottom:14}}>
        <button className="tab-switch-btn active">📲 Screenshot</button>
        <button className="tab-switch-btn" onClick={()=>setMode("manual")}>✏️ Manuel</button>
      </div>

      {files.length===0?(
        <div className="upload-zone">
          <input ref={fileRef} type="file" accept="image/*" multiple onChange={e=>{if(e.target.files?.length)addFiles(e.target.files);}}/>
          <div className="upload-icon">📲</div>
          <div className="upload-title">Importer des captures</div>
          <div className="upload-sub">Appuie pour choisir · jusqu'à 5 screenshots</div>
          <div className="bookmaker-badges"><span className="badge badge-winamax">Winamax</span><span className="badge badge-betclic">Betclic</span></div>
        </div>
      ):(
        <div>
          <div className="multi-upload-grid">
            {files.map((f,i)=>(
              <div key={i} className="multi-thumb">
                <img src={f.previewUrl} alt=""/>
                <div className="multi-thumb-badge">#{i+1}</div>
                <button className="multi-thumb-remove" onClick={()=>removeFile(i)}>✕</button>
              </div>
            ))}
            {files.length<5&&(
              <div className="add-more-zone">
                <input type="file" accept="image/*" multiple onChange={e=>{if(e.target.files?.length)addFiles(e.target.files);}}/>
                <span style={{fontSize:22}}>+</span>
                <span style={{fontSize:10,color:'var(--text3)'}}>Ajouter</span>
              </div>
            )}
          </div>
          <div style={{fontSize:12,color:'var(--text2)',textAlign:'center',marginBottom:12}}>{files.length} capture{files.length>1?"s":""} sélectionnée{files.length>1?"s":""}</div>
          <button className="btn-primary" onClick={handleAnalyze}>🔍 Analyser avec l'IA</button>
          <button className="btn-secondary" onClick={()=>setFiles([])}>Recommencer</button>
        </div>
      )}
      {error&&<div className="error-msg" style={{marginTop:10}}>❌ {error}</div>}
    </div>
  );
}

// ─── BETS TAB ─────────────────────────────────────────────────────────────────
function BetsTab({ bets, onDelete, onUpdate, objectives, onDeleteAll }) {
  const [selected, setSelected] = useState(null);
  const [filterResult, setFilterResult] = useState("Tous");
  const [filterTag, setFilterTag] = useState("Tous");
  const [filterDate, setFilterDate] = useState("Tous");
  const [showDateRange, setShowDateRange] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmReset2, setConfirmReset2] = useState(false);
  const [resetting, setResetting] = useState(false);

  const allTags=["Tous",...Array.from(new Set(bets.map(b=>b.tag).filter(Boolean))).sort()];

  const filtered=bets.filter(b=>{
    if(filterResult==="Win"&&b.result!=="win")return false;
    if(filterResult==="Loss"&&b.result!=="loss")return false;
    if(filterTag!=="Tous"&&b.tag!==filterTag)return false;
    if(filterDate==="Aujourd'hui"&&!isToday(b.date))return false;
    if(filterDate==="Cette semaine"&&!isThisWeek(b.date))return false;
    if(filterDate==="Ce mois"&&!isThisMonth(b.date))return false;
    if(filterDate==="Plage"&&dateFrom&&new Date(b.date)<new Date(dateFrom))return false;
    if(filterDate==="Plage"&&dateTo&&new Date(b.date)>new Date(dateTo))return false;
    return true;
  }).sort((a,b)=>new Date(a.date)-new Date(b.date));

  const sportEmoji={Football:"⚽",Tennis:"🎾",Basketball:"🏀",Rugby:"🏉",Hockey:"🏒"};

  return(
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
        <div className="section-title" style={{marginBottom:0}}>{filtered.length} paris</div>
        {filtered.length!==bets.length&&(
          <button onClick={()=>{setFilterResult("Tous");setFilterTag("Tous");setFilterDate("Tous");}} style={{background:'rgba(255,87,112,0.08)',border:'1px solid rgba(255,87,112,0.2)',borderRadius:20,padding:'3px 9px',fontSize:10,color:'var(--loss)',cursor:'pointer',fontFamily:'var(--font-head)',fontWeight:700}}>✕ Reset</button>
        )}
      </div>

      <div className="date-filter-row">
        {["Tous","Aujourd'hui","Cette semaine","Ce mois","Plage"].map(f=>(
          <button key={f} className={`date-pill ${filterDate===f?'active':''}`} onClick={()=>{setFilterDate(f);setShowDateRange(f==="Plage");}}>
            {f}
          </button>
        ))}
      </div>

      {showDateRange&&filterDate==="Plage"&&(
        <div style={{display:'flex',gap:7,marginBottom:9}}>
          <input className="field-input" type="date" value={dateFrom} onChange={e=>setDateFrom(e.target.value)} style={{fontSize:11,padding:'7px 9px'}}/>
          <input className="field-input" type="date" value={dateTo} onChange={e=>setDateTo(e.target.value)} style={{fontSize:11,padding:'7px 9px'}}/>
        </div>
      )}

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

      {filtered.length===0
        ?<div className="empty-state"><div className="e-icon">🔍</div><div className="e-title">Aucun pari</div><div className="e-sub">Aucun résultat pour ces filtres.</div></div>
        :filtered.map(bet=>{
          const profit=betProfit(bet);
          return(
            <div key={bet.id} className="bet-row" onClick={()=>setSelected(bet)}>
              <div className={`bet-row-result ${bet.result}`}>{bet.result==='win'?'✓':'✕'}</div>
              <div className="bet-row-left">
                <div className="bet-row-type">
                  <span>{sportEmoji[bet.sport]||"🎯"}</span>
                  <span>{displayStructure(bet)==="simple"?"Simple":"Combiné"}</span>
                  {bet.is_freebet&&<span className="freebet-tag" style={{fontSize:9,padding:'1px 4px'}}>FB</span>}
                  {bet.tag&&bet.tag!=="SAFE"&&bet.tag!=="FUN"&&<span style={{fontSize:10,color:'var(--accent2)',fontFamily:'var(--font-head)',fontWeight:700}}>{bet.tag}</span>}
                  {bet.objectif_id&&<span style={{fontSize:10,color:'var(--accent)',fontFamily:'var(--font-head)',fontWeight:700}}>🎯</span>}
                </div>
                <div className="bet-row-meta">{bet.sport} · {comboCompetition(bet)||bet.team_1} · {bet.date}</div>
              </div>
              <div className="bet-row-right">
                {bet.total_odd&&bet.total_odd>1&&<div className="bet-row-odd">×{fmt(bet.total_odd)}</div>}
                <div className="bet-row-gain" style={{color:profit>=0?'var(--win)':'var(--loss)'}}>{fmtEuro(profit)}</div>
              </div>
            </div>
          );
        })
      }
      {bets.length>0&&!confirmReset&&(
        <div style={{marginTop:16,paddingTop:14,borderTop:'1px solid var(--border)'}}>
          <button onClick={()=>setConfirmReset(true)} style={{width:'100%',padding:'10px',background:'transparent',border:'1px solid rgba(255,87,112,0.2)',borderRadius:'var(--radius)',color:'var(--text3)',fontSize:11,fontFamily:'var(--font-head)',fontWeight:700,cursor:'pointer'}}>
            🗑 Nettoyer le compte et recommencer à zéro
          </button>
        </div>
      )}
      {confirmReset&&!confirmReset2&&(
        <div style={{marginTop:16,background:'rgba(255,87,112,0.06)',border:'1px solid rgba(255,87,112,0.2)',borderRadius:'var(--radius)',padding:'14px'}}>
          <div style={{fontFamily:'var(--font-head)',fontSize:13,fontWeight:800,color:'var(--loss)',marginBottom:6}}>⚠️ Supprimer TOUS les paris ?</div>
          <div style={{fontSize:12,color:'var(--text2)',marginBottom:12,lineHeight:1.5}}>Cette action est irréversible. Tous tes paris ({bets.length}) seront définitivement supprimés.</div>
          <div style={{display:'flex',gap:8}}>
            <button onClick={()=>{setConfirmReset(false);}} style={{flex:1,padding:'10px',background:'var(--surface2)',border:'1px solid var(--border)',borderRadius:'var(--radius)',color:'var(--text2)',fontSize:12,fontFamily:'var(--font-head)',fontWeight:700,cursor:'pointer'}}>Annuler</button>
            <button onClick={()=>setConfirmReset2(true)} style={{flex:1,padding:'10px',background:'rgba(255,87,112,0.12)',border:'1px solid rgba(255,87,112,0.3)',borderRadius:'var(--radius)',color:'var(--loss)',fontSize:12,fontFamily:'var(--font-head)',fontWeight:800,cursor:'pointer'}}>Oui, supprimer</button>
          </div>
        </div>
      )}
      {confirmReset2&&(
        <div style={{marginTop:16,background:'rgba(255,87,112,0.1)',border:'2px solid rgba(255,87,112,0.4)',borderRadius:'var(--radius)',padding:'14px'}}>
          <div style={{fontFamily:'var(--font-head)',fontSize:13,fontWeight:800,color:'var(--loss)',marginBottom:6}}>🚨 Dernière confirmation</div>
          <div style={{fontSize:12,color:'var(--text)',marginBottom:12,lineHeight:1.5}}>Tu es <strong>absolument certain</strong> de vouloir effacer les {bets.length} paris ? Cette action est <strong>définitive</strong>.</div>
          <div style={{display:'flex',gap:8}}>
            <button onClick={()=>{setConfirmReset(false);setConfirmReset2(false);}} style={{flex:1,padding:'10px',background:'var(--surface2)',border:'1px solid var(--border)',borderRadius:'var(--radius)',color:'var(--text2)',fontSize:12,fontFamily:'var(--font-head)',fontWeight:700,cursor:'pointer'}}>Non, garder</button>
            <button onClick={async()=>{setResetting(true);await onDeleteAll();setConfirmReset(false);setConfirmReset2(false);setResetting(false);}} disabled={resetting} style={{flex:1,padding:'10px',background:'var(--loss)',border:'none',borderRadius:'var(--radius)',color:'#0a0a0f',fontSize:12,fontFamily:'var(--font-head)',fontWeight:800,cursor:'pointer'}}>
              {resetting?"Suppression…":"💥 Effacer tout"}
            </button>
          </div>
        </div>
      )}
      {selected&&<BetDetailModal bet={selected} onClose={()=>setSelected(null)} onDelete={onDelete?(id)=>{onDelete(id);setSelected(null);}:null} onUpdate={onUpdate} allTags={allTags.filter(t=>t!=="Tous")} objectives={objectives}/>}
    </div>
  );
}

// ─── CHARTS ──────────────────────────────────────────────────────────────────
function StatSection({ title, children, defaultOpen=true }) {
  const [open, setOpen] = useState(defaultOpen);
  return(
    <div className="stat-section">
      <div className="stat-section-header" onClick={()=>setOpen(o=>!o)}>
        <span className="stat-section-title">{title}</span>
        <span className={`stat-section-arrow ${open?'open':''}`}>▾</span>
      </div>
      <div className={`stat-section-body ${open?'open':'closed'}`}>{children}</div>
    </div>
  );
}

function BankrollChart({ bets }) {
  const [bankrollInput, setBankrollInput] = useState("");
  const [editing, setEditing] = useState(false);
  const [tempVal, setTempVal] = useState("");
  const [hoverIdx, setHoverIdx] = useState(null);
  const svgRef = useRef(null);
  const startCapital = parseFloat(bankrollInput)||0;
  if(bets.length<2)return<div style={{textAlign:'center',color:'var(--text3)',fontSize:12,padding:'12px 0'}}>Pas assez de données</div>;
  const sorted=[...bets].sort((a,b)=>new Date(a.date)-new Date(b.date));
  let running=startCapital;
  const points=[{label:"Début",v:startCapital}];
  sorted.forEach(b=>{running+=betProfit(b);points.push({label:b.date.slice(5),v:running});});
  const values=points.map(p=>p.v);
  const mn=Math.min(...values),mx=Math.max(...values),range=Math.max(mx-mn,0.01);
  const W=340,H=100;
  const px=i=>(i/(points.length-1))*(W-4)+2;
  const py=v=>H-((v-mn)/range)*(H-16)-2;
  const d=points.map((p,i)=>`${i===0?'M':'L'}${px(i).toFixed(1)},${py(p.v).toFixed(1)}`).join(' ');
  const fill=d+` L${px(points.length-1).toFixed(1)},${H} L${px(0).toFixed(1)},${H} Z`;
  const last=values[values.length-1];
  const color=last>=startCapital?'#57ff9e':'#ff5770';
  const zeroY=py(startCapital);
  const maxIdx=values.indexOf(mx),minIdx=values.indexOf(mn);
  const labelIdxs=[...new Set([0,maxIdx,minIdx,points.length-1])].sort((a,b)=>a-b);
  const getIdxFromX=(clientX)=>{
    if(!svgRef.current)return null;
    const rect=svgRef.current.getBoundingClientRect();
    const frac=(clientX-rect.left-2)/(rect.width-4);
    return Math.max(0,Math.min(points.length-1,Math.round(frac*(points.length-1))));
  };
  const hoverPt=hoverIdx!==null?points[hoverIdx]:null;
  const hoverX=hoverIdx!==null?px(hoverIdx):null;
  const hoverY=hoverPt?py(hoverPt.v):null;
  return(
    <div>
      <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:10}}>
        <span style={{fontSize:10,color:'var(--text3)',textTransform:'uppercase',letterSpacing:'0.5px',fontWeight:600}}>Capital départ</span>
        {editing?(
          <div style={{display:'flex',gap:5,alignItems:'center',flex:1}}>
            <input style={{flex:1,background:'var(--surface2)',border:'1px solid var(--accent)',borderRadius:7,padding:'3px 9px',color:'var(--text)',fontFamily:'var(--font-head)',fontSize:12,fontWeight:700,outline:'none'}}
              value={tempVal} onChange={e=>setTempVal(e.target.value)} type="number" placeholder="0" autoFocus
              onKeyDown={e=>{if(e.key==="Enter"){setBankrollInput(tempVal);setEditing(false);}if(e.key==="Escape")setEditing(false);}}/>
            <span style={{fontSize:12,color:'var(--text2)'}}>€</span>
            <button onClick={()=>{setBankrollInput(tempVal);setEditing(false);}} style={{background:'var(--accent)',color:'#0a0a0f',border:'none',borderRadius:5,padding:'3px 9px',fontFamily:'var(--font-head)',fontSize:11,fontWeight:800,cursor:'pointer'}}>OK</button>
          </div>
        ):(
          <button onClick={()=>{setTempVal(bankrollInput);setEditing(true);}} style={{background:'var(--surface2)',border:'1px solid var(--border)',borderRadius:7,padding:'3px 10px',color:bankrollInput?'var(--accent)':'var(--text3)',fontFamily:'var(--font-head)',fontSize:12,fontWeight:700,cursor:'pointer'}}>
            {bankrollInput?`${bankrollInput}€`:"Définir →"}
          </button>
        )}
        <span style={{marginLeft:'auto',fontFamily:'var(--font-head)',fontSize:15,fontWeight:800,color:last>=startCapital?'var(--win)':'var(--loss)'}}>
          {hoverPt?<>{hoverPt.v>=0?'+':''}{fmt(hoverPt.v,0)}€ <span style={{fontSize:10,color:'var(--text3)',fontWeight:500}}>{hoverPt.label}</span></>:<>{last-startCapital>=0?'+':''}{fmt(last-startCapital,0)}€</>}
        </span>
      </div>
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} width="100%" height="110"
        style={{display:'block',overflow:'visible',cursor:'crosshair',touchAction:'pan-y'}}
        onMouseMove={e=>setHoverIdx(getIdxFromX(e.clientX))} onTouchMove={e=>setHoverIdx(getIdxFromX(e.touches[0].clientX))}
        onMouseLeave={()=>setHoverIdx(null)} onTouchEnd={()=>setHoverIdx(null)}>
        <defs><linearGradient id="brGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.22"/><stop offset="100%" stopColor={color} stopOpacity="0.02"/></linearGradient></defs>
        {zeroY>=0&&zeroY<=H&&<line x1={0} y1={zeroY.toFixed(1)} x2={W} y2={zeroY.toFixed(1)} stroke="var(--border)" strokeWidth="1" strokeDasharray="4,4"/>}
        <path d={fill} fill="url(#brGrad)"/>
        <path d={d} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        {hoverIdx===null&&<circle cx={px(points.length-1).toFixed(1)} cy={py(last).toFixed(1)} r="4.5" fill={color}/>}
        {hoverIdx===null&&labelIdxs.map(i=>{const p=points[i];const x=px(i);const y=py(p.v);const above=y>20;return<g key={i}><circle cx={x.toFixed(1)} cy={y.toFixed(1)} r="2.5" fill={p.v>=startCapital?'var(--win)':'var(--loss)'} opacity="0.7"/><text x={Math.min(Math.max(x,14),W-14).toFixed(1)} y={above?(y-6).toFixed(1):(y+12).toFixed(1)} textAnchor="middle" fill="var(--text3)" fontSize="7" fontFamily="var(--font-head)" fontWeight="700">{p.v>=0?'+':''}{fmt(p.v,0)}€</text></g>;})}
        {hoverPt&&hoverX!==null&&hoverY!==null&&<><line x1={hoverX.toFixed(1)} y1={0} x2={hoverX.toFixed(1)} y2={H} stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="3,3"/><circle cx={hoverX.toFixed(1)} cy={hoverY.toFixed(1)} r="5" fill={color} stroke="var(--bg)" strokeWidth="2"/></>}
      </svg>
      <div style={{display:'flex',justifyContent:'space-between',marginTop:5}}>
        <div style={{fontSize:10,color:'var(--text3)'}}>Max : <span style={{color:'var(--win)',fontFamily:'var(--font-head)',fontWeight:700}}>{fmt(mx,0)}€</span></div>
        <div style={{fontSize:10,color:'var(--text3)'}}>Min : <span style={{color:'var(--loss)',fontFamily:'var(--font-head)',fontWeight:700}}>{fmt(mn,0)}€</span></div>
        <div style={{fontSize:10,color:'var(--text3)'}}>{sorted.length} paris</div>
      </div>
    </div>
  );
}

function MonthlyBarChart({ bets }) {
  const [activeIdx, setActiveIdx] = useState(null);
  const grouped={};
  bets.forEach(b=>{const k=monthKey(b.date);if(!grouped[k])grouped[k]=[];grouped[k].push(b);});
  const keys=Object.keys(grouped).sort().slice(-12);
  const data=keys.map(k=>{const p=grouped[k].reduce((a,b)=>a+betProfit(b),0);return{label:fmtMonthLabel(k),value:p,count:grouped[k].length};});
  if(data.length<2)return<div style={{textAlign:'center',color:'var(--text3)',fontSize:12,padding:'12px 0'}}>Pas assez de données</div>;
  const maxAbs=Math.max(...data.map(d=>Math.abs(d.value)),0.01);
  const barW=Math.min(38,Math.floor(300/data.length)-4);
  return(
    <div>
      {activeIdx!==null&&(
        <div style={{textAlign:'center',marginBottom:7,background:'var(--surface2)',borderRadius:7,padding:'5px 0'}}>
          <span style={{fontFamily:'var(--font-head)',fontSize:12,fontWeight:800,color:'var(--text)'}}>{data[activeIdx].label}</span>
          <span style={{fontSize:11,color:'var(--text2)',marginLeft:7}}>{data[activeIdx].count} paris</span>
          <span style={{fontFamily:'var(--font-head)',fontSize:12,fontWeight:800,color:data[activeIdx].value>=0?'var(--win)':'var(--loss)',marginLeft:7}}>{fmtEuro(data[activeIdx].value)}</span>
        </div>
      )}
      <div style={{display:'flex',alignItems:'flex-end',gap:3,height:75,paddingBottom:4}}>
        {data.map((d,i)=>{
          const pct=Math.abs(d.value)/maxAbs,h=Math.max(pct*63,4);
          return(
            <div key={i} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:2,cursor:'pointer'}} onClick={()=>setActiveIdx(activeIdx===i?null:i)}>
              <div style={{width:'100%',height:63,display:'flex',alignItems:'flex-end',justifyContent:'center'}}>
                <div style={{width:'100%',maxWidth:barW,height:h,borderRadius:'3px 3px 0 0',background:d.value>=0?'var(--win)':'var(--loss)',opacity:activeIdx===i?1:0.7,minHeight:4,outline:activeIdx===i?`2px solid ${d.value>=0?'var(--win)':'var(--loss)'}`:''}}/>
              </div>
              <div style={{fontSize:7,color:activeIdx===i?'var(--text)':'var(--text3)',fontFamily:'var(--font-head)',fontWeight:700,maxWidth:barW+4,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',textAlign:'center'}}>{d.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CategoryPieChart({ bets }) {
  const COLORS=['var(--accent)','var(--accent2)','var(--win)','var(--fun)','var(--scorer)','#ff9957','#a78bfa','#f472b6'];
  const allTags=[...new Set(bets.map(b=>b.tag).filter(Boolean))];
  if(!allTags.length)return null;
  const data=allTags.map((t,i)=>({label:t,count:bets.filter(b=>b.tag===t).length,color:COLORS[i%COLORS.length]})).sort((a,b)=>b.count-a.count);
  const total=data.reduce((a,d)=>a+d.count,0);
  if(!total)return null;
  const R=58,cx=73,cy=68,size=146;
  let cumAngle=-Math.PI/2;
  const slices=data.map(d=>{const angle=(d.count/total)*2*Math.PI,start=cumAngle;cumAngle+=angle;const x1=cx+R*Math.cos(start),y1=cy+R*Math.sin(start),x2=cx+R*Math.cos(cumAngle),y2=cy+R*Math.sin(cumAngle),large=angle>Math.PI?1:0;return{...d,path:`M${cx},${cy} L${x1.toFixed(2)},${y1.toFixed(2)} A${R},${R},0,${large},1,${x2.toFixed(2)},${y2.toFixed(2)} Z`};});
  return(
    <div style={{display:'flex',alignItems:'center',gap:11}}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{flexShrink:0}}>
        {slices.map((s,i)=><path key={i} d={s.path} fill={s.color} opacity="0.85"/>)}
        <circle cx={cx} cy={cy} r={R*0.48} fill="var(--surface)"/>
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fill="var(--text)" fontSize="12" fontFamily="var(--font-head)" fontWeight="800">{total}</text>
        <text x={cx} y={cy+13} textAnchor="middle" fill="var(--text3)" fontSize="7" fontFamily="var(--font-head)">paris</text>
      </svg>
      <div style={{flex:1}}>
        {data.map((d,i)=>(
          <div key={i} style={{display:'flex',alignItems:'center',gap:7,marginBottom:6}}>
            <div style={{width:9,height:9,borderRadius:2,background:d.color,flexShrink:0}}/>
            <div style={{flex:1,fontSize:11,fontFamily:'var(--font-head)',fontWeight:700,color:'var(--text)'}}>{d.label}</div>
            <div style={{fontSize:11,color:'var(--text2)',fontFamily:'var(--font-head)',fontWeight:700}}>{d.count}</div>
            <div style={{fontSize:10,color:'var(--text3)',minWidth:30,textAlign:'right'}}>{fmt(d.count/total*100,0)}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SegTable({ rows }) {
  if(!rows||!rows.length)return<div style={{textAlign:'center',color:'var(--text3)',fontSize:12,padding:'8px 0'}}>Pas assez de données</div>;
  return(
    <div className="card" style={{padding:0,overflow:'hidden'}}>
      <table className="data-table">
        <thead><tr><th>Segment</th><th style={{textAlign:'center'}}>Paris</th><th style={{textAlign:'center'}}>Réussite</th><th style={{textAlign:'right'}}>Profit</th><th style={{textAlign:'right'}}>ROI</th></tr></thead>
        <tbody>
          {rows.map((r,i)=>(
            <tr key={i}>
              <td className="num">{r.label}</td>
              <td style={{textAlign:'center',color:'var(--text2)'}}>{r.count}</td>
              <td style={{textAlign:'center',fontFamily:'var(--font-head)',fontWeight:700,color:r.rate>=50?'var(--win)':'var(--text2)'}}>{fmt(r.rate,0)}%</td>
              <td style={{textAlign:'right',fontFamily:'var(--font-head)',fontWeight:800,color:r.profit!=null?(r.profit>=0?'var(--win)':'var(--loss)'):'var(--text2)'}}>{r.profit!=null?fmtEuro(r.profit):'—'}</td>
              <td style={{textAlign:'right',fontFamily:'var(--font-head)',fontWeight:700,fontSize:11,color:r.roi!=null?(r.roi>=0?'var(--win)':'var(--loss)'):'var(--text3)'}}>{r.roi!=null?`${r.roi>=0?'+':''}${fmt(r.roi,1)}%`:'—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SelTable({ rows, label }) {
  if(!rows||!rows.length)return<div style={{textAlign:'center',color:'var(--text3)',fontSize:12,padding:'8px 0'}}>Pas assez de données</div>;
  return(
    <div className="card" style={{padding:0,overflow:'hidden'}}>
      <table className="data-table">
        <thead><tr><th>{label}</th><th style={{textAlign:'center'}}>Sél.</th><th style={{textAlign:'center'}}>Réussite</th></tr></thead>
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

// ─── DASHBOARD TAB ────────────────────────────────────────────────────────────
function DashboardTab({ bets, username }) {
  const [pView, setPView] = useState("top");
  if(bets.length===0)return<div className="empty-state"><div className="e-icon">📊</div><div className="e-title">Aucune donnée</div><div className="e-sub">Importez vos premiers paris.</div></div>;

  const s=computeStats(bets);
  const freebets=bets.filter(b=>b.is_freebet);
  const allTags=[...new Set(bets.map(b=>b.tag).filter(Boolean))];
  const tagRows=allTags.map(t=>{const sub=bets.filter(b=>b.tag===t);const st=computeStats(sub);return{label:t,count:sub.length,rate:st.rate,profit:st.profit,roi:st.roi};}).sort((a,b)=>b.profit-a.profit);
  const structureRows=(()=>{const simpleB=bets.filter(b=>b.bet_structure==="simple"||b.bet_structure==="mymatch");const comboB=bets.filter(b=>b.bet_structure==="combiné");const rows=[];if(simpleB.length){const st=computeStats(simpleB);rows.push({label:"Simple",count:simpleB.length,rate:st.rate,profit:st.profit,roi:st.roi});}if(comboB.length){const st=computeStats(comboB);rows.push({label:"Combiné",count:comboB.length,rate:st.rate,profit:st.profit,roi:st.roi});}return rows;})();
  const sportRows=[...new Set(bets.map(b=>b.sport).filter(Boolean))].map(sp=>{const sub=bets.filter(b=>b.sport===sp);const st=computeStats(sub);return{label:sp,count:sub.length,rate:st.rate,profit:st.profit,roi:st.roi};}).sort((a,b)=>b.profit-a.profit);
  const allSels=getAllSelections(bets);
  const selTypeRows=getSelGroupStats(allSels,s=>s._selType);
  // For combinés: individual selection success
  const comboSels=getAllSelections(bets.filter(b=>b.bet_structure==="combiné"));
  const comboSelResults=comboSels.filter(s=>s.sel_result!=null);
  const comboSelRateByType=comboSelResults.length>0?getSelGroupStatsIndividual(comboSelResults,s=>s._selType):[];
  const mymatchCombos=getMymatchCombos(bets);
  // Competition: normalize and group properly
  const normalizedSels=allSels.map(sel=>({...sel,_competition:normalizeCompetition(sel._competition||"")||normalizeCompetition(sel._bet?.competition||"")||""}));
  const compRows=getSelGroupStats(normalizedSels.filter(s=>s._competition),s=>s._competition).slice(0,12);
  const oddRanges=getOddRangeStats(bets);
  const streaks=getStreaks(bets);
  const players=getPlayerStats(bets);
  const topP=[...players].filter(p=>p.count>=2).sort((a,b)=>(b.count>0?b.wins/b.count:0)-(a.count>0?a.wins/a.count:0)||b.count-a.count).slice(0,5);
  const worstP=[...players].filter(p=>p.count>=2).sort((a,b)=>(a.count>0?a.wins/a.count:0)-(b.count>0?b.wins/b.count:0)||b.count-a.count).slice(0,5);
  const shown=pView==="top"?topP:worstP;

  return(
    <div>
      <div className="section-title">Résumé global</div>
      {/* KPIs 2x2 + full rows */}
      <div className="stat-grid">
        <div className="stat-card"><div className="stat-label">Total paris</div><div className="stat-value neutral">{s.total}</div><div className="stat-sub">{s.wins} gagnés</div></div>
        <div className="stat-card"><div className="stat-label">Taux de réussite</div><div className={`stat-value ${s.rate>=50?'positive':'negative'}`}>{fmt(s.rate,0)}%</div><div className="stat-sub">sur {s.total} paris</div></div>
        <div className="stat-card"><div className="stat-label">Total misé</div><div className="stat-value neutral">{fmt(s.totalStake,0)}€</div><div className="stat-sub">{freebets.length>0?`${freebets.length} freebets excl.`:''}</div></div>
        <div className="stat-card"><div className="stat-label">Cote moy. pond.</div><div className="stat-value neutral">{s.avgOdd?`×${fmt(s.avgOdd)}`:"—"}</div><div className="stat-sub" style={{fontSize:10}}>hors MyMatch & extrêmes</div></div>
        <div className="stat-card"><div className="stat-label">Profit total</div><div className={`stat-value ${s.profit>=0?'positive':'negative'}`} style={{fontSize:28}}>{fmtEuro(s.profit)}</div>{freebets.length>0&&<div className="stat-sub">dont {fmtEuro(freebets.reduce((a,b)=>a+betProfit(b),0))} freebets</div>}</div>
        <div className="stat-card"><div className="stat-label">ROI global</div><div className={`stat-value ${s.roi!=null?(s.roi>=0?'positive':'negative'):'neutral'}`} style={{fontSize:28}}>{s.roi!=null?`${s.roi>=0?'+':''}${fmt(s.roi,1)}%`:"—"}</div><div className="stat-sub" style={{fontSize:10}}>{s.totalStake>0?`sur ${fmt(s.totalStake,0)}€ misés`:''}</div></div>
      </div>

      <div className="section-title" style={{marginTop:6}}>Évolution de la bankroll</div>
      <div className="card" style={{padding:'12px 12px 9px'}}><BankrollChart bets={bets}/></div>

      <div style={{marginTop:10}}>
        <StatSection title="📊 Performance par mois">
          <div className="card" style={{padding:'12px 12px 9px'}}><MonthlyBarChart bets={bets}/></div>
        </StatSection>

        <StatSection title="🏷️ Par catégorie">
          <SegTable rows={tagRows}/>
          <div className="card" style={{padding:'14px',marginTop:7}}><CategoryPieChart bets={bets}/></div>
        </StatSection>

        <StatSection title="🏗️ Par structure de pari">
          <SegTable rows={structureRows}/>
        </StatSection>

        <StatSection title="⚽ Par sport">
          <SegTable rows={sportRows}/>
        </StatSection>

        {allSels.length>0&&(
          <StatSection title="🎯 Par type de sélection">
            <SelTable rows={selTypeRows} label="Type"/>
          </StatSection>
        )}

        {mymatchCombos.length>0&&(
          <StatSection title="🔗 Mes combos MyMatch">
            <div className="card" style={{padding:0,overflow:'hidden'}}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Combo</th>
                    <th style={{textAlign:'center'}}>N</th>
                    <th style={{textAlign:'center'}}>Réussite</th>
                    <th style={{textAlign:'right'}}>Profit</th>
                    <th style={{textAlign:'right'}}>ROI</th>
                  </tr>
                </thead>
                <tbody>
                  {mymatchCombos.map((r,i)=>(
                    <tr key={i}>
                      <td style={{fontSize:10,color:'var(--text)',fontWeight:600,lineHeight:1.4,maxWidth:110,wordBreak:'break-word'}}>{r.label}</td>
                      <td style={{textAlign:'center',color:'var(--text2)',fontFamily:'var(--font-head)',fontWeight:700}}>{r.total}</td>
                      <td style={{textAlign:'center',fontFamily:'var(--font-head)',fontWeight:800,color:r.rate>=50?'var(--win)':'var(--loss)'}}>{fmt(r.rate,0)}%</td>
                      <td style={{textAlign:'right',fontFamily:'var(--font-head)',fontWeight:700,fontSize:11,color:r.profit>=0?'var(--win)':'var(--loss)'}}>{fmtEuro(r.profit)}</td>
                      <td style={{textAlign:'right',fontFamily:'var(--font-head)',fontWeight:700,fontSize:11,color:r.roi!=null?(r.roi>=0?'var(--win)':'var(--loss)'):'var(--text3)'}}>{r.roi!=null?`${r.roi>=0?'+':''}${fmt(r.roi,1)}%`:'—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </StatSection>
        )}

        {compRows.length>0&&(
          <StatSection title="🏆 Par compétition">
            <SelTable rows={compRows} label="Compétition"/>
          </StatSection>
        )}

        {oddRanges.length>0&&(
          <StatSection title="📈 Par tranche de cote">
            <div className="card" style={{padding:0,overflow:'hidden'}}>
              <table className="data-table">
                <thead><tr><th>Cote</th><th>Paris</th><th>Réussite</th><th>Profit</th><th>ROI</th></tr></thead>
                <tbody>
                  {oddRanges.map((r,i)=>(
                    <tr key={i}>
                      <td className="num">{r.label}</td>
                      <td>{r.count}</td>
                      <td>{fmt(r.rate,0)}%</td>
                      <td className="num" style={{color:r.profit>=0?'var(--win)':'var(--loss)'}}>{fmtEuro(r.profit)}</td>
                      <td style={{fontFamily:'var(--font-head)',fontWeight:700,fontSize:11,color:r.roi!=null?(r.roi>=0?'var(--win)':'var(--loss)'):'var(--text3)'}}>{r.roi!=null?`${r.roi>=0?'+':''}${fmt(r.roi,1)}%`:'—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </StatSection>
        )}

        {bets.length>=2&&(
          <StatSection title="🔥 Séries & Streaks">
            <div className="card">
              <div style={{display:'flex',gap:9,marginBottom:12}}>
                <div style={{flex:1,background:'var(--surface2)',borderRadius:'var(--radius-sm)',padding:'9px 11px',textAlign:'center'}}>
                  <div style={{fontSize:10,color:'var(--text3)',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:3,fontWeight:600}}>Série actuelle</div>
                  <div style={{fontFamily:'var(--font-head)',fontSize:22,fontWeight:800,color:streaks.currentType==='win'?'var(--win)':'var(--loss)'}}>{streaks.current}×</div>
                  <div style={{fontSize:11,color:'var(--text2)'}}>{streaks.currentType==='win'?'Victoires':'Défaites'}</div>
                </div>
                <div style={{flex:1,background:'var(--surface2)',borderRadius:'var(--radius-sm)',padding:'9px 11px',textAlign:'center'}}>
                  <div style={{fontSize:10,color:'var(--text3)',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:3,fontWeight:600}}>Meilleure série</div>
                  <div style={{fontFamily:'var(--font-head)',fontSize:22,fontWeight:800,color:'var(--win)'}}>{streaks.bestWin}×</div>
                  <div style={{fontSize:11,color:'var(--text2)'}}>Victoires consécutives</div>
                </div>
              </div>
              {streaks.last10.length>0&&(
                <div>
                  <div style={{fontSize:10,color:'var(--text3)',textTransform:'uppercase',letterSpacing:'0.5px',marginBottom:7,fontWeight:600}}>Derniers {streaks.last10.length} paris</div>
                  <div style={{display:'flex',gap:4,flexWrap:'wrap'}}>
                    {streaks.last10.map((r,i)=><div key={i} className={`streak-dot ${r}`}>{r==='win'?'W':'L'}</div>)}
                  </div>
                </div>
              )}
            </div>
          </StatSection>
        )}

        {players.length>0&&(
          <StatSection title="⭐ Classement joueurs">
            <div className="card">
              <div className="tab-switch">
                <button className={`tab-switch-btn ${pView==='top'?'active':''}`} onClick={()=>setPView('top')}>🏆 Top performers</button>
                <button className={`tab-switch-btn ${pView==='worst'?'active':''}`} onClick={()=>setPView('worst')}>💀 Portent la poisse</button>
              </div>
              {shown.length===0
                ?<div style={{textAlign:'center',color:'var(--text3)',fontSize:12,padding:'12px 0'}}>Pas assez de données</div>
                :shown.map((p,i)=>(
                  <div key={p.player} className="player-row">
                    <div className="player-rank" style={{color:i===0?(pView==='top'?'var(--accent)':'var(--loss)'):'var(--text3)'}}>{i+1}</div>
                    <div className="player-avatar">⚽</div>
                    <div className="player-info">
                      <div className="player-name">{p.display}</div>
                      <div className="player-meta">{p.count} paris</div>
                    </div>
                    <div style={{fontFamily:'var(--font-head)',fontSize:16,fontWeight:800,color:p.count>0&&(p.wins/p.count)>=0.5?'var(--win)':'var(--text2)',flexShrink:0}}>
                      {p.count>0?`${fmt(p.wins/p.count*100,0)}%`:"—"}
                    </div>
                  </div>
                ))
              }
            </div>
          </StatSection>
        )}

        <StatSection title="🔍 Recherche par équipe / joueur" defaultOpen={false}>
          <TeamPlayerSearch bets={bets} username={username}/>
        </StatSection>
      </div>
    </div>
  );
}

// ─── TEAM/PLAYER SEARCH ───────────────────────────────────────────────────────
function TeamPlayerSearch({ bets, username }) {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");
  const [aiText, setAiText] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [creditUsed, setCreditUsed] = useState(false);

  // Check QA credit on mount
  useEffect(()=>{
    if(!username) return;
    const qaKey=`bettrack:qa_count_week:${username}`;
    const now=new Date();
    const weekStr=`${now.getFullYear()}-W${getWeekNum(now)}`;
    const qaData=JSON.parse(localStorage.getItem(qaKey)||"{}");
    if(qaData.week===weekStr&&(qaData.count||0)>=5) setCreditUsed(true);
  },[username]);

  const doSearch = async () => {
    const q = query.trim();
    if(!q) return;
    setSubmitted(q);
    setAiText("");
  };

  const { bets: matchedBets, selStats, mode } = submitted ? getEntityStats(bets, submitted) : {bets:[], selStats:[], mode:"none"};

  const handleAI = async () => {
    if(!matchedBets.length||aiLoading||creditUsed) return;
    setAiLoading(true);
    try {
      const result = await runEntityAnalysis(submitted, mode, matchedBets);
      setAiText(result);
      // Consume 1 QA credit
      if(username){
        const qaKey=`bettrack:qa_count_week:${username}`;
        const now=new Date();
        const weekStr=`${now.getFullYear()}-W${getWeekNum(now)}`;
        const qaData=JSON.parse(localStorage.getItem(qaKey)||"{}");
        const newCount=(qaData.week===weekStr?(qaData.count||0):0)+1;
        localStorage.setItem(qaKey,JSON.stringify({week:weekStr,count:newCount}));
        if(newCount>=5) setCreditUsed(true);
      }
    } catch { setAiText("Erreur lors de l'analyse."); }
    setAiLoading(false);
  };

  return(
    <div>
      <div style={{display:'flex',gap:8,marginBottom:12}}>
        <input className="field-input" value={query} onChange={e=>setQuery(e.target.value)}
          placeholder="PSG, Mbappé, Barcelona…" style={{flex:1}}
          onKeyDown={e=>e.key==="Enter"&&doSearch()}/>
        <button onClick={doSearch} style={{padding:'9px 14px',background:'var(--accent)',color:'#0a0a0f',border:'none',borderRadius:'var(--radius-sm)',fontFamily:'var(--font-head)',fontSize:12,fontWeight:800,cursor:'pointer',flexShrink:0}}>Chercher</button>
      </div>

      {submitted&&matchedBets.length===0&&(
        <div style={{textAlign:'center',color:'var(--text3)',fontSize:12,padding:'14px 0'}}>Aucun pari trouvé pour "{submitted}"</div>
      )}

      {submitted&&matchedBets.length>0&&(
        <div>
          {/* Mode badge */}
          <div style={{fontSize:10,color:mode==="player"?"var(--scorer)":"var(--accent2)",fontWeight:700,marginBottom:10,textTransform:'uppercase',letterSpacing:'0.5px'}}>
            {mode==="player"?"👤 Vue joueur":"🏟️ Vue équipe"} · {matchedBets.length} pari{matchedBets.length>1?"s":""}
          </div>

          {/* IA Analysis block */}
          <div style={{background:'linear-gradient(135deg,rgba(200,255,87,0.04),rgba(87,200,255,0.04))',border:'1px solid rgba(200,255,87,0.15)',borderRadius:'var(--radius)',padding:'12px',marginBottom:12}}>
            {!aiText&&!aiLoading&&(
              <>
                <div style={{fontFamily:'var(--font-head)',fontSize:12,fontWeight:700,color:'var(--text)',marginBottom:4}}>
                  🤖 Analyse IA — {submitted}
                </div>
                <div style={{fontSize:11,color:'var(--text2)',marginBottom:10,lineHeight:1.5}}>
                  L'IA analyse tes {matchedBets.length} paris impliquant {submitted} et sort les patterns clés, ce qui marche, et un conseil.
                </div>
                {creditUsed?(
                  <div className="qa-limit-badge">Limite de 5 analyses atteinte cette semaine · reviens la semaine prochaine</div>
                ):(
                  <button onClick={handleAI} style={{width:'100%',padding:'10px',background:'linear-gradient(90deg,rgba(200,255,87,0.15),rgba(87,200,255,0.15))',border:'1px solid rgba(200,255,87,0.25)',borderRadius:'var(--radius)',fontFamily:'var(--font-head)',fontSize:12,fontWeight:800,color:'var(--text)',cursor:'pointer'}}>
                    Analyser {submitted} → <span style={{fontSize:10,opacity:0.6,fontWeight:600}}>· 1 crédit</span>
                  </button>
                )}
              </>
            )}
            {aiLoading&&(
              <div style={{display:'flex',alignItems:'center',gap:10,padding:'4px 0'}}>
                <div className="spinner" style={{width:16,height:16,borderWidth:2}}/>
                <span style={{fontSize:12,color:'var(--accent)',fontFamily:'var(--font-head)',fontWeight:700}}>Analyse en cours…</span>
              </div>
            )}
            {aiText&&!aiLoading&&(
              <>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                  <div style={{fontFamily:'var(--font-head)',fontSize:12,fontWeight:700,color:'var(--accent)'}}>🤖 {submitted}</div>
                  {!creditUsed&&<button onClick={()=>{setAiText("");}} style={{background:'transparent',border:'none',color:'var(--text3)',fontSize:11,cursor:'pointer',fontFamily:'var(--font-head)'}}>↺ Relancer</button>}
                </div>
                <div className="ai-response-body" dangerouslySetInnerHTML={{__html:parseMarkdown(aiText)}}/>
                {selStats.length>0&&(
                  <div style={{marginTop:12,borderTop:'1px solid var(--border)',paddingTop:10}}>
                    <div style={{fontSize:10,color:'var(--text3)',textTransform:'uppercase',letterSpacing:'0.5px',fontWeight:600,marginBottom:7}}>Sélections les plus jouées</div>
                    <div style={{display:'flex',flexDirection:'column',gap:5}}>
                      {selStats.slice(0,6).map((r,i)=>(
                        <div key={i} style={{display:'flex',alignItems:'center',gap:8}}>
                          <div style={{flex:1,fontSize:11,color:'var(--text)',fontWeight:600}}>{r.label}</div>
                          <div style={{fontSize:11,color:'var(--text3)',minWidth:28,textAlign:'center'}}>{r.total}×</div>
                          <div style={{fontSize:11,fontFamily:'var(--font-head)',fontWeight:700,minWidth:38,textAlign:'right',color:r.rate>=50?'var(--win)':'var(--text2)'}}>{r.known>0?`${Math.round(r.rate)}%`:"—"}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Paris list */}
          <div style={{fontSize:10,color:'var(--text3)',marginBottom:8,textTransform:'uppercase',letterSpacing:'0.5px',fontWeight:600}}>Paris concernés</div>
          {matchedBets.slice(0,10).map(bet=>{
            const profit=betProfit(bet);
            return(
              <div key={bet.id} style={{background:'var(--surface)',border:'1px solid var(--border)',borderRadius:'var(--radius-sm)',padding:'9px 11px',marginBottom:6,display:'flex',alignItems:'center',gap:9}}>
                <div style={{width:22,height:22,borderRadius:'50%',background:bet.result==="win"?"rgba(87,255,158,0.15)":"rgba(255,87,112,0.12)",display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:800,color:bet.result==="win"?"var(--win)":"var(--loss)",flexShrink:0}}>{bet.result==="win"?"✓":"✕"}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontFamily:'var(--font-head)',fontSize:12,fontWeight:700,color:'var(--text)'}}>
                    {(()=>{
                      if(bet.bet_structure==="combiné"){
                        const matchKeys=new Set((bet.selections||[]).map(s=>s.match_team_1||s.team||"").filter(Boolean));
                        return `Combiné · ${matchKeys.size>1?matchKeys.size+" matchs":"multi-sélections"}`;
                      }
                      const t1=bet.team_1||(bet.selections||[]).find(s=>s.match_team_1)?.match_team_1||"?";
                      const t2=bet.team_2||(bet.selections||[]).find(s=>s.match_team_2)?.match_team_2||"?";
                      return `${t1} vs ${t2}`;
                    })()}
                  </div>
                  <div style={{fontSize:10,color:'var(--text3)'}}>{bet.date} · {displayStructure(bet)==="simple"?"Simple":"Combiné"} · ×{fmt(bet.total_odd)}</div>
                </div>
                <div style={{fontFamily:'var(--font-head)',fontSize:13,fontWeight:800,color:profit>=0?'var(--win)':'var(--loss)',flexShrink:0}}>{fmtEuro(profit)}</div>
              </div>
            );
          })}
          {matchedBets.length>10&&<div style={{textAlign:'center',fontSize:11,color:'var(--text3)',padding:'6px 0'}}>+{matchedBets.length-10} autres paris</div>}
        </div>
      )}
    </div>
  );
}

// ─── BETTRACK CARD (canvas render) ────────────────────────────────────────────
function BetTrackCardModal({ cardData, username, onClose, onSave }) {
  const canvasRef = useRef(null);
  const [page, setPage] = useState(1);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    if(!canvasRef.current||!cardData)return;
    const canvas=canvasRef.current;
    const ctx=canvas.getContext('2d');
    const W=540,H=960;
    canvas.width=W;canvas.height=H;
    ctx.clearRect(0,0,W,H);

    const drawText=(text,x,y,opts={})=>{
      ctx.font=`${opts.weight||400} ${opts.size||14}px ${opts.font||"DM Sans, sans-serif"}`;
      ctx.fillStyle=opts.color||"#f0f0f8";
      ctx.textAlign=opts.align||"left";
      ctx.fillText(text,x,y);
    };
    const roundRect=(x,y,w,h,r,fill)=>{
      ctx.beginPath();ctx.roundRect(x,y,w,h,r);
      ctx.fillStyle=fill;ctx.fill();
    };

    if(page===1){
      // Background
      roundRect(0,0,W,H,0,"#0a0a0f");
      // Top gradient
      const grad=ctx.createLinearGradient(0,0,W,200);
      grad.addColorStop(0,"rgba(200,255,87,0.08)");
      grad.addColorStop(1,"rgba(87,200,255,0.03)");
      roundRect(0,0,W,200,0,grad);

      // Header
      drawText("Bet",32,52,{font:"Inter",weight:800,size:28,color:"#f0f0f8"});
      drawText("Track",32+42,52,{font:"Inter",weight:800,size:28,color:"#c8ff57"});
      drawText(`@${username}`,32,78,{font:"Inter",weight:700,size:16,color:"#8888aa"});
      const now=new Date();
      drawText(`${MONTH_SHORT[now.getMonth()]} ${now.getFullYear()}`,W-32,52,{size:12,color:"#555570",align:"right"});

      // Score card central
      roundRect(32,95,W-64,195,16,"#111118");
      ctx.strokeStyle="#252530";ctx.lineWidth=1;ctx.beginPath();ctx.roundRect(32,95,W-64,195,16);ctx.stroke();

      const rank=cardData.rank||"Gold";
      const rankColors={"Bronze":"#cd7f32","Silver":"#c0c0c0","Gold":"#c8ff57","Elite":"#57c8ff"};
      const rankEmojis={"Bronze":"🥉","Silver":"🥈","Gold":"🥇","Elite":"💎"};
      const rankColor=rankColors[rank]||"#c8ff57";

      drawText("SCORE BETTRACK",W/2,120,{font:"Inter",weight:700,size:10,color:"#555570",align:"center"});
      ctx.textAlign="center";
      ctx.font=`800 72px Inter, sans-serif`;
      ctx.fillStyle=rankColor;
      ctx.fillText(`${cardData.score||75}`,W/2,194);

      drawText("/100",W/2+64,194,{font:"Inter",weight:700,size:16,color:"#555570",align:"left"});

      // Gauge
      const gaugeX=80,gaugeY=206,gaugeW=W-160,gaugeH=8;
      roundRect(gaugeX,gaugeY,gaugeW,gaugeH,4,"#252530");
      roundRect(gaugeX,gaugeY,Math.round(gaugeW*(cardData.score||75)/100),gaugeH,4,rankColor);

      // Rank badge
      roundRect(W/2-60,222,120,28,14,`${rankColor}22`);
      ctx.strokeStyle=rankColor;ctx.lineWidth=1.5;ctx.beginPath();ctx.roundRect(W/2-60,222,120,28,14);ctx.stroke();
      drawText(`${rankEmojis[rank]} RANG : ${rank.toUpperCase()}`,W/2,240,{font:"Inter",weight:800,size:11,color:rankColor,align:"center"});

      drawText(`Meilleur que ${cardData.percentile||50}% des BetTrackers`,W/2,274,{size:12,color:"#8888aa",align:"center"});

      // Stats row
      const stats=[
        {label:"ROI",val:cardData.roi!=null?`${cardData.roi>=0?'+':''}${(cardData.roi).toFixed(1)}%`:"—",color:"#c8ff57"},
        {label:"Réussite",val:`${(cardData.winRate||0).toFixed(0)}%`,color:"#57c8ff"},
        {label:"Profit",val:fmtEuro(cardData.profit||0),color:(cardData.profit||0)>=0?"#57ff9e":"#ff5770"},
      ];
      stats.forEach((st,i)=>{
        const sx=60+i*145;
        roundRect(sx-10,298,125,58,10,"#18181f");
        drawText(st.label,sx+52,316,{font:"Inter",weight:700,size:9,color:"#555570",align:"center"});
        drawText(st.val,sx+52,342,{font:"Inter",weight:800,size:18,color:st.color,align:"center"});
      });

      // Biais
      drawText("⚡ BIAIS DÉTECTÉS",32,388,{font:"Inter",weight:700,size:10,color:"#555570"});
      const biases=cardData.biases||[];
      biases.slice(0,3).forEach((b,i)=>{
        roundRect(32,400+i*52,W-64,44,10,"#111118");
        ctx.strokeStyle="#252530";ctx.lineWidth=1;ctx.beginPath();ctx.roundRect(32,400+i*52,W-64,44,10);ctx.stroke();
        drawText(b.icon,52,428+i*52,{size:16});
        drawText(b.text,78,428+i*52,{size:12,color:"#8888aa"});
      });

      // Insolite fact
      const factY=563;
      roundRect(32,factY,W-64,70,12,"#111118");
      ctx.strokeStyle="rgba(200,255,87,0.2)";ctx.lineWidth=1.5;ctx.beginPath();ctx.roundRect(32,factY,W-64,70,12);ctx.stroke();
      drawText("🔥 TON PARI LE PLUS FOU",52,factY+20,{font:"Inter",weight:700,size:10,color:"#c8ff57"});
      const factText=cardData.insoliteFact||"Pas encore assez de données";
      const maxW=W-100;
      ctx.font=`500 13px DM Sans, sans-serif`;ctx.fillStyle="#f0f0f8";ctx.textAlign="left";
      const words=factText.split(' '),lines2=[];let currentLine='';
      words.forEach(w=>{const test=currentLine?`${currentLine} ${w}`:w;if(ctx.measureText(test).width>maxW){lines2.push(currentLine);currentLine=w;}else currentLine=test;});
      lines2.push(currentLine);
      lines2.slice(0,2).forEach((l,i)=>ctx.fillText(l,52,factY+38+i*16));

      // Footer
      drawText("BetTrack · ta carte de parieur",W/2,H-30,{size:11,color:"#333345",align:"center"});
    }

    else {
      // Page 2 — Profil visuel (story shareable)
      roundRect(0,0,W,H,0,"#0a0a0f");
      // Gradient bg
      const g2=ctx.createLinearGradient(0,0,0,H);
      g2.addColorStop(0,"rgba(87,200,255,0.06)");g2.addColorStop(0.5,"rgba(0,0,0,0)");g2.addColorStop(1,"rgba(200,255,87,0.04)");
      roundRect(0,0,W,H,0,g2);

      // Header
      drawText("Bet",32,52,{font:"Inter",weight:800,size:22,color:"#f0f0f8"});
      drawText("Track",32+33,52,{font:"Inter",weight:800,size:22,color:"#c8ff57"});
      const now2=new Date();
      drawText(`@${username} · ${MONTH_SHORT[now2.getMonth()]} ${now2.getFullYear()}`,W-32,52,{size:11,color:"#555570",align:"right"});
      drawText("MON BILAN DE PARIEUR",32,76,{font:"Inter",weight:700,size:10,color:"#555570"});
      ctx.strokeStyle="#252530";ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(32,85);ctx.lineTo(W-32,85);ctx.stroke();

      const lines=cardData.profilLines||[
        {icon:"💪",color:"#c8ff57",label:"Force",text:"Données insuffisantes pour l'analyse"},
        {icon:"🔥",color:"#57c8ff",label:"Conseil",text:"Importe plus de paris pour débloquer l'analyse complète"}
      ];

      lines.slice(0,5).forEach((line,i)=>{
        const cardY=98+i*158;
        roundRect(32,cardY,W-64,145,14,"#111118");
        ctx.strokeStyle=line.color+"33";ctx.lineWidth=1.5;ctx.beginPath();ctx.roundRect(32,cardY,W-64,145,14);ctx.stroke();

        // Icon circle
        roundRect(52,cardY+18,48,48,24,line.color+"22");
        drawText(line.icon,76,cardY+49,{size:22,align:"center"});

        // Label badge
        roundRect(114,cardY+18,W-32-114,22,5,line.color+"18");
        drawText(line.label.toUpperCase(),114+8,cardY+33,{font:"Inter",weight:700,size:9,color:line.color});

        // Text — wrap in card
        const tW=W-32-114-16;
        ctx.font=`600 14px Inter, sans-serif`;ctx.fillStyle="#f0f0f8";ctx.textAlign="left";
        const tw=line.text,twWords=tw.split(' ');let tLines=[],tLine='';
        twWords.forEach(w=>{const test=tLine?`${tLine} ${w}`:w;if(ctx.measureText(test).width>tW){tLines.push(tLine);tLine=w;}else tLine=test;});
        tLines.push(tLine);
        tLines.slice(0,4).forEach((l,j)=>ctx.fillText(l,114+8,cardY+52+j*20));
      });

      drawText("BetTrack · partage ta carte de parieur",W/2,H-30,{size:11,color:"#333345",align:"center"});
    }

    setRendered(true);
  },[cardData,page]);

  const handleDownload=()=>{
    if(!canvasRef.current)return;
    const dataUrl=canvasRef.current.toDataURL('image/png');
    // iOS Safari: open in new tab → user long-presses to save
    const isIOS=/iPad|iPhone|iPod/.test(navigator.userAgent);
    if(isIOS){
      const w=window.open();if(w){w.document.write(`<img src="${dataUrl}" style="max-width:100%;"/>`);w.document.title="Carte BetTrack";}
    } else {
      const link=document.createElement('a');
      link.download=`bettrack-carte-p${page}.png`;
      link.href=dataUrl;
      link.click();
    }
    if(onSave)onSave();
  };

  return(
    <div className="modal-backdrop" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal-sheet">
        <div className="modal-handle"/>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-header"><div className="modal-title">🃏 Carte BetTrack</div></div>
        <div className="modal-body">
          <div style={{textAlign:'center',marginBottom:12}}>
            <canvas ref={canvasRef} style={{width:'100%',maxWidth:380,borderRadius:16,border:'1px solid var(--border)'}}/>
          </div>
          <div className="tab-switch">
            <button className={`tab-switch-btn ${page===1?'active':''}`} onClick={()=>setPage(1)}>Page 1 — Score</button>
            <button className={`tab-switch-btn ${page===2?'active':''}`} onClick={()=>setPage(2)}>Page 2 — Profil</button>
          </div>
          {rendered&&<button className="btn-primary" onClick={handleDownload} style={{marginTop:8}}>⬇ Télécharger l'image</button>}
          <div style={{fontSize:10,color:'var(--text3)',textAlign:'center',marginTop:6,lineHeight:1.5}}>
            Sur iPhone : l'image s'ouvre dans un nouvel onglet → appui long → "Enregistrer l'image"<br/>
            5 cartes par semaine · inclus dans Analyse Premium
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── INSIGHTS TAB ─────────────────────────────────────────────────────────────
function InsightsTab({ bets, username }) {
  const [aiPhase, setAiPhase] = useState("locked");
  const [aiText, setAiText] = useState("");
  const [qaHistory, setQaHistory] = useState([]);
  const [qaInput, setQaInput] = useState("");
  const [qaLoading, setQaLoading] = useState(false);
  const [qaUsedThisWeek, setQaUsedThisWeek] = useState(false);
  const [cardPhase, setCardPhase] = useState("idle"); // idle | loading | done
  const [cardData, setCardData] = useState(null);
  const [showCard, setShowCard] = useState(false);
  const [cardUsedThisMonth, setCardUsedThisMonth] = useState(false);

  // Check localStorage for Q&A and card usage
  useEffect(()=>{
    const qaKey=`bettrack:qa_count_week:${username}`;
    const cardKey=`bettrack:card_count_week:${username}`;
    const now=new Date();
    const weekStr=`${now.getFullYear()}-W${getWeekNum(now)}`;
    const qaData=JSON.parse(localStorage.getItem(qaKey)||"{}");
    const cardData2=JSON.parse(localStorage.getItem(cardKey)||"{}");
    if(qaData.week===weekStr&&(qaData.count||0)>=5) setQaUsedThisWeek(true);
    if(cardData2.week===weekStr&&(cardData2.count||0)>=5) setCardUsedThisMonth(true);
  },[username]);

  const handleAnalyze=async()=>{
    setAiPhase("loading");
    try{const result=await runAIAnalysis(bets);setAiText(result);setAiPhase("done");}
    catch{setAiPhase("error");}
  };

  const handleQA=async()=>{
    if(!qaInput.trim()||qaLoading)return;
    const question=qaInput.trim();
    setQaInput("");setQaLoading(true);
    setQaHistory(h=>[...h,{role:"user",text:question}]);
    try{
      const answer=await runQAQuery(bets,question);
      setQaHistory(h=>[...h,{role:"ai",text:answer}]);
      const now2=new Date();
      const weekStr2=`${now2.getFullYear()}-W${getWeekNum(now2)}`;
      const qaKey2=`bettrack:qa_count_week:${username}`;
      const qaData2=JSON.parse(localStorage.getItem(qaKey2)||"{}");
      const newCount=(qaData2.week===weekStr2?(qaData2.count||0):0)+1;
      localStorage.setItem(qaKey2,JSON.stringify({week:weekStr2,count:newCount}));
      if(newCount>=5) setQaUsedThisWeek(true);
    }catch{setQaHistory(h=>[...h,{role:"ai",text:"Erreur lors de la requête. Réessaie."}]);}
    setQaLoading(false);
  };

  const handleGenerateCard=async()=>{
    setCardPhase("loading");
    try{
      const data=await generateBetTrackCard(bets,username);
      if(data){setCardData(data);setCardPhase("done");setShowCard(true);}
      else setCardPhase("error");
    }catch{setCardPhase("error");}
  };

  const handleCardSaved=()=>{
    const now=new Date();
    const weekStr=`${now.getFullYear()}-W${getWeekNum(now)}`;
    const cardKey=`bettrack:card_count_week:${username}`;
    const cardData3=JSON.parse(localStorage.getItem(cardKey)||"{}");
    const newCount=(cardData3.week===weekStr?(cardData3.count||0):0)+1;
    localStorage.setItem(cardKey,JSON.stringify({week:weekStr,count:newCount}));
    if(newCount>=5) setCardUsedThisMonth(true);
  };

  if(bets.length===0)return<div className="empty-state"><div className="e-icon">💡</div><div className="e-title">Pas encore d'insights</div><div className="e-sub">Importez au moins 3 paris.</div></div>;

  const insights=[];
  ["team","player","goals","combo"].forEach(cat=>{
    const sub=bets.filter(b=>b.bet_category===cat);if(sub.length<2)return;
    const st=computeStats(sub);
    const labels={team:"Résultats d'équipe",player:"Paris buteurs",goals:"Paris buts",combo:"Combinés"};
    const icons={team:"⚽",player:"🎯",goals:"🥅",combo:"🎰"};
    insights.push({icon:icons[cat],type:st.profit>=0?'positive':'negative',color:st.profit>=0?'var(--win)':'var(--loss)',title:labels[cat],sub:`${sub.length} paris · ${fmt(st.rate,0)}% · ROI ${st.roi!=null?`${st.roi>=0?'+':''}${fmt(st.roi,1)}%`:"—"}`,value:fmtEuro(st.profit)});
  });
  const allTags=[...new Set(bets.map(b=>b.tag).filter(Boolean))];
  allTags.forEach(t=>{
    const sub=bets.filter(b=>b.tag===t);if(sub.length<2)return;
    const st=computeStats(sub);
    const icons={"SAFE":"🛡️","FUN":"🎲"};
    insights.push({icon:icons[t]||"🏷️",type:st.profit>=0?'positive':'negative',color:st.profit>=0?'var(--win)':'var(--loss)',title:`Catégorie ${t}`,sub:`${sub.length} paris · ${fmt(st.rate,0)}% · ROI ${st.roi!=null?`${st.roi>=0?'+':''}${fmt(st.roi,1)}%`:"—"}`,value:fmtEuro(st.profit)});
  });
  const sorted=insights.sort((a,b)=>Math.abs(parseFloat(b.value))-Math.abs(parseFloat(a.value)));

  return(
    <div>
      {/* AI Premium Panel */}
      <div className="ai-panel">
        <div className="ai-panel-title">🤖 Analyse IA Personnalisée <span className="ai-premium-badge">PREMIUM</span></div>
        <div className="ai-panel-sub">Claude analyse l'intégralité de tes {bets.length} paris : patterns, biais, forces, faiblesses.</div>
        <div className="ai-features">
          {["Identification de tes patterns de paris","Analyse de tes biais et erreurs récurrentes","Recommandations pour améliorer ton ROI","Profil de parieur et stratégie optimale"].map((f,i)=><div key={i} className="ai-feature"><span className="ai-feature-icon">✦</span>{f}</div>)}
        </div>
        {aiPhase==="locked"&&<><button className="ai-unlock-btn" onClick={()=>setAiPhase("unlocked")}>Débloquer l'analyse — 4,99€</button><div className="ai-price">Paiement unique · Analyse illimitée sur ce compte</div></>}
        {aiPhase==="unlocked"&&<><div style={{background:'rgba(87,255,158,0.07)',border:'1px solid rgba(87,255,158,0.18)',borderRadius:9,padding:'9px 11px',marginBottom:10,fontSize:12,color:'var(--win)'}}>✅ Accès débloqué — Lance ton analyse</div><button className="btn-primary" onClick={handleAnalyze}>🚀 Lancer l'analyse complète</button></>}
        {aiPhase==="loading"&&<div style={{textAlign:'center',padding:'14px 0'}}><div className="ai-typing"><div className="ai-dot"/><div className="ai-dot"/><div className="ai-dot"/></div><div style={{fontSize:12,color:'var(--text2)',marginTop:7}}>Analyse de tes {bets.length} paris…</div></div>}
        {aiPhase==="done"&&<div className="ai-response">
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
            <div className="ai-avatar">✦</div>
            <div><div className="ai-response-title">Analyse personnalisée</div><div style={{fontSize:10,color:'var(--text3)'}}>{bets.length} paris analysés</div></div>
            <button onClick={handleAnalyze} style={{marginLeft:'auto',background:'var(--surface)',border:'1px solid var(--border)',borderRadius:7,padding:'4px 9px',color:'var(--text2)',fontSize:10,cursor:'pointer',fontFamily:'var(--font-head)',fontWeight:700}}>↺</button>
          </div>
          <div className="ai-response-body" dangerouslySetInnerHTML={{__html:parseMarkdown(aiText)}}/>
        </div>}
        {aiPhase==="error"&&<><div className="error-msg">❌ Erreur de connexion.</div><button className="btn-secondary" onClick={()=>setAiPhase("unlocked")}>Réessayer</button></>}

        {/* Carte BetTrack — only shown if premium unlocked */}
        {(aiPhase==="unlocked"||aiPhase==="done")&&(
          <div style={{marginTop:14,borderTop:'1px solid var(--border)',paddingTop:14}}>
            <div style={{fontFamily:'var(--font-head)',fontSize:13,fontWeight:800,marginBottom:5,display:'flex',alignItems:'center',gap:7}}>🃏 Carte BetTrack <span style={{fontSize:9,background:'linear-gradient(90deg,#c8ff57,#57c8ff)',color:'#0a0a0f',padding:'2px 7px',borderRadius:4,fontFamily:'var(--font-head)',fontWeight:800}}>5/semaine</span></div>
            <div style={{fontSize:11,color:'var(--text2)',marginBottom:10}}>Score, biais, pari le plus fou · téléchargeable en story</div>
            {cardUsedThisMonth?(
              <div className="qa-limit-badge">✅ Carte générée ce mois · limite de 5 atteinte cette semaine</div>
            ):(
              <button onClick={handleGenerateCard} disabled={cardPhase==="loading"} style={{width:'100%',padding:'11px',background:'linear-gradient(90deg,rgba(200,255,87,0.15),rgba(87,200,255,0.15))',border:'1px solid rgba(200,255,87,0.25)',borderRadius:'var(--radius)',fontFamily:'var(--font-head)',fontSize:13,fontWeight:800,color:'var(--text)',cursor:'pointer'}}>
                {cardPhase==="loading"?<span style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8}}><span className="spinner" style={{width:14,height:14,borderWidth:2}}/>Génération…</span>:"Générer ma Carte BetTrack"}
              </button>
            )}
            {cardPhase==="error"&&<div className="error-msg" style={{marginTop:7}}>Erreur lors de la génération.</div>}
          </div>
        )}
      </div>

      {/* Q&A Section */}
      <div className="card" style={{marginBottom:14}}>
        <div className="card-title" style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <span>💬 Pose une question sur tes paris</span>
          <span style={{fontSize:9,background:'rgba(255,153,87,0.1)',border:'1px solid rgba(255,153,87,0.2)',borderRadius:4,padding:'2px 6px',color:'var(--fun)',fontFamily:'var(--font-head)',fontWeight:700}}>5/semaine</span>
        </div>
        <div style={{fontSize:11,color:'var(--text2)',marginBottom:10}}>Ex : "Combien de fois j'ai parié sur Dembélé ?" ou "Quel est mon pari le plus fou ?"</div>
        {qaHistory.map((m,i)=>(
          <div key={i} className={`qa-bubble ${m.role}`} dangerouslySetInnerHTML={{__html:m.role==="ai"?parseMarkdown(m.text):m.text}}/>
        ))}
        {qaLoading&&<div style={{textAlign:'center',padding:'8px 0'}}><div className="ai-typing"><div className="ai-dot"/><div className="ai-dot"/><div className="ai-dot"/></div></div>}
        {!qaUsedThisWeek||qaHistory.length>0?(
          <div className="qa-input-row">
            <input className="qa-input" value={qaInput} onChange={e=>setQaInput(e.target.value)} placeholder="Ta question…" onKeyDown={e=>e.key==="Enter"&&handleQA()} disabled={qaLoading||qaUsedThisWeek}/>
            <button className="qa-send-btn" onClick={handleQA} disabled={qaLoading||!qaInput.trim()||qaUsedThisWeek}>→</button>
          </div>
        ):null}
        {qaUsedThisWeek&&qaHistory.length===0&&(
          <div className="qa-limit-badge">Tu as utilisé ta question de la semaine. Reviens la semaine prochaine !</div>
        )}
        {qaUsedThisWeek&&qaHistory.length>0&&(
          <div className="qa-limit-badge" style={{marginTop:7}}>Question de la semaine utilisée · reviens la semaine prochaine</div>
        )}
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

      {showCard&&cardData&&(
        <BetTrackCardModal cardData={{...cardData,roi:computeStats(bets).roi,winRate:computeStats(bets).rate,profit:computeStats(bets).profit}} username={username} onClose={()=>setShowCard(false)} onSave={handleCardSaved}/>
      )}
    </div>
  );
}

// ─── OBJECTIFS TAB ────────────────────────────────────────────────────────────
function ObjectifsTab({ bets, objectives, onAddObjectif, onDeleteObjectif, onUpdateObjectif }) {
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState("");
  const [startAmount, setStartAmount] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [saving, setSaving] = useState(false);

  const resetForm = () => {setName("");setStartAmount("");setTargetAmount("");setDeadline("");setEditingId(null);setShowAdd(false);};

  const handleAdd = async () => {
    if(!name.trim()||!startAmount||!targetAmount){return;}
    setSaving(true);
    const obj={name:name.trim(),start_amount:parseFloat(startAmount),target_amount:parseFloat(targetAmount),created_at:new Date().toISOString()};
    if(deadline) obj.deadline=deadline;
    if(editingId){await onUpdateObjectif(editingId,obj);}
    else{await onAddObjectif(obj);}
    resetForm();setSaving(false);
  };

  const startEdit = (obj) => {
    setEditingId(obj.id);setName(obj.name);setStartAmount(String(obj.start_amount));
    setTargetAmount(String(obj.target_amount));setDeadline(obj.deadline||"");setShowAdd(true);
  };

  return(
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
        <div className="section-title" style={{marginBottom:0}}>🎯 Mes objectifs</div>
        <button onClick={()=>setShowAdd(t=>!t)} style={{padding:'5px 12px',background:'var(--accent)',color:'#0a0a0f',border:'none',borderRadius:20,fontSize:11,fontWeight:800,cursor:'pointer',fontFamily:'var(--font-head)'}}>+ Nouveau</button>
      </div>

      {showAdd&&(
        <div className="card" style={{marginBottom:14}}>
          <div className="card-title">Créer un objectif</div>
          <div className="field-group"><div className="field-label">Nom de l'objectif</div><input className="field-input" value={name} onChange={e=>setName(e.target.value)} placeholder="Ex : Montante de Noël"/></div>
          <div className="field-row">
            <div className="field-group"><div className="field-label">Montant départ (€)</div><input className="field-input" type="number" value={startAmount} onChange={e=>setStartAmount(e.target.value)} placeholder="5"/></div>
            <div className="field-group"><div className="field-label">Objectif (€)</div><input className="field-input" type="number" value={targetAmount} onChange={e=>setTargetAmount(e.target.value)} placeholder="150"/></div>
          </div>
          <div className="field-group"><div className="field-label">Date limite <span style={{color:'var(--text3)',fontWeight:400}}>(optionnel)</span></div><input className="field-input" type="date" value={deadline} onChange={e=>setDeadline(e.target.value)}/></div>
          <div style={{display:'flex',gap:7,marginTop:4}}>
            <button onClick={handleAdd} disabled={saving} style={{flex:1,padding:'10px',background:'var(--accent)',color:'#0a0a0f',border:'none',borderRadius:'var(--radius)',fontSize:12,fontWeight:800,cursor:'pointer',fontFamily:'var(--font-head)'}}>{saving?"…":editingId?"Modifier l'objectif":"Créer l'objectif"}</button>
            <button onClick={resetForm} style={{flex:1,padding:'10px',background:'transparent',border:'1px solid var(--border)',borderRadius:'var(--radius)',fontSize:12,fontWeight:600,color:'var(--text2)',cursor:'pointer',fontFamily:'var(--font-head)'}}>Annuler</button>
          </div>
        </div>
      )}

      {objectives.length===0&&!showAdd&&(
        <div className="empty-state" style={{paddingTop:40}}>
          <div className="e-icon">🎯</div>
          <div className="e-title">Aucun objectif</div>
          <div className="e-sub">Crée ton premier objectif pour tracker ta progression.</div>
          <div style={{marginTop:14,fontSize:12,color:'var(--text3)',maxWidth:260,lineHeight:1.6}}>Exemple : "Partir de 5€ et atteindre 150€ en réinvestissant mes gains"</div>
        </div>
      )}

      {objectives.map(obj=>{
        // Compute current amount: start + profits from bets tagged with this objectif
        const linkedBets=bets.filter(b=>b.objectif_id===obj.id||b.objectif_id===String(obj.id));
        const totalProfit=linkedBets.reduce((a,b)=>a+betProfit(b),0);
        const current=obj.start_amount+totalProfit;
        const pct=Math.min(100,Math.max(0,((current-obj.start_amount)/(obj.target_amount-obj.start_amount))*100));
        const done=current>=obj.target_amount;
        const wins=linkedBets.filter(b=>b.result==="win").length;
        const rate=linkedBets.length>0?(wins/linkedBets.length)*100:0;

        return(
          <div key={obj.id} className="card" style={{marginBottom:10}}>
            {(()=>{
              const expired=obj.deadline&&!done&&new Date(obj.deadline)<new Date();
              return(
                <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:8}}>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontFamily:'var(--font-head)',fontSize:14,fontWeight:800,color:'var(--text)',marginBottom:2,display:'flex',alignItems:'center',gap:6,flexWrap:'wrap'}}>
                      {done?"✅ ":expired?"⏰ ":""}{obj.name}
                      {expired&&<span style={{fontSize:9,background:'rgba(255,87,112,0.1)',border:'1px solid rgba(255,87,112,0.25)',borderRadius:4,padding:'1px 6px',color:'var(--loss)',fontFamily:'var(--font-head)',fontWeight:700}}>EXPIRÉ</span>}
                    </div>
                    <div style={{fontSize:11,color:'var(--text3)'}}>Départ : {fmt(obj.start_amount)}€ → Cible : {fmt(obj.target_amount)}€</div>
                    {obj.deadline&&<div style={{fontSize:10,color:expired?'var(--loss)':'var(--text3)',marginTop:2}}>{expired?"Deadline dépassée":"Deadline :"} {new Date(obj.deadline).toLocaleDateString('fr-FR')}</div>}
                  </div>
                  <div style={{display:'flex',gap:5,flexShrink:0}}>
                    <button onClick={()=>startEdit(obj)} style={{background:'transparent',border:'none',color:'var(--text3)',cursor:'pointer',fontSize:13,padding:'2px 4px'}}>✎</button>
                    <button onClick={()=>onDeleteObjectif(obj.id)} style={{background:'transparent',border:'none',color:'var(--text3)',cursor:'pointer',fontSize:14,padding:'2px 4px'}}>🗑</button>
                  </div>
                </div>
              );
            })()}

            <div style={{display:'flex',justifyContent:'space-between',marginBottom:5}}>
              <span style={{fontFamily:'var(--font-head)',fontSize:22,fontWeight:800,color:done?'var(--accent)':(current>obj.start_amount?'var(--win)':'var(--loss)')}}>
                {fmt(current)}€
              </span>
              <span style={{fontFamily:'var(--font-head)',fontSize:15,fontWeight:700,color:'var(--text2)'}}>{fmt(pct,0)}%</span>
            </div>

            <div className="objectif-progress-track">
              <div className="objectif-progress-fill" style={{width:`${pct}%`}}/>
            </div>

            {linkedBets.length>0&&(
              <div style={{display:'flex',gap:10,marginTop:8,fontSize:11,color:'var(--text3)'}}>
                <span>{linkedBets.length} paris liés</span>
                <span>·</span>
                <span style={{color:totalProfit>=0?'var(--win)':'var(--loss)',fontFamily:'var(--font-head)',fontWeight:700}}>{fmtEuro(totalProfit)}</span>
                <span>·</span>
                <span>{fmt(rate,0)}% réussite</span>
              </div>
            )}
            {linkedBets.length===0&&(
              <div style={{fontSize:11,color:'var(--text3)',marginTop:6}}>Tague des paris avec cet objectif lors de l'import</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── AUTH HOOK ────────────────────────────────────────────────────────────────
function useAuth() {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const [profile, setProfile] = useState(null);
  useEffect(()=>{
    const saved=localStorage.getItem("bettrack:user");
    if(saved){setUser(saved);const p=localStorage.getItem(`bettrack:profile:${saved}`);if(p)try{setProfile(JSON.parse(p));}catch{}}
    setAuthReady(true);
  },[]);
  const login=async(username)=>{
    const rows=await sbGet("users",`username=eq.${encodeURIComponent(username)}&select=username`);
    if(!rows.length)throw new Error("Pseudo introuvable. Crée un compte d'abord.");
    localStorage.setItem("bettrack:user",username);setUser(username);
    const p=localStorage.getItem(`bettrack:profile:${username}`);if(p)try{setProfile(JSON.parse(p));}catch{}
  };
  const register=async(username,inviteCode)=>{
    if(inviteCode.trim().toUpperCase()!==INVITE_CODE)throw new Error("Code d'invitation invalide.");
    if(!username.trim()||username.length<2)throw new Error("Pseudo trop court (min 2 caractères).");
    if(username.length>20)throw new Error("Pseudo trop long (max 20 caractères).");
    if(!/^[a-zA-Z0-9_\-.]+$/.test(username))throw new Error("Pseudo invalide — lettres, chiffres, _ - . uniquement.");
    const existing=await sbGet("users",`username=eq.${encodeURIComponent(username)}&select=username`);
    if(existing.length)throw new Error("Ce pseudo est déjà pris.");
    await sbPost("users",{username});
    localStorage.setItem("bettrack:user",username);setUser(username);
  };
  const logout=()=>{localStorage.removeItem("bettrack:user");setUser(null);setProfile(null);};
  const saveProfile=(p)=>{setProfile(p);localStorage.setItem(`bettrack:profile:${user}`,JSON.stringify(p));};
  return{user,authReady,profile,login,register,logout,saveProfile};
}

// ─── USER BETS HOOK ───────────────────────────────────────────────────────────
function useUserBets(username) {
  const [bets, setBetsState] = useState([]);
  const [storageReady, setStorageReady] = useState(false);
  useEffect(()=>{
    if(!username)return;
    setStorageReady(false);
    (async()=>{
      try{const rows=await sbGet("bets",`username=eq.${encodeURIComponent(username)}&order=created_at.desc&select=*`);setBetsState(rows.map(r=>({...r,selections:r.selections||[],is_freebet:r.is_freebet||false})));}
      catch{setBetsState([]);}
      setStorageReady(true);
    })();
  },[username]);
  const addBet=async(bet)=>{const row={...bet,username};delete row.id;const[saved]=await sbPost("bets",row);setBetsState(prev=>[{...saved,selections:saved.selections||[],is_freebet:saved.is_freebet||false},...prev]);};
  const updateBet=async(betId,fields)=>{await sbPatch("bets",`id=eq.${betId}&username=eq.${encodeURIComponent(username)}`,fields);setBetsState(prev=>prev.map(b=>b.id===betId?{...b,...fields}:b));};
  const setBets=(updater)=>{if(typeof updater==="function")setBetsState(prev=>updater(prev));else setBetsState(updater);};
  const deleteBet=async(betId)=>{await sbDelete("bets",`id=eq.${betId}&username=eq.${encodeURIComponent(username)}`);setBetsState(prev=>prev.filter(b=>b.id!==betId));};
  const deleteAllBets=async()=>{await sbDelete("bets",`username=eq.${encodeURIComponent(username)}`);setBetsState([]);};
  return{bets,storageReady,setBets,addBet,updateBet,deleteBet,deleteAllBets};
}

// ─── OBJECTIVES HOOK ──────────────────────────────────────────────────────────
function useObjectives(username) {
  const [objectives, setObjectives] = useState([]);
  useEffect(()=>{
    if(!username)return;
    const key=`bettrack:objectives:${username}`;
    const saved=localStorage.getItem(key);
    if(saved)try{setObjectives(JSON.parse(saved));}catch{}
  },[username]);
  const save=(objs)=>{setObjectives(objs);localStorage.setItem(`bettrack:objectives:${username}`,JSON.stringify(objs));};
  const addObjectif=(obj)=>{const newObj={...obj,id:`obj_${Date.now()}`};save([...objectives,newObj]);};
  const deleteObjectif=(id)=>save(objectives.filter(o=>o.id!==id));
  const updateObjectif=(id,fields)=>save(objectives.map(o=>o.id===id?{...o,...fields}:o));
  return{objectives,addObjectif,deleteObjectif,updateObjectif};
}

// ─── LOGIN SCREEN ────────────────────────────────────────────────────────────
function LoginScreen({ onLogin, onRegister }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const handleSubmit=async()=>{
    setError("");if(!username.trim()){setError("Entre ton pseudo.");return;}
    setLoading(true);
    try{if(mode==="login")await onLogin(username.trim());else await onRegister(username.trim(),inviteCode.trim());}
    catch(e){setError(e.message);}
    setLoading(false);
  };
  return(
    <><style>{CSS}</style>
    <div className="login-screen">
      <div className="login-logo">Bet<span>Track</span></div>
      <div className="login-tagline">Ton tracker de paris sportifs</div>
      <div className="login-card">
        <div className="login-card-title">{mode==="login"?"Connexion":"Créer un compte"}</div>
        <div className="login-card-sub">{mode==="login"?"Entre ton pseudo pour accéder à tes paris.":"Entre le code d'invitation et choisis ton pseudo."}</div>
        {mode==="register"&&(<><div className="invite-info">🔑 Demande le <strong>code d'invitation</strong> à l'admin.</div><input className="login-input" placeholder="Code d'invitation" value={inviteCode} onChange={e=>setInviteCode(e.target.value)} autoCapitalize="characters"/></>)}
        <input className="login-input" placeholder="Ton pseudo (ex: alex_b)" value={username} onChange={e=>setUsername(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSubmit()} autoCapitalize="none" autoCorrect="off"/>
        {error&&<div className="login-error">⚠️ {error}</div>}
        <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading?<span style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8}}><span className="spinner" style={{width:14,height:14,borderWidth:2}}/>Chargement…</span>:mode==="login"?"Se connecter":"Créer le compte"}
        </button>
      </div>
      <div className="login-toggle">
        {mode==="login"?<>Pas encore de compte ? <button onClick={()=>{setMode("register");setError("");}}>Créer un compte</button></> : <>Déjà un compte ? <button onClick={()=>{setMode("login");setError("");}}>Se connecter</button></>}
      </div>
      <div style={{marginTop:28,fontSize:10,color:'var(--text3)',textAlign:'center',lineHeight:1.6}}>Winamax · Betclic · Analyse IA</div>
    </div></>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App() {
  const { user, authReady, profile, login, register, logout, saveProfile } = useAuth();
  const { bets, storageReady, setBets, addBet, updateBet, deleteBet, deleteAllBets } = useUserBets(user);
  const { objectives, addObjectif, deleteObjectif, updateObjectif } = useObjectives(user);
  const [tab, setTab] = useState("upload");
  const [showProfile, setShowProfile] = useState(false);

  if(!authReady)return null;
  if(!user)return<LoginScreen onLogin={login} onRegister={register}/>;
  if(!storageReady)return(
    <><style>{CSS}</style>
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--bg)'}}>
      <div style={{textAlign:'center'}}><div className="spinner" style={{margin:'0 auto 14px'}}/><div style={{fontFamily:'var(--font-head)',fontSize:13,color:'var(--text2)'}}>Chargement…</div></div>
    </div></>
  );

  const initials=user.slice(0,2).toUpperCase();

  return(
    <><style>{CSS}</style>
    <div className="app">
      <div className="header">
        <div className="header-logo">Bet<span>Track</span></div>
        <div className="header-right">
          <div className="header-avatar" onClick={()=>setShowProfile(true)} title="Mon profil">{initials}</div>
          <div className="header-pill" style={{cursor:'pointer'}} onClick={logout} title="Déconnexion">{user} ↩</div>
        </div>
      </div>
      <div className="scroll-area">
        {tab==="upload"&&<UploadTab addBet={addBet} setBets={setBets} bets={bets} updateBet={updateBet} objectives={objectives}/>}
        {tab==="bets"&&<BetsTab bets={bets} onDelete={deleteBet} onUpdate={updateBet} objectives={objectives} onDeleteAll={deleteAllBets}/>}
        {tab==="dashboard"&&<DashboardTab bets={bets} username={user}/>}
        {tab==="insights"&&<InsightsTab bets={bets} username={user}/>}
        {tab==="objectifs"&&<ObjectifsTab bets={bets} objectives={objectives} onAddObjectif={addObjectif} onDeleteObjectif={deleteObjectif} onUpdateObjectif={updateObjectif}/>}
      </div>
      <nav className="bottom-nav">
        {[["upload","📲","Import"],["bets","📋","Paris"],["dashboard","📊","Stats"],["insights","💡","Insights"],["objectifs","🎯","Objectifs"]].map(([key,icon,label])=>(
          <button key={key} className={`nav-item ${tab===key?'active':''}`} onClick={()=>setTab(key)}>
            <span style={{fontSize:18}}>{icon}</span><span>{label}</span>
          </button>
        ))}
      </nav>
      {showProfile&&<ProfileModal user={user} profile={profile} onSave={saveProfile} onClose={()=>setShowProfile(false)} onDeleteAll={deleteAllBets}/>}
    </div></>
  );
}

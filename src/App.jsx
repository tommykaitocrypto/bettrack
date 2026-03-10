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
  .tag-selector { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 14px; }
  .tag-btn { padding: 12px; border-radius: var(--radius-sm); border: 2px solid var(--border); background: var(--surface2); cursor: pointer; text-align: center; transition: all 0.2s; font-family: var(--font-head); font-size: 14px; font-weight: 700; color: var(--text2); }
  .tag-btn.safe.selected { border-color: var(--safe); background: rgba(200,255,87,0.1); color: var(--safe); }
  .tag-btn.fun.selected { border-color: var(--fun); background: rgba(255,153,87,0.1); color: var(--fun); }
  .tag-emoji { font-size: 20px; margin-bottom: 4px; }
  .btn-primary { width: 100%; padding: 16px; background: var(--accent); color: #0a0a0f; border: none; border-radius: var(--radius); font-family: var(--font-head); font-size: 15px; font-weight: 800; cursor: pointer; letter-spacing: 0.5px; transition: all 0.2s; }
  .btn-primary:hover { background: #d8ff70; transform: translateY(-1px); }
  .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  .btn-secondary { width: 100%; padding: 14px; background: transparent; color: var(--text2); border: 1px solid var(--border); border-radius: var(--radius); font-family: var(--font-head); font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s; margin-top: 8px; }
  .btn-secondary:hover { border-color: var(--text2); color: var(--text); }
  .bet-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 14px; margin-bottom: 10px; cursor: pointer; transition: border-color 0.2s, transform 0.15s; }
  .bet-card:hover { border-color: var(--border2); transform: translateY(-1px); }
  .bet-card:active { transform: scale(0.985); }
  .bet-card-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 8px; }
  .bet-match { font-family: var(--font-head); font-size: 14px; font-weight: 700; line-height: 1.3; }
  .bet-meta { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 10px; }
  .meta-chip { padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: 600; letter-spacing: 0.3px; }
  .chip-sport { background: rgba(87,200,255,0.1); color: var(--accent2); border: 1px solid rgba(87,200,255,0.2); }
  .chip-struct { background: rgba(200,255,87,0.1); color: var(--accent); border: 1px solid rgba(200,255,87,0.2); }
  .chip-safe { background: rgba(200,255,87,0.1); color: var(--safe); border: 1px solid rgba(200,255,87,0.2); }
  .chip-fun { background: rgba(255,153,87,0.1); color: var(--fun); border: 1px solid rgba(255,153,87,0.2); }
  .chip-scorer { background: rgba(212,170,255,0.1); color: var(--scorer); border: 1px solid rgba(212,170,255,0.2); }
  .bet-card-bottom { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; padding-top: 10px; border-top: 1px solid var(--border); }
  .bet-stat-label { font-size: 10px; color: var(--text3); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px; }
  .bet-stat-value { font-family: var(--font-head); font-size: 15px; font-weight: 700; }
  .filter-scroll { display: flex; gap: 6px; overflow-x: auto; padding-bottom: 4px; margin-bottom: 14px; scrollbar-width: none; }
  .filter-scroll::-webkit-scrollbar { display: none; }
  .filter-chip { padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 600; white-space: nowrap; cursor: pointer; border: 1px solid var(--border); background: var(--surface); color: var(--text2); font-family: var(--font-head); transition: all 0.2s; flex-shrink: 0; }
  .filter-chip.active { border-color: var(--accent); background: rgba(200,255,87,0.12); color: var(--accent); }
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
  .bar-val { font-family: var(--font-head); font-size: 12px; font-weight: 700; width: 44px; text-align: right; flex-shrink: 0; }
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
  .donut-legend { display: flex; flex-direction: column; gap: 8px; }
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
  .login-divider { display: flex; align-items: center; gap: 12px; margin: 16px 0; }
  .login-divider-line { flex: 1; height: 1px; background: var(--border); }
  .login-divider-text { font-size: 11px; color: var(--text3); font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; }
  .login-toggle { text-align: center; font-size: 13px; color: var(--text2); margin-top: 4px; }
  .login-toggle button { background: none; border: none; color: var(--accent); font-size: 13px; font-weight: 700; cursor: pointer; padding: 0 4px; font-family: var(--font-body); }
  .invite-info { background: rgba(200,255,87,0.06); border: 1px solid rgba(200,255,87,0.15); border-radius: var(--radius-sm); padding: 10px 14px; font-size: 12px; color: var(--text2); line-height: 1.6; margin-bottom: 16px; }
  .invite-info strong { color: var(--accent); font-family: var(--font-head); }
`;

// ─── SUPABASE CONFIG ──────────────────────────────────────────────────────────
const SUPABASE_URL = "https://tpebejuthrbkbjwbdjqz.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwZWJlanV0aHJia2Jqd2JkanF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxMDM4MjEsImV4cCI6MjA4ODY3OTgyMX0.oysT_KLsQhjJmdKSWAwKgqgU0p66Hz0WNNn-1sN19Tk";
const INVITE_CODE = "BETTRACK2026";

// Supabase REST helpers
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

const SAMPLE_BETS = [
  { id: 1, bet_ref: "REF-001", date: "2025-03-08", heure: "21:00", sport: "Football", competition: "Ligue 1", bookmaker: "Winamax", team_1: "Lens", team_2: "Metz", bet_structure: "combiné", bet_category: "goals", total_odd: 1.53, stake: 15, actual_win: 22.95, result: "win", tag: "SAFE", selections: [{ team: "Lens", player: null, selection_type: "double chance", odd: 1.2 }, { team: "Metz", player: null, selection_type: "over/under", odd: 1.28 }] },
  { id: 2, bet_ref: "REF-002", date: "2025-03-07", heure: "20:45", sport: "Football", competition: "Champions League", bookmaker: "Betclic", team_1: "PSG", team_2: "Real Madrid", bet_structure: "simple", bet_category: "team", total_odd: 2.4, stake: 10, actual_win: 0, result: "loss", tag: "FUN", selections: [{ team: "PSG", player: null, selection_type: "résultat match", odd: 2.4 }] },
  { id: 3, bet_ref: "REF-003", date: "2025-03-05", heure: "17:00", sport: "Football", competition: "Premier League", bookmaker: "Winamax", team_1: "Arsenal", team_2: "Liverpool", bet_structure: "mymatch", bet_category: "player", total_odd: 3.8, stake: 8, actual_win: 30.4, result: "win", tag: "FUN", selections: [{ team: "Arsenal", player: "B.Saka", player_display: "Bukayo Saka", selection_type: "buteur", odd: 2.5 }, { team: "Liverpool", player: null, selection_type: "over/under", odd: 1.52 }] },
  { id: 4, bet_ref: "REF-004", date: "2025-03-03", heure: "21:00", sport: "Football", competition: "Ligue 1", bookmaker: "Betclic", team_1: "OM", team_2: "OL", bet_structure: "simple", bet_category: "team", total_odd: 1.75, stake: 20, actual_win: 35, result: "win", tag: "SAFE", selections: [{ team: "OM", player: null, selection_type: "double chance", odd: 1.75 }] },
  { id: 5, bet_ref: "REF-005", date: "2025-03-01", heure: "15:00", sport: "Tennis", competition: "ATP 500", bookmaker: "Winamax", team_1: "Djokovic", team_2: "Alcaraz", bet_structure: "simple", bet_category: "team", total_odd: 1.6, stake: 25, actual_win: 0, result: "loss", tag: "SAFE", selections: [{ team: "Djokovic", player: null, selection_type: "résultat match", odd: 1.6 }] },
  { id: 6, bet_ref: "REF-006", date: "2025-02-28", heure: "20:45", sport: "Football", competition: "Ligue 1", bookmaker: "Winamax", team_1: "Monaco", team_2: "Nice", bet_structure: "combiné", bet_category: "player", total_odd: 2.1, stake: 12, actual_win: 25.2, result: "win", tag: "SAFE", selections: [{ team: "Monaco", player: "W.Ben Yedder", player_display: "Wissam Ben Yedder", selection_type: "buteur", odd: 1.5 }, { team: "Monaco", player: null, selection_type: "résultat match", odd: 1.4 }] },
  { id: 7, bet_ref: "REF-007", date: "2025-02-25", heure: "21:00", sport: "Football", competition: "Ligue 1", bookmaker: "Betclic", team_1: "PSG", team_2: "Monaco", bet_structure: "mymatch", bet_category: "player", total_odd: 4.2, stake: 5, actual_win: 0, result: "loss", tag: "FUN", selections: [{ team: "PSG", player: "K.Mbappé", player_display: "Kylian Mbappé", selection_type: "buteur", odd: 1.8 }, { team: "PSG", player: null, selection_type: "résultat match", odd: 1.5 }, { team: "Monaco", player: "W.Ben Yedder", player_display: "Wissam Ben Yedder", selection_type: "buteur", odd: 2.2 }] },
  { id: 8, bet_ref: "REF-008", date: "2025-02-22", heure: "17:30", sport: "Football", competition: "Premier League", bookmaker: "Winamax", team_1: "Man City", team_2: "Chelsea", bet_structure: "simple", bet_category: "player", total_odd: 2.8, stake: 10, actual_win: 28, result: "win", tag: "FUN", selections: [{ team: "Man City", player: "E.Haaland", player_display: "Erling Haaland", selection_type: "buteur", odd: 2.8 }] },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const fmt = (n, d = 2) => (n || 0).toFixed(d);
const fmtEuro = n => `${n >= 0 ? '+' : ''}${fmt(n)}€`;

// Normalize raw player name → canonical "I.Lastname" for cross-bookmaker dedup
// "Bradley Barcola" → "B.Barcola"  |  "Barcola" → "Barcola"  |  "B. Barcola" → "B.Barcola"
// "Fabian Ruiz ou Achraf Hakimi" → returns first: "F.Ruiz"
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

// Parse "X ou Y ou Z" multi-player string → [{player, player_display}, ...]
function parseMultiPlayer(raw) {
  if (!raw) return [];
  return raw.split(/\s+ou\s+/i).map(p => {
    const trimmed = p.replace(/\(.*?\)/g, "").trim();
    return { player: normalizePlayerName(trimmed), player_display: trimmed };
  });
}

function computeStats(bets) {
  const totalStake = bets.reduce((a, b) => a + b.stake, 0);
  const totalWin = bets.reduce((a, b) => a + b.actual_win, 0);
  const profit = totalWin - totalStake;
  const roi = totalStake > 0 ? (profit / totalStake) * 100 : 0;
  const wins = bets.filter(b => b.result === "win").length;
  const rate = bets.length > 0 ? (wins / bets.length) * 100 : 0;
  return { totalStake, profit, roi, wins, rate, total: bets.length };
}

function hasScorer(bet) {
  return bet.selections?.some(s => s.selection_type === "buteur" || s.selection_type === "joueur décisif");
}

// Groups by canonical player key ("I.Lastname"), keeps best display name
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
      if (bet.result === "win") { map[key].wins++; map[key].profit += (bet.actual_win - bet.stake); }
      else { map[key].losses++; map[key].profit -= bet.stake; }
    });
  });
  return Object.values(map);
}


// ─── API ─────────────────────────────────────────────────────────────────────
// Proxy via Vercel serverless function (avoids CORS)
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
      model: "claude-sonnet-4-20250514", max_tokens: 1400,
      system: `Tu extrais les données d'UN SEUL pari depuis une capture d'écran Winamax/Betclic.

━━━ RÈGLE 1 — QUEL PARI CHOISIR ━━━
L'image peut contenir plusieurs paris partiellement visibles. Tu dois identifier et extraire
LE PARI LE PLUS COMPLET, c'est-à-dire celui qui réunit TOUS ces éléments :
  ✅ Statut visible (label "Gagné" / "Perdu" ou couleur de barre verte/rouge)
  ✅ Au moins une sélection lisible avec sa cote
  ✅ Mise (€) visible
  ✅ Gains (€) visibles
  ✅ Référence (Réf : XXXXXXXX) visible en bas de CE pari

Ce n'est PAS forcément le premier pari en haut — c'est celui dont tu peux lire TOUS ces champs.
Si plusieurs paris sont également complets, prends celui dont le statut est le plus clairement affiché.

━━━ RÈGLE 2 — RÉSULTAT ━━━
Priorité décroissante :
1. Label texte coloré : "Gagné" (fond vert) → "win" ; "Perdu" (fond rouge) → "loss"
2. Barre de progression : entièrement verte = win ; rouge présent = loss
3. Gains > 0 → "win" ; Gains = 0,00 € → "loss"
4. Symboles ✅/❌ sur les sélections

━━━ RÈGLE 3 — "NON" / "OUI" dans les sélections ━━━
Si une sélection affiche "Non" ou "Oui" comme modificateur de pari (ex: "Juventus gagne par 3 buts d'écart  Non"),
inclus-le dans selection_type ET mets negated:true si "Non", negated:false sinon.

━━━ RÈGLE 4 — JOUEURS ━━━
- "player" : format canonique "I.Nom" (1ère lettre prénom + point + nom)
  Ex : "Bradley Barcola" → "B.Barcola" | "Achraf Hakimi" → "A.Hakimi"
- "player_display" : nom complet tel qu'il apparaît
- Si plusieurs joueurs ("X ou Y ou Z") : player = premier joueur normalisé, player_display = chaîne complète

━━━ FORMAT DE RÉPONSE ━━━
JSON valide sans backticks, sans commentaires :
{
  "bet_ref": "référence exacte (ex: 5ZAIVRT2)",
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
  "selections": [
    {
      "team": "",
      "player": "B.Barcola",
      "player_display": "Bradley Barcola",
      "selection_type": "joueur décisif",
      "odd": 1.38,
      "negated": false
    }
  ]
}`,
      messages: [{ role: "user", content: [
        { type: "image", source: { type: "base64", media_type: mimeType, data: base64 } },
        { type: "text", text: "Identifie le pari le plus complet sur cette image (celui qui a statut + sélections + mise + gains + référence tous visibles), puis extrais-le." }
      ]}]
    })
  });
  const data = await r.json();
  const text = (data.content?.find(b => b.type === "text")?.text || "");
  const raw = extractJSON(text);

  // Post-process: normalize player names client-side as safety net
  if (raw.selections) {
    raw.selections = raw.selections.map(sel => {
      if (sel.player && !sel.player.match(/^[A-Za-zÀ-ÿ]\./)) {
        sel.player_display = sel.player_display || sel.player;
        sel.player = normalizePlayerName(sel.player);
      }
      if (sel.negated && !sel.selection_type?.includes("— Non")) {
        sel.selection_type = (sel.selection_type || "") + " — Non";
      }
      return sel;
    });
  }
  return raw;
}

// Robustly extract the first complete JSON object from a string that may contain
// prose before/after (e.g. "D'après l'image voici le JSON : {...}")
function extractJSON(text) {
  // 1. Strip markdown fences
  let s = text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();

  // 2. Try direct parse first (happy path)
  try { return JSON.parse(s); } catch {}

  // 3. Find the first '{' and match its closing '}' by counting braces
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
  throw new Error("Could not find complete JSON object in: " + s.slice(0, 120));
}

async function detectCompetition(team1, team2, date) {
  const r = await fetch(API_ENDPOINT, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514", max_tokens: 400,
      system: `Tu es un expert en football et sports. Tu identifies la compétition d'un match à partir des équipes et de la date. Utilise la recherche web pour vérifier les informations à jour.
Réponds UNIQUEMENT avec un JSON valide sans backticks: {"competition":"nom exact officiel","type":"championnat|coupe_nationale|ligue_champions|europa_league|conference_league|amical|autre","confidence":"high|medium|low","source":"web|knowledge"}`,
      tools: [{ type: "web_search_20250305", name: "web_search" }],
      messages: [{
        role: "user",
        content: `Recherche dans quelle compétition s'est joué le match "${team1} vs ${team2}" autour du ${date || "2025"}. Cherche sur le web pour avoir l'info précise et à jour. Retourne uniquement le JSON.`
      }]
    })
  });
  const data = await r.json();
  const textBlock = data.content?.filter(b => b.type === "text").pop();
  const text = textBlock?.text || "";
  try {
    return extractJSON(text);
  } catch {
    return { competition: "", type: "autre", confidence: "low", source: "knowledge" };
  }
}

async function runAIAnalysis(bets) {
  const stats = computeStats(bets);
  const players = getPlayerStats(bets);
  const byStruct = {};
  ["simple","combiné","mymatch"].forEach(s => { byStruct[s] = computeStats(bets.filter(b=>b.bet_structure===s)); });
  const payload = { totalBets: bets.length, roi: stats.roi, winRate: stats.rate, profit: stats.profit, byStructure: byStruct, safeStat: computeStats(bets.filter(b=>b.tag==="SAFE")), funStat: computeStats(bets.filter(b=>b.tag==="FUN")), topPlayers: players.sort((a,b)=>b.profit-a.profit).slice(0,3), worstPlayers: players.sort((a,b)=>a.profit-b.profit).slice(0,3), bets: bets.map(b=>({ date:b.date, match:`${b.team_1} vs ${b.team_2}`, comp:b.competition, struct:b.bet_structure, cat:b.bet_category, odd:b.total_odd, stake:b.stake, win:b.actual_win, result:b.result, tag:b.tag })) };
  return callClaude(
    `Tu es un analyste expert en paris sportifs. Analyse les données de paris d'un utilisateur et fournis une analyse personnalisée, directe et actionnable en français. Utilise les vrais chiffres. Structure ton analyse: 1) Profil de parieur, 2) Ce qui marche, 3) Ce qui ne marche pas, 4) Recommandations concrètes pour améliorer le ROI.`,
    `Voici mes données de paris:\n${JSON.stringify(payload, null, 2)}`, 1000
  );
}

// ─── BET DETAIL MODAL ────────────────────────────────────────────────────────
function BetDetailModal({ bet, onClose }) {
  const profit = bet.actual_win - bet.stake;
  const isCombo = bet.bet_structure === "combiné" || bet.bet_structure === "mymatch";
  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-sheet">
        <div className="modal-handle" />
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-header">
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
            <div className={`result-chip ${bet.result === 'win' ? 'result-win' : 'result-loss'}`}>{bet.result === 'win' ? '🏆 Gagné' : '❌ Perdu'}</div>
            {bet.tag === "SAFE" ? <span className="meta-chip chip-safe">🛡️ SAFE</span> : <span className="meta-chip chip-fun">🎲 FUN</span>}
            {hasScorer(bet) && <span className="meta-chip chip-scorer">⚽ Buteur</span>}
            {isCombo && <span className="meta-chip chip-struct">{bet.bet_structure}</span>}
          </div>
          <div className="modal-title">{bet.team_1} vs {bet.team_2}</div>
          <div className="modal-sub">{bet.competition} · {bet.date} à {bet.heure} · {bet.bookmaker}</div>
        </div>
        <div className="modal-body">
          <div className="detail-section">
            <div className="detail-section-title">Financier</div>
            <div className="detail-grid">
              <div className="detail-item"><div className="detail-item-label">Cote totale</div><div className="detail-item-value" style={{color:'var(--accent)'}}>×{fmt(bet.total_odd)}</div></div>
              <div className="detail-item"><div className="detail-item-label">Mise</div><div className="detail-item-value">{fmt(bet.stake)}€</div></div>
              <div className="detail-item"><div className="detail-item-label">Gain brut</div><div className="detail-item-value">{fmt(bet.actual_win)}€</div></div>
              <div className="detail-item"><div className="detail-item-label">Profit net</div><div className="detail-item-value" style={{color: profit>=0?'var(--win)':'var(--loss)'}}>{fmtEuro(profit)}</div></div>
            </div>
          </div>

          {bet.selections?.length > 0 && (
            <div className="detail-section">
              <div className="detail-section-title">
                {isCombo ? `${bet.selections.length} sélections du combiné` : "Sélection"}
              </div>
              {bet.selections.map((sel, i) => {
                const isNeg = sel.negated || sel.selection_type?.includes("— Non");
                return (
                  <div key={i} className="selection-detail" style={isNeg ? {borderColor:'rgba(255,153,87,0.3)',background:'rgba(255,153,87,0.04)'} : {}}>
                    <div className="sel-top">
                      <div style={{flex:1}}>
                        <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:3,flexWrap:'wrap'}}>
                          <div className="sel-team">{sel.team}</div>
                          {isNeg && <span style={{background:'rgba(255,153,87,0.15)',color:'var(--fun)',border:'1px solid rgba(255,153,87,0.35)',borderRadius:5,fontSize:10,fontWeight:800,padding:'1px 6px',fontFamily:'var(--font-head)',letterSpacing:'0.3px'}}>NON ↩</span>}
                        </div>
                        <div className="sel-type">{sel.selection_type}</div>
                        {sel.player && (
                          <div style={{marginTop:5,display:'flex',alignItems:'center',gap:5,flexWrap:'wrap'}}>
                            <span className="scorer-tag">⚽ {sel.player_display || sel.player}</span>
                            {sel.player !== (sel.player_display || sel.player) && (
                              <span style={{fontSize:10,color:'var(--text3)',fontFamily:'var(--font-head)',fontWeight:600}}>{sel.player}</span>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="sel-odd-big">×{fmt(sel.odd)}</div>
                    </div>
                  </div>
                );
              })}
              {isCombo && (
                <div className="combo-total">
                  <span style={{fontSize:12, color:'var(--text2)'}}>Cote combinée finale</span>
                  <span style={{fontFamily:'var(--font-head)', fontSize:20, fontWeight:800, color:'var(--accent)'}}>×{fmt(bet.total_odd)}</span>
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
        </div>
      </div>
    </div>
  );
}

// ─── UPLOAD TAB ──────────────────────────────────────────────────────────────
function UploadTab({ setBets, addBet, bets }) {
  const [phase, setPhase] = useState("idle");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [extracted, setExtracted] = useState(null);
  const [tag, setTag] = useState("SAFE");
  const [error, setError] = useState("");
  const [drag, setDrag] = useState(false);
  const [compDetect, setCompDetect] = useState(null);
  const [detectingComp, setDetectingComp] = useState(false);
  const [dupWarning, setDupWarning] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef();

  const handleFile = useCallback(async (file) => {
    if (!file?.type.startsWith("image/")) return;
    setPreviewUrl(URL.createObjectURL(file));
    setPhase("analyzing");
    setError(""); setCompDetect(null); setDupWarning(false);
    try {
      const b64 = await new Promise((res,rej) => { const r=new FileReader(); r.onload=()=>res(r.result.split(",")[1]); r.onerror=rej; r.readAsDataURL(file); });
      const data = await analyzeScreenshot(b64, file.type);
      setExtracted(data);
      setPhase("validating");
      // Check for duplicate ref
      if (data.bet_ref) {
        const isDup = bets.some(b => b.bet_ref && b.bet_ref === data.bet_ref);
        if (isDup) setDupWarning(true);
      }
      if (data.team_1 && data.team_2) {
        setDetectingComp(true);
        try {
          const comp = await detectCompetition(data.team_1, data.team_2, data.date);
          setCompDetect(comp);
          setExtracted(prev => ({ ...prev, competition: comp.competition }));
        } catch {}
        setDetectingComp(false);
      }
    } catch(e) {
      setError("Analyse impossible. " + (e.message?.includes("JSON") || e.message?.includes("token")
        ? "Claude n'a pas retourné un format valide. Réessayez."
        : "Vérifiez votre connexion.\n" + (e.message||"")));
      setPhase("error");
    }
  }, [bets]);

  const upd = (k,v) => setExtracted(p => ({...p, [k]:v}));

  const handleConfirm = async (force = false) => {
    if (!force && dupWarning) return;
    setSaving(true);
    try {
      await addBet({ ...extracted, tag });
      setPhase("success");
    } catch(e) {
      setError("Erreur d'enregistrement : " + (e.message || ""));
    }
    setSaving(false);
  };

  const reset = () => {
    setPhase("idle"); setPreviewUrl(null); setExtracted(null); setTag("SAFE");
    setError(""); setCompDetect(null); setDetectingComp(false); setDupWarning(false); setSaving(false);
    if(fileRef.current) fileRef.current.value="";
  };

  if (phase === "success") return (
    <div className="success-screen">
      <div className="success-icon">✅</div>
      <div className="success-title">Pari enregistré !</div>
      <div className="success-sub">Dashboard et insights mis à jour.</div>
      <button className="btn-primary" style={{marginTop:24,maxWidth:240}} onClick={reset}>Importer un autre pari</button>
    </div>
  );

  if (phase === "idle") return (
    <div>
      <div style={{marginBottom:16}}>
        <div className="section-title">Importer un pari</div>
        <p style={{fontSize:13,color:'var(--text2)',lineHeight:1.6}}>Capture d'écran d'un pari terminé — Winamax ou Betclic.</p>
      </div>
      <div className={`upload-zone ${drag?'drag':''}`} onDrop={e=>{e.preventDefault();setDrag(false);handleFile(e.dataTransfer.files[0]);}} onDragOver={e=>{e.preventDefault();setDrag(true);}} onDragLeave={()=>setDrag(false)}>
        <input ref={fileRef} type="file" accept="image/*" onChange={e=>handleFile(e.target.files[0])} />
        <div className="upload-icon">📲</div>
        <div className="upload-title">Importer une capture</div>
        <div className="upload-sub">Appuyer pour choisir depuis la galerie</div>
        <div className="bookmaker-badges"><span className="badge badge-winamax">Winamax</span><span className="badge badge-betclic">Betclic</span></div>
      </div>
    </div>
  );

  if (phase === "analyzing") return (
    <div className="image-preview-wrap"><img src={previewUrl} alt="" />
      <div className="analyzing-overlay"><div className="spinner"/><div className="analyzing-text">Analyse en cours…</div><div className="analyzing-sub">Extraction des données du pari</div></div>
    </div>
  );

  if (phase === "error") return (
    <div><div className="image-preview-wrap"><img src={previewUrl} alt="" style={{opacity:0.4}} /></div><div className="error-msg">❌ {error}</div><button className="btn-secondary" onClick={reset}>Réessayer</button></div>
  );

  if (phase === "validating" && extracted) return (
    <div>
      <div className="image-preview-wrap"><img src={previewUrl} alt="" /></div>
      <div className="validation-header">
        <div className="validation-title">Vérification</div>
        <div className={`result-chip ${extracted.result==='win'?'result-win':'result-loss'}`}>{extracted.result==='win'?'🏆 Gagné':'❌ Perdu'}</div>
      </div>

      {/* DUPLICATE WARNING */}
      {dupWarning && (
        <div style={{background:'rgba(255,153,87,0.1)',border:'1px solid rgba(255,153,87,0.35)',borderRadius:'var(--radius-sm)',padding:'12px 14px',marginBottom:12}}>
          <div style={{fontFamily:'var(--font-head)',fontSize:13,fontWeight:700,color:'var(--fun)',marginBottom:4}}>⚠️ Pari potentiellement déjà enregistré</div>
          <div style={{fontSize:12,color:'var(--text2)',lineHeight:1.5,marginBottom:10}}>La référence <strong style={{color:'var(--text)',fontFamily:'var(--font-head)'}}>{extracted.bet_ref}</strong> correspond à un pari déjà dans ta base. Vérifie avant de confirmer.</div>
          <div style={{display:'flex',gap:8}}>
            <button onClick={()=>handleConfirm(true)} disabled={saving} style={{flex:1,padding:'8px',background:'rgba(255,153,87,0.15)',border:'1px solid rgba(255,153,87,0.4)',borderRadius:8,color:'var(--fun)',fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'var(--font-head)'}}>
              {saving ? "Enregistrement…" : "Enregistrer quand même"}
            </button>
            <button onClick={reset} style={{flex:1,padding:'8px',background:'var(--surface2)',border:'1px solid var(--border)',borderRadius:8,color:'var(--text2)',fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'var(--font-head)'}}>Annuler</button>
          </div>
        </div>
      )}

      {(detectingComp || compDetect) && (
        <div className="competition-detect">
          <div className="competition-detect-icon">{detectingComp?'🔍':'🏆'}</div>
          <div>
            {detectingComp
              ? <div style={{fontSize:12,color:'var(--accent2)'}}>Recherche de la compétition en cours…</div>
              : <>
                  <div className="competition-detect-label">
                    Compétition détectée {compDetect.source==='web'?'via web 🌐':'via base de connaissance'}
                    {compDetect.confidence==='high'?' · Haute confiance':compDetect.confidence==='medium'?' · Confiance moyenne':''}
                  </div>
                  <div className="competition-detect-name">{compDetect.competition}</div>
                </>
            }
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-title">Informations générales</div>
        {/* Bet reference — shown read-only for transparency */}
        {extracted.bet_ref && (
          <div style={{display:'flex',alignItems:'center',gap:8,background:'var(--surface2)',border:'1px solid var(--border)',borderRadius:8,padding:'8px 12px',marginBottom:12}}>
            <span style={{fontSize:11,color:'var(--text3)',textTransform:'uppercase',letterSpacing:'0.5px',fontWeight:600,flexShrink:0}}>Réf</span>
            <span style={{fontFamily:'var(--font-head)',fontSize:13,fontWeight:700,color:'var(--text2)',flex:1}}>{extracted.bet_ref}</span>
            <span style={{fontSize:10,color:'var(--text3)'}}>Anti-doublons ✓</span>
          </div>
        )}
        <div className="field-row">
          <div className="field-group"><div className="field-label">Sport</div><input className="field-input" value={extracted.sport||""} onChange={e=>upd("sport",e.target.value)} /></div>
          <div className="field-group"><div className="field-label">Bookmaker</div><select className="field-input" value={extracted.bookmaker||""} onChange={e=>upd("bookmaker",e.target.value)}><option>Winamax</option><option>Betclic</option></select></div>
        </div>
        <div className="field-group"><div className="field-label">Compétition</div><input className="field-input" value={extracted.competition||""} onChange={e=>upd("competition",e.target.value)} /></div>
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
          <div className="field-group"><div className="field-label">Mise (€)</div><input className="field-input" type="number" step="0.5" value={extracted.stake||""} onChange={e=>upd("stake",parseFloat(e.target.value))} /></div>
        </div>
        <div className="field-group"><div className="field-label">Gain réel (€)</div><input className="field-input" type="number" step="0.01" value={extracted.actual_win||""} onChange={e=>upd("actual_win",parseFloat(e.target.value))} /></div>
      </div>

      {extracted.selections?.length > 0 && (
        <div className="card">
          <div className="card-title">Sélections ({extracted.selections.length})</div>
          {extracted.selections.map((s,i) => {
            const isScorer = s.selection_type==="buteur" || s.selection_type==="joueur décisif" || s.selection_type?.toLowerCase().includes("buteur") || s.selection_type?.toLowerCase().includes("joueur décisif");
            const isNeg = s.negated || s.selection_type?.includes("— Non");
            return (
              <div key={i} className="selection-item" style={isNeg?{borderColor:'rgba(255,153,87,0.3)',background:'rgba(255,153,87,0.03)'}:{}}>
                <div className="selection-left">
                  <div className="selection-team">
                    {s.team}{s.player_display||s.player ? ` · ${s.player_display||s.player}` : ""}
                    {isScorer && <span className="scorer-tag">⚽ Buteur</span>}
                    {isNeg && <span style={{background:'rgba(255,153,87,0.15)',color:'var(--fun)',border:'1px solid rgba(255,153,87,0.35)',borderRadius:5,fontSize:10,fontWeight:800,padding:'1px 5px',fontFamily:'var(--font-head)'}}>NON ↩</span>}
                  </div>
                  <div className="selection-type">{s.selection_type}</div>
                  {s.player && <div style={{fontSize:10,color:'var(--text3)',marginTop:2,fontFamily:'var(--font-head)',fontWeight:600,letterSpacing:'0.3px'}}>ID joueur : {s.player}</div>}
                </div>
                <div className="selection-odd">×{fmt(s.odd)}</div>
              </div>
            );
          })}
        </div>
      )}

      <div className="card">
        <div className="card-title">Tag du pari</div>
        <div className="tag-selector">
          <button className={`tag-btn safe ${tag==='SAFE'?'selected':''}`} onClick={()=>setTag("SAFE")}><div className="tag-emoji">🛡️</div>SAFE</button>
          <button className={`tag-btn fun ${tag==='FUN'?'selected':''}`} onClick={()=>setTag("FUN")}><div className="tag-emoji">🎲</div>FUN</button>
        </div>
      </div>

      <button className="btn-primary" onClick={()=>handleConfirm(false)} disabled={dupWarning || saving}>
        {saving ? <span style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8}}><span className="spinner" style={{width:16,height:16,borderWidth:2}}/>Enregistrement…</span> : "Confirmer l'enregistrement"}
      </button>
      <button className="btn-secondary" onClick={reset}>Annuler</button>
    </div>
  );
  return null;
}

// ─── BETS TAB ────────────────────────────────────────────────────────────────
function BetsTab({ bets }) {
  const [selected, setSelected] = useState(null);
  const [filterResult, setFilterResult] = useState("Tous");     // Tous | Win | Loss
  const [filterTag, setFilterTag] = useState("Tous");           // Tous | SAFE | FUN | Buteur
  const [filterSport, setFilterSport] = useState("Tous");
  const [filterComp, setFilterComp] = useState("Toutes");
  const [filterBook, setFilterBook] = useState("Tous");
  const [showFilters, setShowFilters] = useState(false);

  // Derive unique values from data
  const sports = ["Tous", ...Array.from(new Set(bets.map(b => b.sport).filter(Boolean))).sort()];
  const competitions = ["Toutes", ...Array.from(new Set(bets.map(b => b.competition).filter(Boolean))).sort()];
  const bookmakers = ["Tous", ...Array.from(new Set(bets.map(b => b.bookmaker).filter(Boolean))).sort()];

  const filtered = bets.filter(b => {
    if (filterResult === "Win" && b.result !== "win") return false;
    if (filterResult === "Loss" && b.result !== "loss") return false;
    if (filterTag === "SAFE" && b.tag !== "SAFE") return false;
    if (filterTag === "FUN" && b.tag !== "FUN") return false;
    if (filterTag === "Buteur" && !hasScorer(b)) return false;
    if (filterSport !== "Tous" && b.sport !== filterSport) return false;
    if (filterComp !== "Toutes" && b.competition !== filterComp) return false;
    if (filterBook !== "Tous" && b.bookmaker !== filterBook) return false;
    return true;
  });

  const activeFiltersCount = [
    filterResult !== "Tous", filterTag !== "Tous",
    filterSport !== "Tous", filterComp !== "Toutes", filterBook !== "Tous"
  ].filter(Boolean).length;

  const resetAll = () => { setFilterResult("Tous"); setFilterTag("Tous"); setFilterSport("Tous"); setFilterComp("Toutes"); setFilterBook("Tous"); };

  return (
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
        <div className="section-title" style={{marginBottom:0}}>{filtered.length} / {bets.length} paris</div>
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          {activeFiltersCount > 0 && (
            <button onClick={resetAll} style={{background:'rgba(255,87,112,0.12)',border:'1px solid rgba(255,87,112,0.3)',borderRadius:20,padding:'4px 10px',fontSize:11,color:'var(--loss)',cursor:'pointer',fontFamily:'var(--font-head)',fontWeight:700}}>
              ✕ Réinitialiser ({activeFiltersCount})
            </button>
          )}
          <button onClick={()=>setShowFilters(p=>!p)} style={{background: showFilters?'rgba(200,255,87,0.12)':'var(--surface2)',border:`1px solid ${showFilters?'var(--accent)':'var(--border)'}`,borderRadius:20,padding:'5px 12px',fontSize:12,color:showFilters?'var(--accent)':'var(--text2)',cursor:'pointer',fontFamily:'var(--font-head)',fontWeight:700,display:'flex',alignItems:'center',gap:5}}>
            ⚙️ Filtres {activeFiltersCount > 0 && <span style={{background:'var(--accent)',color:'#0a0a0f',borderRadius:'50%',width:16,height:16,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:800}}>{activeFiltersCount}</span>}
          </button>
        </div>
      </div>

      {/* QUICK FILTERS ROW 1 — Résultat */}
      <div className="filter-scroll">
        {["Tous","Win","Loss"].map(f=>(
          <button key={f} className={`filter-chip ${filterResult===f?'active':''}`} onClick={()=>setFilterResult(f)}>
            {f==="Win"?"🏆 Win":f==="Loss"?"❌ Loss":"Tous résultats"}
          </button>
        ))}
        <div style={{width:1,background:'var(--border)',flexShrink:0,margin:'0 2px'}}/>
        {["Tous","SAFE","FUN","Buteur"].map(f=>(
          <button key={f} className={`filter-chip ${filterTag===f?'active':''}`} onClick={()=>setFilterTag(f)}>
            {f==="SAFE"?"🛡️ SAFE":f==="FUN"?"🎲 FUN":f==="Buteur"?"⚽ Buteur":"Tous tags"}
          </button>
        ))}
      </div>

      {/* ADVANCED FILTERS PANEL */}
      {showFilters && (
        <div className="card" style={{marginBottom:12,padding:'14px'}}>
          <div style={{fontFamily:'var(--font-head)',fontSize:11,fontWeight:700,color:'var(--text3)',textTransform:'uppercase',letterSpacing:'0.7px',marginBottom:12}}>Filtres avancés</div>

          <div className="field-group" style={{marginBottom:10}}>
            <div className="field-label">Sport</div>
            <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
              {sports.map(s=>(
                <button key={s} onClick={()=>setFilterSport(s)} style={{padding:'5px 12px',borderRadius:20,border:`1px solid ${filterSport===s?'var(--accent2)':'var(--border)'}`,background:filterSport===s?'rgba(87,200,255,0.12)':'var(--surface2)',color:filterSport===s?'var(--accent2)':'var(--text2)',fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:'var(--font-head)',transition:'all 0.15s'}}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="field-group" style={{marginBottom:10}}>
            <div className="field-label">Compétition / Championnat</div>
            <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
              {competitions.map(c=>(
                <button key={c} onClick={()=>setFilterComp(c)} style={{padding:'5px 12px',borderRadius:20,border:`1px solid ${filterComp===c?'var(--accent)':'var(--border)'}`,background:filterComp===c?'rgba(200,255,87,0.12)':'var(--surface2)',color:filterComp===c?'var(--accent)':'var(--text2)',fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:'var(--font-head)',transition:'all 0.15s',whiteSpace:'nowrap'}}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="field-group" style={{marginBottom:0}}>
            <div className="field-label">Bookmaker</div>
            <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
              {bookmakers.map(bk=>(
                <button key={bk} onClick={()=>setFilterBook(bk)} style={{padding:'5px 12px',borderRadius:20,border:`1px solid ${filterBook===bk?'rgba(255,107,107,0.5)':'var(--border)'}`,background:filterBook===bk?'rgba(255,107,107,0.1)':'var(--surface2)',color:filterBook===bk?'var(--loss)':'var(--text2)',fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:'var(--font-head)',transition:'all 0.15s'}}>
                  {bk}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {filtered.length === 0
        ? <div className="empty-state"><div className="e-icon">🔍</div><div className="e-title">Aucun pari</div><div className="e-sub">Aucun résultat pour ces filtres.</div></div>
        : filtered.map(bet => {
          const profit = bet.actual_win - bet.stake;
          return (
            <div key={bet.id} className="bet-card" onClick={()=>setSelected(bet)}>
              <div className="bet-card-top">
                <div>
                  <div className="bet-match">{bet.team_1} vs {bet.team_2}</div>
                  <div style={{fontSize:11,color:'var(--text3)',marginTop:2}}>{bet.competition} · {bet.date}</div>
                </div>
                <div className={`result-chip ${bet.result==='win'?'result-win':'result-loss'}`} style={{marginLeft:8,flexShrink:0}}>{bet.result==='win'?'🏆':'❌'}</div>
              </div>
              <div className="bet-meta">
                <span className="meta-chip chip-sport">{bet.sport}</span>
                <span className="meta-chip chip-struct">{bet.bet_structure}</span>
                {bet.tag==='SAFE'?<span className="meta-chip chip-safe">🛡️ SAFE</span>:<span className="meta-chip chip-fun">🎲 FUN</span>}
                {hasScorer(bet) && <span className="meta-chip chip-scorer">⚽ Buteur</span>}
              </div>
              <div className="bet-card-bottom">
                <div><div className="bet-stat-label">Cote</div><div className="bet-stat-value" style={{color:'var(--accent)'}}>×{fmt(bet.total_odd)}</div></div>
                <div><div className="bet-stat-label">Mise</div><div className="bet-stat-value">{fmt(bet.stake)}€</div></div>
                <div><div className="bet-stat-label">Profit</div><div className="bet-stat-value" style={{color:profit>=0?'var(--win)':'var(--loss)'}}>{fmtEuro(profit)}</div></div>
              </div>
            </div>
          );
        })
      }
      {selected && <BetDetailModal bet={selected} onClose={()=>setSelected(null)} />}
    </div>
  );
}

// ─── DONUT + SPARKLINE ───────────────────────────────────────────────────────
function DonutChart({ segments, size=80 }) {
  const r=(size/2)-8, cx=size/2, cy=size/2, circ=2*Math.PI*r;
  let offset=0, total=segments.reduce((a,s)=>a+s.value,0);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{transform:'rotate(-90deg)'}}>
      {segments.map((seg,i)=>{ const pct=total>0?seg.value/total:0, dash=pct*circ, gap=circ-dash; const el=<circle key={i} r={r} cx={cx} cy={cy} fill="none" stroke={seg.color} strokeWidth={12} strokeDasharray={`${dash} ${gap}`} strokeDashoffset={-offset*circ}/>; offset+=pct; return el; })}
    </svg>
  );
}

function ProfitLine({ bets }) {
  if(bets.length<2) return <div style={{height:120,display:'flex',alignItems:'center',justifyContent:'center',color:'var(--text3)',fontSize:12}}>Pas assez de données</div>;
  const sorted=[...bets].sort((a,b)=>new Date(a.date)-new Date(b.date));
  let running=0; const pts=sorted.map(b=>{running+=(b.actual_win-b.stake);return running;});
  const mn=Math.min(...pts,0), mx=Math.max(...pts,0.01), w=360, h=100;
  const px=i=>(i/(pts.length-1))*(w-4)+2;
  const py=v=>h-((v-mn)/(mx-mn))*(h-4)-2;
  const d=pts.map((v,i)=>`${i===0?'M':'L'}${px(i)},${py(v)}`).join(' ');
  const fill=d+` L${px(pts.length-1)},${h} L${px(0)},${h} Z`;
  const last=pts[pts.length-1], color=last>=0?'#57ff9e':'#ff5770';
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="120" style={{display:'block'}}>
      <defs><linearGradient id="pg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.3"/><stop offset="100%" stopColor={color} stopOpacity="0.02"/></linearGradient></defs>
      <line x1={0} y1={py(0)} x2={w} y2={py(0)} stroke="var(--border)" strokeWidth="1" strokeDasharray="4,4"/>
      <path d={fill} fill="url(#pg)"/>
      <path d={d} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={px(pts.length-1)} cy={py(last)} r="5" fill={color}/>
    </svg>
  );
}

// ─── DASHBOARD TAB ───────────────────────────────────────────────────────────
function DashboardTab({ bets }) {
  const [pView, setPView] = useState("top");
  if(bets.length===0) return <div className="empty-state"><div className="e-icon">📊</div><div className="e-title">Aucune donnée</div><div className="e-sub">Importez vos premiers paris.</div></div>;
  const s=computeStats(bets);
  const safe=bets.filter(b=>b.tag==="SAFE"), fun=bets.filter(b=>b.tag==="FUN");
  const wina=bets.filter(b=>b.bookmaker==="Winamax"), betc=bets.filter(b=>b.bookmaker==="Betclic");
  const byStruct=["simple","combiné","mymatch"].map(st=>{const sub=bets.filter(b=>b.bet_structure===st);return{label:st,count:sub.length,roi:computeStats(sub).roi};});
  const maxCt=Math.max(...byStruct.map(b=>b.count),1);
  const players=getPlayerStats(bets);
  const topP=[...players].sort((a,b)=>b.profit-a.profit).slice(0,5);
  const worstP=[...players].sort((a,b)=>a.profit-b.profit).slice(0,5);
  const shown=pView==="top"?topP:worstP;
  return (
    <div>
      <div className="section-title">Résumé global</div>
      <div className="stat-grid">
        <div className="stat-card"><div className="stat-label">Total paris</div><div className="stat-value neutral">{s.total}</div><div className="stat-sub">{s.wins} gagnés</div></div>
        <div className="stat-card"><div className="stat-label">Réussite</div><div className={`stat-value ${s.rate>=50?'positive':'negative'}`}>{fmt(s.rate,0)}%</div><div className="stat-sub">sur {s.total}</div></div>
        <div className="stat-card"><div className="stat-label">Total misé</div><div className="stat-value">{fmt(s.totalStake)}€</div></div>
        <div className="stat-card"><div className="stat-label">ROI</div><div className={`stat-value ${s.roi>=0?'positive':'negative'}`}>{fmt(s.roi,0)}%</div></div>
        <div className="stat-card full"><div className="stat-label">Profit total</div><div className={`stat-value ${s.profit>=0?'positive':'negative'}`} style={{fontSize:36}}>{fmtEuro(s.profit)}</div></div>
      </div>
      <div className="section-title">Profit dans le temps</div>
      <div className="card" style={{padding:'14px 14px 10px'}}><ProfitLine bets={bets}/></div>
      <div className="section-title">SAFE vs FUN</div>
      <div className="card">
        <div className="donut-wrap">
          <DonutChart segments={[{value:safe.length,color:'var(--safe)'},{value:fun.length,color:'var(--fun)'}]} size={88}/>
          <div className="donut-legend">
            <div className="legend-item"><div className="legend-dot" style={{background:'var(--safe)'}}/><span>SAFE — {safe.length} paris · ROI {fmt(computeStats(safe).roi,0)}%</span></div>
            <div className="legend-item"><div className="legend-dot" style={{background:'var(--fun)'}}/><span>FUN — {fun.length} paris · ROI {fmt(computeStats(fun).roi,0)}%</span></div>
          </div>
        </div>
      </div>
      <div className="section-title">Par structure</div>
      <div className="card"><div className="bar-chart">{byStruct.filter(b=>b.count>0).map(b=><div key={b.label} className="bar-row"><div className="bar-label" style={{textTransform:'capitalize'}}>{b.label}</div><div className="bar-track"><div className="bar-fill" style={{width:`${(b.count/maxCt)*100}%`,background:'var(--accent)'}}/></div><div className="bar-val" style={{color:b.roi>=0?'var(--win)':'var(--loss)'}}>{fmt(b.roi,0)}%</div></div>)}</div></div>
      <div className="section-title">Par bookmaker</div>
      <div className="card"><div className="bar-chart">{[{l:"Winamax",s:wina},{l:"Betclic",s:betc}].filter(x=>x.s.length>0).map(({l,s:sub})=>{const st=computeStats(sub);return(<div key={l} className="bar-row"><div className="bar-label">{l}</div><div className="bar-track"><div className="bar-fill" style={{width:`${(sub.length/bets.length)*100}%`,background:l==='Winamax'?'var(--loss)':'var(--accent2)'}}/></div><div className="bar-val" style={{color:st.roi>=0?'var(--win)':'var(--loss)'}}>{fmt(st.roi,0)}%</div></div>);})}</div></div>

      {players.length > 0 && (
        <>
          <div className="section-title">Classement joueurs</div>
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
                    <div className="player-meta" style={{display:'flex',alignItems:'center',gap:6}}>
                      <span style={{background:'rgba(212,170,255,0.12)',color:'var(--scorer)',border:'1px solid rgba(212,170,255,0.2)',borderRadius:4,padding:'1px 5px',fontSize:10,fontFamily:'var(--font-head)',fontWeight:700,letterSpacing:'0.3px'}}>{p.player}</span>
                      <span>{p.count} paris · {p.count>0?fmt(p.wins/p.count*100,0):0}% réussite</span>
                    </div>
                  </div>
                  <div className="player-profit" style={{color:p.profit>=0?'var(--win)':'var(--loss)'}}>{fmtEuro(p.profit)}</div>
                </div>
              ))
            }
          </div>
        </>
      )}
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
    insights.push({icon:icons[cat],type:st.roi>=0?'positive':'negative',color:st.roi>=0?'var(--win)':'var(--loss)',title:labels[cat],sub:`${sub.length} paris · ${fmt(st.rate,0)}% réussite`,roi:`${st.roi>=0?'+':''}${fmt(st.roi,0)}%`});
  });
  const safeS=computeStats(bets.filter(b=>b.tag==="SAFE")), funS=computeStats(bets.filter(b=>b.tag==="FUN"));
  if(bets.filter(b=>b.tag==="SAFE").length>0) insights.push({icon:"🛡️",type:safeS.roi>=0?'positive':'negative',color:safeS.roi>=0?'var(--win)':'var(--loss)',title:"Paris SAFE",sub:`${fmt(safeS.rate,0)}% réussite`,roi:`${safeS.roi>=0?'+':''}${fmt(safeS.roi,0)}%`});
  if(bets.filter(b=>b.tag==="FUN").length>0) insights.push({icon:"🎲",type:funS.roi>=0?'positive':'negative',color:funS.roi>=0?'var(--win)':'var(--loss)',title:"Paris FUN",sub:`${fmt(funS.rate,0)}% réussite`,roi:`${funS.roi>=0?'+':''}${fmt(funS.roi,0)}%`});
  [{label:"Cotes 1–1.5",mn:0,mx:1.5},{label:"1.5–2",mn:1.5,mx:2},{label:"2–3",mn:2,mx:3},{label:"3–5",mn:3,mx:5},{label:"5+",mn:5,mx:999}].forEach(({label,mn,mx})=>{
    const sub=bets.filter(b=>b.total_odd>mn&&b.total_odd<=mx); if(sub.length<2) return;
    const st=computeStats(sub);
    insights.push({icon:"📈",type:st.roi>=0?'positive':'negative',color:st.roi>=0?'var(--win)':'var(--loss)',title:`Cotes ${label}`,sub:`${sub.length} paris · ${fmt(st.rate,0)}% réussite`,roi:`${st.roi>=0?'+':''}${fmt(st.roi,0)}%`});
  });
  const sorted=insights.sort((a,b)=>Math.abs(parseFloat(b.roi))-Math.abs(parseFloat(a.roi)));

  return (
    <div>
      {/* AI PANEL */}
      <div className="ai-panel">
        <div className="ai-panel-title">🤖 Analyse IA Personnalisée <span className="ai-premium-badge">PREMIUM</span></div>
        <div className="ai-panel-sub">Claude analyse l'intégralité de tes {bets.length} paris : patterns, biais, forces, faiblesses — et te donne des recommandations concrètes pour améliorer ton ROI.</div>
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
      <p style={{fontSize:13,color:'var(--text2)',marginBottom:16,lineHeight:1.6}}>Basés sur {bets.length} paris.</p>
      {sorted.map((ins,i)=>(
        <div key={i} className="insight-card">
          <div className={`insight-icon icon-${ins.type}`}>{ins.icon}</div>
          <div className="insight-text"><div className="insight-title">{ins.title}</div><div className="insight-sub">{ins.sub}</div></div>
          <div className="insight-roi" style={{color:ins.color}}>{ins.roi}</div>
        </div>
      ))}
    </div>
  );
}

// ─── AUTH HOOK (Supabase) ─────────────────────────────────────────────────────
function useAuth() {
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    // Session persists in localStorage — survives tab close/reopen
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
    if (inviteCode.trim().toUpperCase() !== INVITE_CODE)
      throw new Error("Code d'invitation invalide.");
    if (!username.trim() || username.length < 2)
      throw new Error("Pseudo trop court (min 2 caractères).");
    if (username.length > 20)
      throw new Error("Pseudo trop long (max 20 caractères).");
    if (!/^[a-zA-Z0-9_\-.]+$/.test(username))
      throw new Error("Pseudo invalide — lettres, chiffres, _ - . uniquement.");
    // Check if taken
    const existing = await sbGet("users", `username=eq.${encodeURIComponent(username)}&select=username`);
    if (existing.length) throw new Error("Ce pseudo est déjà pris.");
    await sbPost("users", { username });
    localStorage.setItem("bettrack:user", username);
    setUser(username);
  };

  const logout = () => {
    localStorage.removeItem("bettrack:user");
    setUser(null);
  };

  return { user, authReady, login, register, logout };
}

// ─── USER BETS HOOK (Supabase) ────────────────────────────────────────────────
function useUserBets(username) {
  const [bets, setBetsState] = useState([]);
  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    if (!username) return;
    setStorageReady(false);
    (async () => {
      try {
        const rows = await sbGet("bets", `username=eq.${encodeURIComponent(username)}&order=created_at.desc&select=*`);
        // Parse selections from jsonb
        setBetsState(rows.map(r => ({ ...r, selections: r.selections || [] })));
      } catch { setBetsState([]); }
      setStorageReady(true);
    })();
  }, [username]);

  // Add a single bet (called from UploadTab)
  const addBet = async (bet) => {
    const row = { ...bet, username, id: undefined }; // let Supabase generate UUID
    delete row.id;
    const [saved] = await sbPost("bets", row);
    setBetsState(prev => [{ ...saved, selections: saved.selections || [] }, ...prev]);
  };

  // setBets kept for compatibility (used as updater fn in UploadTab)
  const setBets = (updater) => {
    if (typeof updater === "function") {
      setBetsState(prev => updater(prev));
    } else {
      setBetsState(updater);
    }
  };

  return { bets, storageReady, setBets, addBet };
}

// ─── LOGIN SCREEN ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin, onRegister }) {
  const [mode, setMode] = useState("login");   // "login" | "register"
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
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="login-screen">
        <div className="login-logo">Bet<span>Track</span></div>
        <div className="login-tagline">Ton tracker de paris sportifs</div>

        <div className="login-card">
          <div className="login-card-title">{mode === "login" ? "Connexion" : "Créer un compte"}</div>
          <div className="login-card-sub">
            {mode === "login"
              ? "Entre ton pseudo pour accéder à tes paris."
              : "Entre le code d'invitation et choisis ton pseudo."}
          </div>

          {mode === "register" && (
            <>
              <div className="invite-info">
                🔑 Demande le <strong>code d'invitation</strong> à l'admin pour rejoindre.
              </div>
              <input
                className="login-input"
                placeholder="Code d'invitation"
                value={inviteCode}
                onChange={e => setInviteCode(e.target.value)}
                autoCapitalize="characters"
              />
            </>
          )}

          <input
            className="login-input"
            placeholder="Ton pseudo (ex: alex_b)"
            value={username}
            onChange={e => setUsername(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            autoCapitalize="none"
            autoCorrect="off"
          />

          {error && <div className="login-error">⚠️ {error}</div>}

          <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading
              ? <span style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8}}><span className="spinner" style={{width:16,height:16,borderWidth:2}}/> Chargement…</span>
              : mode === "login" ? "Se connecter" : "Créer le compte"}
          </button>
        </div>

        <div className="login-toggle">
          {mode === "login"
            ? <>Pas encore de compte ? <button onClick={() => { setMode("register"); setError(""); }}>Créer un compte</button></>
            : <>Déjà un compte ? <button onClick={() => { setMode("login"); setError(""); }}>Se connecter</button></>
          }
        </div>

        <div style={{marginTop: 32, fontSize: 11, color: 'var(--text3)', textAlign: 'center', lineHeight: 1.6}}>
          Winamax · Betclic · Analyse IA
        </div>
      </div>
    </>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const { user, authReady, login, register, logout } = useAuth();
  const { bets, storageReady, setBets, addBet } = useUserBets(user);
  const [tab, setTab] = useState("upload");

  if (!authReady) return null;
  if (!user) return <LoginScreen onLogin={login} onRegister={register} />;

  if (!storageReady) return (
    <>
      <style>{CSS}</style>
      <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'var(--bg)'}}>
        <div style={{textAlign:'center'}}>
          <div className="spinner" style={{margin:'0 auto 16px'}}/>
          <div style={{fontFamily:'var(--font-head)',fontSize:14,color:'var(--text2)'}}>Chargement de tes paris…</div>
        </div>
      </div>
    </>
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
            <div className="header-pill" style={{cursor:'pointer'}} onClick={logout} title="Se déconnecter">
              {user} ↩
            </div>
          </div>
        </div>
        <div className="scroll-area">
          {tab==="upload" && <UploadTab addBet={addBet} setBets={setBets} bets={bets}/>}
          {tab==="bets" && <BetsTab bets={bets}/>}
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

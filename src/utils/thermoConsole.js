/**
 * ThermoConsole v3.1 — Pedra Seca Edition
 * Zero React. Zero Dependencies. Zero Mercy.
 */

class ThermoConsole {
  constructor() {
    if (window.__thermoConsole) return window.__thermoConsole;
    
    this.metrics = {
      vram: 0, nodes: 0, parse: 0, render: 0,
      fps: 60, longTasks: 0, cls: 0, lcp: 0,
      ict: 0, psi: 0, warmthFactor: 0, bureaucratic: 0, tcuCostMs: 0,
      ica: 0, heat: 0, joy: 0
    };
    
    this.history = {
      vram: new Float32Array(300),
      fps: new Uint8Array(300).fill(60),
      parse: new Float32Array(300),
      render: new Float32Array(300),
      ict: new Float32Array(300),
      psi: new Float32Array(300),
      ica: new Float32Array(300),
      heat: new Float32Array(300),
      joy: new Float32Array(300),
      index: 0
    };
    
    this.soulMode = false;
    
    this.lastFrameTime = performance.now();
    this.lastDrawTime = performance.now();
    this.frameCount = 0;
    this.isMinimized = false;
    this.isVisible = false;
    this.dpr = Math.min(window.devicePixelRatio, 2);
    
    this.init();
    window.__thermoConsole = this;
  }
  
  init() {
    this.container = document.createElement('div');
    this.container.id = 'thermo-console';
    this.container.style.cssText = `
      position: fixed;
      bottom: 16px;
      right: 16px;
      width: 420px;
      height: 280px;
      z-index: 2147483647;
      font-family: 'Noto Sans', 'SF Pro Display', system-ui, sans-serif;
      font-size: 12px;
      color: #FFFFFF;
      background: rgba(0, 0, 0, 0.94);
      border: 1px solid rgba(255, 115, 0, 0.3);
      border-radius: 28px;
      overflow: hidden;
      box-shadow: 
        0 12px 40px rgba(0, 0, 0, 0.6),
        0 0 0 1px rgba(255, 115, 0, 0.1),
        inset 0 0 80px rgba(0, 0, 0, 0.4);
      transition: height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      user-select: none;
      -webkit-user-select: none;
      display: none;
    `;
    
    const header = document.createElement('div');
    header.style.cssText = `
      height: 36px;
      background: rgba(255, 115, 0, 0.08);
      border-bottom: 1px solid rgba(255, 115, 0, 0.2);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
      cursor: pointer;
      letter-spacing: 2px;
    `;
    header.innerHTML = `
      <span style="font-weight: 900; font-size: 11px; color: #FF7300;">
        ◈ THERMO-CONSOLE <span style="opacity: 0.5; color: #FFFFFF;">v3.1</span>
      </span>
      <div>
        <span id="thermo-offline" title="Prova sense connexió (Simula mode Offline)" style="cursor: pointer; opacity: 0.8; font-size: 14px; margin-right: 12px; color: #0984E3;">✈️</span>
        <span id="thermo-stress" title="Prova d'estrès (Simula un telèfon antic / App pesada)" style="cursor: pointer; opacity: 0.8; font-size: 14px; margin-right: 12px; color: #FF7300;">⏳</span>
        <span id="thermo-toggle" style="cursor: pointer; opacity: 0.6; font-size: 16px; font-weight: bold; color: #FFFFFF;">−</span>
      </div>
    `;
    
    this.canvas = document.createElement('canvas');
    this.canvas.style.cssText = 'width: 100%; height: 244px; display: block;';
    this.canvas.width = 420 * this.dpr;
    this.canvas.height = 244 * this.dpr;
    
    this.container.appendChild(header);
    this.canvas.style.borderRadius = '0 0 28px 28px';
    this.container.appendChild(this.canvas);
    
    const portalRoot = document.getElementById('portal-root') || document.body;
    portalRoot.appendChild(this.container);
    
    this.ctx = this.canvas.getContext('2d');
    this.ctx.scale(this.dpr, this.dpr);
    
    header.addEventListener('click', (e) => {
      if (e.target.id === 'thermo-toggle') this.toggle();
      if (e.target.id === 'thermo-stress') this.toggleStress();
      if (e.target.id === 'thermo-offline') this.toggleOffline();
    });
    
    this.metricsHandler = (e) => {
      Object.assign(this.metrics, e.detail);
    };
    window.addEventListener('sdp-thermo-tick', this.metricsHandler);
    
    this.humanHeatHandler = (e) => {
      this.metrics.ica = e.detail.ica || 0;
      this.metrics.heat = e.detail.heat || 0;
      this.metrics.joy = e.detail.joy || 0;
    };
    window.addEventListener('sdp-human-heat-tick', this.humanHeatHandler);
    
    // Llei de Degradació: La UI rep les dades de forma aïllada via BroadcastChannel
    try {
      this.tcuChannel = new BroadcastChannel('sdp-thermo');
      this.tcuChannel.onmessage = (e) => {
        if (e.data.type === 'tcu-metrics') {
          this.metrics.ict = e.data.ict || 0;
          this.metrics.psi = e.data.psi || 0;
          this.metrics.warmthFactor = e.data.warmthFactor || 0;
          this.metrics.bureaucratic = e.data.bureaucratic || 0;
          this.metrics.tcuCostMs = e.data.costMs || 0;
        }
      };
    } catch (e) {
      // Llei de Degradació: silenci absolut
    }
    
    this.keyHandler = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 't') {
        e.preventDefault();
        this.isVisible = !this.isVisible;
        this.container.style.display = this.isVisible ? 'block' : 'none';
        
        if (this.isVisible && !this.rafId) {
          this.lastFrameTime = performance.now();
          this.loop();
        }
      }
      // Mode Ànima (Soul Mode) de Gemini
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        this.soulMode = !this.soulMode;
        const titleSpan = this.container.querySelector('span[style*="font-weight: 900"]');
        if (titleSpan) {
          titleSpan.innerHTML = this.soulMode 
            ? '◈ THERMO-CONSOLE <span style="opacity: 0.5; color: #FFFFFF;">SOUL MODE</span>'
            : '◈ THERMO-CONSOLE <span style="opacity: 0.5; color: #FFFFFF;">v3.1</span>';
        }
      }
    };
    document.addEventListener('keydown', this.keyHandler);
    
    this.loop();
  }
  
  destroy() {
    this.destroyed = true;
    if (this.rafId) cancelAnimationFrame(this.rafId);
    if (this.updateInterval) clearInterval(this.updateInterval);
    if (this.stressInterval) clearInterval(this.stressInterval);

    // 🛡️ Netejar offlineActive (Auditoria Vibe)
    if (this.offlineActive) {
      this.offlineActive = false;
      window.dispatchEvent(new Event('online'));
    }
    
    if (this.tcuChannel) this.tcuChannel.close();
    
    window.removeEventListener('sdp-thermo-tick', this.metricsHandler);
    window.removeEventListener('sdp-human-heat-tick', this.humanHeatHandler);
    document.removeEventListener('keydown', this.keyHandler);
    
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
    
    // Netejar la referència global
    if (window.__thermoConsole === this) {
      window.__thermoConsole = null;
    }
  }
  
  toggle() {
    if (this.destroyed) return;
    this.isMinimized = !this.isMinimized;
    this.container.style.height = this.isMinimized ? '36px' : '280px';
    this.canvas.style.display = this.isMinimized ? 'none' : 'block';
    const toggle = document.getElementById('thermo-toggle');
    if (toggle) toggle.textContent = this.isMinimized ? '+' : '−';
  }
  
  toggleStress() {
    if (this.destroyed) return;
    this.stressActive = !this.stressActive;
    const btn = document.getElementById('thermo-stress');
    if (btn) btn.style.opacity = this.stressActive ? '1' : '0.8';
    if (btn) btn.style.textShadow = this.stressActive ? '0 0 8px #FF7300' : 'none';
    
    if (this.stressActive) {
      // 🛡️ Usar requestIdleCallback per no penjar completament la UI (Auditoria Vibe)
      if ('requestIdleCallback' in window) {
        this.stressInterval = setInterval(() => {
          requestIdleCallback(() => {
            const start = performance.now();
            while (performance.now() - start < 16) { /* ~1 frame (16ms) */ }
          }, { timeout: 100 });
        }, 1000 / 30); // 30FPS
      } else {
        // Fallback per a navegadors antics
        this.stressInterval = setInterval(() => {
          const start = performance.now();
          while (performance.now() - start < 1) { /* Mínim bloqueig */ }
        }, 1000 / 30);
      }
    } else {
      if (this.stressInterval) {
        clearInterval(this.stressInterval);
        this.stressInterval = null;
      }
    }
  }

  toggleOffline() {
    if (this.destroyed) return;
    this.offlineActive = !this.offlineActive;
    const btn = document.getElementById('thermo-offline');
    if (btn) btn.style.opacity = this.offlineActive ? '1' : '0.8';
    if (btn) btn.style.textShadow = this.offlineActive ? '0 0 8px #0984E3' : 'none';
    
    // Dispara events natius per simular que es perd i es recupera la xarxa
    const event = new Event(this.offlineActive ? 'offline' : 'online');
    window.dispatchEvent(event);
    
    // Avisem per consola per al mode desenvolupador
    console.log(this.offlineActive ? '✈️ Mode Offline Simulat activat' : '🌐 Mode Online Simulat activat');
  }
  
  loop() {
    if (this.destroyed) return;
    if (!this.isVisible) {
      this.rafId = null;
      return;
    }
    
    this.rafId = requestAnimationFrame(() => this.loop());
    
    const now = performance.now();
    const delta = now - this.lastFrameTime;
    this.frameCount++;
    
    if (delta >= 1000) {
      this.metrics.fps = Math.round((this.frameCount * 1000) / delta);
      this.lastFrameTime = now;
      this.frameCount = 0;
    }
    
    // Circular buffer
    const i = this.history.index;
    this.history.vram[i] = this.metrics.vram;
    this.history.fps[i] = this.metrics.fps;
    this.history.parse[i] = this.metrics.parse;
    this.history.render[i] = this.metrics.render;
    this.history.ict[i] = this.metrics.ict;
    this.history.psi[i] = this.metrics.psi;
    this.history.ica[i] = this.metrics.ica;
    this.history.heat[i] = this.metrics.heat;
    this.history.joy[i] = this.metrics.joy;
    this.history.index = (i + 1) % 300;
    
    // Límit a ~30FPS de redibuix (33ms)
    if (!this.isMinimized && (now - this.lastDrawTime > 33)) {
      this.draw();
      this.lastDrawTime = now;
    }
  }
  
  draw() {
    if (this.destroyed) return;
    
    if (this.soulMode) {
      this.drawSoulMode();
      return;
    }
    
    const ctx = this.ctx;
    const w = 420;
    const h = 244;
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.98)';
    ctx.fillRect(0, 0, w, h);
    
    ctx.strokeStyle = 'rgba(255, 115, 0, 0.04)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x < w; x += 60) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += 30) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }
    
    this.drawWaveform(this.history.vram, '#FF7300', 100, 90, 80, 0.25);
    // FIX QWEN: Passem l'array sencer sense .map per evitar 72KB/s de garbage. drawWaveform ja fa el Math.min interns.
    this.drawWaveform(this.history.fps, '#0984E3', 120, 90, 80, 0.12);
    
    // 💓 FLATLINE EKG (Activitat de Renderitzat / Repòs Termodinàmic)
    this.drawWaveform(this.history.render, '#00DD88', 20, 150, 30, 0.4);
    
    const col1 = 18;
    const col2 = 150;
    const col3 = 290;
    let y = 26;
    
    ctx.font = 'bold 12px "Noto Sans", system-ui, sans-serif';
    ctx.textBaseline = 'middle';
    
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('VRAM', col1, y);
    ctx.fillText(`${this.metrics.vram.toFixed(1)} MB`, col2, y);
    const vramStatus = this.metrics.vram > 80 ? '⚠ CRÍTIC' : this.metrics.vram > 40 ? '◈ ALT' : '◉ ESTABLE';
    ctx.fillStyle = this.metrics.vram > 80 ? '#FF3333' : this.metrics.vram > 40 ? '#FF7300' : '#00DD88';
    ctx.fillText(vramStatus, col3, y);
    
    y += 22;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('NODES', col1, y);
    ctx.fillText(`${this.metrics.nodes}`, col2, y);
    const nodeStatus = this.metrics.nodes > 1500 ? '⚠ EXCÉS' : '◉ OPTIMAL';
    ctx.fillStyle = this.metrics.nodes > 1500 ? '#FF3333' : '#00DD88';
    ctx.fillText(nodeStatus, col3, y);
    
    y += 22;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('PARSE', col1, y);
    ctx.fillText(`${this.metrics.parse.toFixed(1)} ms`, col2, y);
    
    y += 22;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('RENDER', col1, y);
    ctx.fillText(`${this.metrics.render.toFixed(1)} ms`, col2, y);
    
    y += 22;
    ctx.fillStyle = this.metrics.fps < 30 ? '#FF3333' : '#FFFFFF';
    ctx.fillText('FPS', col1, y);
    ctx.fillText(`${this.metrics.fps}`, col2, y);
    const fpsStatus = this.metrics.fps < 30 ? '⚠ BAIX' : this.metrics.fps >= 55 ? '◉ FLUID' : '◈ OK';
    ctx.fillStyle = this.metrics.fps < 30 ? '#FF3333' : this.metrics.fps >= 55 ? '#00DD88' : '#FF7300';
    ctx.fillText(fpsStatus, col3, y);
    
    // 🌍 ÍNDEX ESG I HEALTH SCORE (Màrqueting)
    let health = 100 - (this.metrics.vram * 0.8) - (this.metrics.nodes / 30);
    health = Math.max(0, Math.min(100, health));
    
    ctx.fillStyle = health > 85 ? '#00DD88' : health > 60 ? '#FF7300' : '#FF3333';
    ctx.font = 'bold 32px "Noto Sans", system-ui, sans-serif';
    ctx.fillText(Math.round(health), 350, 48);
    ctx.font = 'bold 9px "Noto Sans", system-ui, sans-serif';
    ctx.fillText('HEALTH SCORE', 345, 70);

    // HUMAN HEAT INDEX (ICA, HEAT, JOY)
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 10px "Noto Sans", system-ui, sans-serif';
    ctx.fillText('ICA (FOCUS)', 320, 100);
    ctx.fillStyle = this.metrics.ica > 70 ? '#FF3333' : '#00DD88';
    ctx.fillText(`${Math.round(this.metrics.ica)}%`, 385, 100);

    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('HUMAN HEAT', 320, 115);
    ctx.fillStyle = this.metrics.heat > 50 ? '#FF7300' : '#00DD88';
    ctx.fillText(`${Math.round(this.metrics.heat)}%`, 385, 115);

    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('GAUDI / FLOW', 320, 130);
    ctx.fillStyle = this.metrics.joy > 70 ? '#00DD88' : '#FF7300';
    ctx.fillText(`${Math.round(this.metrics.joy)}%`, 385, 130);
    
    const wattsSaved = Math.max(0, (1500 - this.metrics.nodes) * 0.0003).toFixed(3);
    ctx.fillStyle = '#00DD88';
    ctx.font = 'bold 10px "Noto Sans", system-ui, sans-serif';
    ctx.fillText(`🌱 ${wattsSaved}W ESTALVIATS`, col3 - 40, 216);
    
    const barY = 226;
    const barW = 384;
    const barH = 8;
    const vramPct = Math.min(this.metrics.vram / 100, 1);
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(col1, barY, barW, barH, 6);
    else ctx.rect(col1, barY, barW, barH);
    ctx.fill();
    
    const barColor = this.metrics.vram > 80 ? '#FF3333' : '#FF7300';
    ctx.fillStyle = barColor;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(col1, barY, barW * vramPct, barH, 6);
    else ctx.rect(col1, barY, barW * vramPct, barH);
    ctx.fill();
    
    ctx.shadowColor = barColor;
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.shadowBlur = 0;
    
    ctx.fillStyle = 'rgba(255, 115, 0, 0.3)';
    ctx.fillRect(0, 0, w, 1);
    
    ctx.fillStyle = 'rgba(255, 115, 0, 0.015)';
    const scanY = (performance.now() / 25) % h;
    ctx.fillRect(0, scanY, w, 2);
  }
  
  drawWaveform(dataArray, color, maxVal, yOffset, height, glowIntensity) {
    const ctx = this.ctx;
    const w = 420;
    const step = w / 300;
    const currentIndex = this.history.index;
    
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    
    for (let i = 0; i < 300; i++) {
      const realIndex = (currentIndex + i) % 300;
      const val = dataArray[realIndex] || 0;
      const x = i * step;
      const normalized = Math.min(val / maxVal, 1);
      const y = yOffset + height - (normalized * height);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    
    ctx.stroke();
    
    ctx.shadowColor = color;
    ctx.shadowBlur = 6;
    ctx.stroke();
    ctx.shadowBlur = 0;
    
    const alpha = Math.round(glowIntensity * 255).toString(16).padStart(2, '0');
    ctx.fillStyle = color + alpha;
    ctx.beginPath();
    ctx.moveTo(0, yOffset + height);
    for (let i = 0; i < 300; i++) {
      const realIndex = (currentIndex + i) % 300;
      const val = dataArray[realIndex] || 0;
      const x = i * step;
      const normalized = Math.min(val / maxVal, 1);
      const y = yOffset + height - (normalized * height);
      ctx.lineTo(x, y);
    }
    ctx.lineTo(w, yOffset + height);
    ctx.closePath();
    ctx.fill();
  }

  drawSoulMode() {
    const ctx = this.ctx;
    const w = 420;
    const h = 244;
    
    // Background and grid for Soul Mode
    ctx.fillStyle = 'rgba(0, 0, 0, 0.98)';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(0, 221, 136, 0.04)'; // Green organic grid
    ctx.lineWidth = 0.5;
    for (let x = 0; x < w; x += 60) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }
    for (let y = 0; y < h; y += 30) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }
    
    // Waveforms: ICT (Empathy) and PSI (Cognitive Load)
    this.drawWaveform(this.history.ict, '#0984E3', 100, 90, 80, 0.25); // Blau per l'empatia
    this.drawWaveform(this.history.psi, '#FF3333', 100, 150, 40, 0.4); // Roig per la fricció
    
    const col1 = 18;
    const col2 = 180;
    const col3 = 290;
    let y = 26;
    
    ctx.font = 'bold 12px "Noto Sans", system-ui, sans-serif';
    ctx.textBaseline = 'middle';
    
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('LANGUAGE PULSE (ICT)', col1, y);
    ctx.fillText(`${this.metrics.ict.toFixed(1)}`, col2, y);
    const ictStatus = this.metrics.ict > 70 ? '◉ EXCEL·LENT' : this.metrics.ict > 40 ? '◈ MITJÀ' : '⚠ BAIX';
    ctx.fillStyle = this.metrics.ict > 70 ? '#00DD88' : this.metrics.ict > 40 ? '#FF7300' : '#FF3333';
    ctx.fillText(ictStatus, col3, y);
    
    y += 22;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('FRICCIÓ COGNITIVA (Ψ)', col1, y);
    ctx.fillText(`${this.metrics.psi.toFixed(1)}`, col2, y);
    const psiStatus = this.metrics.psi > 50 ? '⚠ ESTRÈS' : '◉ LAMINAR';
    ctx.fillStyle = this.metrics.psi > 50 ? '#FF3333' : '#00DD88';
    ctx.fillText(psiStatus, col3, y);
    
    y += 22;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('DENSITAT BUROCRÀTICA', col1, y);
    ctx.fillText(`${this.metrics.bureaucratic.toFixed(1)}`, col2, y);
    
    y += 22;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('WARMTH FACTOR', col1, y);
    ctx.fillText(`${this.metrics.warmthFactor}`, col2, y);
    
    y += 22;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('TCU OVERHEAD', col1, y);
    ctx.fillText(`${this.metrics.tcuCostMs.toFixed(2)} ms`, col2, y);
    const costStatus = this.metrics.tcuCostMs > 1 ? '⚠ PRESSUPOST SUPERAT' : '◉ DINS LÍMIT';
    ctx.fillStyle = this.metrics.tcuCostMs > 1 ? '#FF3333' : '#00DD88';
    ctx.fillText(costStatus, col3, y);
    
    // Scanline orgànic
    ctx.fillStyle = 'rgba(0, 221, 136, 0.015)';
    const scanY = (performance.now() / 25) % h;
    ctx.fillRect(0, scanY, w, 2);
  }
}

export const initThermoConsole = () => new ThermoConsole();

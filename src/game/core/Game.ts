//Core
import { Input } from "@/game/input/Input";
import { buildMaps } from "@/game/map/Maps";
import { Player } from "@/game/player/Player";
import { clamp, nowMs } from "@/game/util/MathUtil";
import { Rect } from "@/game/util/Rect";
import type { Interactable } from "@/game/objects/Interact";
import type { MapId } from "@/game/save/SaveLoad";
import type { QuizId } from "@/data/questions";
import { ConfettiSystem } from "@/game/vfx/Confetti";

export type GameCallbacks = {
  onRequestFlipbook: (flipbookId: string, title: string) => void;
  onRequestQuiz: (quizId: QuizId, title: string) => void;
  onRequestFrame: (frameId: string, title: string) => void;
  onTogglePause: (paused: boolean) => void;
  onSfxMoveStep: () => void;
  onSfxInteract: () => void;
  onSfxDoor: () => void;
};

export type GameInit = {
  canvas: HTMLCanvasElement;
  mapId: MapId;
  px: number;
  py: number;
  callbacks: GameCallbacks;
};

export class Game {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private dpr = 1;
  private viewW = 1280;
  private viewH = 720;

  private input = new Input();
  private player = new Player();
  private maps = buildMaps();
  private mapId: MapId;

  private hardPaused = false;
  private softPaused = false;
  private rafId = 0;

  private lastMs = 0;
  private acc = 0;
  private readonly fixedDt = 1 / 60;

  private camX = 0;
  private camY = 0;

  private interactProbe = new Rect();
  private nearest: Interactable | null = null;

  private confetti = new ConfettiSystem();

  private callbacks: GameCallbacks;

  // Visual constants (Design_Prompt)
  private readonly WALL_TOP_H = 110;
  private readonly WALL_BOTTOM_H = 96;

  constructor(init: GameInit) {
    this.canvas = init.canvas;
    const ctx = this.canvas.getContext("2d", { alpha: false, desynchronized: true });
    if (!ctx) throw new Error("Canvas 2D not supported");
    this.ctx = ctx;
    this.callbacks = init.callbacks;

    this.mapId = init.mapId;
    this.player.setSpawn(init.px, init.py);

    window.addEventListener("keydown", this.input.onKeyDown, { passive: true });
    window.addEventListener("keyup", this.input.onKeyUp, { passive: true });
    document.addEventListener("visibilitychange", this.onVisibility, { passive: true });
  }

  destroy() {
    this.stop();
    window.removeEventListener("keydown", this.input.onKeyDown);
    window.removeEventListener("keyup", this.input.onKeyUp);
    document.removeEventListener("visibilitychange", this.onVisibility);
  }

  start() {
    if (this.rafId) return;
    this.lastMs = nowMs();
    const loop = () => {
      this.rafId = requestAnimationFrame(loop);
      const ms = nowMs();
      let dt = (ms - this.lastMs) / 1000;
      this.lastMs = ms;

      // avoid spiral-of-death
      dt = Math.min(dt, 0.1);

      this.acc += dt;
      while (this.acc >= this.fixedDt) {
        this.update(this.fixedDt);
        this.acc -= this.fixedDt;
      }

      this.render();
      this.input.endFrame();
    };
    this.rafId = requestAnimationFrame(loop);
  }

  stop() {
    if (!this.rafId) return;
    cancelAnimationFrame(this.rafId);
    this.rafId = 0;
  }

  setPaused(paused: boolean) {
    this.softPaused = paused;
  }

  setHardPaused(paused: boolean) {
    this.hardPaused = paused;
    if (!paused) this.acc = 0;
  }

  isHardPaused() {
    return this.hardPaused;
  }

  isPaused() {
    return this.hardPaused || this.softPaused;
  }

  setViewport(cssW: number, cssH: number, dpr: number) {
    this.dpr = dpr;
    this.viewW = Math.max(1, cssW);
    this.viewH = Math.max(1, cssH);
    this.canvas.width = Math.floor(cssW * dpr);
    this.canvas.height = Math.floor(cssH * dpr);
    this.canvas.style.width = `${cssW}px`;
    this.canvas.style.height = `${cssH}px`;
  }

  getState() {
    return {
      mapId: this.mapId,
      px: this.player.pos.x,
      py: this.player.pos.y,
    };
  }

  setState(mapId: MapId, px: number, py: number) {
    this.mapId = mapId;
    this.player.setSpawn(px, py);
  }

  advanceMap() {
    if (this.mapId === 1) {
      this.mapId = 2;
      this.player.setSpawn(140, 360);
      this.confetti.burst(this.player.pos.x + 120, this.player.pos.y - 40, 60);
      return;
    }
    if (this.mapId === 2) {
      this.mapId = 3;
      this.player.setSpawn(140, 360);
      this.confetti.burst(this.player.pos.x + 120, this.player.pos.y - 40, 70);
      return;
    }
  }

  retreatMap() {
    // Only allow going back to already-cleared maps.
    if (this.mapId === 2) {
      this.mapId = 1;
    } else if (this.mapId === 3) {
      this.mapId = 2;
    } else {
      return;
    }

    const map = this.maps[this.mapId];
    // Spawn near the right edge (but not inside the door/stage obstacle).
    this.player.setSpawn(map.width - 260, map.height * 0.5);
  }

  burstCelebration() {
    this.confetti.burst(this.player.pos.x + 90, this.player.pos.y - 60, 140);
  }

  private onVisibility = () => {
    if (document.hidden) {
      this.hardPaused = true;
      this.callbacks.onTogglePause(true);
    }
  };

  private update(dt: number) {
    const map = this.maps[this.mapId];

    if (this.input.wasPressed("Escape")) {
      this.hardPaused = !this.hardPaused;
      this.callbacks.onTogglePause(this.hardPaused);
      return;
    }

    if (this.isPaused()) {
      return;
    }

    this.player.update(
      dt,
      this.input,
      { w: map.width, h: map.height },
      map.obstacles,
      this.callbacks.onSfxMoveStep,
    );
    this.findNearestInteractable(map.interactables);

    if (this.nearest && this.input.wasPressed("KeyE")) {
      if (this.nearest.type === "exhibit" && this.nearest.flipbookId) {
        this.callbacks.onSfxInteract();
        this.callbacks.onRequestFlipbook(this.nearest.flipbookId, this.nearest.title);
      }
      if ((this.nearest.type === "door" || this.nearest.type === "stage") && this.nearest.quizId) {
        this.callbacks.onSfxDoor();
        this.callbacks.onRequestQuiz(this.nearest.quizId, this.nearest.title);
      }
      if (this.nearest.type === "frame") {
        this.callbacks.onSfxInteract();
        this.callbacks.onRequestFrame(this.nearest.id, this.nearest.title);
      }
    }

    this.confetti.update(dt);
  }

  private findNearestInteractable(list: Interactable[]) {
    // probe area slightly bigger than player
    this.player.getAabb(this.interactProbe);
    this.interactProbe.x -= 18;
    this.interactProbe.y -= 12;
    this.interactProbe.w += 36;
    this.interactProbe.h += 24;

    let best: Interactable | null = null;
    let bestD = 1e9;
    for (let i = 0; i < list.length; i++) {
      const it = list[i];
      if (!this.interactProbe.intersects(it.rect)) continue;
      const cx = it.rect.x + it.rect.w * 0.5;
      const cy = it.rect.y + it.rect.h * 0.5;
      const dx = cx - this.player.pos.x;
      const dy = cy - this.player.pos.y;
      const d = dx * dx + dy * dy;
      if (d < bestD) {
        bestD = d;
        best = it;
      }
    }
    this.nearest = best;
  }

  private updateCamera() {
    const map = this.maps[this.mapId];
    const maxX = Math.max(0, map.width - this.viewW);
    const maxY = Math.max(0, map.height - this.viewH);
    this.camX = clamp(this.player.pos.x - this.viewW * 0.5, 0, maxX);
    this.camY = clamp(this.player.pos.y - this.viewH * 0.5, 0, maxY);
  }

  private render() {
    this.updateCamera();

    const ctx = this.ctx;
    const s = this.dpr;

    ctx.setTransform(s, 0, 0, s, 0, 0);
    ctx.imageSmoothingEnabled = false;

    // Screen-space backdrop to ensure the whole viewport is filled
    // even when the map is smaller than the viewport.
    this.drawScreenBackdrop(ctx);

    ctx.save();
    ctx.translate(-this.camX, -this.camY);

    this.drawMuseum(ctx);
    this.drawInteractables(ctx);
    this.drawPlayer(ctx);

    this.confetti.draw(ctx, 0, 0);

    ctx.restore();

    this.drawVignette(ctx);

    this.drawHUD(ctx);
  }

  private drawScreenBackdrop(ctx: CanvasRenderingContext2D) {
    // base floor tone
    ctx.fillStyle = "#d9dee7";
    ctx.fillRect(0, 0, this.viewW, this.viewH);

    // subtle tile grid
    ctx.globalAlpha = 0.12;
    ctx.strokeStyle = "#c5cbd6";
    ctx.lineWidth = 1;
    const step = 56;
    for (let x = 0; x <= this.viewW; x += step) {
      ctx.beginPath();
      ctx.moveTo(x + 0.5, 0);
      ctx.lineTo(x + 0.5, this.viewH);
      ctx.stroke();
    }
    for (let y = 0; y <= this.viewH; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(this.viewW, y + 0.5);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  private drawVignette(ctx: CanvasRenderingContext2D) {
    const g = ctx.createRadialGradient(
      this.viewW * 0.5,
      this.viewH * 0.45,
      Math.min(this.viewW, this.viewH) * 0.2,
      this.viewW * 0.5,
      this.viewH * 0.5,
      Math.max(this.viewW, this.viewH) * 0.72,
    );
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(1, "rgba(0,0,0,0.18)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, this.viewW, this.viewH);
  }

  private drawMuseum(ctx: CanvasRenderingContext2D) {
    const map = this.maps[this.mapId];

    const wallTopH = this.WALL_TOP_H;
    const wallBotH = this.WALL_BOTTOM_H;
    const floorY0 = wallTopH;
    // If viewport is taller than the map (e.g. portrait screens), push the bottom wall
    // down to the visible bottom so it doesn't appear "floating" above the screen edge.
    const visibleBottomY = this.camY + this.viewH;
    const bottomWallY = Math.max(map.height - wallBotH, visibleBottomY - wallBotH);
    const floorY1 = bottomWallY;

    // walls (be / xám nhạt)
    ctx.fillStyle = "#e7e1d6";
    ctx.fillRect(0, 0, map.width, wallTopH);
    ctx.fillStyle = "#e7e1d6";
    ctx.fillRect(0, bottomWallY, map.width, wallBotH);

    // wall shadows
    ctx.fillStyle = "rgba(0,0,0,0.06)";
    ctx.fillRect(0, wallTopH - 10, map.width, 10);
    ctx.fillRect(0, bottomWallY, map.width, 10);

    // floor (đá sáng)
    ctx.fillStyle = "#d9dee7";
    ctx.fillRect(0, floorY0, map.width, floorY1 - floorY0);

    // stone tile grid (subtle)
    ctx.globalAlpha = 0.18;
    ctx.strokeStyle = "#c5cbd6";
    ctx.lineWidth = 1;
    for (let x = 0; x <= map.width; x += 56) {
      ctx.beginPath();
      ctx.moveTo(x + 0.5, floorY0);
      ctx.lineTo(x + 0.5, floorY1);
      ctx.stroke();
    }
    for (let y = floorY0; y <= floorY1; y += 56) {
      ctx.beginPath();
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(map.width, y + 0.5);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // red carpet (center)
    const cy = map.height * 0.5;
    ctx.fillStyle = "#8e1f33";
    ctx.fillRect(0, cy - 52, map.width, 104);
    ctx.fillStyle = "#d8c08a";
    ctx.fillRect(0, cy - 56, map.width, 4);
    ctx.fillRect(0, cy + 52, map.width, 4);

    // carpet subtle texture
    ctx.globalAlpha = 0.08;
    ctx.fillStyle = "#ffffff";
    for (let x = 0; x < map.width; x += 22) {
      ctx.fillRect(x, cy - 50, 10, 2);
      ctx.fillRect(x + 8, cy + 48, 10, 2);
    }
    ctx.globalAlpha = 1;

    // abstract wall decor: small frames + motifs (top & bottom)
    this.drawWallGallery(ctx, map.width, 0, wallTopH, this.mapId);
    this.drawWallGallery(ctx, map.width, map.height - wallBotH, wallBotH, this.mapId);

    // map3 wall frames
    if (map.wallFrames.length) {
      const time = nowMs() / 1000;
      for (const f of map.wallFrames) {
        const isNear = this.nearest?.id === f.id;
        const pulse = isNear ? 0.5 + 0.5 * Math.sin(time * 6.0) : 0;

        // keep the two large frames readable (not covered by exhibits)
        ctx.fillStyle = "rgba(0,0,0,0.08)";
        ctx.fillRect(f.x - 10, f.y - 8, f.w + 20, f.h + 26);
        ctx.fillStyle = "#1f2937";
        ctx.fillRect(f.x, f.y, f.w, f.h);
        ctx.strokeStyle = isNear ? `rgba(216,192,138,${0.55 + pulse * 0.25})` : "#d8c08a";
        ctx.lineWidth = isNear ? 5 : 4;
        ctx.strokeRect(f.x, f.y, f.w, f.h);

        // inner abstract
        ctx.globalAlpha = 0.22;
        ctx.fillStyle = "#93c5fd";
        ctx.beginPath();
        ctx.arc(f.x + f.w * 0.3, f.y + f.h * 0.45, 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#d8c08a";
        ctx.fillRect(f.x + f.w * 0.52, f.y + f.h * 0.28, 90, 10);
        ctx.fillRect(f.x + f.w * 0.52, f.y + f.h * 0.52, 120, 10);
        ctx.globalAlpha = 1;

        ctx.fillStyle = "#334155";
        ctx.font = "16px system-ui";
        ctx.fillText(f.title, f.x + 14, f.y + f.h + 22);
      }
    }
  }

  private drawWallGallery(
    ctx: CanvasRenderingContext2D,
    width: number,
    y0: number,
    h: number,
    mapId: MapId,
  ) {
    const padX = 90;
    const frameW = 120;
    const frameH = 46;
    const gap = 220;

    const baseY = y0 + Math.floor(h * 0.28);

    for (let x = padX; x < width - padX; x += gap) {
      // Map 3: reserve the top wall area for the two big frames.
      if (mapId === 3 && y0 === 0 && x > 560 && x < 1840) continue;

      // small frame
      ctx.fillStyle = "rgba(0,0,0,0.10)";
      ctx.fillRect(x - 8, baseY - 6, frameW + 16, frameH + 12);
      ctx.fillStyle = "#f1f5f9";
      ctx.fillRect(x, baseY, frameW, frameH);
      ctx.strokeStyle = "#d8c08a";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, baseY, frameW, frameH);

      // abstract inside (no national icon)
      ctx.globalAlpha = 0.55;
      ctx.strokeStyle = mapId === 2 ? "#64748b" : "#475569";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x + 14, baseY + 28);
      ctx.lineTo(x + 44, baseY + 14);
      ctx.lineTo(x + 74, baseY + 30);
      ctx.lineTo(x + 104, baseY + 18);
      ctx.stroke();
      ctx.globalAlpha = 1;

      // small motif beside frame
      ctx.globalAlpha = 0.35;
      ctx.fillStyle = mapId === 1 ? "#94a3b8" : mapId === 2 ? "#60a5fa" : "#d8c08a";
      ctx.beginPath();
      ctx.arc(x + frameW + 40, baseY + frameH * 0.5, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  private drawInteractables(ctx: CanvasRenderingContext2D) {
    const map = this.maps[this.mapId];
    const time = nowMs() / 1000;

    for (const it of map.interactables) {
      const isNear = this.nearest?.id === it.id;
      const pulse = isNear ? 0.5 + 0.5 * Math.sin(time * 6.0) : 0;

      if (it.type === "exhibit") {
        this.drawExhibit(ctx, it.rect.x, it.rect.y, it.rect.w, it.rect.h, it.flipbookId ?? "", isNear, pulse);

        // label (neutral, academic)
        ctx.fillStyle = "#334155";
        ctx.font = "14px system-ui";
        ctx.fillText(it.title, it.rect.x - 10, it.rect.y - 10);
      } else if (it.type === "door") {
        this.drawDoor(ctx, it.rect.x, it.rect.y, it.rect.w, it.rect.h, isNear, pulse);
        ctx.fillStyle = "#334155";
        ctx.font = "16px system-ui";
        ctx.fillText("CỬA", it.rect.x + 18, it.rect.y - 10);
      } else {
        this.drawStage(ctx, it.rect.x, it.rect.y, it.rect.w, it.rect.h, isNear, pulse);
        ctx.fillStyle = "#334155";
        ctx.font = "16px system-ui";
        ctx.fillText("SÂN KHẤU", it.rect.x - 10, it.rect.y - 10);
      }
    }
  }

  private drawExhibit(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    flipbookId: string,
    isNear: boolean,
    pulse01: number,
  ) {
    // Isometric-ish pedestal: top face + right/ bottom faces
    const topH = 18;

    // shadow
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.ellipse(x + w * 0.5, y + h + 14, w * 0.55, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // top slab
    ctx.fillStyle = "#9aa3b2";
    ctx.fillRect(x, y, w, topH);
    ctx.fillStyle = "#6b7280";
    ctx.fillRect(x, y + topH, w, h - topH);

    // highlight edge (top)
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + 2, y + 2);
    ctx.lineTo(x + w - 2, y + 2);
    ctx.stroke();

    // inner dark base (display area)
    ctx.fillStyle = "#1f2937";
    ctx.fillRect(x + 10, y + topH + 8, w - 20, h - topH - 16);

    // glass overlay
    const glassA = isNear ? 0.18 + pulse01 * 0.10 : 0.14;
    ctx.globalAlpha = glassA;
    ctx.fillStyle = "#93c5fd";
    ctx.fillRect(x + 6, y + 6, w - 12, h - 12);
    ctx.globalAlpha = 1;

    // glass border highlight
    if (isNear) {
      ctx.strokeStyle = `rgba(216,192,138,${0.45 + pulse01 * 0.25})`;
      ctx.lineWidth = 3;
      ctx.strokeRect(x + 5.5, y + 5.5, w - 11, h - 11);
    } else {
      ctx.strokeStyle = "rgba(148,163,184,0.22)";
      ctx.lineWidth = 2;
      ctx.strokeRect(x + 5.5, y + 5.5, w - 11, h - 11);
    }

    // diagonal glass shine
    ctx.globalAlpha = 0.18;
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + 12, y + 12);
    ctx.lineTo(x + w - 18, y + 22);
    ctx.stroke();
    ctx.globalAlpha = 1;

    // procedural icon inside
    this.drawExhibitIcon(ctx, flipbookId, x + 16, y + topH + 14, w - 32, h - topH - 28);
  }

  private drawExhibitIcon(
    ctx: CanvasRenderingContext2D,
    flipbookId: string,
    x: number,
    y: number,
    w: number,
    h: number,
  ) {
    // All primitives, abstract (no flags/portraits)
    ctx.save();
    ctx.translate(x, y);

    const cx = w * 0.5;
    const cy = h * 0.5;

    const ink = "rgba(216,192,138,0.85)";
    const sky = "rgba(147,197,253,0.75)";
    const line = "rgba(226,232,240,0.55)";

    if (flipbookId.includes("dan-chu") || flipbookId.includes("tham-gia")) {
      // circle-of-people motif
      ctx.strokeStyle = sky;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, Math.min(w, h) * 0.28, 0, Math.PI * 2);
      ctx.stroke();
      ctx.fillStyle = ink;
      for (let i = 0; i < 7; i++) {
        const a = (i / 7) * Math.PI * 2;
        ctx.beginPath();
        ctx.arc(cx + Math.cos(a) * 22, cy + Math.sin(a) * 12, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (flipbookId.includes("phap-luat") || flipbookId.includes("phap-quyen")) {
      // law book motif
      ctx.fillStyle = sky;
      ctx.fillRect(cx - 18, cy - 16, 36, 32);
      ctx.fillStyle = "rgba(15,23,42,0.55)";
      ctx.fillRect(cx - 14, cy - 12, 28, 24);
      ctx.strokeStyle = ink;
      ctx.lineWidth = 2;
      ctx.strokeRect(cx - 18, cy - 16, 36, 32);
      ctx.strokeStyle = line;
      ctx.beginPath();
      ctx.moveTo(cx - 10, cy - 4);
      ctx.lineTo(cx + 10, cy - 4);
      ctx.moveTo(cx - 10, cy + 4);
      ctx.lineTo(cx + 10, cy + 4);
      ctx.stroke();
    } else if (flipbookId.includes("kiem-soat") || flipbookId.includes("cong-ly")) {
      // scale of justice motif
      ctx.strokeStyle = ink;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx, cy - 18);
      ctx.lineTo(cx, cy + 18);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx - 20, cy - 6);
      ctx.lineTo(cx + 20, cy - 6);
      ctx.stroke();
      ctx.fillStyle = sky;
      ctx.beginPath();
      ctx.arc(cx - 14, cy + 4, 8, 0, Math.PI);
      ctx.arc(cx + 14, cy + 4, 8, 0, Math.PI);
      ctx.fill();
    } else {
      // simple governance diagram: boxes + arrows
      ctx.fillStyle = sky;
      ctx.fillRect(cx - 34, cy - 10, 22, 18);
      ctx.fillRect(cx - 10, cy - 26, 22, 18);
      ctx.fillRect(cx + 14, cy - 10, 22, 18);
      ctx.strokeStyle = ink;
      ctx.lineWidth = 2;
      ctx.strokeRect(cx - 34, cy - 10, 22, 18);
      ctx.strokeRect(cx - 10, cy - 26, 22, 18);
      ctx.strokeRect(cx + 14, cy - 10, 22, 18);

      ctx.strokeStyle = line;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx - 12, cy - 4);
      ctx.lineTo(cx - 2, cy - 12);
      ctx.lineTo(cx + 12, cy - 4);
      ctx.stroke();
    }

    ctx.restore();
  }

  private drawDoor(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    isNear: boolean,
    pulse01: number,
  ) {
    // solemn door (neutral)
    const archR = w * 0.5;
    const archY = y + archR;

    // shadow
    ctx.globalAlpha = 0.14;
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.ellipse(x + w * 0.5, y + h + 12, w * 0.6, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // frame
    ctx.fillStyle = "#6b4f2c";
    ctx.fillRect(x - 6, y - 6, w + 12, h + 12);

    // door body
    ctx.fillStyle = "#a67c52";
    ctx.fillRect(x, y + archR, w, h - archR);

    // arch top
    ctx.beginPath();
    ctx.moveTo(x, archY);
    ctx.arc(x + w * 0.5, archY, archR, Math.PI, 0);
    ctx.closePath();
    ctx.fill();

    // inner panel
    ctx.fillStyle = "rgba(15,23,42,0.35)";
    ctx.fillRect(x + 10, y + archR + 14, w - 20, h - archR - 28);

    // knob
    ctx.fillStyle = "#1f2937";
    ctx.fillRect(x + w - 22, y + h * 0.58, 10, 12);

    // highlight
    if (isNear) {
      ctx.strokeStyle = `rgba(216,192,138,${0.55 + pulse01 * 0.25})`;
      ctx.lineWidth = 4;
      ctx.strokeRect(x - 5.5, y - 5.5, w + 11, h + 11);
    } else {
      ctx.strokeStyle = "rgba(216,192,138,0.25)";
      ctx.lineWidth = 3;
      ctx.strokeRect(x - 5.5, y - 5.5, w + 11, h + 11);
    }
  }

  private drawStage(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    isNear: boolean,
    pulse01: number,
  ) {
    // base platform
    ctx.fillStyle = "rgba(0,0,0,0.12)";
    ctx.fillRect(x - 38, y + h - 24, w + 76, 30);
    ctx.fillStyle = "#4b5563";
    ctx.fillRect(x - 30, y + h - 28, w + 60, 28);

    // lectern
    ctx.fillStyle = "#1f2937";
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = "rgba(255,255,255,0.10)";
    ctx.fillRect(x + 8, y + 10, w - 16, 14);

    // border
    ctx.strokeStyle = isNear
      ? `rgba(216,192,138,${0.55 + pulse01 * 0.25})`
      : "rgba(216,192,138,0.30)";
    ctx.lineWidth = 4;
    ctx.strokeRect(x - 0.5, y - 0.5, w + 1, h + 1);
  }

  private drawPlayer(ctx: CanvasRenderingContext2D) {
    const x = this.player.pos.x;
    const y = this.player.pos.y;

    const flipX = this.player.facing.x < 0 ? -1 : 1;

    // shadow
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.ellipse(x, y + 14, 16, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // flip whole character by facing (left/right only)
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(flipX, 1);

    // body capsule (top-down)
    const bodyL = 24;
    const bodyW = 18;
    const r = bodyW * 0.5;

    // outline
    ctx.fillStyle = "rgba(15,23,42,0.35)";
    ctx.beginPath();
    ctx.roundRect(-bodyL * 0.5 - 1.5, -bodyW * 0.5 - 1.5, bodyL + 3, bodyW + 3, r + 2);
    ctx.fill();

    // fill
    ctx.fillStyle = "#2563eb";
    ctx.beginPath();
    ctx.roundRect(-bodyL * 0.5, -bodyW * 0.5, bodyL, bodyW, r);
    ctx.fill();

    // subtle highlight stripe
    ctx.globalAlpha = 0.18;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.roundRect(-bodyL * 0.18, -bodyW * 0.35, bodyL * 0.22, bodyW * 0.7, 6);
    ctx.fill();
    ctx.globalAlpha = 1;

    // direction indicator ("face")
    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.arc(bodyL * 0.33, 0, 4.2, 0, Math.PI * 2);
    ctx.fill();

    // small backpack / accent
    ctx.globalAlpha = 0.8;
    ctx.fillStyle = "#1e293b";
    ctx.beginPath();
    ctx.roundRect(-bodyL * 0.42, -5.5, 7.5, 11, 4);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.restore();
  }

  private drawHUD(ctx: CanvasRenderingContext2D) {
    const map = this.maps[this.mapId];

    // top bar
    ctx.fillStyle = "rgba(255,255,255,0.66)";
    ctx.fillRect(16, 14, Math.min(860, this.viewW - 32), 66);

    ctx.fillStyle = "#0f172a";
    ctx.font = "18px system-ui";
    ctx.fillText(map.title, 30, 40);

    ctx.font = "14px system-ui";
    ctx.fillStyle = "#334155";
    ctx.fillText("Di chuyển: WASD/Phím mũi tên • Tương tác: E • Pause: Esc", 30, 62);

    // interact hint
    if (this.nearest) {
      ctx.fillStyle = "rgba(15,23,42,0.72)";
      const msg = `E: ${this.nearest.hint} — ${this.nearest.title}`;
      const pad = 12;
      ctx.font = "16px system-ui";
      const w = ctx.measureText(msg).width;
      const x = (this.viewW - (w + pad * 2)) * 0.5;
      const y = this.viewH - 64;
      ctx.fillRect(x, y, w + pad * 2, 42);
      ctx.fillStyle = "#f8fafc";
      ctx.fillText(msg, x + pad, y + 27);
    }

    // pause banner
    if (this.hardPaused) {
      ctx.fillStyle = "rgba(0,0,0,0.55)";
      ctx.fillRect(0, 0, this.viewW, this.viewH);
      ctx.fillStyle = "#f8fafc";
      ctx.font = "28px system-ui";
      ctx.fillText("PAUSE", this.viewW / 2 - 42, this.viewH / 2);
      ctx.font = "14px system-ui";
      ctx.fillStyle = "#cbd5e1";
      ctx.fillText("Nhấn Esc để tiếp tục", this.viewW / 2 - 70, this.viewH / 2 + 28);
    }
  }
}

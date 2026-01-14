"use client";

import React, { useEffect, useMemo, useRef } from "react";
import styles from "@/components/ui.module.css";

function drawFrameArt(ctx: CanvasRenderingContext2D, frameId: string, w: number, h: number) {
  ctx.clearRect(0, 0, w, h);

  // background
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, "#0f172a");
  g.addColorStop(1, "#1f2937");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // vignette
  const vg = ctx.createRadialGradient(w * 0.5, h * 0.45, Math.min(w, h) * 0.12, w * 0.5, h * 0.5, Math.max(w, h) * 0.65);
  vg.addColorStop(0, "rgba(0,0,0,0)");
  vg.addColorStop(1, "rgba(0,0,0,0.45)");
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, w, h);

  // gold frame line
  ctx.strokeStyle = "rgba(216,192,138,0.85)";
  ctx.lineWidth = 6;
  ctx.strokeRect(18, 18, w - 36, h - 36);

  // inner art (procedural, abstract)
  const ink = "rgba(216,192,138,0.9)";
  const sky = "rgba(147,197,253,0.85)";
  const mist = "rgba(226,232,240,0.55)";

  const seed = frameId.endsWith("1") ? 1 : 2;

  if (seed === 1) {
    // "Dân chủ" motif: concentric circles + nodes
    ctx.strokeStyle = sky;
    ctx.lineWidth = 4;
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(w * 0.48, h * 0.52, 70 + i * 44, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.fillStyle = ink;
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2;
      const r = 140;
      ctx.beginPath();
      ctx.arc(w * 0.48 + Math.cos(a) * r, h * 0.52 + Math.sin(a) * r * 0.65, 8, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.strokeStyle = mist;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(w * 0.22, h * 0.74);
    ctx.lineTo(w * 0.78, h * 0.34);
    ctx.stroke();
  } else {
    // "Pháp quyền" motif: pillars + scale-ish lines
    ctx.fillStyle = sky;
    const baseY = h * 0.72;
    for (let i = 0; i < 5; i++) {
      const x = w * 0.22 + i * 80;
      ctx.fillRect(x, baseY - 190, 26, 190);
    }

    ctx.strokeStyle = ink;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(w * 0.28, baseY - 140);
    ctx.lineTo(w * 0.72, baseY - 140);
    ctx.stroke();

    ctx.strokeStyle = mist;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(w * 0.5, baseY - 210);
    ctx.lineTo(w * 0.5, baseY - 40);
    ctx.stroke();

    ctx.fillStyle = ink;
    ctx.beginPath();
    ctx.arc(w * 0.5, baseY - 220, 10, 0, Math.PI * 2);
    ctx.fill();
  }

  // subtle noise lines
  ctx.globalAlpha = 0.08;
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 1;
  for (let i = 0; i < 18; i++) {
    const y = 30 + i * ((h - 60) / 18);
    ctx.beginPath();
    ctx.moveTo(30, y);
    ctx.lineTo(w - 30, y);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

export function FrameModal(props: {
  visible: boolean;
  frameId: string;
  title: string;
  onClose: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const open = props.visible;

  const dpr = useMemo(() => {
    if (typeof window === "undefined") return 1;
    return Math.max(1, Math.min(2.5, window.devicePixelRatio || 1));
  }, []);

  useEffect(() => {
    if (!open) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Fixed aspect "art" area (responsive via CSS)
    const cssW = 900;
    const cssH = 520;
    canvas.width = Math.floor(cssW * dpr);
    canvas.height = Math.floor(cssH * dpr);
    canvas.style.width = `${cssW}px`;
    canvas.style.height = `${cssH}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    drawFrameArt(ctx, props.frameId, cssW, cssH);
  }, [open, props.frameId, dpr]);

  if (!props.visible) return null;

  return (
    <div className={styles.root}>
      <div className={styles.backdrop} onClick={props.onClose} />
      <div className={styles.panel}>
        <div className={styles.header}>
          <div className={styles.title}>{props.title}</div>
          <button className={styles.close} onClick={props.onClose}>
            Đóng
          </button>
        </div>

        <div style={{ display: "grid", gap: 12 }}>
          <div className={styles.muted}>Ảnh phóng to (procedural) để xem rõ hơn.</div>
          <div style={{ width: "100%", overflow: "auto", borderRadius: 12 }}>
            <canvas ref={canvasRef} style={{ display: "block", maxWidth: "100%" }} />
          </div>
        </div>
      </div>
    </div>
  );
}

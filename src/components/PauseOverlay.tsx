"use client";

//UI
import React from "react";
import styles from "@/components/ui.module.css";
import type { VolumeState } from "@/game/audio/Audio";
import type { ScoreState } from "@/game/save/SaveLoad";

function fmtMs(ms: number) {
  const s = Math.max(0, Math.round(ms / 1000));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}

export function PauseOverlay(props: {
  visible: boolean;
  volume: VolumeState;
  score: ScoreState;
  onChangeVolume: (v: Partial<VolumeState>) => void;
  canBack: boolean;
  onBack: () => void;
  onResume: () => void;
  onShowHelp: () => void;
}) {
  if (!props.visible) return null;

  return (
    <div className={styles.root}>
      <div className={styles.backdrop} onClick={props.onResume} />
      <div className={styles.panel}>
        <div className={styles.header}>
          <div className={styles.title}>Pause</div>
          <button className={styles.close} onClick={props.onResume}>
            Resume (Esc)
          </button>
        </div>

        <div style={{ display: "grid", gap: 12 }}>
          <div>
            <div className={styles.muted} style={{ marginBottom: 6 }}>
              Volume
            </div>
            <div style={{ display: "grid", gap: 10 }}>
              <label style={{ display: "grid", gap: 6 }}>
                <span className={styles.muted}>Master: {Math.round(props.volume.master * 100)}%</span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={props.volume.master}
                  onChange={(e) => props.onChangeVolume({ master: Number(e.target.value) })}
                />
              </label>
              <label style={{ display: "grid", gap: 6 }}>
                <span className={styles.muted}>Music: {Math.round(props.volume.music * 100)}%</span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={props.volume.music}
                  onChange={(e) => props.onChangeVolume({ music: Number(e.target.value) })}
                />
              </label>
              <label style={{ display: "grid", gap: 6 }}>
                <span className={styles.muted}>SFX: {Math.round(props.volume.sfx * 100)}%</span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={props.volume.sfx}
                  onChange={(e) => props.onChangeVolume({ sfx: Number(e.target.value) })}
                />
              </label>
            </div>
          </div>

          <div className={styles.grid2}>
            <div>
              <div className={styles.muted}>Score phụ (map 1 + 2)</div>
              <div>Thời gian: {fmtMs(props.score.sideTotalTimeMs)}</div>
              <div>Lần thử: {props.score.sideAttempts}</div>
            </div>
            <div>
              <div className={styles.muted}>Score chính (tổng kết)</div>
              <div>Thời gian: {fmtMs(props.score.mainTotalTimeMs)}</div>
              <div>Lần thử: {props.score.mainAttempts}</div>
            </div>
          </div>

          <div className={styles.row}>
            <button className={styles.btn} onClick={props.onShowHelp}>
              Xem hướng dẫn
            </button>
            {props.canBack ? (
              <button className={styles.btn} onClick={props.onBack}>
                Quay lại màn trước
              </button>
            ) : null}
            <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={props.onResume}>
              Tiếp tục
            </button>
          </div>

          <div className={styles.muted}>
            Tip: Tab bị ẩn sẽ tự pause.
          </div>
        </div>
      </div>
    </div>
  );
}

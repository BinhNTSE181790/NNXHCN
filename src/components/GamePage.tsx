"use client";

//UI
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "@/app/page.module.css";
import { GameCanvas, type GameCanvasHandle } from "@/components/GameCanvas";
import { StartOverlay, type StartChoice } from "@/components/StartOverlay";
import { HelpModal } from "@/components/HelpModal";
import { PauseOverlay } from "@/components/PauseOverlay";
import { QuizModal } from "@/components/QuizModal";
import { FlipbookModal } from "@/components/FlipbookModal";

import { AudioSystem } from "@/game/audio/Audio";
import {
  clearSave,
  defaultSave,
  hasSave,
  loadSave,
  writeSave,
  type SaveStateV1,
} from "@/game/save/SaveLoad";
import { QUIZ_QUESTIONS, type QuizId } from "@/data/questions";

type ActiveQuiz = { quizId: QuizId; title: string; openId: number } | null;

function fmtMs(ms: number) {
  const s = Math.max(0, Math.round(ms / 1000));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}

async function postScore(payload: Record<string, unknown>) {
  const url = process.env.NEXT_PUBLIC_SHEETS_ENDPOINT;
  if (!url) return;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch {
    // best-effort
  }
}

export function GamePage() {
  const gameRef = useRef<GameCanvasHandle>(null);
  const audio = useMemo(() => new AudioSystem(), []);

  const [started, setStarted] = useState(false);
  const [save, setSave] = useState<SaveStateV1 | null>(() => loadSave());
  const [saveExists, setSaveExists] = useState(() => hasSave());

  const [paused, setPaused] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const [activeQuiz, setActiveQuiz] = useState<ActiveQuiz>(null);
  const [activeFlipbookId, setActiveFlipbookId] = useState<string | null>(null);

  const [endgame, setEndgame] = useState(false);

  const ensureAudio = useCallback(async () => {
    await audio.ensureStarted();
  }, [audio]);

  const syncSaveFromGame = useCallback(
    (base: SaveStateV1) => {
      const st = gameRef.current?.getState();
      if (!st) return base;
      const next: SaveStateV1 = { ...base, mapId: st.mapId, px: st.px, py: st.py };
      writeSave(next);
      setSave(next);
      setSaveExists(true);
      return next;
    },
    [setSave, setSaveExists],
  );

  const onChooseStart = useCallback(
    async (c: StartChoice) => {
      if (c.type === "reset") {
        clearSave();
        setSaveExists(false);
        setSave(null);
        return;
      }

      await ensureAudio();

      if (c.type === "continue") {
        const loaded = loadSave();
        const s = loaded ?? defaultSave("");
        writeSave(s);
        setSave(s);
        setStarted(true);
        setEndgame(false);
        setShowHelp(!s.helpShown);
        return;
      }

      // new
      clearSave();
      const s = defaultSave(c.playerName);
      writeSave(s);
      setSave(s);
      setStarted(true);
      setEndgame(false);
      setShowHelp(true);
    },
    [ensureAudio],
  );

  const callbacks = useMemo(
    () => ({
      onRequestFlipbook: (flipbookId: string, _title: string) => {
        void _title;
        setActiveFlipbookId(flipbookId);
      },
      onRequestQuiz: (quizId: QuizId, title: string) => {
        setActiveQuiz({ quizId, title, openId: Date.now() });
      },
      onTogglePause: (p: boolean) => {
        setPaused(p);
        if (p) audio.suspend();
        else audio.resume();
      },
      onSfxMoveStep: () => audio.playMoveStep(),
      onSfxInteract: () => audio.playInteract(),
      onSfxDoor: () => audio.playDoor(),
    }),
    [audio],
  );

  useEffect(() => {
    const shouldPause = paused || showHelp || !!activeQuiz || !!activeFlipbookId || endgame;
    gameRef.current?.setPaused(shouldPause);
  }, [paused, showHelp, activeQuiz, activeFlipbookId, endgame]);

  const closeFlipbook = useCallback(() => {
    setActiveFlipbookId(null);
  }, []);

  const closeQuiz = useCallback(() => {
    setActiveQuiz(null);
  }, []);

  const onQuizComplete = useCallback(
    async (res: { quizId: QuizId; totalTimeMs: number; attempts: number }) => {
      if (!save) {
        setActiveQuiz(null);
        return;
      }

      let next: SaveStateV1 = { ...save };
      next.completed = { ...next.completed, [res.quizId]: true };

      if (res.quizId === "map1" || res.quizId === "map2") {
        next.score = {
          ...next.score,
          sideTotalTimeMs: next.score.sideTotalTimeMs + res.totalTimeMs,
          sideAttempts: next.score.sideAttempts + res.attempts,
        };
      } else {
        next.score = {
          ...next.score,
          mainTotalTimeMs: next.score.mainTotalTimeMs + res.totalTimeMs,
          mainAttempts: next.score.mainAttempts + res.attempts,
        };
      }

      // close modal + advance
      setActiveQuiz(null);

      if (res.quizId === "map1" || res.quizId === "map2") {
        gameRef.current?.advanceMap();
        next = syncSaveFromGame(next);

        // report side score after finishing map2
        if (res.quizId === "map2") {
          await postScore({
            kind: "side",
            playerName: next.playerName,
            sideTotalTimeMs: next.score.sideTotalTimeMs,
            sideAttempts: next.score.sideAttempts,
            at: new Date().toISOString(),
          });
        }
      } else {
        gameRef.current?.burstCelebration();
        next = syncSaveFromGame(next);
        setEndgame(true);

        await postScore({
          kind: "main",
          playerName: next.playerName,
          mainTotalTimeMs: next.score.mainTotalTimeMs,
          mainAttempts: next.score.mainAttempts,
          at: new Date().toISOString(),
        });
      }

      writeSave(next);
      setSave(next);
      setSaveExists(true);
    },
    [save, syncSaveFromGame],
  );

  const onResume = useCallback(() => {
    setPaused(false);
    gameRef.current?.setHardPaused(false);
    audio.resume();
  }, [audio]);

  const onShowHelp = useCallback(() => {
    setShowHelp(true);
  }, []);

  const onCloseHelp = useCallback(() => {
    setShowHelp(false);
    if (!save) return;
    if (save.helpShown) return;
    const next = { ...save, helpShown: true };
    writeSave(next);
    setSave(next);
  }, [save]);

  const onRestart = useCallback(() => {
    clearSave();
    const s = defaultSave(save?.playerName ?? "");
    writeSave(s);
    setSave(s);
    setSaveExists(true);
    setEndgame(false);
    setPaused(false);
    setActiveQuiz(null);
    setActiveFlipbookId(null);
    gameRef.current?.setState(s.mapId, s.px, s.py);
  }, [save?.playerName]);

  const initial = save ?? defaultSave("");

  return (
    <div className={styles.shell}>
      <div className={styles.canvasWrap}>
        {started ? <GameCanvas ref={gameRef} initial={initial} callbacks={callbacks} /> : null}
      </div>

      <StartOverlay
        key={`${saveExists}-${save?.playerName ?? ""}`}
        visible={!started}
        hasSave={saveExists}
        defaultName={save?.playerName ?? ""}
        onChoose={onChooseStart}
      />

      <HelpModal visible={showHelp} onClose={onCloseHelp} />

      <PauseOverlay
        visible={paused}
        volume={audio.getVolume()}
        score={save?.score ?? initial.score}
        onChangeVolume={(v) => {
          audio.setVolume(v);
        }}
        onResume={onResume}
        onShowHelp={onShowHelp}
      />

      <FlipbookModal
        key={activeFlipbookId ?? "none"}
        visible={!!activeFlipbookId}
        flipbookId={activeFlipbookId ?? ""}
        onClose={closeFlipbook}
      />

      {activeQuiz ? (
        <QuizModal
          key={activeQuiz.openId}
          visible={true}
          quizId={activeQuiz.quizId}
          title={activeQuiz.title}
          questions={QUIZ_QUESTIONS[activeQuiz.quizId]}
          onClose={closeQuiz}
          onComplete={onQuizComplete}
        />
      ) : null}

      {endgame ? (
        <div className={styles.endWrap}>
          <div className={styles.endBackdrop} />
          <div className={styles.endPanel}>
            <div className={styles.endTitle}>Hoàn thành!</div>
            <div className={styles.endMuted}>
              Người chơi: <b>{save?.playerName}</b>
            </div>
            <div className={styles.endGrid}>
              <div>
                <div className={styles.endMuted}>Score phụ (map 1 + 2)</div>
                <div>Thời gian: {fmtMs(save?.score.sideTotalTimeMs ?? 0)}</div>
                <div>Lần thử: {save?.score.sideAttempts ?? 0}</div>
              </div>
              <div>
                <div className={styles.endMuted}>Score chính (tổng kết)</div>
                <div>Thời gian: {fmtMs(save?.score.mainTotalTimeMs ?? 0)}</div>
                <div>Lần thử: {save?.score.mainAttempts ?? 0}</div>
              </div>
            </div>

            <div className={styles.endRow}>
              <button className={styles.endBtn} onClick={() => setEndgame(false)}>
                Quay lại bảo tàng
              </button>
              <button className={styles.endBtnPrimary} onClick={onRestart}>
                Chơi lại từ đầu
              </button>
            </div>

            {!process.env.NEXT_PUBLIC_SHEETS_ENDPOINT ? (
              <div className={styles.endMuted}>
                (Chưa cấu hình Google Sheet webhook: đặt env `NEXT_PUBLIC_SHEETS_ENDPOINT` nếu cần thống kê.)
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

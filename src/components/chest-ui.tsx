
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/8bit/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/8bit/dialog";
import type { ChestResolutionReason } from "@/lib/type";

const SLOT_SYMBOLS = ["COIN", "STAR", "GEM", "BOLT", "LUCK", "x2"] as const;

interface ChestUiProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onResolve: (payload: { reason: ChestResolutionReason }) => Promise<void> | void;
}

const REEL_COUNT = 3;
const AUTO_CLOSE_MS = 45_000;

export default function ChestUi(props: ChestUiProps) {
  const { open, onOpenChange, onResolve } = props;
  const [reels, setReels] = useState<number[]>([0, 1, 2]);
  const [isRolling, setIsRolling] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [isResolving, setIsResolving] = useState(false);

  const reelTimersRef = useRef<Array<ReturnType<typeof setTimeout> | null>>(
    Array.from({ length: REEL_COUNT }, () => null),
  );
  const reelStoppedRef = useRef<boolean[]>(
    Array.from({ length: REEL_COUNT }, () => false),
  );
  const autoCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentSymbols = useMemo(
    () => reels.map((index) => SLOT_SYMBOLS[index % SLOT_SYMBOLS.length] ?? "COIN"),
    [reels],
  );

  const clearReelTimers = () => {
    for (let i = 0; i < REEL_COUNT; i++) {
      const timer = reelTimersRef.current[i];
      if (timer) {
        clearTimeout(timer);
        reelTimersRef.current[i] = null;
      }
    }
  };

  const clearAutoCloseTimers = () => {
    if (autoCloseTimerRef.current) {
      clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = null;
    }
  };

  const resetReels = () => {
    setReels([
      Math.floor(Math.random() * SLOT_SYMBOLS.length),
      Math.floor(Math.random() * SLOT_SYMBOLS.length),
      Math.floor(Math.random() * SLOT_SYMBOLS.length),
    ]);
  };

  const completeChest = async (reason: ChestResolutionReason) => {
    if (isResolving) return;

    setIsResolving(true);
    try {
      await onResolve({ reason });
    } finally {
      setIsResolving(false);
      onOpenChange(false);
    }
  };

  const startRolling = () => {
    if (isRolling) return;

    reelStoppedRef.current = Array.from({ length: REEL_COUNT }, () => false);
    setIsRolling(true);
    setIsStopping(false);

    for (let reelIndex = 0; reelIndex < REEL_COUNT; reelIndex++) {
      const tick = () => {
        setReels((prev) => {
          const next = [...prev];
          const current = prev[reelIndex] ?? 0;
          next[reelIndex] =
            (current + 1 + Math.floor(Math.random() * 2)) %
            SLOT_SYMBOLS.length;
          return next;
        });

        const nextDelay = 70 + Math.floor(Math.random() * (130 + reelIndex * 35));
        reelTimersRef.current[reelIndex] = setTimeout(tick, nextDelay);
      };

      tick();
    }
  };

  const stopRollingWithDeceleration = () => {
    if (!isRolling || isStopping) return;
    setIsStopping(true);

    for (let reelIndex = 0; reelIndex < REEL_COUNT; reelIndex++) {
      const timer = reelTimersRef.current[reelIndex];
      if (timer) {
        clearTimeout(timer);
        reelTimersRef.current[reelIndex] = null;
      }

      let delay = 90 + reelIndex * 25;
      let steps = 0;

      const decelerate = () => {
        steps += 1;
        setReels((prev) => {
          const next = [...prev];
          const current = prev[reelIndex] ?? 0;
          next[reelIndex] = (current + 1) % SLOT_SYMBOLS.length;
          return next;
        });

        delay = Math.min(delay + 38 + reelIndex * 8, 460);
        const shouldStop = steps >= 8 + reelIndex * 2 && delay >= 420;

        if (shouldStop) {
          reelStoppedRef.current[reelIndex] = true;
          reelTimersRef.current[reelIndex] = null;
          const allStopped = reelStoppedRef.current.every(Boolean);
          if (allStopped) {
            setIsRolling(false);
            setIsStopping(false);
            void completeChest("stopped");
          }
          return;
        }

        reelTimersRef.current[reelIndex] = setTimeout(decelerate, delay);
      };

      reelTimersRef.current[reelIndex] = setTimeout(decelerate, delay);
    }
  };

  useEffect(() => {
    if (!open) {
      clearReelTimers();
      clearAutoCloseTimers();
      setIsRolling(false);
      setIsStopping(false);
      return;
    }

    resetReels();
    autoCloseTimerRef.current = setTimeout(() => {
      clearReelTimers();
      setIsRolling(false);
      setIsStopping(false);
      void completeChest("timeout");
    }, AUTO_CLOSE_MS);

    return () => {
      clearReelTimers();
      clearAutoCloseTimers();
    };
    // biome-ignore lint/correctness/useExhaustiveDependencies: state transitions are controlled by explicit handlers
  }, [open]);

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chest Reward Machine</DialogTitle>
          <DialogDescription>
            Spin all three reels and stop to claim your chest reward.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-3 py-3">
          {currentSymbols.map((symbol, index) => (
            <div
              className="relative flex h-28 items-center justify-center border-foreground border-y-4 bg-background text-center"
              key={`chest-reel-${index}`}
            >
              <p className="font-bold font-jaro text-2xl text-yellow-200 md:text-3xl">
                {symbol}
              </p>
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -mx-1 border-foreground border-x-4"
              />
            </div>
          ))}
        </div>

        <DialogFooter className="flex w-full gap-3 sm:justify-between">
          <Button
            disabled={isRolling || isResolving}
            onClick={startRolling}
            type="button"
            variant="secondary"
          >
            Start
          </Button>
          <Button
            disabled={!isRolling || isStopping || isResolving}
            onClick={stopRollingWithDeceleration}
            type="button"
            variant="destructive"
          >
            Stop
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

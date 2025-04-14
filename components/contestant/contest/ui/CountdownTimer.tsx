"use client";

import { useEffect, useState } from "react";

interface CountdownProps {
  startedAt: Date | string; // Menerima Date atau string
  durationMinutes: number;
  onFinish: () => void;
}

export default function CountdownTimer({
  startedAt,
  durationMinutes,
  onFinish,
}: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    // Pastikan startedAt dikonversi menjadi Date
    const startDate = startedAt instanceof Date ? startedAt : new Date(startedAt);
    const startTime = startDate.getTime();
    const duration = durationMinutes * 60 * 1000;
    const endTime = startTime + duration;

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = endTime - now;

      if (diff <= 0) {
        setTimeLeft(0);
        onFinish();
        clearInterval(interval);
      } else {
        setTimeLeft(diff);
      }
    }, 1000);

    // Run once immediately
    const now = Date.now();
    const diff = endTime - now;
    if (diff <= 0) {
      setTimeLeft(0);
      onFinish();
      clearInterval(interval);
    } else {
      setTimeLeft(diff);
    }

    return () => clearInterval(interval);
  }, [startedAt, durationMinutes, onFinish]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <p className="text-base font-medium text-center">
      Waktu Tersisa: {formatTime(timeLeft)}
    </p>
  );
}
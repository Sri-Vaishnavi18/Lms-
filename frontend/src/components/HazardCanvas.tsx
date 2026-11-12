'use client';

import React, { useState, useRef } from 'react';
import { CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';

interface HazardTarget {
  id: string;
  name: string;
  xPercent: number;
  yPercent: number;
  radiusPercent: number;
  explanation: string;
}

interface HazardCanvasProps {
  imageUrl: string;
  targets: HazardTarget[];
  onComplete: (score: number, isPassed: boolean, taps: Array<{ xPercent: number; yPercent: number }>) => void;
}

export const HazardCanvas: React.FC<HazardCanvasProps> = ({
  imageUrl,
  targets,
  onComplete,
}) => {
  const [taps, setTaps] = useState<Array<{ xPercent: number; yPercent: number }>>([]);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState<any[]>([]);
  const [score, setScore] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (submitted) return;
    if (taps.length >= 5) {
      alert('Maximum 5 hazard markers placed. Tap Submit or Reset.');
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPercent = Math.round((x / rect.width) * 100);
    const yPercent = Math.round((y / rect.height) * 100);

    setTaps([...taps, { xPercent, yPercent }]);
  };

  const handleReset = () => {
    setTaps([]);
    setSubmitted(false);
    setFeedback([]);
  };

  const handleSubmit = () => {
    if (taps.length === 0) {
      alert('Please tap on at least one hazard before submitting!');
      return;
    }

    let hits = 0;
    const feedbackList = targets.map((target) => {
      const matched = taps.some((tap) => {
        const dist = Math.sqrt(
          Math.pow(tap.xPercent - target.xPercent, 2) + Math.pow(tap.yPercent - target.yPercent, 2)
        );
        return dist <= (target.radiusPercent || 15);
      });

      if (matched) hits += 1;
      return {
        ...target,
        hit: matched,
      };
    });

    const calculatedScore = Math.round((hits / targets.length) * 100);
    const isPassed = calculatedScore >= 66; // 2 out of 3 hits passes

    setScore(calculatedScore);
    setFeedback(feedbackList);
    setSubmitted(true);
    onComplete(calculatedScore, isPassed, taps);
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-xl mx-auto">
      <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg flex items-center justify-between text-sm text-amber-900 font-medium">
        <span className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600" />
          Tap on 3 safety hazards in this picture:
        </span>
        <span className="bg-amber-200 px-2 py-0.5 rounded text-xs font-bold">
          {taps.length} / {targets.length} Marked
        </span>
      </div>

      {/* Interactive image container */}
      <div
        onClick={handleImageClick}
        className="relative overflow-hidden rounded-xl border-2 border-slate-700 shadow-md cursor-crosshair select-none bg-slate-900"
      >
        <img
          ref={imgRef}
          src={imageUrl}
          alt="Spot the hazard"
          className="w-full h-auto object-cover block"
        />

        {/* User Tap Markers */}
        {taps.map((tap, index) => (
          <div
            key={index}
            style={{ left: `${tap.xPercent}%`, top: `${tap.yPercent}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          >
            <div className="w-8 h-8 rounded-full border-2 border-amber-400 bg-amber-500/50 flex items-center justify-center text-white text-xs font-bold animate-ping" />
            <div className="w-6 h-6 rounded-full bg-red-600 border border-white text-white text-xs font-bold flex items-center justify-center absolute top-1 left-1 shadow-lg">
              {index + 1}
            </div>
          </div>
        ))}

        {/* Revealed Targets after submit */}
        {submitted &&
          feedback.map((target, idx) => (
            <div
              key={`target-${idx}`}
              style={{ left: `${target.xPercent}%`, top: `${target.yPercent}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            >
              <div
                className={`w-14 h-14 rounded-full border-4 border-dashed flex items-center justify-center ${
                  target.hit ? 'border-green-400 bg-green-500/30' : 'border-red-400 bg-red-500/30'
                }`}
              />
            </div>
          ))}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {!submitted ? (
          <>
            <button
              onClick={handleReset}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-300 font-semibold text-slate-700 bg-white hover:bg-slate-50 flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Reset Taps
            </button>
            <button
              onClick={handleSubmit}
              className="flex-2 py-3 px-6 rounded-xl bg-blue-700 text-white font-bold hover:bg-blue-800 shadow-md text-base"
            >
              Check My Taps (Submit)
            </button>
          </>
        ) : (
          <button
            onClick={handleReset}
            className="w-full py-3 px-4 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-900 flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
        )}
      </div>

      {/* Feedback cards */}
      {submitted && (
        <div className="mt-2 flex flex-col gap-2">
          <div
            className={`p-4 rounded-xl border ${
              score >= 66 ? 'bg-green-50 border-green-300 text-green-900' : 'bg-red-50 border-red-300 text-red-900'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-lg">
              <CheckCircle2 className="w-6 h-6" />
              <span>Score: {score}% — {score >= 66 ? 'Passed! Good Eye! 🏆' : 'Needs Review 🔄'}</span>
            </div>
          </div>

          <div className="space-y-2 mt-2">
            {feedback.map((f, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg border text-sm flex gap-3 items-start ${
                  f.hit ? 'bg-green-50/50 border-green-200' : 'bg-amber-50/50 border-amber-200'
                }`}
              >
                <span className="text-lg">{f.hit ? '✅' : '⚠️'}</span>
                <div>
                  <div className="font-bold text-slate-800">{f.name}</div>
                  <div className="text-slate-600 text-xs mt-0.5">{f.explanation}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


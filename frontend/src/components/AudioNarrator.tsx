'use client';

import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface AudioNarratorProps {
  textToSpeak: string;
  language?: string; // 'en', 'hi', 'es'
  audioUrl?: string; // optional pre-recorded audio file
}

export const AudioNarrator: React.FC<AudioNarratorProps> = ({
  textToSpeak,
  language = 'en',
  audioUrl,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleSpeak = () => {
    if (typeof window === 'undefined') return;

    if (isPlaying) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
      return;
    }

    if (audioUrl) {
      const audio = new Audio(audioUrl);
      setIsPlaying(true);
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => {
        // Fallback to speech synthesis
        fallbackSpeech();
      };
      audio.play().catch(() => fallbackSpeech());
    } else {
      fallbackSpeech();
    }
  };

  const fallbackSpeech = () => {
    if (!('speechSynthesis' in window)) {
      alert('Audio narration not supported on this browser');
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = language === 'hi' ? 'hi-IN' : language === 'es' ? 'es-ES' : 'en-US';
    utterance.rate = 0.9; // Slightly slower for clear comprehension

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <button
      onClick={handleSpeak}
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-full font-medium text-sm transition-all shadow-sm ${
        isPlaying
          ? 'bg-amber-500 text-white animate-pulse'
          : 'bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200'
      }`}
      aria-label="Listen in my language"
    >
      {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      <span>{isPlaying ? 'Pause Audio' : 'Tap to Listen 🔊'}</span>
    </button>
  );
};


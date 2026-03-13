"use client";
import { useState, useEffect, useCallback, useRef } from "react";

export function useSpeech() {
  const [voices, setVoices] = useState([]);
  const [speaking, setSpeaking] = useState(false);
  const synth = typeof window !== "undefined" ? window.speechSynthesis : null;
  const utteranceRef = useRef(null);

  // Load and filter high-quality voices
  useEffect(() => {
    if (!synth) return;

    const loadVoices = () => {
      const allVoices = synth.getVoices();
      setVoices(allVoices);
    };

    loadVoices();
    synth.onvoiceschanged = loadVoices;

    return () => synth.cancel();
  }, [synth]);

  // 🌍 Accurate Language & Script Detection
  const detectLanguage = (text) => {
    if (/[\u0900-\u097F]/.test(text)) return "hi-IN"; // Hindi
    if (/[\u0B80-\u0BFF]/.test(text)) return "ta-IN"; // Tamil
    if (/[\u0C00-\u0C7F]/.test(text)) return "te-IN"; // Telugu
    if (/[\u0980-\u09FF]/.test(text)) return "bn-IN"; // Bengali
    return "en-IN";
  };

  // 🧹 Professional Text Sanitization
  const cleanTextForSpeech = (text) => {
    if (!text) return "";
    return text
      .replace(/[#*_~`>]/g, "") // Remove Markdown
      .replace(/https?:\/\/\S+/g, "") // Remove URLs
      .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, "")
      .replace(/\s+/g, " ") // Normalize whitespace
      .trim();
  };

  // 👩 Best Neural/Natural Voice Selector
  const getProfessionalVoice = (lang) => {
    const langCode = lang.split("-")[0];
    const available = voices.filter((v) => v.lang.startsWith(langCode));

    // Priority: 1. Google/Neural Voices, 2. Premium Voices, 3. Standard Female
    return (
      available.find((v) => v.name.includes("Google") && v.name.includes("Female")) ||
      available.find((v) => v.name.includes("Natural") || v.name.includes("Premium")) ||
      available.find((v) => /Heera|Kalpana|Priya|Neerja/i.test(v.name)) ||
      available[0]
    );
  };

  const speak = useCallback(
    (rawText) => {
      if (!synth || !rawText) return;

      synth.cancel(); // Reset any existing speech
      const cleanedText = cleanTextForSpeech(rawText);
      const lang = detectLanguage(cleanedText);
      const voice = getProfessionalVoice(lang);

      // 🧩 Split by punctuation to avoid long continuous utterances
      // Includes Hindi Full Stop (।) and standard punctuation
      const segments = cleanedText.match(/[^.!?।]+[.!?।]?/g) || [cleanedText];

      let currentSegment = 0;

      const speakNextSegment = () => {
        if (currentSegment >= segments.length) {
          setSpeaking(false);
          return;
        }

        const utterance = new SpeechSynthesisUtterance(segments[currentSegment].trim());
        utterance.voice = voice;
        utterance.lang = lang;

        // 🎚️ Professional Studio Settings
        utterance.rate = 1.0;  // Standard human speed
        utterance.pitch = 1.0; // Natural tone (1.15 was too high/robotic)
        utterance.volume = 1.0;

        utterance.onstart = () => setSpeaking(true);
        utterance.onend = () => {
          currentSegment++;
          speakNextSegment();
        };

        utteranceRef.current = utterance;
        synth.speak(utterance);
      };

      speakNextSegment();
    },
    [voices, synth]
  );

  const stop = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      synth?.cancel();
    } catch {}
    setSpeaking(false);
  }, [synth]);

  return { speak, detectLanguage, speaking, stop };

}
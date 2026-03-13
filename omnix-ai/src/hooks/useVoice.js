"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export default function useVoice(onResult) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const manuallyStoppedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech Recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-IN";

    recognition.onstart = () => setListening(true);

    recognition.onresult = (event) => {
      const transcript =
        event.results[event.results.length - 1][0].transcript;

      if (transcript && onResult) {
        onResult(transcript.trim());
      }
    };

    recognition.onend = () => {
      if (!manuallyStoppedRef.current) {
        try {
          recognition.start();
        } catch {}
      } else {
        setListening(false);
      }
    };

    recognition.onerror = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [onResult]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;

    manuallyStoppedRef.current = false;

    try {
      recognitionRef.current.start();
    } catch {}
  }, []);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;

    manuallyStoppedRef.current = true;
    recognitionRef.current.stop();
    setListening(false);
  }, []);

  return {
    listening,
    startListening,
    stopListening,
  };
}
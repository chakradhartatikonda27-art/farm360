"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Download,
  ArrowDown,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  X,
} from "lucide-react";

interface LaunchCeremonyWrapperProps {
  children: React.ReactNode;
}

export function LaunchCeremonyWrapper({ children }: LaunchCeremonyWrapperProps) {
  // Playback States
  const [hasStarted, setHasStarted] = useState(false);
  const [phase, setPhase] = useState<"idle" | "countdown" | "ribbon_cutting" | "revealing" | "congratulations">("idle");
  const [countdownNum, setCountdownNum] = useState<number>(5);
  const [isMuted, setIsMuted] = useState(false);
  const [videoBlobUrl, setVideoBlobUrl] = useState<string | null>(null);
  const [curtainsOpen, setCurtainsOpen] = useState(false);
  const [ribbonCut, setRibbonCut] = useState(false);
  const [scissorsClosed, setScissorsClosed] = useState(false);
  const [showCongratsBanner, setShowCongratsBanner] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  // Canvas & Audio Refs
  const confettiCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioDestRef = useRef<MediaStreamAudioDestinationNode | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const animFrameIdRef = useRef<number | null>(null);
  const confettiParticlesRef = useRef<any[]>([]);

  /* ==================== WEB AUDIO SYNTHESIZER ==================== */
  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;
      audioDestRef.current = ctx.createMediaStreamDestination();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
  }, []);

  const playSound = useCallback((type: string) => {
    if (isMuted || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    const dest = audioDestRef.current;
    if (!dest) return;
    const now = ctx.currentTime;

    if (type === "countdown_boom") {
      // Sub-bass impact + metallic impact transient
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(130, now);
      osc.frequency.exponentialRampToValueAtTime(32, now + 0.85);

      gain.gain.setValueAtTime(0.75, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.connect(dest);
      osc.start(now);
      osc.stop(now + 0.9);

      // High transient tick
      const tick = ctx.createOscillator();
      const tickGain = ctx.createGain();
      tick.type = "triangle";
      tick.frequency.setValueAtTime(1600, now);
      tick.frequency.exponentialRampToValueAtTime(400, now + 0.12);
      tickGain.gain.setValueAtTime(0.35, now);
      tickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      tick.connect(tickGain);
      tickGain.connect(ctx.destination);
      tickGain.connect(dest);
      tick.start(now);
      tick.stop(now + 0.12);
    } else if (type === "snip") {
      // Crisp metallic shears cutting through silk
      const bufferSize = ctx.sampleRate * 0.16;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.18));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(3400, now);
      filter.Q.setValueAtTime(4.5, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.85, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      gain.connect(dest);
      noise.start(now);
    } else if (type === "fanfare") {
      // Grand celebratory brass triad harmony (D major)
      const notes = [293.66, 369.99, 440.0, 587.33, 880.0];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = idx % 2 === 0 ? "sawtooth" : "triangle";
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.2 / notes.length, now + 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 3.8);

        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(1600, now);
        filter.frequency.exponentialRampToValueAtTime(4500, now + 0.35);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        gain.connect(dest);

        osc.start(now);
        osc.stop(now + 3.8);
      });

      // Timpani boom
      const timp = ctx.createOscillator();
      const timpGain = ctx.createGain();
      timp.type = "sine";
      timp.frequency.setValueAtTime(110, now);
      timp.frequency.exponentialRampToValueAtTime(40, now + 1.2);
      timpGain.gain.setValueAtTime(0.65, now);
      timpGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      timp.connect(timpGain);
      timpGain.connect(ctx.destination);
      timpGain.connect(dest);
      timp.start(now);
      timp.stop(now + 1.2);
    } else if (type === "bells") {
      // Pentatonic celebratory chimes
      const bells = [523.25, 659.25, 783.99, 1046.5];
      bells.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0, now);
        gain.gain.setValueAtTime(0.22, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 3.0);

        osc.connect(gain);
        gain.connect(ctx.destination);
        gain.connect(dest);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 3.2);
      });
    }
  }, [isMuted]);

  /* ==================== CONFETTI ENGINE ==================== */
  const spawnConfettiBurst = () => {
    const particles: any[] = [];
    const colors = ["#FFD700", "#F4C430", "#D4AF37", "#FFFFFF", "#C5A869", "#E5C158", "#1B3B2B", "#B8860B"];
    const width = window.innerWidth;
    const height = window.innerHeight;

    for (let i = 0; i < 350; i++) {
      particles.push({
        x: width * 0.5 + (Math.random() - 0.5) * 200,
        y: height * 0.45 + (Math.random() - 0.5) * 80,
        vx: (Math.random() - 0.5) * 22,
        vy: -Math.random() * 16 - 8,
        gravity: 0.3,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        size: Math.random() * 12 + 6,
        aspect: Math.random() * 0.5 + 0.6,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: 1,
      });
    }
    confettiParticlesRef.current = particles;
  };

  const renderConfetti = useCallback(() => {
    const canvas = confettiCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    confettiParticlesRef.current.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= 0.99;
      p.rotation += p.rotationSpeed;

      if (p.y > canvas.height) {
        p.y = -20;
        p.vy = Math.random() * 2 + 1;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, (-p.size * p.aspect) / 2, p.size, p.size * p.aspect);
      ctx.restore();
    });

    animFrameIdRef.current = requestAnimationFrame(renderConfetti);
  }, []);

  /* ==================== CEREMONY CHOREOGRAPHY ==================== */
  const startLaunchCeremony = () => {
    initAudio();
    setHasStarted(true);
    setBannerDismissed(false);
    setCurtainsOpen(false);
    setRibbonCut(false);
    setScissorsClosed(false);
    setShowCongratsBanner(false);

    // Resize canvas
    if (confettiCanvasRef.current) {
      confettiCanvasRef.current.width = window.innerWidth;
      confettiCanvasRef.current.height = window.innerHeight;
    }

    // 1. SCENE 1: COUNTDOWN (0s – 5s)
    setPhase("countdown");
    setCountdownNum(5);
    playSound("countdown_boom");

    let count = 5;
    const countInterval = setInterval(() => {
      count -= 1;
      if (count >= 1) {
        setCountdownNum(count);
        playSound("countdown_boom");
      } else {
        clearInterval(countInterval);

        // 2. SCENE 2: RIBBON CUTTING (5s – 9s)
        setPhase("ribbon_cutting");

        // Scissors glide to center (5s to 7s)
        setTimeout(() => {
          // Snip the ribbon at 7s!
          setScissorsClosed(true);
          playSound("snip");

          setTimeout(() => {
            setRibbonCut(true);
            playSound("fanfare");
            spawnConfettiBurst();
            if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
            animFrameIdRef.current = requestAnimationFrame(renderConfetti);

            // 3. SCENE 3: OFFICIAL REVEAL (9s)
            // Curtains part open to display the real website!
            setTimeout(() => {
              setPhase("revealing");
              setCurtainsOpen(true);

              // 4. SCENE 4: CONGRATULATIONS & FINALE (14s)
              setTimeout(() => {
                setPhase("congratulations");
                setShowCongratsBanner(true);
                playSound("bells");
              }, 4500);
            }, 1800);
          }, 350);
        }, 1800);
      }
    }, 1000);
  };

  useEffect(() => {
    const handleResize = () => {
      if (confettiCanvasRef.current) {
        confettiCanvasRef.current.width = window.innerWidth;
        confettiCanvasRef.current.height = window.innerHeight;
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-ivory text-charcoal">
      {/* ==================== 1. THE ACTUAL LIVE MAIN WEBSITE (UNDERNEATH) ==================== */}
      <div
        className={`w-full transition-all duration-1000 ${
          curtainsOpen ? "opacity-100 filter-none" : "opacity-90 filter blur-[2px]"
        }`}
      >
        {children}
      </div>

      {/* ==================== 2. FLOATING CONFETTI OVERLAY ==================== */}
      <canvas
        ref={confettiCanvasRef}
        className={`fixed inset-0 pointer-events-none z-40 transition-opacity duration-1000 ${
          ribbonCut ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* ==================== 3. GRAND THEATRE STAGE OVERLAY ==================== */}
      {!curtainsOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex flex-col justify-between select-none bg-[#050A07]">
          {/* Left Midnight Obsidian Velvet Curtain Panel */}
          <div
            className={`absolute top-0 bottom-0 left-0 w-1/2 bg-gradient-to-r from-[#030705] via-[#08140E] to-[#0E2017] shadow-2xl transition-transform duration-1000 ease-out z-10 ${
              curtainsOpen ? "-translate-x-full" : "translate-x-0"
            }`}
          >
            {/* Velvet Vertical pleat shadows */}
            <div className="absolute inset-0 opacity-50 bg-[repeating-linear-gradient(90deg,transparent,transparent_44px,rgba(0,0,0,0.65)_44px,rgba(0,0,0,0.65)_88px)]" />
            <div className="absolute top-0 bottom-0 right-0 w-3 bg-gradient-to-l from-gold/60 via-gold/30 to-transparent" />
          </div>

          {/* Right Midnight Obsidian Velvet Curtain Panel */}
          <div
            className={`absolute top-0 bottom-0 right-0 w-1/2 bg-gradient-to-l from-[#030705] via-[#08140E] to-[#0E2017] shadow-2xl transition-transform duration-1000 ease-out z-10 ${
              curtainsOpen ? "translate-x-full" : "translate-x-0"
            }`}
          >
            {/* Velvet Vertical pleat shadows */}
            <div className="absolute inset-0 opacity-50 bg-[repeating-linear-gradient(90deg,transparent,transparent_44px,rgba(0,0,0,0.65)_44px,rgba(0,0,0,0.65)_88px)]" />
            <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-r from-gold/60 via-gold/30 to-transparent" />
          </div>

          {/* Golden Volumetric Spotlights */}
          <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
            <div className="absolute -top-40 left-1/4 w-96 h-[1200px] bg-gradient-to-b from-gold/30 via-gold/10 to-transparent transform -rotate-12 blur-2xl animate-pulse" />
            <div className="absolute -top-40 right-1/4 w-96 h-[1200px] bg-gradient-to-b from-gold/30 via-gold/10 to-transparent transform rotate-12 blur-2xl animate-pulse" />
          </div>

          {/* Stage Centerpiece Content */}
          <div className="relative z-30 flex-1 flex flex-col items-center justify-center p-6 text-center">
            {/* INITIAL STATE: Ready to Cut Ribbon */}
            {!hasStarted && (
              <div className="max-w-xl p-8 rounded-3xl bg-black/75 backdrop-blur-xl border border-gold/40 shadow-elevated animate-in fade-in zoom-in duration-500">
                <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gold/20 border border-gold/40 text-gold text-xs font-semibold mb-4 tracking-wider uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-gold" />
                  <span>Grand Worldwide Launch Event</span>
                </div>

                <h1 className="text-4xl sm:text-6xl font-serif font-bold text-ivory tracking-tight">
                  FarmCare<span className="text-gold">360</span>
                </h1>
                <p className="text-sm sm:text-base text-gold font-serif italic mt-2">
                  “Celebrating a New Beginning. Building a Brighter Future.”
                </p>

                <p className="text-xs text-ivory/70 mt-3 leading-relaxed">
                  Join the official premiere ceremony. The ceremonial ribbon will be cut, revealing the official live website.
                </p>

                {/* Big Grand Launch Button */}
                <button
                  onClick={startLaunchCeremony}
                  className="mt-6 w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-gold-dark via-gold to-gold-light text-[#1B3B2B] font-bold text-base sm:text-lg shadow-elevated hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 group"
                >
                  <span className="text-2xl group-hover:rotate-12 transition-transform">✂️</span>
                  <span>Cut the Ribbon & Launch Website</span>
                </button>
              </div>
            )}

            {/* SCENE 1: COUNTDOWN NUMBERS */}
            {hasStarted && phase === "countdown" && (
              <div className="flex flex-col items-center justify-center animate-in zoom-in duration-300">
                <div className="relative flex items-center justify-center">
                  {/* Radial Shockwave */}
                  <div className="absolute w-72 h-72 rounded-full border-2 border-gold/40 animate-ping opacity-50" />
                  <div className="absolute w-96 h-96 rounded-full bg-gold/15 blur-2xl" />

                  {/* Giant 3D Metallic Gold Number */}
                  <span className="relative font-serif font-black text-8xl sm:text-9xl md:text-[180px] leading-none bg-gradient-to-b from-[#FFFDF0] via-[#E2B755] to-[#7A5B18] bg-clip-text text-transparent drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)]">
                    {countdownNum}
                  </span>
                </div>
                <div className="text-xs font-bold uppercase tracking-[8px] text-gold mt-6 animate-pulse">
                  OFFICIAL LAUNCH COUNTDOWN
                </div>
              </div>
            )}

            {/* SCENE 2: RIBBON & GOLDEN SCISSORS */}
            {hasStarted && phase === "ribbon_cutting" && (
              <div className="relative w-full flex items-center justify-center">
                {/* 1. Heavy Satin Emerald & 24K Gold Ceremonial Ribbon */}
                <div className="relative w-full max-w-5xl h-20 sm:h-24 flex items-center justify-center">
                  {/* Left Half of Ribbon */}
                  <div
                    className={`relative h-full bg-gradient-to-r from-[#06180F] via-[#0E3520] to-[#185333] border-y-4 border-gold shadow-[0_10px_40px_rgba(0,0,0,0.8)] transition-all duration-700 overflow-hidden ${
                      ribbonCut ? "-translate-x-48 rotate-[-12deg] opacity-0" : "flex-1 translate-x-0"
                    }`}
                  >
                    {/* Inner Gold Pinstripe */}
                    <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 bg-gradient-to-r from-gold/30 via-gold to-gold/30" />
                  </div>

                  {/* Central Golden Seal Crest */}
                  <div
                    className={`absolute z-20 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-[#FFF0B3] via-[#D4AF37] to-[#7A5B18] border-4 border-white shadow-[0_10px_35px_rgba(212,175,55,0.4)] flex flex-col items-center justify-center transition-all duration-500 ${
                      ribbonCut ? "scale-0 opacity-0" : "scale-100 opacity-100"
                    }`}
                  >
                    <span className="text-[10px] font-extrabold text-[#1B3B2B] font-serif tracking-widest">FARMCARE</span>
                    <span className="text-sm font-black text-[#1B3B2B] font-serif">360™</span>
                    <span className="text-[8px] font-bold text-[#1B3B2B] tracking-wider mt-0.5">OFFICIAL</span>
                  </div>

                  {/* Right Half of Ribbon */}
                  <div
                    className={`relative h-full bg-gradient-to-l from-[#06180F] via-[#0E3520] to-[#185333] border-y-4 border-gold shadow-[0_10px_40px_rgba(0,0,0,0.8)] transition-all duration-700 overflow-hidden ${
                      ribbonCut ? "translate-x-48 rotate-[12deg] opacity-0" : "flex-1 translate-x-0"
                    }`}
                  >
                    {/* Inner Gold Pinstripe */}
                    <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-1 bg-gradient-to-l from-gold/30 via-gold to-gold/30" />
                  </div>

                  {/* 2. Precision Golden Ceremonial Scissors */}
                  {!ribbonCut && (
                    <div
                      className={`absolute z-30 transition-all duration-700 ease-out flex items-center gap-1 ${
                        scissorsClosed ? "scale-95" : "scale-105"
                      }`}
                    >
                      {/* Left Scissor Blade */}
                      <div
                        className={`text-6xl sm:text-7xl transition-transform duration-200 ${
                          scissorsClosed ? "rotate-[-45deg] translate-x-3" : "rotate-[-15deg] -translate-x-4"
                        }`}
                      >
                        ✂️
                      </div>
                    </div>
                  )}
                </div>

                <div className="absolute -bottom-16 text-xs sm:text-sm font-bold uppercase tracking-[6px] text-gold animate-pulse">
                  {ribbonCut ? "RIBBON CUT! WELCOME TO FARMCARE 360" : "CEREMONIAL RIBBON CUTTING"}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================== 4. SCENE 4: FLOATING LUXURY CONGRATULATIONS BANNER ==================== */}
      {showCongratsBanner && !bannerDismissed && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-3xl px-4 animate-in slide-in-from-top-10 fade-in duration-700">
          <div className="relative p-6 sm:p-8 rounded-3xl bg-[#0B1510]/90 backdrop-blur-2xl border-2 border-gold shadow-[0_20px_50px_rgba(0,0,0,0.6)] text-center text-ivory">
            {/* Close / Dismiss */}
            <button
              onClick={() => setBannerDismissed(true)}
              className="absolute top-4 right-4 p-2 rounded-full text-ivory/60 hover:text-white hover:bg-white/10 transition-colors"
              title="Close Banner & Explore"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Glowing Top Star */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gold/20 border border-gold/40 text-gold text-xs font-semibold mb-3 tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span>Official Worldwide Launch</span>
            </div>

            {/* Headline 1: “CONGRATULATIONS!” */}
            <h2 className="text-3xl sm:text-5xl font-serif font-black tracking-wider bg-gradient-to-r from-[#FFFDF0] via-[#E2B755] to-[#D4AF37] bg-clip-text text-transparent drop-shadow-md">
              CONGRATULATIONS!
            </h2>

            {/* Headline 2: “WEBSITE OFFICIALLY LAUNCHED” */}
            <h3 className="text-lg sm:text-2xl font-serif font-bold text-ivory mt-1 tracking-widest">
              WEBSITE OFFICIALLY LAUNCHED
            </h3>

            {/* Subtitle: “Celebrating a New Beginning. Building a Brighter Future.” */}
            <p className="text-xs sm:text-sm text-gold font-serif italic mt-2">
              “Celebrating a New Beginning. Building a Brighter Future.”
            </p>

            {/* Domain Pill */}
            <div className="inline-block mt-4 px-5 py-1.5 rounded-full bg-forest-deep border border-gold/50 text-xs font-mono font-bold text-ivory shadow-inner">
              🌐 farmcare360.in
            </div>

            {/* Direct Action Buttons */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => {
                  setBannerDismissed(true);
                  window.scrollTo({ top: 700, behavior: "smooth" });
                }}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-gold-dark via-gold to-gold-light text-[#1B3B2B] text-xs font-bold shadow-elevated hover:scale-105 transition-transform flex items-center gap-2"
              >
                <span>Explore Live Website</span>
                <ArrowDown className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={startLaunchCeremony}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-ivory flex items-center gap-2 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Replay Ribbon Cut</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 5. FLOATING TOOLBAR DOCK (ALWAYS CONVENIENT) ==================== */}
      {curtainsOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 p-2 rounded-2xl bg-black/80 backdrop-blur-xl border border-gold/40 shadow-elevated animate-in fade-in">
          {bannerDismissed && (
            <button
              onClick={() => setBannerDismissed(false)}
              className="px-3 py-1.5 rounded-xl bg-gold/20 hover:bg-gold/30 text-gold text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Celebration Banner</span>
            </button>
          )}

          <button
            onClick={startLaunchCeremony}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-ivory transition-colors"
            title="Replay Launch Ceremony"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-ivory transition-colors"
            title={isMuted ? "Unmute Sound" : "Mute Sound"}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-gold/60" /> : <Volume2 className="w-4 h-4 text-gold" />}
          </button>

          <Link
            href="/"
            className="px-3.5 py-1.5 rounded-xl bg-[#1B3B2B] hover:bg-[#152e22] text-white text-xs font-bold border border-gold/40 flex items-center gap-1.5 transition-colors"
          >
            <span>farmcare360.in</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
}

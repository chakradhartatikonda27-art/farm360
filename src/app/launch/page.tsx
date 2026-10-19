"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import {
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Download,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Shield,
  CheckCircle2,
} from "lucide-react";

// Canvas Logical Resolution (16:9 aspect ratio)
const WIDTH = 1920;
const HEIGHT = 1080;
const TOTAL_DURATION = 18; // 18 seconds total

export default function LaunchCelebrationPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlobUrl, setRecordedBlobUrl] = useState<string | null>(null);
  const [currentScene, setCurrentScene] = useState<string>("Countdown");

  // Audio Context Ref
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioDestRef = useRef<MediaStreamAudioDestinationNode | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  // Animation frame ref
  const animFrameIdRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(0);

  // Particles & Assets State
  const particlesRef = useRef<any[]>([]);
  const confettiRef = useRef<any[]>([]);
  const sparklersRef = useRef<any[]>([]);
  const ribbonSplitRef = useRef({ leftOffset: 0, rightOffset: 0, angle: 0, opacity: 1 });
  const scissorAngleRef = useRef({ left: -25, right: 25, progress: 0 });
  const soundPlayedRef = useRef<{ [key: string]: boolean }>({});

  /* ==================== WEB AUDIO API SYNTHESIZER ==================== */
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
      // Powerful Sub-bass Impact + Crisp metallic strike
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(32, now + 0.8);

      gain.gain.setValueAtTime(0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.connect(dest);

      osc.start(now);
      osc.stop(now + 0.9);

      // High metallic transient tick
      const noiseOsc = ctx.createOscillator();
      const noiseGain = ctx.createGain();
      noiseOsc.type = "triangle";
      noiseOsc.frequency.setValueAtTime(1400, now);
      noiseOsc.frequency.exponentialRampToValueAtTime(400, now + 0.15);

      noiseGain.gain.setValueAtTime(0.3, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      noiseOsc.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noiseGain.connect(dest);

      noiseOsc.start(now);
      noiseOsc.stop(now + 0.15);
    } else if (type === "scissors_snip") {
      // Realistic sharp metallic shear / snip sound
      const bufferSize = ctx.sampleRate * 0.18;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(3200, now);
      filter.Q.setValueAtTime(4.0, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.8, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      gain.connect(dest);

      noise.start(now);
    } else if (type === "celebration_fanfare") {
      // Grand orchestral triumphant brass chord (D major triad harmony)
      const chord = [293.66, 369.99, 440.0, 587.33, 880.0];
      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = idx % 2 === 0 ? "sawtooth" : "triangle";
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.18 / chord.length, now + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 3.5);

        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(1800, now);
        filter.frequency.exponentialRampToValueAtTime(4200, now + 0.3);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        gain.connect(dest);

        osc.start(now);
        osc.stop(now + 3.5);
      });

      // Timpani boom
      const timpani = ctx.createOscillator();
      const timpGain = ctx.createGain();
      timpani.type = "sine";
      timpani.frequency.setValueAtTime(95, now);
      timpani.frequency.exponentialRampToValueAtTime(45, now + 1.2);
      timpGain.gain.setValueAtTime(0.6, now);
      timpGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      timpani.connect(timpGain);
      timpGain.connect(ctx.destination);
      timpGain.connect(dest);
      timpani.start(now);
      timpani.stop(now + 1.2);
    } else if (type === "reveal_swell") {
      // Deep cinematic swell & ethereal shimmer for website reveal
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.exponentialRampToValueAtTime(320, now + 2.0);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0.4, now + 1.5);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 3.0);

      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.connect(dest);
      osc.start(now);
      osc.stop(now + 3.0);
    } else if (type === "grand_finale") {
      // Final majestic bell chime and sustained orchestra chord
      const bells = [523.25, 659.25, 783.99, 1046.5];
      bells.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0, now);
        gain.gain.setValueAtTime(0.2, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 3.0);

        osc.connect(gain);
        gain.connect(ctx.destination);
        gain.connect(dest);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 3.2);
      });
    }
  }, [isMuted]);

  /* ==================== PARTICLE GENERATORS ==================== */
  const initParticles = () => {
    // Stage ambient dust/fog
    const p: any[] = [];
    for (let i = 0; i < 70; i++) {
      p.push({
        x: Math.random() * WIDTH,
        y: Math.random() * HEIGHT,
        radius: Math.random() * 3 + 1,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.4 - 0.2,
        alpha: Math.random() * 0.4 + 0.1,
      });
    }
    particlesRef.current = p;

    // Confetti pieces
    const c: any[] = [];
    const colors = ["#FFD700", "#F4C430", "#D4AF37", "#FFFFFF", "#C5A869", "#E5C158", "#B8860B"];
    for (let i = 0; i < 320; i++) {
      c.push({
        x: WIDTH * 0.5 + (Math.random() - 0.5) * 200,
        y: HEIGHT * 0.45 + (Math.random() - 0.5) * 100,
        vx: (Math.random() - 0.5) * 24,
        vy: -Math.random() * 18 - 8,
        gravity: 0.35,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 16,
        size: Math.random() * 14 + 8,
        aspect: Math.random() * 0.5 + 0.6,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: 1,
        active: false,
      });
    }
    confettiRef.current = c;
  };

  /* ==================== SCENE RENDERERS ==================== */

  // Draw Spotlight Stage & Glossy Reflective Floor
  const drawStage = (ctx: CanvasRenderingContext2D, t: number) => {
    // 1. Dark Luxury Background
    const bgGrad = ctx.createRadialGradient(WIDTH / 2, HEIGHT * 0.35, 50, WIDTH / 2, HEIGHT / 2, WIDTH * 0.8);
    bgGrad.addColorStop(0, "#141c18");
    bgGrad.addColorStop(0.5, "#0b0f0d");
    bgGrad.addColorStop(1, "#030504");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // 2. Twin Volumetric Golden Spotlights from top corners
    const leftAngle = Math.sin(t * 0.8) * 0.15;
    const rightAngle = Math.cos(t * 0.8) * 0.15;

    ctx.save();
    ctx.globalCompositeOperation = "screen";

    // Left Spotlight
    const leftGrad = ctx.createRadialGradient(WIDTH * 0.2, 0, 10, WIDTH * (0.35 + leftAngle), HEIGHT * 0.8, 600);
    leftGrad.addColorStop(0, "rgba(218, 185, 120, 0.45)");
    leftGrad.addColorStop(0.4, "rgba(197, 168, 105, 0.15)");
    leftGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = leftGrad;
    ctx.beginPath();
    ctx.moveTo(WIDTH * 0.2, 0);
    ctx.lineTo(WIDTH * (0.15 + leftAngle), HEIGHT);
    ctx.lineTo(WIDTH * (0.65 + leftAngle), HEIGHT);
    ctx.closePath();
    ctx.fill();

    // Right Spotlight
    const rightGrad = ctx.createRadialGradient(WIDTH * 0.8, 0, 10, WIDTH * (0.65 + rightAngle), HEIGHT * 0.8, 600);
    rightGrad.addColorStop(0, "rgba(218, 185, 120, 0.45)");
    rightGrad.addColorStop(0.4, "rgba(197, 168, 105, 0.15)");
    rightGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = rightGrad;
    ctx.beginPath();
    ctx.moveTo(WIDTH * 0.8, 0);
    ctx.lineTo(WIDTH * (0.35 + rightAngle), HEIGHT);
    ctx.lineTo(WIDTH * (0.85 + rightAngle), HEIGHT);
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    // 3. Reflective Glossy Stage Floor
    const floorY = HEIGHT * 0.72;
    const floorGrad = ctx.createLinearGradient(0, floorY, 0, HEIGHT);
    floorGrad.addColorStop(0, "rgba(27, 46, 36, 0.65)");
    floorGrad.addColorStop(0.3, "rgba(12, 19, 15, 0.85)");
    floorGrad.addColorStop(1, "#030604");
    ctx.fillStyle = floorGrad;
    ctx.fillRect(0, floorY, WIDTH, HEIGHT - floorY);

    // Floor horizon line highlight
    ctx.strokeStyle = "rgba(197, 168, 105, 0.35)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, floorY);
    ctx.lineTo(WIDTH, floorY);
    ctx.stroke();

    // Ambient floating particles
    ctx.save();
    particlesRef.current.forEach((pt) => {
      pt.x += pt.vx;
      pt.y += pt.vy;
      if (pt.x < 0) pt.x = WIDTH;
      if (pt.x > WIDTH) pt.x = 0;
      if (pt.y < 0) pt.y = HEIGHT;
      if (pt.y > HEIGHT) pt.y = 0;

      ctx.fillStyle = `rgba(225, 205, 155, ${pt.alpha})`;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  };

  // Scene 1: Grand Countdown (0.0s – 5.0s)
  const drawScene1Countdown = (ctx: CanvasRenderingContext2D, t: number) => {
    setCurrentScene("Grand Countdown");
    const secondsLeft = 5 - Math.floor(t);
    const subSecond = t % 1; // 0 to 1 progress within current second

    // Sound trigger on each integer second
    const countKey = `count_${Math.floor(t)}`;
    if (!soundPlayedRef.current[countKey] && t < 5.0) {
      soundPlayedRef.current[countKey] = true;
      playSound("countdown_boom");
    }

    const currentNumber = Math.max(1, Math.min(5, secondsLeft));

    // Scale animation: explosive entrance that settles
    const scale = 1.4 - Math.min(subSecond * 0.45, 0.45);
    const opacity = subSecond > 0.85 ? (1 - subSecond) / 0.15 : 1;

    ctx.save();
    ctx.translate(WIDTH / 2, HEIGHT * 0.46);
    ctx.scale(scale, scale);
    ctx.globalAlpha = opacity;

    // Outer Shockwave Ring on impact
    if (subSecond < 0.4) {
      ctx.save();
      const ringRadius = subSecond * 400;
      const ringAlpha = (1 - subSecond / 0.4) * 0.6;
      ctx.strokeStyle = `rgba(212, 175, 55, ${ringAlpha})`;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, 0, ringRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Number typography (Photorealistic Metallic Gold)
    ctx.font = "900 240px 'Cinzel', 'Playfair Display', Georgia, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // 3D Drop Shadow
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillText(`${currentNumber}`, 6, 12);

    // Gold Gradient
    const goldGrad = ctx.createLinearGradient(0, -120, 0, 120);
    goldGrad.addColorStop(0, "#FFF3CC");
    goldGrad.addColorStop(0.25, "#E2B755");
    goldGrad.addColorStop(0.5, "#9A7528");
    goldGrad.addColorStop(0.75, "#FFD700");
    goldGrad.addColorStop(1, "#543C10");

    ctx.fillStyle = goldGrad;
    ctx.fillText(`${currentNumber}`, 0, 0);

    // Specular stroke
    ctx.strokeStyle = "rgba(255, 245, 215, 0.8)";
    ctx.lineWidth = 3;
    ctx.strokeText(`${currentNumber}`, 0, 0);

    // Floor Reflection
    ctx.restore();

    ctx.save();
    ctx.translate(WIDTH / 2, HEIGHT * 0.84);
    ctx.scale(scale * 0.9, -scale * 0.45);
    ctx.globalAlpha = opacity * 0.18;
    ctx.fillStyle = goldGrad;
    ctx.font = "900 240px 'Cinzel', 'Playfair Display', Georgia, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${currentNumber}`, 0, 0);
    ctx.restore();

    // Stage subtitle
    ctx.save();
    ctx.fillStyle = "rgba(197, 168, 105, 0.75)";
    ctx.font = "600 16px 'Inter', sans-serif";
    ctx.textAlign = "center";
    ctx.letterSpacing = "6px";
    ctx.fillText("OFFICIAL LAUNCH INITIATING", WIDTH / 2, HEIGHT * 0.64);

    // Countdown Progress Bar
    const progressWidth = 360;
    const currentProgress = (t / 5.0) * progressWidth;
    ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
    ctx.fillRect(WIDTH / 2 - progressWidth / 2, HEIGHT * 0.67, progressWidth, 3);
    ctx.fillStyle = "#C5A869";
    ctx.fillRect(WIDTH / 2 - progressWidth / 2, HEIGHT * 0.67, currentProgress, 3);
    ctx.restore();
  };

  // Scene 2: Ribbon-Cutting Ceremony (5.0s – 9.0s)
  const drawScene2RibbonCutting = (ctx: CanvasRenderingContext2D, t: number) => {
    setCurrentScene("Ribbon Cutting Ceremony");
    const sceneT = t - 5.0; // 0.0s to 4.0s
    const cutTime = 2.0; // Ribbon cuts at 7.0s absolute time (sceneT = 2.0s)

    // Trigger scissors snip sound at 2.0s
    if (sceneT >= cutTime && !soundPlayedRef.current["snip"]) {
      soundPlayedRef.current["snip"] = true;
      playSound("scissors_snip");
      playSound("celebration_fanfare");

      // Activate confetti explosion
      confettiRef.current.forEach((c) => {
        c.active = true;
      });
    }

    const ribbonY = HEIGHT * 0.48;
    const isCut = sceneT >= cutTime;

    // Draw Luxurious Red Satin Ribbon
    ctx.save();

    if (!isCut) {
      // Intact Stretching Ribbon with silk folds and golden borders
      const ribbonGrad = ctx.createLinearGradient(0, ribbonY - 32, 0, ribbonY + 32);
      ribbonGrad.addColorStop(0, "#7A0A10");
      ribbonGrad.addColorStop(0.2, "#C0141D");
      ribbonGrad.addColorStop(0.5, "#E6222C");
      ribbonGrad.addColorStop(0.8, "#B0121A");
      ribbonGrad.addColorStop(1, "#54060B");

      ctx.fillStyle = ribbonGrad;
      ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
      ctx.shadowBlur = 18;
      ctx.shadowOffsetY = 12;
      ctx.fillRect(0, ribbonY - 30, WIDTH, 60);

      // Gold Embroidered Borders
      ctx.strokeStyle = "#D4AF37";
      ctx.lineWidth = 3.5;
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.moveTo(0, ribbonY - 28);
      ctx.lineTo(WIDTH, ribbonY - 28);
      ctx.moveTo(0, ribbonY + 28);
      ctx.lineTo(WIDTH, ribbonY + 28);
      ctx.stroke();

      // Central Golden Seal & Crest
      const sealGrad = ctx.createRadialGradient(WIDTH / 2, ribbonY, 5, WIDTH / 2, ribbonY, 52);
      sealGrad.addColorStop(0, "#FFF0B3");
      sealGrad.addColorStop(0.4, "#E2B755");
      sealGrad.addColorStop(0.8, "#A67C24");
      sealGrad.addColorStop(1, "#66490F");

      ctx.fillStyle = sealGrad;
      ctx.beginPath();
      ctx.arc(WIDTH / 2, ribbonY, 52, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(WIDTH / 2, ribbonY, 46, 0, Math.PI * 2);
      ctx.stroke();

      // Seal Emblem Text
      ctx.fillStyle = "#1B3B2B";
      ctx.font = "800 13px 'Cinzel', serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("FARMCARE", WIDTH / 2, ribbonY - 8);
      ctx.font = "800 11px 'Cinzel', serif";
      ctx.fillText("360™", WIDTH / 2, ribbonY + 10);
    } else {
      // Split Ribbon in Slow Motion with dynamic cloth curling
      const splitProgress = sceneT - cutTime; // 0 to 2.0s
      const separation = splitProgress * 420;
      const curlAngle = splitProgress * 0.4;
      const alpha = Math.max(0, 1 - splitProgress * 0.35);

      ctx.globalAlpha = alpha;

      // Left Falling Half
      ctx.save();
      ctx.translate(WIDTH / 2 - separation, ribbonY + splitProgress * 80);
      ctx.rotate(-curlAngle);
      const leftGrad = ctx.createLinearGradient(0, -30, 0, 30);
      leftGrad.addColorStop(0, "#7A0A10");
      leftGrad.addColorStop(0.5, "#E6222C");
      leftGrad.addColorStop(1, "#54060B");
      ctx.fillStyle = leftGrad;
      ctx.fillRect(-WIDTH / 2, -30, WIDTH / 2, 60);
      ctx.strokeStyle = "#D4AF37";
      ctx.lineWidth = 3;
      ctx.strokeRect(-WIDTH / 2, -30, WIDTH / 2, 60);
      ctx.restore();

      // Right Falling Half
      ctx.save();
      ctx.translate(WIDTH / 2 + separation, ribbonY + splitProgress * 80);
      ctx.rotate(curlAngle);
      const rightGrad = ctx.createLinearGradient(0, -30, 0, 30);
      rightGrad.addColorStop(0, "#7A0A10");
      rightGrad.addColorStop(0.5, "#E6222C");
      rightGrad.addColorStop(1, "#54060B");
      ctx.fillStyle = rightGrad;
      ctx.fillRect(0, -30, WIDTH / 2, 60);
      ctx.strokeStyle = "#D4AF37";
      ctx.lineWidth = 3;
      ctx.strokeRect(0, -30, WIDTH / 2, 60);
      ctx.restore();
    }
    ctx.restore();

    // Golden Ceremonial Scissors
    // Scissors approach from both sides (0 to 2.0s), close to snip at 2.0s, and withdraw
    if (sceneT < 3.2) {
      ctx.save();
      const scissorProgress = Math.min(sceneT / cutTime, 1.0);
      const approachDistance = (1 - scissorProgress) * 400; // moves to center
      const snipAngle = isCut ? 2 : Math.max(2, (1 - Math.min((cutTime - sceneT) / 0.5, 1)) * 32);

      // Render Left Golden Scissor
      ctx.save();
      ctx.translate(WIDTH / 2 - 15 - approachDistance * 0.8, ribbonY);

      // Upper Blade
      ctx.save();
      ctx.rotate((-snipAngle * Math.PI) / 180);
      drawGoldenBlade(ctx, -1);
      ctx.restore();

      // Lower Blade
      ctx.save();
      ctx.rotate((snipAngle * Math.PI) / 180);
      drawGoldenBlade(ctx, 1);
      ctx.restore();

      // Pivot Screw
      ctx.fillStyle = "#FFF3CC";
      ctx.beginPath();
      ctx.arc(0, 0, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.restore();
    }

    // Confetti Physics & Sparkles
    if (isCut) {
      ctx.save();
      confettiRef.current.forEach((c) => {
        if (!c.active) return;
        c.x += c.vx;
        c.y += c.vy;
        c.vy += c.gravity;
        c.rotation += c.rotationSpeed;

        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate((c.rotation * Math.PI) / 180);
        ctx.fillStyle = c.color;
        ctx.fillRect(-c.size / 2, (-c.size * c.aspect) / 2, c.size, c.size * c.aspect);
        ctx.restore();
      });
      ctx.restore();
    }

    // Subtitle
    ctx.save();
    ctx.fillStyle = "rgba(225, 205, 155, 0.85)";
    ctx.font = "600 18px 'Inter', sans-serif";
    ctx.textAlign = "center";
    ctx.letterSpacing = "4px";
    ctx.fillText("CEREMONIAL RIBBON CUTTING", WIDTH / 2, HEIGHT * 0.22);
    ctx.restore();
  };

  // Helper: Draw Polished 3D Gold Scissor Blade
  const drawGoldenBlade = (ctx: CanvasRenderingContext2D, dir: number) => {
    const goldGrad = ctx.createLinearGradient(-120, 0, 40, 0);
    goldGrad.addColorStop(0, "#D4AF37");
    goldGrad.addColorStop(0.4, "#FFF3CC");
    goldGrad.addColorStop(0.7, "#A67C24");
    goldGrad.addColorStop(1, "#543C10");

    ctx.fillStyle = goldGrad;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(80, dir * 14);
    ctx.lineTo(135, dir * 4);
    ctx.lineTo(0, dir * -4);
    ctx.closePath();
    ctx.fill();

    // Finger loop handle
    ctx.lineWidth = 7;
    ctx.strokeStyle = goldGrad;
    ctx.beginPath();
    ctx.arc(-55, dir * 26, 22, 0, Math.PI * 2);
    ctx.stroke();
  };

  // Scene 3: Official Website Launch (9.0s – 14.0s)
  const drawScene3WebsiteLaunch = (ctx: CanvasRenderingContext2D, t: number) => {
    setCurrentScene("Official Website Reveal");
    const sceneT = t - 9.0; // 0 to 5.0s

    // Trigger reveal sound at 0s of Scene 3
    if (!soundPlayedRef.current["reveal"]) {
      soundPlayedRef.current["reveal"] = true;
      playSound("reveal_swell");
    }

    // Camera Push-in effect: scales from 0.82 to 1.0
    const zoom = Math.min(0.84 + sceneT * 0.035, 1.0);
    const screenAlpha = Math.min(sceneT * 1.5, 1.0);

    ctx.save();
    ctx.translate(WIDTH / 2, HEIGHT * 0.44);
    ctx.scale(zoom, zoom);
    ctx.globalAlpha = screenAlpha;

    // Colossal Curved LED Stadium Video Wall Frame
    const screenW = 1240;
    const screenH = 680;
    const halfW = screenW / 2;
    const halfH = screenH / 2;

    // LED Glow Halo
    ctx.shadowColor = "rgba(197, 168, 105, 0.45)";
    ctx.shadowBlur = 45;

    // Video Wall Outer Metallic Bezel
    ctx.fillStyle = "#0c1410";
    ctx.strokeStyle = "#C5A869";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(-halfW - 12, -halfH - 12, screenW + 24, screenH + 24, 20);
    ctx.fill();
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Video Wall Inner Display (Authentic Live FarmCare360 Website UI)
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(-halfW, -halfH, screenW, screenH, 12);
    ctx.clip();

    // 1. Website Header Bar (Forest Green #1B3B2B)
    ctx.fillStyle = "#1B3B2B";
    ctx.fillRect(-halfW, -halfH, screenW, 64);

    // Brand Logo & Text
    ctx.fillStyle = "#C5A869";
    ctx.font = "800 20px 'Cinzel', serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText("FARMCARE", -halfW + 36, -halfH + 32);
    ctx.fillStyle = "#FAF8F5";
    ctx.fillText("360", -halfW + 165, -halfH + 32);

    // Nav Links
    ctx.fillStyle = "rgba(250, 248, 245, 0.85)";
    ctx.font = "600 12px 'Inter', sans-serif";
    const navItems = ["Agricultural Services", "Spaces We Serve", "Landowner Partnerships", "7-Step Workflow", "Live CRM"];
    navItems.forEach((item, idx) => {
      ctx.fillText(item, -halfW + 260 + idx * 140, -halfH + 32);
    });

    // Header CTA Button
    ctx.fillStyle = "#C5A869";
    ctx.beginPath();
    ctx.roundRect(halfW - 170, -halfH + 18, 140, 30, 6);
    ctx.fill();
    ctx.fillStyle = "#1B3B2B";
    ctx.font = "700 11px 'Inter', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Plan Consultation", halfW - 100, -halfH + 33);

    // 2. Website Hero Body Section (Ivory Surface #FAF8F5 with lush farm backdrop)
    const heroGrad = ctx.createLinearGradient(0, -halfH + 64, 0, halfH);
    heroGrad.addColorStop(0, "#083723");
    heroGrad.addColorStop(0.5, "#0F462E");
    heroGrad.addColorStop(1, "#1B3B2B");
    ctx.fillStyle = heroGrad;
    ctx.fillRect(-halfW, -halfH + 64, screenW, screenH - 64);

    // Subtle Grid pattern
    ctx.strokeStyle = "rgba(197, 168, 105, 0.08)";
    ctx.lineWidth = 1;
    for (let x = -halfW; x < halfW; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, -halfH + 64);
      ctx.lineTo(x, halfH);
      ctx.stroke();
    }

    // Hero Badge
    ctx.fillStyle = "rgba(197, 168, 105, 0.2)";
    ctx.beginPath();
    ctx.roundRect(-halfW + 60, -halfH + 105, 290, 26, 13);
    ctx.fill();
    ctx.strokeStyle = "rgba(197, 168, 105, 0.5)";
    ctx.stroke();
    ctx.fillStyle = "#FFF0B3";
    ctx.font = "600 11px 'Inter', sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("🌿 Official Launch • farmcare360.in", -halfW + 75, -halfH + 118);

    // Hero Main Headline
    ctx.fillStyle = "#FAF8F5";
    ctx.font = "800 42px 'Cinzel', 'Playfair Display', serif";
    ctx.fillText("Complete Care for Your Land,", -halfW + 60, -halfH + 175);
    ctx.fillStyle = "#E2B755";
    ctx.fillText("Farm, or Terrace Garden", -halfW + 60, -halfH + 225);

    // Hero Description
    ctx.fillStyle = "rgba(250, 248, 245, 0.82)";
    ctx.font = "400 15px 'Inter', sans-serif";
    ctx.fillText("From barren land clearing to automated drip irrigation and managed organic farming.", -halfW + 60, -halfH + 265);
    ctx.fillText("Scientific execution with total transparency, live CRM tracking & verified milestone delivery.", -halfW + 60, -halfH + 290);

    // Hero Feature Cards Grid
    const cards = [
      { title: "Managed Farmlands", sub: "End-to-End Ag Stewardship" },
      { title: "Terrace Gardens", sub: "Urban Organic Living" },
      { title: "Drip Automation", sub: "IoT Smart Irrigation" },
    ];
    cards.forEach((c, idx) => {
      const cardX = -halfW + 60 + idx * 240;
      const cardY = -halfH + 340;
      ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
      ctx.strokeStyle = "rgba(197, 168, 105, 0.35)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, 220, 110, 10);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#E2B755";
      ctx.font = "700 13px 'Inter', sans-serif";
      ctx.fillText(c.title, cardX + 16, cardY + 36);
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.font = "400 11px 'Inter', sans-serif";
      ctx.fillText(c.sub, cardX + 16, cardY + 62);
    });

    // 3. Dynamic Anamorphic Lens Flare / Light Sweep
    const sweepX = -halfW + ((sceneT % 3.0) / 3.0) * screenW * 1.5;
    const sweepGrad = ctx.createLinearGradient(sweepX - 80, 0, sweepX + 80, 0);
    sweepGrad.addColorStop(0, "rgba(255, 255, 255, 0)");
    sweepGrad.addColorStop(0.5, "rgba(255, 235, 175, 0.35)");
    sweepGrad.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = sweepGrad;
    ctx.fillRect(sweepX - 80, -halfH, 160, screenH);

    ctx.restore(); // end clip

    ctx.restore(); // end screen transform

    // Stage Top Label
    ctx.save();
    ctx.fillStyle = "rgba(197, 168, 105, 0.9)";
    ctx.font = "700 18px 'Cinzel', serif";
    ctx.textAlign = "center";
    ctx.letterSpacing = "6px";
    ctx.fillText("LIVE WORLDWIDE PREMIERE", WIDTH / 2, HEIGHT * 0.1);
    ctx.restore();
  };

  // Scene 4: Congratulations & Finale (14.0s – 18.0s)
  const drawScene4Congratulations = (ctx: CanvasRenderingContext2D, t: number) => {
    setCurrentScene("Official Congratulations");
    const sceneT = t - 14.0; // 0 to 4.0s

    if (!soundPlayedRef.current["finale"]) {
      soundPlayedRef.current["finale"] = true;
      playSound("grand_finale");
    }

    const fadeAlpha = Math.min(sceneT * 1.2, 1.0);
    ctx.save();
    ctx.globalAlpha = fadeAlpha;

    // Glowing Golden Stage Backdrop Emblem
    ctx.save();
    ctx.translate(WIDTH / 2, HEIGHT * 0.26);
    const starGlow = ctx.createRadialGradient(0, 0, 10, 0, 0, 140);
    starGlow.addColorStop(0, "rgba(226, 183, 85, 0.35)");
    starGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = starGlow;
    ctx.beginPath();
    ctx.arc(0, 0, 140, 0, Math.PI * 2);
    ctx.fill();

    // Central Golden Laurel / Star
    ctx.fillStyle = "#E2B755";
    ctx.font = "38px serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("✦", 0, 0);
    ctx.restore();

    // 1. “CONGRATULATIONS!” (Grand Serif Typography)
    const congratsGrad = ctx.createLinearGradient(0, HEIGHT * 0.32, 0, HEIGHT * 0.44);
    congratsGrad.addColorStop(0, "#FFFDF0");
    congratsGrad.addColorStop(0.35, "#E2B755");
    congratsGrad.addColorStop(0.7, "#B8860B");
    congratsGrad.addColorStop(1, "#66490F");

    ctx.fillStyle = congratsGrad;
    ctx.font = "900 68px 'Cinzel', 'Playfair Display', Georgia, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.letterSpacing = "8px";
    ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 8;
    ctx.fillText("CONGRATULATIONS!", WIDTH / 2, HEIGHT * 0.38);

    // 2. “WEBSITE OFFICIALLY LAUNCHED”
    ctx.shadowBlur = 0;
    ctx.fillStyle = "#FAF8F5";
    ctx.font = "800 28px 'Cinzel', 'Inter', sans-serif";
    ctx.letterSpacing = "6px";
    ctx.fillText("WEBSITE OFFICIALLY LAUNCHED", WIDTH / 2, HEIGHT * 0.48);

    // Golden Decorative Divider
    ctx.strokeStyle = "rgba(197, 168, 105, 0.6)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(WIDTH / 2 - 180, HEIGHT * 0.53);
    ctx.lineTo(WIDTH / 2 + 180, HEIGHT * 0.53);
    ctx.stroke();

    // 3. “Celebrating a New Beginning. Building a Brighter Future.”
    ctx.fillStyle = "rgba(226, 183, 85, 0.95)";
    ctx.font = "italic 400 22px 'Playfair Display', Georgia, serif";
    ctx.letterSpacing = "2px";
    ctx.fillText("“Celebrating a New Beginning. Building a Brighter Future.”", WIDTH / 2, HEIGHT * 0.58);

    // 4. Domain URL Badge
    ctx.fillStyle = "rgba(27, 59, 43, 0.85)";
    ctx.strokeStyle = "#C5A869";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(WIDTH / 2 - 150, HEIGHT * 0.64, 300, 42, 21);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#FAF8F5";
    ctx.font = "700 16px 'Inter', sans-serif";
    ctx.letterSpacing = "1px";
    ctx.fillText("farmcare360.in", WIDTH / 2, HEIGHT * 0.665);

    // Floating Golden Confetti falling softly
    confettiRef.current.slice(0, 80).forEach((c) => {
      c.y += 1.2;
      c.rotation += 1;
      if (c.y > HEIGHT) c.y = 0;

      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate((c.rotation * Math.PI) / 180);
      ctx.fillStyle = c.color;
      ctx.globalAlpha = 0.55;
      ctx.fillRect(-c.size / 3, -c.size / 3, c.size * 0.6, c.size * 0.6);
      ctx.restore();
    });

    ctx.restore();
  };

  /* ==================== MAIN RENDER LOOP ==================== */
  const renderFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (!startTimeRef.current) {
      startTimeRef.current = performance.now();
    }

    const elapsed = (performance.now() - startTimeRef.current) / 1000 + pausedTimeRef.current;
    setCurrentTime(elapsed);

    // Clear Canvas
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // Always Draw Stage Base
    drawStage(ctx, elapsed);

    // Timeline Dispatch
    if (elapsed < 5.0) {
      drawScene1Countdown(ctx, elapsed);
    } else if (elapsed < 9.0) {
      drawScene2RibbonCutting(ctx, elapsed);
    } else if (elapsed < 14.0) {
      drawScene3WebsiteLaunch(ctx, elapsed);
    } else {
      drawScene4Congratulations(ctx, elapsed);
    }

    // Stop at total duration + hold final frame
    if (elapsed < TOTAL_DURATION + 4.0) {
      animFrameIdRef.current = requestAnimationFrame(renderFrame);
    } else {
      setIsPlaying(false);
      stopRecording();
    }
  }, [playSound]);

  /* ==================== PLAYBACK CONTROLS ==================== */
  const startCelebration = () => {
    initAudio();
    initParticles();
    soundPlayedRef.current = {};
    startTimeRef.current = performance.now();
    pausedTimeRef.current = 0;
    setHasStarted(true);
    setIsPlaying(true);

    startRecording();

    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
    }
    animFrameIdRef.current = requestAnimationFrame(renderFrame);
  };

  const restartCelebration = () => {
    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
    }
    setRecordedBlobUrl(null);
    startCelebration();
  };

  /* ==================== MEDIA RECORDER (VIDEO EXPORT) ==================== */
  const startRecording = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const stream = canvas.captureStream(60);
      if (audioDestRef.current && audioDestRef.current.stream) {
        audioDestRef.current.stream.getAudioTracks().forEach((track) => {
          stream.addTrack(track);
        });
      }

      const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
        ? "video/webm;codecs=vp9"
        : MediaRecorder.isTypeSupported("video/mp4")
        ? "video/mp4"
        : "video/webm";

      const mr = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 8000000 });
      recordedChunksRef.current = [];

      mr.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          recordedChunksRef.current.push(e.data);
        }
      };

      mr.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        setRecordedBlobUrl(url);
        setIsRecording(false);
      };

      mr.start(100);
      mediaRecorderRef.current = mr;
      setIsRecording(true);
    } catch (err) {
      console.warn("MediaRecorder recording not supported on this browser:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close().catch(() => {});
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-screen h-screen bg-[#050806] flex flex-col items-center justify-center overflow-hidden font-sans select-none text-ivory"
    >
      {/* 16:9 Cinema Container */}
      <div className="relative w-full max-w-[1720px] aspect-video max-h-screen bg-black shadow-2xl overflow-hidden flex items-center justify-center">
        {/* Main 4K Canvas */}
        <canvas
          ref={canvasRef}
          width={WIDTH}
          height={HEIGHT}
          className="w-full h-full object-contain"
        />

        {/* Start Ceremony Splash Overlay (Browser Audio Unlock) */}
        {!hasStarted && (
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/85 to-black/70 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/15 border border-gold/40 text-gold text-xs font-semibold mb-6 tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              <span>Official Corporate Launch Event</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold tracking-tight text-ivory">
              FarmCare<span className="text-gold">360</span>
            </h1>
            <p className="text-base sm:text-xl text-ivory/80 font-serif italic mt-3 max-w-xl">
              “Celebrating a New Beginning. Building a Brighter Future.”
            </p>

            <p className="text-xs sm:text-sm text-ivory/60 mt-4 max-w-lg leading-relaxed">
              Experience the 4-scene cinematic launch ceremony: Grand Countdown, Ribbon-Cutting Ceremony, Worldwide Website Reveal & Celebrations.
            </p>

            <button
              onClick={startCelebration}
              className="mt-8 px-8 py-4 rounded-full bg-gradient-to-r from-gold-dark via-gold to-gold-light text-[#1B3B2B] font-bold text-base sm:text-lg shadow-elevated hover:scale-105 active:scale-95 transition-all flex items-center gap-3 group"
            >
              <Play className="w-5 h-5 fill-current group-hover:translate-x-0.5 transition-transform" />
              <span>Begin Official Launch Ceremony</span>
            </button>
          </div>
        )}

        {/* Top Floating Badge Bar */}
        {hasStarted && (
          <div className="absolute top-4 left-6 right-6 flex items-center justify-between pointer-events-none z-20">
            <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-gold/30 text-[11px] font-semibold text-gold tracking-wider uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Scene: {currentScene}</span>
            </div>

            <div className="flex items-center gap-2 pointer-events-auto">
              {/* Mute Toggle */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-ivory/80 hover:text-white transition-colors"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-gold" />}
              </button>

              {/* Replay */}
              <button
                onClick={restartCelebration}
                className="p-2.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-ivory/80 hover:text-white transition-colors"
                title="Restart Launch"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="p-2.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-ivory/80 hover:text-white transition-colors"
                title="Toggle Fullscreen"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}

        {/* Bottom Floating Controller & Action Bar */}
        {hasStarted && (
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-center justify-between gap-4 z-20 pointer-events-none">
            {/* Timeline Progress */}
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-black/70 backdrop-blur-md border border-white/15 pointer-events-auto text-xs">
              <span className="font-mono text-gold">{Math.min(currentTime, TOTAL_DURATION).toFixed(1)}s</span>
              <div className="w-36 sm:w-48 h-1.5 rounded-full bg-white/20 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-gold-dark via-gold to-gold-light transition-all duration-100"
                  style={{ width: `${Math.min((currentTime / TOTAL_DURATION) * 100, 100)}%` }}
                />
              </div>
              <span className="font-mono text-ivory/60">{TOTAL_DURATION}s</span>
            </div>

            {/* Final CTA Buttons */}
            <div className="flex items-center gap-3 pointer-events-auto">
              {recordedBlobUrl && (
                <a
                  href={recordedBlobUrl}
                  download="farmcare360-official-launch-video.webm"
                  className="px-4 py-2.5 rounded-xl bg-black/70 hover:bg-black/90 backdrop-blur-md border border-gold/40 text-gold text-xs font-semibold flex items-center gap-2 transition-all hover:scale-105"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download 4K Video</span>
                </a>
              )}

              <Link
                href="/"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold-dark via-gold to-gold-light text-[#1B3B2B] text-xs font-bold flex items-center gap-2 shadow-elevated transition-all hover:scale-105 active:scale-95"
              >
                <span>Enter Official Website (farmcare360.in)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

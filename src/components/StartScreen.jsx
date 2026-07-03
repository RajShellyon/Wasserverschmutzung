import { useEffect, useMemo, useRef, useState } from 'react'
import NarratorVideo from './NarratorVideo'

export default function StartScreen({ onStart }) {
  const cardRef = useRef(null)
  const [highlightStartButton, setHighlightStartButton] = useState(false)

  const bubbles = useMemo(() => createBubbles(16), [])

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-sky-100 via-sky-200 to-blue-600 flex items-center justify-center px-4 py-10">
      <style>
        {`
          @keyframes floatingButtonFrame {
            0%, 100% {
              transform: translateY(0) scale(1);
              opacity: 0.75;
            }
            50% {
              transform: translateY(-6px) scale(1.04);
              opacity: 1;
            }
          }

          @keyframes pulsingButtonGlow {
            0%, 100% {
              box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.45);
            }
            50% {
              box-shadow: 0 0 0 12px rgba(37, 99, 235, 0);
            }
          }

          .start-button-highlight-frame {
            animation:
              floatingButtonFrame 1.8s ease-in-out infinite,
              pulsingButtonGlow 1.8s ease-in-out infinite;
          }

          @keyframes plasticDrift {
            0% { transform: translate(0, 0) rotate(-6deg); }
            50% { transform: translate(150%, -8px) rotate(6deg); }
            100% { transform: translate(0, 0) rotate(-6deg); }
          }

          .plastic-drift {
            left: 6%;
            top: 30%;
            animation: plasticDrift 4.2s ease-in-out infinite;
          }

          @keyframes fishSwim {
            0% { transform: translateX(0) scaleX(1); }
            45% { transform: translateX(150%) scaleX(1); }
            50% { transform: translateX(150%) scaleX(-1); }
            95% { transform: translateX(0) scaleX(-1); }
            100% { transform: translateX(0) scaleX(1); }
          }

          .fish-swim {
            left: 8%;
            top: 32%;
            animation: fishSwim 6s ease-in-out infinite;
          }

          @keyframes waveScroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-25%); }
          }

          .wave-scroll {
            animation: waveScroll 3.5s linear infinite;
          }

          .wave-scroll-slow {
            animation: waveScroll 8s linear infinite;
          }

          .wave-scroll-slower {
            animation: waveScroll 13s linear infinite reverse;
          }

          @keyframes rippleExpand {
            0% {
              width: 0px;
              height: 0px;
              opacity: 0.9;
            }
            100% {
              width: 70px;
              height: 70px;
              opacity: 0;
            }
          }

          .ripple {
            transform: translate(-50%, -50%);
            animation: rippleExpand 0.9s ease-out forwards;
          }

          @keyframes bubbleRise {
            0% {
              transform: translateY(0) translateX(0);
              opacity: 0;
            }
            12% {
              opacity: 0.6;
            }
            88% {
              opacity: 0.4;
            }
            100% {
              transform: translateY(-115vh) translateX(var(--bubble-drift, 14px));
              opacity: 0;
            }
          }

          .bubble-rise {
            animation-name: bubbleRise;
            animation-timing-function: ease-in;
            animation-iteration-count: infinite;
          }

          @keyframes seaweedSway {
            0%, 100% { transform: rotate(-5deg); }
            50% { transform: rotate(5deg); }
          }

          .seaweed-sway {
            transform-origin: bottom center;
            animation: seaweedSway 5s ease-in-out infinite;
          }
        `}
      </style>

      {/* Hintergrund-Ambiente: Unterwasserblick mit Licht, Blasen, Seegras und Wellenhorizont */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-[460px] w-[460px] -translate-x-1/2 rounded-full bg-white/50 blur-3xl" />
        <div className="absolute top-1/3 -left-16 h-64 w-64 rounded-full bg-sky-100/40 blur-3xl" />
        <div className="absolute top-1/4 -right-16 h-72 w-72 rounded-full bg-sky-100/30 blur-3xl" />

        <BubbleField bubbles={bubbles} />

        <SeaweedCluster side="left" />
        <SeaweedCluster side="right" />

        <div className="absolute inset-x-0 bottom-0 h-40 md:h-56">
          <svg
            className="wave-scroll-slower absolute bottom-0 left-0 h-28 w-[200%] opacity-40"
            viewBox="0 0 400 40"
            preserveAspectRatio="none"
          >
            <path
              d="M0 20 Q 25 0 50 20 T 100 20 T 150 20 T 200 20 T 250 20 T 300 20 T 350 20 T 400 20 V40 H0 Z"
              fill="#1d4ed8"
            />
          </svg>

          <svg
            className="wave-scroll-slow absolute bottom-0 left-0 h-16 w-[200%] opacity-60"
            viewBox="0 0 400 40"
            preserveAspectRatio="none"
          >
            <path
              d="M0 24 Q 25 8 50 24 T 100 24 T 150 24 T 200 24 T 250 24 T 300 24 T 350 24 T 400 24 V40 H0 Z"
              fill="#1e40af"
            />
          </svg>

          <svg
            className="wave-scroll absolute bottom-0 left-0 h-10 w-[200%]"
            viewBox="0 0 400 40"
            preserveAspectRatio="none"
          >
            <path
              d="M0 20 Q 25 0 50 20 T 100 20 T 150 20 T 200 20 T 250 20 T 300 20 T 350 20 T 400 20 V40 H0 Z"
              fill="#1e3a8a"
            />
          </svg>
        </div>
      </div>

      <section
        ref={cardRef}
        className="relative z-10 max-w-3xl w-full rounded-3xl bg-white/90 p-8 shadow-2xl text-center border border-blue-100"
      >
        <NarratorVideo
          anchorRef={cardRef}
          videoSrc="/videos/Intro.mp4"
          inset={-40}
          onFirstVideoEnd={() => setHighlightStartButton(true)}
        />

        <p className="text-sm font-semibold uppercase tracking-widest text-blue-500 mb-3">
          Interaktives Lernspiel
        </p>

        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-4">
          Wasser-Detektive
        </h1>

        <p className="text-lg text-slate-700 mb-8 leading-relaxed">
          Löse Missionen über Plastik, Öl, Chemikalien, Abwasser und Mikroplastik.
          Finde heraus, wie Wasserverschmutzung entsteht und wie wir unsere
          Gewässer schützen können.
        </p>

        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <InfoBox title="Plastik" variant="plastic" />
          <InfoBox title="Mikroplastik" variant="microplastic" />
          <InfoBox title="Gewässer" variant="water" />
        </div>

        <div
          className={
            highlightStartButton
              ? 'relative inline-flex rounded-2xl start-button-highlight-frame'
              : 'relative inline-flex rounded-2xl'
          }
        >
          {highlightStartButton && (
            <span className="pointer-events-none absolute -inset-2 rounded-[1.35rem] border-4 border-blue-400/80" />
          )}

          <button
            onClick={onStart}
            className={
              highlightStartButton
                ? 'relative rounded-2xl bg-blue-600 px-8 py-4 text-white font-bold text-lg shadow-2xl ring-4 ring-blue-300 hover:bg-blue-700 active:scale-95 transition'
                : 'relative rounded-2xl bg-blue-600 px-8 py-4 text-white font-bold text-lg shadow-lg hover:bg-blue-700 active:scale-95 transition'
            }
          >
            Spiel starten
          </button>
        </div>
      </section>
    </div>
  )
}

function createBubbles(count) {
  return Array.from({ length: count }, (_, index) => ({
    id: index,
    left: Math.round(4 + Math.random() * 92),
    size: Math.round(4 + Math.random() * 10),
    duration: Number((7 + Math.random() * 8).toFixed(1)),
    delay: Number((Math.random() * 10).toFixed(1)),
    drift: Math.round(-24 + Math.random() * 48),
  }))
}

function BubbleField({ bubbles }) {
  return (
    <>
      {bubbles.map((bubble) => (
        <span
          key={bubble.id}
          className="bubble-rise absolute bottom-[-40px] rounded-full border border-white/50 bg-white/25"
          style={{
            left: `${bubble.left}%`,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            animationDuration: `${bubble.duration}s`,
            animationDelay: `${bubble.delay}s`,
            '--bubble-drift': `${bubble.drift}px`,
          }}
        />
      ))}
    </>
  )
}

function SeaweedCluster({ side }) {
  const blades = useMemo(
    () => [
      { height: 120, delay: 0, opacity: 0.35 },
      { height: 90, delay: 0.6, opacity: 0.28 },
      { height: 150, delay: 1.1, opacity: 0.3 },
    ],
    [],
  )

  const positionClass = side === 'left' ? 'left-2 md:left-6' : 'right-2 md:right-6'

  return (
    <div className={`absolute bottom-0 ${positionClass} flex items-end gap-2`}>
      {blades.map((blade, index) => (
        <svg
          key={index}
          className="seaweed-sway"
          style={{
            animationDelay: `${blade.delay}s`,
            opacity: blade.opacity,
          }}
          width="18"
          height={blade.height}
          viewBox="0 0 18 120"
        >
          <path
            d="M9 120 C 2 95, 16 75, 8 50 C 1 30, 15 15, 9 0"
            fill="none"
            stroke="#0f766e"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </svg>
      ))}
    </div>
  )
}

function InfoBox({ title, variant }) {
  return (
    <div className="rounded-2xl bg-sky-50 border border-sky-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative h-28">
        {variant === 'plastic' && <PlasticScene />}
        {variant === 'microplastic' && <MicroplasticScene />}
        {variant === 'water' && <WaterScene />}
      </div>

      <div className="px-3 py-2.5">
        <h2 className="font-bold text-blue-900">{title}</h2>
      </div>
    </div>
  )
}

function PlasticScene() {
  const [collected, setCollected] = useState(false)
  const resetTimeoutRef = useRef(null)

  useEffect(() => {
    return () => {
      if (resetTimeoutRef.current) {
        window.clearTimeout(resetTimeoutRef.current)
      }
    }
  }, [])

  function handleClick() {
    if (collected) return

    setCollected(true)

    resetTimeoutRef.current = window.setTimeout(() => {
      setCollected(false)
    }, 2200)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Plastikflasche aus dem Wasser einsammeln"
      className="relative block h-full w-full overflow-hidden bg-gradient-to-b from-sky-200 to-blue-400"
    >
      <span className="absolute inset-x-0 bottom-0 h-8 bg-blue-500/40" />

      {!collected ? (
        <span className="plastic-drift absolute text-3xl select-none drop-shadow">
          🧴
        </span>
      ) : (
        <span className="absolute inset-0 flex flex-col items-center justify-center text-white">
          <span className="text-3xl">🗑️</span>
          <span className="mt-1 text-[11px] font-bold tracking-wide">
            Aufgeräumt!
          </span>
        </span>
      )}

      {!collected && (
        <span className="absolute inset-x-0 bottom-1 text-center text-[10px] font-semibold text-white/85">
          Tippen zum Einsammeln
        </span>
      )}
    </button>
  )
}

function MicroplasticScene() {
  const containerRef = useRef(null)
  const [lens, setLens] = useState(null)

  const particles = useMemo(
    () => [
      { x: 18, y: 24, size: 4, danger: true },
      { x: 62, y: 18, size: 4, danger: false },
      { x: 42, y: 55, size: 5, danger: true },
      { x: 80, y: 58, size: 4, danger: false },
      { x: 26, y: 74, size: 4, danger: true },
      { x: 55, y: 40, size: 3, danger: false },
      { x: 86, y: 30, size: 4, danger: true },
      { x: 10, y: 52, size: 4, danger: false },
    ],
    [],
  )

  function updateLensFromEvent(event) {
    const container = containerRef.current
    if (!container) return

    const rect = container.getBoundingClientRect()

    setLens({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    })
  }

  const lensSize = 56

  return (
    <div
      ref={containerRef}
      onPointerMove={updateLensFromEvent}
      onPointerDown={updateLensFromEvent}
      onPointerLeave={() => setLens(null)}
      className="relative h-full w-full overflow-hidden bg-gradient-to-b from-cyan-100 to-blue-300 touch-none"
    >
      {particles.map((particle, index) => (
        <span
          key={index}
          className="absolute rounded-full bg-blue-500/20"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
        />
      ))}

      <div
        className="absolute inset-0"
        style={{
          clipPath: lens
            ? `circle(${lensSize / 2}px at ${lens.x}px ${lens.y}px)`
            : 'circle(0px at 0px 0px)',
          transition: lens ? 'none' : 'clip-path 0.3s ease-out',
        }}
      >
        {particles.map((particle, index) => (
          <span
            key={index}
            className={
              particle.danger
                ? 'absolute rounded-sm bg-rose-500 shadow'
                : 'absolute rounded-full bg-blue-700/70'
            }
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size * 2.6}px`,
              height: `${particle.size * 2.6}px`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </div>

      {lens && (
        <span
          className="pointer-events-none absolute rounded-full border-4 border-white shadow-xl"
          style={{
            left: `${lens.x - lensSize / 2}px`,
            top: `${lens.y - lensSize / 2}px`,
            width: `${lensSize}px`,
            height: `${lensSize}px`,
          }}
        />
      )}

      {!lens && (
        <span className="absolute inset-x-0 bottom-1 text-center text-[10px] font-semibold text-blue-900/70">
          Mit der Lupe über das Wasser fahren
        </span>
      )}
    </div>
  )
}

function WaterScene() {
  const containerRef = useRef(null)
  const [ripples, setRipples] = useState([])
  const rippleIdRef = useRef(0)

  function handlePointerDown(event) {
    const container = containerRef.current
    if (!container) return

    const rect = container.getBoundingClientRect()
    const id = rippleIdRef.current++

    const ripple = {
      id,
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    }

    setRipples((current) => [...current, ripple])

    window.setTimeout(() => {
      setRipples((current) => current.filter((item) => item.id !== id))
    }, 900)
  }

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      className="relative h-full w-full overflow-hidden bg-gradient-to-b from-sky-200 via-sky-300 to-blue-500 cursor-pointer"
    >
      <span className="fish-swim absolute text-2xl select-none drop-shadow">
        🐟
      </span>

      <svg
        className="wave-scroll absolute bottom-0 left-0 h-10 w-[200%]"
        viewBox="0 0 400 40"
        preserveAspectRatio="none"
      >
        <path
          d="M0 20 Q 25 0 50 20 T 100 20 T 150 20 T 200 20 T 250 20 T 300 20 T 350 20 T 400 20 V40 H0 Z"
          fill="rgba(37, 99, 235, 0.45)"
        />
      </svg>

      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="ripple pointer-events-none absolute rounded-full border-2 border-white/80"
          style={{ left: `${ripple.x}px`, top: `${ripple.y}px` }}
        />
      ))}

      <span className="absolute inset-x-0 bottom-1 text-center text-[10px] font-semibold text-blue-950/60">
        Ins Wasser tippen für Wellen
      </span>
    </div>
  )
}
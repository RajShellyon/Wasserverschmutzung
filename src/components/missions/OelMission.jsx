import { useRef, useState } from "react"
import NarratorVideo from "../NarratorVideo"

const INTRO_VIDEO = "/videos/Intro_Game_Oel.mp4"

const videoByTargetId = {
    1: "/videos/Oel_Vogel.mp4",
    2: "/videos/Oel_Fisch.mp4",
    3: "/videos/Oel_Schildkroete.mp4",
    4: "/videos/Oel_Kueste.mp4",
    5: "/videos/Oel_Wasserpflanzen.mp4",
    6: "/videos/Oel_Luft.mp4",
}

const spreadSteps = [
    {
        id: "wind",
        label: "Wind",
        icon: "💨",
        feedback:
            "Der Wind schiebt den Ölfilm über die Wasseroberfläche. Dadurch erreicht das Öl neue Bereiche.",
    },
    {
        id: "waves",
        label: "Wellen",
        icon: "🌊",
        feedback:
            "Wellen verteilen das Öl weiter. Der Ölteppich wird breiter und unregelmäßiger.",
    },
    {
        id: "current",
        label: "Strömung",
        icon: "↝",
        feedback:
            "Die Strömung transportiert Öl auch dorthin, wo die Verschmutzung zuerst gar nicht zu sehen war.",
    },
    {
        id: "coast",
        label: "Richtung Küste",
        icon: "🏝️",
        feedback:
            "Wenn Öl die Küste erreicht, können Strände, Pflanzen und Lebensräume stark belastet werden.",
    },
]

const affectedTargets = [
    {
        id: 1,
        icon: "🕊️",
        label: "Seevogel",
        minStage: 1,
        x: 18,
        y: 25,
        info:
            "Richtig erkannt! Öl verklebt Federn. Vögel können schlechter fliegen und verlieren ihren Schutz vor Kälte.",
        drift: "oil-drift-a",
    },
    {
        id: 2,
        icon: "🐟",
        label: "Fisch",
        minStage: 2,
        x: 44,
        y: 58,
        info:
            "Gut beobachtet! Fische und andere Meerestiere können Öl aufnehmen oder schädliche Stoffe einatmen.",
        drift: "oil-drift-b",
    },
    {
        id: 3,
        icon: "🐢",
        label: "Meeresschildkröte",
        minStage: 2,
        x: 67,
        y: 42,
        info:
            "Richtig! Meeresschildkröten können mit Öl in Berührung kommen oder verschmutzte Nahrung aufnehmen.",
        drift: "oil-drift-c",
    },
    {
        id: 4,
        icon: "🏖️",
        label: "Küste",
        minStage: 4,
        x: 82,
        y: 72,
        info:
            "Genau! An der Küste kann Öl Sand, Steine, Pflanzen und Lebensräume verschmutzen.",
        drift: "oil-drift-a",
    },
    {
        id: 5,
        icon: "🌿",
        label: "Wasserpflanzen",
        minStage: 3,
        x: 29,
        y: 78,
        info:
            "Sehr gut! Öl kann Pflanzen bedecken und Licht sowie Sauerstoffaustausch erschweren.",
        drift: "oil-drift-b",
    },
    {
        id: 6,
        icon: "🫧",
        label: "Wasseroberfläche",
        minStage: 1,
        x: 58,
        y: 22,
        info:
            "Richtig! Schon eine dünne Ölschicht auf der Oberfläche kann den Austausch zwischen Luft und Wasser stören.",
        drift: "oil-drift-c",
    },
]

export default function OelMission({ mission, onBack }) {
    const narratorAnchorRef = useRef(null)
    const narratorVideoRef = useRef(null)

    const [started, setStarted] = useState(false)
    const [spreadStage, setSpreadStage] = useState(0)
    const [usedStepIds, setUsedStepIds] = useState([])
    const [discoveredTargetIds, setDiscoveredTargetIds] = useState([])
    const [feedback, setFeedback] = useState(
        "Klicke auf „Starten“ und untersuche, wie sich Öl im Wasser ausbreitet.",
    )

    const discoveredCount = discoveredTargetIds.length
    const totalTargets = affectedTargets.length
    const isComplete = discoveredCount === totalTargets

    const visibleTargets = affectedTargets.filter(
        (target) => spreadStage >= target.minStage,
    )

    function handleStart() {
        setStarted(true)
        setFeedback(
            "Ein kleiner Ölfleck ist im Wasser. Nutze Wind, Wellen und Strömung, um zu sehen, was passiert.",
        )
    }

    function handleSpread(step) {
        if (!started || isComplete) return

        setSpreadStage((prev) => Math.min(prev + 1, spreadSteps.length))
        setUsedStepIds((prev) =>
            prev.includes(step.id) ? prev : [...prev, step.id],
        )
        setFeedback(step.feedback)
    }

    function handleTargetClick(target) {
        if (!started || isComplete) return

        if (spreadStage < target.minStage) {
            setFeedback(
                `${target.label} ist noch nicht direkt vom Öl erreicht. Beobachte zuerst, wie sich der Ölteppich ausbreitet.`,
            )
            return
        }

        if (discoveredTargetIds.includes(target.id)) {
            setFeedback(`${target.label}: ${target.info}`)
            return
        }

        const nextVideoSrc = videoByTargetId[target.id]

        if (nextVideoSrc) {
            narratorVideoRef.current?.playVideoFromStart(nextVideoSrc)
        }

        setDiscoveredTargetIds((prev) => [...prev, target.id])
        setFeedback(`${target.label}: ${target.info}`)
    }

    function getOilStyle() {
        const styles = [
            {
                width: "130px",
                height: "82px",
                left: "42%",
                top: "42%",
                opacity: 0.76,
                transform: "translate(-50%, -50%) rotate(-8deg)",
            },
            {
                width: "230px",
                height: "125px",
                left: "42%",
                top: "42%",
                opacity: 0.8,
                transform: "translate(-50%, -50%) rotate(-12deg)",
            },
            {
                width: "360px",
                height: "180px",
                left: "47%",
                top: "45%",
                opacity: 0.82,
                transform: "translate(-50%, -50%) rotate(-7deg)",
            },
            {
                width: "510px",
                height: "235px",
                left: "53%",
                top: "49%",
                opacity: 0.84,
                transform: "translate(-50%, -50%) rotate(-3deg)",
            },
            {
                width: "680px",
                height: "290px",
                left: "60%",
                top: "53%",
                opacity: 0.86,
                transform: "translate(-50%, -50%) rotate(2deg)",
            },
        ]

        return styles[Math.min(spreadStage, styles.length - 1)]
    }

    return (
        <section className="relative w-screen h-screen overflow-hidden bg-gradient-to-b from-sky-200 via-cyan-300 to-blue-600">
            <NarratorVideo
                ref={narratorVideoRef}
                anchorRef={narratorAnchorRef}
                videoSrc={INTRO_VIDEO}
                preloadSources={[INTRO_VIDEO, ...Object.values(videoByTargetId)]}
                initialPosition={{ x: "calc(100vw - 170px)", y: "18px" }}
                inset={0}
                autoPlayInitialVideo
                startAfterFirstUserAction={false}
            />

            <style>
                {`
                    @keyframes oilDriftA {
                        0% { transform: translate(0, 0) rotate(-3deg); }
                        25% { transform: translate(10px, -5px) rotate(1deg); }
                        50% { transform: translate(3px, -12px) rotate(5deg); }
                        75% { transform: translate(-8px, -4px) rotate(-2deg); }
                        100% { transform: translate(0, 0) rotate(-3deg); }
                    }

                    @keyframes oilDriftB {
                        0% { transform: translate(0, 0) rotate(2deg); }
                        25% { transform: translate(-10px, -4px) rotate(-3deg); }
                        50% { transform: translate(-3px, -11px) rotate(2deg); }
                        75% { transform: translate(8px, -3px) rotate(4deg); }
                        100% { transform: translate(0, 0) rotate(2deg); }
                    }

                    @keyframes oilDriftC {
                        0% { transform: translate(0, 0) rotate(-1deg); }
                        25% { transform: translate(7px, 4px) rotate(3deg); }
                        50% { transform: translate(-5px, -10px) rotate(-4deg); }
                        75% { transform: translate(-11px, 3px) rotate(2deg); }
                        100% { transform: translate(0, 0) rotate(-1deg); }
                    }

                    @keyframes oilWave {
                        0% { transform: translateX(-20px); opacity: 0.22; }
                        50% { transform: translateX(20px); opacity: 0.55; }
                        100% { transform: translateX(-20px); opacity: 0.22; }
                    }

                    @keyframes oilShimmer {
                        0% { filter: blur(1px) brightness(0.92); border-radius: 58% 42% 61% 39% / 42% 55% 45% 58%; }
                        33% { filter: blur(1.5px) brightness(1.02); border-radius: 48% 52% 46% 54% / 55% 44% 56% 45%; }
                        66% { filter: blur(1px) brightness(0.96); border-radius: 62% 38% 48% 52% / 43% 60% 40% 57%; }
                        100% { filter: blur(1px) brightness(0.92); border-radius: 58% 42% 61% 39% / 42% 55% 45% 58%; }
                    }

                    @keyframes warningPulse {
                        0% { transform: scale(1); }
                        50% { transform: scale(1.12); }
                        100% { transform: scale(1); }
                    }

                    .oil-drift-a { animation: oilDriftA 5.7s ease-in-out infinite; }
                    .oil-drift-b { animation: oilDriftB 6.5s ease-in-out infinite; }
                    .oil-drift-c { animation: oilDriftC 7.3s ease-in-out infinite; }

                    .oil-wave {
                        animation: oilWave 5s ease-in-out infinite;
                    }

                    .oil-slick {
                        transition: width 900ms ease, height 900ms ease, left 900ms ease, top 900ms ease, opacity 900ms ease, transform 900ms ease;
                        animation: oilShimmer 4.8s ease-in-out infinite;
                    }

                    .oil-warning {
                        animation: warningPulse 1.4s ease-in-out infinite;
                    }
                `}
            </style>

            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_18%_18%,white,transparent_24%),radial-gradient(circle_at_72%_62%,white,transparent_18%)]" />

            <div className="relative z-10 flex h-full flex-col p-2">
                <header
                    ref={narratorAnchorRef}
                    className="relative rounded-3xl bg-white/85 p-5 shadow-xl backdrop-blur text-center max-w-3xl mx-auto"
                >
                    <div className="text-4xl mb-2">{mission.icon}</div>

                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-blue-600 mb-1">
                        Mission {mission.id}
                    </p>

                    <h1 className="text-3xl font-extrabold text-blue-950">
                        Ölverschmutzung im Wasser untersuchen
                    </h1>

                    <p className="text-slate-700 mt-2">
                        Schon eine dünne Ölschicht kann Tiere und Lebensräume gefährden.
                    </p>

                    <p className="mt-3 text-sm font-semibold text-blue-900">
                        {feedback}
                    </p>

                    {started && !isComplete && (
                        <div className="mt-4 mx-auto max-w-md">
                            <div className="flex justify-between text-xs font-bold text-blue-900 mb-1">
                                <span>Erkannt: {discoveredCount} von {totalTargets}</span>
                                <span>Ausbreitung: {spreadStage} von {spreadSteps.length}</span>
                            </div>

                            <div className="h-3 overflow-hidden rounded-full bg-blue-100 shadow-inner">
                                <div
                                    className="h-full rounded-full bg-slate-800 transition-all duration-500"
                                    style={{
                                        width: `${(discoveredCount / totalTargets) * 100}%`,
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </header>

                <main className="relative mt-2 flex-1 rounded-3xl border border-white/40 bg-white/15 shadow-inner overflow-hidden touch-none">
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="oil-wave absolute left-[8%] top-[13%] text-2xl opacity-45">〰️</div>
                        <div className="oil-wave absolute left-[25%] top-[35%] text-2xl opacity-35">〰️</div>
                        <div className="oil-wave absolute left-[39%] top-[15%] text-2xl opacity-40">〰️</div>
                        <div className="oil-wave absolute left-[49%] top-[61%] text-2xl opacity-30">〰️</div>
                        <div className="oil-wave absolute left-[64%] top-[24%] text-2xl opacity-45">〰️</div>
                        <div className="oil-wave absolute left-[74%] top-[46%] text-2xl opacity-35">〰️</div>
                        <div className="oil-wave absolute left-[86%] top-[19%] text-2xl opacity-35">〰️</div>
                        <div className="oil-wave absolute left-[88%] top-[73%] text-2xl opacity-30">〰️</div>
                        <div className="oil-wave absolute left-[16%] top-[78%] text-2xl opacity-30">〰️</div>
                        <div className="oil-wave absolute left-[57%] top-[84%] text-2xl opacity-25">〰️</div>
                    </div>

                    <div className="absolute right-0 bottom-0 top-[58%] w-[23%] rounded-tl-[80px] bg-gradient-to-br from-yellow-100 via-amber-200 to-lime-300 shadow-2xl border-l-4 border-white/60">
                        <div className="absolute left-[18%] top-[16%] text-4xl">🌾</div>
                        <div className="absolute left-[52%] top-[31%] text-5xl">🌴</div>
                        <div className="absolute left-[32%] bottom-[13%] text-3xl">🪨</div>
                    </div>

                    {started && (
                        <div
                            className="oil-slick pointer-events-none absolute z-10 bg-[radial-gradient(circle_at_35%_35%,rgba(55,65,81,0.98),rgba(17,24,39,0.92)_42%,rgba(2,6,23,0.75)_72%,rgba(2,6,23,0.18)_100%)] ring-2 ring-slate-900/20 shadow-2xl"
                            style={getOilStyle()}
                        >
                            <div className="absolute inset-4 rounded-full bg-[radial-gradient(circle_at_30%_28%,rgba(255,255,255,0.25),transparent_30%),radial-gradient(circle_at_70%_64%,rgba(14,165,233,0.18),transparent_28%)]" />
                        </div>
                    )}

                    {affectedTargets.map((target) => {
                        const isVisible = spreadStage >= target.minStage
                        const isDiscovered = discoveredTargetIds.includes(target.id)

                        return (
                            <button
                                key={target.id}
                                type="button"
                                onClick={() => handleTargetClick(target)}
                                className={`${target.drift} absolute z-20 flex h-16 w-16 items-center justify-center rounded-full text-4xl shadow-lg ring-2 transition-all duration-500 select-none active:scale-95 ${isVisible
                                        ? "bg-white/85 ring-white/80 cursor-pointer"
                                        : "bg-cyan-100/35 ring-white/30 cursor-default opacity-60"
                                    } ${isDiscovered
                                        ? "opacity-45 grayscale"
                                        : "opacity-100"
                                    }`}
                                style={{
                                    left: `${target.x}%`,
                                    top: `${target.y}%`,
                                }}
                                title={target.label}
                            >
                                <span className="pointer-events-none drop-shadow-sm">
                                    {target.icon}
                                </span>

                                {isVisible && !isDiscovered && (
                                    <span className="oil-warning absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-amber-300 text-base shadow-lg ring-2 ring-white">
                                        ⚠️
                                    </span>
                                )}

                                {isDiscovered && (
                                    <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400 text-base shadow-lg ring-2 ring-white">
                                        ✓
                                    </span>
                                )}
                            </button>
                        )
                    })}

                    {started && !isComplete && (
                        <div className="absolute left-5 bottom-5 z-30 rounded-3xl bg-white/85 p-4 shadow-xl backdrop-blur max-w-xl">
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 mb-3">
                                Öl ausbreiten
                            </p>

                            <div className="flex flex-wrap gap-3">
                                {spreadSteps.map((step, index) => {
                                    const isUsed = usedStepIds.includes(step.id)
                                    const isLocked = index > spreadStage

                                    return (
                                        <button
                                            key={step.id}
                                            type="button"
                                            onClick={() => handleSpread(step)}
                                            disabled={spreadStage >= spreadSteps.length || isLocked}
                                            className={`rounded-2xl px-4 py-3 text-sm font-extrabold shadow transition active:scale-95 ${isLocked
                                                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                                    : isUsed
                                                        ? "bg-slate-800 text-white hover:bg-slate-900"
                                                        : "bg-blue-600 text-white hover:bg-blue-700"
                                                }`}
                                        >
                                            <span className="mr-2">{step.icon}</span>
                                            {step.label}
                                        </button>
                                    )
                                })}
                            </div>

                            <p className="mt-3 text-xs text-slate-600">
                                Tipp: Klicke anschließend auf die Warnzeichen bei Tieren,
                                Pflanzen oder Lebensräumen.
                            </p>
                        </div>
                    )}

                    {!started && (
                        <div className="absolute inset-0 z-40 flex items-center justify-center bg-blue-950/35 backdrop-blur-sm p-4">
                            <div className="max-w-xl rounded-3xl bg-white p-7 text-center shadow-2xl">
                                <div className="text-5xl mb-3">🛢️</div>

                                <h2 className="text-2xl font-extrabold text-blue-950">
                                    Ein kleiner Ölfleck reicht aus
                                </h2>

                                <p className="mt-3 text-slate-700 leading-relaxed">
                                    Öl schwimmt auf der Wasseroberfläche und kann sich durch
                                    Wind, Wellen und Strömung ausbreiten. Beobachte, welche
                                    Tiere und Lebensräume betroffen sind.
                                </p>

                                <button
                                    type="button"
                                    onClick={handleStart}
                                    className="mt-6 rounded-xl bg-blue-600 px-6 py-3 text-white text-sm font-bold shadow hover:bg-blue-700 active:scale-95 transition"
                                >
                                    Starten
                                </button>
                            </div>
                        </div>
                    )}

                    {isComplete && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center bg-blue-950/40 backdrop-blur-sm p-4">
                            <div className="rounded-3xl bg-white p-8 text-center shadow-2xl max-w-xl">
                                <div className="text-5xl mb-3">🎉</div>

                                <h2 className="text-2xl font-extrabold text-blue-950">
                                    Mission geschafft!
                                </h2>

                                <p className="text-slate-700 mt-2 mb-5 leading-relaxed">
                                    Du hast erkannt, wie Öl sich auf dem Wasser ausbreitet
                                    und warum es für Tiere, Pflanzen und Küsten gefährlich ist.
                                </p>

                                <button
                                    type="button"
                                    onClick={onBack}
                                    className="rounded-xl bg-blue-600 px-5 py-3 text-white text-sm font-bold hover:bg-blue-700 active:scale-95 transition"
                                >
                                    Zurück zur Kursauswahl
                                </button>
                            </div>
                        </div>
                    )}
                </main>

                {!isComplete && (
                    <button
                        type="button"
                        onClick={onBack}
                        className="mx-auto mt-5 rounded-xl bg-white px-5 py-3 text-blue-700 text-sm font-bold shadow hover:bg-blue-50 active:scale-95 transition"
                    >
                        Zurück zur Kursauswahl
                    </button>
                )}
            </div>
        </section>
    )
}
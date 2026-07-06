import { useRef, useState } from "react"
import NarratorVideo from "../NarratorVideo"

const INTRO_VIDEO = "/videos/Intro_Game_Chemikalien.mp4"

const videoBySourceId = {
    1: "/videos/Chemikalien_Haushalt.mp4",
    2: "/videos/Chemikalien_Landwirtschaft.mp4",
    3: "/videos/Chemikalien_Fabrik.mp4",
    4: "/videos/Chemikalien_Medikamente.mp4",
    5: "/videos/Chemikalien_Gully.mp4",
    6: "/videos/Chemikalien_Reinigungsmittel.mp4",
}

const pollutionSources = [
    {
        id: 1,
        icon: "🏠",
        label: "Haushalt",
        shortLabel: "Abfluss",
        info:
            "Richtig erkannt! Im Haushalt können Stoffe aus Waschbecken, Dusche oder Toilette ins Abwasser gelangen. Nicht alles wird sofort vollständig entfernt.",
        x: 13,
        y: 47,
        path: "M 14 52 C 25 56 31 63 41 68 C 51 73 58 76 69 79",
        color: "#ec4899",
        drift: "chem-drift-a",
    },
    {
        id: 2,
        icon: "🚜",
        label: "Landwirtschaft",
        shortLabel: "Feld",
        info:
            "Gut entdeckt! Von Feldern können Dünger, Pflanzenschutzmittel oder andere Stoffe durch Regen in Bäche und Flüsse gespült werden.",
        x: 24,
        y: 24,
        path: "M 25 31 C 29 42 33 53 43 61 C 51 68 58 72 70 78",
        color: "#84cc16",
        drift: "chem-drift-b",
    },
    {
        id: 3,
        icon: "🏭",
        label: "Industrie",
        shortLabel: "Fabrik",
        info:
            "Richtig! Auch Industrieanlagen müssen sorgfältig mit Chemikalien umgehen, damit Schadstoffe nicht über Rohre, Böden oder Abwasser in Gewässer gelangen.",
        x: 74,
        y: 31,
        path: "M 75 38 C 72 48 70 58 72 68 C 73 73 72 77 69 81",
        color: "#64748b",
        drift: "chem-drift-c",
    },
    {
        id: 4,
        icon: "💊",
        label: "Medikamente",
        shortLabel: "Medizin",
        info:
            "Sehr gut! Medikamente dürfen nicht über Toilette oder Waschbecken entsorgt werden, weil Rückstände sonst ins Abwasser gelangen können.",
        x: 86,
        y: 20,
        path: "M 86 27 C 82 38 78 49 76 60 C 74 70 72 76 69 81",
        color: "#a855f7",
        drift: "chem-drift-a",
    },
    {
        id: 5,
        icon: "🕳️",
        label: "Gully",
        shortLabel: "Straße",
        info:
            "Genau! Regen spült Stoffe von Straßen in Gullys. Von dort können sie über Kanäle und Bäche weitertransportiert werden.",
        x: 42,
        y: 58,
        path: "M 43 64 C 49 68 57 72 68 79",
        color: "#0f172a",
        drift: "chem-drift-b",
    },
    {
        id: 6,
        icon: "🧴",
        label: "Reinigungsmittel",
        shortLabel: "Putzmittel",
        info:
            "Richtig! Reinigungsmittel können Stoffe enthalten, die für Wasserlebewesen problematisch sind, wenn sie in großen Mengen ins Wasser gelangen.",
        x: 58,
        y: 43,
        path: "M 59 50 C 62 60 65 70 69 80",
        color: "#06b6d4",
        drift: "chem-drift-c",
    },
]

export default function ChemikalienMission({ mission, onBack }) {
    const narratorAnchorRef = useRef(null)
    const narratorVideoRef = useRef(null)

    const [started, setStarted] = useState(false)
    const [discoveredSourceIds, setDiscoveredSourceIds] = useState([])
    const [feedback, setFeedback] = useState(
        "Klicke auf „Starten“ und finde heraus, wie unsichtbare Schadstoffe ins Wasser gelangen.",
    )

    const discoveredCount = discoveredSourceIds.length
    const totalSources = pollutionSources.length
    const isComplete = discoveredCount === totalSources

    function handleStart() {
        setStarted(true)
        setFeedback(
            "Klicke auf die möglichen Quellen. Die bunten Spuren zeigen dir den Weg der Schadstoffe zum Gewässer.",
        )
    }

    function handleSourceClick(source) {
        if (!started || isComplete) return

        if (discoveredSourceIds.includes(source.id)) {
            setFeedback(`${source.label}: ${source.info}`)
            return
        }

        const nextVideoSrc = videoBySourceId[source.id]

        if (nextVideoSrc) {
            narratorVideoRef.current?.playVideoFromStart(nextVideoSrc)
        }

        setDiscoveredSourceIds((prev) => [...prev, source.id])
        setFeedback(`${source.label}: ${source.info}`)
    }

    return (
        <section className="relative w-screen h-screen overflow-hidden bg-gradient-to-b from-sky-200 via-cyan-200 to-blue-500">
            <NarratorVideo
                ref={narratorVideoRef}
                anchorRef={narratorAnchorRef}
                videoSrc={INTRO_VIDEO}
                preloadSources={[INTRO_VIDEO, ...Object.values(videoBySourceId)]}
                initialPosition={{ x: "calc(100vw - 170px)", y: "18px" }}
                inset={0}
                autoPlayInitialVideo
                startAfterFirstUserAction={false}
            />

            <style>
                {`
                    @keyframes chemDriftA {
                        0% { transform: translate(0, 0) rotate(-2deg); }
                        25% { transform: translate(8px, -5px) rotate(2deg); }
                        50% { transform: translate(2px, -10px) rotate(4deg); }
                        75% { transform: translate(-7px, -4px) rotate(-2deg); }
                        100% { transform: translate(0, 0) rotate(-2deg); }
                    }

                    @keyframes chemDriftB {
                        0% { transform: translate(0, 0) rotate(2deg); }
                        25% { transform: translate(-8px, -4px) rotate(-3deg); }
                        50% { transform: translate(-3px, -9px) rotate(2deg); }
                        75% { transform: translate(7px, -3px) rotate(3deg); }
                        100% { transform: translate(0, 0) rotate(2deg); }
                    }

                    @keyframes chemDriftC {
                        0% { transform: translate(0, 0) rotate(-1deg); }
                        25% { transform: translate(6px, 4px) rotate(3deg); }
                        50% { transform: translate(-5px, -8px) rotate(-4deg); }
                        75% { transform: translate(-9px, 2px) rotate(2deg); }
                        100% { transform: translate(0, 0) rotate(-1deg); }
                    }

                    @keyframes chemDash {
                        from { stroke-dashoffset: 260; }
                        to { stroke-dashoffset: 0; }
                    }

                    @keyframes chemPulse {
                        0% { transform: scale(1); opacity: 0.75; }
                        50% { transform: scale(1.18); opacity: 1; }
                        100% { transform: scale(1); opacity: 0.75; }
                    }

                    @keyframes chemRiverMove {
                        0% { transform: translateX(-16px); opacity: 0.28; }
                        50% { transform: translateX(16px); opacity: 0.58; }
                        100% { transform: translateX(-16px); opacity: 0.28; }
                    }

                    @keyframes chemBubbleRise {
                        0% { transform: translateY(35px) scale(0.75); opacity: 0; }
                        20% { opacity: 0.38; }
                        100% { transform: translateY(-145px) scale(1.1); opacity: 0; }
                    }

                    .chem-drift-a { animation: chemDriftA 5.8s ease-in-out infinite; }
                    .chem-drift-b { animation: chemDriftB 6.6s ease-in-out infinite; }
                    .chem-drift-c { animation: chemDriftC 7.3s ease-in-out infinite; }

                    .chem-path {
                        stroke-dasharray: 260;
                        stroke-dashoffset: 260;
                        animation: chemDash 1.2s ease-out forwards;
                    }

                    .chem-pulse {
                        animation: chemPulse 1.5s ease-in-out infinite;
                    }

                    .chem-river-wave {
                        animation: chemRiverMove 5.2s ease-in-out infinite;
                    }

                    .chem-bubble {
                        position: absolute;
                        width: 10px;
                        height: 10px;
                        border-radius: 9999px;
                        background: rgba(255,255,255,0.35);
                        animation: chemBubbleRise 6.3s ease-in-out infinite;
                    }
                `}
            </style>

            <div className="absolute inset-0 opacity-45 bg-[radial-gradient(circle_at_18%_18%,white,transparent_23%),radial-gradient(circle_at_72%_60%,white,transparent_18%)]" />

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
                        Unsichtbare Chemikalien verfolgen
                    </h1>

                    <p className="text-slate-700 mt-2">
                        Manche Schadstoffe sieht man nicht sofort. Trotzdem können sie über verschiedene Wege ins Wasser gelangen.
                    </p>

                    <p className="mt-3 text-sm font-semibold text-blue-900">
                        {feedback}
                    </p>

                    {started && !isComplete && (
                        <div className="mt-4 mx-auto max-w-md">
                            <div className="flex justify-between text-xs font-bold text-blue-900 mb-1">
                                <span>Quellen erkannt: {discoveredCount} von {totalSources}</span>
                                <span>Analyse läuft</span>
                            </div>

                            <div className="h-3 overflow-hidden rounded-full bg-blue-100 shadow-inner">
                                <div
                                    className="h-full rounded-full bg-cyan-600 transition-all duration-500"
                                    style={{
                                        width: `${(discoveredCount / totalSources) * 100}%`,
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </header>

                <main className="relative mt-2 flex-1 rounded-3xl border border-white/40 bg-white/15 shadow-inner overflow-hidden touch-none">
                    <div className="absolute inset-0 bg-gradient-to-b from-sky-100/40 via-emerald-100/30 to-blue-400/30" />

                    <div className="absolute left-0 right-0 bottom-0 h-[42%] bg-gradient-to-b from-lime-200 via-emerald-300 to-green-500" />

                    <div className="absolute left-[-8%] top-[23%] h-[38%] w-[58%] rounded-full bg-lime-300/80 blur-sm" />
                    <div className="absolute right-[-7%] top-[24%] h-[35%] w-[54%] rounded-full bg-emerald-300/80 blur-sm" />

                    <div className="absolute left-[8%] bottom-[19%] h-[18%] w-[25%] rounded-3xl bg-yellow-200/90 shadow-inner border border-white/50">
                        <div className="absolute inset-x-3 top-1/3 border-t-4 border-yellow-500/40" />
                        <div className="absolute inset-x-3 top-2/3 border-t-4 border-yellow-500/40" />
                        <div className="absolute left-1/3 inset-y-3 border-l-4 border-yellow-500/40" />
                        <div className="absolute left-2/3 inset-y-3 border-l-4 border-yellow-500/40" />
                    </div>

                    <div className="absolute right-[4%] bottom-[6%] h-[38%] w-[38%] rounded-tl-[120px] bg-gradient-to-br from-blue-300 via-cyan-400 to-blue-700 shadow-2xl border-l-4 border-t-4 border-white/50">
                        <div className="chem-river-wave absolute left-[15%] top-[20%] text-2xl opacity-50">〰️</div>
                        <div className="chem-river-wave absolute left-[38%] top-[45%] text-2xl opacity-45">〰️</div>
                        <div className="chem-river-wave absolute left-[62%] top-[28%] text-2xl opacity-45">〰️</div>
                        <div className="chem-river-wave absolute left-[68%] top-[68%] text-2xl opacity-35">〰️</div>

                        <span className="chem-bubble left-[18%] bottom-[10%]" />
                        <span className="chem-bubble left-[42%] bottom-[18%]" />
                        <span className="chem-bubble left-[66%] bottom-[12%]" />
                    </div>

                    <div className="absolute left-[36%] bottom-[9%] h-[18%] w-[36%] -rotate-6 rounded-full bg-gradient-to-r from-blue-300 via-cyan-400 to-blue-600 shadow-lg border border-white/40">
                        <div className="chem-river-wave absolute left-[18%] top-[32%] text-xl opacity-45">〰️</div>
                        <div className="chem-river-wave absolute left-[52%] top-[48%] text-xl opacity-35">〰️</div>
                    </div>

                    {started && (
                        <svg
                            className="pointer-events-none absolute inset-0 z-10 h-full w-full"
                            viewBox="0 0 100 100"
                            preserveAspectRatio="none"
                        >
                            {pollutionSources.map((source) => {
                                const isDiscovered = discoveredSourceIds.includes(source.id)

                                if (!isDiscovered) return null

                                return (
                                    <path
                                        key={source.id}
                                        d={source.path}
                                        className="chem-path"
                                        fill="none"
                                        stroke={source.color}
                                        strokeWidth="1.4"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        opacity="0.9"
                                    />
                                )
                            })}
                        </svg>
                    )}

                    {started && discoveredSourceIds.length > 0 && (
                        <div className="pointer-events-none absolute z-20 right-[25%] bottom-[13%]">
                            <div className="chem-pulse flex h-20 w-20 items-center justify-center rounded-full bg-red-400/35 text-4xl ring-4 ring-white/50 shadow-2xl">
                                ⚠️
                            </div>
                        </div>
                    )}

                    {pollutionSources.map((source) => {
                        const isDiscovered = discoveredSourceIds.includes(source.id)

                        return (
                            <button
                                key={source.id}
                                type="button"
                                onClick={() => handleSourceClick(source)}
                                className={`${source.drift} absolute z-30 flex h-20 w-20 flex-col items-center justify-center rounded-3xl text-center shadow-xl ring-2 transition-all duration-300 active:scale-95 ${started
                                        ? "cursor-pointer"
                                        : "cursor-default"
                                    } ${isDiscovered
                                        ? "bg-emerald-100/90 ring-emerald-300 opacity-75"
                                        : "bg-white/90 ring-white/70 hover:bg-blue-50"
                                    }`}
                                style={{
                                    left: `${source.x}%`,
                                    top: `${source.y}%`,
                                }}
                                title={source.label}
                            >
                                <span className="text-4xl leading-none drop-shadow-sm">
                                    {source.icon}
                                </span>

                                <span className="mt-1 text-[10px] font-extrabold text-blue-950">
                                    {source.shortLabel}
                                </span>

                                {isDiscovered && (
                                    <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400 text-base shadow-lg ring-2 ring-white">
                                        ✓
                                    </span>
                                )}

                                {started && !isDiscovered && (
                                    <span className="chem-pulse absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-amber-300 text-base shadow-lg ring-2 ring-white">
                                        ?
                                    </span>
                                )}
                            </button>
                        )
                    })}

                    {started && !isComplete && (
                        <div className="absolute left-5 bottom-5 z-40 rounded-3xl bg-white/85 p-4 shadow-xl backdrop-blur max-w-md">
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 mb-2">
                                Aufgabe
                            </p>

                            <p className="text-sm font-semibold text-slate-700">
                                Finde alle Quellen, aus denen Chemikalien oder Schadstoffe ins Wasser gelangen können.
                            </p>

                            <div className="mt-3 flex flex-wrap gap-2">
                                {pollutionSources.map((source) => {
                                    const isDiscovered = discoveredSourceIds.includes(source.id)

                                    return (
                                        <span
                                            key={source.id}
                                            className={`rounded-full px-3 py-1 text-xs font-bold ${isDiscovered
                                                    ? "bg-emerald-100 text-emerald-700"
                                                    : "bg-slate-100 text-slate-500"
                                                }`}
                                        >
                                            {isDiscovered ? "✓" : "?"} {source.shortLabel}
                                        </span>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {!started && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center bg-blue-950/35 backdrop-blur-sm p-4">
                            <div className="max-w-xl rounded-3xl bg-white p-7 text-center shadow-2xl">
                                <div className="text-5xl mb-3">⚗️</div>

                                <h2 className="text-2xl font-extrabold text-blue-950">
                                    Schadstoffe sind oft unsichtbar
                                </h2>

                                <p className="mt-3 text-slate-700 leading-relaxed">
                                    Chemikalien können aus Haushalten, Feldern, Fabriken,
                                    Straßen oder Produkten stammen. Untersuche die Landschaft
                                    und verfolge die Spuren bis zum Wasser.
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
                                    Du hast alle Schadstoffquellen gefunden. Jetzt weißt du:
                                    Auch unsichtbare Stoffe können über Abfluss, Straße, Feld
                                    oder Industrie in Bäche, Flüsse und Seen gelangen.
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
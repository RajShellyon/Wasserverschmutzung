import { useRef, useState } from "react"
import NarratorVideo from "../NarratorVideo"

const INTRO_VIDEO = "/videos/Intro_Game_Abwasser.mp4"

const videoByStationId = {
    1: "/videos/Abwasser_Rechen.mp4",
    2: "/videos/Abwasser_Sandfang.mp4",
    3: "/videos/Abwasser_Vorklaerung.mp4",
    4: "/videos/Abwasser_Biologie.mp4",
    5: "/videos/Abwasser_Nachklaerung.mp4",
    6: "/videos/Abwasser_Filter.mp4",
}

const treatmentStations = [
    {
        id: 1,
        icon: "🧱",
        title: "Rechen",
        shortTitle: "Rechen",
        task: "Groben Müll zurückhalten",
        removes: ["Tücher", "Plastikteile", "grober Müll"],
        info:
            "Richtig! Im Rechen bleiben große Dinge hängen, zum Beispiel Tücher, Plastikstücke oder anderer grober Müll.",
        x: 14,
        y: 47,
    },
    {
        id: 2,
        icon: "🪨",
        title: "Sandfang",
        shortTitle: "Sandfang",
        task: "Sand und kleine Steinchen absetzen",
        removes: ["Sand", "Kies", "kleine Steinchen"],
        info:
            "Sehr gut! Im Sandfang sinken schwere Teilchen wie Sand, Kies und kleine Steinchen nach unten.",
        x: 28,
        y: 57,
    },
    {
        id: 3,
        icon: "🟤",
        title: "Vorklärbecken",
        shortTitle: "Vorklärung",
        task: "Schlamm absinken lassen",
        removes: ["Schlamm", "Schwebstoffe"],
        info:
            "Richtig! Im Vorklärbecken sinken viele Schmutzstoffe langsam nach unten und bilden Schlamm.",
        x: 43,
        y: 47,
    },
    {
        id: 4,
        icon: "🦠",
        title: "Biologische Reinigung",
        shortTitle: "Biologie",
        task: "Bakterien helfen beim Reinigen",
        removes: ["gelöster Schmutz", "Nährstoffe"],
        info:
            "Gut gemacht! In der biologischen Reinigung helfen winzige Lebewesen dabei, gelöste Schmutzstoffe abzubauen.",
        x: 58,
        y: 57,
    },
    {
        id: 5,
        icon: "💧",
        title: "Nachklärbecken",
        shortTitle: "Nachklärung",
        task: "Belebtschlamm trennen",
        removes: ["Belebtschlamm", "feine Reste"],
        info:
            "Genau! Im Nachklärbecken setzen sich weitere Reste ab. Das Wasser wird dadurch noch klarer.",
        x: 73,
        y: 47,
    },
    {
        id: 6,
        icon: "🔬",
        title: "Zusätzliche Reinigung",
        shortTitle: "Filter",
        task: "Spurenstoffe weiter verringern",
        removes: ["Spurenstoffe", "Mikroreste"],
        info:
            "Sehr gut! Zusätzliche Filter können helfen, auch sehr kleine oder schwer erkennbare Stoffe weiter zu verringern.",
        x: 87,
        y: 57,
    },
]

const pollutants = [
    {
        id: 1,
        icon: "🧻",
        label: "Tücher",
        removedAt: 1,
    },
    {
        id: 2,
        icon: "🧴",
        label: "Plastikteile",
        removedAt: 1,
    },
    {
        id: 3,
        icon: "🪨",
        label: "Sand",
        removedAt: 2,
    },
    {
        id: 4,
        icon: "🟤",
        label: "Schlamm",
        removedAt: 3,
    },
    {
        id: 5,
        icon: "🧫",
        label: "gelöster Schmutz",
        removedAt: 4,
    },
    {
        id: 6,
        icon: "🌀",
        label: "feine Reste",
        removedAt: 5,
    },
    {
        id: 7,
        icon: "⚗️",
        label: "Spurenstoffe",
        removedAt: 6,
    },
]

export default function AbwasserMission({ mission, onBack }) {
    const narratorAnchorRef = useRef(null)
    const narratorVideoRef = useRef(null)

    const [started, setStarted] = useState(false)
    const [completedStationIds, setCompletedStationIds] = useState([])
    const [feedback, setFeedback] = useState(
        "Klicke auf „Starten“ und begleite das Abwasser durch die Kläranlage.",
    )

    const completedCount = completedStationIds.length
    const currentStation = treatmentStations[completedCount]
    const isComplete = completedCount === treatmentStations.length
    const waterQuality = Math.min(100, Math.round(12 + completedCount * 14.5))

    const dropletPosition = isComplete
        ? { x: 96, y: 42 }
        : {
            x: currentStation?.x ?? 10,
            y: currentStation?.y ?? 50,
        }

    function handleStart() {
        setStarted(true)
        setFeedback(
            "Klicke die Stationen in der richtigen Reihenfolge an. Jede Station reinigt das Abwasser ein Stück weiter.",
        )
    }

    function handleStationClick(station, index) {
        if (!started || isComplete) return

        if (completedStationIds.includes(station.id)) {
            setFeedback(`${station.title}: ${station.info}`)
            return
        }

        if (index > completedCount) {
            const nextStation = treatmentStations[completedCount]

            setFeedback(
                `Noch nicht! Das Abwasser muss zuerst durch die Station „${nextStation.title}“.`,
            )
            return
        }

        const nextVideoSrc = videoByStationId[station.id]

        if (nextVideoSrc) {
            narratorVideoRef.current?.playVideoFromStart(nextVideoSrc)
        }

        setCompletedStationIds((prev) => [...prev, station.id])
        setFeedback(`${station.title}: ${station.info}`)
    }

    function isPollutantRemoved(pollutant) {
        return completedStationIds.some((stationId) => stationId >= pollutant.removedAt)
    }

    return (
        <section className="relative w-screen h-screen overflow-hidden bg-gradient-to-b from-sky-200 via-cyan-200 to-blue-500">
            <NarratorVideo
                ref={narratorVideoRef}
                anchorRef={narratorAnchorRef}
                videoSrc={INTRO_VIDEO}
                preloadSources={[INTRO_VIDEO, ...Object.values(videoByStationId)]}
                initialPosition={{ x: "calc(100vw - 170px)", y: "18px" }}
                inset={0}
                autoPlayInitialVideo
                startAfterFirstUserAction={false}
            />

            <style>
                {`
                    @keyframes sewageWave {
                        0% { transform: translateX(-18px); opacity: 0.22; }
                        50% { transform: translateX(18px); opacity: 0.55; }
                        100% { transform: translateX(-18px); opacity: 0.22; }
                    }

                    @keyframes sewageBubbleRise {
                        0% { transform: translateY(34px) scale(0.75); opacity: 0; }
                        20% { opacity: 0.35; }
                        100% { transform: translateY(-140px) scale(1.08); opacity: 0; }
                    }

                    @keyframes dropletFloat {
                        0% { transform: translate(-50%, -50%) translateY(0) scale(1); }
                        50% { transform: translate(-50%, -50%) translateY(-8px) scale(1.05); }
                        100% { transform: translate(-50%, -50%) translateY(0) scale(1); }
                    }

                    @keyframes stationPulse {
                        0% { box-shadow: 0 0 0 0 rgba(59,130,246,0.45); }
                        70% { box-shadow: 0 0 0 12px rgba(59,130,246,0); }
                        100% { box-shadow: 0 0 0 0 rgba(59,130,246,0); }
                    }

                    @keyframes cleanGlow {
                        0% { filter: brightness(1); }
                        50% { filter: brightness(1.16); }
                        100% { filter: brightness(1); }
                    }

                    .sewage-wave {
                        animation: sewageWave 5.2s ease-in-out infinite;
                    }

                    .sewage-bubble {
                        position: absolute;
                        width: 10px;
                        height: 10px;
                        border-radius: 9999px;
                        background: rgba(255,255,255,0.34);
                        animation: sewageBubbleRise 6.4s ease-in-out infinite;
                    }

                    .sewage-droplet {
                        animation: dropletFloat 2.3s ease-in-out infinite;
                    }

                    .station-active {
                        animation: stationPulse 1.6s ease-in-out infinite;
                    }

                    .clean-glow {
                        animation: cleanGlow 2.4s ease-in-out infinite;
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
                        Der Weg durch die Kläranlage
                    </h1>

                    <p className="text-slate-700 mt-2">
                        Abwasser wird nicht auf einmal sauber. Es durchläuft mehrere Reinigungsstufen.
                    </p>

                    <p className="mt-3 text-sm font-semibold text-blue-900">
                        {feedback}
                    </p>

                    {started && !isComplete && (
                        <div className="mt-4 mx-auto max-w-md">
                            <div className="flex justify-between text-xs font-bold text-blue-900 mb-1">
                                <span>Stationen: {completedCount} von {treatmentStations.length}</span>
                                <span>Wasserqualität: {waterQuality}%</span>
                            </div>

                            <div className="h-3 overflow-hidden rounded-full bg-blue-100 shadow-inner">
                                <div
                                    className="h-full rounded-full bg-cyan-600 transition-all duration-500"
                                    style={{
                                        width: `${waterQuality}%`,
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </header>

                <main className="relative mt-2 flex-1 rounded-3xl border border-white/40 bg-white/15 shadow-inner overflow-hidden touch-none">
                    <div className="absolute inset-0 bg-gradient-to-b from-sky-100/30 via-emerald-100/20 to-blue-500/30" />

                    <div className="absolute left-0 bottom-0 h-[34%] w-[38%] rounded-tr-[120px] bg-gradient-to-br from-slate-200 via-slate-300 to-slate-500 shadow-2xl border-t-4 border-r-4 border-white/40">
                        <div className="absolute left-[12%] top-[22%] text-4xl">🏘️</div>
                        <div className="absolute left-[42%] top-[38%] text-4xl">🏫</div>
                        <div className="absolute left-[68%] top-[20%] text-5xl">🏥</div>
                    </div>

                    <div className="absolute right-0 bottom-0 h-[32%] w-[30%] rounded-tl-[120px] bg-gradient-to-br from-cyan-300 via-blue-400 to-blue-700 shadow-2xl border-l-4 border-t-4 border-white/50">
                        <div className="sewage-wave absolute left-[16%] top-[24%] text-2xl opacity-55">〰️</div>
                        <div className="sewage-wave absolute left-[42%] top-[48%] text-2xl opacity-45">〰️</div>
                        <div className="sewage-wave absolute left-[66%] top-[28%] text-2xl opacity-45">〰️</div>

                        <span className="sewage-bubble left-[18%] bottom-[10%]" />
                        <span className="sewage-bubble left-[45%] bottom-[18%]" />
                        <span className="sewage-bubble left-[70%] bottom-[12%]" />
                    </div>

                    <div className="absolute left-[9%] right-[6%] top-[53%] h-8 -translate-y-1/2 rounded-full bg-slate-700 shadow-xl border-4 border-slate-900/30" />

                    <div
                        className="absolute left-[9%] top-[53%] h-8 -translate-y-1/2 rounded-full bg-gradient-to-r from-amber-700 via-cyan-500 to-blue-300 shadow-xl transition-all duration-700"
                        style={{
                            width: `${Math.max(8, completedCount * 14.5)}%`,
                            opacity: started ? 1 : 0.55,
                        }}
                    />

                    <div className="absolute left-[5%] top-[43%] rounded-3xl bg-white/85 px-4 py-3 text-center shadow-xl">
                        <div className="text-4xl">🚰</div>
                        <p className="text-xs font-extrabold text-blue-950">
                            Abwasser
                        </p>
                    </div>

                    <div className="absolute right-[3%] top-[38%] rounded-3xl bg-white/85 px-4 py-3 text-center shadow-xl">
                        <div className={`text-4xl ${isComplete ? "clean-glow" : ""}`}>
                            🐟
                        </div>
                        <p className="text-xs font-extrabold text-blue-950">
                            Fluss
                        </p>
                    </div>

                    {started && (
                        <div
                            className="sewage-droplet pointer-events-none absolute z-40 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-cyan-100 via-sky-300 to-blue-500 text-4xl shadow-2xl ring-4 ring-white/80 transition-all duration-700"
                            style={{
                                left: `${dropletPosition.x}%`,
                                top: `${dropletPosition.y}%`,
                            }}
                        >
                            💧
                        </div>
                    )}

                    {treatmentStations.map((station, index) => {
                        const isCompleted = completedStationIds.includes(station.id)
                        const isActive = started && index === completedCount && !isComplete
                        const isLocked = started && index > completedCount
                        const isPast = started && index < completedCount

                        return (
                            <button
                                key={station.id}
                                type="button"
                                onClick={() => handleStationClick(station, index)}
                                className={`absolute z-30 flex h-24 w-24 flex-col items-center justify-center rounded-3xl text-center shadow-xl ring-2 transition-all duration-300 active:scale-95 ${isActive ? "station-active bg-blue-600 text-white ring-white cursor-pointer" : ""
                                    } ${isCompleted ? "bg-emerald-100/95 text-blue-950 ring-emerald-300 opacity-85" : ""
                                    } ${isLocked ? "bg-slate-100/80 text-slate-400 ring-white/50 cursor-not-allowed" : ""
                                    } ${!started ? "bg-white/90 text-blue-950 ring-white/70 cursor-default" : ""
                                    } ${started && !isActive && !isCompleted && !isLocked
                                        ? "bg-white/90 text-blue-950 ring-white/70 cursor-pointer"
                                        : ""
                                    }`}
                                style={{
                                    left: `${station.x}%`,
                                    top: `${station.y}%`,
                                    transform: "translate(-50%, -50%)",
                                }}
                                title={station.title}
                            >
                                <span className="text-4xl leading-none drop-shadow-sm">
                                    {station.icon}
                                </span>

                                <span className="mt-1 text-[10px] font-extrabold leading-tight">
                                    {station.shortTitle}
                                </span>

                                {isCompleted && (
                                    <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400 text-base shadow-lg ring-2 ring-white">
                                        ✓
                                    </span>
                                )}

                                {isActive && (
                                    <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-amber-300 text-base shadow-lg ring-2 ring-white">
                                        !
                                    </span>
                                )}

                                {isLocked && (
                                    <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-300 text-base shadow-lg ring-2 ring-white">
                                        🔒
                                    </span>
                                )}

                                {isPast && (
                                    <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/90 px-2 py-1 text-[9px] font-bold text-emerald-700 shadow">
                                        gereinigt
                                    </span>
                                )}
                            </button>
                        )
                    })}

                    {started && !isComplete && (
                        <div className="absolute left-5 bottom-5 z-50 rounded-3xl bg-white/85 p-4 shadow-xl backdrop-blur max-w-lg">
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 mb-2">
                                Schmutz im Abwasser
                            </p>

                            <div className="flex flex-wrap gap-2">
                                {pollutants.map((pollutant) => {
                                    const removed = isPollutantRemoved(pollutant)

                                    return (
                                        <span
                                            key={pollutant.id}
                                            className={`rounded-full px-3 py-2 text-xs font-bold shadow-sm transition ${removed
                                                    ? "bg-emerald-100 text-emerald-700 opacity-70 line-through"
                                                    : "bg-amber-100 text-amber-800"
                                                }`}
                                        >
                                            <span className="mr-1">{pollutant.icon}</span>
                                            {pollutant.label}
                                        </span>
                                    )
                                })}
                            </div>

                            {currentStation && (
                                <p className="mt-3 text-sm font-semibold text-slate-700">
                                    Nächster Schritt: {currentStation.task}
                                </p>
                            )}
                        </div>
                    )}

                    {!started && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center bg-blue-950/35 backdrop-blur-sm p-4">
                            <div className="max-w-xl rounded-3xl bg-white p-7 text-center shadow-2xl">
                                <div className="text-5xl mb-3">🚰</div>

                                <h2 className="text-2xl font-extrabold text-blue-950">
                                    Wie wird Abwasser sauberer?
                                </h2>

                                <p className="mt-3 text-slate-700 leading-relaxed">
                                    Abwasser entsteht überall dort, wo Menschen Wasser benutzen.
                                    Begleite einen Tropfen durch die Kläranlage und aktiviere
                                    jede Reinigungsstufe in der richtigen Reihenfolge.
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
                                    Du hast das Abwasser durch alle Reinigungsstufen geführt.
                                    Jetzt weißt du: In einer Kläranlage wird Wasser Schritt für
                                    Schritt sauberer, bevor es zurück in die Umwelt gelangt.
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
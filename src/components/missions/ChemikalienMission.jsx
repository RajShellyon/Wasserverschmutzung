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

const allVideoSources = [INTRO_VIDEO, ...Object.values(videoBySourceId)]

const pollutionSources = [
    {
        id: 1,
        icon: "🏠",
        label: "Haushalt",
        shortLabel: "Abfluss",
        transportIcon: "🚿",
        transport: "Abflussrohr",
        waterTarget: "Kanal → Fluss",
        color: "#ec4899",
        bg: "#fce7f3",
        x: 12,
        y: 47,
        route: "M 13 53 C 24 57 31 62 40 66 C 50 71 58 75 69 78",
        routeSteps: [
            { n: 1, title: "Quelle", text: "Haushalt", x: 12, y: 47 },
            { n: 2, title: "Weg", text: "Abflussrohr", x: 39, y: 64 },
            { n: 3, title: "Wasser", text: "Fluss", x: 69, y: 78 },
        ],
        info:
            "Im Haushalt können Stoffe aus Waschbecken, Dusche oder Toilette ins Abwasser gelangen. Nicht alles wird sofort vollständig entfernt.",
        solutions: [
            { id: "dispose", icon: "🧴", title: "Reste richtig entsorgen", text: "Nichts Problematisches in Waschbecken oder Toilette kippen.", correct: true },
            { id: "sink", icon: "🚿", title: "In den Abfluss", text: "Dann startet der Weg ins Abwasser erst recht.", correct: false },
            { id: "mix", icon: "🧪", title: "Mehr mischen", text: "Mehr Stoffe machen das Wasser nicht sauberer.", correct: false },
        ],
    },
    {
        id: 2,
        icon: "🚜",
        label: "Landwirtschaft",
        shortLabel: "Feld",
        transportIcon: "🌧️",
        transport: "Regenrinne am Feld",
        waterTarget: "Graben → Bach",
        color: "#65a30d",
        bg: "#ecfccb",
        x: 23,
        y: 23,
        route: "M 24 30 C 30 38 34 48 43 57 C 51 65 59 71 70 78",
        routeSteps: [
            { n: 1, title: "Quelle", text: "Feld", x: 23, y: 23 },
            { n: 2, title: "Weg", text: "Regen spült", x: 42, y: 56 },
            { n: 3, title: "Wasser", text: "Bach", x: 70, y: 78 },
        ],
        info:
            "Von Feldern können Dünger, Pflanzenschutzmittel oder andere Stoffe durch Regen in Bäche und Flüsse gespült werden.",
        solutions: [
            { id: "buffer", icon: "🌿", title: "Grünstreifen am Bach", text: "Pflanzenstreifen können Stoffe abbremsen, bevor sie ins Wasser rutschen.", correct: true },
            { id: "rain", icon: "🌧️", title: "Vor Regen düngen", text: "Regen kann Stoffe dann besonders schnell wegspülen.", correct: false },
            { id: "ditch", icon: "↘️", title: "Direkter Graben", text: "Ein direkter Weg zum Bach erhöht das Risiko.", correct: false },
        ],
    },
    {
        id: 3,
        icon: "🏭",
        label: "Industrie",
        shortLabel: "Fabrik",
        transportIcon: "🔧",
        transport: "Prüfrohr",
        waterTarget: "gereinigt → Fluss",
        color: "#64748b",
        bg: "#e2e8f0",
        x: 75,
        y: 29,
        route: "M 75 36 C 72 45 70 54 71 64 C 72 70 72 74 69 79",
        routeSteps: [
            { n: 1, title: "Quelle", text: "Fabrik", x: 75, y: 29 },
            { n: 2, title: "Weg", text: "Rohr/Abwasser", x: 70, y: 59 },
            { n: 3, title: "Wasser", text: "Fluss", x: 69, y: 79 },
        ],
        info:
            "Industrieanlagen müssen sorgfältig mit Chemikalien umgehen, damit Schadstoffe nicht über Rohre, Böden oder Abwasser in Gewässer gelangen.",
        solutions: [
            { id: "test", icon: "🧫", title: "Abwasser prüfen", text: "Kontrollieren, reinigen und erst dann sicher ableiten.", correct: true },
            { id: "hide", icon: "🕳️", title: "Rohr verstecken", text: "Verstecken löst keine Verschmutzung.", correct: false },
            { id: "faster", icon: "🏃", title: "Schneller ableiten", text: "Schneller bedeutet nicht sauberer.", correct: false },
        ],
    },
    {
        id: 4,
        icon: "💊",
        label: "Medikamente",
        shortLabel: "Medizin",
        transportIcon: "🚽",
        transport: "Toilette/Waschbecken",
        waterTarget: "Abwasser → Fluss",
        color: "#a855f7",
        bg: "#f3e8ff",
        x: 87,
        y: 17,
        route: "M 86 25 C 82 36 78 47 75 59 C 73 68 72 75 69 79",
        routeSteps: [
            { n: 1, title: "Quelle", text: "Medizin", x: 87, y: 17 },
            { n: 2, title: "Weg", text: "falsch entsorgt", x: 75, y: 57 },
            { n: 3, title: "Wasser", text: "Fluss", x: 69, y: 79 },
        ],
        info:
            "Medikamente dürfen nicht über Toilette oder Waschbecken entsorgt werden, weil Rückstände sonst ins Abwasser gelangen können.",
        solutions: [
            { id: "pharmacy", icon: "🏥", title: "Richtig abgeben", text: "Nach örtlicher Regel entsorgen, zum Beispiel Apotheke oder Restmüll.", correct: true },
            { id: "toilet", icon: "🚽", title: "Toilette benutzen", text: "Dann gelangen Rückstände direkt ins Abwasser.", correct: false },
            { id: "crush", icon: "🔨", title: "Zerdrücken", text: "Zerdrücken macht Wirkstoffe nicht unschädlich.", correct: false },
        ],
    },
    {
        id: 5,
        icon: "🕳️",
        label: "Gully",
        shortLabel: "Straße",
        transportIcon: "🛣️",
        transport: "Regenkanal",
        waterTarget: "Kanal → Bach",
        color: "#0f172a",
        bg: "#e5e7eb",
        x: 42,
        y: 56,
        route: "M 43 63 C 49 66 57 71 69 78",
        routeSteps: [
            { n: 1, title: "Quelle", text: "Straße", x: 42, y: 56 },
            { n: 2, title: "Weg", text: "Gully", x: 52, y: 68 },
            { n: 3, title: "Wasser", text: "Bach", x: 69, y: 78 },
        ],
        info:
            "Regen spült Stoffe von Straßen in Gullys. Von dort können sie über Kanäle und Bäche weitertransportiert werden.",
        solutions: [
            { id: "keepclean", icon: "🚯", title: "Nichts in den Gully", text: "Gullys sind keine Mülleimer und führen oft weiter Richtung Wasser.", correct: true },
            { id: "wash", icon: "🧽", title: "Am Gully waschen", text: "Schmutzwasser kann dadurch direkt hineinlaufen.", correct: false },
            { id: "sweep", icon: "💨", title: "Reinkehren", text: "Dann landet der Stoff im Regenkanal.", correct: false },
        ],
    },
    {
        id: 6,
        icon: "🧴",
        label: "Reinigungsmittel",
        shortLabel: "Putzmittel",
        transportIcon: "🫧",
        transport: "Schaum im Abfluss",
        waterTarget: "Kläranlage → Fluss",
        color: "#06b6d4",
        bg: "#cffafe",
        x: 58,
        y: 43,
        route: "M 59 50 C 61 59 64 70 69 79",
        routeSteps: [
            { n: 1, title: "Quelle", text: "Putzmittel", x: 58, y: 43 },
            { n: 2, title: "Weg", text: "Schaum/Abfluss", x: 63, y: 65 },
            { n: 3, title: "Wasser", text: "Fluss", x: 69, y: 79 },
        ],
        info:
            "Reinigungsmittel können Stoffe enthalten, die für Wasserlebewesen problematisch sind, wenn sie in großen Mengen ins Wasser gelangen.",
        solutions: [
            { id: "dose", icon: "🥄", title: "Sparsam dosieren", text: "Nur so viel benutzen wie nötig und passende Mittel wählen.", correct: true },
            { id: "more", icon: "🫧", title: "Mehr Schaum", text: "Viel Schaum bedeutet nicht automatisch sauberer.", correct: false },
            { id: "mixall", icon: "🧪", title: "Alles mischen", text: "Mischen kann gefährlich sein und hilft dem Wasser nicht.", correct: false },
        ],
    },
]

function getSourceById(id) {
    return pollutionSources.find((source) => source.id === id) ?? null
}

export default function ChemikalienMission({ mission, onBack }) {
    const narratorAnchorRef = useRef(null)
    const narratorVideoRef = useRef(null)

    const [started, setStarted] = useState(false)
    const [activeSourceId, setActiveSourceId] = useState(null)
    const [modalStage, setModalStage] = useState("map")
    const [discoveredSourceIds, setDiscoveredSourceIds] = useState([])
    const [wrongSolutionId, setWrongSolutionId] = useState(null)
    const [message, setMessage] = useState("Starte die Wegekarte und untersuche, wo unsichtbare Stoffe ins Wasser gelangen.")

    const activeSource = getSourceById(activeSourceId)
    const discoveredCount = discoveredSourceIds.length
    const totalSources = pollutionSources.length
    const isComplete = discoveredCount === totalSources
    const progressPercent = Math.round((discoveredCount / totalSources) * 100)

    function handleStart() {
        setStarted(true)
        setMessage("Klicke eine Quelle an. Dann wird ihr Wasserweg als klare Pfeilkette sichtbar: Quelle → Weg → Gewässer.")
    }

    function handleSourceClick(source) {
        if (!started || isComplete) return

        setActiveSourceId(source.id)
        setModalStage("narrator")
        setWrongSolutionId(null)
        setMessage(`${source.label}: Folge den farbigen Pfeilen. Du siehst jetzt genau, welchen Weg der Stoff nimmt.`)

        const nextVideoSrc = videoBySourceId[source.id]
        if (nextVideoSrc) {
            narratorVideoRef.current?.playVideoFromStart(nextVideoSrc)
        }
    }

    function handleSolutionClick(solution) {
        if (!activeSource || modalStage !== "protect") return

        if (!solution.correct) {
            setWrongSolutionId(solution.id)
            setMessage("Fast! Diese Idee stoppt den Weg noch nicht gut genug. Such die Karte, die verhindert, dass der Stoff überhaupt ins Wasser gelangt.")
            window.setTimeout(() => setWrongSolutionId(null), 850)
            return
        }

        setWrongSolutionId(null)
        setDiscoveredSourceIds((prev) => (prev.includes(activeSource.id) ? prev : [...prev, activeSource.id]))
        setModalStage("badge")
        setMessage(`${activeSource.shortLabel} gesichert: Quelle, Weg und Schutzidee sind verbunden.`)
    }

    function closeActiveSource() {
        setActiveSourceId(null)
        setModalStage("map")
        setWrongSolutionId(null)

        if (!isComplete) {
            setMessage("Wähle die nächste Quelle. Jede Farbe zeigt einen eigenen, klaren Weg zum Gewässer.")
        }
    }

    function resetMission() {
        setStarted(false)
        setActiveSourceId(null)
        setModalStage("map")
        setDiscoveredSourceIds([])
        setWrongSolutionId(null)
        setMessage("Starte die Wegekarte und untersuche, wo unsichtbare Stoffe ins Wasser gelangen.")
    }

    return (
        <section className="relative h-screen w-screen overflow-hidden bg-[#082f49] text-slate-950">
            <div className="relative z-[120]">
                <NarratorVideo
                    ref={narratorVideoRef}
                    anchorRef={narratorAnchorRef}
                    videoSrc={INTRO_VIDEO}
                    preloadSources={allVideoSources}
                    initialPosition={{ x: "calc(100vw - 170px)", y: "18px" }}
                    inset={0}
                    autoPlayInitialVideo
                    startAfterFirstUserAction={false}
                />
            </div>

            <style>
                {`
                    @keyframes chemRouteDraw {
                        from { stroke-dashoffset: 190; }
                        to { stroke-dashoffset: 0; }
                    }

                    @keyframes chemRouteGlow {
                        0%, 100% { filter: drop-shadow(0 0 4px rgba(255,255,255,0.65)); }
                        50% { filter: drop-shadow(0 0 13px rgba(255,255,255,0.95)); }
                    }

                    @keyframes chemBob {
                        0%, 100% { transform: translate(-50%, -50%) translateY(0); }
                        50% { transform: translate(-50%, -50%) translateY(-5px); }
                    }

                    @keyframes chemSignalPulse {
                        0% { transform: scale(0.78); opacity: 0.6; }
                        65% { opacity: 0.08; }
                        100% { transform: scale(1.55); opacity: 0; }
                    }

                    @keyframes chemCardWiggle {
                        0%, 100% { transform: rotate(0deg); }
                        20% { transform: rotate(-3deg) scale(1.02); }
                        40% { transform: rotate(3deg) scale(1.02); }
                        60% { transform: rotate(-2deg) scale(1.01); }
                        80% { transform: rotate(2deg) scale(1.01); }
                    }

                    @keyframes chemBadgePop {
                        0% { transform: scale(0.55) rotate(-9deg); opacity: 0; }
                        60% { transform: scale(1.12) rotate(4deg); opacity: 1; }
                        100% { transform: scale(1) rotate(0deg); opacity: 1; }
                    }

                    @keyframes chemWaterMove {
                        0%, 100% { transform: translateX(-10px); opacity: 0.35; }
                        50% { transform: translateX(10px); opacity: 0.7; }
                    }

                    .chem-route-active {
                        stroke-dasharray: 190;
                        stroke-dashoffset: 190;
                        animation: chemRouteDraw 1.05s ease-out forwards, chemRouteGlow 2.2s ease-in-out infinite;
                    }

                    .chem-source-bob { animation: chemBob 3.4s ease-in-out infinite; }
                    .chem-signal-pulse { animation: chemSignalPulse 1.5s ease-out infinite; }
                    .chem-card-wiggle { animation: chemCardWiggle 0.55s ease-in-out; }
                    .chem-badge-pop { animation: chemBadgePop 0.5s cubic-bezier(.17,.84,.44,1) both; }
                    .chem-water-move { animation: chemWaterMove 4.6s ease-in-out infinite; }
                `}
            </style>

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(255,255,255,0.75),transparent_21%),radial-gradient(circle_at_78%_28%,rgba(125,211,252,0.65),transparent_26%),linear-gradient(180deg,#c7f9ff_0%,#89f0ff_34%,#0ea5e9_100%)]" />
            <div className="absolute inset-0 opacity-[0.18] bg-[linear-gradient(rgba(255,255,255,.55)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.55)_1px,transparent_1px)] bg-[length:72px_72px]" />

            <div ref={narratorAnchorRef} className="pointer-events-none absolute right-44 top-5 z-[110] h-20 w-20" />

            <div className="relative z-10 flex h-full flex-col p-4 md:p-6">
                <div className="flex items-start justify-between gap-4">
                    <header className="max-w-[540px] rounded-[2rem] border-2 border-white/70 bg-white/84 p-4 shadow-2xl backdrop-blur-md md:p-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-cyan-100 text-3xl shadow-inner">
                                {mission?.icon ?? "⚗️"}
                            </div>
                            <div>
                                <p className="text-[11px] font-black uppercase tracking-[0.32em] text-cyan-700">
                                    Mission {mission?.id ?? 3}
                                </p>
                                <h1 className="text-2xl font-black leading-tight text-slate-950 md:text-3xl">
                                    Chemikalien-Wegekarte
                                </h1>
                            </div>
                        </div>
                        <p className="mt-3 text-sm font-semibold leading-relaxed text-slate-700 md:text-base">
                            {message}
                        </p>
                    </header>

                    <div className="hidden max-w-[420px] rounded-[2rem] border-2 border-white/60 bg-slate-950/76 p-4 text-white shadow-2xl backdrop-blur-md lg:block">
                        <div className="flex items-center justify-between gap-4">
                            <p className="text-[11px] font-black uppercase tracking-[0.35em] text-cyan-200">Leseschlüssel</p>
                            <span className="rounded-full bg-cyan-100 px-3 py-1 text-sm font-black text-cyan-900">{progressPercent}%</span>
                        </div>
                        <div className="mt-3 flex items-center justify-between gap-2 text-center text-sm font-black">
                            <span className="rounded-2xl bg-white/12 px-3 py-2">1 Quelle</span>
                            <span className="text-cyan-200">→</span>
                            <span className="rounded-2xl bg-white/12 px-3 py-2">2 Weg</span>
                            <span className="text-cyan-200">→</span>
                            <span className="rounded-2xl bg-white/12 px-3 py-2">3 Gewässer</span>
                        </div>
                        <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/15 shadow-inner">
                            <div
                                className="h-full rounded-full bg-cyan-300 transition-all duration-500"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onBack}
                        className="rounded-2xl border-2 border-white/70 bg-white px-5 py-3 text-sm font-black text-cyan-800 shadow-xl transition hover:-translate-y-0.5 hover:bg-cyan-50 active:scale-95"
                    >
                        Zurück
                    </button>
                </div>

                <main className="relative mt-4 flex-1 overflow-hidden rounded-[2.4rem] border-2 border-white/60 bg-white/20 shadow-[inset_0_-90px_110px_rgba(8,47,73,0.3)] touch-none">
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(236,253,245,.35)_0%,rgba(187,247,208,.38)_55%,rgba(14,116,144,.2)_100%)]" />

                    <div className="absolute left-0 top-[4%] h-[66%] w-[66%] rounded-br-[8rem] bg-[linear-gradient(135deg,#bbf7d0_0%,#84cc16_50%,#22c55e_100%)] opacity-95 shadow-inner" />
                    <div className="absolute right-0 top-[10%] h-[59%] w-[47%] rounded-bl-[7rem] bg-[linear-gradient(225deg,#dcfce7_0%,#86efac_45%,#16a34a_100%)] opacity-90 shadow-inner" />

                    <div className="absolute left-[7%] top-[16%] h-[26%] w-[24%] rounded-[2rem] border-4 border-white/55 bg-yellow-200/90 shadow-xl">
                        <div className="absolute left-4 right-4 top-1/3 border-t-4 border-yellow-500/35" />
                        <div className="absolute left-4 right-4 top-2/3 border-t-4 border-yellow-500/35" />
                        <div className="absolute bottom-4 left-1/3 top-4 border-l-4 border-yellow-500/35" />
                        <div className="absolute bottom-4 left-2/3 top-4 border-l-4 border-yellow-500/35" />
                        <div className="absolute left-4 top-3 rounded-full bg-white/80 px-3 py-1 text-xs font-black text-yellow-800 shadow">Feld</div>
                    </div>

                    <div className="absolute left-[29%] top-[51%] h-[16%] w-[31%] -rotate-6 rounded-[2rem] border-4 border-white/40 bg-slate-600/78 shadow-xl">
                        <div className="absolute left-0 right-0 top-1/2 border-t-4 border-dashed border-yellow-200/80" />
                        <div className="absolute left-[37%] top-[27%] rounded-full bg-slate-900 px-3 py-1 text-xs font-black text-white shadow">Straße + Gully</div>
                    </div>

                    <div className="absolute right-[4%] bottom-[4%] h-[44%] w-[44%] rounded-tl-[10rem] border-l-4 border-t-4 border-white/60 bg-[linear-gradient(135deg,#7dd3fc_0%,#06b6d4_42%,#075985_100%)] shadow-2xl">
                        <div className="absolute left-[15%] top-[18%] rounded-3xl bg-white/86 px-4 py-2 text-sm font-black text-cyan-900 shadow-lg">Fluss / See</div>
                        <span className="chem-water-move absolute left-[18%] top-[40%] text-3xl opacity-55">〰️</span>
                        <span className="chem-water-move absolute left-[42%] top-[60%] text-3xl opacity-45" style={{ animationDelay: "0.7s" }}>〰️</span>
                        <span className="chem-water-move absolute left-[67%] top-[35%] text-3xl opacity-45" style={{ animationDelay: "1.2s" }}>〰️</span>
                        <span className="absolute bottom-[12%] right-[18%] text-5xl opacity-80">🐟</span>
                        <span className="absolute bottom-[26%] left-[22%] text-5xl opacity-75">🌿</span>
                    </div>

                    <div className="absolute left-[43%] bottom-[13%] h-[17%] w-[30%] -rotate-5 rounded-full border-4 border-white/45 bg-[linear-gradient(90deg,#93c5fd_0%,#22d3ee_48%,#0891b2_100%)] shadow-xl">
                        <div className="absolute left-[13%] top-[35%] rounded-full bg-white/82 px-3 py-1 text-xs font-black text-cyan-900 shadow">Bach sammelt Wege</div>
                        <span className="chem-water-move absolute left-[42%] top-[48%] text-2xl opacity-55">〰️</span>
                    </div>

                    {started && (
                        <svg
                            className="pointer-events-none absolute inset-0 z-20 h-full w-full"
                            viewBox="0 0 100 100"
                            preserveAspectRatio="none"
                        >
                            <defs>
                                {pollutionSources.map((source) => (
                                    <marker
                                        key={source.id}
                                        id={`chem-arrow-${source.id}`}
                                        viewBox="0 0 10 10"
                                        refX="8"
                                        refY="5"
                                        markerWidth="4"
                                        markerHeight="4"
                                        orient="auto-start-reverse"
                                    >
                                        <path d="M 0 0 L 10 5 L 0 10 z" fill={source.color} />
                                    </marker>
                                ))}
                            </defs>

                            {pollutionSources.map((source) => {
                                const isActive = activeSourceId === source.id
                                const isDiscovered = discoveredSourceIds.includes(source.id)

                                if (!isActive && !isDiscovered) {
                                    return (
                                        <path
                                            key={`ghost-${source.id}`}
                                            d={source.route}
                                            fill="none"
                                            stroke="rgba(255,255,255,0.62)"
                                            strokeWidth="0.75"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeDasharray="2 3"
                                            opacity="0.62"
                                        />
                                    )
                                }

                                return (
                                    <g key={`route-${source.id}`}>
                                        <path
                                            d={source.route}
                                            className={isActive ? "chem-route-active" : ""}
                                            fill="none"
                                            stroke={source.color}
                                            strokeWidth={isActive ? "2.3" : "1.45"}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            markerEnd={`url(#chem-arrow-${source.id})`}
                                            opacity={isActive ? "0.98" : "0.7"}
                                        />
                                        {isActive && (
                                            <>
                                                <circle r="1.05" fill={source.color} opacity="0.95">
                                                    <animateMotion dur="2.3s" repeatCount="indefinite" path={source.route} />
                                                </circle>
                                                <circle r="0.75" fill="white" opacity="0.9">
                                                    <animateMotion dur="2.3s" begin="0.45s" repeatCount="indefinite" path={source.route} />
                                                </circle>
                                            </>
                                        )}
                                    </g>
                                )
                            })}
                        </svg>
                    )}

                    {activeSource && (
                        <div className="pointer-events-none absolute inset-0 z-30">
                            {activeSource.routeSteps.map((step) => (
                                <div
                                    key={step.n}
                                    className="absolute -translate-x-1/2 -translate-y-1/2 rounded-2xl border-2 border-white bg-white/95 px-3 py-2 text-center shadow-xl"
                                    style={{ left: `${step.x}%`, top: `${step.y}%` }}
                                >
                                    <div
                                        className="mx-auto mb-1 flex h-7 w-7 items-center justify-center rounded-full text-sm font-black text-white shadow"
                                        style={{ backgroundColor: activeSource.color }}
                                    >
                                        {step.n}
                                    </div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-500">{step.title}</p>
                                    <p className="text-xs font-black text-slate-950">{step.text}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {pollutionSources.map((source) => {
                        const isActive = activeSourceId === source.id
                        const isDiscovered = discoveredSourceIds.includes(source.id)

                        return (
                            <button
                                key={source.id}
                                type="button"
                                onClick={() => handleSourceClick(source)}
                                disabled={!started || isComplete}
                                className={`chem-source-bob absolute z-40 flex w-[112px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-[1.6rem] border-4 p-2 text-center shadow-2xl transition hover:-translate-y-[calc(50%+4px)] active:scale-95 ${started ? "cursor-pointer" : "cursor-default"} ${isActive ? "border-white ring-4 ring-white/70" : "border-white/75"} ${isDiscovered ? "opacity-80 grayscale-[0.2]" : ""}`}
                                style={{
                                    left: `${source.x}%`,
                                    top: `${source.y}%`,
                                    backgroundColor: source.bg,
                                    animationDelay: `${source.id * 0.12}s`,
                                }}
                                title={started ? source.label : undefined}
                            >
                                <div className="text-4xl leading-none drop-shadow-sm">{source.icon}</div>
                                <div className="mt-1 rounded-full bg-white/82 px-3 py-1 text-[11px] font-black text-slate-900 shadow-inner">{source.shortLabel}</div>

                                {started && !isDiscovered && !isActive && (
                                    <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-amber-300 text-sm font-black shadow-lg ring-2 ring-white">
                                        ?
                                    </span>
                                )}

                                {isActive && (
                                    <span className="absolute -right-2 -top-2 flex h-9 w-9 items-center justify-center rounded-full text-base font-black text-white shadow-lg ring-2 ring-white" style={{ backgroundColor: source.color }}>
                                        →
                                    </span>
                                )}

                                {isDiscovered && (
                                    <span className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400 text-base font-black shadow-lg ring-2 ring-white">
                                        ✓
                                    </span>
                                )}
                            </button>
                        )
                    })}

                    {activeSource && (
                        <div className="absolute left-1/2 top-4 z-50 w-[min(760px,calc(100%-2rem))] -translate-x-1/2 rounded-[1.7rem] border-2 border-white bg-white/92 p-3 shadow-2xl backdrop-blur-md">
                            <div className="flex flex-wrap items-center justify-center gap-2 text-sm font-black text-slate-900">
                                <span className="rounded-2xl px-3 py-2 text-white shadow" style={{ backgroundColor: activeSource.color }}>
                                    {activeSource.icon} {activeSource.label}
                                </span>
                                <span className="text-cyan-700">→</span>
                                <span className="rounded-2xl bg-slate-100 px-3 py-2 shadow-inner">
                                    {activeSource.transportIcon} {activeSource.transport}
                                </span>
                                <span className="text-cyan-700">→</span>
                                <span className="rounded-2xl bg-cyan-100 px-3 py-2 shadow-inner">
                                    💧 {activeSource.waterTarget}
                                </span>
                            </div>
                        </div>
                    )}

                    {started && !activeSource && !isComplete && (
                        <div className="absolute bottom-5 left-5 z-50 max-w-xl rounded-[2rem] border-2 border-white bg-white/88 p-4 shadow-2xl backdrop-blur-md">
                            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-cyan-700">Aufgabe</p>
                            <p className="mt-1 text-sm font-bold text-slate-700">Wähle eine Quelle. Die grauen Linien sind mögliche Wege. Beim Anklicken wird eine klare farbige Pfeilroute daraus.</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {pollutionSources.map((source) => {
                                    const isDiscovered = discoveredSourceIds.includes(source.id)
                                    return (
                                        <span key={source.id} className={`rounded-full px-3 py-1 text-xs font-black ${isDiscovered ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                                            {isDiscovered ? "✓" : "?"} {source.shortLabel}
                                        </span>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {!started && (
                        <div className="absolute inset-0 z-[90] flex items-center justify-center bg-cyan-950/35 p-4 backdrop-blur-sm">
                            <div className="max-w-xl rounded-[2.4rem] border-4 border-white bg-white/96 p-7 text-center shadow-2xl">
                                <div className="text-6xl">🧭⚗️</div>
                                <h2 className="mt-4 text-3xl font-black text-slate-950">Schadstoff-Wege lesen</h2>
                                <p className="mt-3 text-base font-semibold leading-relaxed text-slate-700">
                                    Du bekommst eine Karte mit Quellen, Pfeilen und einem Gewässer. Finde heraus: Wo startet der Stoff, welchen Weg nimmt er und wie stoppen wir ihn?
                                </p>
                                <button
                                    type="button"
                                    onClick={handleStart}
                                    className="mt-6 rounded-3xl bg-cyan-600 px-8 py-4 text-lg font-black text-white shadow-xl transition hover:-translate-y-1 hover:bg-cyan-700 active:scale-95"
                                >
                                    Wegekarte starten
                                </button>
                            </div>
                        </div>
                    )}

                    {isComplete && !activeSource && (
                        <div className="absolute inset-0 z-[95] flex items-center justify-center bg-cyan-950/35 p-4 backdrop-blur-sm">
                            <div className="max-w-2xl rounded-[2.4rem] border-4 border-white bg-white/96 p-8 text-center shadow-2xl">
                                <div className="text-6xl">🎉💧</div>
                                <h2 className="mt-4 text-3xl font-black text-slate-950 md:text-4xl">Alle Wege verstanden!</h2>
                                <p className="mx-auto mt-3 max-w-xl text-base font-semibold leading-relaxed text-slate-700">
                                    Du hast jede Quelle, ihren Transportweg und eine passende Schutzidee gefunden. Unsichtbare Stoffe werden verständlich, wenn man ihren Weg verfolgt.
                                </p>
                                <div className="mt-6 flex flex-wrap justify-center gap-3">
                                    <button
                                        type="button"
                                        onClick={onBack}
                                        className="rounded-3xl bg-cyan-600 px-7 py-4 text-sm font-black text-white shadow-xl transition hover:bg-cyan-700 active:scale-95"
                                    >
                                        Zur Kursauswahl
                                    </button>
                                    <button
                                        type="button"
                                        onClick={resetMission}
                                        className="rounded-3xl bg-white px-7 py-4 text-sm font-black text-cyan-800 shadow-xl ring-2 ring-cyan-100 transition hover:bg-cyan-50 active:scale-95"
                                    >
                                        Nochmal spielen
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>

                <div className="mt-4 rounded-[2rem] border-2 border-white/60 bg-white/82 p-3 shadow-2xl backdrop-blur-md">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="rounded-2xl bg-slate-950 px-4 py-3 text-white shadow-inner">
                                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-200">Wege-Album</p>
                                <p className="text-sm font-black">{discoveredCount} von {totalSources} erklärt</p>
                            </div>
                            <div className="h-4 w-40 overflow-hidden rounded-full bg-slate-200 shadow-inner md:w-64">
                                <div className="h-full rounded-full bg-cyan-500 transition-all duration-500" style={{ width: `${progressPercent}%` }} />
                            </div>
                        </div>

                        <div className="flex flex-wrap justify-center gap-2">
                            {pollutionSources.map((source) => {
                                const isDiscovered = discoveredSourceIds.includes(source.id)
                                return (
                                    <div
                                        key={source.id}
                                        className={`flex h-13 min-h-[52px] min-w-[52px] items-center justify-center rounded-2xl border-2 text-2xl shadow-md transition ${isDiscovered ? "chem-badge-pop border-emerald-200 bg-white" : "border-white/60 bg-slate-200 text-slate-400"}`}
                                        title={source.label}
                                    >
                                        {isDiscovered ? source.icon : "?"}
                                    </div>
                                )
                            })}
                        </div>

                        <div className="rounded-2xl bg-cyan-100 px-4 py-3 text-sm font-black text-cyan-900 lg:hidden">
                            Quelle → Weg → Gewässer
                        </div>
                    </div>
                </div>
            </div>

            {activeSource && modalStage === "narrator" && (
                <div className="fixed bottom-5 right-5 z-[130] w-[min(430px,calc(100vw-2rem))] rounded-[1.7rem] border-4 border-white bg-cyan-50/96 p-4 shadow-2xl backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.2rem] text-3xl shadow-lg" style={{ backgroundColor: activeSource.bg }}>
                            {activeSource.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-700">Narrator aktiv</p>
                            <p className="mt-1 text-sm font-black leading-tight text-slate-900">Video ansehen, dann den Schutzpunkt wählen.</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setModalStage("protect")}
                            className="shrink-0 rounded-2xl bg-cyan-600 px-4 py-3 text-sm font-black text-white shadow-lg transition hover:bg-cyan-700 active:scale-95"
                        >
                            Weiter
                        </button>
                    </div>
                </div>
            )}

            {activeSource && modalStage === "protect" && (
                <div className="fixed bottom-5 left-1/2 z-[135] w-[min(980px,calc(100vw-2rem))] -translate-x-1/2 rounded-[2rem] border-4 border-white bg-white/96 p-4 shadow-2xl backdrop-blur-md">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                        <div className="md:w-[240px]">
                            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-cyan-700">Schutzpunkt</p>
                            <h3 className="mt-1 text-xl font-black text-slate-950">Was stoppt diesen Weg?</h3>
                            <p className="mt-2 text-sm font-semibold text-slate-600">Wähle die Karte, die schon an der Quelle hilft.</p>
                        </div>
                        <div className="grid flex-1 gap-3 md:grid-cols-3">
                            {activeSource.solutions.map((solution) => {
                                const isWrong = wrongSolutionId === solution.id
                                return (
                                    <button
                                        key={solution.id}
                                        type="button"
                                        onClick={() => handleSolutionClick(solution)}
                                        className={`rounded-[1.5rem] border-4 bg-white p-4 text-left shadow-xl transition hover:-translate-y-1 hover:border-cyan-200 active:scale-95 ${isWrong ? "chem-card-wiggle border-rose-200 bg-rose-50" : "border-cyan-50"}`}
                                    >
                                        <div className="text-4xl">{solution.icon}</div>
                                        <h4 className="mt-2 text-base font-black text-slate-950">{solution.title}</h4>
                                        <p className="mt-1 text-xs font-semibold leading-relaxed text-slate-600">{solution.text}</p>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>
            )}

            {activeSource && modalStage === "badge" && (
                <div className="fixed bottom-5 right-5 z-[135] w-[min(410px,calc(100vw-2rem))] rounded-[1.8rem] border-4 border-white bg-emerald-50/96 p-5 text-center shadow-2xl backdrop-blur-md">
                    <div className="chem-badge-pop mx-auto flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-white text-5xl shadow-xl">
                        {activeSource.icon}
                    </div>
                    <h3 className="mt-3 text-2xl font-black text-slate-950">Weg verstanden!</h3>
                    <p className="mt-2 text-sm font-semibold leading-relaxed text-slate-700">
                        {activeSource.label}: Du hast Quelle, Transportweg und Schutzidee gesichert.
                    </p>
                    <button
                        type="button"
                        onClick={closeActiveSource}
                        className="mt-4 rounded-3xl bg-emerald-600 px-6 py-3 text-sm font-black text-white shadow-xl transition hover:bg-emerald-700 active:scale-95"
                    >
                        {discoveredSourceIds.length === totalSources ? "Finale ansehen" : "Nächste Quelle"}
                    </button>
                </div>
            )}
        </section>
    )
}

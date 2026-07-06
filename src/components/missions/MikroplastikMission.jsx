import { useRef, useState } from "react"
import NarratorVideo from "../NarratorVideo"

const INTRO_VIDEO = "/videos/Intro_Game_Mikroplastik.mp4"

const videoByParticleId = {
    1: "/videos/Mikroplastik_Faser.mp4",
    2: "/videos/Mikroplastik_Reifenabrieb.mp4",
    3: "/videos/Mikroplastik_Plastikflasche.mp4",
    4: "/videos/Mikroplastik_Folie.mp4",
    5: "/videos/Mikroplastik_Kosmetik.mp4",
    6: "/videos/Mikroplastik_Styropor.mp4",
    7: "/videos/Mikroplastik_Netz.mp4",
    8: "/videos/Mikroplastik_Abfluss.mp4",
}

const LENS_RADIUS = 120

const initialParticles = [
    {
        id: 1,
        icon: "🧵",
        label: "Kunststofffaser",
        info: "Sehr gut entdeckt! Kleine Kunststofffasern können beim Waschen aus Kleidung gelöst werden und über das Abwasser ins Wasser gelangen.",
        x: 14,
        y: 22,
        drift: "micro-drift-a",
        dotClass: "bg-fuchsia-300",
    },
    {
        id: 2,
        icon: "⚫",
        label: "Reifenabrieb",
        info: "Richtig! Beim Fahren lösen sich winzige Teilchen von Reifen. Regen kann sie von Straßen in Gullys, Bäche und Flüsse spülen.",
        x: 31,
        y: 64,
        drift: "micro-drift-b",
        dotClass: "bg-slate-700",
    },
    {
        id: 3,
        icon: "🔹",
        label: "Plastiksplitter",
        info: "Gut gesehen! Größere Plastikteile können mit der Zeit zerbrechen. Daraus entstehen immer kleinere Plastiksplitter.",
        x: 48,
        y: 33,
        drift: "micro-drift-c",
        dotClass: "bg-sky-300",
    },
    {
        id: 4,
        icon: "🟦",
        label: "Folienrest",
        info: "Richtig! Dünne Folien können zerreißen und als kleine Kunststoffstücke im Wasser treiben.",
        x: 70,
        y: 23,
        drift: "micro-drift-a",
        dotClass: "bg-blue-300",
    },
    {
        id: 5,
        icon: "✨",
        label: "Kunststoffkügelchen",
        info: "Entdeckt! Manche winzigen Kunststoffteilchen stammen aus Produkten oder entstehen, wenn Plastik zerfällt.",
        x: 82,
        y: 57,
        drift: "micro-drift-b",
        dotClass: "bg-violet-300",
    },
    {
        id: 6,
        icon: "▫️",
        label: "Styroporstückchen",
        info: "Sehr gut! Styropor zerbröselt leicht. Die kleinen Stückchen können lange im Wasser bleiben.",
        x: 23,
        y: 41,
        drift: "micro-drift-c",
        dotClass: "bg-white",
    },
    {
        id: 7,
        icon: "🪢",
        label: "Netzabrieb",
        info: "Richtig! Auch Seile, Netze und andere Kunststoffmaterialien können kleine Teilchen verlieren.",
        x: 56,
        y: 75,
        drift: "micro-drift-a",
        dotClass: "bg-emerald-300",
    },
    {
        id: 8,
        icon: "🧼",
        label: "Teilchen aus dem Abfluss",
        info: "Gut gefunden! Manche Stoffe gelangen über Waschbecken, Dusche oder Waschmaschine in das Abwasser.",
        x: 39,
        y: 17,
        drift: "micro-drift-b",
        dotClass: "bg-cyan-200",
    },
]

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max)
}

export default function MikroplastikMission({ mission, onBack }) {
    const seaRef = useRef(null)
    const narratorAnchorRef = useRef(null)
    const narratorVideoRef = useRef(null)

    const [started, setStarted] = useState(false)
    const [foundIds, setFoundIds] = useState([])
    const [lensPosition, setLensPosition] = useState({ x: 50, y: 48 })
    const [feedback, setFeedback] = useState(
        "Klicke auf „Starten“ und untersuche das Wasser mit der Lupe.",
    )

    const foundCount = foundIds.length
    const totalCount = initialParticles.length
    const remainingCount = totalCount - foundCount
    const isComplete = foundCount === totalCount

    function getSeaRect() {
        return seaRef.current?.getBoundingClientRect() ?? null
    }

    function getLensPositionFromPointer(event) {
        const sea = getSeaRect()
        if (!sea) return null

        return {
            x: clamp(((event.clientX - sea.left) / sea.width) * 100, 0, 100),
            y: clamp(((event.clientY - sea.top) / sea.height) * 100, 0, 100),
        }
    }

    function updateLensFromPointer(event) {
        const nextPosition = getLensPositionFromPointer(event)
        if (!nextPosition) return

        setLensPosition(nextPosition)
    }

    function getDistanceToLens(particle) {
        const sea = getSeaRect()
        if (!sea) return Number.POSITIVE_INFINITY

        const lensX = (lensPosition.x / 100) * sea.width
        const lensY = (lensPosition.y / 100) * sea.height
        const particleX = (particle.x / 100) * sea.width
        const particleY = (particle.y / 100) * sea.height

        const dx = particleX - lensX
        const dy = particleY - lensY

        return Math.sqrt(dx * dx + dy * dy)
    }

    function isParticleInsideLens(particle) {
        return getDistanceToLens(particle) <= LENS_RADIUS
    }

    function isPointerCloseToParticle(event, particle) {
        const sea = getSeaRect()
        if (!sea) return false

        const pointerX = event.clientX - sea.left
        const pointerY = event.clientY - sea.top
        const particleX = (particle.x / 100) * sea.width
        const particleY = (particle.y / 100) * sea.height

        const dx = particleX - pointerX
        const dy = particleY - pointerY

        return Math.sqrt(dx * dx + dy * dy) <= 70
    }

    function handleStart() {
        setStarted(true)
        setFeedback(
            "Bewege die Lupe über das Wasser und klicke auf die versteckten Mikroplastikteilchen.",
        )
    }

    function handleSeaPointerMove(event) {
        if (!started || isComplete) return
        updateLensFromPointer(event)
    }

    function handleSeaPointerDown(event) {
        if (!started || isComplete) return
        updateLensFromPointer(event)
    }

    function handleParticleClick(event, particle) {
        event.preventDefault()
        event.stopPropagation()

        if (!started || isComplete || foundIds.includes(particle.id)) return

        updateLensFromPointer(event)

        const canFindParticle =
            isParticleInsideLens(particle) || isPointerCloseToParticle(event, particle)

        if (!canFindParticle) {
            setFeedback("Nutze zuerst die Lupe, damit du das Teilchen genauer erkennst.")
            return
        }

        const nextVideoSrc = videoByParticleId[particle.id]

        if (nextVideoSrc) {
            narratorVideoRef.current?.playVideoFromStart(nextVideoSrc)
        }

        setFoundIds((prev) => [...prev, particle.id])
        setFeedback(`${particle.label}: ${particle.info}`)
    }

    return (
        <section className="relative w-screen h-screen overflow-hidden bg-gradient-to-b from-sky-100 via-cyan-300 to-blue-600">
            <NarratorVideo
                ref={narratorVideoRef}
                anchorRef={narratorAnchorRef}
                videoSrc={INTRO_VIDEO}
                preloadSources={[INTRO_VIDEO, ...Object.values(videoByParticleId)]}
                initialPosition={{ x: "calc(100vw - 170px)", y: "18px" }}
                inset={0}
                autoPlayInitialVideo
                startAfterFirstUserAction={false}
            />

            <style>
                {`
                    @keyframes microDriftA {
                        0% { transform: translate(-50%, -50%) translate(0, 0) rotate(-4deg); }
                        25% { transform: translate(-50%, -50%) translate(10px, -7px) rotate(3deg); }
                        50% { transform: translate(-50%, -50%) translate(3px, -14px) rotate(7deg); }
                        75% { transform: translate(-50%, -50%) translate(-8px, -5px) rotate(-2deg); }
                        100% { transform: translate(-50%, -50%) translate(0, 0) rotate(-4deg); }
                    }

                    @keyframes microDriftB {
                        0% { transform: translate(-50%, -50%) translate(0, 0) rotate(3deg); }
                        25% { transform: translate(-50%, -50%) translate(-10px, -4px) rotate(-4deg); }
                        50% { transform: translate(-50%, -50%) translate(-4px, -13px) rotate(2deg); }
                        75% { transform: translate(-50%, -50%) translate(9px, -3px) rotate(5deg); }
                        100% { transform: translate(-50%, -50%) translate(0, 0) rotate(3deg); }
                    }

                    @keyframes microDriftC {
                        0% { transform: translate(-50%, -50%) translate(0, 0) rotate(-2deg); }
                        25% { transform: translate(-50%, -50%) translate(8px, 5px) rotate(4deg); }
                        50% { transform: translate(-50%, -50%) translate(-6px, -10px) rotate(-5deg); }
                        75% { transform: translate(-50%, -50%) translate(-12px, 2px) rotate(2deg); }
                        100% { transform: translate(-50%, -50%) translate(0, 0) rotate(-2deg); }
                    }

                    @keyframes microWave {
                        0% { transform: translateX(-18px); opacity: 0.2; }
                        50% { transform: translateX(18px); opacity: 0.55; }
                        100% { transform: translateX(-18px); opacity: 0.2; }
                    }

                    @keyframes microBubbleRise {
                        0% { transform: translateY(40px) scale(0.7); opacity: 0; }
                        20% { opacity: 0.35; }
                        100% { transform: translateY(-155px) scale(1.1); opacity: 0; }
                    }

                    @keyframes lensPulse {
                        0% { box-shadow: 0 0 0 0 rgba(255,255,255,0.35), 0 22px 55px rgba(15,23,42,0.35); }
                        50% { box-shadow: 0 0 0 10px rgba(255,255,255,0.08), 0 22px 55px rgba(15,23,42,0.35); }
                        100% { box-shadow: 0 0 0 0 rgba(255,255,255,0.35), 0 22px 55px rgba(15,23,42,0.35); }
                    }

                    .micro-drift-a { animation: microDriftA 5.8s ease-in-out infinite; }
                    .micro-drift-b { animation: microDriftB 6.8s ease-in-out infinite; }
                    .micro-drift-c { animation: microDriftC 7.6s ease-in-out infinite; }

                    .micro-wave {
                        animation: microWave 5.2s ease-in-out infinite;
                    }

                    .micro-bubble {
                        position: absolute;
                        width: 10px;
                        height: 10px;
                        border-radius: 9999px;
                        background: rgba(255,255,255,0.32);
                        animation: microBubbleRise 6.2s ease-in-out infinite;
                    }

                    .micro-lens {
                        animation: lensPulse 2.2s ease-in-out infinite;
                    }
                `}
            </style>

            <div className="absolute inset-0 opacity-45 bg-[radial-gradient(circle_at_18%_18%,white,transparent_24%),radial-gradient(circle_at_72%_58%,white,transparent_18%),radial-gradient(circle_at_35%_82%,white,transparent_16%)]" />

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
                        Mikroplastik im Wasser entdecken
                    </h1>

                    <p className="text-slate-700 mt-2">
                        Das Wasser sieht sauber aus. Doch winzige Kunststoffteilchen sind oft kaum sichtbar.
                    </p>

                    <p className="mt-3 text-sm font-semibold text-blue-900">
                        {feedback}
                    </p>

                    {started && !isComplete && (
                        <div className="mt-4 mx-auto max-w-md">
                            <div className="flex justify-between text-xs font-bold text-blue-900 mb-1">
                                <span>Gefunden: {foundCount} von {totalCount}</span>
                                <span>Noch versteckt: {remainingCount}</span>
                            </div>

                            <div className="h-3 overflow-hidden rounded-full bg-blue-100 shadow-inner">
                                <div
                                    className="h-full rounded-full bg-blue-600 transition-all duration-500"
                                    style={{
                                        width: `${(foundCount / totalCount) * 100}%`,
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </header>

                <main
                    ref={seaRef}
                    onPointerMove={handleSeaPointerMove}
                    onPointerDown={handleSeaPointerDown}
                    className="relative mt-2 flex-1 rounded-3xl border border-white/40 bg-white/15 shadow-inner overflow-hidden touch-none"
                >
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="micro-wave absolute left-[7%] top-[12%] text-2xl opacity-45">〰️</div>
                        <div className="micro-wave absolute left-[24%] top-[36%] text-2xl opacity-35">〰️</div>
                        <div className="micro-wave absolute left-[39%] top-[16%] text-2xl opacity-40">〰️</div>
                        <div className="micro-wave absolute left-[48%] top-[61%] text-2xl opacity-30">〰️</div>
                        <div className="micro-wave absolute left-[63%] top-[24%] text-2xl opacity-45">〰️</div>
                        <div className="micro-wave absolute left-[73%] top-[45%] text-2xl opacity-35">〰️</div>
                        <div className="micro-wave absolute left-[86%] top-[20%] text-2xl opacity-35">〰️</div>
                        <div className="micro-wave absolute left-[87%] top-[73%] text-2xl opacity-30">〰️</div>
                        <div className="micro-wave absolute left-[16%] top-[77%] text-2xl opacity-30">〰️</div>
                        <div className="micro-wave absolute left-[58%] top-[84%] text-2xl opacity-25">〰️</div>

                        <span className="micro-bubble left-[13%] bottom-[7%]" />
                        <span className="micro-bubble left-[28%] bottom-[21%]" />
                        <span className="micro-bubble left-[44%] bottom-[10%]" />
                        <span className="micro-bubble left-[61%] bottom-[18%]" />
                        <span className="micro-bubble left-[78%] bottom-[11%]" />
                    </div>

                    {started && !isComplete && (
                        <div
                            className="micro-lens pointer-events-none absolute z-20 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border-[10px] border-white/85 bg-white/15 shadow-2xl ring-4 ring-blue-200/60 backdrop-blur-[1px]"
                            style={{
                                left: `${lensPosition.x}%`,
                                top: `${lensPosition.y}%`,
                            }}
                        >
                            <div className="absolute inset-3 rounded-full border border-blue-200/80 bg-[radial-gradient(circle_at_35%_28%,rgba(255,255,255,0.75),rgba(255,255,255,0.08)_35%,rgba(14,165,233,0.12)_100%)]" />
                            <div className="absolute -bottom-14 -right-10 h-20 w-7 rotate-[-42deg] rounded-full bg-slate-700 shadow-xl" />
                            <div className="absolute -bottom-16 -right-12 h-8 w-8 rounded-full bg-slate-800" />
                        </div>
                    )}

                    {initialParticles.map((particle) => {
                        const isFound = foundIds.includes(particle.id)
                        const isVisible = started && !isFound && isParticleInsideLens(particle)

                        if (isFound) return null

                        return (
                            <button
                                key={particle.id}
                                type="button"
                                onClick={(event) => handleParticleClick(event, particle)}
                                className={`${particle.drift} absolute z-30 flex h-12 w-12 items-center justify-center rounded-full text-xl shadow-lg ring-2 ring-white/70 transition-all duration-300 select-none active:scale-90 ${particle.dotClass}`}
                                style={{
                                    left: `${particle.x}%`,
                                    top: `${particle.y}%`,
                                    opacity: isVisible ? 1 : 0,
                                    filter: isVisible ? "blur(0px)" : "blur(5px)",
                                }}
                                title={particle.label}
                            >
                                <span className="pointer-events-none drop-shadow-sm">
                                    {particle.icon}
                                </span>
                            </button>
                        )
                    })}

                    {!started && (
                        <div className="absolute inset-0 z-30 flex items-center justify-center bg-blue-950/35 backdrop-blur-sm p-4">
                            <div className="max-w-xl rounded-3xl bg-white p-7 text-center shadow-2xl">
                                <div className="text-5xl mb-3">🔬</div>

                                <h2 className="text-2xl font-extrabold text-blue-950">
                                    Schau genauer hin!
                                </h2>

                                <p className="mt-3 text-slate-700 leading-relaxed">
                                    Mikroplastik ist so klein, dass man es oft kaum sehen kann.
                                    Nutze die Lupe, entdecke versteckte Teilchen und finde heraus,
                                    wo sie sich im Wasser befinden.
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
                        <div className="absolute inset-0 z-40 flex items-center justify-center bg-blue-950/40 backdrop-blur-sm p-4">
                            <div className="rounded-3xl bg-white p-8 text-center shadow-2xl max-w-xl">
                                <div className="text-5xl mb-3">🎉</div>

                                <h2 className="text-2xl font-extrabold text-blue-950">
                                    Mission geschafft!
                                </h2>

                                <p className="text-slate-700 mt-2 mb-5 leading-relaxed">
                                    Du hast alle versteckten Mikroplastikteilchen entdeckt.
                                    Jetzt weißt du: Auch scheinbar sauberes Wasser kann winzige
                                    Kunststoffteilchen enthalten.
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
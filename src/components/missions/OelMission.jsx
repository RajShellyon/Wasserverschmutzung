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

const allVideoSources = [INTRO_VIDEO, ...Object.values(videoByTargetId)]

const spreadSteps = [
    {
        id: "wind",
        label: "Windstoß",
        icon: "💨",
        short: "Wind schiebt Öl über die Oberfläche.",
        feedback: "Der Wind schiebt den Ölfilm weiter. Jetzt sind erste Tiere an der Oberfläche in Gefahr.",
        arrow: "→",
    },
    {
        id: "waves",
        label: "Wellen",
        icon: "🌊",
        short: "Wellen zerreißen den Film in Flecken.",
        feedback: "Die Wellen zerreißen den Ölfilm. Kleine Flecken verteilen sich unregelmäßig im Wasser.",
        arrow: "↗",
    },
    {
        id: "current",
        label: "Strömung",
        icon: "↝",
        short: "Strömung zieht Öl in neue Zonen.",
        feedback: "Die Strömung zieht das Öl weiter. Auch Bereiche, die zuerst sauber wirkten, werden betroffen.",
        arrow: "↝",
    },
    {
        id: "coast",
        label: "Küste",
        icon: "🏝️",
        short: "Öl erreicht empfindliche Lebensräume.",
        feedback: "Der Ölteppich driftet zur Küste. Jetzt brauchen Strand und Lebensräume besonderen Schutz.",
        arrow: "⇢",
    },
]

const affectedTargets = [
    {
        id: 1,
        icon: "🕊️",
        label: "Seevogel",
        shortLabel: "Vogel",
        sticker: "🪶",
        minStage: 1,
        x: 18,
        y: 28,
        drift: "oil-rescue-drift-a",
        glowClass: "from-slate-100 to-sky-200",
        source: "Öl verklebt Federn. Der Vogel verliert Wärme- und Flugschutz.",
        mini: {
            title: "Feder-Rettung",
            scene: "🪶🛢️",
            instruction: "Tippe nur die schwarzen Öltropfen an. Federn und Wasser bleiben liegen.",
            collectLabel: "Öltropfen entfernt",
            items: [
                { id: "v1", emoji: "🛢️", label: "Öltropfen", correct: true, x: 24, y: 33 },
                { id: "v2", emoji: "⚫", label: "kleiner Ölfleck", correct: true, x: 58, y: 24 },
                { id: "v3", emoji: "🖤", label: "klebriger Tropfen", correct: true, x: 74, y: 57 },
                { id: "v4", emoji: "🪶", label: "Feder", correct: false, x: 42, y: 67 },
                { id: "v5", emoji: "💧", label: "Wassertropfen", correct: false, x: 82, y: 29 },
                { id: "v6", emoji: "🫧", label: "Luftblase", correct: false, x: 28, y: 18 },
            ],
        },
        solutions: [
            { id: "experts", icon: "🧑‍⚕️", title: "Fachleute rufen", text: "Wildtier-Hilfe kann Vögel sicher reinigen.", correct: true },
            { id: "home", icon: "🧼", title: "Selbst schrubben", text: "Das kann Tiere verletzen und stresst sie stark.", correct: false },
            { id: "ignore", icon: "🙈", title: "Warten", text: "Öl wird für Vögel schnell gefährlich.", correct: false },
        ],
    },
    {
        id: 2,
        icon: "🐟",
        label: "Fisch",
        shortLabel: "Fisch",
        sticker: "🐟",
        minStage: 2,
        x: 42,
        y: 62,
        drift: "oil-rescue-drift-b",
        glowClass: "from-cyan-100 to-blue-300",
        source: "Fische können mit Öl und schädlichen Stoffen in Kontakt kommen.",
        mini: {
            title: "Gift-Blasen erkennen",
            scene: "🐟⚫",
            instruction: "Fange nur die dunklen Ölspuren. Sauerstoffblasen helfen dem Wasser.",
            collectLabel: "Ölspuren gefiltert",
            items: [
                { id: "f1", emoji: "⚫", label: "Ölspur", correct: true, x: 21, y: 30 },
                { id: "f2", emoji: "🛢️", label: "Ölfilm", correct: true, x: 52, y: 49 },
                { id: "f3", emoji: "▪️", label: "Ölpartikel", correct: true, x: 78, y: 24 },
                { id: "f4", emoji: "🫧", label: "Sauerstoffblase", correct: false, x: 33, y: 70 },
                { id: "f5", emoji: "🐠", label: "kleiner Fisch", correct: false, x: 74, y: 66 },
                { id: "f6", emoji: "🌿", label: "Pflanze", correct: false, x: 43, y: 19 },
            ],
        },
        solutions: [
            { id: "stop", icon: "🛑", title: "Leck stoppen", text: "Quelle stoppen und Öl auffangen schützt Tiere.", correct: true },
            { id: "stir", icon: "🥄", title: "Umrühren", text: "Dann verteilt sich Öl noch stärker.", correct: false },
            { id: "feed", icon: "🍞", title: "Fische füttern", text: "Futter löst die Ölbelastung nicht.", correct: false },
        ],
    },
    {
        id: 3,
        icon: "🐢",
        label: "Meeresschildkröte",
        shortLabel: "Schildkröte",
        sticker: "🐢",
        minStage: 2,
        x: 66,
        y: 43,
        drift: "oil-rescue-drift-c",
        glowClass: "from-emerald-100 to-teal-300",
        source: "Schildkröten können Öl berühren oder verschmutzte Nahrung aufnehmen.",
        mini: {
            title: "Schildkröten-Weg freimachen",
            scene: "🐢🛢️",
            instruction: "Entferne die Ölklumpen aus dem Weg. Tiere und Muscheln bleiben geschützt.",
            collectLabel: "Weg freigeräumt",
            items: [
                { id: "t1", emoji: "🛢️", label: "Ölklumpen", correct: true, x: 19, y: 45 },
                { id: "t2", emoji: "⚫", label: "Ölfleck", correct: true, x: 49, y: 24 },
                { id: "t3", emoji: "🖤", label: "klebrige Spur", correct: true, x: 77, y: 50 },
                { id: "t4", emoji: "🐚", label: "Muschel", correct: false, x: 31, y: 70 },
                { id: "t5", emoji: "🪸", label: "Koralle", correct: false, x: 65, y: 72 },
                { id: "t6", emoji: "🐢", label: "Schildkröte", correct: false, x: 83, y: 22 },
            ],
        },
        solutions: [
            { id: "clear", icon: "🚧", title: "Ölsperre legen", text: "Sperren halten Öl von Tieren und Routen fern.", correct: true },
            { id: "touch", icon: "🤲", title: "Tier anfassen", text: "Wildtiere brauchen geschulte Hilfe.", correct: false },
            { id: "wave", icon: "🌊", title: "Wellen machen", text: "Wellen verteilen Öl nur weiter.", correct: false },
        ],
    },
    {
        id: 4,
        icon: "🏖️",
        label: "Küste",
        shortLabel: "Küste",
        sticker: "🏝️",
        minStage: 4,
        x: 84,
        y: 73,
        drift: "oil-rescue-drift-a",
        glowClass: "from-amber-100 to-lime-300",
        source: "An der Küste kann Öl Sand, Steine, Pflanzen und Nester verschmutzen.",
        mini: {
            title: "Küsten-Schutzlinie bauen",
            scene: "🏖️🟨",
            instruction: "Tippe die gelben Schutzbojen an. Strandtiere und Steine bleiben dort.",
            collectLabel: "Schutzlinie gebaut",
            items: [
                { id: "k1", emoji: "🟨", label: "Schutzboje", correct: true, x: 20, y: 42 },
                { id: "k2", emoji: "🟡", label: "Ölsperre", correct: true, x: 51, y: 30 },
                { id: "k3", emoji: "🛟", label: "Barriere", correct: true, x: 77, y: 55 },
                { id: "k4", emoji: "🪨", label: "Stein", correct: false, x: 33, y: 70 },
                { id: "k5", emoji: "🦀", label: "Krabbe", correct: false, x: 68, y: 72 },
                { id: "k6", emoji: "🌾", label: "Düne", correct: false, x: 84, y: 24 },
            ],
        },
        solutions: [
            { id: "boom", icon: "🟨", title: "Sperren vorlegen", text: "Ölsperren können empfindliche Ufer schützen.", correct: true },
            { id: "bury", icon: "🕳️", title: "Im Sand vergraben", text: "Dann bleibt Öl in der Natur.", correct: false },
            { id: "play", icon: "🏐", title: "Weiter baden", text: "Öl am Strand ist ein Warnsignal.", correct: false },
        ],
    },
    {
        id: 5,
        icon: "🌿",
        label: "Wasserpflanzen",
        shortLabel: "Pflanzen",
        sticker: "🌿",
        minStage: 3,
        x: 28,
        y: 77,
        drift: "oil-rescue-drift-b",
        glowClass: "from-lime-100 to-emerald-300",
        source: "Öl kann Pflanzen bedecken. Dann kommen Licht und Luft schlechter durch.",
        mini: {
            title: "Pflanzen freilegen",
            scene: "🌿⚫",
            instruction: "Entferne nur den Ölfilm von den Blättern. Grüne Pflanzenteile bleiben frei.",
            collectLabel: "Blätter befreit",
            items: [
                { id: "p1", emoji: "⚫", label: "Ölfilm", correct: true, x: 24, y: 28 },
                { id: "p2", emoji: "🛢️", label: "Ölfleck", correct: true, x: 57, y: 45 },
                { id: "p3", emoji: "▪️", label: "klebriger Belag", correct: true, x: 76, y: 67 },
                { id: "p4", emoji: "🌿", label: "Wasserpflanze", correct: false, x: 39, y: 70 },
                { id: "p5", emoji: "🍃", label: "Blatt", correct: false, x: 80, y: 24 },
                { id: "p6", emoji: "🐌", label: "Schnecke", correct: false, x: 20, y: 62 },
            ],
        },
        solutions: [
            { id: "quick", icon: "⏱️", title: "Schnell eindämmen", text: "Je früher Öl gestoppt wird, desto weniger Pflanzen werden bedeckt.", correct: true },
            { id: "sink", icon: "⬇️", title: "Nach unten drücken", text: "Öl verschwindet dadurch nicht sicher.", correct: false },
            { id: "cut", icon: "✂️", title: "Alle Pflanzen schneiden", text: "Lebensräume brauchen vorsichtige Hilfe.", correct: false },
        ],
    },
    {
        id: 6,
        icon: "🫧",
        label: "Wasseroberfläche",
        shortLabel: "Oberfläche",
        sticker: "🫧",
        minStage: 1,
        x: 57,
        y: 24,
        drift: "oil-rescue-drift-c",
        glowClass: "from-sky-100 to-cyan-300",
        source: "Eine dünne Ölschicht stört den Austausch zwischen Luft und Wasser.",
        mini: {
            title: "Atemfenster öffnen",
            scene: "🫧🛢️",
            instruction: "Tippe die dunklen Filmstücke an. Luftblasen zeigen gesunde Stellen.",
            collectLabel: "Oberfläche geöffnet",
            items: [
                { id: "o1", emoji: "🛢️", label: "Ölfilm", correct: true, x: 22, y: 35 },
                { id: "o2", emoji: "⚫", label: "dunkle Schicht", correct: true, x: 54, y: 24 },
                { id: "o3", emoji: "🖤", label: "schmieriger Fleck", correct: true, x: 78, y: 60 },
                { id: "o4", emoji: "🫧", label: "Luftblase", correct: false, x: 35, y: 68 },
                { id: "o5", emoji: "💧", label: "Wasser", correct: false, x: 70, y: 73 },
                { id: "o6", emoji: "☀️", label: "Lichtreflex", correct: false, x: 83, y: 22 },
            ],
        },
        solutions: [
            { id: "skim", icon: "🧽", title: "Öl abschöpfen", text: "Spezialgeräte können Öl von der Oberfläche sammeln.", correct: true },
            { id: "soap", icon: "🧼", title: "Seife ins Meer", text: "Zusätze können dem Wasser zusätzlich schaden.", correct: false },
            { id: "splash", icon: "💦", title: "Planschen", text: "Das verteilt Öl nur weiter.", correct: false },
        ],
    },
]

function getCorrectItems(target) {
    return target.mini.items.filter((item) => item.correct)
}

export default function OelMission({ mission, onBack }) {
    const narratorAnchorRef = useRef(null)
    const narratorVideoRef = useRef(null)

    const [started, setStarted] = useState(false)
    const [spillStage, setSpillStage] = useState(0)
    const [usedStepIds, setUsedStepIds] = useState([])
    const [securedTargetIds, setSecuredTargetIds] = useState([])
    const [activeTargetId, setActiveTargetId] = useState(null)
    const [modalStage, setModalStage] = useState("challenge")
    const [challengeHits, setChallengeHits] = useState([])
    const [wrongItems, setWrongItems] = useState([])
    const [wrongSolutionId, setWrongSolutionId] = useState(null)
    const [captainLine, setCaptainLine] = useState("Bereit für den Einsatz? Starte das Rettungsboot und beobachte den Ölfilm.")
    const [pulseKey, setPulseKey] = useState(0)

    const activeTarget = affectedTargets.find((target) => target.id === activeTargetId) ?? null
    const securedCount = securedTargetIds.length
    const totalTargets = affectedTargets.length
    const progressPercent = Math.round((securedCount / totalTargets) * 100)
    const isComplete = securedCount === totalTargets
    const currentStep = spreadSteps[Math.max(0, Math.min(spillStage - 1, spreadSteps.length - 1))]

    function handleStart() {
        setStarted(true)
        setPulseKey((prev) => prev + 1)
        setCaptainLine("Öl-Alarm! Nutze die Einsatzkarten unten. Wenn Warnzeichen auftauchen, sichere die betroffenen Orte.")
    }

    function handleSpread(step, index) {
        if (!started || activeTarget || isComplete) return
        if (index > spillStage) {
            setCaptainLine("Diese Kraft ist noch nicht dran. Folge dem Ölfilm Schritt für Schritt.")
            return
        }

        const nextStage = Math.min(Math.max(spillStage, index + 1), spreadSteps.length)
        setSpillStage(nextStage)
        setUsedStepIds((prev) => (prev.includes(step.id) ? prev : [...prev, step.id]))
        setPulseKey((prev) => prev + 1)
        setCaptainLine(step.feedback)
    }

    function openTargetChallenge(target) {
        if (!started || activeTarget || isComplete) return

        if (spillStage < target.minStage) {
            setCaptainLine(`${target.label} ist noch nicht vom Öl erreicht. Lass den Ölfilm erst weiterdriften.`)
            return
        }

        if (securedTargetIds.includes(target.id)) {
            setCaptainLine(`${target.shortLabel} ist schon gesichert. Suche das nächste Warnzeichen.`)
            return
        }

        setActiveTargetId(target.id)
        setModalStage("challenge")
        setChallengeHits([])
        setWrongItems([])
        setWrongSolutionId(null)
        setCaptainLine(`${target.label} braucht Hilfe. Löse die Mini-Aufgabe, dann erklärt der Narrator den Fund.`)
    }

    function handleChallengeItemClick(item) {
        if (!activeTarget || modalStage !== "challenge") return

        if (!item.correct) {
            setWrongItems((prev) => [...new Set([...prev, item.id])])
            setCaptainLine("Fast! Das gehört zur Natur. Entferne nur die Ölspuren.")
            window.setTimeout(() => {
                setWrongItems((prev) => prev.filter((id) => id !== item.id))
            }, 700)
            return
        }

        if (challengeHits.includes(item.id)) return

        const nextHits = [...challengeHits, item.id]
        setChallengeHits(nextHits)
        setCaptainLine("Gut gesichert! Der Öl-Filter sammelt den Fund.")

        if (nextHits.length >= getCorrectItems(activeTarget).length) {
            const nextVideoSrc = videoByTargetId[activeTarget.id]
            if (nextVideoSrc) {
                narratorVideoRef.current?.playVideoFromStart(nextVideoSrc)
            }

            setModalStage("narrator")
            setCaptainLine("Beweis gesichert. Schau zum Narrator-Fenster: Dort läuft die Erklärung.")
        }
    }

    function handleSolutionClick(solution) {
        if (!activeTarget || modalStage !== "solution") return

        if (!solution.correct) {
            setWrongSolutionId(solution.id)
            setCaptainLine("Diese Idee klingt spannend, stoppt das Ölproblem hier aber nicht. Such die wirksame Schutzmaßnahme.")
            window.setTimeout(() => setWrongSolutionId(null), 800)
            return
        }

        setWrongSolutionId(null)
        setSecuredTargetIds((prev) => (prev.includes(activeTarget.id) ? prev : [...prev, activeTarget.id]))
        setModalStage("sticker")
        setCaptainLine(`${activeTarget.shortLabel}-Sticker gesichert! Weiter zum nächsten Warnzeichen.`)
    }

    function closeActiveModal() {
        const completeAfterClose = securedTargetIds.length >= totalTargets
        setActiveTargetId(null)
        setModalStage("challenge")
        setChallengeHits([])
        setWrongItems([])
        setWrongSolutionId(null)
        setPulseKey((prev) => prev + 1)

        if (!completeAfterClose) {
            setCaptainLine("Weiter im Einsatz. Lass den Ölfilm driften oder sichere das nächste Warnzeichen.")
        }
    }

    function resetMission() {
        setStarted(false)
        setSpillStage(0)
        setUsedStepIds([])
        setSecuredTargetIds([])
        setActiveTargetId(null)
        setModalStage("challenge")
        setChallengeHits([])
        setWrongItems([])
        setWrongSolutionId(null)
        setPulseKey(0)
        setCaptainLine("Bereit für den Einsatz? Starte das Rettungsboot und beobachte den Ölfilm.")
    }

    function getOilStyle() {
        const styles = [
            {
                width: "120px",
                height: "74px",
                left: "41%",
                top: "43%",
                opacity: started ? 0.78 : 0,
                transform: "translate(-50%, -50%) rotate(-8deg)",
            },
            {
                width: "245px",
                height: "132px",
                left: "43%",
                top: "44%",
                opacity: 0.82,
                transform: "translate(-50%, -50%) rotate(-12deg)",
            },
            {
                width: "390px",
                height: "188px",
                left: "49%",
                top: "47%",
                opacity: 0.84,
                transform: "translate(-50%, -50%) rotate(-7deg)",
            },
            {
                width: "560px",
                height: "250px",
                left: "55%",
                top: "51%",
                opacity: 0.86,
                transform: "translate(-50%, -50%) rotate(-3deg)",
            },
            {
                width: "760px",
                height: "310px",
                left: "63%",
                top: "55%",
                opacity: 0.88,
                transform: "translate(-50%, -50%) rotate(2deg)",
            },
        ]

        return styles[Math.min(spillStage, styles.length - 1)]
    }

    return (
        <section className="relative h-screen w-screen overflow-hidden bg-[#06162f] text-slate-950">
            <div className="relative z-[130]">
                <NarratorVideo
                    ref={narratorVideoRef}
                    anchorRef={narratorAnchorRef}
                    videoSrc={INTRO_VIDEO}
                    preloadSources={allVideoSources}
                    initialPosition={{ x: "40vw", y: "56px" }}
                    inset={0}
                    autoPlayInitialVideo
                    startAfterFirstUserAction={false}
                />
            </div>

            <style>
                {`
                    @keyframes oilRescueOceanGlow {
                        0%, 100% { filter: hue-rotate(0deg) brightness(1); }
                        50% { filter: hue-rotate(-9deg) brightness(1.07); }
                    }

                    @keyframes oilRescueSlick {
                        0% { filter: blur(1px) brightness(0.9); border-radius: 62% 38% 56% 44% / 42% 57% 43% 58%; }
                        33% { filter: blur(1.3px) brightness(1.05); border-radius: 50% 50% 44% 56% / 58% 42% 58% 42%; }
                        66% { filter: blur(1px) brightness(0.96); border-radius: 68% 32% 52% 48% / 44% 62% 38% 56%; }
                        100% { filter: blur(1px) brightness(0.9); border-radius: 62% 38% 56% 44% / 42% 57% 43% 58%; }
                    }

                    @keyframes oilRescueRainbow {
                        0% { transform: translateX(-30%) rotate(0deg); opacity: 0.13; }
                        50% { transform: translateX(18%) rotate(3deg); opacity: 0.25; }
                        100% { transform: translateX(-30%) rotate(0deg); opacity: 0.13; }
                    }

                    @keyframes oilRescueWave {
                        0%, 100% { transform: translateX(-18px); opacity: 0.24; }
                        50% { transform: translateX(18px); opacity: 0.55; }
                    }

                    @keyframes oilRescueBoat {
                        0%, 100% { transform: translateY(0) rotate(-1deg); }
                        50% { transform: translateY(-8px) rotate(2deg); }
                    }

                    @keyframes oilRescuePulse {
                        0% { transform: scale(0.65); opacity: 0.9; }
                        75% { opacity: 0.12; }
                        100% { transform: scale(1.65); opacity: 0; }
                    }

                    @keyframes oilRescueWarning {
                        0%, 100% { transform: translateY(0) scale(1); }
                        50% { transform: translateY(-5px) scale(1.08); }
                    }

                    @keyframes oilRescueDriftA {
                        0%, 100% { transform: translate(-50%, -50%) translate(0, 0) rotate(-4deg); }
                        35% { transform: translate(-50%, -50%) translate(12px, -6px) rotate(4deg); }
                        70% { transform: translate(-50%, -50%) translate(-8px, 8px) rotate(-2deg); }
                    }

                    @keyframes oilRescueDriftB {
                        0%, 100% { transform: translate(-50%, -50%) translate(0, 0) rotate(3deg); }
                        40% { transform: translate(-50%, -50%) translate(-12px, 7px) rotate(-5deg); }
                        75% { transform: translate(-50%, -50%) translate(9px, -9px) rotate(2deg); }
                    }

                    @keyframes oilRescueDriftC {
                        0%, 100% { transform: translate(-50%, -50%) translate(0, 0) rotate(0deg); }
                        30% { transform: translate(-50%, -50%) translate(9px, 9px) rotate(6deg); }
                        70% { transform: translate(-50%, -50%) translate(-10px, -5px) rotate(-5deg); }
                    }

                    @keyframes oilRescuePop {
                        0% { transform: scale(0.35) rotate(-16deg); opacity: 0; }
                        65% { transform: scale(1.15) rotate(7deg); opacity: 1; }
                        100% { transform: scale(1) rotate(0deg); opacity: 1; }
                    }

                    @keyframes oilRescueWiggle {
                        0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
                        20% { transform: translate(-50%, -50%) rotate(-10deg) scale(1.05); }
                        40% { transform: translate(-50%, -50%) rotate(10deg) scale(1.05); }
                        60% { transform: translate(-50%, -50%) rotate(-7deg) scale(1.03); }
                        80% { transform: translate(-50%, -50%) rotate(7deg) scale(1.03); }
                    }

                    @keyframes oilRescueCardWiggle {
                        0%, 100% { transform: rotate(0deg); }
                        20% { transform: rotate(-3deg) scale(1.02); }
                        40% { transform: rotate(3deg) scale(1.02); }
                        60% { transform: rotate(-2deg) scale(1.01); }
                        80% { transform: rotate(2deg) scale(1.01); }
                    }

                    @keyframes oilRescueFinal {
                        0% { opacity: 0; transform: translateY(20px) scale(0.96); }
                        100% { opacity: 1; transform: translateY(0) scale(1); }
                    }

                    .oil-rescue-ocean-glow { animation: oilRescueOceanGlow 8s ease-in-out infinite; }
                    .oil-rescue-slick { animation: oilRescueSlick 4.8s ease-in-out infinite; }
                    .oil-rescue-rainbow { animation: oilRescueRainbow 5.8s ease-in-out infinite; }
                    .oil-rescue-wave { animation: oilRescueWave 5s ease-in-out infinite; }
                    .oil-rescue-boat { animation: oilRescueBoat 3.4s ease-in-out infinite; }
                    .oil-rescue-pulse { animation: oilRescuePulse 1.15s ease-out forwards; }
                    .oil-rescue-warning { animation: oilRescueWarning 1.4s ease-in-out infinite; }
                    .oil-rescue-drift-a { animation: oilRescueDriftA 6.5s ease-in-out infinite; }
                    .oil-rescue-drift-b { animation: oilRescueDriftB 7.1s ease-in-out infinite; }
                    .oil-rescue-drift-c { animation: oilRescueDriftC 7.7s ease-in-out infinite; }
                    .oil-rescue-pop { animation: oilRescuePop 0.55s cubic-bezier(.17,.84,.44,1) both; }
                    .oil-rescue-wiggle { animation: oilRescueWiggle 0.55s ease-in-out; }
                    .oil-rescue-card-wiggle { animation: oilRescueCardWiggle 0.55s ease-in-out; }
                    .oil-rescue-final { animation: oilRescueFinal 0.75s ease-out both; }
                `}
            </style>

            <div className="absolute inset-0 oil-rescue-ocean-glow bg-[radial-gradient(circle_at_18%_8%,rgba(186,230,253,0.92),transparent_24%),radial-gradient(circle_at_78%_38%,rgba(45,212,191,0.34),transparent_27%),linear-gradient(180deg,#b8f7ff_0%,#37c6ec_34%,#0b6390_100%)]" />
            <div className="absolute inset-0 opacity-[0.18] bg-[linear-gradient(rgba(255,255,255,.55)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.55)_1px,transparent_1px)] bg-[length:72px_72px]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_112%,rgba(2,6,23,0.42),transparent_56%)]" />

            <div ref={narratorAnchorRef} className="pointer-events-none absolute left-[40%] top-6 z-[115] h-28 w-28 -translate-x-1/2 md:left-[40%] md:top-7" />

            <div className="relative z-10 flex h-full flex-col p-4 md:p-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="rounded-[2rem] border-2 border-white/70 bg-white/82 px-5 py-4 shadow-2xl backdrop-blur-md md:max-w-[460px]">
                        <div className="flex items-center gap-3">
                            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-amber-100 text-3xl shadow-inner">
                                🛢️
                            </div>
                            <div>
                                <p className="text-[11px] font-black uppercase tracking-[0.32em] text-amber-700">
                                    Mission {mission?.id ?? 4}
                                </p>
                                <h1 className="text-xl font-black leading-tight text-slate-950 md:text-3xl">
                                    Öl-Alarm im Meer
                                </h1>
                            </div>
                        </div>
                        <p className="mt-3 text-sm font-semibold leading-relaxed text-slate-700 md:text-base">
                            {captainLine}
                        </p>
                    </div>

                    <div className="hidden rounded-[2rem] border-2 border-white/50 bg-slate-950/75 p-4 text-white shadow-2xl backdrop-blur-md md:block md:w-[330px] lg:w-[390px]">
                        <div className="flex items-center justify-between">
                            <p className="text-[11px] font-black uppercase tracking-[0.35em] text-cyan-200">Einsatzlage</p>
                            <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-black text-amber-900">{progressPercent}%</span>
                        </div>
                        <div className="mt-3 h-4 overflow-hidden rounded-full bg-white/15 shadow-inner">
                            <div
                                className="h-full rounded-full bg-amber-300 transition-all duration-500"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                        <p className="mt-3 text-sm font-bold text-cyan-50">
                            Ausbreitung {spillStage}/{spreadSteps.length} · {currentStep?.short ?? "Ölfilm noch klein."}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onBack}
                        className="rounded-2xl border-2 border-white/70 bg-white px-5 py-3 text-sm font-black text-cyan-800 shadow-xl transition hover:-translate-y-0.5 hover:bg-cyan-50 active:scale-95"
                    >
                        Zurück
                    </button>
                </div>

                <main className="relative mt-4 flex-1 overflow-hidden rounded-[2.5rem] border-2 border-white/55 bg-cyan-300/20 shadow-[inset_0_-80px_100px_rgba(8,47,73,0.34)] touch-none">
                    <div className="pointer-events-none absolute inset-0">
                        <span className="oil-rescue-wave absolute left-[7%] top-[14%] text-2xl opacity-45">〰️</span>
                        <span className="oil-rescue-wave absolute left-[24%] top-[34%] text-2xl opacity-35" style={{ animationDelay: "0.6s" }}>〰️</span>
                        <span className="oil-rescue-wave absolute left-[40%] top-[15%] text-2xl opacity-35" style={{ animationDelay: "1.2s" }}>〰️</span>
                        <span className="oil-rescue-wave absolute left-[55%] top-[65%] text-2xl opacity-30" style={{ animationDelay: "2s" }}>〰️</span>
                        <span className="oil-rescue-wave absolute left-[69%] top-[25%] text-2xl opacity-40" style={{ animationDelay: "1.6s" }}>〰️</span>
                        <span className="oil-rescue-wave absolute left-[86%] top-[18%] text-2xl opacity-32" style={{ animationDelay: "2.6s" }}>〰️</span>
                        <span className="oil-rescue-wave absolute left-[16%] top-[78%] text-2xl opacity-30" style={{ animationDelay: "1.9s" }}>〰️</span>
                        <span className="oil-rescue-wave absolute left-[84%] top-[76%] text-2xl opacity-30" style={{ animationDelay: "0.9s" }}>〰️</span>
                    </div>

                    <div className="pointer-events-none absolute right-0 bottom-0 top-[55%] w-[25%] rounded-tl-[90px] border-l-4 border-white/60 bg-gradient-to-br from-yellow-100 via-amber-200 to-lime-300 shadow-2xl">
                        <div className="absolute left-[17%] top-[14%] text-4xl">🌾</div>
                        <div className="absolute left-[54%] top-[25%] text-5xl">🌴</div>
                        <div className="absolute left-[31%] bottom-[13%] text-3xl">🪨</div>
                        <div className="absolute right-[11%] bottom-[21%] text-3xl">🦀</div>
                    </div>

                    {started && (
                        <>
                            <div
                                className="oil-rescue-slick pointer-events-none absolute z-10 bg-[radial-gradient(circle_at_35%_35%,rgba(55,65,81,0.98),rgba(17,24,39,0.93)_42%,rgba(2,6,23,0.78)_72%,rgba(2,6,23,0.18)_100%)] ring-2 ring-slate-900/20 shadow-2xl transition-all duration-700"
                                style={getOilStyle()}
                            >
                                <div className="oil-rescue-rainbow absolute inset-4 rounded-full bg-[conic-gradient(from_40deg,rgba(251,191,36,0.28),rgba(34,211,238,0.18),rgba(168,85,247,0.22),rgba(251,191,36,0.24))]" />
                                <div className="absolute inset-6 rounded-full bg-[radial-gradient(circle_at_30%_28%,rgba(255,255,255,0.18),transparent_30%),radial-gradient(circle_at_70%_64%,rgba(14,165,233,0.16),transparent_28%)]" />
                            </div>

                            <div className="oil-rescue-boat pointer-events-none absolute left-[36%] top-[36%] z-20 rounded-full bg-yellow-300 px-8 py-4 text-3xl shadow-2xl ring-4 ring-white/70">
                                🚤
                            </div>

                            <div key={pulseKey} className="oil-rescue-pulse pointer-events-none absolute left-[39%] top-[42%] z-20 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-amber-100/80" />
                        </>
                    )}

                    {affectedTargets.map((target) => {
                        const isReached = spillStage >= target.minStage
                        const isSecured = securedTargetIds.includes(target.id)
                        const isWaiting = started && isReached && !isSecured
                        const isGhost = !started || (!isReached && !isSecured)

                        return (
                            <button
                                key={target.id}
                                type="button"
                                onClick={() => openTargetChallenge(target)}
                                disabled={!started || activeTarget || isComplete || isGhost}
                                className={`${target.drift} absolute z-30 flex h-16 w-16 items-center justify-center rounded-[1.4rem] border-4 text-4xl shadow-xl transition-all duration-500 select-none active:scale-95 ${isWaiting
                                    ? "border-amber-200 bg-white/90 opacity-100 hover:-translate-y-1 hover:scale-110 cursor-pointer"
                                    : isSecured
                                        ? "border-emerald-200 bg-emerald-50 opacity-75 grayscale"
                                        : "border-white/30 bg-white/15 opacity-25 cursor-default"
                                }`}
                                style={{ left: `${target.x}%`, top: `${target.y}%` }}
                                title={isWaiting || isSecured ? target.label : undefined}
                            >
                                <span className="pointer-events-none drop-shadow-sm">{target.icon}</span>

                                {isWaiting && (
                                    <span className="oil-rescue-warning absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-amber-300 text-base shadow-lg ring-2 ring-white">
                                        ⚠️
                                    </span>
                                )}

                                {isSecured && (
                                    <span className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-400 text-base shadow-lg ring-2 ring-white">
                                        ✓
                                    </span>
                                )}
                            </button>
                        )
                    })}

                    {!started && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center bg-cyan-950/35 p-5 backdrop-blur-sm">
                            <div className="max-w-xl rounded-[2.5rem] border-4 border-white bg-white/95 p-7 text-center shadow-2xl">
                                <div className="text-6xl">🛢️🚤</div>
                                <h2 className="mt-4 text-3xl font-black text-slate-950">Öl-Alarm starten</h2>
                                <p className="mx-auto mt-3 max-w-md text-base font-semibold leading-relaxed text-slate-700">
                                    Beobachte, wie ein Ölfilm wandert. Sichere Tiere, Pflanzen und Küste mit kleinen Rettungsaufgaben.
                                </p>
                                <button
                                    type="button"
                                    onClick={handleStart}
                                    className="mt-6 rounded-3xl bg-amber-500 px-8 py-4 text-lg font-black text-white shadow-xl transition hover:-translate-y-1 hover:bg-amber-600 active:scale-95"
                                >
                                    Einsatz starten
                                </button>
                            </div>
                        </div>
                    )}

                    {isComplete && !activeTarget && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center bg-cyan-950/35 p-5 backdrop-blur-sm">
                            <div className="oil-rescue-final max-w-3xl rounded-[2.5rem] border-4 border-white bg-white/95 p-8 text-center shadow-2xl">
                                <div className="text-7xl">🚤✨🌊</div>
                                <h2 className="mt-4 text-3xl font-black text-slate-950 md:text-5xl">
                                    Öl-Einsatz geschafft!
                                </h2>
                                <p className="mx-auto mt-4 max-w-2xl text-base font-semibold leading-relaxed text-slate-700 md:text-lg">
                                    Du hast die Ausbreitung erkannt, alle Warnzeichen untersucht und die richtigen Schutzmaßnahmen gesammelt.
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
                                        Nochmal retten
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>

                <div className="mt-4 rounded-[2rem] border-2 border-white/60 bg-white/82 p-3 shadow-2xl backdrop-blur-md">
                    <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="rounded-2xl bg-slate-950 px-4 py-3 text-white shadow-inner">
                                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-200">Rettungsalbum</p>
                                <p className="text-sm font-black">{securedCount} von {totalTargets} gesichert</p>
                            </div>
                            <div className="h-4 w-36 overflow-hidden rounded-full bg-slate-200 shadow-inner md:w-52">
                                <div
                                    className="h-full rounded-full bg-amber-400 transition-all duration-500"
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                        </div>

                        <div className="flex flex-wrap justify-center gap-2">
                            {affectedTargets.map((target) => {
                                const isSecured = securedTargetIds.includes(target.id)

                                return (
                                    <div
                                        key={target.id}
                                        className={`flex h-14 w-14 items-center justify-center rounded-2xl border-2 text-2xl shadow-md transition ${isSecured ? "oil-rescue-pop border-amber-200 bg-white" : "border-white/60 bg-slate-200 text-slate-400"}`}
                                        title={target.label}
                                    >
                                        {isSecured ? target.sticker : "?"}
                                    </div>
                                )
                            })}
                        </div>

                        <div className="flex flex-wrap justify-center gap-2">
                            {spreadSteps.map((step, index) => {
                                const isUsed = usedStepIds.includes(step.id)
                                const isLocked = !started || index > spillStage
                                const isNext = started && index === spillStage && spillStage < spreadSteps.length

                                return (
                                    <button
                                        key={step.id}
                                        type="button"
                                        onClick={() => handleSpread(step, index)}
                                        disabled={isLocked || activeTarget || isComplete || spillStage >= spreadSteps.length}
                                        className={`rounded-2xl px-4 py-3 text-sm font-black shadow transition active:scale-95 ${isLocked
                                            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                            : isUsed
                                                ? "bg-slate-900 text-white hover:bg-black"
                                                : isNext
                                                    ? "bg-amber-500 text-white hover:bg-amber-600"
                                                    : "bg-cyan-600 text-white hover:bg-cyan-700"
                                        }`}
                                        title={step.short}
                                    >
                                        <span className="mr-2">{step.icon}</span>
                                        {step.label}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {activeTarget && modalStage === "narrator" && (
                <div className="fixed bottom-5 right-5 z-[90] w-[min(370px,calc(100vw-2rem))] rounded-[1.5rem] border-4 border-white bg-amber-50/95 p-3 shadow-2xl backdrop-blur-md md:bottom-6 md:right-6">
                    <div className="flex items-center gap-3">
                        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.2rem] bg-gradient-to-br ${activeTarget.glowClass} text-3xl shadow-lg`}>
                            {activeTarget.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-amber-700">Narrator aktiv</p>
                            <p className="mt-1 text-sm font-black leading-tight text-slate-900">{activeTarget.shortLabel}: Schau kurz zum Erzähler.</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setModalStage("solution")}
                            className="shrink-0 rounded-2xl bg-amber-500 px-4 py-2 text-sm font-black text-white shadow-lg transition hover:bg-amber-600 active:scale-95"
                        >
                            Weiter
                        </button>
                    </div>
                </div>
            )}

            {activeTarget && modalStage !== "narrator" && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
                    <div className="relative w-full max-w-4xl overflow-hidden rounded-[2.1rem] border-4 border-white bg-white shadow-2xl">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(252,211,77,0.28),transparent_28%),radial-gradient(circle_at_80%_80%,rgba(186,230,253,0.55),transparent_30%)]" />
                        <div className="relative p-4 md:p-5">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className={`flex h-20 w-20 items-center justify-center rounded-[2rem] bg-gradient-to-br ${activeTarget.glowClass} text-5xl shadow-xl`}>
                                        {activeTarget.icon}
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-black uppercase tracking-[0.34em] text-amber-700">Mini-Einsatz</p>
                                        <h2 className="text-2xl font-black text-slate-950 md:text-3xl">{activeTarget.mini.title}</h2>
                                        <p className="mt-1 max-w-xl text-sm font-semibold text-slate-600">{activeTarget.source}</p>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={closeActiveModal}
                                    className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-black text-slate-700 shadow transition hover:bg-slate-200 active:scale-95"
                                >
                                    Schließen
                                </button>
                            </div>

                            {modalStage === "challenge" && (
                                <div className="mt-5 grid gap-4 lg:grid-cols-[1.25fr_0.75fr]">
                                    <div className="relative min-h-[300px] overflow-hidden rounded-[1.75rem] border-4 border-cyan-100 bg-[linear-gradient(180deg,#dffcff_0%,#7dd3fc_55%,#0e7490_100%)] shadow-inner">
                                        <div className="absolute inset-0 opacity-30 bg-[linear-gradient(rgba(255,255,255,.6)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.6)_1px,transparent_1px)] bg-[length:46px_46px]" />
                                        <div className="absolute left-4 top-4 rounded-full bg-white/80 px-3 py-2 text-xs font-black text-cyan-900 shadow">
                                            {activeTarget.mini.scene} Richtige Stellen antippen
                                        </div>

                                        {activeTarget.mini.items.map((item, index) => {
                                            const selected = challengeHits.includes(item.id)
                                            const wrong = wrongItems.includes(item.id)

                                            return (
                                                <button
                                                    key={item.id}
                                                    type="button"
                                                    onClick={() => handleChallengeItemClick(item)}
                                                    className={`absolute z-10 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[1.3rem] border-4 text-3xl shadow-xl transition hover:scale-110 active:scale-95 md:h-20 md:w-20 md:text-4xl ${selected ? "border-emerald-200 bg-emerald-100 opacity-70" : "border-white/80 bg-white/80"} ${wrong ? "oil-rescue-wiggle border-rose-200 bg-rose-100" : ""}`}
                                                    style={{
                                                        left: `${item.x}%`,
                                                        top: `${item.y}%`,
                                                        animationDelay: `${index * 0.12}s`,
                                                    }}
                                                    aria-label={item.label}
                                                    title={item.label}
                                                    disabled={selected}
                                                >
                                                    <span className={selected ? "grayscale" : ""}>{selected ? "✅" : item.emoji}</span>
                                                </button>
                                            )
                                        })}

                                        <div className="pointer-events-none absolute bottom-4 left-4 right-4 rounded-[1.25rem] bg-white/85 p-3 text-center text-xs font-black text-slate-700 shadow-lg md:text-sm">
                                            {activeTarget.mini.instruction}
                                        </div>
                                    </div>

                                    <div className="rounded-[1.75rem] bg-slate-950 p-4 text-white shadow-inner">
                                        <div className="flex items-center justify-between gap-3">
                                            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-amber-200">Einsatz-Filter</p>
                                            <span className="rounded-full bg-white px-3 py-1 text-sm font-black text-slate-950">
                                                {challengeHits.length}/{getCorrectItems(activeTarget).length}
                                            </span>
                                        </div>
                                        <p className="mt-3 text-base font-black md:text-lg">{activeTarget.mini.collectLabel}</p>
                                        <div className="mt-4 grid grid-cols-3 gap-2">
                                            {getCorrectItems(activeTarget).map((item) => {
                                                const selected = challengeHits.includes(item.id)

                                                return (
                                                    <div
                                                        key={item.id}
                                                        className={`flex h-16 items-center justify-center rounded-2xl border-2 text-2xl transition md:h-20 md:text-3xl ${selected ? "oil-rescue-pop border-emerald-200 bg-emerald-100 text-slate-950" : "border-white/15 bg-white/10 text-white/40"}`}
                                                    >
                                                        {selected ? item.emoji : "?"}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                        <div className="mt-4 rounded-[1.25rem] bg-white/10 p-3 text-xs font-semibold leading-relaxed text-amber-50 md:text-sm">
                                            Nur Öl sichern — Tiere, Pflanzen und natürliche Teile bleiben geschützt.
                                        </div>
                                    </div>
                                </div>
                            )}

                            {modalStage === "solution" && (
                                <div className="mt-5">
                                    <div className="rounded-[1.5rem] bg-amber-50 p-4 text-center shadow-inner">
                                        <p className="text-[11px] font-black uppercase tracking-[0.32em] text-amber-700">Schutzidee</p>
                                        <h3 className="mt-1 text-xl font-black text-slate-950 md:text-2xl">Welche Karte hilft wirklich?</h3>
                                    </div>
                                    <div className="mt-4 grid gap-3 md:grid-cols-3">
                                        {activeTarget.solutions.map((solution) => {
                                            const isWrong = wrongSolutionId === solution.id

                                            return (
                                                <button
                                                    key={solution.id}
                                                    type="button"
                                                    onClick={() => handleSolutionClick(solution)}
                                                    className={`rounded-[1.7rem] border-4 bg-white p-4 text-left shadow-xl transition hover:-translate-y-1 hover:border-amber-200 active:scale-95 ${isWrong ? "oil-rescue-card-wiggle border-rose-200 bg-rose-50" : "border-amber-50"}`}
                                                >
                                                    <div className="text-5xl">{solution.icon}</div>
                                                    <h4 className="mt-3 text-lg font-black text-slate-950 md:text-xl">{solution.title}</h4>
                                                    <p className="mt-2 text-xs font-semibold leading-relaxed text-slate-600 md:text-sm">{solution.text}</p>
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {modalStage === "sticker" && (
                                <div className="mt-5 rounded-[1.75rem] bg-emerald-50 p-6 text-center shadow-inner">
                                    <div className="oil-rescue-warning mx-auto flex h-28 w-28 items-center justify-center rounded-[2.4rem] border-4 border-white bg-white text-7xl shadow-2xl md:h-32 md:w-32">
                                        {activeTarget.sticker}
                                    </div>
                                    <h3 className="mt-4 text-2xl font-black text-slate-950 md:text-3xl">Rettungssticker gesichert!</h3>
                                    <p className="mx-auto mt-2 max-w-xl text-sm font-semibold leading-relaxed text-slate-700 md:text-base">
                                        {activeTarget.shortLabel} ist jetzt im Rettungsalbum. Du hast Gefahr und Schutzmaßnahme verbunden.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={closeActiveModal}
                                        className="mt-5 rounded-3xl bg-emerald-600 px-7 py-3 text-base font-black text-white shadow-xl transition hover:-translate-y-1 hover:bg-emerald-700 active:scale-95 md:text-lg"
                                    >
                                        {securedTargetIds.length === totalTargets ? "Finale ansehen" : "Weiter retten"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}

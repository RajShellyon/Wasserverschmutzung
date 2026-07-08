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

const SCANNER_RADIUS = 145
const NEAR_RADIUS = 360

const particles = [
    {
        id: 1,
        icon: "🧵",
        label: "Faser-Fund",
        shortLabel: "Faser",
        source: "Kleidung kann beim Waschen winzige Kunststofffasern verlieren.",
        sticker: "🧶",
        x: 16,
        y: 26,
        drift: "micro-sub-drift-a",
        glowClass: "from-fuchsia-200 to-pink-300",
        mini: {
            title: "Faser-Wirbel entwirren",
            instruction: "Tippe nur die bunten Kunststofffasern an. Wasserpflanzen bleiben im Meer.",
            collectLabel: "Fasern gelöst",
            scene: "🌊🧵",
            items: [
                { id: "f1", emoji: "🧵", label: "Kunststofffaser", correct: true, x: 18, y: 34 },
                { id: "f2", emoji: "🧶", label: "Faserknäuel", correct: true, x: 58, y: 22 },
                { id: "f3", emoji: "〰️", label: "feine Faser", correct: true, x: 74, y: 56 },
                { id: "f4", emoji: "🌿", label: "Wasserpflanze", correct: false, x: 38, y: 64 },
                { id: "f5", emoji: "🐟", label: "kleiner Fisch", correct: false, x: 82, y: 28 },
                { id: "f6", emoji: "🍃", label: "Blatt", correct: false, x: 28, y: 18 },
            ],
        },
        solutions: [
            { id: "wash", icon: "🧺", title: "Schonend waschen", text: "Wäschesack, volle Trommel und weniger Abrieb helfen.", correct: true },
            { id: "hot", icon: "🔥", title: "Heißer waschen", text: "Das macht Fasern nicht automatisch besser.", correct: false },
            { id: "glitter", icon: "✨", title: "Mehr Duftperlen", text: "Zusätze lösen das Mikroplastik-Problem nicht.", correct: false },
        ],
    },
    {
        id: 2,
        icon: "⚫",
        label: "Straßen-Spur",
        shortLabel: "Reifen",
        source: "Reifenabrieb wird vom Regen von Straßen in Gullys gespült.",
        sticker: "🛞",
        x: 31,
        y: 68,
        drift: "micro-sub-drift-b",
        glowClass: "from-slate-300 to-slate-700",
        mini: {
            title: "Gully-Alarm stoppen",
            instruction: "Fange die dunklen Reifenkrümel ab, bevor der Regen sie wegspült.",
            collectLabel: "Krümel im Filter",
            scene: "🌧️🛞",
            items: [
                { id: "r1", emoji: "⚫", label: "Reifenabrieb", correct: true, x: 21, y: 28 },
                { id: "r2", emoji: "▪️", label: "Gummikrümel", correct: true, x: 52, y: 48 },
                { id: "r3", emoji: "⚫", label: "Straßenstaub", correct: true, x: 72, y: 24 },
                { id: "r4", emoji: "💧", label: "Regentropfen", correct: false, x: 34, y: 66 },
                { id: "r5", emoji: "🪨", label: "Stein", correct: false, x: 79, y: 64 },
                { id: "r6", emoji: "🍂", label: "Laub", correct: false, x: 44, y: 20 },
            ],
        },
        solutions: [
            { id: "bike", icon: "🚲", title: "Kurze Wege radeln", text: "Weniger Autofahrten bedeuten weniger Reifenabrieb.", correct: true },
            { id: "fast", icon: "🏎️", title: "Schneller fahren", text: "Mehr Abrieb kann dadurch sogar entstehen.", correct: false },
            { id: "washstreet", icon: "🧽", title: "Alles in den Gully", text: "Der Gully führt Spuren oft weiter ins Wasser.", correct: false },
        ],
    },
    {
        id: 3,
        icon: "🔹",
        label: "Splitter-Fund",
        shortLabel: "Splitter",
        source: "Größere Plastikteile zerbrechen langsam zu kleinen Splittern.",
        sticker: "🔷",
        x: 47,
        y: 32,
        drift: "micro-sub-drift-c",
        glowClass: "from-sky-200 to-blue-400",
        mini: {
            title: "Splitter oder Stein?",
            instruction: "Sortiere die scharfen blauen Plastikscherben aus dem Kiesbett.",
            collectLabel: "Splitter sortiert",
            scene: "🪨🔹",
            items: [
                { id: "p1", emoji: "🔹", label: "Plastikscherbe", correct: true, x: 18, y: 48 },
                { id: "p2", emoji: "🔷", label: "Plastiksplitter", correct: true, x: 47, y: 24 },
                { id: "p3", emoji: "🟦", label: "Kunststoffstück", correct: true, x: 77, y: 46 },
                { id: "p4", emoji: "🪨", label: "Kieselstein", correct: false, x: 30, y: 70 },
                { id: "p5", emoji: "🐚", label: "Muschel", correct: false, x: 63, y: 68 },
                { id: "p6", emoji: "💎", label: "Glanzstein", correct: false, x: 83, y: 18 },
            ],
        },
        solutions: [
            { id: "reuse", icon: "🥤", title: "Mehrweg nutzen", text: "Je weniger Einwegplastik herumliegt, desto weniger Splitter entstehen.", correct: true },
            { id: "crush", icon: "🦶", title: "Plastik zertreten", text: "Dann wird es erst recht zu kleineren Teilen.", correct: false },
            { id: "hide", icon: "🕳️", title: "Vergraben", text: "Vergraben löst das Problem nicht dauerhaft.", correct: false },
        ],
    },
    {
        id: 4,
        icon: "🟦",
        label: "Folien-Fund",
        shortLabel: "Folie",
        source: "Dünne Folien reißen leicht und treiben als winzige Stücke weiter.",
        sticker: "🎐",
        x: 70,
        y: 25,
        drift: "micro-sub-drift-a",
        glowClass: "from-cyan-200 to-blue-300",
        mini: {
            title: "Flatter-Folie einfangen",
            instruction: "Tippe die blauen Folienstücke an. Luftblasen dürfen weiterblubbern.",
            collectLabel: "Folie gefangen",
            scene: "💨🟦",
            items: [
                { id: "fo1", emoji: "🟦", label: "Folienrest", correct: true, x: 23, y: 30 },
                { id: "fo2", emoji: "🔷", label: "Folienfetzen", correct: true, x: 63, y: 20 },
                { id: "fo3", emoji: "🧊", label: "durchsichtige Folie", correct: true, x: 78, y: 58 },
                { id: "fo4", emoji: "🫧", label: "Blase", correct: false, x: 40, y: 58 },
                { id: "fo5", emoji: "🐠", label: "Fisch", correct: false, x: 17, y: 68 },
                { id: "fo6", emoji: "🌊", label: "Welle", correct: false, x: 85, y: 28 },
            ],
        },
        solutions: [
            { id: "box", icon: "🍱", title: "Dose statt Folie", text: "Brotdosen und wiederverwendbare Verpackung sparen Folienmüll.", correct: true },
            { id: "light", icon: "🎈", title: "Dünnere Folie", text: "Dünn reißt besonders schnell.", correct: false },
            { id: "throw", icon: "🌬️", title: "Wegfliegen lassen", text: "Wind trägt Folie oft direkt in die Umwelt.", correct: false },
        ],
    },
    {
        id: 5,
        icon: "✨",
        label: "Glitzer-Kügelchen",
        shortLabel: "Kügelchen",
        source: "Winzige Kunststoffkügelchen können aus Produkten oder zerfallendem Plastik stammen.",
        sticker: "🫧",
        x: 83,
        y: 55,
        drift: "micro-sub-drift-b",
        glowClass: "from-violet-200 to-fuchsia-300",
        mini: {
            title: "Glitzer nicht mit Blasen verwechseln",
            instruction: "Sammle nur die festen Kunststoffkügelchen. Echte Blasen zerplatzen harmlos.",
            collectLabel: "Kügelchen gesammelt",
            scene: "✨🫧",
            items: [
                { id: "k1", emoji: "✨", label: "Kunststoffkügelchen", correct: true, x: 18, y: 22 },
                { id: "k2", emoji: "🟣", label: "Mikrokügelchen", correct: true, x: 51, y: 50 },
                { id: "k3", emoji: "🔵", label: "Plastikperle", correct: true, x: 77, y: 28 },
                { id: "k4", emoji: "🫧", label: "Blase", correct: false, x: 32, y: 68 },
                { id: "k5", emoji: "⭐", label: "Lichtreflex", correct: false, x: 68, y: 72 },
                { id: "k6", emoji: "🐚", label: "Muschelpunkt", correct: false, x: 84, y: 58 },
            ],
        },
        solutions: [
            { id: "label", icon: "🔍", title: "Produkte prüfen", text: "Auf feste Plastikpartikel und Glitzer in Produkten achten.", correct: true },
            { id: "moreglitter", icon: "💄", title: "Mehr Glitzer", text: "Mehr Glitzer kann mehr kleine Teilchen bedeuten.", correct: false },
            { id: "rinse", icon: "🚿", title: "Einfach wegspülen", text: "Wegspülen bringt Teilchen ins Abwasser.", correct: false },
        ],
    },
    {
        id: 6,
        icon: "▫️",
        label: "Styropor-Brösel",
        shortLabel: "Styropor",
        source: "Styropor zerbröselt leicht und bleibt als helle Partikel lange im Wasser.",
        sticker: "☁️",
        x: 24,
        y: 43,
        drift: "micro-sub-drift-c",
        glowClass: "from-white to-slate-200",
        mini: {
            title: "Schaum-Brösel retten",
            instruction: "Fische die weißen Styroporbrösel heraus. Tier-Eier und Wolkenspiegel bleiben unberührt.",
            collectLabel: "Brösel gefiltert",
            scene: "☁️▫️",
            items: [
                { id: "s1", emoji: "▫️", label: "Styropor", correct: true, x: 20, y: 36 },
                { id: "s2", emoji: "◽", label: "Schaumbrösel", correct: true, x: 55, y: 24 },
                { id: "s3", emoji: "▫️", label: "leichter Brösel", correct: true, x: 73, y: 62 },
                { id: "s4", emoji: "🥚", label: "Fischei", correct: false, x: 36, y: 68 },
                { id: "s5", emoji: "☁️", label: "Spiegelung", correct: false, x: 78, y: 28 },
                { id: "s6", emoji: "🐡", label: "Kugelfisch", correct: false, x: 27, y: 20 },
            ],
        },
        solutions: [
            { id: "pack", icon: "📦", title: "Verpackung richtig entsorgen", text: "Nichts zerbröseln lassen und Abfall sicher sammeln.", correct: true },
            { id: "break", icon: "💥", title: "Klein brechen", text: "Dann entstehen noch mehr kleine Brösel.", correct: false },
            { id: "float", icon: "🌊", title: "Schwimmen lassen", text: "Styropor treibt weit und lange.", correct: false },
        ],
    },
    {
        id: 7,
        icon: "🪢",
        label: "Netz-Fasern",
        shortLabel: "Netz",
        source: "Seile, Netze und Kunststoffe können durch Reibung kleine Fasern verlieren.",
        sticker: "🕸️",
        x: 57,
        y: 76,
        drift: "micro-sub-drift-a",
        glowClass: "from-emerald-200 to-teal-400",
        mini: {
            title: "Netz-Knoten lösen",
            instruction: "Löse die künstlichen Netzfäden aus den Algen. Die Tiere bleiben frei.",
            collectLabel: "Fäden gelöst",
            scene: "🌿🪢",
            items: [
                { id: "n1", emoji: "🪢", label: "Netzfaser", correct: true, x: 24, y: 30 },
                { id: "n2", emoji: "🕸️", label: "Kunststofffaden", correct: true, x: 56, y: 54 },
                { id: "n3", emoji: "〰️", label: "Seilabrieb", correct: true, x: 82, y: 34 },
                { id: "n4", emoji: "🌱", label: "Alge", correct: false, x: 37, y: 70 },
                { id: "n5", emoji: "🦀", label: "Krabbe", correct: false, x: 70, y: 72 },
                { id: "n6", emoji: "🐙", label: "Oktopus", correct: false, x: 16, y: 58 },
            ],
        },
        solutions: [
            { id: "repair", icon: "🧰", title: "Netze reparieren", text: "Kaputte Kunststoffnetze sammeln, flicken oder richtig entsorgen.", correct: true },
            { id: "cut", icon: "✂️", title: "Ins Wasser schneiden", text: "Kleine Fäden im Wasser werden zum Problem.", correct: false },
            { id: "leave", icon: "⚓", title: "Liegen lassen", text: "Verlorene Netze können weiter zerfasern.", correct: false },
        ],
    },
    {
        id: 8,
        icon: "🧼",
        label: "Abfluss-Spur",
        shortLabel: "Abfluss",
        source: "Über Waschbecken, Dusche oder Waschmaschine können Teilchen ins Abwasser gelangen.",
        sticker: "🚿",
        x: 40,
        y: 18,
        drift: "micro-sub-drift-b",
        glowClass: "from-cyan-100 to-teal-300",
        mini: {
            title: "Rohr-Weiche umstellen",
            instruction: "Tippe die Teilchen an, die nicht einfach durch den Abfluss verschwinden sollen.",
            collectLabel: "Abfluss-Spuren abgefangen",
            scene: "🚿🧼",
            items: [
                { id: "a1", emoji: "🧼", label: "Produkt-Rest", correct: true, x: 21, y: 28 },
                { id: "a2", emoji: "✨", label: "Mikroteilchen", correct: true, x: 50, y: 20 },
                { id: "a3", emoji: "🧵", label: "Waschfaser", correct: true, x: 74, y: 48 },
                { id: "a4", emoji: "💧", label: "Wasser", correct: false, x: 32, y: 68 },
                { id: "a5", emoji: "🫧", label: "Schaumblase", correct: false, x: 58, y: 70 },
                { id: "a6", emoji: "🔩", label: "Rohrventil", correct: false, x: 84, y: 24 },
            ],
        },
        solutions: [
            { id: "filter", icon: "🧃", title: "Filter & Sieb nutzen", text: "Sieb, Filter und bewusste Produkte halten Spuren zurück.", correct: true },
            { id: "flush", icon: "🚽", title: "Wegspülen", text: "Wegspülen verlagert das Problem ins Abwasser.", correct: false },
            { id: "foam", icon: "🫧", title: "Mehr Schaum", text: "Mehr Schaum filtert keine Kunststoffteilchen.", correct: false },
        ],
    },
]

const allVideoSources = [INTRO_VIDEO, ...Object.values(videoByParticleId)]

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max)
}

function getCorrectItems(particle) {
    return particle.mini.items.filter((item) => item.correct)
}

function getDistance(pointA, pointB) {
    const dx = pointA.x - pointB.x
    const dy = pointA.y - pointB.y
    return Math.sqrt(dx * dx + dy * dy)
}

export default function MikroplastikMission({ mission, onBack }) {
    const oceanRef = useRef(null)
    const narratorAnchorRef = useRef(null)
    const narratorVideoRef = useRef(null)

    const [started, setStarted] = useState(false)
    const [foundIds, setFoundIds] = useState([])
    const [scannedIds, setScannedIds] = useState([])
    const [scannerPosition, setScannerPosition] = useState({ x: 52, y: 48 })
    const [pulseKey, setPulseKey] = useState(0)
    const [activeParticleId, setActiveParticleId] = useState(null)
    const [modalStage, setModalStage] = useState("challenge")
    const [challengeHits, setChallengeHits] = useState([])
    const [wrongItems, setWrongItems] = useState([])
    const [wrongSolutionId, setWrongSolutionId] = useState(null)
    const [captainLine, setCaptainLine] = useState("Bereit für den Tauchgang? Starte die Lupe. Die Sonarwelle schaltet die Hover-Spuren frei.")

    const activeParticle = particles.find((particle) => particle.id === activeParticleId) ?? null
    const foundCount = foundIds.length
    const totalCount = particles.length
    const progressPercent = Math.round((foundCount / totalCount) * 100)
    const isComplete = foundCount === totalCount

    function getOceanRect() {
        return oceanRef.current?.getBoundingClientRect() ?? null
    }

    function pointFromPointer(event) {
        const rect = getOceanRect()
        if (!rect) return null

        return {
            x: clamp(((event.clientX - rect.left) / rect.width) * 100, 3, 97),
            y: clamp(((event.clientY - rect.top) / rect.height) * 100, 7, 93),
        }
    }

    function updateScanner(event) {
        const nextPoint = pointFromPointer(event)
        if (!nextPoint) return
        setScannerPosition(nextPoint)
    }

    function getParticlePixelPoint(particle) {
        const rect = getOceanRect()
        if (!rect) return null

        return {
            x: (particle.x / 100) * rect.width,
            y: (particle.y / 100) * rect.height,
        }
    }

    function getScannerPixelPoint() {
        const rect = getOceanRect()
        if (!rect) return null

        return {
            x: (scannerPosition.x / 100) * rect.width,
            y: (scannerPosition.y / 100) * rect.height,
        }
    }

    function getDistanceToScanner(particle) {
        const particlePoint = getParticlePixelPoint(particle)
        const scannerPoint = getScannerPixelPoint()

        if (!particlePoint || !scannerPoint) return Number.POSITIVE_INFINITY
        return getDistance(particlePoint, scannerPoint)
    }

    function getDistanceToPoint(particle, point) {
        const rect = getOceanRect()
        if (!rect || !point) return Number.POSITIVE_INFINITY

        const particlePoint = {
            x: (particle.x / 100) * rect.width,
            y: (particle.y / 100) * rect.height,
        }

        const scannerPoint = {
            x: (point.x / 100) * rect.width,
            y: (point.y / 100) * rect.height,
        }

        return getDistance(particlePoint, scannerPoint)
    }

    function scanParticlesAt(point) {
        const newlyScannedParticles = particles.filter((particle) => {
            if (foundIds.includes(particle.id) || scannedIds.includes(particle.id)) return false
            return getDistanceToPoint(particle, point) <= SCANNER_RADIUS
        })

        if (newlyScannedParticles.length === 0) {
            setCaptainLine("Sonarwelle gesendet. Noch keine unsichtbare Spur berührt — versuche es näher am Signal.")
            return
        }

        setScannedIds((prev) => [
            ...prev,
            ...newlyScannedParticles
                .map((particle) => particle.id)
                .filter((id) => !prev.includes(id)),
        ])

        if (newlyScannedParticles.length === 1) {
            setCaptainLine(`${newlyScannedParticles[0].label} gescannt. Hover ist jetzt aktiv: fahre darüber und tippe die Spur an.`)
        } else {
            setCaptainLine(`${newlyScannedParticles.length} Spuren gescannt. Hover ist jetzt für diese Spuren aktiv.`)
        }
    }

    function isParticleScannable(particle) {
        return scannedIds.includes(particle.id)
    }

    function getSignalStrength() {
        const hiddenParticles = particles.filter((particle) => !foundIds.includes(particle.id))
        if (hiddenParticles.length === 0) return 100

        const nearestDistance = Math.min(...hiddenParticles.map(getDistanceToScanner))
        return clamp(Math.round((1 - nearestDistance / NEAR_RADIUS) * 100), 0, 100)
    }

    function getSignalLine() {
        const signal = getSignalStrength()
        if (!started) return "Sonar schläft noch."
        if (signal >= 82) return "Piep! Direkt unter dem Scanner!"
        if (signal >= 58) return "Heißer Strom: sehr nah dran."
        if (signal >= 32) return "Leises Signal: weiter scannen."
        return "Noch ruhig. Fahre das U-Boot langsam weiter."
    }

    function handleStart() {
        setStarted(true)
        setPulseKey((prev) => prev + 1)
        setCaptainLine("Bewege die Lupe. Linksklick sendet die Sonarwelle. Berührt sie eine Spur, wird deren Hover-Funktion freigeschaltet.")
    }

    function handleOceanPointerMove(event) {
        if (!started || activeParticle || isComplete) return
        updateScanner(event)
    }

    function handleOceanPointerDown(event) {
        if (!started || activeParticle || isComplete) return

        const nextPoint = pointFromPointer(event)
        if (!nextPoint) return

        setScannerPosition(nextPoint)
        setPulseKey((prev) => prev + 1)
        scanParticlesAt(nextPoint)
    }

    function openParticleChallenge(particle) {
        if (!started || foundIds.includes(particle.id) || activeParticle) return

        if (!isParticleScannable(particle)) {
            setCaptainLine("Erst mit einer Sonarwelle freischalten: Linksklick auf die Lupe, wenn sie nah genug ist.")
            setPulseKey((prev) => prev + 1)
            return
        }

        setActiveParticleId(particle.id)
        setModalStage("challenge")
        setChallengeHits([])
        setWrongItems([])
        setWrongSolutionId(null)
        setCaptainLine(`${particle.label} entdeckt. Jetzt braucht das U-Boot deine Hilfe.`)
    }

    function handleChallengeItemClick(item) {
        if (!activeParticle || modalStage !== "challenge") return

        if (!item.correct) {
            setWrongItems((prev) => [...new Set([...prev, item.id])])
            setCaptainLine("Guter Blick, aber das gehört ins Wasser. Suche nur die Mikroplastik-Spuren.")
            window.setTimeout(() => {
                setWrongItems((prev) => prev.filter((id) => id !== item.id))
            }, 700)
            return
        }

        if (challengeHits.includes(item.id)) return

        const nextHits = [...challengeHits, item.id]
        setChallengeHits(nextHits)
        setCaptainLine("Treffer! Der Fund wird im Mini-Filter gesammelt.")

        if (nextHits.length >= getCorrectItems(activeParticle).length) {
            const nextVideoSrc = videoByParticleId[activeParticle.id]
            if (nextVideoSrc) {
                narratorVideoRef.current?.playVideoFromStart(nextVideoSrc)
            }

            setModalStage("narrator")
            setCaptainLine("Beweis gesichert. Der Erzähler erklärt den Fund direkt im Narrator-Fenster.")
        }
    }

    function handleSolutionClick(solution) {
        if (!activeParticle || modalStage !== "solution") return

        if (!solution.correct) {
            setWrongSolutionId(solution.id)
            setCaptainLine("Das klingt spannend, hilft hier aber nicht genug. Such die Idee, die die Ursache stoppt.")
            window.setTimeout(() => setWrongSolutionId(null), 800)
            return
        }

        setWrongSolutionId(null)
        setFoundIds((prev) => (prev.includes(activeParticle.id) ? prev : [...prev, activeParticle.id]))
        setModalStage("sticker")
        setCaptainLine(`${activeParticle.shortLabel}-Sticker eingeklebt! Das Meer ist ein Stück sicherer.`)
    }

    function closeActiveModal() {
        const allFoundAfterThis = foundIds.length === totalCount
        setActiveParticleId(null)
        setChallengeHits([])
        setWrongItems([])
        setWrongSolutionId(null)
        setModalStage("challenge")
        setPulseKey((prev) => prev + 1)

        if (!allFoundAfterThis) {
            setCaptainLine("Weiter tauchen. Scanne die nächste unsichtbare Spur und nutze danach Hover.")
        }
    }

    function resetMission() {
        setStarted(false)
        setFoundIds([])
        setScannedIds([])
        setScannerPosition({ x: 52, y: 48 })
        setPulseKey(0)
        setActiveParticleId(null)
        setModalStage("challenge")
        setChallengeHits([])
        setWrongItems([])
        setWrongSolutionId(null)
        setCaptainLine("Bereit für den Tauchgang? Starte die Lupe. Die Sonarwelle schaltet die Hover-Spuren frei.")
    }

    const signalStrength = getSignalStrength()

    return (
        <section className="relative h-screen w-screen overflow-hidden bg-[#071a3a] text-slate-950">
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
                    @keyframes microOceanGlow {
                        0%, 100% { filter: hue-rotate(0deg) brightness(1); }
                        50% { filter: hue-rotate(8deg) brightness(1.08); }
                    }

                    @keyframes microSubFloat {
                        0%, 100% { transform: translate(-50%, -50%) translateY(0) rotate(-2deg); }
                        50% { transform: translate(-50%, -50%) translateY(-9px) rotate(2deg); }
                    }

                    @keyframes microScannerPulse {
                        0% { transform: translate(-50%, -50%) scale(0.45); opacity: 0.85; }
                        80% { opacity: 0.08; }
                        100% { transform: translate(-50%, -50%) scale(1.8); opacity: 0; }
                    }

                    @keyframes microScannerSpin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }

                    @keyframes microBubbleFloat {
                        0% { transform: translateY(60px) scale(0.6); opacity: 0; }
                        18% { opacity: 0.45; }
                        100% { transform: translateY(-180px) scale(1.2); opacity: 0; }
                    }

                    @keyframes microFishSwimLeft {
                        0% { transform: translateX(0) scaleX(1); }
                        50% { transform: translateX(-26px) scaleX(1); }
                        100% { transform: translateX(0) scaleX(1); }
                    }

                    @keyframes microPlantWave {
                        0%, 100% { transform: rotate(-4deg) translateY(0); }
                        50% { transform: rotate(5deg) translateY(-4px); }
                    }

                    @keyframes microSubDriftA {
                        0%, 100% { transform: translate(-50%, -50%) translate(0, 0) rotate(-5deg); }
                        25% { transform: translate(-50%, -50%) translate(10px, -8px) rotate(4deg); }
                        60% { transform: translate(-50%, -50%) translate(-6px, 10px) rotate(-2deg); }
                    }

                    @keyframes microSubDriftB {
                        0%, 100% { transform: translate(-50%, -50%) translate(0, 0) rotate(5deg); }
                        35% { transform: translate(-50%, -50%) translate(-12px, 7px) rotate(-4deg); }
                        70% { transform: translate(-50%, -50%) translate(8px, -10px) rotate(2deg); }
                    }

                    @keyframes microSubDriftC {
                        0%, 100% { transform: translate(-50%, -50%) translate(0, 0) rotate(0deg); }
                        40% { transform: translate(-50%, -50%) translate(9px, 9px) rotate(6deg); }
                        75% { transform: translate(-50%, -50%) translate(-10px, -5px) rotate(-5deg); }
                    }

                    @keyframes microFoundPop {
                        0% { transform: scale(0.35) rotate(-18deg); opacity: 0; }
                        60% { transform: scale(1.18) rotate(8deg); opacity: 1; }
                        100% { transform: scale(1) rotate(0deg); opacity: 1; }
                    }

                    @keyframes microItemWiggle {
                        0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
                        20% { transform: translate(-50%, -50%) rotate(-10deg) scale(1.06); }
                        40% { transform: translate(-50%, -50%) rotate(10deg) scale(1.06); }
                        60% { transform: translate(-50%, -50%) rotate(-7deg) scale(1.04); }
                        80% { transform: translate(-50%, -50%) rotate(7deg) scale(1.04); }
                    }

                    @keyframes microCardWiggle {
                        0%, 100% { transform: rotate(0deg); }
                        20% { transform: rotate(-3deg) scale(1.02); }
                        40% { transform: rotate(3deg) scale(1.02); }
                        60% { transform: rotate(-2deg) scale(1.01); }
                        80% { transform: rotate(2deg) scale(1.01); }
                    }

                    @keyframes microBadgePulse {
                        0%, 100% { transform: translateY(0) scale(1); }
                        50% { transform: translateY(-4px) scale(1.04); }
                    }

                    @keyframes microWaterClean {
                        0% { opacity: 0; transform: translateY(22px); }
                        100% { opacity: 1; transform: translateY(0); }
                    }

                    .micro-ocean-glow { animation: microOceanGlow 8s ease-in-out infinite; }
                    .micro-submarine { animation: microSubFloat 3.2s ease-in-out infinite; }
                    .micro-scanner-pulse { animation: microScannerPulse 1.25s ease-out forwards; }
                    .micro-scanner-spin { animation: microScannerSpin 5.5s linear infinite; }
                    .micro-bubble-float { animation: microBubbleFloat 7s ease-in-out infinite; }
                    .micro-fish-left { animation: microFishSwimLeft 5.5s ease-in-out infinite; }
                    .micro-plant { animation: microPlantWave 4s ease-in-out infinite; transform-origin: bottom center; }
                    .micro-sub-drift-a { animation: microSubDriftA 6.6s ease-in-out infinite; }
                    .micro-sub-drift-b { animation: microSubDriftB 7.1s ease-in-out infinite; }
                    .micro-sub-drift-c { animation: microSubDriftC 7.8s ease-in-out infinite; }
                    .micro-found-pop { animation: microFoundPop 0.55s cubic-bezier(.17,.84,.44,1) both; }
                    .micro-item-wiggle { animation: microItemWiggle 0.55s ease-in-out; }
                    .micro-card-wiggle { animation: microCardWiggle 0.55s ease-in-out; }
                    .micro-badge-pulse { animation: microBadgePulse 2.2s ease-in-out infinite; }
                    .micro-water-clean { animation: microWaterClean 0.8s ease-out both; }
                `}
            </style>

            <div className="absolute inset-0 micro-ocean-glow bg-[radial-gradient(circle_at_25%_8%,rgba(142,234,255,0.88),transparent_24%),radial-gradient(circle_at_75%_32%,rgba(20,184,166,0.34),transparent_24%),linear-gradient(180deg,#b9f6ff_0%,#2bb9e6_38%,#075985_100%)]" />
            <div className="absolute inset-0 opacity-[0.18] bg-[linear-gradient(rgba(255,255,255,.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.5)_1px,transparent_1px)] bg-[length:72px_72px]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_110%,rgba(2,6,23,0.42),transparent_56%)]" />

            <div ref={narratorAnchorRef} className="pointer-events-none absolute left-[40%] top-6 z-[115] h-28 w-28 -translate-x-1/2 md:left-[40%] md:top-7" />

            <div className="relative z-10 flex h-full flex-col p-4 md:p-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="rounded-[2rem] border-2 border-white/65 bg-white/80 px-5 py-4 shadow-2xl backdrop-blur-md md:max-w-[460px]">
                        <div className="flex items-center gap-3">
                            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-cyan-100 text-3xl shadow-inner">
                                🚢
                            </div>
                            <div>
                                <p className="text-[11px] font-black uppercase tracking-[0.32em] text-cyan-700">
                                    Mission {mission?.id ?? 2}
                                </p>
                                <h1 className="text-xl font-black leading-tight text-slate-950 md:text-3xl">
                                    Mikroplastik-Tauchgang
                                </h1>
                            </div>
                        </div>
                        <p className="mt-3 text-sm font-semibold leading-relaxed text-slate-700 md:text-base">
                            {captainLine}
                        </p>
                    </div>

                    <div className="hidden rounded-[2rem] border-2 border-white/50 bg-slate-950/75 p-4 text-white shadow-2xl backdrop-blur-md md:block md:w-[320px] lg:w-[380px]">
                        <div className="flex items-center justify-between">
                            <p className="text-[11px] font-black uppercase tracking-[0.35em] text-cyan-200">Sonar</p>
                            <span className="rounded-full bg-cyan-100 px-3 py-1 text-sm font-black text-cyan-900">{signalStrength}%</span>
                        </div>
                        <div className="mt-3 h-4 overflow-hidden rounded-full bg-white/15 shadow-inner">
                            <div
                                className="h-full rounded-full bg-cyan-300 transition-all duration-300"
                                style={{ width: `${signalStrength}%` }}
                            />
                        </div>
                        <p className="mt-3 text-sm font-bold text-cyan-50">{getSignalLine()}</p>
                    </div>

                    <button
                        type="button"
                        onClick={onBack}
                        className="rounded-2xl border-2 border-white/70 bg-white px-5 py-3 text-sm font-black text-cyan-800 shadow-xl transition hover:-translate-y-0.5 hover:bg-cyan-50 active:scale-95"
                    >
                        Zurück
                    </button>
                </div>

                <main
                    ref={oceanRef}
                    onPointerMove={handleOceanPointerMove}
                    onPointerDown={handleOceanPointerDown}
                    className="relative mt-4 flex-1 overflow-hidden rounded-[2.5rem] border-2 border-white/55 bg-cyan-300/20 shadow-[inset_0_-80px_100px_rgba(8,47,73,0.34)] touch-none"
                >
                    <div className="pointer-events-none absolute inset-0">
                        <span className="micro-bubble-float absolute bottom-[4%] left-[7%] h-4 w-4 rounded-full border border-white/60 bg-white/20" style={{ animationDelay: "0.2s" }} />
                        <span className="micro-bubble-float absolute bottom-[8%] left-[18%] h-3 w-3 rounded-full border border-white/60 bg-white/20" style={{ animationDelay: "2.1s" }} />
                        <span className="micro-bubble-float absolute bottom-[0%] left-[37%] h-5 w-5 rounded-full border border-white/60 bg-white/20" style={{ animationDelay: "1.4s" }} />
                        <span className="micro-bubble-float absolute bottom-[6%] left-[61%] h-3 w-3 rounded-full border border-white/60 bg-white/20" style={{ animationDelay: "3.4s" }} />
                        <span className="micro-bubble-float absolute bottom-[2%] left-[79%] h-4 w-4 rounded-full border border-white/60 bg-white/20" style={{ animationDelay: "0.9s" }} />
                        <span className="micro-bubble-float absolute bottom-[14%] left-[92%] h-6 w-6 rounded-full border border-white/50 bg-white/15" style={{ animationDelay: "2.8s" }} />

                        <span className="micro-fish-left absolute left-[12%] top-[58%] text-3xl opacity-40">🐟</span>
                        <span className="micro-fish-left absolute left-[78%] top-[35%] text-4xl opacity-35" style={{ animationDelay: "1.1s" }}>🐠</span>
                        <span className="micro-fish-left absolute left-[64%] top-[72%] text-3xl opacity-30" style={{ animationDelay: "2.2s" }}>🐡</span>

                        <span className="micro-plant absolute bottom-[-8px] left-[6%] text-7xl opacity-55">🌿</span>
                        <span className="micro-plant absolute bottom-[-10px] left-[21%] text-6xl opacity-45" style={{ animationDelay: "0.8s" }}>🪸</span>
                        <span className="micro-plant absolute bottom-[-12px] left-[78%] text-7xl opacity-50" style={{ animationDelay: "1.6s" }}>🌿</span>
                        <span className="micro-plant absolute bottom-[-14px] left-[91%] text-6xl opacity-45" style={{ animationDelay: "2.4s" }}>🪸</span>
                    </div>

                    {started && !activeParticle && !isComplete && (
                        <div
                            className="pointer-events-none absolute z-20 h-[290px] w-[290px] -translate-x-1/2 -translate-y-1/2 rounded-full"
                            style={{ left: `${scannerPosition.x}%`, top: `${scannerPosition.y}%` }}
                        >
                            <div key={pulseKey} className="micro-scanner-pulse absolute left-1/2 top-1/2 h-44 w-44 rounded-full border-4 border-white/80 bg-cyan-100/15" />
                            <div className="absolute inset-7 rounded-full border-[10px] border-white/90 bg-white/10 shadow-[0_25px_60px_rgba(15,23,42,0.30)] backdrop-blur-[1px]">
                                <div className="micro-scanner-spin absolute inset-4 rounded-full border border-dashed border-cyan-50/80" />
                                <div className="absolute left-1/2 top-5 h-[calc(100%-40px)] w-px -translate-x-1/2 bg-white/60" />
                                <div className="absolute left-5 top-1/2 h-px w-[calc(100%-40px)] -translate-y-1/2 bg-white/60" />
                                <div className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20" />
                            </div>
                            <div className="absolute left-[75%] top-[78%] h-20 w-9 rotate-[-42deg] rounded-full bg-slate-950 shadow-2xl" />
                        </div>
                    )}

                    {particles.map((particle) => {
                        const isFound = foundIds.includes(particle.id)
                        const distance = getDistanceToScanner(particle)
                        const isScanned = scannedIds.includes(particle.id)
                        const isClose = started && !isFound && distance <= SCANNER_RADIUS
                        const opacity = isScanned ? 1 : 0
                        const scale = isScanned && isClose ? 1.08 : 0.96

                        if (isFound) {
                            return (
                                <div
                                    key={particle.id}
                                    className="micro-found-pop pointer-events-none absolute z-10 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white/70 bg-white/20 text-3xl opacity-40"
                                    style={{ left: `${particle.x}%`, top: `${particle.y}%` }}
                                >
                                    ✓
                                </div>
                            )
                        }

                        return (
                            <button
                                key={particle.id}
                                type="button"
                                onClick={() => openParticleChallenge(particle)}
                                className={`${particle.drift} group absolute z-40 flex h-16 w-16 items-center justify-center rounded-full transition-all duration-300 active:scale-95`}
                                style={{
                                    left: `${particle.x}%`,
                                    top: `${particle.y}%`,
                                    opacity,
                                    transform: `translate(-50%, -50%) scale(${scale})`,
                                    pointerEvents: isScanned ? "auto" : "none",
                                }}
                                aria-label={isScanned ? `${particle.label} untersuchen` : undefined}
                                title={isScanned ? particle.label : undefined}
                            >
                                <span className="absolute inset-0 rounded-full border-4 border-white/80 bg-cyan-100/20 shadow-[0_0_30px_rgba(255,255,255,0.55)] transition-all duration-300 group-hover:scale-110 group-hover:bg-white/60 group-focus-visible:scale-110 group-focus-visible:bg-white/60" />
                                <span className="absolute h-7 w-7 rounded-full border-2 border-white/70 bg-cyan-200/50 shadow-inner transition-all duration-300 group-hover:opacity-0 group-focus-visible:opacity-0" />
                                <span className="absolute text-lg font-black text-white/90 drop-shadow transition-all duration-300 group-hover:scale-75 group-hover:opacity-0 group-focus-visible:scale-75 group-focus-visible:opacity-0">?</span>
                                <span className={`absolute flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br ${particle.glowClass} text-3xl opacity-0 shadow-2xl ring-4 ring-white/80 blur-sm transition-all duration-300 group-hover:scale-110 group-hover:opacity-100 group-hover:blur-0 group-focus-visible:scale-110 group-focus-visible:opacity-100 group-focus-visible:blur-0`}>
                                    <span className="drop-shadow-sm">{particle.icon}</span>
                                </span>
                            </button>
                        )
                    })}

                    {!started && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-950/30 p-5 backdrop-blur-sm">
                            <div className="max-w-2xl rounded-[2.5rem] border-4 border-white bg-white/95 p-7 text-center shadow-2xl">
                                <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-cyan-100 text-6xl shadow-inner">🚢</div>
                                <h2 className="mt-4 text-3xl font-black text-slate-950 md:text-5xl">
                                    Tauchgang starten!
                                </h2>
                                <p className="mx-auto mt-4 max-w-lg text-base font-semibold leading-relaxed text-slate-700 md:text-lg">
                                    Steuere das Mini-U-Boot mit deinem Finger oder der Maus. Das Sonar leuchtet, wenn Mikroplastik nah ist.
                                </p>
                                <button
                                    type="button"
                                    onClick={handleStart}
                                    className="mt-7 rounded-3xl bg-cyan-500 px-8 py-4 text-lg font-black text-white shadow-xl transition hover:-translate-y-1 hover:bg-cyan-600 active:scale-95"
                                >
                                    Abtauchen
                                </button>
                            </div>
                        </div>
                    )}

                    {isComplete && !activeParticle && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center bg-cyan-950/35 p-5 backdrop-blur-sm">
                            <div className="micro-water-clean max-w-3xl rounded-[2.5rem] border-4 border-white bg-white/95 p-8 text-center shadow-2xl">
                                <div className="text-7xl">🌊✨🐠</div>
                                <h2 className="mt-4 text-3xl font-black text-slate-950 md:text-5xl">
                                    Wasserfilter aktiviert!
                                </h2>
                                <p className="mx-auto mt-4 max-w-2xl text-base font-semibold leading-relaxed text-slate-700 md:text-lg">
                                    Du hast alle acht Mikroplastik-Spuren gefunden, untersucht und für jede Spur eine Schutzidee gesammelt.
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
                                        Nochmal tauchen
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>

                <div className="mt-4 rounded-[2rem] border-2 border-white/60 bg-white/80 p-3 shadow-2xl backdrop-blur-md">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-3">
                            <div className="rounded-2xl bg-slate-950 px-4 py-3 text-white shadow-inner">
                                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-200">Stickeralbum</p>
                                <p className="text-sm font-black">{foundCount} von {totalCount} Spuren</p>
                            </div>
                            <div className="h-4 w-36 overflow-hidden rounded-full bg-slate-200 shadow-inner md:w-52">
                                <div
                                    className="h-full rounded-full bg-cyan-500 transition-all duration-500"
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                        </div>

                        <div className="flex flex-wrap justify-center gap-2">
                            {particles.map((particle) => {
                                const isFound = foundIds.includes(particle.id)

                                return (
                                    <div
                                        key={particle.id}
                                        className={`flex h-14 w-14 items-center justify-center rounded-2xl border-2 text-2xl shadow-md transition ${isFound ? "micro-found-pop border-cyan-200 bg-white" : "border-white/60 bg-slate-200 text-slate-400"}`}
                                        title={particle.label}
                                    >
                                        {isFound ? particle.sticker : "?"}
                                    </div>
                                )
                            })}
                        </div>

                        <div className="rounded-2xl bg-cyan-100 px-4 py-3 text-sm font-black text-cyan-900 md:hidden">
                            Sonar {signalStrength}% · {getSignalLine()}
                        </div>
                    </div>
                </div>
            </div>

            {activeParticle && modalStage === "narrator" && (
                <div className="fixed bottom-5 right-5 z-[90] w-[min(360px,calc(100vw-2rem))] rounded-[1.5rem] border-4 border-white bg-cyan-50/95 p-3 shadow-2xl backdrop-blur-md md:bottom-6 md:right-6">
                    <div className="flex items-center gap-3">
                        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.2rem] bg-gradient-to-br ${activeParticle.glowClass} text-3xl shadow-lg`}>
                            {activeParticle.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-700">Narrator aktiv</p>
                            <p className="mt-1 text-sm font-black leading-tight text-slate-900">{activeParticle.shortLabel}: Schau kurz zum Erzähler.</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setModalStage("solution")}
                            className="shrink-0 rounded-2xl bg-cyan-600 px-4 py-2 text-sm font-black text-white shadow-lg transition hover:bg-cyan-700 active:scale-95"
                        >
                            Weiter
                        </button>
                    </div>
                </div>
            )}

            {activeParticle && modalStage !== "narrator" && (
                <div className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
                    <div className="relative w-full max-w-4xl overflow-hidden rounded-[2.1rem] border-4 border-white bg-white shadow-2xl">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(103,232,249,0.33),transparent_28%),radial-gradient(circle_at_80%_80%,rgba(186,230,253,0.55),transparent_30%)]" />
                        <div className="relative p-4 md:p-5">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className={`flex h-20 w-20 items-center justify-center rounded-[2rem] bg-gradient-to-br ${activeParticle.glowClass} text-5xl shadow-xl`}>
                                        {activeParticle.icon}
                                    </div>
                                    <div>
                                        <p className="text-[11px] font-black uppercase tracking-[0.34em] text-cyan-700">Mini-Aufgabe</p>
                                        <h2 className="text-2xl font-black text-slate-950 md:text-3xl">{activeParticle.mini.title}</h2>
                                        <p className="mt-1 max-w-xl text-sm font-semibold text-slate-600">{activeParticle.source}</p>
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
                                            {activeParticle.mini.scene} Richtige Spuren antippen
                                        </div>

                                        {activeParticle.mini.items.map((item, index) => {
                                            const selected = challengeHits.includes(item.id)
                                            const wrong = wrongItems.includes(item.id)

                                            return (
                                                <button
                                                    key={item.id}
                                                    type="button"
                                                    onClick={() => handleChallengeItemClick(item)}
                                                    className={`absolute z-10 flex h-16 w-16 md:h-20 md:w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[1.3rem] border-4 text-3xl md:text-4xl shadow-xl transition hover:scale-110 active:scale-95 ${selected ? "border-emerald-200 bg-emerald-100 opacity-70" : "border-white/80 bg-white/80"} ${wrong ? "micro-item-wiggle border-rose-200 bg-rose-100" : ""}`}
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
                                            {activeParticle.mini.instruction}
                                        </div>
                                    </div>

                                    <div className="rounded-[1.75rem] bg-slate-950 p-4 text-white shadow-inner">
                                        <div className="flex items-center justify-between gap-3">
                                            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-cyan-200">Mini-Filter</p>
                                            <span className="rounded-full bg-white px-3 py-1 text-sm font-black text-slate-950">
                                                {challengeHits.length}/{getCorrectItems(activeParticle).length}
                                            </span>
                                        </div>
                                        <p className="mt-3 text-base font-black md:text-lg">{activeParticle.mini.collectLabel}</p>
                                        <div className="mt-4 grid grid-cols-3 gap-2">
                                            {getCorrectItems(activeParticle).map((item) => {
                                                const selected = challengeHits.includes(item.id)

                                                return (
                                                    <div
                                                        key={item.id}
                                                        className={`flex h-16 items-center justify-center rounded-2xl border-2 text-2xl md:h-20 md:text-3xl transition ${selected ? "micro-found-pop border-emerald-200 bg-emerald-100 text-slate-950" : "border-white/15 bg-white/10 text-white/40"}`}
                                                    >
                                                        {selected ? item.emoji : "?"}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                        <div className="mt-4 rounded-[1.25rem] bg-white/10 p-3 text-xs font-semibold leading-relaxed text-cyan-50 md:text-sm">
                                            Nur Mikroplastik sichern — Tiere und Pflanzen bleiben frei.
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
                                        {activeParticle.solutions.map((solution) => {
                                            const isWrong = wrongSolutionId === solution.id

                                            return (
                                                <button
                                                    key={solution.id}
                                                    type="button"
                                                    onClick={() => handleSolutionClick(solution)}
                                                    className={`rounded-[1.7rem] border-4 bg-white p-4 text-left shadow-xl transition hover:-translate-y-1 hover:border-cyan-200 active:scale-95 ${isWrong ? "micro-card-wiggle border-rose-200 bg-rose-50" : "border-cyan-50"}`}
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
                                    <div className="micro-badge-pulse mx-auto flex h-28 w-28 md:h-32 md:w-32 items-center justify-center rounded-[2.4rem] border-4 border-white bg-white text-7xl shadow-2xl">
                                        {activeParticle.sticker}
                                    </div>
                                    <h3 className="mt-4 text-2xl font-black text-slate-950 md:text-3xl">Sticker eingeklebt!</h3>
                                    <p className="mx-auto mt-2 max-w-xl text-sm font-semibold leading-relaxed text-slate-700 md:text-base">
                                        {activeParticle.shortLabel} ist jetzt im Forschungsalbum. Du hast Fund, Ursache und Schutzidee verbunden.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={closeActiveModal}
                                        className="mt-5 rounded-3xl bg-emerald-600 px-7 py-3 text-base md:text-lg font-black text-white shadow-xl transition hover:-translate-y-1 hover:bg-emerald-700 active:scale-95"
                                    >
                                        {foundIds.length === totalCount ? "Finale ansehen" : "Weiter tauchen"}
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

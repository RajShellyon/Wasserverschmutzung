import { useRef, useState } from "react"

const ITEM_SIZE = 64
const ITEM_GAP = 10
const MIN_DISTANCE = ITEM_SIZE + ITEM_GAP
const EDGE_PADDING = 12

const initialItems = [
    {
        id: 1,
        icon: "🧴",
        label: "Plastikflasche",
        info: "Plastikflaschen werden manchmal achtlos weggeworfen. Regen und Flüsse können Plastikflaschen bis ins Meer transportieren. Dort bleiben sie oft bis zu 450 Jahre in der Umwelt.",
        trash: true,
        x: 12,
        y: 12,
        drift: "drift-a",
    },
    {
        id: 2,
        icon: "🐟",
        label: "Fisch",
        info: "Fische gehören ins Wasser und dürfen nicht in die Mülltonne.",
        trash: false,
        x: 34,
        y: 20,
        drift: "drift-b",
    },
    {
        id: 3,
        icon: "🛍️",
        label: "Plastiktüte",
        info: "Plastiktüten werden oft vom Wind weggeweht und gelangen über Bäche und Flüsse ins Meer. Schildkröten verwechseln Plastiktüten häufig mit Quallen und verschlucken Plastiktüten.",
        trash: true,
        x: 63,
        y: 13,
        drift: "drift-c",
    },
    {
        id: 4,
        icon: "🌿",
        label: "Wasserpflanze",
        info: "Wasserpflanzen sind Teil des Lebensraums und bleiben im Meer.",
        trash: false,
        x: 21,
        y: 45,
        drift: "drift-c",
    },
    {
        id: 5,
        icon: "🥤",
        label: "Einwegbecher",
        info: "Einwegbecher werden nach dem Trinken oft weggeworfen. Über Straßen, Gullys und Flüsse können Einwegbecher schließlich im Meer landen.",
        trash: true,
        x: 51,
        y: 40,
        drift: "drift-a",
    },
    {
        id: 6,
        icon: "🐢",
        label: "Schildkröte",
        info: "Schildkröten leben im Meer. Schildkröten brauchen sauberes Wasser.",
        trash: false,
        x: 74,
        y: 56,
        drift: "drift-b",
    },
    {
        id: 7,
        icon: "🪥",
        label: "Zahnbürste",
        info: "Zahnbürsten bestehen meist aus Kunststoff. Werden Zahnbürsten falsch entsorgt, können Flüsse Zahnbürsten bis ins Meer transportieren. Dort zerfallen Zahnbürsten nur sehr langsam.",
        trash: true,
        x: 39,
        y: 72,
        drift: "drift-a",
    },
    {
        id: 8,
        icon: "🐚",
        label: "Muschel",
        info: "Muscheln sind kein Müll. Muscheln gehören zum Meer.",
        trash: false,
        x: 62,
        y: 78,
        drift: "drift-c",
    },
]

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max)
}

function percentToPixel(item, seaRect) {
    return {
        ...item,
        px: (item.x / 100) * seaRect.width,
        py: (item.y / 100) * seaRect.height,
    }
}

function pixelToPercent(item, seaRect) {
    const maxX = 100 - ((ITEM_SIZE + EDGE_PADDING) / seaRect.width) * 100
    const maxY = 100 - ((ITEM_SIZE + EDGE_PADDING) / seaRect.height) * 100
    const minX = (EDGE_PADDING / seaRect.width) * 100
    const minY = (EDGE_PADDING / seaRect.height) * 100

    return {
        ...item,
        x: clamp((item.px / seaRect.width) * 100, minX, maxX),
        y: clamp((item.py / seaRect.height) * 100, minY, maxY),
    }
}

function pushApart(items, seaRect, activeId = null) {
    if (!seaRect) return items

    const result = items.map((item) => percentToPixel(item, seaRect))
    const strength = 0.22
    const padding = 8

    for (let round = 0; round < 80; round++) {
        for (let i = 0; i < result.length; i++) {
            for (let j = i + 1; j < result.length; j++) {
                const a = result[i]
                const b = result[j]

                const ax = a.px + ITEM_SIZE / 2
                const ay = a.py + ITEM_SIZE / 2
                const bx = b.px + ITEM_SIZE / 2
                const by = b.py + ITEM_SIZE / 2

                let dx = bx - ax
                let dy = by - ay
                let distance = Math.sqrt(dx * dx + dy * dy)

                if (distance < 1) {
                    dx = Math.random() - 0.5
                    dy = Math.random() - 0.5
                    distance = Math.sqrt(dx * dx + dy * dy)
                }

                if (distance < MIN_DISTANCE) {
                    const overlap = MIN_DISTANCE - distance
                    const force = overlap * strength

                    const moveX = (dx / distance) * force
                    const moveY = (dy / distance) * force

                    if (a.id === activeId) {
                        b.px += moveX * 1.6
                        b.py += moveY * 1.6
                    } else if (b.id === activeId) {
                        a.px -= moveX * 1.6
                        a.py -= moveY * 1.6
                    } else {
                        a.px -= moveX
                        a.py -= moveY
                        b.px += moveX
                        b.py += moveY
                    }

                    a.px = clamp(a.px, padding, seaRect.width - ITEM_SIZE - padding)
                    a.py = clamp(a.py, padding, seaRect.height - ITEM_SIZE - padding)
                    b.px = clamp(b.px, padding, seaRect.width - ITEM_SIZE - padding)
                    b.py = clamp(b.py, padding, seaRect.height - ITEM_SIZE - padding)
                }
            }
        }
    }

    return result.map((item) => {
        const cleaned = pixelToPercent(item, seaRect)
        delete cleaned.px
        delete cleaned.py
        return cleaned
    })
}

export default function PlastikMission({ mission, onBack }) {
    const seaRef = useRef(null)
    const trashRef = useRef(null)
    const dragRef = useRef(null)

    const [items, setItems] = useState(initialItems)
    const [feedback, setFeedback] = useState("Ziehe nur den Müll in die Tonne.")
    const [draggedId, setDraggedId] = useState(null)

    const remainingTrash = items.filter((item) => item.trash).length
    const isComplete = remainingTrash === 0

    function getSeaRect() {
        return seaRef.current?.getBoundingClientRect() ?? null
    }

    function getPositionFromPointer(event, offsetX, offsetY) {
        const sea = getSeaRect()
        if (!sea) return null

        const x = ((event.clientX - sea.left - offsetX) / sea.width) * 100
        const y = ((event.clientY - sea.top - offsetY) / sea.height) * 100

        const maxX = 100 - ((ITEM_SIZE + EDGE_PADDING) / sea.width) * 100
        const maxY = 100 - ((ITEM_SIZE + EDGE_PADDING) / sea.height) * 100
        const minX = (EDGE_PADDING / sea.width) * 100
        const minY = (EDGE_PADDING / sea.height) * 100

        return {
            x: clamp(x, minX, maxX),
            y: clamp(y, minY, maxY),
        }
    }

    function isOverTrash(event) {
        if (!trashRef.current) return false

        const trash = trashRef.current.getBoundingClientRect()

        return (
            event.clientX >= trash.left &&
            event.clientX <= trash.right &&
            event.clientY >= trash.top &&
            event.clientY <= trash.bottom
        )
    }

    function stopDragging() {
        dragRef.current = null
        setDraggedId(null)
    }

    function handlePointerDown(event, item) {
        const sea = getSeaRect()
        if (!sea) return

        event.preventDefault()

        const itemLeft = sea.left + (item.x / 100) * sea.width
        const itemTop = sea.top + (item.y / 100) * sea.height

        dragRef.current = {
            id: item.id,
            startX: item.x,
            startY: item.y,
            offsetX: event.clientX - itemLeft,
            offsetY: event.clientY - itemTop,
        }

        setDraggedId(item.id)

        try {
            seaRef.current.setPointerCapture(event.pointerId)
        } catch {
            // Kein Problem, falls der Browser Pointer Capture nicht übernimmt.
        }
    }

    function handlePointerMove(event) {
        const drag = dragRef.current
        if (!drag) return

        event.preventDefault()

        const position = getPositionFromPointer(event, drag.offsetX, drag.offsetY)
        if (!position) return

        setItems((prev) =>
            prev.map((item) =>
                item.id === drag.id
                    ? { ...item, x: position.x, y: position.y }
                    : item
            )
        )
    }

    function handlePointerUp(event) {
        const drag = dragRef.current
        if (!drag) return

        event.preventDefault()

        const sea = getSeaRect()
        const overTrash = isOverTrash(event)

        setItems((prev) => {
            const droppedItem = prev.find((item) => item.id === drag.id)
            if (!droppedItem) return prev

            if (overTrash && droppedItem.trash) {
                setFeedback(`Richtig! ${droppedItem.label}: ${droppedItem.info}`)
                return prev.filter((item) => item.id !== droppedItem.id)
            }

            if (overTrash && !droppedItem.trash) {
                setFeedback(`Stopp! ${droppedItem.info}`)

                const returnedItems = prev.map((item) =>
                    item.id === droppedItem.id
                        ? { ...item, x: drag.startX, y: drag.startY }
                        : item
                )

                return pushApart(returnedItems, sea, droppedItem.id)
            }

            return pushApart(prev, sea, droppedItem.id)
        })

        stopDragging()
    }

    function handlePointerCancel() {
        const drag = dragRef.current
        if (!drag) return

        const sea = getSeaRect()

        setItems((prev) => {
            const returnedItems = prev.map((item) =>
                item.id === drag.id
                    ? { ...item, x: drag.startX, y: drag.startY }
                    : item
            )

            return pushApart(returnedItems, sea, drag.id)
        })

        stopDragging()
    }

    return (
        <section className="relative w-screen h-screen overflow-hidden bg-gradient-to-b from-sky-200 via-cyan-300 to-blue-500">
            <style>
                {`
                    @keyframes driftA {
                        0% { transform: translate(0, 0) rotate(-3deg); }
                        25% { transform: translate(12px, -7px) rotate(1deg); }
                        50% { transform: translate(5px, -15px) rotate(5deg); }
                        75% { transform: translate(-9px, -6px) rotate(-2deg); }
                        100% { transform: translate(0, 0) rotate(-3deg); }
                    }

                    @keyframes driftB {
                        0% { transform: translate(0, 0) rotate(2deg); }
                        25% { transform: translate(-11px, -5px) rotate(-3deg); }
                        50% { transform: translate(-3px, -13px) rotate(2deg); }
                        75% { transform: translate(9px, -4px) rotate(4deg); }
                        100% { transform: translate(0, 0) rotate(2deg); }
                    }

                    @keyframes driftC {
                        0% { transform: translate(0, 0) rotate(-1deg); }
                        25% { transform: translate(7px, 5px) rotate(3deg); }
                        50% { transform: translate(-6px, -11px) rotate(-4deg); }
                        75% { transform: translate(-13px, 3px) rotate(2deg); }
                        100% { transform: translate(0, 0) rotate(-1deg); }
                    }

                    @keyframes waveMove {
                        0% { transform: translateX(-20px); opacity: 0.25; }
                        50% { transform: translateX(20px); opacity: 0.65; }
                        100% { transform: translateX(-20px); opacity: 0.25; }
                    }

                    @keyframes bubbleRise {
                        0% { transform: translateY(40px) scale(0.7); opacity: 0; }
                        20% { opacity: 0.45; }
                        100% { transform: translateY(-150px) scale(1.1); opacity: 0; }
                    }

                    .drift-a { animation: driftA 5.7s ease-in-out infinite; }
                    .drift-b { animation: driftB 6.6s ease-in-out infinite; }
                    .drift-c { animation: driftC 7.4s ease-in-out infinite; }

                    .dragging {
                        animation: none !important;
                        z-index: 30;
                    }

                    .water-wave {
                        animation: waveMove 5s ease-in-out infinite;
                    }

                    .bubble {
                        position: absolute;
                        width: 10px;
                        height: 10px;
                        border-radius: 9999px;
                        background: rgba(255,255,255,0.35);
                        animation: bubbleRise 6s ease-in-out infinite;
                    }
                `}
            </style>

            <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_20%_20%,white,transparent_25%),radial-gradient(circle_at_70%_60%,white,transparent_18%)]" />

            <div className="relative z-10 flex h-full flex-col p-2">
                <header className="rounded-3xl bg-white/85 p-5 shadow-xl backdrop-blur text-center max-w-3xl mx-auto">
                    <div className="text-4xl mb-2">{mission.icon}</div>

                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-blue-600 mb-1">
                        Mission 1
                    </p>

                    <h1 className="text-3xl font-extrabold text-blue-950">
                        Plastik aus dem Meer retten
                    </h1>

                    <p className="text-slate-700 mt-2">
                        Ziehe nur Plastikmüll in die Mülltonne. Tiere und Pflanzen bleiben im Wasser.
                    </p>
                </header>

                <main
                    ref={seaRef}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerCancel}
                    className="relative mt-2 flex-1 rounded-3xl border border-white/40 bg-white/15 shadow-inner overflow-hidden touch-none"
                >
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="water-wave absolute left-[9%] top-[11%] text-2xl opacity-55">〰️</div>
                        <div className="water-wave absolute left-[28%] top-[34%] text-2xl opacity-40">〰️</div>
                        <div className="water-wave absolute left-[37%] top-[12%] text-2xl opacity-45">〰️</div>
                        <div className="water-wave absolute left-[46%] top-[58%] text-2xl opacity-35">〰️</div>
                        <div className="water-wave absolute left-[62%] top-[20%] text-2xl opacity-50">〰️</div>
                        <div className="water-wave absolute left-[70%] top-[43%] text-2xl opacity-40">〰️</div>
                        <div className="water-wave absolute left-[84%] top-[18%] text-2xl opacity-40">〰️</div>
                        <div className="water-wave absolute left-[86%] top-[70%] text-2xl opacity-35">〰️</div>
                        <div className="water-wave absolute left-[18%] top-[75%] text-2xl opacity-35">〰️</div>
                        <div className="water-wave absolute left-[57%] top-[83%] text-2xl opacity-30">〰️</div>

                        <span className="bubble left-[14%] bottom-[6%]" />
                        <span className="bubble left-[29%] bottom-[20%]" />
                        <span className="bubble left-[42%] bottom-[9%]" />
                        <span className="bubble left-[59%] bottom-[17%]" />
                        <span className="bubble left-[76%] bottom-[10%]" />
                    </div>

                    {items.map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            onPointerDown={(event) => handlePointerDown(event, item)}
                            className={`${draggedId === item.id ? "dragging" : item.drift} absolute flex h-16 w-16 items-center justify-center rounded-full bg-cyan-100/40 text-4xl shadow-lg ring-2 ring-white/40 cursor-grab active:cursor-grabbing active:scale-95 transition-all duration-300 ease-out select-none`}
                            style={{
                                left: `${item.x}%`,
                                top: `${item.y}%`,
                            }}
                            title={item.label}
                        >
                            <span className="drop-shadow-sm pointer-events-none">{item.icon}</span>
                        </button>
                    ))}

                    <div
                        ref={trashRef}
                        className="absolute bottom-6 right-6 flex h-36 w-36 flex-col items-center justify-center rounded-3xl bg-slate-800 text-white shadow-2xl border-4 border-white/70"
                    >
                        <div className="text-5xl">🗑️</div>
                        <p className="mt-2 text-sm font-bold">Mülltonne</p>
                    </div>

                    <div className="absolute bottom-6 left-6 max-w-xl rounded-2xl bg-white/90 p-4 shadow-xl">
                        <p className="font-bold text-blue-950">{feedback}</p>
                        <p className="text-sm text-slate-600 mt-1">
                            Noch {remainingTrash} Müllteile im Wasser.
                        </p>
                    </div>

                    {isComplete && (
                        <div className="absolute inset-0 flex items-center justify-center bg-blue-950/40 backdrop-blur-sm">
                            <div className="rounded-3xl bg-white p-8 text-center shadow-2xl">
                                <div className="text-5xl mb-3">🎉</div>
                                <h2 className="text-2xl font-extrabold text-blue-950">
                                    Mission geschafft!
                                </h2>
                                <p className="text-slate-700 mt-2 mb-5">
                                    Du hast alle Plastikgegenstände aus dem Wasser entfernt.
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
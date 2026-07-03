import { useEffect, useLayoutEffect, useRef, useState } from 'react'

export default function NarratorVideo({
    anchorRef,
    videoSrc = '/videos/Intro.mp4',
    onFirstVideoEnd = () => { },
    inset = -40,
}) {
    const videoRef = useRef(null)
    const widgetRef = useRef(null)
    const autoplayTriedRef = useRef(false)
    const blockedByBrowserRef = useRef(false)
    const firstVideoEndHandledRef = useRef(false)

    const [isPlaying, setIsPlaying] = useState(false)
    const [hasStarted, setHasStarted] = useState(false)
    const [hasEnded, setHasEnded] = useState(false)
    const [position, setPosition] = useState(null)

    const dragData = useRef({
        isDown: false,
        hasMoved: false,
        startX: 0,
        startY: 0,
        initialX: 0,
        initialY: 0,
    })

    function getWidgetSize() {
        return window.innerWidth >= 768 ? 128 : 112
    }

    function clampPosition(x, y) {
        const widgetSize = getWidgetSize()
        const padding = 8

        return {
            x: Math.min(
                Math.max(x, padding),
                window.innerWidth - widgetSize - padding,
            ),
            y: Math.min(
                Math.max(y, padding),
                window.innerHeight - widgetSize - padding,
            ),
        }
    }

    useLayoutEffect(() => {
        function placeAtTopRightOfAnchor() {
            const anchor = anchorRef.current
            if (!anchor) return

            const rect = anchor.getBoundingClientRect()
            const widgetSize = getWidgetSize()

            const nextPosition = clampPosition(
                rect.right - widgetSize - inset,
                rect.top + inset,
            )

            setPosition(nextPosition)
        }

        requestAnimationFrame(placeAtTopRightOfAnchor)
        window.addEventListener('resize', placeAtTopRightOfAnchor)

        return () => {
            window.removeEventListener('resize', placeAtTopRightOfAnchor)
        }
    }, [anchorRef, inset])

    useEffect(() => {
        if (!position || autoplayTriedRef.current) return

        autoplayTriedRef.current = true

        const timeoutId = window.setTimeout(() => {
            tryStartWithSound()
        }, 250)

        return () => {
            window.clearTimeout(timeoutId)
        }
    }, [position])

    useEffect(() => {
        function startAfterFirstUserAction(event) {
            if (!blockedByBrowserRef.current) return
            if (hasEnded) return

            if (widgetRef.current && widgetRef.current.contains(event.target)) {
                return
            }

            restartVideo()
            blockedByBrowserRef.current = false
        }

        window.addEventListener('pointerdown', startAfterFirstUserAction)
        window.addEventListener('keydown', startAfterFirstUserAction)

        return () => {
            window.removeEventListener('pointerdown', startAfterFirstUserAction)
            window.removeEventListener('keydown', startAfterFirstUserAction)
        }
    }, [hasEnded])

    async function tryStartWithSound() {
        const video = videoRef.current
        if (!video) return

        try {
            video.currentTime = 0
            video.volume = 1
            video.muted = false

            await video.play()

            setIsPlaying(true)
            setHasStarted(true)
            setHasEnded(false)
            blockedByBrowserRef.current = false
        } catch (error) {
            console.log('Autoplay mit Ton wurde vom Browser blockiert:', error)

            setIsPlaying(false)
            setHasStarted(false)
            setHasEnded(false)
            blockedByBrowserRef.current = true
        }
    }

    async function playVideoFromCurrentPosition() {
        const video = videoRef.current
        if (!video) return

        try {
            video.muted = false
            video.volume = 1

            await video.play()

            setIsPlaying(true)
            setHasStarted(true)
            setHasEnded(false)
            blockedByBrowserRef.current = false
        } catch (error) {
            console.log('Video konnte nicht gestartet werden:', error)
        }
    }

    async function restartVideo() {
        const video = videoRef.current
        if (!video) return

        video.currentTime = 0
        setHasEnded(false)
        setHasStarted(true)

        await playVideoFromCurrentPosition()
    }

    async function toggleVideo() {
        const video = videoRef.current
        if (!video) return

        if (hasEnded) {
            await restartVideo()
            return
        }

        if (video.paused) {
            await playVideoFromCurrentPosition()
        } else {
            video.pause()
            setIsPlaying(false)
        }
    }

    function handleVideoEnded() {
        setIsPlaying(false)
        setHasEnded(true)
        blockedByBrowserRef.current = false

        if (!firstVideoEndHandledRef.current) {
            firstVideoEndHandledRef.current = true
            onFirstVideoEnd()
        }
    }

    function handlePointerDown(event) {
        if (!position) return

        event.currentTarget.setPointerCapture(event.pointerId)

        dragData.current = {
            isDown: true,
            hasMoved: false,
            startX: event.clientX,
            startY: event.clientY,
            initialX: position.x,
            initialY: position.y,
        }
    }

    function handlePointerMove(event) {
        if (!dragData.current.isDown) return

        const deltaX = event.clientX - dragData.current.startX
        const deltaY = event.clientY - dragData.current.startY

        if (Math.abs(deltaX) > 6 || Math.abs(deltaY) > 6) {
            dragData.current.hasMoved = true
        }

        const nextPosition = clampPosition(
            dragData.current.initialX + deltaX,
            dragData.current.initialY + deltaY,
        )

        setPosition(nextPosition)
    }

    function handlePointerUp(event) {
        event.currentTarget.releasePointerCapture(event.pointerId)

        const wasDragging = dragData.current.hasMoved
        dragData.current.isDown = false

        if (!wasDragging) {
            toggleVideo()
        }
    }

    if (!position) return null

    return (
        <div
            ref={widgetRef}
            className="fixed z-50 select-none touch-none cursor-grab active:cursor-grabbing"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
        >
            <div className="group relative h-28 w-28 md:h-32 md:w-32 rounded-full overflow-hidden border-4 border-white shadow-2xl bg-blue-100 ring-4 ring-blue-200">
                <video
                    ref={videoRef}
                    src={videoSrc}
                    className="h-full w-full object-cover object-center pointer-events-none"
                    playsInline
                    preload="auto"
                    controls={false}
                    disablePictureInPicture
                    disableRemotePlayback
                    controlsList="nodownload nofullscreen noremoteplayback"
                    onEnded={handleVideoEnded}
                />

                {!hasStarted && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-blue-950/45 text-white pointer-events-none">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/95 text-blue-700 shadow-lg">
                            <div className="ml-1 h-0 w-0 border-y-[10px] border-y-transparent border-l-[16px] border-l-blue-700" />
                        </div>

                        <p className="mt-2 text-[10px] font-bold uppercase tracking-wide">
                            Ton starten
                        </p>
                    </div>
                )}

                {hasStarted && !isPlaying && !hasEnded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-blue-950/45 pointer-events-none">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 shadow-xl">
                            <div className="flex gap-2">
                                <span className="block h-7 w-2.5 rounded-full bg-blue-700" />
                                <span className="block h-7 w-2.5 rounded-full bg-blue-700" />
                            </div>
                        </div>
                    </div>
                )}

                {hasEnded && (
                    <div className="absolute inset-0 hidden items-center justify-center bg-blue-950/45 pointer-events-none group-hover:flex">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 shadow-xl">
                            <span className="text-3xl font-black text-blue-700 leading-none">
                                ↻
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
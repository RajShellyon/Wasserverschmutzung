import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useLayoutEffect,
    useRef,
    useState,
} from 'react'

const NarratorVideo = forwardRef(function NarratorVideo(
    {
        anchorRef,
        videoSrc = '/videos/Intro.mp4',
        preloadSources = [],
        onFirstVideoEnd = () => { },
        inset = -40,
        startAfterFirstUserAction = true,
    },
    ref,
) {
    const widgetRef = useRef(null)
    const videoRefs = useRef({})
    const autoplayTriedRef = useRef(false)
    const blockedByBrowserRef = useRef(false)
    const firstVideoEndHandledRef = useRef(false)

    const allSources = Array.from(new Set([videoSrc, ...preloadSources]))

    const [currentVideoSrc, setCurrentVideoSrc] = useState(videoSrc)
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

    useImperativeHandle(ref, () => ({
        playVideoFromStart(nextVideoSrc) {
            return playPreparedVideoFromStart(nextVideoSrc)
        },
    }))

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

    function getVideoElement(src) {
        return videoRefs.current[src]
    }

    function pauseAllExcept(srcToKeep) {
        Object.entries(videoRefs.current).forEach(([src, video]) => {
            if (!video || src === srcToKeep) return

            video.pause()
            video.currentTime = 0
        })
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
        setCurrentVideoSrc(videoSrc)
        autoplayTriedRef.current = false
        blockedByBrowserRef.current = false
        firstVideoEndHandledRef.current = false
        setIsPlaying(false)
        setHasStarted(false)
        setHasEnded(false)
    }, [videoSrc])

    useEffect(() => {
        if (!position || autoplayTriedRef.current) return

        autoplayTriedRef.current = true

        const timeoutId = window.setTimeout(() => {
            tryStartWithSound(videoSrc)
        }, 250)

        return () => {
            window.clearTimeout(timeoutId)
        }
    }, [position, videoSrc])

    useEffect(() => {
        if (!startAfterFirstUserAction) return

        function startAfterUserAction(event) {
            if (!blockedByBrowserRef.current) return
            if (hasEnded) return

            if (widgetRef.current && widgetRef.current.contains(event.target)) {
                return
            }

            restartCurrentVideo()
            blockedByBrowserRef.current = false
        }

        window.addEventListener('pointerdown', startAfterUserAction)
        window.addEventListener('keydown', startAfterUserAction)

        return () => {
            window.removeEventListener('pointerdown', startAfterUserAction)
            window.removeEventListener('keydown', startAfterUserAction)
        }
    }, [hasEnded, currentVideoSrc, startAfterFirstUserAction])

    async function tryStartWithSound(src) {
        const video = getVideoElement(src)
        if (!video) return

        try {
            pauseAllExcept(src)

            video.currentTime = 0
            video.volume = 1
            video.muted = false

            await video.play()

            setCurrentVideoSrc(src)
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

    async function playPreparedVideoFromStart(nextVideoSrc) {
        const video = getVideoElement(nextVideoSrc)

        if (!video) {
            console.warn('Video nicht gefunden oder nicht vorgeladen:', nextVideoSrc)
            return
        }

        try {
            pauseAllExcept(nextVideoSrc)

            setCurrentVideoSrc(nextVideoSrc)
            setIsPlaying(false)
            setHasStarted(false)
            setHasEnded(false)
            blockedByBrowserRef.current = false

            video.currentTime = 0
            video.volume = 1
            video.muted = false

            await video.play()

            setCurrentVideoSrc(nextVideoSrc)
            setIsPlaying(true)
            setHasStarted(true)
            setHasEnded(false)
            blockedByBrowserRef.current = false
        } catch (error) {
            console.log('Video konnte nicht gestartet werden:', error)

            setIsPlaying(false)
            setHasStarted(false)
            setHasEnded(false)
            blockedByBrowserRef.current = true
        }
    }

    async function playCurrentVideo() {
        const video = getVideoElement(currentVideoSrc)
        if (!video) return

        try {
            pauseAllExcept(currentVideoSrc)

            video.muted = false
            video.volume = 1

            await video.play()

            setIsPlaying(true)
            setHasStarted(true)
            setHasEnded(false)
            blockedByBrowserRef.current = false
        } catch (error) {
            console.log('Video konnte nicht gestartet werden:', error)

            setIsPlaying(false)
            setHasStarted(false)
            setHasEnded(false)
            blockedByBrowserRef.current = true
        }
    }

    async function restartCurrentVideo() {
        const video = getVideoElement(currentVideoSrc)
        if (!video) return

        video.currentTime = 0
        setHasEnded(false)
        setHasStarted(false)
        setIsPlaying(false)

        await playCurrentVideo()
    }

    async function toggleVideo() {
        const video = getVideoElement(currentVideoSrc)
        if (!video) return

        if (hasEnded) {
            await restartCurrentVideo()
            return
        }

        if (video.paused) {
            await playCurrentVideo()
        } else {
            video.pause()
            setIsPlaying(false)
        }
    }

    function handleVideoEnded(src) {
        if (src !== currentVideoSrc) return

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
                {allSources.map((src) => (
                    <video
                        key={src}
                        ref={(element) => {
                            if (element) {
                                videoRefs.current[src] = element
                            } else {
                                delete videoRefs.current[src]
                            }
                        }}
                        src={src}
                        className={
                            src === currentVideoSrc
                                ? 'absolute inset-0 h-full w-full object-cover object-center pointer-events-none opacity-100'
                                : 'absolute inset-0 h-full w-full object-cover object-center pointer-events-none opacity-0'
                        }
                        playsInline
                        preload="auto"
                        controls={false}
                        disablePictureInPicture
                        disableRemotePlayback
                        controlsList="nodownload nofullscreen noremoteplayback"
                        onEnded={() => handleVideoEnded(src)}
                    />
                ))}

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
})

export default NarratorVideo
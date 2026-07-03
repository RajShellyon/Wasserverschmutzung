import { useRef, useState } from 'react'
import { missions } from '../data/missions'
import NarratorVideo from './NarratorVideo'
import page2 from '../assets/page2.png'

const missionInfoVideosFixed = {
  1: '/videos/Plastik_Info.mp4',
  2: '/videos/Mikroplastik_Info.mp4',
  3: '/videos/Oel_Info.mp4',
  4: '/videos/Chemikalien_Info.mp4',
  5: '/videos/Abwasser_Info.mp4',
}

const preloadMissionVideos = Object.values(missionInfoVideosFixed)

const missionOverviewNarratorPosition = {
  x: '61vw',
  y: '15vh',
}

export default function MissionOverview({
  onBack,
  onStartMission = () => { },
  playIntroVideo = true,
}) {
  const pageRef = useRef(null)
  const narratorRef = useRef(null)

  const selectedMissionIdRef = useRef(null)
  const [selectedMissionId, setSelectedMissionId] = useState(null)

  async function playMissionInfoVideo(mission) {
    if (selectedMissionIdRef.current === mission.id) {
      return
    }

    const infoVideo = missionInfoVideosFixed[mission.id]

    if (!infoVideo) return

    selectedMissionIdRef.current = mission.id
    setSelectedMissionId(mission.id)

    await narratorRef.current?.playVideoFromStart(infoVideo)
  }

  function handleMissionClick(mission) {
    playMissionInfoVideo(mission)
  }

  function handleMissionKeyDown(event, mission) {
    if (event.key !== 'Enter' && event.key !== ' ') return

    event.preventDefault()
    playMissionInfoVideo(mission)
  }

  function handleStartButtonClick(event, mission) {
    event.preventDefault()
    event.stopPropagation()

    onStartMission(mission)
  }

  return (
    <section
      ref={pageRef}
      className="relative left-1/2 w-screen min-h-screen -translate-x-1/2 flex flex-col items-center justify-center p-8"
      style={{
        backgroundImage: `url(${page2})`,
        backgroundSize: '100vw auto',
        backgroundPosition: 'top center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <NarratorVideo
        ref={narratorRef}
        anchorRef={pageRef}
        videoSrc="/videos/Kursauswahl.mp4"
        preloadSources={preloadMissionVideos}
        inset={-40}
        startAfterFirstUserAction={false}
        initialPosition={missionOverviewNarratorPosition}
        autoPlayInitialVideo={playIntroVideo}
      />

      <div className="w-full max-w-7xl">
        <header className="text-center mb-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-blue-600 mb-1">
            Kursauswahl
          </p>

          <h1 className="text-2xl md:text-3xl font-extrabold text-blue-950">
            Wähle deine Mission
          </h1>

          <p className="text-sm text-slate-700 mt-1">
            Klicke auf eine Box für kurze Informationen oder starte direkt eine
            Aufgabenstation.
          </p>
        </header>

        <div className="grid grid-cols-5 gap-3">
          {missions.map((mission) => {
            const isSelected = selectedMissionId === mission.id

            return (
              <article
                key={mission.id}
                role="button"
                tabIndex={0}
                onClick={() => handleMissionClick(mission)}
                onKeyDown={(event) => handleMissionKeyDown(event, mission)}
                className={
                  isSelected
                    ? 'h-[210px] rounded-2xl bg-white p-3 shadow-xl border-2 border-blue-500 text-center flex flex-col justify-between cursor-pointer ring-4 ring-blue-200 hover:-translate-y-1 transition outline-none'
                    : 'h-[210px] rounded-2xl bg-white p-3 shadow-md border border-blue-100 text-center flex flex-col justify-between cursor-pointer hover:-translate-y-1 hover:shadow-xl transition outline-none focus:ring-4 focus:ring-blue-200'
                }
              >
                <div>
                  <div className="text-3xl mb-1">{mission.icon}</div>

                  <h2 className="text-base font-extrabold text-blue-900 mb-1">
                    {mission.title}
                  </h2>

                  <p className="text-xs text-slate-600 leading-snug">
                    {mission.description}
                  </p>
                </div>

                <div>
                  <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold text-blue-700 mb-2">
                    {mission.difficulty}
                  </span>

                  <button
                    type="button"
                    onPointerDown={(event) => event.stopPropagation()}
                    onClick={(event) => handleStartButtonClick(event, mission)}
                    onKeyDown={(event) => event.stopPropagation()}
                    className="w-full rounded-xl bg-blue-600 px-3 py-2 text-white text-xs font-bold hover:bg-blue-700 active:scale-95 transition"
                  >
                    Starten
                  </button>
                </div>
              </article>
            )
          })}
        </div>

        <div className="mt-3 text-center">
          <button
            type="button"
            onClick={onBack}
            className="rounded-xl bg-white px-4 py-2 text-xs font-bold text-blue-700 border border-blue-200 hover:bg-blue-50 transition"
          >
            Zurück zur Startseite
          </button>
        </div>
      </div>
    </section>
  )
}
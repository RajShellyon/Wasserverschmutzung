import { useRef } from 'react'
import { missions } from '../data/missions'
import NarratorVideo from './NarratorVideo'

export default function MissionOverview({ onBack }) {
  const pageRef = useRef(null)

  return (
    <section
      ref={pageRef}
      className="w-full max-w-7xl h-full flex flex-col justify-center"
    >
      <NarratorVideo
        anchorRef={pageRef}
        videoSrc="/videos/Kursauswahl.mp4"
        inset={-40}
      />

      <header className="text-center mb-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-blue-600 mb-1">
          Kursauswahl
        </p>

        <h1 className="text-2xl md:text-3xl font-extrabold text-blue-950">
          Wähle deine Mission
        </h1>

        <p className="text-sm text-slate-700 mt-1">
          Lerne die wichtigsten Arten der Wasserverschmutzung kennen.
        </p>
      </header>

      <div className="grid grid-cols-5 gap-3">
        {missions.map((mission) => (
          <article
            key={mission.id}
            className="h-[210px] rounded-2xl bg-white p-3 shadow-md border border-blue-100 text-center flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl transition"
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

              <button className="w-full rounded-xl bg-blue-600 px-3 py-2 text-white text-xs font-bold hover:bg-blue-700 active:scale-95 transition">
                Starten
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-3 text-center">
        <button
          onClick={onBack}
          className="rounded-xl bg-white px-4 py-2 text-xs font-bold text-blue-700 border border-blue-200 hover:bg-blue-50 transition"
        >
          Zurück zur Startseite
        </button>
      </div>
    </section>
  )
}
import PlastikMission from './PlastikMission'
import MikroplastikMission from './MikroplastikMission'
import OelMission from './OelMission.jsx'
import ChemikalienMission from './ChemikalienMission'
import AbwasserMission from './AbwasserMission'

const missionComponents = {
    1: PlastikMission,
    2: MikroplastikMission,
    3: OelMission,
    4: ChemikalienMission,
    5: AbwasserMission,
}

export default function MissionRouter({ mission, onBack }) {
    const MissionComponent = missionComponents[mission.id]

    if (!MissionComponent) {
        return (
            <section className="w-screen h-screen flex items-center justify-center bg-blue-50">
                <div className="rounded-2xl bg-white p-8 shadow-xl text-center">
                    <h1 className="text-2xl font-extrabold text-blue-950 mb-4">
                        Mission nicht gefunden
                    </h1>

                    <button
                        type="button"
                        onClick={onBack}
                        className="rounded-xl bg-blue-600 px-5 py-3 text-white text-sm font-bold hover:bg-blue-700 transition"
                    >
                        Zurück zur Kursauswahl
                    </button>
                </div>
            </section>
        )
    }

    return <MissionComponent mission={mission} onBack={onBack} />
}
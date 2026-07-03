export default function ChemikalienMission({ mission, onBack }) {
    return (
        <section className="w-screen h-screen bg-indigo-50 flex items-center justify-center p-8">
            <div className="w-full max-w-5xl rounded-3xl bg-white p-8 shadow-xl text-center">
                <div className="text-5xl mb-4">{mission.icon}</div>

                <h1 className="text-3xl font-extrabold text-blue-950 mb-3">
                    Chemikalien
                </h1>

                <p className="text-slate-700 mb-6">
                    Hier kommt die Aufgabe zum Thema Chemikalien rein.
                </p>

                <button
                    type="button"
                    onClick={onBack}
                    className="rounded-xl bg-blue-600 px-5 py-3 text-white text-sm font-bold hover:bg-blue-700 active:scale-95 transition"
                >
                    Zurück zur Kursauswahl
                </button>
            </div>
        </section>
    )
}
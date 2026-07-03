import { useState } from 'react'
import StartScreen from './components/StartScreen'
import MissionOverview from './components/MissionOverview'

export default function App() {
  const [screen, setScreen] = useState('start')

  return (
    <main className="h-screen overflow-hidden bg-gradient-to-br from-sky-100 via-blue-100 to-cyan-100 flex items-center justify-center p-3">
      {screen === 'start' && (
        <StartScreen onStart={() => setScreen('missions')} />
      )}

      {screen === 'missions' && (
        <MissionOverview onBack={() => setScreen('start')} />
      )}
    </main>
  )
}
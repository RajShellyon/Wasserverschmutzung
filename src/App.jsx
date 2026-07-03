import { useState } from 'react'
import StartScreen from './components/StartScreen'
import MissionOverview from './components/MissionOverview'
import MissionRouter from './components/missions/MissionRouter'

export default function App() {
  const [screen, setScreen] = useState('start')
  const [selectedMission, setSelectedMission] = useState(null)
  const [playCourseSelectionVideo, setPlayCourseSelectionVideo] = useState(true)

  function handleStartScreenStart() {
    setPlayCourseSelectionVideo(true)
    setScreen('missions')
  }

  function handleStartMission(mission) {
    setSelectedMission(mission)
    setPlayCourseSelectionVideo(false)
    setScreen('mission')
  }

  function handleBackToMissions() {
    setPlayCourseSelectionVideo(false)
    setScreen('missions')
  }

  function handleBackToStart() {
    setSelectedMission(null)
    setPlayCourseSelectionVideo(true)
    setScreen('start')
  }

  return (
    <main
      className={
        screen === 'start'
          ? 'h-screen w-screen overflow-hidden bg-gradient-to-br from-sky-100 via-blue-100 to-cyan-100 flex items-center justify-center p-3'
          : 'h-screen w-screen overflow-hidden flex items-center justify-center'
      }
    >
      {screen === 'start' && (
        <StartScreen onStart={handleStartScreenStart} />
      )}

      {screen === 'missions' && (
        <MissionOverview
          onBack={handleBackToStart}
          onStartMission={handleStartMission}
          playIntroVideo={playCourseSelectionVideo}
        />
      )}

      {screen === 'mission' && selectedMission && (
        <MissionRouter
          mission={selectedMission}
          onBack={handleBackToMissions}
        />
      )}
    </main>
  )
}
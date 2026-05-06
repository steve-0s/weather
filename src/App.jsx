import { useState } from 'react'
import Weather from './assets/components/Weather.jsx'

const App = () => {
  const [bgImage, setBgImage] = useState("/gifs/clear-d.gif");

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-cover bg-center transition-all duration-500"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(12,8,30,0.10),rgba(7,10,25,0.52))] pointer-events-none"></div>
      <div className="relative z-10">
        <Weather setBgImage={setBgImage} />
      </div>
    </div>
  )
}

export default App

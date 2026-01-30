import React, { useState } from 'react'
import Weather from './assets/components/Weather.jsx'

const App = () => {
  const [bgImage, setBgImage] = useState("/gifs/clear-d.gif");

  return (
    <div
      className="min-h-screen bg-cover bg-center transition-all duration-500"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <Weather setBgImage={setBgImage} />
    </div>
  )
}

export default App

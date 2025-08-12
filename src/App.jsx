import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './routes/Home.jsx'
import Admin from './routes/Admin.jsx'
import Host from './routes/Host.jsx'
import Player from './routes/Player.jsx'

export default function App() {

  console.log(import.meta.env.MODE);
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/host" element={<Host />} />
      <Route path="/room/:room" element={<Player />} />
    </Routes>
  )
}
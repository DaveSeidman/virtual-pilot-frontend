import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="screen home">
      <h1>Virtual Pilot</h1>
      <div className="links">
        <Link to="/admin">Admin</Link>
        <Link to="/host">Host</Link>
      </div>
    </div>
  )
}
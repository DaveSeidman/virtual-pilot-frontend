import React, { useEffect, useMemo, useRef, useState } from 'react'
import QRCode from 'react-qr-code'
import { io } from 'socket.io-client'
import Scene from '../components/Scene.jsx'
import Joystick from '../components/Joystick.jsx'
import '../styles/host.scss'
import { SERVER_URL } from '../config.js'

console.log({ SERVER_URL })
export default function Host() {
  const [room, setRoom] = useState('')
  const [players, setPlayers] = useState({})
  const [gameRunning, setGameRunning] = useState(false)
  const [primaryPlayer, setPrimaryPlayer] = useState(null)
  const socketRef = useRef(null)
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const base = import.meta.env.BASE_URL || '/'
  const joinUrl = room ?
    import.meta.env.MODE === 'development'
      ? `${import.meta.env.VITE_PUBLIC_ORIGIN}/virtual-pilot-frontend/room/${room}`
      : `https://daveseidman.github.io/virtual-pilot-frontend/room/${room}`
    : ''

  useEffect(() => {
    const s = io(SERVER_URL, { path: '/socket.io', transports: ['websocket'] })
    socketRef.current = s
    s.on('connect', () => {
      s.emit('handshake', { role: 'host' }, res => {
        if (res && res.ok) setRoom(res.room)
      })
    })
    s.on('player:joined', ({ playerId, name }) => {
      setPlayers(p => {
        const next = { ...p }
        next[playerId] = { id: playerId, name, allowed: false, connected: true, rot: [0, 0, 0] }
        if (!primaryPlayer) setPrimaryPlayer(playerId)
        return next
      })
    })
    s.on('player:connected', ({ playerId }) => {
      setPlayers(p => ({ ...p, [playerId]: { ...(p[playerId] || {}), connected: true } }))
    })
    s.on('player:allowed', ({ playerId }) => {
      setPlayers(p => ({ ...p, [playerId]: { ...(p[playerId] || {}), allowed: true } }))
    })
    s.on('player:button', ({ data }) => {
      if (data && data.button === 'START' && data.action === 'down') setGameRunning(true)
    })
    s.on('player:accel', ({ playerId, data }) => {
      const { alpha = 0, beta = 0, gamma = 0 } = data || {}
      const rot = [beta, alpha, -gamma]
      setPlayers(p => {
        if (!p[playerId]) return p
        const next = { ...p }
        next[playerId] = { ...p[playerId], rot }
        return next
      })
    })
    s.on('player:left', ({ playerId }) => {
      setPlayers(p => {
        const next = { ...p }
        delete next[playerId]
        return next
      })
    })
    return () => s.disconnect()
  }, [])

  const roster = useMemo(() => Object.values(players), [players])

  return (
    <div className="screen host">
      <div className="header">
        <h2>Host</h2>
        {room && <div className="room">Room: <span>{room}</span></div>}
      </div>
      <div className="share">
        {room && (
          <>
            <div className="url">{joinUrl}</div>
            <div className="qr"><QRCode value={joinUrl} size={220} /></div>
          </>
        )}
      </div>
      <div className="content">
        <div className="left">
          <Scene running={gameRunning} primaryOrientation={players[primaryPlayer]?.rot || [0, 0, 0]} />
          <div className="players">
            {roster.map(p => (
              <div key={p.id} className="player-row">
                <Joystick rotation={p.rot} label={p.name} size={64} />
                <div className="meta">
                  <div className="name">{p.name}</div>
                  <div className="status">
                    {p.connected ? 'connected' : 'disconnected'} • {p.allowed ? 'ready' : 'waiting'}
                  </div>
                </div>
              </div>
            ))}
            {!roster.length && <div className="hint">Waiting for players…</div>}
          </div>
        </div>
      </div>
    </div>
  )
}

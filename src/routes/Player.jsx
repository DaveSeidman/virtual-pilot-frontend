import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { io } from 'socket.io-client'
import '../styles/player.scss'
import { SERVER_URL } from '../config.js'

export default function Player() {
  const { room } = useParams()
  const [connected, setConnected] = useState(false)
  const [allowed, setAllowed] = useState(false)
  const [name, setName] = useState('')
  const socketRef = useRef(null)
  const motionRef = useRef({ alpha: 0, beta: 0, gamma: 0 })
  const rafRef = useRef(0)

  useEffect(() => {
    const s = io(SERVER_URL, { transports: ['websocket'] })
    socketRef.current = s
    s.on('connect', () => {
      s.emit('handshake', { role: 'player', room }, res => {
        if (res && res.ok) {
          setConnected(true)
          if (res.name) setName(res.name)
          s.emit('player:connected')
        }
      })
    })
    return () => {
      cancelAnimationFrame(rafRef.current)
      s.disconnect()
    }
  }, [room])

  function loop() {
    if (socketRef.current) socketRef.current.emit('player:accel', motionRef.current)
    rafRef.current = requestAnimationFrame(loop)
  }

  async function requestMotion() {
    const anyWin = window
    if (typeof anyWin.DeviceMotionEvent !== 'undefined' && typeof anyWin.DeviceMotionEvent.requestPermission === 'function') {
      const res = await anyWin.DeviceMotionEvent.requestPermission()
      if (res !== 'granted') return
    }
    setAllowed(true)
    socketRef.current.emit('player:allowed', { ok: true })
    window.addEventListener('deviceorientation', e => {
      const alpha = e.alpha || 0
      const beta = e.beta || 0
      const gamma = e.gamma || 0
      motionRef.current = { alpha, beta, gamma }
    }, true)
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(loop)
  }

  function start() {
    if (!socketRef.current) return
    socketRef.current.emit('player:button', { button: 'START', action: 'down' })
  }

  return (
    <div className="screen player">
      <div className="top">
        <div className="badge">{name || 'Player'}</div>
        <div className="room">Room: {room}</div>
      </div>
      <div className="center">
        {!allowed ? (
          <button className="primary" onClick={requestMotion} disabled={!connected}>Enable Motion</button>
        ) : (
          <button className="primary" onClick={start}>Start</button>
        )}
      </div>
    </div>
  )
}

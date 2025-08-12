import React, { useMemo } from 'react'
import { Canvas } from '@react-three/fiber'

function Stick({ rotation }) {
  return (
    <group rotation={[rotation[0]*Math.PI/180, rotation[1]*Math.PI/180, rotation[2]*Math.PI/180]}>
      <mesh position={[0,0.4,0]}>
        <cylinderGeometry args={[0.08,0.08,0.8,24]} />
        <meshStandardMaterial color="#aaa" />
      </mesh>
      <mesh position={[0,0.9,0]}>
        <sphereGeometry args={[0.16, 24, 24]} />
        <meshStandardMaterial color="#d33" />
      </mesh>
      <mesh rotation={[-Math.PI/2,0,0]}>
        <cylinderGeometry args={[0.5,0.5,0.1,32]} />
        <meshStandardMaterial color="#222" />
      </mesh>
    </group>
  )
}

export default function Joystick({ rotation=[0,0,0], label='', size=80 }) {
  return (
    <div className="joystick" style={{ width: size, height: size }}>
      <Canvas camera={{ position: [0.6,0.6,1.2] }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[1,1,1]} />
        <Stick rotation={rotation} />
      </Canvas>
      <div className="label">{label}</div>
    </div>
  )
}
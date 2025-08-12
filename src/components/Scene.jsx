import React, { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'

function CameraRig({ running, orientation }) {
  const { camera } = useThree()
  const vel = useRef(0.2)
  useFrame((_, dt) => {
    const [pitch, yaw, roll] = orientation
    camera.rotation.set(THREE.MathUtils.degToRad(pitch * 0.5), THREE.MathUtils.degToRad(yaw * 0.5), THREE.MathUtils.degToRad(roll * 0.5))
    if (running) camera.position.z -= vel.current * (dt * 60) * 0.1
  })
  return null
}

function Environment() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 10, 5]} intensity={1} />
      <mesh position={[0,-1,0]} rotation={[-Math.PI/2,0,0]}>
        <circleGeometry args={[50, 64]} />
        <meshStandardMaterial color="#2b2b2b" />
      </mesh>
      <gridHelper args={[100, 100, '#444', '#222']} />
    </>
  )
}

export default function Scene({ running, primaryOrientation }) {
  return (
    <div className="scene">
      <Canvas camera={{ position: [0, 2, 8], fov: 60 }}>
        <Environment />
        <CameraRig running={running} orientation={primaryOrientation} />
        <OrbitControls enablePan={false} enableZoom={false} />
      </Canvas>
    </div>
  )
}
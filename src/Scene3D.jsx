import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Stars } from '@react-three/drei'
import { guardians } from './guardians.js'

function OrbiterCore() {
  const group = useRef(null)
  const ring = useRef(null)

  useFrame(({ clock, pointer }) => {
    const time = clock.elapsedTime
    if (group.current) {
      group.current.rotation.y = time * 0.22 + pointer.x * 0.15
      group.current.rotation.x = pointer.y * 0.12
      group.current.position.y = Math.sin(time * 0.8) * 0.08
    }
    if (ring.current) ring.current.rotation.z = -time * 0.16
  })

  return (
    <group ref={group}>
      <Float speed={1.5} rotationIntensity={0.16} floatIntensity={0.22}>
        <mesh>
          <icosahedronGeometry args={[1.05, 2]} />
          <meshStandardMaterial
            color="#193344"
            metalness={0.88}
            roughness={0.22}
            emissive="#007ea8"
            emissiveIntensity={0.45}
            wireframe
          />
        </mesh>
        <mesh>
          <icosahedronGeometry args={[0.72, 1]} />
          <meshPhysicalMaterial
            color="#bdefff"
            metalness={0.72}
            roughness={0.16}
            emissive="#00b7ff"
            emissiveIntensity={1.35}
            transmission={0.15}
            transparent
            opacity={0.9}
          />
        </mesh>
        <mesh ref={ring} rotation={[Math.PI / 2.3, 0.2, 0]}>
          <torusGeometry args={[1.48, 0.014, 8, 140]} />
          <meshBasicMaterial color="#00e5ff" />
        </mesh>
        <mesh rotation={[0.5, 0.9, 0.3]}>
          <torusGeometry args={[1.62, 0.008, 8, 140]} />
          <meshBasicMaterial color="#e62429" />
        </mesh>
      </Float>
      <pointLight color="#00b7ff" intensity={18} distance={5} />
    </group>
  )
}

export function HeroScene() {
  return (
    <Canvas
      className="three-canvas hero-canvas"
      camera={{ position: [0, 0, 5.4], fov: 42 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true }}
      aria-label="Animated 3D Orbiter energy core"
    >
      <ambientLight intensity={0.65} />
      <pointLight position={[4, 4, 5]} color="#dffcff" intensity={22} />
      <pointLight position={[-4, -2, 1]} color="#e62429" intensity={8} />
      <Stars radius={42} depth={28} count={900} factor={2} saturation={0.25} fade speed={0.35} />
      <OrbiterCore />
    </Canvas>
  )
}

function GuardianFigure({ guardian, index, selected }) {
  const figure = useRef(null)
  const platform = useRef(null)
  const isSelected = selected === index
  const relativeIndex = (index - selected + guardians.length) % guardians.length
  const x = relativeIndex === 0 ? 0 : relativeIndex === 1 ? 2.35 : -2.35
  const scale = isSelected ? 1.08 : 0.78

  useFrame(({ clock, pointer }) => {
    if (!figure.current) return
    figure.current.rotation.y =
      Math.sin(clock.elapsedTime * 0.45 + index) * 0.1 + pointer.x * (isSelected ? 0.09 : 0.025)
    figure.current.position.y = Math.sin(clock.elapsedTime * 0.8 + index * 1.7) * 0.07
    if (platform.current) platform.current.rotation.z = clock.elapsedTime * (index % 2 ? -0.12 : 0.12)
  })

  return (
    <group ref={figure} position={[x, isSelected ? -0.42 : -0.52, 0]} scale={scale}>
      <Float speed={1.1 + index * 0.15} rotationIntensity={0.04} floatIntensity={0.08}>
        <mesh position={[0, 1.72, 0]} castShadow>
          <dodecahedronGeometry args={[0.47, 1]} />
          <meshStandardMaterial
            color="#172332"
            metalness={0.9}
            roughness={0.2}
            emissive={guardian.accent}
            emissiveIntensity={isSelected ? 0.24 : 0.08}
          />
        </mesh>
        <mesh position={[0, 1.65, 0]} castShadow>
          <icosahedronGeometry args={[0.43, 1]} />
          <meshStandardMaterial
            color="#101824"
            metalness={0.85}
            roughness={0.24}
            emissive={guardian.accent}
            emissiveIntensity={isSelected ? 0.35 : 0.12}
          />
        </mesh>
        <mesh position={[0, 1.66, 0.365]} scale={[0.31, 0.075, 0.055]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color="#dffcff"
            metalness={0.5}
            roughness={0.18}
            emissive={guardian.accent}
            emissiveIntensity={1.15}
          />
        </mesh>
        <mesh position={[0, 2.08, 0]} rotation={[0, 0, index === 1 ? 0.28 : -0.12]}>
          <coneGeometry args={[0.18, index === 1 ? 0.55 : 0.32, 5]} />
          <meshStandardMaterial color="#354557" metalness={0.85} roughness={0.22} />
        </mesh>
        <mesh position={[0, 0.85, 0]} castShadow>
          <capsuleGeometry args={[0.42, 0.85, 5, 12]} />
          <meshStandardMaterial
            color="#172333"
            metalness={0.82}
            roughness={0.28}
            emissive={guardian.accent}
            emissiveIntensity={isSelected ? 0.22 : 0.08}
          />
        </mesh>
        <mesh position={[0, 1.12, 0.36]} scale={[0.31, 0.43, 0.075]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color="#34495d"
            metalness={0.88}
            roughness={0.24}
            emissive={guardian.accent}
            emissiveIntensity={isSelected ? 0.38 : 0.13}
          />
        </mesh>
        <mesh position={[0, 0.57, 0.35]} scale={[0.22, 0.1, 0.04]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color={guardian.accent} />
        </mesh>
        {[-1, 1].map((side) => (
          <group key={side}>
            <mesh position={[side * 0.51, 1.25, 0]} rotation={[0, 0, side * -0.12]}>
              <icosahedronGeometry args={[0.34, 0]} />
              <meshStandardMaterial color="#33475b" metalness={0.86} roughness={0.25} />
            </mesh>
            <mesh position={[side * 0.62, 0.58, 0]} rotation={[0, 0, side * -0.08]}>
              <capsuleGeometry args={[0.14, 0.58, 4, 8]} />
              <meshStandardMaterial color="#233345" metalness={0.75} roughness={0.32} />
            </mesh>
            <mesh position={[side * 0.66, 0.36, 0.13]} rotation={[0, 0, side * -0.08]}>
              <boxGeometry args={[0.25, 0.28, 0.18]} />
              <meshStandardMaterial
                color="#42586b"
                metalness={0.82}
                roughness={0.25}
                emissive={guardian.accent}
                emissiveIntensity={0.16}
              />
            </mesh>
            <mesh position={[side * 0.23, 0.04, 0]}>
              <capsuleGeometry args={[0.17, 0.68, 4, 8]} />
              <meshStandardMaterial color="#1a2736" metalness={0.78} roughness={0.3} />
            </mesh>
            <mesh position={[side * 0.23, -0.39, 0.08]} scale={[0.24, 0.08, 0.4]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#334253" metalness={0.8} roughness={0.3} />
            </mesh>
          </group>
        ))}
        {index === 0 && (
          <mesh position={[0.75, 0.83, 0.1]} rotation={[0.15, 0, -0.2]}>
            <torusGeometry args={[0.36, 0.065, 10, 48]} />
            <meshStandardMaterial color={guardian.accent} metalness={0.7} emissive={guardian.accent} emissiveIntensity={0.65} />
          </mesh>
        )}
        {index === 1 && (
          <mesh position={[-0.78, 0.86, 0.13]} rotation={[0.4, 0.1, 0.3]}>
            <icosahedronGeometry args={[0.35, 0]} />
            <meshStandardMaterial color={guardian.accent} metalness={0.45} emissive={guardian.accent} emissiveIntensity={0.9} />
          </mesh>
        )}
        {index === 2 && (
          <mesh position={[0, 2.35, -0.12]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.54, 0.022, 8, 56]} />
            <meshBasicMaterial color={guardian.accent} />
          </mesh>
        )}
      </Float>
      <pointLight position={[0, 1.1, 1.4]} color={guardian.accent} intensity={isSelected ? 3.5 : 1.2} distance={3} />
      <mesh ref={platform} position={[0, -0.58, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.82, 0.012, 6, 72]} />
        <meshBasicMaterial color={guardian.accent} transparent opacity={isSelected ? 0.8 : 0.32} />
      </mesh>
      <mesh position={[0, -0.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.66, 48]} />
        <meshBasicMaterial color={guardian.accent} transparent opacity={isSelected ? 0.08 : 0.025} />
      </mesh>
    </group>
  )
}

export function GuardianScene({ selected }) {
  return (
    <Canvas
      className="three-canvas guardian-canvas"
      camera={{ position: [0, 1.1, 8.8], fov: 40 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true }}
      aria-label="Original 3D Orbiter guardian characters"
    >
      <ambientLight intensity={1.1} />
      <pointLight position={[0, 4, 5]} color="#e9f9ff" intensity={18} />
      <Stars radius={28} depth={12} count={380} factor={1.5} saturation={0.3} fade speed={0.2} />
      {guardians.map((guardian, index) => (
        <GuardianFigure
          key={guardian.name}
          guardian={guardian}
          index={index}
          selected={selected}
        />
      ))}
    </Canvas>
  )
}

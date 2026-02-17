// @ts-nocheck
"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

// Custom Shader for Wave/Ribbon Effect
const WaveShader = {
    uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color("#000000") }, // Black background
        uWaveColor: { value: new THREE.Color("#4b5563") }, // Gray-600 for the wave
    },
    vertexShader: `
    uniform float uTime;
    varying vec2 vUv;
    varying float vElevation;

    void main() {
      vUv = uv;

      vec3 pos = position;

      // Sine Wave Distortion
      // Combine multiple sine waves for a more organic, flowing ribbon look
      float elevation = 
        sin(pos.x * 2.5 + uTime * 0.5) * 0.4 +
        sin(pos.x * 5.0 + uTime * 1.5) * 0.1 +
        sin(pos.y * 3.0 + uTime * 0.5) * 0.2;

      // Apply elevation to Z axis
      pos.z += elevation;

      vElevation = elevation;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
    fragmentShader: `
    uniform vec3 uColor;
    uniform vec3 uWaveColor;
    varying float vElevation;
    varying vec2 vUv;

    void main() {
        // Alpha based on elevation to make "valleys" darker/transparent
        // This helps blend it with the background
        float alpha = smoothstep(-0.8, 0.5, vElevation);

        // Mix background color with wave color based on elevation
        vec3 color = mix(uColor, uWaveColor, alpha * 0.8); // 0.8 strength

        // Add a soft glow/gradient
        float glow = smoothstep(0.0, 1.0, 1.0 - distance(vUv.y, 0.5) * 2.0);
        color += uWaveColor * glow * 0.2;

        // Rim lighting effect for 3D feel
        // Simple approximation based on derivative or just elevation gradient
        // Let's just keep it smooth

        // Fade out edges to blend with global background
        float edgeFade = smoothstep(0.0, 0.2, vUv.x) * smoothstep(1.0, 0.8, vUv.x) * 
                         smoothstep(0.0, 0.2, vUv.y) * smoothstep(1.0, 0.8, vUv.y);

        gl_FragColor = vec4(color, 1.0);
    }
  `
};

function WavePlane() {
    const mesh = useRef<THREE.Mesh>(null);

    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uColor: { value: new THREE.Color("#000000") },
            uWaveColor: { value: new THREE.Color("#6b7280") }, // Gray-500/600 metallic look
        }),
        []
    );

    useFrame((state) => {
        if (mesh.current) {
            // @ts-ignore
            mesh.current.material.uniforms.uTime.value = state.clock.getElapsedTime();
        }
    });

    return (
        // Scale to cover the view
        <mesh ref={mesh} rotation={[0, 0, 0]} scale={[1.8, 1.8, 1.0]}>
            <planeGeometry args={[10, 10, 128, 128]} />
            <shaderMaterial
                uniforms={uniforms}
                vertexShader={WaveShader.vertexShader}
                fragmentShader={WaveShader.fragmentShader}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
}

export default function HeroWave() {
    return (
        <div className="absolute bottom-0 left-0 z-0 w-full h-[35vh] pointer-events-none">
            {/* Height restricted to bottom 35% to be "small size" */}
            <Canvas camera={{ position: [0, 0, 4], fov: 75 }}>
                <ambientLight intensity={0.5} />
                <WavePlane />
            </Canvas>
        </div>
    );
}

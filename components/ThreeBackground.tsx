// @ts-nocheck
"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

// Custom Shader Material for Metaballs
const MetaballsShader = {
    uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color("#888888") }, // Gray
        uResolution: { value: new THREE.Vector2() },
        uScroll: { value: 0 }, // New scroll uniform
    },
    vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `,
    fragmentShader: `
    uniform float uTime;
    uniform vec3 uColor;
    uniform vec2 uResolution;
    uniform float uScroll;
    varying vec2 vUv;

    // Random function
    float random(in vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
    }

    // Noise function
    float noise(in vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));
        vec2 u = f*f*(3.0-2.0*f);
        return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    void main() {
        vec2 uv = vUv;
        
        // Aspect ratio correction
        float aspect = uResolution.x / uResolution.y;
        vec2 pos = uv;
        pos.x *= aspect;

        // Scroll effect: offset Y position based on scroll
        pos.y += uScroll * 0.0005; 

        // Metaball centers (moving)
        vec2 m1 = vec2(0.5 * aspect, 0.5) + vec2(sin(uTime * 0.5), cos(uTime * 0.6)) * 0.3;
        vec2 m2 = vec2(0.5 * aspect, 0.5) + vec2(cos(uTime * 0.7), sin(uTime * 0.4)) * 0.3;
        vec2 m3 = vec2(0.5 * aspect, 0.5) + vec2(sin(uTime * 0.3 + 2.0), cos(uTime * 0.5 + 1.0)) * 0.4;
        vec2 m4 = vec2(0.5 * aspect, 0.5) + vec2(cos(uTime * 0.6 + 4.0), sin(uTime * 0.4 + 3.0)) * 0.25;

        // Calculate distances
        float d1 = length(pos - m1);
        float d2 = length(pos - m2);
        float d3 = length(pos - m3);
        float d4 = length(pos - m4);

        // Metaball field
        float v = 1.0 / d1 + 1.0 / d2 + 1.0 / d3 + 1.0 / d4;
        
        // Thresholding for "gooey" effect
        float threshold = 15.0;
        float intensity = smoothstep(threshold - 0.5, threshold + 0.5, v);

        // Add subtle noise texture
        float n = noise(pos * 5.0 + uTime * 0.1);
        intensity *= (0.8 + 0.2 * n);

        // Color mix
        vec3 color = mix(vec3(0.0), uColor, intensity * 0.6); // 0.6 opacity

        gl_FragColor = vec4(color, 1.0);
    }
  `
};

function ShaderPlane() {
    const mesh = useRef<THREE.Mesh>(null);
    const { size } = useThree();

    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uColor: { value: new THREE.Color("#888888") },
            uResolution: { value: new THREE.Vector2(size.width, size.height) },
            uScroll: { value: 0 },
        }),
        [] // Empty dependency array, we update manually
    );

    useFrame((state) => {
        if (mesh.current) {
            // @ts-ignore
            mesh.current.material.uniforms.uTime.value = state.clock.getElapsedTime();
            // @ts-ignore
            mesh.current.material.uniforms.uResolution.value.set(state.size.width, state.size.height);
            // @ts-ignore
            mesh.current.material.uniforms.uScroll.value = window.scrollY;
        }
    });

    return (
        <mesh ref={mesh}>
            <planeGeometry args={[2, 2]} />
            <shaderMaterial
                uniforms={uniforms}
                vertexShader={MetaballsShader.vertexShader}
                fragmentShader={MetaballsShader.fragmentShader}
                transparent={true}
                depthWrite={false}
            />
        </mesh>
    );
}

export default function ThreeBackground() {
    return (
        <div className="fixed inset-0 z-[-1] h-full w-full bg-black pointer-events-none">
            <Canvas camera={{ position: [0, 0, 1] }}>
                <group>
                    <Stars
                        radius={100}
                        depth={50}
                        count={5000}
                        factor={4}
                        saturation={0}
                        fade
                        speed={1}
                    />
                    <ShaderPlane />
                </group>
            </Canvas>
        </div>
    );
}

import { Object3DNode } from '@react-three/fiber'
import { Group, Points, PointMaterial } from 'three'

declare module '@react-three/fiber' {
    interface ThreeElements {
        group: Object3DNode<Group, typeof Group>
        points: Object3DNode<Points, typeof Points>
        pointMaterial: Object3DNode<PointMaterial, typeof PointMaterial>
    }
}

declare module 'maath/random/dist/maath-random.cjs' {
    export function inSphere(buffer: Float32Array, options?: { radius?: number }): Float32Array;
}

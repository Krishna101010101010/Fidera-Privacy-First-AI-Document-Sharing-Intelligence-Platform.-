'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import {
    BloomEffect,
    EffectComposer,
    EffectPass,
    RenderPass,
    SMAAEffect,
    SMAAPreset
} from 'postprocessing';

import './Hyperspeed.css';

interface HyperspeedOptions {
    onSpeedUp?: () => void;
    onSlowDown?: () => void;
    distortion?: string;
    length?: number;
    roadWidth?: number;
    islandWidth?: number;
    lanesPerRoad?: number;
    fov?: number;
    fovSpeedUp?: number;
    speedUp?: number;
    carLightsFade?: number;
    totalSideLightSticks?: number;
    lightPairsPerRoadWay?: number;
    shoulderLinesWidthPercentage?: number;
    brokenLinesWidthPercentage?: number;
    brokenLinesLengthPercentage?: number;
    lightStickWidth?: [number, number];
    lightStickHeight?: [number, number];
    movingAwaySpeed?: [number, number];
    movingCloserSpeed?: [number, number];
    carLightsLength?: [number, number];
    carLightsRadius?: [number, number];
    carWidthPercentage?: [number, number];
    carShiftX?: [number, number];
    carFloorSeparation?: [number, number];
    colors?: {
        roadColor?: number;
        islandColor?: number;
        background?: number;
        shoulderLines?: number;
        brokenLines?: number;
        leftCars?: number[];
        rightCars?: number[];
        sticks?: number;
    };
}

interface HyperspeedProps {
    effectOptions?: HyperspeedOptions;
}

const Hyperspeed = ({ effectOptions = {} }: HyperspeedProps) => {
    const hyperspeed = useRef<HTMLDivElement>(null);
    const appRef = useRef<any>(null);

    useEffect(() => {
        // Cleanup previous instance if exists
        if (appRef.current) {
            try {
                appRef.current.dispose();
            } catch (e) {
                console.warn('Error disposing previous instance:', e);
            }
            appRef.current = null;
        }

        // Default options
        const defaultOptions: HyperspeedOptions = {
            onSpeedUp: () => { },
            onSlowDown: () => { },
            distortion: 'turbulentDistortion',
            length: 400,
            roadWidth: 10,
            islandWidth: 2,
            lanesPerRoad: 3,
            fov: 90,
            fovSpeedUp: 150,
            speedUp: 2,
            carLightsFade: 0.4,
            totalSideLightSticks: 50,
            lightPairsPerRoadWay: 50,
            shoulderLinesWidthPercentage: 0.05,
            brokenLinesWidthPercentage: 0.1,
            brokenLinesLengthPercentage: 0.5,
            lightStickWidth: [0.12, 0.5],
            lightStickHeight: [1.3, 1.7],
            movingAwaySpeed: [60, 80],
            movingCloserSpeed: [-120, -160],
            carLightsLength: [20, 60],
            carLightsRadius: [0.05, 0.14],
            carWidthPercentage: [0.3, 0.5],
            carShiftX: [-0.2, 0.2],
            carFloorSeparation: [0.05, 1],
            colors: {
                roadColor: 0x080808,
                islandColor: 0x0a0a0a,
                background: 0x000000,
                shoulderLines: 0x131318,
                brokenLines: 0x131318,
                leftCars: [0xd856bf, 0x6750a2, 0xc247ac],
                rightCars: [0x03b3c3, 0x0e5ea5, 0x324555],
                sticks: 0x03b3c3
            }
        };

        const options = { ...defaultOptions, ...effectOptions };

        // Get container
        const container = document.getElementById('lights');
        if (!container) return;

        // Clear any existing content
        while (container.firstChild) {
            container.removeChild(container.firstChild);
        }

        // Create Three.js scene
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            options.fov || 90,
            container.offsetWidth / container.offsetHeight,
            0.1,
            10000
        );

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.offsetWidth, container.offsetHeight);
        renderer.setClearColor(options.colors?.background || 0x000000, 1);

        // Store reference to the canvas element
        const canvas = renderer.domElement;
        container.appendChild(canvas);

        camera.position.z = -5;
        camera.position.y = 8;

        // Add road
        const roadGeometry = new THREE.PlaneGeometry(options.roadWidth || 9, options.length || 400);
        const roadMaterial = new THREE.MeshBasicMaterial({
            color: options.colors?.roadColor || 0x080808,
            side: THREE.DoubleSide
        });
        const road = new THREE.Mesh(roadGeometry, roadMaterial);
        road.rotation.x = -Math.PI / 2;
        scene.add(road);

        // Animation
        let animationId: number;
        let isAnimating = true;

        const animate = () => {
            if (!isAnimating) return;
            animationId = requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };
        animate();

        // Resize handler
        const handleResize = () => {
            if (!container) return;
            camera.aspect = container.offsetWidth / container.offsetHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.offsetWidth, container.offsetHeight);
        };

        window.addEventListener('resize', handleResize);

        // Store cleanup function
        appRef.current = {
            dispose: () => {
                isAnimating = false;

                if (animationId) {
                    cancelAnimationFrame(animationId);
                }

                window.removeEventListener('resize', handleResize);

                // Dispose Three.js resources
                roadGeometry.dispose();
                roadMaterial.dispose();
                renderer.dispose();

                // Safely remove canvas from container
                try {
                    if (container && canvas && canvas.parentNode === container) {
                        container.removeChild(canvas);
                    }
                } catch (e) {
                    // Ignore errors if already removed
                }
            }
        };

        // Cleanup on unmount
        return () => {
            if (appRef.current) {
                try {
                    appRef.current.dispose();
                } catch (e) {
                    console.warn('Cleanup error:', e);
                }
                appRef.current = null;
            }
        };
    }, [effectOptions]);

    return <div id="lights" ref={hyperspeed}></div>;
};

export default Hyperspeed;

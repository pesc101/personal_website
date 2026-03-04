"use client"

import createGlobe from "cobe"
import { useEffect, useRef } from "react"

export default function Globe() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        let phi = 0
        let globe: ReturnType<typeof createGlobe> | undefined

        if (canvasRef.current) {
            globe = createGlobe(canvasRef.current, {
                devicePixelRatio: 2,
                width: 400,
                height: 400,
                phi: 0,
                theta: 0.3,
                dark: 0,
                diffuse: 1.2,
                mapSamples: 16000,
                mapBrightness: 6,
                baseColor: [0.9, 0.9, 0.9],
                markerColor: [0.18, 0.18, 0.18],
                glowColor: [0.95, 0.95, 0.95],
                markers: [
                    // Kaiserslautern, Germany
                    { location: [49.4439, 7.7688], size: 0.06 },
                ],
                onRender: (state) => {
                    state.phi = phi
                    phi += 0.003
                },
            })
        }

        return () => {
            globe?.destroy()
        }
    }, [])

    return (
        <canvas
            ref={canvasRef}
            style={{ width: 200, height: 200 }}
            className="opacity-90"
        />
    )
}

"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { Keyboard } from "@/components/ui/keyboard";

const NAME = "Jan Strich";
const SUBTITLE = "PhD Candidate · Uni Hamburg";
const CHAR_DURATION = 100;
const LINE_PAUSE = 500;
const SWAP_DELAY = 1000; // pause after typing before showing photo

export default function KeyboardTyping() {
    const [displayedName, setDisplayedName] = useState("");
    const [displayedSub, setDisplayedSub] = useState("");
    const [showPhoto, setShowPhoto] = useState(false);

    useEffect(() => {
        const nameTotal = NAME.length * CHAR_DURATION;
        const subTotal = SUBTITLE.length * CHAR_DURATION;
        const typingDone = nameTotal + LINE_PAUSE + subTotal;
        const timers: ReturnType<typeof setTimeout>[] = [];

        // Type name
        for (let i = 0; i < NAME.length; i++) {
            timers.push(setTimeout(() => setDisplayedName(NAME.slice(0, i + 1)), i * CHAR_DURATION));
        }

        // Type subtitle after pause
        const subStart = nameTotal + LINE_PAUSE;
        for (let i = 0; i < SUBTITLE.length; i++) {
            timers.push(setTimeout(() => setDisplayedSub(SUBTITLE.slice(0, i + 1)), subStart + i * CHAR_DURATION));
        }

        // Swap keyboard → photo once, no loop
        timers.push(setTimeout(() => setShowPhoto(true), typingDone + SWAP_DELAY));

        return () => timers.forEach(clearTimeout);
    }, []);

    const nameTyping = displayedName.length < NAME.length;
    const subTyping = !nameTyping && displayedSub.length < SUBTITLE.length;

    return (
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 rounded-xl bg-neutral-950 py-10 px-8 mb-8">
            {/* Left: text */}
            <div className="flex flex-col gap-2 md:flex-1">
                <div className="h-14 flex items-center">
                    <span className="font-mono text-4xl font-bold tracking-[0.15em] text-neutral-100">
                        {displayedName}
                        {nameTyping && <span className="animate-pulse">|</span>}
                    </span>
                </div>
                <div className="h-8 flex items-center">
                    <span className="font-mono text-base tracking-widest text-neutral-400">
                        {displayedSub}
                        {subTyping && <span className="animate-pulse">|</span>}
                    </span>
                </div>
            </div>

            {/* Right: keyboard → photo (keyboard stays in DOM to hold height) */}
            <div className="shrink-0 relative flex items-center justify-center" style={{ minWidth: 360 }}>
                {/* Keyboard: always in layout flow to preserve container height */}
                <motion.div
                    animate={{ opacity: showPhoto ? 0 : 1 }}
                    transition={{ duration: 0.4 }}
                    style={{ pointerEvents: showPhoto ? "none" : "auto" }}
                >
                    <Keyboard autoType={`${NAME}\nPhD Candidate - Uni Hamburg`} />
                </motion.div>

                {/* Photo: absolutely centered on top */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: showPhoto ? 1 : 0, scale: showPhoto ? 1 : 0.9 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ pointerEvents: showPhoto ? "auto" : "none" }}
                >
                    <Image
                        src="/jan.jpeg"
                        alt="Jan Strich"
                        width={1200}
                        height={1200}
                        quality={100}
                        className="rounded-full object-cover shadow-xl ring-2 ring-neutral-700"
                        style={{ width: 240, height: 240 }}
                        priority
                    />
                </motion.div>
            </div>
        </div>
    );
}



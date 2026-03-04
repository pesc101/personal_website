"use client";
import React, {
    createContext,
    useContext,
    useEffect,
    useRef,
    useState,
    useCallback,
} from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import {
    IconBrightnessDown,
    IconBrightnessUp,
    IconCaretRightFilled,
    IconCaretUpFilled,
    IconChevronUp,
    IconMicrophone,
    IconMoon,
    IconPlayerSkipForward,
    IconPlayerTrackNext,
    IconPlayerTrackPrev,
    IconTable,
    IconVolume,
    IconVolume2,
    IconVolume3,
    IconSearch,
    IconWorld,
    IconCommand,
    IconCaretLeftFilled,
    IconCaretDownFilled,
} from "@tabler/icons-react";

// Map key codes to display labels
const KEY_DISPLAY_LABELS: Record<string, string> = {
    Escape: "esc",
    Backspace: "delete",
    Tab: "tab",
    Enter: "return",
    ShiftLeft: "shift",
    ShiftRight: "shift",
    ControlLeft: "control",
    ControlRight: "control",
    AltLeft: "option",
    AltRight: "option",
    MetaLeft: "command",
    MetaRight: "command",
    Space: "space",
    CapsLock: "caps",
    ArrowUp: "↑",
    ArrowDown: "↓",
    ArrowLeft: "←",
    ArrowRight: "→",
    Backquote: "`",
    Minus: "-",
    Equal: "=",
    BracketLeft: "[",
    BracketRight: "]",
    Backslash: "\\",
    Semicolon: ";",
    Quote: "'",
    Comma: ",",
    Period: ".",
    Slash: "/",
};

const getKeyDisplayLabel = (keyCode: string): string => {
    if (KEY_DISPLAY_LABELS[keyCode]) return KEY_DISPLAY_LABELS[keyCode];
    if (keyCode.startsWith("Key")) return keyCode.slice(3);
    if (keyCode.startsWith("Digit")) return keyCode.slice(5);
    if (keyCode.startsWith("F") && keyCode.length <= 3) return keyCode;
    return keyCode;
};

// Map a character to the key codes it requires (modifiers first, then the key)
function charToKeyCodes(char: string): string[] {
    const upper = char.toUpperCase();
    const lower = char.toLowerCase();
    const isUpper = char !== lower && char === upper;

    // Letters
    if (/^[a-zA-Z]$/.test(char)) {
        const code = `Key${upper}`;
        return isUpper ? ["ShiftLeft", code] : [code];
    }
    if (char === " ") return ["Space"];
    if (char === "-") return ["Minus"];
    if (char === ".") return ["Period"];
    if (/^[0-9]$/.test(char)) return [`Digit${char}`];
    return [];
}

interface KeyboardContextType {
    pressedKeys: Set<string>;
    setPressed: (keyCode: string) => void;
    setReleased: (keyCode: string) => void;
    lastPressedKey: string | null;
}

const KeyboardContext = createContext<KeyboardContextType | null>(null);

const useKeyboardContext = () => {
    const context = useContext(KeyboardContext);
    if (!context) throw new Error("Must be used within KeyboardProvider");
    return context;
};

const KeyboardProvider = ({
    children,
    autoType,
    containerRef,
}: {
    children: React.ReactNode;
    autoType?: string;
    containerRef: React.RefObject<HTMLDivElement | null>;
}) => {
    const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
    const [lastPressedKey, setLastPressedKey] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    const setPressed = useCallback((keyCode: string) => {
        setPressedKeys((prev) => new Set(prev).add(keyCode));
        setLastPressedKey(keyCode);
    }, []);

    const setReleased = useCallback((keyCode: string) => {
        setPressedKeys((prev) => {
            const next = new Set(prev);
            next.delete(keyCode);
            return next;
        });
    }, []);

    // Track visibility with IntersectionObserver
    useEffect(() => {
        const element = containerRef.current;
        if (!element) return;
        const observer = new IntersectionObserver(
            ([entry]) => setIsVisible(entry.isIntersecting),
            { threshold: 0.1 }
        );
        observer.observe(element);
        return () => observer.disconnect();
    }, [containerRef]);

    // Physical keyboard events
    useEffect(() => {
        if (!isVisible) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.repeat) return;
            setPressed(e.code);
        };
        const onKeyUp = (e: KeyboardEvent) => setReleased(e.code);
        document.addEventListener("keydown", onKeyDown);
        document.addEventListener("keyup", onKeyUp);
        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.removeEventListener("keyup", onKeyUp);
        };
    }, [isVisible, setPressed, setReleased]);

    // Auto-type animation
    useEffect(() => {
        if (!autoType) return;

        // Build a flat sequence: [{ code, action: 'down'|'up', delay }]
        const PRESS_DURATION = 60;  // time key is held
        const KEY_GAP = 40;         // gap between releases and next press (total: 100ms/char)
        const LINE_PAUSE = 500;     // pause between lines (\n)

        type Step = { code: string; action: "down" | "up"; t: number };
        const steps: Step[] = [];
        let cursor = 0;

        for (const char of autoType) {
            if (char === "\n") { cursor += LINE_PAUSE; continue; }
            const codes = charToKeyCodes(char);
            if (!codes.length) { cursor += KEY_GAP; continue; }

            // Press all codes (modifiers first) together
            for (const code of codes) {
                steps.push({ code, action: "down", t: cursor });
            }
            cursor += PRESS_DURATION;

            // Release in reverse order
            for (const code of [...codes].reverse()) {
                steps.push({ code, action: "up", t: cursor });
            }
            cursor += KEY_GAP;
        }

        const timers: ReturnType<typeof setTimeout>[] = [];
        for (const step of steps) {
            const id = setTimeout(() => {
                if (step.action === "down") setPressed(step.code);
                else setReleased(step.code);
            }, step.t);
            timers.push(id);
        }

        return () => {
            timers.forEach(clearTimeout);
        };
    }, [autoType, setPressed, setReleased]);

    return (
        <KeyboardContext.Provider
            value={{ pressedKeys, setPressed, setReleased, lastPressedKey }}
        >
            {children}
        </KeyboardContext.Provider>
    );
};

const KeystrokePreview = ({ typedText }: { typedText?: string }) => {
    const { lastPressedKey } = useKeyboardContext();
    const [displayKey, setDisplayKey] = useState<string | null>(null);
    const [animationKey, setAnimationKey] = useState(0);

    useEffect(() => {
        if (lastPressedKey) {
            if (
                lastPressedKey === "Space" ||
                lastPressedKey === "ShiftLeft" ||
                lastPressedKey === "ShiftRight"
            ) {
                setDisplayKey(null);
                return;
            }
            setDisplayKey(getKeyDisplayLabel(lastPressedKey));
            setAnimationKey((prev) => prev + 1);
        }
    }, [lastPressedKey]);

    return (
        <div className="relative flex h-10 w-full items-center justify-center mb-1">
            {typedText && (
                <p className="text-neutral-400 text-sm font-mono tracking-widest select-none">
                    {typedText}
                </p>
            )}
            <AnimatePresence mode="popLayout">
                {displayKey && (
                    <motion.div
                        key={animationKey}
                        layout
                        initial={{ opacity: 0, scale: 0.5, y: 5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: -5 }}
                        transition={{ type: "spring", stiffness: 500, damping: 30, mass: 0.5 }}
                        className="absolute right-4 flex items-center justify-center rounded-lg px-3 py-1 font-mono text-lg font-black text-neutral-300"
                    >
                        <motion.span
                            initial={{ opacity: 0, scale: 1.2, filter: "blur(8px)" }}
                            animate={{ opacity: 0.7, scale: 1, filter: "blur(0px)" }}
                            transition={{ duration: 0.05 }}
                        >
                            {displayKey}
                        </motion.span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export const Keyboard = ({
    className,
    autoType,
    typedText,
}: {
    className?: string;
    autoType?: string;
    typedText?: string;
}) => {
    const containerRef = useRef<HTMLDivElement>(null);

    return (
        <KeyboardProvider autoType={autoType} containerRef={containerRef}>
            <div
                ref={containerRef}
                className={cn(
                    "mx-auto w-fit [zoom:0.8] sm:[zoom:1.0] md:[zoom:1.2] lg:[zoom:1.4]",
                    className
                )}
            >
                <KeystrokePreview typedText={typedText} />
                <Keypad />
            </div>
        </KeyboardProvider>
    );
};

export const Keypad = () => {
    return (
        <div className="h-full w-fit rounded-xl bg-neutral-900 p-1 shadow-lg ring-1 shadow-black/40 ring-white/10">
            {/* Function Row */}
            <Row>
                <Key keyCode="Escape" containerClassName="rounded-tl-xl" className="w-10 rounded-tl-lg" childrenClassName="items-start justify-end pb-[2px] pl-[4px]">
                    <span>esc</span>
                </Key>
                <Key keyCode="F1"><IconBrightnessDown className="h-[6px] w-[6px]" /><span className="mt-1">F1</span></Key>
                <Key keyCode="F2"><IconBrightnessUp className="h-[6px] w-[6px]" /><span className="mt-1">F2</span></Key>
                <Key keyCode="F3"><IconTable className="h-[6px] w-[6px]" /><span className="mt-1">F3</span></Key>
                <Key keyCode="F4"><IconSearch className="h-[6px] w-[6px]" /><span className="mt-1">F4</span></Key>
                <Key keyCode="F5"><IconMicrophone className="h-[6px] w-[6px]" /><span className="mt-1">F5</span></Key>
                <Key keyCode="F6"><IconMoon className="h-[6px] w-[6px]" /><span className="mt-1">F6</span></Key>
                <Key keyCode="F7"><IconPlayerTrackPrev className="h-[6px] w-[6px]" /><span className="mt-1">F7</span></Key>
                <Key keyCode="F8"><IconPlayerSkipForward className="h-[6px] w-[6px]" /><span className="mt-1">F8</span></Key>
                <Key keyCode="F9"><IconPlayerTrackNext className="h-[6px] w-[6px]" /><span className="mt-1">F9</span></Key>
                <Key keyCode="F10"><IconVolume3 className="h-[6px] w-[6px]" /><span className="mt-1">F10</span></Key>
                <Key keyCode="F11"><IconVolume2 className="h-[6px] w-[6px]" /><span className="mt-1">F11</span></Key>
                <Key keyCode="F12"><IconVolume className="h-[6px] w-[6px]" /><span className="mt-1">F12</span></Key>
                <Key containerClassName="rounded-tr-xl" className="rounded-tr-lg">
                    <div className="h-4 w-4 rounded-full bg-gradient-to-b from-neutral-600 via-neutral-700 to-neutral-600 p-px">
                        <div className="h-full w-full rounded-full bg-neutral-800" />
                    </div>
                </Key>
            </Row>

            {/* Number Row */}
            <Row>
                <Key keyCode="Backquote"><span>~</span><span>`</span></Key>
                <Key keyCode="Digit1"><span>!</span><span>1</span></Key>
                <Key keyCode="Digit2"><span>@</span><span>2</span></Key>
                <Key keyCode="Digit3"><span>#</span><span>3</span></Key>
                <Key keyCode="Digit4"><span>$</span><span>4</span></Key>
                <Key keyCode="Digit5"><span>%</span><span>5</span></Key>
                <Key keyCode="Digit6"><span>^</span><span>6</span></Key>
                <Key keyCode="Digit7"><span>&</span><span>7</span></Key>
                <Key keyCode="Digit8"><span>*</span><span>8</span></Key>
                <Key keyCode="Digit9"><span>(</span><span>9</span></Key>
                <Key keyCode="Digit0"><span>)</span><span>0</span></Key>
                <Key keyCode="Minus"><span>—</span><span>_</span></Key>
                <Key keyCode="Equal"><span>+</span><span>=</span></Key>
                <Key keyCode="Backspace" className="w-10" childrenClassName="items-end justify-end pr-[4px] pb-[2px]">
                    <span>delete</span>
                </Key>
            </Row>

            {/* QWERTY Row */}
            <Row>
                <Key keyCode="Tab" className="w-10" childrenClassName="items-start justify-end pb-[2px] pl-[4px]">
                    <span>tab</span>
                </Key>
                {["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"].map((letter) => (
                    <Key key={letter} keyCode={`Key${letter}`}>{letter}</Key>
                ))}
                <Key keyCode="BracketLeft"><span>{`{`}</span><span>{`[`}</span></Key>
                <Key keyCode="BracketRight"><span>{`}`}</span><span>{`]`}</span></Key>
                <Key keyCode="Backslash"><span>{`|`}</span><span>{`\\`}</span></Key>
            </Row>

            {/* Home Row */}
            <Row>
                <Key keyCode="CapsLock" className="w-[2.8rem]" childrenClassName="items-start justify-end pb-[2px] pl-[4px]">
                    <span>caps lock</span>
                </Key>
                {["A", "S", "D", "F", "G", "H", "J", "K", "L"].map((letter) => (
                    <Key key={letter} keyCode={`Key${letter}`}>{letter}</Key>
                ))}
                <Key keyCode="Semicolon"><span>:</span><span>;</span></Key>
                <Key keyCode="Quote"><span>{`"`}</span><span>{`'`}</span></Key>
                <Key keyCode="Enter" className="w-[2.85rem]" childrenClassName="items-end justify-end pr-[4px] pb-[2px]">
                    <span>return</span>
                </Key>
            </Row>

            {/* Bottom Letter Row */}
            <Row>
                <Key keyCode="ShiftLeft" className="w-[3.65rem]" childrenClassName="items-start justify-end pb-[2px] pl-[4px]">
                    <span>shift</span>
                </Key>
                {["Z", "X", "C", "V", "B", "N", "M"].map((letter) => (
                    <Key key={letter} keyCode={`Key${letter}`}>{letter}</Key>
                ))}
                <Key keyCode="Comma"><span>{`<`}</span><span>,</span></Key>
                <Key keyCode="Period"><span>{`>`}</span><span>.</span></Key>
                <Key keyCode="Slash"><span>?</span><span>/</span></Key>
                <Key keyCode="ShiftRight" className="w-[3.65rem]" childrenClassName="items-end justify-end pr-[4px] pb-[2px]">
                    <span>shift</span>
                </Key>
            </Row>

            {/* Modifier Row */}
            <Row>
                <ModifierKey keyCode="Fn" containerClassName="rounded-bl-xl" className="rounded-bl-lg">
                    <span>fn</span><IconWorld className="h-[6px] w-[6px]" />
                </ModifierKey>
                <ModifierKey keyCode="ControlLeft">
                    <IconChevronUp className="h-[6px] w-[6px]" /><span>control</span>
                </ModifierKey>
                <ModifierKey keyCode="AltLeft">
                    <OptionKey className="h-[6px] w-[6px]" /><span>option</span>
                </ModifierKey>
                <ModifierKey keyCode="MetaLeft" className="w-8">
                    <IconCommand className="h-[6px] w-[6px]" /><span>command</span>
                </ModifierKey>
                <Key keyCode="Space" className="w-[8.2rem]" />
                <ModifierKey keyCode="MetaRight" className="w-8">
                    <IconCommand className="h-[6px] w-[6px]" /><span>command</span>
                </ModifierKey>
                <ModifierKey keyCode="AltRight">
                    <OptionKey className="h-[6px] w-[6px]" /><span>option</span>
                </ModifierKey>
                <div className="flex h-6 w-[4.9rem] items-center justify-end rounded-[4px] p-[0.5px]">
                    <Key keyCode="ArrowLeft" className="h-6 w-6">
                        <IconCaretLeftFilled className="h-[6px] w-[6px]" />
                    </Key>
                    <div className="flex flex-col">
                        <Key keyCode="ArrowUp" className="h-3 w-6">
                            <IconCaretUpFilled className="h-[6px] w-[6px]" />
                        </Key>
                        <Key keyCode="ArrowDown" className="h-3 w-6">
                            <IconCaretDownFilled className="h-[6px] w-[6px]" />
                        </Key>
                    </div>
                    <Key keyCode="ArrowRight" containerClassName="rounded-br-xl" className="h-6 w-6 rounded-br-lg">
                        <IconCaretRightFilled className="h-[6px] w-[6px]" />
                    </Key>
                </div>
            </Row>
        </div>
    );
};

const Row = ({ children }: { children: React.ReactNode }) => (
    <div className="mb-[2px] flex w-full shrink-0 gap-[2px]">{children}</div>
);

const Key = ({
    className,
    childrenClassName,
    containerClassName,
    children,
    keyCode,
}: {
    className?: string;
    childrenClassName?: string;
    containerClassName?: string;
    children?: React.ReactNode;
    keyCode?: string;
}) => {
    const { pressedKeys, setPressed, setReleased } = useKeyboardContext();
    const isPressed = keyCode ? pressedKeys.has(keyCode) : false;

    return (
        <div className={cn("rounded-[4px] p-[0.5px]", containerClassName)}>
            <button
                type="button"
                onMouseDown={() => { if (keyCode) setPressed(keyCode); }}
                onMouseUp={() => { if (keyCode && isPressed) setReleased(keyCode); }}
                onMouseLeave={() => { if (keyCode && isPressed) setReleased(keyCode); }}
                className={cn(
                    "flex h-6 w-6 cursor-pointer items-center justify-center rounded-[3.5px] bg-neutral-700 shadow-[0px_0px_1px_0px_rgba(0,0,0,0.8),0px_1px_1px_0px_rgba(0,0,0,0.4),0px_1px_0px_0px_rgba(255,255,255,0.08)_inset] transition-transform duration-75",
                    isPressed && "scale-[0.95] bg-neutral-600 shadow-[0px_0px_1px_0px_rgba(0,0,0,0.8),0px_0px_1px_0px_rgba(0,0,0,0.4)]",
                    className
                )}
            >
                <div className={cn("flex h-full w-full flex-col items-center justify-center text-[5px] text-neutral-300", childrenClassName)}>
                    {children}
                </div>
            </button>
        </div>
    );
};

const ModifierKey = ({
    className,
    containerClassName,
    children,
    keyCode,
}: {
    className?: string;
    containerClassName?: string;
    children?: React.ReactNode;
    keyCode?: string;
}) => {
    const { pressedKeys, setPressed, setReleased } = useKeyboardContext();
    const isPressed = keyCode ? pressedKeys.has(keyCode) : false;

    return (
        <div className={cn("rounded-[4px] p-[0.5px]", containerClassName)}>
            <button
                type="button"
                onMouseDown={() => { if (keyCode) setPressed(keyCode); }}
                onMouseUp={() => { if (keyCode && isPressed) setReleased(keyCode); }}
                onMouseLeave={() => { if (keyCode && isPressed) setReleased(keyCode); }}
                className={cn(
                    "flex h-6 w-6 cursor-pointer items-center justify-center rounded-[3.5px] bg-neutral-700 shadow-[0px_0px_1px_0px_rgba(0,0,0,0.8),0px_1px_1px_0px_rgba(0,0,0,0.4),0px_1px_0px_0px_rgba(255,255,255,0.08)_inset] transition-transform duration-75",
                    isPressed && "scale-[0.95] bg-neutral-600 shadow-[0px_0px_1px_0px_rgba(0,0,0,0.8),0px_0px_1px_0px_rgba(0,0,0,0.4)]",
                    className
                )}
            >
                <div className="flex h-full w-full flex-col items-start justify-between p-1 text-[5px] text-neutral-300">
                    {children}
                </div>
            </button>
        </div>
    );
};

const OptionKey = ({ className }: { className?: string }) => (
    <svg fill="none" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className={className}>
        <rect stroke="currentColor" strokeWidth={2} x="18" y="5" width="10" height="2" />
        <polygon stroke="currentColor" strokeWidth={2} points="10.6,5 4,5 4,7 9.4,7 18.4,27 28,27 28,25 19.6,25" />
    </svg>
);

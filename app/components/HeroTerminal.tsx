"use client";

import { useEffect, useState } from "react";

const PROMPT = "oncall-cto@macao:~$ ";
const COMMAND = "oncall-cto health-check --macao";

const OUTPUT: { text: string; className: string }[] = [
  {
    text: "[relief] stack · forms · Meta/Google/CAPI baseline … OK",
    className: "text-emerald-400/95",
  },
  {
    text: "[data] CRM · pipelines · server-side measurement … OK",
    className: "text-sky-400/95",
  },
  {
    text: "[ai] operational agents (leads + support + ops) … ready",
    className: "text-violet-400/95",
  },
];

function BlockCursor({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <span
      className="inline-block w-[0.55em] h-[1.15em] translate-y-[0.12em] align-[-0.15em] ml-px bg-emerald-400/90 animate-terminal-cursor"
      aria-hidden
    />
  );
}

export function HeroTerminal() {
  const [reduceMotion, setReduceMotion] = useState(false);
  const [phase, setPhase] = useState<"command" | "output" | "complete">("command");
  const [commandLength, setCommandLength] = useState(0);
  const [outputLineIndex, setOutputLineIndex] = useState(0);
  const [outputCharIndex, setOutputCharIndex] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = () => setReduceMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      setCommandLength(COMMAND.length);
      setOutputLineIndex(OUTPUT.length - 1);
      setOutputCharIndex(OUTPUT[OUTPUT.length - 1].text.length);
      setPhase("complete");
      return;
    }

    let cancelled = false;
    const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

    (async () => {
      setPhase("command");
      setCommandLength(0);
      setOutputLineIndex(0);
      setOutputCharIndex(0);

      for (let i = 1; i <= COMMAND.length && !cancelled; i++) {
        setCommandLength(i);
        await sleep(40);
      }
      if (cancelled) return;

      await sleep(380);
      if (cancelled) return;

      setPhase("output");

      for (let li = 0; li < OUTPUT.length && !cancelled; li++) {
        const line = OUTPUT[li].text;
        setOutputLineIndex(li);
        setOutputCharIndex(0);
        for (let c = 1; c <= line.length && !cancelled; c++) {
          setOutputCharIndex(c);
          await sleep(c === 1 ? 70 : 16);
        }
        if (cancelled) return;
        await sleep(140);
      }

      if (cancelled) return;
      setPhase("complete");
    })();

    return () => {
      cancelled = true;
    };
  }, [reduceMotion]);

  const showOutput = phase === "output" || phase === "complete";
  const lastIdx = OUTPUT.length - 1;

  const cursorOnCommand = phase === "command";

  const cursorOnOutputLine = (lineIdx: number) => {
    if (phase === "output" && lineIdx === outputLineIndex) return true;
    if (phase === "complete" && lineIdx === lastIdx) return true;
    return false;
  };

  return (
    <div
      className="mt-16 w-full max-w-3xl animate-fade-up delay-500 mx-auto"
      aria-hidden="true"
    >
      <div className="rounded-xl border border-gray-800 bg-[#0c0c0c] shadow-2xl overflow-hidden ring-1 ring-white/[0.06]">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-800 bg-[#141414]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
          </div>
          <div className="mx-auto text-[10px] text-gray-500 font-mono tracking-tight">
            zsh — oncall-cto@macao
          </div>
        </div>

        <div className="px-5 py-7 md:px-7 md:py-8 min-h-[220px] md:min-h-[260px] text-left font-mono text-xs md:text-sm leading-relaxed text-gray-300">
          <div className="whitespace-pre-wrap break-words">
            <span className="text-emerald-500/85">{PROMPT}</span>
            <span className="text-gray-100">{COMMAND.slice(0, commandLength)}</span>
            <BlockCursor visible={cursorOnCommand} />
          </div>

          {showOutput && (
            <div className="mt-5 space-y-2.5 border-t border-gray-800/80 pt-5">
              {OUTPUT.map((line, lineIdx) => {
                if (phase === "output" && lineIdx > outputLineIndex) return null;

                const full = line.text;
                let text = "";
                if (phase === "complete") text = full;
                else if (phase === "output") {
                  if (lineIdx < outputLineIndex) text = full;
                  else if (lineIdx === outputLineIndex) text = full.slice(0, outputCharIndex);
                }

                return (
                  <div key={lineIdx}>
                    <span className={line.className}>
                      {text}
                      <BlockCursor visible={cursorOnOutputLine(lineIdx)} />
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

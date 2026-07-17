"use client";

import { KeyboardEvent, useEffect, useRef, useState } from "react";

type Message = { role: "user" | "assistant"; content: string };

const welcome = "Welcome. I’m GRACE-X, the Truffle Fed AI concierge. Ask me about Kelly’s caviar, Pure Snail Mucin ritual, or private and trade enquiries.";
const suggestions = ["What is snail caviar?", "Why Helix Aspersa?", "Tell me about Pure Snail Mucin", "How do I make a trade enquiry?"];

export default function GraceXChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", content: welcome }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {\n    const marker = endRef.current;\n    const scroller = marker?.parentElement;\n    if (scroller) scroller.scrollTop = scroller.scrollHeight;\n  }, [messages, busy]);

  async function speak(text: string) {
    audioRef.current?.pause();
    setSpeaking(true);
    try {
      const response = await fetch("/api/voice", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text }) });
      if (!response.ok) throw new Error();
      const audio = new Audio(URL.createObjectURL(await response.blob()));
      audioRef.current = audio;
      audio.onended = () => setSpeaking(false);
      audio.onerror = () => setSpeaking(false);
      await audio.play();
    } catch { setSpeaking(false); }
  }

  async function ask(question: string) {
    const clean = question.trim();
    if (!clean || busy) return;
    const next: Message[] = [...messages, { role: "user", content: clean }];
    setMessages(next); setInput(""); setBusy(true);
    try {
      const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: next }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setMessages((current) => [...current, { role: "assistant", content: data.reply }]);
    } catch (error) {
      setMessages((current) => [...current, { role: "assistant", content: error instanceof Error ? error.message : "I’m unavailable just now. Please use the private enquiry form." }]);
    } finally { setBusy(false); }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      event.stopPropagation();
      void ask(input);
    }
  }

  return <>
    <button className="grace-launcher" type="button" onClick={() => setOpen(true)} aria-label="Open GRACE-X AI concierge">
      <span className="grace-orb">GX</span><span><strong>ASK GRACE-X</strong><small>AI CONCIERGE</small></span>
    </button>
    {open && <section className="grace-panel" aria-label="GRACE-X AI concierge">
      <header className="grace-header">
        <span className="grace-orb">GX</span><div><strong>GRACE-X <i>AI</i></strong><small><b /> TRUFFLE FED CONCIERGE</small></div>
        <button type="button" onClick={() => setOpen(false)} aria-label="Close GRACE-X">×</button>
      </header>
      <div className="grace-messages" aria-live="polite">
        {messages.map((message, index) => <div className={`grace-message ${message.role}`} key={index}>
          <p>{message.content}</p>
          {message.role === "assistant" && <button className="grace-speak" type="button" onClick={() => void speak(message.content)} aria-label="Listen to this answer">{speaking ? "◼" : "▶"} Listen</button>}
        </div>)}
        {messages.length === 1 && <div className="grace-suggestions">{suggestions.map((item) => <button type="button" onClick={() => void ask(item)} key={item}>{item}</button>)}</div>}
        {busy && <div className="grace-typing"><i /><i /><i /></div>}
        <div ref={endRef} />
      </div>
      <div className="grace-input" role="group" aria-label="Ask GRACE-X"><input value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={handleKeyDown} maxLength={1600} placeholder="Ask GRACE-X…" aria-label="Your question" /><button type="button" onClick={() => void ask(input)} disabled={busy || !input.trim()} aria-label="Send question">↑</button></div>
      <p className="grace-disclosure">AI voice and answers may make mistakes. Verify important product information.</p>
    </section>}
  </>;
}

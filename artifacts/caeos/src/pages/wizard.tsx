import { useState, useRef, useEffect } from "react";
import { ChevronRight, ChevronLeft, Send, Loader2, RotateCcw, Brain, Shield } from "lucide-react";
import { useLocale } from "@/context/LocaleContext";
import { Link } from "wouter";

type Phase = "describe" | "chat" | "done";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? "";

async function createSession(description: string): Promise<number> {
  const res = await fetch(`${BASE}/api/wizard/sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ projectDescription: description }),
  });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return data.id as number;
}

async function* streamMessage(
  sessionId: number,
  content: string
): AsyncGenerator<string> {
  const res = await fetch(`${BASE}/api/wizard/sessions/${sessionId}/messages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) throw new Error(await res.text());
  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    const lines = buf.split("\n");
    buf = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const json = line.slice(6);
      try {
        const evt = JSON.parse(json);
        if (evt.done) return;
        if (evt.content) yield evt.content as string;
      } catch {
        // skip malformed
      }
    }
  }
}

async function loadSession(sessionId: number): Promise<Message[]> {
  const res = await fetch(`${BASE}/api/wizard/sessions/${sessionId}`);
  if (!res.ok) return [];
  const data = await res.json();
  return (data.messages ?? []) as Message[];
}

function MarkdownText({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <div className="space-y-2">
      {lines.map((line, i) => {
        if (line.startsWith("**") && line.endsWith("**")) {
          return (
            <p key={i} className="font-semibold text-white">
              {line.slice(2, -2)}
            </p>
          );
        }
        if (line.startsWith("- **")) {
          const rest = line.slice(4);
          const end = rest.indexOf("**");
          const bold = rest.slice(0, end);
          const tail = rest.slice(end + 2);
          return (
            <p key={i} className="flex gap-2 items-start">
              <span className="text-[#0ea5e9] mt-0.5">•</span>
              <span>
                <strong className="text-[#0ea5e9]">{bold}</strong>
                <span className="text-slate-300">{tail}</span>
              </span>
            </p>
          );
        }
        if (line.startsWith("- ") || line.startsWith("* ")) {
          return (
            <p key={i} className="flex gap-2 items-start text-slate-300">
              <span className="text-[#0ea5e9] mt-0.5">•</span>
              <span>{line.slice(2)}</span>
            </p>
          );
        }
        if (line.match(/^[A-Z\u0600-\u06FF].*:$/)) {
          return (
            <p key={i} className="font-semibold text-white mt-3">
              {line}
            </p>
          );
        }
        if (!line.trim()) return <div key={i} className="h-1" />;
        return (
          <p key={i} className="text-slate-300 leading-relaxed">
            {line}
          </p>
        );
      })}
    </div>
  );
}

export default function WizardPage() {
  const { locale, dir } = useLocale();
  const isAr = locale === "ar";

  const [phase, setPhase] = useState<Phase>("describe");
  const [description, setDescription] = useState("");
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleStart() {
    if (!description.trim()) return;
    setStarting(true);
    setError(null);
    try {
      const id = await createSession(description);
      setSessionId(id);

      // Load the saved user message then stream the first AI response
      const initial = await loadSession(id);
      setMessages(initial.filter((m) => m.role === "user"));
      setPhase("chat");
      setStreaming(true);

      let aiText = "";
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      for await (const chunk of streamMessage(id, description)) {
        aiText += chunk;
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: aiText };
          return updated;
        });
      }
      setStreaming(false);
    } catch (e) {
      setError(String(e));
      setStarting(false);
      setStreaming(false);
    }
    setStarting(false);
  }

  async function handleSend() {
    if (!input.trim() || streaming || sessionId === null) return;
    const userContent = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userContent }]);
    setStreaming(true);
    setError(null);

    try {
      let aiText = "";
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      for await (const chunk of streamMessage(sessionId, userContent)) {
        aiText += chunk;
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: aiText };
          return updated;
        });
      }
    } catch (e) {
      setError(String(e));
    }
    setStreaming(false);
    inputRef.current?.focus();
  }

  function handleReset() {
    setPhase("describe");
    setDescription("");
    setSessionId(null);
    setMessages([]);
    setInput("");
    setError(null);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  if (phase === "describe") {
    return (
      <div
        className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white"
        dir={dir}
      >
        <div className="container mx-auto max-w-2xl px-6 py-16">
          <div className="text-center mb-10 animate-fade-in">
            <div className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#2563eb]/20 border border-[#2563eb]/30">
              <Brain className="h-8 w-8 text-[#0ea5e9]" />
            </div>
            <h1 className="text-3xl font-bold mb-2">
              {isAr ? "معالج CAEOS — الاستجواب العميق" : "CAEOS Wizard — Deep Interrogation"}
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              {isAr
                ? "صِف مشروعك وسيقوم CAEOS بتحليله دستورياً وطرح الأسئلة الصحيحة قبل أي كود."
                : "Describe your project and CAEOS will constitutionally analyze it, asking the right questions before any code is written."}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-8 space-y-6 animate-slide-up">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                {isAr ? "صِف مشروعك بحرية — ما هي فكرته؟ ما المشكلة التي يحلها؟" : "Describe your project freely — what is it? what problem does it solve?"}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={
                  isAr
                    ? "مثال: أريد بناء منصة لإدارة المهام للفرق المطورة، تتكامل مع GitHub وتعرض تقارير الأداء..."
                    : "Example: I want to build a task management platform for dev teams, integrated with GitHub and showing performance reports..."
                }
                rows={6}
                dir={dir}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 focus:border-[#2563eb] focus:outline-none focus:ring-1 focus:ring-[#2563eb] resize-none transition-all"
              />
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg p-3">
                {error}
              </p>
            )}

            <button
              onClick={handleStart}
              disabled={!description.trim() || starting}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-[#2563eb] px-8 py-4 font-semibold text-white transition-all hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {starting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {isAr ? "CAEOS يحلل مشروعك…" : "CAEOS is analyzing your project…"}
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4" />
                  {isAr ? "ابدأ الاستجواب الدستوري" : "Start Constitutional Interrogation"}
                  <ChevronRight className={`h-4 w-4 ${dir === "rtl" ? "rotate-180" : ""}`} />
                </>
              )}
            </button>

            <p className="text-xs text-center text-slate-500">
              {isAr
                ? "القانون الأول: ممنوع كتابة كود قبل تحليل النوايا"
                : "Law #1: No Code Before Reasoning — intent analysis comes first"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white"
      dir={dir}
    >
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-white/10 bg-slate-900/80 backdrop-blur-sm px-4 py-3">
        <div className={`container mx-auto max-w-3xl flex items-center justify-between ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
          <div className={`flex items-center gap-3 ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
            <div className="h-2 w-2 rounded-full bg-[#10b981] animate-pulse" />
            <span className="text-sm font-medium text-slate-300">
              {isAr ? "CAEOS — الاستجواب العميق نشط" : "CAEOS — Deep Interrogation Active"}
            </span>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            {isAr ? "مشروع جديد" : "New Project"}
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto max-w-3xl px-4 py-6 space-y-6">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 ${msg.role === "user" ? (dir === "rtl" ? "flex-row-reverse" : "flex-row-reverse") : ""}`}
            >
              {msg.role === "assistant" && (
                <div className="flex-shrink-0 mt-1 h-7 w-7 rounded-full bg-[#2563eb]/20 border border-[#2563eb]/40 flex items-center justify-center">
                  <Shield className="h-3.5 w-3.5 text-[#0ea5e9]" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[#2563eb] text-white rounded-tr-sm ml-auto"
                    : "bg-white/5 border border-white/10 rounded-tl-sm"
                }`}
                dir={dir}
              >
                {msg.role === "assistant" ? (
                  <MarkdownText text={msg.content} />
                ) : (
                  <p>{msg.content}</p>
                )}
                {msg.role === "assistant" && msg.content === "" && streaming && (
                  <span className="inline-flex gap-1 items-center text-slate-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#0ea5e9] animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-[#0ea5e9] animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="h-1.5 w-1.5 rounded-full bg-[#0ea5e9] animate-bounce" style={{ animationDelay: "300ms" }} />
                  </span>
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="sticky bottom-0 border-t border-white/10 bg-slate-900/80 backdrop-blur-sm px-4 py-3">
        <div className="container mx-auto max-w-3xl">
          {error && (
            <p className="text-xs text-red-400 mb-2">{error}</p>
          )}
          <div className={`flex gap-2 items-end ${dir === "rtl" ? "flex-row-reverse" : ""}`}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isAr ? "اكتب ردك هنا… (Enter للإرسال)" : "Type your answer here… (Enter to send)"}
              rows={2}
              dir={dir}
              disabled={streaming}
              className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-[#2563eb] focus:outline-none focus:ring-1 focus:ring-[#2563eb] resize-none transition-all disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || streaming}
              className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-[#2563eb] text-white transition-all hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {streaming ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className={`h-4 w-4 ${dir === "rtl" ? "rotate-180" : ""}`} />
              )}
            </button>
          </div>
          <p className="mt-2 text-xs text-center text-slate-600">
            {isAr
              ? "القانون العاشر: السيادة البشرية فوق كل شيء — قراراتك هي قراراتك"
              : "Law #10: Human Sovereignty — your decisions, your architecture"}
          </p>
        </div>
      </div>
    </div>
  );
}

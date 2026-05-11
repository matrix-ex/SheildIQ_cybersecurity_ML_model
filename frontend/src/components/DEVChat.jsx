import { useEffect, useMemo, useRef, useState } from "react";
import { Bot, Send, Loader2, ChevronUp, ChevronDown } from "lucide-react";
import { chatWithAgent } from "../api/agent";

const STORAGE_KEY = "vaulto_aria_messages";
const MAX_MESSAGES = 10;

const QUICK_QUESTIONS = [
  "What is DDoS?",
  "Explain Botnet",
  "Current threats",
  "How safe am I?",
];

function createDefaultMessage() {
  return {
    role: "assistant",
    content:
      "Hello! I'm DEV, your cybersecurity assistant. Ask me about any attack type, threat, or security recommendation.",
    createdAt: Date.now(),
  };
}

function normalizeForApi(messages) {
  return messages.slice(-MAX_MESSAGES).map((message) => ({
    role: message.role,
    content: message.content,
  }));
}

export default function DEVChat({ embedded = false }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([createDefaultMessage()]);
  const streamTimerRef = useRef(null);
  const listRef = useRef(null);

  const canSend = input.trim().length > 0 && !typing;

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed.slice(-MAX_MESSAGES));
          return;
        }
      }
    } catch {
      // Ignore bad session payload.
    }

    setMessages([createDefaultMessage()]);
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-MAX_MESSAGES)));
    } catch {
      // Ignore storage errors.
    }
  }, [messages]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, typing, open]);

  useEffect(() => {
    return () => {
      if (streamTimerRef.current) {
        clearInterval(streamTimerRef.current);
      }
    };
  }, []);

  const conversationHistory = useMemo(
    () => normalizeForApi(messages).slice(-MAX_MESSAGES),
    [messages]
  );

  const appendStreamedAssistantMessage = (fullText) => {
    const targetText = (fullText || "No response from DEV.").trim();
    const assistantMessage = { role: "assistant", content: "", createdAt: Date.now() };

    setMessages((prev) => [...prev.slice(-MAX_MESSAGES + 1), assistantMessage]);

    let index = 0;
    streamTimerRef.current = setInterval(() => {
      index += 2;
      const nextContent = targetText.slice(0, index);

      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = {
          ...next[next.length - 1],
          content: nextContent,
        };
        return next.slice(-MAX_MESSAGES);
      });

      if (index >= targetText.length) {
        clearInterval(streamTimerRef.current);
        streamTimerRef.current = null;
        setTyping(false);
      }
    }, 16);
  };

  const sendMessage = async (nextMessage) => {
    const content = (nextMessage ?? input).trim();
    if (!content || typing) {
      return;
    }

    if (streamTimerRef.current) {
      clearInterval(streamTimerRef.current);
      streamTimerRef.current = null;
    }

    const userMessage = {
      role: "user",
      content,
      createdAt: Date.now(),
    };

    const nextMessages = [...messages.slice(-MAX_MESSAGES + 1), userMessage];
    setMessages(nextMessages);
    setInput("");
    setTyping(true);

    try {
      const response = await chatWithAgent({
        message: content,
        conversation_history: conversationHistory,
      });
      appendStreamedAssistantMessage(response.data?.response || "I could not generate a response right now.");
    } catch (err) {
      appendStreamedAssistantMessage(
        err.response?.data?.details?.error ||
          "I am currently unavailable. Please try again in a few seconds."
      );
    }
  };

  const panel = (
    <div className="surface-card w-full max-w-md overflow-hidden border border-slate-200 shadow-xl">
      <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white">
              <Bot size={16} />
            </span>
            <div>
              <p className="text-sm font-bold text-slate-900">DEV • AI Security Assistant</p>
              <p className="text-xs text-slate-500">Powered by VAULTO Intelligence</p>
            </div>
          </div>
          <button
            type="button"
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-200"
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Toggle DEV chat"
          >
            {open ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="bg-white">
          <div ref={listRef} className="max-h-[500px] min-h-[260px] space-y-2 overflow-y-auto px-4 py-3">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${message.createdAt}-${index}`}
                className={`rounded-xl px-3 py-2.5 text-sm ${
                  message.role === "assistant"
                    ? "bg-slate-100 text-slate-700"
                    : "ml-8 bg-slate-900 text-white"
                }`}
              >
                {message.role === "assistant" ? "DEV: " : "You: "}
                {message.content}
              </div>
            ))}

            {typing && (
              <div className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-600">
                <Loader2 size={14} className="animate-spin" />
                DEV is typing...
              </div>
            )}
          </div>

          <div className="border-t border-slate-200 px-4 py-3">
            <div className="mb-2 flex flex-wrap gap-2">
              {QUICK_QUESTIONS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => sendMessage(item)}
                  disabled={typing}
                  className="rounded-full border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                className="app-input"
                placeholder="Type your question..."
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    sendMessage();
                  }
                }}
              />
              <button
                type="button"
                className="btn-primary h-[42px] px-3 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => sendMessage()}
                disabled={!canSend}
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (embedded) {
    return (
      <section className="surface-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="section-title">Ask DEV</p>
            <h3 className="text-lg font-bold text-slate-900">AI Security Assistant</h3>
          </div>
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="btn-secondary"
          >
            {open ? "Collapse" : "Expand"}
          </button>
        </div>
        {panel}
      </section>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!open && (
        <button
          type="button"
          className="btn-primary rounded-full px-4 py-3 shadow-lg"
          onClick={() => setOpen(true)}
        >
          🤖 Ask DEV
        </button>
      )}
      {open && panel}
    </div>
  );
}

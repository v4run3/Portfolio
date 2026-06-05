import { useEffect, useRef, useState } from 'react';
import { FaArrowUp } from 'react-icons/fa6';
import { apiUrl } from '../config';

const SUGGESTIONS = [
  'What is Varun working on?',
  'What are his strongest skills?',
  'Tell me about qwen3.5-from-scratch',
  'Is he open to freelance?',
];

const AiChat = ({ variant = 'section', autoFocus = false }) => {
  const [messages, setMessages] = useState([]); // { role: 'user'|'assistant', content }
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const typerRef = useRef(null);

  useEffect(() => {
    if (autoFocus) {
      const t = setTimeout(() => inputRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
  }, [autoFocus]);

  // keep the transcript pinned to the bottom while text streams in
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [messages]);

  // stop the typewriter if the component unmounts mid-stream
  useEffect(() => () => { if (typerRef.current) clearInterval(typerRef.current); }, []);

  const ask = async (q) => {
    const question = (q ?? input).trim();
    if (!question || busy) return;
    setInput('');
    setError(null);

    const history = [...messages, { role: 'user', content: question }];
    setMessages([...history, { role: 'assistant', content: '' }]);
    setBusy(true);

    let target = '';        // full text received from the stream so far
    let shown = 0;          // chars currently revealed on screen
    let networkDone = false;
    let failed = false;

    const finish = () => {
      setBusy(false);
      inputRef.current?.focus();
    };

    // Typewriter: drains `target` into the visible message a few chars per tick,
    // decoupled from network arrival so words appear one-by-one, terminal-style.
    typerRef.current = setInterval(() => {
      if (shown < target.length) {
        const backlog = target.length - shown;
        shown += Math.max(1, Math.ceil(backlog / 50)); // speed up if network raced ahead
        const text = target.slice(0, shown);
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: 'assistant', content: text };
          return copy;
        });
      } else if (networkDone) {
        clearInterval(typerRef.current);
        typerRef.current = null;
        if (!failed && !target.trim()) {
          setMessages((prev) => {
            const copy = [...prev];
            copy[copy.length - 1] = { role: 'assistant', content: '(no response — try again)' };
            return copy;
          });
        }
        finish();
      }
    }, 18);

    try {
      const res = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });
      if (!res.ok) {
        if (res.status === 429) {
          throw new Error('too many messages — please wait a minute before asking again');
        }
        let detail = '';
        try { detail = (await res.json())?.message ?? ''; } catch { /* ignore */ }
        throw new Error(detail || `request failed (${res.status})`);
      }
      if (!res.body) throw new Error('no response stream');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';
        for (const line of lines) {
          const t = line.trim();
          if (!t.startsWith('data:')) continue;
          const data = t.slice(5).trim();
          if (data === '[DONE]') continue;
          try {
            const j = JSON.parse(data);
            if (j.response) target += j.response; // feed the typewriter buffer
          } catch {
            /* ignore partial chunks */
          }
        }
      }
      networkDone = true;
    } catch (err) {
      failed = true;
      networkDone = true;
      if (typerRef.current) { clearInterval(typerRef.current); typerRef.current = null; }
      setError(err.message ?? 'request failed');
      setMessages((prev) => prev.slice(0, -1)); // drop the empty assistant bubble
      finish();
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    ask();
  };

  const heightClass = variant === 'modal' ? 'h-[320px]' : 'h-[440px]';

  const chrome = (
    <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-surface2 shrink-0">
      <div className="flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full bg-[#3a3a3a]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#3a3a3a]" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#3a3a3a]" />
      </div>
      <span className="text-[11px] text-white/40">ask-varun · llama-3.1</span>
      <span className="inline-flex items-center gap-1.5 text-[10px] text-accent">
        <span className="w-1.5 h-1.5 rounded-full bg-accent pulse-dot" />
        live
      </span>
    </div>
  );

  const body = (
    <>
      {/* transcript */}
      <div ref={scrollRef} className={`${heightClass} overflow-y-auto scrollbar-hide p-4 space-y-4 text-[13px] leading-relaxed`}>
        {messages.length === 0 ? (
          <div className="space-y-4">
            <div className="text-white/60">
              <span className="text-accent">$</span> ask me anything about Varun — his projects,
              skills, or background.
            </div>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => ask(s)}
                  className="px-2.5 py-1 text-[12px] border border-border bg-bg text-white/70 hover:border-accent/50 hover:text-white transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m, i) => {
            const isUser = m.role === 'user';
            const isLast = i === messages.length - 1;
            return (
              <div key={i} className="flex flex-col gap-1">
                <div className="flex items-baseline gap-2">
                  <span className={isUser ? 'text-accent' : 'text-white/40'}>
                    {isUser ? '>' : '#'}
                  </span>
                  <span className="text-[10px] tracking-wider text-white/30 uppercase">
                    {isUser ? 'you' : 'ask-varun'}
                  </span>
                </div>
                <div className={`pl-4 ${isUser ? 'text-white/85' : 'text-white/70'}`}>
                  {m.content}
                  {!isUser && isLast && busy && <span className="cursor-blink" />}
                </div>
              </div>
            );
          })
        )}
        {error && (
          <div className="text-red-400 text-[12px]">! {error}</div>
        )}
      </div>

      {/* input */}
      <form onSubmit={onSubmit} className="flex items-center gap-2 px-3 py-3 border-t border-border bg-surface2/40 shrink-0">
        <span className="text-accent text-sm select-none">{'>'}</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={busy ? 'thinking…' : 'type your question…'}
          disabled={busy}
          className="flex-1 bg-transparent text-[13px] text-white placeholder:text-white/30 focus:outline-none disabled:opacity-60"
          spellCheck={false}
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          aria-label="send"
          className="w-7 h-7 flex items-center justify-center border border-border text-white/60 hover:border-accent/50 hover:text-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <FaArrowUp size={11} />
        </button>
      </form>
    </>
  );

  // In the command palette the surrounding modal provides the frame/header,
  // so render bare. In the section, render the full standalone terminal.
  if (variant === 'modal') {
    return <div className="flex flex-col">{body}</div>;
  }

  return (
    <div className="flex flex-col card overflow-hidden">
      {chrome}
      {body}
    </div>
  );
};

export default AiChat;

import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import {
  AudioLines,
  Bot,
  Check,
  ChevronRight,
  CircleHelp,
  Code2,
  Copy,
  FileCode2,
  FileText,
  Globe2,
  Image as ImageIcon,
  LayoutDashboard,
  LockKeyhole,
  LogOut,
  Menu,
  MessageSquare,
  Mic,
  MoreHorizontal,
  Paperclip,
  Plus,
  Search,
  Send,
  Settings2,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
  UserRound,
  WandSparkles,
  X,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type View =
  | "home"
  | "chat"
  | "image"
  | "documents"
  | "code"
  | "voice"
  | "history"
  | "settings";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const navPrimary: { id: View; label: string; icon: typeof Sparkles }[] = [
  { id: "home", label: "Overview", icon: LayoutDashboard },
  { id: "chat", label: "AI Chat", icon: MessageSquare },
  { id: "image", label: "Image Studio", icon: ImageIcon },
  { id: "documents", label: "Document AI", icon: FileText },
];

const navSecondary: { id: View; label: string; icon: typeof Sparkles }[] = [
  { id: "code", label: "Code Assistant", icon: Code2 },
  { id: "voice", label: "Voice Assistant", icon: AudioLines },
  { id: "history", label: "History", icon: MoreHorizontal },
  { id: "settings", label: "Settings", icon: Settings2 },
];

const recentConversations = [
  { title: "Positioning ideas for a calmer workspace", date: "Today · 09:42", icon: WandSparkles },
  { title: "Refactor the onboarding flow", date: "Yesterday · 16:18", icon: Code2 },
  { title: "Notes from the Q4 planning brief", date: "Oct 24 · 11:07", icon: FileText },
];

const suggestions = [
  { label: "Write something creative", icon: WandSparkles, prompt: "Write a short, evocative opening for a story about a city that only appears at dawn." },
  { label: "Explain a complex topic", icon: Zap, prompt: "Explain how neural networks learn, using a simple analogy and one practical example." },
  { label: "Help me write code", icon: FileCode2, prompt: "Help me design a clean TypeScript function that groups an array of records by a nested key." },
  { label: "Summarize a document", icon: FileText, prompt: "Give me a concise executive-summary template for a long business document." },
  { label: "Generate an image", icon: ImageIcon, prompt: "Create a cinematic visual concept for a quiet, futuristic library above the clouds." },
  { label: "Brainstorm new ideas", icon: Sparkles, prompt: "Brainstorm five thoughtful ways a small team could make their weekly planning more energizing." },
];

const styles = ["Photorealistic", "Cinematic", "3D Render", "Anime", "Digital Art", "Fantasy", "Minimalist", "Futuristic"];
const ratios = ["1:1", "16:9", "4:3", "9:16"];
const languages = ["TypeScript", "Python", "JavaScript", "SQL", "Go", "Rust"];

function NovaBrand() {
  return (
    <div className="nova-brand">
      <div className="nova-mark" aria-hidden="true" />
      <div className="nova-wordmark">
        <strong>Nova AI</strong>
        <span>One AI. Infinite possibilities.</span>
      </div>
    </div>
  );
}

function Orb({ small = false }: { small?: boolean }) {
  return (
    <div className="hero-orb-wrap" style={small ? { minHeight: 90 } : undefined}>
      <div className="orb-halo" style={small ? { width: 130, height: 130 } : undefined} />
      <div className="ai-orb" style={small ? { width: 66, height: 66 } : undefined}>
        <Sparkles size={small ? 21 : 29} strokeWidth={1.5} />
      </div>
    </div>
  );
}

function Composer({
  value,
  onChange,
  onSubmit,
  busy,
  placeholder = "Ask Nova anything...",
  onVoice,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  busy?: boolean;
  placeholder?: string;
  onVoice?: () => void;
}) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="composer">
      <textarea
        value={value}
        onChange={event => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-label="Message Nova AI"
        rows={2}
      />
      <div className="composer-footer">
        <div className="composer-tools">
          <button type="button" aria-label="Attach a file" onClick={() => toast.info("Attachments are ready for the Document AI upload flow.")}>
            <Paperclip size={16} />
          </button>
          <button type="button" aria-label="Use voice input" onClick={onVoice}>
            <Mic size={16} />
          </button>
          <span className="eyebrow" style={{ marginLeft: 7, letterSpacing: ".09em" }}>Shift + Enter for a new line</span>
        </div>
        <button className="send-button" type="button" onClick={onSubmit} disabled={busy || !value.trim()} aria-label="Send message">
          {busy ? <span className="typing"><i /><i /><i /></span> : <Send size={15} />}
        </button>
      </div>
    </div>
  );
}

function RichAssistantContent({ content }: { content: string }) {
  const blocks: { kind: "text" | "code"; value: string }[] = [];
  let codeMode = false;
  let codeBuffer: string[] = [];
  let textBuffer: string[] = [];

  const flushText = () => {
    if (textBuffer.length) {
      blocks.push({ kind: "text", value: textBuffer.join("\n") });
      textBuffer = [];
    }
  };
  const flushCode = () => {
    blocks.push({ kind: "code", value: codeBuffer.join("\n") });
    codeBuffer = [];
  };

  content.split("\n").forEach(line => {
    if (line.trim().startsWith("```")) {
      if (codeMode) {
        flushCode();
        codeMode = false;
      } else {
        flushText();
        codeMode = true;
      }
      return;
    }
    if (codeMode) codeBuffer.push(line);
    else textBuffer.push(line);
  });
  if (codeMode) flushCode();
  flushText();

  return (
    <>
      {blocks.map((block, index) =>
        block.kind === "code" ? (
          <pre className="code-block" key={index}><code>{block.value}</code></pre>
        ) : (
          <div key={index}>
            {block.value.split("\n").map((line, lineIndex) => {
              const trimmed = line.trim();
              if (!trimmed) return <div key={lineIndex} style={{ height: 7 }} />;
              if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
                return <div key={lineIndex} style={{ paddingLeft: 12 }}>• {trimmed.slice(2)}</div>;
              }
              if (trimmed.startsWith("#")) {
                return <strong key={lineIndex} style={{ display: "block", margin: "5px 0" }}>{trimmed.replace(/^#+\s*/, "")}</strong>;
              }
              return <p key={lineIndex}>{line}</p>;
            })}
          </div>
        ),
      )}
    </>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard?.writeText(message.content);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div className={`message ${message.role}`}>
      <div className="message-avatar" aria-hidden="true">
        {message.role === "assistant" ? <Sparkles size={15} /> : <UserRound size={14} />}
      </div>
      <div className="message-body">
        <div className="message-meta">
          <span>{message.role === "assistant" ? "Nova" : "You"}</span>
          {message.role === "assistant" && (
            <button className="inline-link" type="button" onClick={copy}>{copied ? "Copied" : "Copy"}</button>
          )}
        </div>
        <div className="message-bubble">
          {message.role === "assistant" ? <RichAssistantContent content={message.content} /> : <p>{message.content}</p>}
        </div>
      </div>
    </div>
  );
}

function WorkspaceHeader({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="workspace-header">
      <div>
        <div className="eyebrow">Nova workspace</div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action && <div className="workspace-actions">{action}</div>}
    </div>
  );
}

function CapabilityEmpty({ icon: Icon, title, description, label = "Setup required" }: { icon: typeof Sparkles; title: string; description: string; label?: string }) {
  return (
    <div className="empty-tool">
      <div>
        <div className="empty-icon"><Icon size={20} /></div>
        <span className="status-chip"><span className="status-dot" />{label}</span>
        <h3 style={{ marginTop: 13 }}>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

function HomeDashboard({ onNavigate, draft, setDraft, onSend, busy, onVoice, displayName }: { onNavigate: (view: View) => void; draft: string; setDraft: (value: string) => void; onSend: () => void; busy: boolean; onVoice: () => void; displayName: string }) {
  return (
    <div className="page-wrap">
      <section className="dashboard-hero">
        <div className="hero-copy">
          <div className="eyebrow">Good to see you, {displayName} · Your creative command center</div>
          <h1>What can I help you <span>create today?</span></h1>
          <p>Ask anything. Create anything. Explore everything. Nova brings your thinking, writing, code, and ideas into one calm workspace.</p>
          <Composer value={draft} onChange={setDraft} onSubmit={onSend} busy={busy} onVoice={onVoice} />
        </div>
        <Orb />
      </section>

      <section className="feature-grid" aria-label="Nova capabilities">
        {[
          { id: "chat" as View, icon: MessageSquare, title: "AI Chat", text: "Think out loud with Nova." },
          { id: "image" as View, icon: ImageIcon, title: "Image Studio", text: "Shape a visual direction." },
          { id: "documents" as View, icon: FileText, title: "Document AI", text: "Find signal in your files." },
          { id: "code" as View, icon: Code2, title: "Code Assistant", text: "Build with more momentum." },
        ].map(feature => (
          <button className="feature-card" key={feature.id} type="button" onClick={() => onNavigate(feature.id)}>
            <span className="feature-icon"><feature.icon size={16} /></span>
            <strong>{feature.title}</strong>
            <span>{feature.text}</span>
          </button>
        ))}
      </section>

      <div className="dashboard-grid">
        <section className="section-card">
          <div className="section-heading">
            <div><div className="eyebrow">Continue where you left off</div><h2>Recent conversations</h2><p>Guest session · conversations stay on this device for now</p></div>
            <button className="inline-link" type="button" onClick={() => onNavigate("history")}>View history <ChevronRight size={13} style={{ verticalAlign: "-2px" }} /></button>
          </div>
          <div className="conversation-list">
            {recentConversations.map(conversation => (
              <button className="conversation-row" key={conversation.title} type="button" onClick={() => onNavigate("chat")}>
                <conversation.icon size={16} className="conversation-icon" />
                <span className="conversation-copy"><strong>{conversation.title}</strong><span>{conversation.date}</span></span>
                <ChevronRight size={15} color="#596681" />
              </button>
            ))}
          </div>
        </section>

        <section className="section-card">
          <div className="section-heading"><div><div className="eyebrow">Start with a direction</div><h2>Suggested prompts</h2></div></div>
          <div className="suggestion-list">
            {suggestions.slice(0, 4).map(suggestion => (
              <button className="suggestion-card" type="button" key={suggestion.label} onClick={() => { setDraft(suggestion.prompt); onNavigate("chat"); }}>
                <suggestion.icon size={16} /><strong>{suggestion.label}</strong>
              </button>
            ))}
          </div>
        </section>
      </div>

      <div className="section-heading" style={{ margin: "30px 0 0" }}>
        <div><div className="eyebrow">A workspace that follows your flow</div><h2>Explore Nova</h2></div>
        <span className="status-chip"><span className="status-dot" />Workspace ready</span>
      </div>
    </div>
  );
}

function ChatWorkspace({ messages, draft, setDraft, onSend, busy, onNew, onVoice, failedPrompt, onRetry }: { messages: ChatMessage[]; draft: string; setDraft: (value: string) => void; onSend: () => void; busy: boolean; onNew: () => void; onVoice: () => void; failedPrompt: string | null; onRetry: () => void }) {
  return (
    <div className="page-wrap">
      <WorkspaceHeader
        title="AI Chat"
        description="A focused space for ideas, answers, drafts, and decisions. Nova responds through the secure server-side AI service when it is configured."
        action={<><button className="secondary-button" type="button" onClick={onNew}><Plus size={14} /> New thread</button><button className="icon-button" type="button" aria-label="Chat help" onClick={() => toast.info("Nova supports Markdown, code blocks, multiline prompts, and copyable responses.")}><CircleHelp size={16} /></button></>}
      />
      <div className="workspace-grid">
        <section className="workspace-panel chat-panel">
          {messages.length === 0 ? (
            <div className="chat-empty"><div><Orb small /><h2>Start a new thread</h2><p>Bring a question, a rough thought, or a blank page. Nova will help you find the next useful step.</p></div></div>
          ) : (
            <div className="chat-messages">
              {messages.map((message, index) => <MessageBubble message={message} key={`${message.role}-${index}`} />)}
              {busy && <div className="message"><div className="message-avatar"><Sparkles size={15} /></div><div className="message-body"><div className="message-meta"><span>Nova</span><span>Thinking</span></div><div className="message-bubble"><span className="typing"><i /><i /><i /></span></div></div></div>}
            </div>
          )}
          <Composer value={draft} onChange={setDraft} onSubmit={onSend} busy={busy} onVoice={onVoice} placeholder="Continue the conversation..." />
          {failedPrompt && <div className="tool-note" style={{ marginTop: 10, textAlign: "center" }}>The last request was not completed. <button className="inline-link" type="button" onClick={onRetry}>Retry “{failedPrompt.slice(0, 34)}{failedPrompt.length > 34 ? "…" : ""}”</button></div>}
        </section>
        <aside className="chat-side">
          <div className="side-card"><div className="eyebrow">Thread context</div><h3>{messages.length ? "Working session" : "A clean slate"}</h3><p>{messages.length ? "Nova is keeping the current thread in memory while you work." : "Your next conversation can start with a single sentence."}</p><div className="side-stat"><span>Messages</span><strong>{messages.length}</strong></div></div>
          <div className="side-card"><div className="eyebrow">Try one of these</div>{suggestions.slice(4).map(suggestion => <button className="conversation-row" style={{ paddingLeft: 0, paddingRight: 0 }} type="button" key={suggestion.label} onClick={() => setDraft(suggestion.prompt)}><suggestion.icon size={14} className="conversation-icon" /><span className="conversation-copy"><strong>{suggestion.label}</strong><span>Use as a starting point</span></span></button>)}</div>
          <div className="side-card"><div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}><ShieldCheck size={16} color="#62e6a8" /><p>Your prompts are sent through the server-side AI layer. API keys never live in the browser.</p></div></div>
        </aside>
      </div>
    </div>
  );
}

function ImageStudio() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("Cinematic");
  const [ratio, setRatio] = useState("1:1");
  return (
    <div className="page-wrap">
      <WorkspaceHeader title="Image Studio" description="Shape a visual direction with a deliberate prompt, a clear style, and an aspect ratio that fits the work." action={<span className="status-chip"><span className="status-dot" />Service connection needed</span>} />
      <div className="workspace-grid">
        <section className="workspace-panel">
          <div className="eyebrow">Prompt composer</div>
          <div className="tool-field"><label htmlFor="image-prompt">Describe the image you want to explore</label><textarea id="image-prompt" value={prompt} onChange={event => setPrompt(event.target.value)} placeholder="A quiet observatory above the clouds, early morning light, architectural photography..." /></div>
          <div className="tool-field"><label>Choose a visual direction</label><div className="pill-options">{styles.map(option => <button className={style === option ? "selected" : ""} type="button" key={option} onClick={() => setStyle(option)}>{option}</button>)}</div></div>
          <div className="tool-field"><label>Aspect ratio</label><div className="pill-options">{ratios.map(option => <button className={ratio === option ? "selected" : ""} type="button" key={option} onClick={() => setRatio(option)}>{option}</button>)}</div></div>
          <div className="tool-footer"><span className="tool-note">Selected: {style} · {ratio}<br />Generated assets will appear here after a real image service response.</span><button className="primary-button" type="button" onClick={() => toast.info(prompt.trim() ? "Image service setup is the next step. No image was generated." : "Add a visual prompt first.")}><Sparkles size={14} /> Generate image</button></div>
        </section>
        <section className="workspace-panel"><div className="eyebrow">Gallery</div><div style={{ marginTop: 16 }}><CapabilityEmpty icon={ImageIcon} title="Your visual canvas is waiting" description="Connect the managed image service to turn this workspace into a live generation gallery. Nova will never show a placeholder as a generated result." /></div></section>
      </div>
    </div>
  );
}

function DocumentAI() {
  const [file, setFile] = useState<File | null>(null);
  const handleFile = (candidate: File | undefined) => {
    if (!candidate) return;
    const allowed = ["application/pdf", "text/plain", "text/markdown", "text/csv"];
    if (!allowed.includes(candidate.type) && !/\.(pdf|txt|md|csv)$/i.test(candidate.name)) {
      toast.error("Use a PDF, TXT, Markdown, or CSV file.");
      return;
    }
    if (candidate.size > 10 * 1024 * 1024) {
      toast.error("That file is larger than the 10 MB workspace limit.");
      return;
    }
    setFile(candidate);
  };
  return (
    <div className="page-wrap">
      <WorkspaceHeader title="Document AI" description="Upload a supported file, then ask Nova to summarize, explain, or find the important signal. Private document extraction requires the secure storage pipeline." action={<span className="status-chip"><span className="status-dot" />Secure pipeline pending</span>} />
      <div className="workspace-grid">
        <section className="workspace-panel">
          <div className="eyebrow">Document intake</div>
          <div className="empty-tool" style={{ marginTop: 16 }}>
            <div><div className="empty-icon"><Upload size={19} /></div><h3>{file ? file.name : "Drop a document here"}</h3><p>{file ? `${(file.size / 1024 / 1024).toFixed(2)} MB · ${file.type || "document"}` : "PDF and text files up to 10 MB. Your file is validated before processing."}</p><label className="primary-button" style={{ marginTop: 17, display: "inline-flex" }}><Upload size={14} /> {file ? "Choose another file" : "Choose file"}<input type="file" hidden accept=".pdf,.txt,.md,.csv,application/pdf,text/plain,text/markdown,text/csv" onChange={event => handleFile(event.target.files?.[0])} /></label></div>
          </div>
          <div className="tool-footer"><span className="tool-note">No document contents are sent until a secure processing service is configured.</span><button className="secondary-button" type="button" onClick={() => toast.info(file ? "Document processing is not configured yet. No content was uploaded." : "Choose a document first.")}><FileText size={14} /> Analyze document</button></div>
        </section>
        <section className="workspace-panel"><div className="eyebrow">What Nova can do</div><div style={{ display: "grid", gap: 9, marginTop: 16 }}>{["Summarize the core ideas", "Extract key points and action items", "Explain a difficult concept", "Ask questions about the document"].map(item => <div key={item} className="conversation-row" style={{ paddingLeft: 0 }}><Check size={15} color="#62e6a8" /><span className="conversation-copy"><strong>{item}</strong><span>Available after secure processing is connected</span></span></div>)}</div></section>
      </div>
    </div>
  );
}

function CodeAssistant({ onAsk, busy }: { onAsk: (prompt: string) => Promise<string | null>; busy: boolean }) {
  const [language, setLanguage] = useState("TypeScript");
  const [task, setTask] = useState("Generate");
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const run = async () => {
    if (!prompt.trim()) { toast.error("Tell Nova what you want to build or understand."); return; }
    const output = await onAsk(`You are Nova's code assistant. Work in ${language}. The requested action is ${task}. Do not execute code. Provide a clear answer with safe, copyable code when relevant. User request: ${prompt}`);
    if (output) setResult(output);
  };
  return (
    <div className="page-wrap">
      <WorkspaceHeader title="Code Assistant" description="Generate, explain, debug, and improve code with an assistant that keeps execution out of the production server." action={<span className="status-chip"><span className="status-dot" />Sandbox execution disabled</span>} />
      <div className="workspace-grid">
        <section className="workspace-panel">
          <div className="tool-grid">
            <div className="tool-field" style={{ marginTop: 0 }}><label htmlFor="code-language">Language</label><select id="code-language" value={language} onChange={event => setLanguage(event.target.value)}>{languages.map(item => <option key={item}>{item}</option>)}</select></div>
            <div className="tool-field" style={{ marginTop: 0 }}><label htmlFor="code-task">Intent</label><select id="code-task" value={task} onChange={event => setTask(event.target.value)}>{["Generate", "Explain", "Debug", "Improve"].map(item => <option key={item}>{item}</option>)}</select></div>
          </div>
          <div className="tool-field"><label htmlFor="code-prompt">What are you working on?</label><textarea id="code-prompt" value={prompt} onChange={event => setPrompt(event.target.value)} placeholder="Describe the function, bug, or architecture question..." /></div>
          <div className="tool-footer"><span className="tool-note">Nova can suggest code, but it will not execute arbitrary user-submitted code here.</span><button className="primary-button" type="button" onClick={run} disabled={busy}><Code2 size={14} /> {busy ? "Thinking..." : "Ask Nova"}</button></div>
        </section>
        <section className="workspace-panel">{result ? <><div className="eyebrow">Assistant output</div><div className="message-bubble" style={{ marginTop: 16 }}><RichAssistantContent content={result} /></div></> : <CapabilityEmpty icon={FileCode2} title="Your code workspace is ready" description="Ask for a function, a refactor, an explanation, or help diagnosing an error." label="Ready" />}</section>
      </div>
    </div>
  );
}

function VoiceAssistant({ onNavigate, onTranscript }: { onNavigate: (view: View) => void; onTranscript: (text: string) => void }) {
  const [listening, setListening] = useState(false);
  const listen = () => {
    const SpeechRecognition = (window as Window & { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition || (window as Window & { webkitSpeechRecognition?: any }).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.info("This browser does not expose speech recognition. You can still use the text chat.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => { setListening(false); toast.error("Microphone access or speech recognition was unavailable."); };
    recognition.onresult = (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript;
      if (transcript) {
        onTranscript(transcript);
        toast.success("Transcript moved into the chat composer.");
      }
    };
    try {
      recognition.start();
    } catch {
      setListening(false);
      toast.error("Microphone permission could not be requested.");
    }
  };
  return (
    <div className="page-wrap">
      <WorkspaceHeader title="Voice Assistant" description="Speak naturally when the browser and speech services support it. Nova asks for permission and reports unavailable states instead of simulating recognition." action={<span className="status-chip"><span className="status-dot" />Browser capability check</span>} />
      <section className="workspace-panel" style={{ maxWidth: 760, margin: "0 auto" }}>
        <div style={{ textAlign: "center", padding: "20px 10px 30px" }}><div className={`ai-orb ${listening ? "listening" : ""}`} style={{ margin: "0 auto", width: 112, height: 112 }}><Mic size={31} /></div><div className="eyebrow" style={{ marginTop: 24 }}>{listening ? "Listening now" : "Voice input"}</div><h2 style={{ margin: "10px 0 0", fontSize: 26, letterSpacing: "-0.04em" }}>{listening ? "Tell Nova what is on your mind" : "A more natural way to think"}</h2><p style={{ maxWidth: 460, margin: "12px auto 0", color: "var(--nova-muted)", fontSize: 13, lineHeight: 1.65 }}>{listening ? "Speak clearly. Nova will stop listening when the browser ends the session." : "Use browser speech recognition when available, or move your prompt into the text chat for a reliable fallback."}</p><button className="primary-button" style={{ marginTop: 22 }} type="button" onClick={listen}>{listening ? <><X size={14} /> Stop listening</> : <><Mic size={14} /> Start listening</>}</button></div>
        <div className="side-card" style={{ display: "flex", alignItems: "center", gap: 10 }}><LockKeyhole size={16} color="#62e6a8" /><p>Microphone access is controlled by your browser. Nova does not claim a transcript until speech recognition returns one.</p></div>
        <div style={{ textAlign: "center", marginTop: 16 }}><button className="inline-link" type="button" onClick={() => onNavigate("chat")}>Prefer typing? Open AI Chat <ChevronRight size={13} style={{ verticalAlign: "-2px" }} /></button></div>
      </section>
    </div>
  );
}

function HistoryView({ onNavigate, items, onDelete }: { onNavigate: (view: View) => void; items: typeof recentConversations; onDelete: (title: string) => void }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => items.filter(item => item.title.toLowerCase().includes(query.toLowerCase())), [items, query]);
  return (
    <div className="page-wrap">
      <WorkspaceHeader title="Conversation history" description="Find your recent threads and return to the right context. Persistent account history will be enabled when authenticated storage is connected." action={<button className="secondary-button" type="button" onClick={() => onNavigate("chat")}><Plus size={14} /> New thread</button>} />
      <section className="workspace-panel">
        <div className="history-toolbar"><div className="search-wrap"><Search size={15} /><input className="tool-input" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search conversations" aria-label="Search conversations" /></div><span className="status-chip"><span className="status-dot" />Guest history</span></div>
        <div className="history-list">{filtered.length ? filtered.map(item => <div className="history-row" key={item.title}><item.icon size={17} color="#8c84ff" /><span className="history-copy"><strong>{item.title}</strong><span>{item.date}</span></span><button className="icon-button" type="button" aria-label={`Open ${item.title}`} onClick={() => onNavigate("chat")}><ChevronRight size={15} /></button><button className="icon-button" type="button" aria-label={`Delete ${item.title}`} onClick={() => onDelete(item.title)}><Trash2 size={14} /></button></div>) : <CapabilityEmpty icon={Search} title="No conversations yet" description="Start a thread in AI Chat and it will appear here for this guest session." label="Empty" />}</div>
      </section>
    </div>
  );
}

function SettingsView({ user, onLogout }: { user: { name?: string | null; email?: string | null } | null; onLogout: () => void }) {
  const [tab, setTab] = useState("Profile");
  const [personalization, setPersonalization] = useState(true);
  const [notifications, setNotifications] = useState(false);
  const tabs = ["Profile", "Preferences", "Privacy & data"];
  return (
    <div className="page-wrap">
      <WorkspaceHeader title="Settings" description="Shape Nova around the way you work. Account and privacy controls stay explicit and easy to revisit." />
      <div className="settings-grid">
        <div className="settings-tabs">{tabs.map(item => <button type="button" className={tab === item ? "active" : ""} key={item} onClick={() => setTab(item)}>{item}</button>)}<button type="button" onClick={onLogout}><LogOut size={14} style={{ verticalAlign: "-3px", marginRight: 7 }} /> {user ? "Sign out" : "Sign in"}</button></div>
        <section className="workspace-panel settings-form">
          <div><div className="eyebrow">{tab}</div><h2 style={{ margin: "7px 0 0", fontSize: 20 }}>{tab === "Profile" ? "Your Nova identity" : tab === "Preferences" ? "A quieter workspace" : "Your data, clearly handled"}</h2></div>
          {tab === "Profile" && <><div className="setting-row"><div style={{ display: "flex", gap: 12, alignItems: "center" }}><div className="avatar" style={{ width: 42, height: 42 }}>{user?.name?.slice(0, 1).toUpperCase() || "N"}</div><div><strong>{user?.name || "Guest explorer"}</strong><p>{user?.email || "Sign in to sync your workspace across devices."}</p></div></div><button className="secondary-button" type="button" onClick={user ? onLogout : startLogin}>{user ? "Sign out" : "Sign in"}</button></div><div className="setting-row"><div><strong>Account connection</strong><p>Nova uses the supplied Manus OAuth flow when you choose to sign in.</p></div><span className="status-chip"><span className="status-dot" />{user ? "Connected" : "Guest mode"}</span></div></>}
          {tab === "Preferences" && <><div className="setting-row"><div><strong>Chat personalization</strong><p>Let Nova use this session's context to keep answers consistent.</p></div><button className={`switch ${personalization ? "on" : ""}`} type="button" aria-label="Toggle chat personalization" onClick={() => setPersonalization(value => !value)} /></div><div className="setting-row"><div><strong>Product updates</strong><p>Receive occasional notes about new Nova capabilities.</p></div><button className={`switch ${notifications ? "on" : ""}`} type="button" aria-label="Toggle product updates" onClick={() => setNotifications(value => !value)} /></div><div className="setting-row"><div><strong>Language</strong><p>Choose the default language for the assistant interface.</p></div><select className="tool-input" style={{ width: 140 }} defaultValue="English"><option>English</option><option>Spanish</option><option>French</option><option>Hindi</option></select></div></>}
          {tab === "Privacy & data" && <><div className="setting-row"><div style={{ display: "flex", gap: 11 }}><ShieldCheck size={18} color="#62e6a8" /><div><strong>Server-side credentials</strong><p>AI provider credentials stay on the server and are never embedded in the browser.</p></div></div><Check size={17} color="#62e6a8" /></div><div className="setting-row"><div style={{ display: "flex", gap: 11 }}><LockKeyhole size={18} color="#8c84ff" /><div><strong>Guest session boundary</strong><p>This prototype keeps conversation content in the current session until authenticated persistence is configured.</p></div></div><span className="status-chip"><span className="status-dot" />Local only</span></div><div className="setting-row"><div><strong>Delete guest data</strong><p>Clear the current temporary session state from this browser.</p></div><button className="secondary-button" type="button" onClick={() => toast.success("Guest session data is already ephemeral in this build.")}><Trash2 size={14} /> Clear</button></div></>}
        </section>
      </div>
    </div>
  );
}

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();
  const [activeView, setActiveView] = useState<View>("home");
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [historyItems, setHistoryItems] = useState<typeof recentConversations>([]);
  const [failedPrompt, setFailedPrompt] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const chatMutation = trpc.ai.chat.useMutation();

  const navigate = (view: View) => setActiveView(view);

  const askNova = async (content: string): Promise<string | null> => {
    const trimmed = content.trim();
    if (!trimmed) return null;
    setBusy(true);
    try {
      const result = await chatMutation.mutateAsync({ messages: [{ role: "user", content: trimmed }] });
      if (!result.ok) {
        toast.error(result.error);
        return null;
      }
      return result.content;
    } catch {
      toast.error("Nova could not reach the AI service. Your prompt is safe to retry.");
      return null;
    } finally {
      setBusy(false);
    }
  };

  const sendMessage = async () => {
    const trimmed = draft.trim();
    if (!trimmed || busy) return;
    const nextMessages = [...messages, { role: "user" as const, content: trimmed }];
    if (messages.length === 0) {
      setHistoryItems(current => [...current, { title: trimmed.slice(0, 58), date: "Just now · Guest session", icon: MessageSquare }]);
    }
    setMessages(nextMessages);
    setDraft("");
    setFailedPrompt(null);
    setActiveView("chat");
    setBusy(true);
    try {
      const result = await chatMutation.mutateAsync({ messages: nextMessages.map(message => ({ role: message.role, content: message.content })) });
      if (result.ok) setMessages([...nextMessages, { role: "assistant", content: result.content }]);
      else {
        setMessages([...nextMessages, { role: "assistant", content: `**Nova is not connected yet.**\n\n${result.error}` }]);
        setFailedPrompt(trimmed);
      }
    } catch {
      setMessages([...nextMessages, { role: "assistant", content: "**Nova could not reach the AI service.**\n\nYour prompt is safe to retry when the service is available." }]);
      setFailedPrompt(trimmed);
    } finally {
      setBusy(false);
    }
  };

  const retryFailedPrompt = () => {
    if (!failedPrompt) return;
    setDraft(failedPrompt);
    setFailedPrompt(null);
  };

  const handleTranscript = (text: string) => {
    setDraft(text);
    setActiveView("chat");
  };

  const handleVoice = () => {
    setActiveView("voice");
    toast.info("Voice Assistant is ready to check your browser's microphone support.");
  };

  const signOut = async () => {
    if (!isAuthenticated) { startLogin(); return; }
    await logout();
    toast.success("You are now in guest mode.");
  };

  const currentLabel = [...navPrimary, ...navSecondary].find(item => item.id === activeView)?.label || "Overview";
  const initials = user?.name?.split(" ").map(part => part[0]).join("").slice(0, 2).toUpperCase() || "N";
  const displayName = user?.name?.split(" ")[0] || "there";

  return (
    <div className="nova-shell">
      <aside className="nova-sidebar">
        <NovaBrand />
        <div className="nova-nav-label">Workspace</div>
        <nav className="nova-nav" aria-label="Primary navigation">{navPrimary.map(item => <button type="button" key={item.id} className={activeView === item.id ? "active" : ""} onClick={() => navigate(item.id)}><item.icon size={16} strokeWidth={1.8} /><span>{item.label}</span></button>)}</nav>
        <div className="nova-nav-label nav-section-gap">Tools</div>
        <nav className="nova-nav" aria-label="Tools navigation">{navSecondary.map(item => <button type="button" key={item.id} className={activeView === item.id ? "active" : ""} onClick={() => navigate(item.id)}><item.icon size={16} strokeWidth={1.8} /><span>{item.label}</span></button>)}</nav>
        <div className="sidebar-spacer" />
        <div className="sidebar-status"><span className="status-dot" /><div><strong>Nova workspace ready</strong><span>Start with your next idea</span></div></div>
        <button className="profile-button" type="button" onClick={() => navigate("settings")}><div className="avatar">{initials}</div><span className="profile-meta"><strong>{user?.name || "Guest explorer"}</strong><span>{user?.email || "Local session"}</span></span><ChevronRight size={14} color="#596681" /></button>
      </aside>

      <main className="nova-main">
        <header className="nova-topbar"><div className="breadcrumb"><span>Nova AI</span><ChevronRight size={13} /><strong>{currentLabel}</strong></div><div className="topbar-actions"><button className="ghost-button" type="button" onClick={() => toast.info("Nova keeps the workspace calm: start with a prompt or choose a tool.")}><CircleHelp size={14} /> Help center</button><button className="icon-button" type="button" aria-label="Open settings" onClick={() => navigate("settings")}><Settings2 size={16} /></button><button className="icon-button" type="button" aria-label="Open menu" onClick={() => toast.info("Use the navigation rail to switch workspaces.")}><Menu size={16} /></button></div></header>

        {activeView === "home" && <HomeDashboard onNavigate={navigate} draft={draft} setDraft={setDraft} onSend={sendMessage} busy={busy} onVoice={handleVoice} displayName={displayName} />}
        {activeView === "chat" && <ChatWorkspace messages={messages} draft={draft} setDraft={setDraft} onSend={sendMessage} busy={busy} onNew={() => { setMessages([]); setDraft(""); setFailedPrompt(null); }} onVoice={handleVoice} failedPrompt={failedPrompt} onRetry={retryFailedPrompt} />}
        {activeView === "image" && <ImageStudio />}
        {activeView === "documents" && <DocumentAI />}
        {activeView === "code" && <CodeAssistant onAsk={askNova} busy={busy} />}
        {activeView === "voice" && <VoiceAssistant onNavigate={navigate} onTranscript={handleTranscript} />}
        {activeView === "history" && <HistoryView onNavigate={navigate} items={historyItems} onDelete={title => setHistoryItems(current => current.filter(item => item.title !== title))} />}
        {activeView === "settings" && <SettingsView user={user} onLogout={signOut} />}
      </main>

      <nav className="mobile-nav" aria-label="Mobile navigation">{[navPrimary[0], navPrimary[1], navPrimary[2], navSecondary[3]].map(item => <button type="button" key={item.id} className={activeView === item.id ? "active" : ""} onClick={() => navigate(item.id)}><item.icon size={16} /><span>{item.label.replace(" Assistant", "")}</span></button>)}</nav>
    </div>
  );
}

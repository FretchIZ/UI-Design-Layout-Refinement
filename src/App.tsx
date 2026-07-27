import { useState, useEffect, useRef } from 'react'

// ── Types ──────────────────────────────────────────────────────
interface Message {
  role: 'agent' | 'user'
  text: string
  time: string
}

// ── Sample data ────────────────────────────────────────────────
const INITIAL_MESSAGES: Message[] = [
  {
    role: 'agent',
    text: "Hello! I'm Elice, your AI learning companion. What would you like to explore today?",
    time: '10:42',
  },
  {
    role: 'user',
    text: 'Can you explain how neural networks learn through backpropagation?',
    time: '10:43',
  },
  {
    role: 'agent',
    text: "Great question! Backpropagation is the algorithm neural networks use to learn from mistakes. Think of it as the network computing gradients — tracing error back through each layer to adjust weights precisely.",
    time: '10:43',
  },
  {
    role: 'agent',
    text: "I've loaded a visual breakdown in the right panel. We'll step through the forward pass, loss computation, and the backward pass together.",
    time: '10:44',
  },
  {
    role: 'user',
    text: 'Perfect — can you walk me through the math as well?',
    time: '10:44',
  },
  {
    role: 'agent',
    text: "Absolutely. Switch to the Math tab on the right to see the chain rule in action. The key insight is ∂L/∂w = ∂L/∂a · ∂a/∂z · ∂z/∂w, applied recursively from output layer back to input.",
    time: '10:45',
  },
]

const MEMORY_ITEMS = [
  { title: 'Neural Networks Basics', date: 'Jul 24', icon: '🧠', count: 12 },
  { title: 'Linear Algebra Review', date: 'Jul 22', icon: '📐', count: 8 },
  { title: 'Python for ML', date: 'Jul 19', icon: '🐍', count: 23 },
  { title: 'Statistics Fundamentals', date: 'Jul 15', icon: '📊', count: 15 },
  { title: 'Calculus & Derivatives', date: 'Jul 10', icon: '∫', count: 7 },
]

// ── Icons ──────────────────────────────────────────────────────
function IconNew() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}
function IconChat() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}
function IconMemory() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
      <path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" />
    </svg>
  )
}
function IconSettings() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}
function IconSend() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" fill="white" stroke="none" />
    </svg>
  )
}


// ── Neural Network Visualization ───────────────────────────────
function NeuralNetViz() {
  const inputY = [55, 110, 165, 220, 275]
  const hiddenY = [80, 155, 230]
  const outputY = [120, 210]
  const x1 = 70, x2 = 190, x3 = 310

  return (
    <svg viewBox="0 0 380 340" className="w-full h-full max-h-[220px]">
      <defs>
        <marker id="arrowBack" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
          <path d="M6,0 L0,3 L6,6 Z" fill="rgba(251,113,133,0.5)" />
        </marker>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* input→hidden connections */}
      {inputY.map((iy, ii) =>
        hiddenY.map((hy, hi) => (
          <line key={`ih${ii}${hi}`} x1={x1} y1={iy} x2={x2} y2={hy}
            stroke="rgba(99,102,241,0.14)" strokeWidth="1" />
        ))
      )}
      {/* hidden→output connections */}
      {hiddenY.map((hy, hi) =>
        outputY.map((oy, oi) => (
          <line key={`ho${hi}${oi}`} x1={x2} y1={hy} x2={x3} y2={oy}
            stroke="rgba(167,139,250,0.22)" strokeWidth="1.5" />
        ))
      )}

      {/* Backward pass arrow */}
      <path d={`M ${x3} 300 L ${x1} 300`}
        stroke="rgba(251,113,133,0.4)" strokeWidth="1.5"
        strokeDasharray="5 4" markerEnd="url(#arrowBack)" fill="none" />
      <text x="190" y="318" textAnchor="middle" fill="rgba(251,113,133,0.55)"
        fontSize="9" fontFamily="JetBrains Mono, monospace">∇ backward pass</text>

      {/* Input nodes */}
      {inputY.map((y, i) => (
        <g key={`in${i}`} filter="url(#glow)">
          <circle cx={x1} cy={y} r={15} fill="rgba(99,102,241,0.12)" stroke="#6366f1" strokeWidth="1.5" />
          <text x={x1} y={y + 1} textAnchor="middle" dominantBaseline="middle"
            fill="#a5b4fc" fontSize="9" fontFamily="JetBrains Mono, monospace">x{i + 1}</text>
        </g>
      ))}

      {/* Hidden nodes */}
      {hiddenY.map((y, i) => (
        <g key={`hn${i}`} filter="url(#glow)">
          <circle cx={x2} cy={y} r={19} fill="rgba(139,92,246,0.14)" stroke="#8b5cf6" strokeWidth="1.5" />
          <text x={x2} y={y + 1} textAnchor="middle" dominantBaseline="middle"
            fill="#c4b5fd" fontSize="9" fontFamily="JetBrains Mono, monospace">h{i + 1}</text>
        </g>
      ))}

      {/* Output nodes */}
      {outputY.map((y, i) => (
        <g key={`on${i}`} filter="url(#glow)">
          <circle cx={x3} cy={y} r={17} fill="rgba(167,139,250,0.18)" stroke="#a78bfa" strokeWidth="2" />
          <text x={x3} y={y + 1} textAnchor="middle" dominantBaseline="middle"
            fill="#ddd6fe" fontSize="9" fontFamily="JetBrains Mono, monospace">ŷ{i + 1}</text>
        </g>
      ))}

      {/* Layer labels */}
      {[['INPUT', x1], ['HIDDEN', x2], ['OUTPUT', x3]].map(([label, x]) => (
        <text key={String(label)} x={Number(x)} y={15} textAnchor="middle"
          fill="#3a3a5a" fontSize="8" fontFamily="JetBrains Mono, monospace" letterSpacing="1">
          {label}
        </text>
      ))}
    </svg>
  )
}

// ── Code Panel ─────────────────────────────────────────────────
function CodePanel() {
  type Token = { t: string; c: string }
  const lines: Token[][] = [
    [{ t: 'def ', c: '#6366f1' }, { t: 'backprop', c: '#a78bfa' }, { t: '(X, y, W1, W2, lr=', c: '#c4c2f0' }, { t: '0.01', c: '#34d399' }, { t: '):', c: '#c4c2f0' }],
    [{ t: '    # forward pass', c: '#3a3a6a' }],
    [{ t: '    z1 = X @ W1', c: '#c4c2f0' }],
    [{ t: '    a1 = ', c: '#c4c2f0' }, { t: 'sigmoid', c: '#a78bfa' }, { t: '(z1)', c: '#c4c2f0' }],
    [{ t: '    z2 = a1 @ W2', c: '#c4c2f0' }],
    [{ t: '    a2 = ', c: '#c4c2f0' }, { t: 'sigmoid', c: '#a78bfa' }, { t: '(z2)', c: '#c4c2f0' }],
    [{ t: '    # loss (MSE)', c: '#3a3a6a' }],
    [{ t: '    loss = ', c: '#c4c2f0' }, { t: '0.5', c: '#34d399' }, { t: ' * np.sum((y - a2)**', c: '#c4c2f0' }, { t: '2', c: '#34d399' }, { t: ')', c: '#c4c2f0' }],
    [{ t: '    # backward pass', c: '#3a3a6a' }],
    [{ t: '    δ2 = (a2 - y) * sig_d(z2)', c: '#c4c2f0' }],
    [{ t: '    dW2 = a1.T @ δ2', c: '#c4c2f0' }],
    [{ t: '    δ1 = (δ2 @ W2.T) * sig_d(z1)', c: '#c4c2f0' }],
    [{ t: '    dW1 = X.T @ δ1', c: '#c4c2f0' }],
    [{ t: '    W1 -= lr * dW1', c: '#c4c2f0' }],
    [{ t: '    W2 -= lr * dW2', c: '#c4c2f0' }],
    [{ t: '    return ', c: '#6366f1' }, { t: 'W1, W2, loss', c: '#c4c2f0' }],
  ]

  return (
    <div className="rounded-xl p-4 overflow-auto" style={{
      background: '#090915',
      border: '1px solid rgba(99,102,241,0.14)',
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: '11.5px',
      lineHeight: '1.75',
      color: '#c4c2f0',
    }}>
      {lines.map((line, li) => (
        <div key={li}>
          {line.map((tok, ti) => (
            <span key={ti} style={{ color: tok.c }}>{tok.t}</span>
          ))}
        </div>
      ))}
    </div>
  )
}

// ── Main App ───────────────────────────────────────────────────
export default function App() {
  const [activeNav, setActiveNav] = useState<'chat' | 'memory' | 'settings'>('chat')
  const [lessonTab, setLessonTab] = useState<'visual' | 'math' | 'code'>('visual')
  const [inputText, setInputText] = useState('')
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    const text = inputText.trim()
    if (!text) return
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    setMessages(prev => [...prev, { role: 'user', text, time }])
    setInputText('')
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          role: 'agent',
          text: "Let me think through that carefully. Great — here's what I know about that topic...",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ])
    }, 900)
  }

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        background: 'var(--bg)',
        fontFamily: "'Outfit', system-ui, sans-serif",
        color: 'var(--text)',
      }}
    >
      {/* ── SIDEBAR ─────────────────────────────────────────── */}
      <aside
        className="sidebar"
        style={{
          width: '64px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '16px 0',
          gap: '6px',
          background: 'var(--sidebar)',
          borderRight: '1px solid var(--border)',
          flexShrink: 0,
        }}
      >
        {/* Logo mark */}
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '12px',
            boxShadow: '0 0 16px rgba(99,102,241,0.35)',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
          </svg>
        </div>

        {/* New Chat */}
        <SidebarBtn
          active={false}
          onClick={() => { setActiveNav('chat'); setMessages(INITIAL_MESSAGES) }}
          title="New Chat"
        >
          <IconNew />
        </SidebarBtn>

        {/* Chat history */}
        <SidebarBtn active={activeNav === 'chat'} onClick={() => setActiveNav('chat')} title="Conversations">
          <IconChat />
        </SidebarBtn>

        <div style={{ flex: 1 }} />

        {/* Memory */}
        <SidebarBtn active={activeNav === 'memory'} onClick={() => setActiveNav('memory')} title="Memory">
          <IconMemory />
        </SidebarBtn>

        {/* Settings */}
        <SidebarBtn active={activeNav === 'settings'} onClick={() => setActiveNav('settings')} title="Settings">
          <IconSettings />
        </SidebarBtn>
      </aside>

      {/* ── MAIN COLUMN ─────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top panels */}
        <div className="layout-row" style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

          {/* ── SCREEN 1: Chat / Memory / Settings ───────────── */}
          <div
            className="screen-panel"
            style={{
              flex: '3 1 0',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              borderRadius: '14px',
              background: '#090909',
              border: '1px solid rgba(99,102,241,0.07)',
              margin: '6px 3px 6px 6px',
            }}
          >
            {/* Panel header */}
            <PanelHeader>
              {activeNav === 'chat' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: 'white',
                      flexShrink: 0,
                    }}
                  >E</div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#c4c2f0' }}>Elice</div>
                    <div style={{ fontSize: '11px', color: 'var(--dim)' }}>AI Education & Engineering Platform</div>
                  </div>
                </div>
              )}
              {activeNav === 'memory' && (
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#c4c2f0' }}>Memory</span>
              )}
              {activeNav === 'settings' && (
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#c4c2f0' }}>Settings</span>
              )}
            </PanelHeader>

            {/* Panel content */}
            <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

              {activeNav === 'chat' && (
                <>
                  <div
                    className="messages-area"
                    style={{
                      flex: 1,
                      overflowY: 'auto',
                      padding: '16px 16px 8px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    {messages.map((msg, i) => (
                      <div key={i} style={{ display: 'flex', gap: '8px', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-start' }}>
                        {msg.role === 'agent' && (
                          <div style={{
                            width: '28px', height: '28px', borderRadius: '50%',
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '12px', fontWeight: 700, color: 'white',
                            flexShrink: 0, marginTop: '4px',
                            boxShadow: '0 0 10px rgba(99,102,241,0.3)',
                          }}>E</div>
                        )}
                        <div style={{ maxWidth: msg.role === 'agent' ? '78%' : '82%' }}>
                          <div style={{
                            padding: '12px 16px',
                            borderRadius: msg.role === 'agent' ? '4px 18px 18px 18px' : '18px 4px 18px 18px',
                            background: msg.role === 'agent' ? 'rgba(99,102,241,0.08)' : 'rgba(139,92,246,0.18)',
                            border: `1px solid ${msg.role === 'agent' ? 'rgba(99,102,241,0.1)' : 'rgba(139,92,246,0.2)'}`,
                            fontSize: '13.5px',
                            lineHeight: '1.65',
                            color: msg.role === 'agent' ? '#d0cef5' : '#e8e2ff',
                          }}>
                            {msg.text}
                          </div>
                          <div style={{
                            fontSize: '10px',
                            marginTop: '6px',
                            paddingInline: '6px',
                            color: '#2a2a4a',
                            textAlign: msg.role === 'user' ? 'right' : 'left',
                            letterSpacing: '0.3px',
                          }}>{msg.time}</div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input bar */}
                  <div className="chat-input" style={{ padding: '12px 16px 16px', borderTop: '1px solid rgba(99,102,241,0.06)' }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '10px 14px',
                      borderRadius: '14px',
                      background: 'rgba(99,102,241,0.05)',
                      border: '1px solid rgba(99,102,241,0.12)',
                      transition: 'border-color 0.2s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(99,102,241,0.25)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(99,102,241,0.12)' }}>
                      <input
                        type="text"
                        value={inputText}
                        onChange={e => setInputText(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && sendMessage()}
                        placeholder="Type your message..."
                        style={{
                          flex: 1, background: 'transparent', border: 'none',
                          outline: 'none', fontSize: '13.5px', color: '#d0cef5',
                          caretColor: '#6366f1',
                        }}
                      />
                      <button
                        onClick={sendMessage}
                        style={{
                          width: '32px', height: '32px', borderRadius: '10px',
                          border: 'none', cursor: 'pointer',
                          background: inputText.trim() ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(99,102,241,0.15)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.25s',
                          opacity: inputText.trim() ? 1 : 0.6,
                        }}
                      >
                        <IconSend />
                      </button>
                    </div>
                  </div>
                </>
              )}

              {activeNav === 'memory' && (
                <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {MEMORY_ITEMS.map((item, i) => (
                      <button
                        key={i}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '12px',
                          padding: '12px 14px', borderRadius: '12px', border: '1px solid var(--border)',
                          background: 'rgba(99,102,241,0.05)', cursor: 'pointer', textAlign: 'left',
                          transition: 'background 0.15s',
                        }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.1)' }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.05)' }}
                      >
                        <span style={{ fontSize: '20px', flexShrink: 0 }}>{item.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '13px', color: '#c4c2f0', fontWeight: 500 }}>{item.title}</div>
                          <div style={{ fontSize: '11px', color: 'var(--dim)', fontFamily: "'JetBrains Mono', monospace", marginTop: '2px' }}>
                            {item.date} · {item.count} messages
                          </div>
                        </div>
                        <div style={{
                          width: '22px', height: '22px', borderRadius: '50%',
                          background: 'rgba(99,102,241,0.15)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round">
                            <path d="M9 18l6-6-6-6" />
                          </svg>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeNav === 'settings' && (
                <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
                  {[
                    { label: 'Voice Model', value: 'Elice — Standard' },
                    { label: 'Language', value: 'English (US)' },
                    { label: 'Response Style', value: 'Detailed' },
                    { label: 'Theme', value: 'Semi Black' },
                    { label: 'Auto-memory', value: 'Enabled' },
                    { label: 'Speech rate', value: '1.0×' },
                  ].map((s, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '12px 0', borderBottom: '1px solid rgba(99,102,241,0.07)',
                      }}
                    >
                      <span style={{ fontSize: '13px', color: 'var(--muted)' }}>{s.label}</span>
                      <span style={{ fontSize: '13px', color: '#c4c2f0', fontWeight: 500 }}>{s.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── SCREEN 2: Lesson / Visualization ──────────────── */}
          <div
            className="screen-panel"
            style={{
              flex: '2 1 0',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              borderRadius: '14px',
              background: '#090909',
              border: '1px solid rgba(99,102,241,0.07)',
              margin: '6px 6px 6px 3px',
            }}
          >
            <PanelHeader>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '9px', letterSpacing: '1.5px', color: 'var(--dim)',
                  fontFamily: "'JetBrains Mono', monospace", marginBottom: '2px',
                }}>LESSON · NEURAL NETWORKS</div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#c4c2f0' }}>Backpropagation</div>
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                {(['visual', 'math', 'code'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setLessonTab(tab)}
                    style={{
                      padding: '4px 10px', borderRadius: '8px', border: 'none',
                      cursor: 'pointer', fontSize: '11px', fontFamily: "'JetBrains Mono', monospace",
                      background: lessonTab === tab ? 'rgba(99,102,241,0.2)' : 'transparent',
                      color: lessonTab === tab ? '#818cf8' : 'var(--dim)',
                      transition: 'all 0.15s',
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </PanelHeader>

            <div style={{ flex: 1, overflowY: 'auto', padding: '14px' }}>
              {lessonTab === 'visual' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', height: '100%' }}>
                  <div style={{
                    flex: 1, borderRadius: '14px', border: '1px solid var(--border)',
                    background: 'rgba(99,102,241,0.03)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    minHeight: '180px', overflow: 'hidden', padding: '8px',
                  }}>
                    <NeuralNetViz />
                  </div>
                  <div style={{
                    fontSize: '11px', lineHeight: '1.6',
                    color: 'var(--muted)', fontFamily: "'JetBrains Mono', monospace",
                    padding: '10px 12px', borderRadius: '10px',
                    background: 'rgba(99,102,241,0.04)', border: '1px solid var(--border)',
                  }}>
                    Forward pass → compute loss → backward pass via chain rule → update weights
                  </div>

                </div>
              )}

              {lessonTab === 'math' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { label: 'Loss (MSE)', eq: 'L = ½ · Σ (yᵢ − ŷᵢ)²' },
                    { label: 'Chain Rule', eq: '∂L/∂w = ∂L/∂a · ∂a/∂z · ∂z/∂w' },
                    { label: 'Weight Update', eq: 'w ← w − α · ∂L/∂w' },
                    { label: 'Sigmoid Activation', eq: 'σ(z) = 1 / (1 + e⁻ᶻ)' },
                    { label: 'Sigmoid Derivative', eq: "σ'(z) = σ(z) · (1 − σ(z))" },
                    { label: 'Learning Rate', eq: 'α ∈ (0, 1)   typically 0.001' },
                  ].map((item, i) => (
                    <div
                      key={i}
                      style={{
                        borderRadius: '10px', padding: '11px 13px',
                        background: 'rgba(99,102,241,0.06)', border: '1px solid var(--border)',
                      }}
                    >
                      <div style={{ fontSize: '10px', color: 'var(--dim)', fontFamily: "'JetBrains Mono', monospace", marginBottom: '4px', letterSpacing: '0.5px' }}>
                        {item.label.toUpperCase()}
                      </div>
                      <div style={{ fontSize: '14px', color: '#a5b4fc', fontFamily: "'JetBrains Mono', monospace" }}>{item.eq}</div>
                    </div>
                  ))}
                </div>
              )}

              {lessonTab === 'code' && <CodePanel />}
            </div>
          </div>
        </div>

        {/* ── BOTTOM CONTROLS ──────────────────────────────────── */}
      </div>
    </div>
  )
}

// ── Helper components ──────────────────────────────────────────
function SidebarBtn({
  children,
  active,
  onClick,
  title,
}: {
  children: React.ReactNode
  active: boolean
  onClick: () => void
  title: string
}) {
  return (
    <button
      className="sidebar-btn"
      onClick={onClick}
      title={title}
      style={{
        width: '40px', height: '40px', borderRadius: '11px',
        border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: active ? 'rgba(99,102,241,0.18)' : 'transparent',
        color: active ? '#818cf8' : '#3a3a5a',
        transition: 'all 0.15s',
      }}
      onMouseEnter={e => {
        if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.08)'
        if (!active) (e.currentTarget as HTMLElement).style.color = '#6366f1'
      }}
      onMouseLeave={e => {
        if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'
        if (!active) (e.currentTarget as HTMLElement).style.color = '#3a3a5a'
      }}
    >
      {children}
    </button>
  )
}

function PanelHeader({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="panel-header"
      style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '10px 14px',
        borderBottom: '1px solid var(--border)',
        background: 'rgba(99,102,241,0.03)',
        flexShrink: 0,
        minHeight: '52px',
      }}
    >
      {children}
    </div>
  )
}

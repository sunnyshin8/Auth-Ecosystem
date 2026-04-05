"use client";

import { useChat } from "@ai-sdk/react";
import { useInterruptions } from "@auth0/ai-vercel/react";
import { TokenVaultInterruptHandler } from "@/components/TokenVaultInterruptHandler";
import { PermissionDashboard } from "@/components/PermissionDashboard";
import { Shield, Activity, User, ArrowRight, Fingerprint, ShieldCheck, FileBarChart2 } from "lucide-react";

const insights = [
  {
    icon: ShieldCheck,
    title: "Scoped delegation wins",
    body: "Separate read and write privileges kept the agent useful without giving it unrestricted access.",
  },
  {
    icon: Fingerprint,
    title: "Step-up should be contextual",
    body: "High-risk actions are easier to trust when the approval modal explains risk, scope, and time window.",
  },
  {
    icon: FileBarChart2,
    title: "Auditability builds confidence",
    body: "Structured award logs and immutable trail views make agent behavior explainable to users and judges.",
  },
];

export default function Dashboard() {
  const chat: any = useInterruptions((handler) =>
    useChat({
      api: "/api/chat",
      onError: handler((e: Error) => {
        console.error("Chat error:", e);
      }),
    }) as any
  );

  return (
    <div className="dash-wrap">
      <div className="dash-grid">
      <div className="dash-side">
        <PermissionDashboard />

        <section className="dash-insight-card">
          <div className="dash-insight-head">
            <div>
              <p className="dash-insight-kicker">Insight Value</p>
              <h2 className="dash-insight-title">Authorization patterns learned from the build</h2>
            </div>
          </div>

          <div className="dash-insight-list">
            {insights.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="dash-insight-item">
                  <div className="dash-insight-ic">
                    <Icon size={16} />
                  </div>
                  <div>
                    <p className="dash-insight-item-title">{item.title}</p>
                    <p className="dash-insight-item-body">{item.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
        
        <div className="dash-audit-card">
          <a href="/dashboard/audit" className="dash-audit-link">
            <span>View Blockchain Audit Trail</span>
            <ArrowRight size={16} />
          </a>
        </div>
      </div>

      <div className="dash-main">
        <div className="dash-chat">
          <div className="dash-chat-head">
            <div className="dash-chat-dot" />
            <span>Secure Procurement Agent</span>
          </div>

          <div className="dash-chat-body">
            {chat.messages.length === 0 ? (
              <div className="dash-empty">
                <Shield size={48} className="dash-empty-icon" />
                <p className="dash-empty-title">Agent initialized securely via Token Vault.</p>
                <p className="dash-empty-sub">Try asking: "Evaluate the bids for RFP-2026" or "Award contract RFP-2026 to CloudSecure"</p>
              </div>
            ) : (
              chat.messages.map((m: any) => (
                <div key={m.id} className={`dash-msg-row ${m.role === 'user' ? 'u' : 'a'}`}>
                  <div className={`dash-msg ${
                    m.role === 'user' 
                      ? 'u' 
                      : 'a'
                  }`}>
                    <div className="dash-msg-meta">
                      {m.role === 'user' ? <User size={14} /> : <Activity size={14} />}
                      <span>
                        {m.role === 'user' ? 'You' : 'Agent Core'}
                      </span>
                    </div>
                    <div className="dash-msg-content">{m.content}</div>
                  </div>
                </div>
              ))
            )}
            
            <div className="dash-interrupt-wrap">
                <TokenVaultInterruptHandler 
                  interrupt={chat.toolInterrupt} 
                  onFinish={() => chat.reload()} 
                />
            </div>
          </div>

          <form onSubmit={chat.handleSubmit} className="dash-chat-form">
            <div className="dash-input-wrap">
              <input
                value={chat.input}
                onChange={chat.handleInputChange}
                placeholder="Instruct the agent..."
                className="dash-input"
              />
              <button 
                type="submit" 
                disabled={chat.isLoading || !chat.input.trim()}
                className="dash-send"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
      </div>
    </div>
  );
}

"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  ShieldCheck, Bot, Link2, Fingerprint, BarChart3, Workflow,
  ArrowRight, Lock, Sparkles, UserCheck, FileSearch, Award,
} from "lucide-react";
import { useRef, type MouseEvent } from "react";

/* ─── 3D Tilt ─── */
function use3DTilt() {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rx = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 220, damping: 22 });
  const ry = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 220, damping: 22 });

  function onMove(e: MouseEvent) {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  }
  function onLeave() { x.set(0); y.set(0); }
  return { ref, rx, ry, onMove, onLeave };
}

/* ─── Animation variants ─── */
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } };
const scaleIn = { hidden: { opacity: 0, scale: 0.93 }, show: { opacity: 1, scale: 1, transition: { duration: 0.45 } } };

/* ─── Data ─── */
const features = [
  { icon: ShieldCheck, c: "indigo", title: "Auth0 Token Vault", desc: "AI agents act on your behalf using securely delegated tokens never exposing raw credentials." },
  { icon: Bot, c: "violet", title: "IBM Granite LLM", desc: "Fine-tuned Granite 3.1 model evaluates bids end-to-end with RAG-powered accuracy." },
  { icon: Link2, c: "cyan", title: "Blockchain Verified", desc: "Every procurement action is logged immutably on the Ethereum Sepolia network." },
  { icon: Fingerprint, c: "pink", title: "Step-Up Auth (CIBA)", desc: "High-stakes AI actions require explicit user approval via Auth0's CIBA flow." },
  { icon: BarChart3, c: "amber", title: "Transparent Scoring", desc: "Weighted multi-criteria bid evaluation with full audit trails for regulators." },
  { icon: Workflow, c: "teal", title: "Agentic Workflows", desc: "LangGraph-powered agents orchestrate multi-step procurement tasks autonomously." },
];

const steps = [
  { num: "01", icon: FileSearch, title: "Upload RFP", desc: "Government Procurement Officers upload requirements. Auth0 validates identity; the AI agent begins analysis." },
  { num: "02", icon: UserCheck, title: "AI Evaluates Bids", desc: "IBM Granite LLM scores vendors across 12 weighted criteria via secure Token Vault connections." },
  { num: "03", icon: Award, title: "Award via Step-Up", desc: "High-value actions trigger Auth0 CIBA step-up authentication before immutable blockchain recording." },
];

const stats = [
  { n: "3", l: "Integrated Services", s: "Backend · Frontend · LLM" },
  { n: "12", l: "Evaluation Criteria", s: "Weighted scoring" },
  { n: "∞", l: "Blockchain Records", s: "Immutable audit trail" },
  { n: "0", l: "Exposed Credentials", s: "Token Vault secured" },
];

/* ═══════════════════ PAGE ═══════════════════ */
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ErrorAlert() {
  const searchParams = useSearchParams();
  const authFailed = searchParams.get("auth") === "failed";
  const error = searchParams.get("error");
  const desc = searchParams.get("desc") || searchParams.get("error_description");

  if (!authFailed && !error) return null;

  const title = authFailed ? "Authentication failed" : `Authentication Error: ${error}`;
  const description = authFailed
    ? "Sign-in could not be completed. Please try again."
    : desc;

  return (
    <div className="max-w-4xl mx-auto mt-24 mb-[-4rem] p-4 bg-red-500/10 border border-red-500/20 rounded-2xl backdrop-blur-xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center shrink-0">
        <Lock size={20} />
      </div>
      <div>
        <p className="font-bold text-red-400">{title}</p>
        <p className="text-sm text-red-300/70">{description}</p>
      </div>
    </div>
  );
}

export default function Home() {
  const tilt = use3DTilt();

  return (
    <>
      <div className="bg-orbs">
        <motion.div className="orb orb-1" animate={{ x: [0, 35, 0], y: [0, -25, 0] }} transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="orb orb-2" animate={{ x: [0, -25, 0], y: [0, 35, 0] }} transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="orb orb-3" animate={{ x: [0, 20, 0], y: [0, -15, 0] }} transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }} />
      </div>

      <div className="wrap">
        <Suspense fallback={null}>
          <ErrorAlert />
        </Suspense>
        {/* ── Nav ── */}
        <motion.nav className="nav" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="nav-bg" />
          <a href="/" className="logo">
            <div className="logo-mark"><Sparkles /></div>
            <span className="logo-name">Auth Ecosystem</span>
          </a>
          <ul className="nav-links">
            <li><a href="#how">How It Works</a></li>
            <li><a href="#features">Features</a></li>
            <li><a href="#arch">Architecture</a></li>
            <li><a href="/api/auth/login" className="btn-nav">Connect Auth0</a></li>
          </ul>
        </motion.nav>

        {/* ── Hero ── */}
        <section className="hero">
          <motion.div variants={stagger} initial="hidden" animate="show">
            <motion.div className="hero-badge" variants={fadeUp}>
              <span className="badge-dot" /> Authorized to Act 2026
            </motion.div>
            <motion.h1 variants={fadeUp}>
              AI Agents That Act <span className="tg">Securely</span> on Your Behalf
            </motion.h1>
            <motion.p variants={fadeUp}>
              Agentic AI procurement platform powered by Auth0 Token Vault,
              IBM Granite LLMs, and blockchain-verified auditability.
            </motion.p>
            <motion.div className="hero-btns" variants={fadeUp}>
              <a href="/dashboard" className="btn-p inline-flex items-center gap-2" id="get-started-cta">Get Started <ArrowRight size={16} /></a>
              <a href="#arch" className="btn-o">View Architecture</a>
            </motion.div>
          </motion.div>

          <motion.div className="hero-vis" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
            <motion.div ref={tilt.ref} className="g3d" style={{ rotateX: tilt.rx, rotateY: tilt.ry }} onMouseMove={tilt.onMove} onMouseLeave={tilt.onLeave}>
              <div className="card-hdr">
                <div className="cd r" /><div className="cd y" /><div className="cd g" />
                <span className="card-label">Agent Console</span>
              </div>
              <div className="chat">
                <motion.div className="msg" initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
                  <div className="av ai">AI</div>
                  <div className="bub">Analysed <strong>12 vendor bids</strong> for RFP-2026-42. <strong>TechConnect Ltd</strong> scores highest at <strong>91.4%</strong>.</div>
                </motion.div>
                <motion.div className="msg u" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.9 }}>
                  <div className="av hu">GPO</div>
                  <div className="bub">Award the contract to TechConnect Ltd.</div>
                </motion.div>
                <motion.div className="msg" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}>
                  <div className="av ai">AI</div>
                  <div className="bub">
                    High-stakes action Auth0 step up required.
                    <div className="su-card">
                      <div className="su-ic"><Lock /></div>
                      <div className="su-info"><strong>Step-Up Auth</strong><span>Award Contract $2.4M</span></div>
                      <a href="/dashboard">
                        <motion.button className="btn-ap cursor-pointer" whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}>Approve</motion.button>
                      </a>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* ── Trust Bar ── */}
        <motion.section className="trust" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <p>Powered by</p>
          <div className="trust-logos">
            <span>Auth0</span>
            <span>IBM Granite</span>
            <span>Ethereum</span>
            <span>LangGraph</span>
            <span>Next.js</span>
          </div>
        </motion.section>

        {/* ── How It Works ── */}
        <motion.section id="how" className="sec" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
          <motion.p className="sec-label" variants={fadeUp}>How It Works</motion.p>
          <motion.h2 className="sec-title" variants={fadeUp}>From RFP to Award in <span className="tg">Three Steps</span></motion.h2>
          <motion.p className="sec-desc" variants={fadeUp}>Every step is secured through Auth0 Token Vault, ensuring agents act only with your explicit authorization.</motion.p>
          <motion.div className="steps-grid" variants={stagger}>
            {steps.map((s) => (
              <motion.div key={s.num} className="step-card" variants={scaleIn}>
                <div className="step-num">{s.num}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* ── Features ── */}
        <motion.section id="features" className="sec" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}>
          <motion.p className="sec-label" variants={fadeUp}>Core Capabilities</motion.p>
          <motion.h2 className="sec-title" variants={fadeUp}>Built for the <span className="tg">Agentic AI Era</span></motion.h2>
          <motion.p className="sec-desc" variants={fadeUp}>Every component designed around Auth0 Token Vault the secure backbone for AI agents acting on your behalf.</motion.p>
          <motion.div className="bento" variants={stagger}>
            {features.map((f) => (
              <motion.div key={f.title} className="f-card" variants={scaleIn}>
                <div className={`f-icon ${f.c}`}><f.icon /></div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* ── Architecture Stats ── */}
        <motion.section id="arch" className="sec" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }}>
          <motion.p className="sec-label" variants={fadeUp}>System Architecture</motion.p>
          <motion.h2 className="sec-title" variants={fadeUp}>Three Services, <span className="tg">One Ecosystem</span></motion.h2>
          <motion.p className="sec-desc" variants={fadeUp}>
            Next.js orchestrates a Node.js backend (
            <code style={{ fontSize: ".85em", background: "rgba(99,102,241,0.07)", padding: "1px 4px", borderRadius: 4 }}>/api/bids</code>,{" "}
            <code style={{ fontSize: ".85em", background: "rgba(99,102,241,0.07)", padding: "1px 4px", borderRadius: 4 }}>/api/rfp</code>,{" "}
            <code style={{ fontSize: ".85em", background: "rgba(99,102,241,0.07)", padding: "1px 4px", borderRadius: 4 }}>/api/auth</code>)
            and a Python LLM engine unified through Auth0 Token Vault.
          </motion.p>
          <motion.div className="arch" variants={stagger}>
            {stats.map((s) => (
              <motion.div key={s.l} className="a-card" variants={scaleIn}>
                <div className="a-num">{s.n}</div>
                <div className="a-label">{s.l}</div>
                <div className="a-sub">{s.s}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* ── CTA ── */}
        <motion.section id="cta" className="cta-sec" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <div className="cta-card">
            <h2>Ready to Transform Procurement?</h2>
            <p>Deploy AI agents that evaluate bids, award contracts, and log every action transparently and securely.</p>
            <a href="/api/auth/login" className="btn-cta inline-flex items-center justify-center gap-2">Start Building <ArrowRight size={16} /></a>
          </div>
        </motion.section>

        {/* ── Footer ── */}
        <footer className="footer">
          <p>© 2026 Auth Ecosystem · Built for <a href="https://authorizedtoact.devpost.com/" target="_blank" rel="noopener noreferrer">Authorized to Act</a> · Backend API at <code style={{ fontSize: ".85em" }}>localhost:5000</code></p>
        </footer>
      </div>
    </>
  );
}

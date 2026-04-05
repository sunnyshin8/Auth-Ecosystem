import { TokenVaultInterrupt } from "@auth0/ai/interrupts";
import type { Auth0InterruptionUI } from "@auth0/ai-vercel/react";
import React from 'react';

interface TokenVaultInterruptHandlerProps {
  interrupt: Auth0InterruptionUI | null | undefined;
  onFinish?: () => void;
}

export function TokenVaultInterruptHandler({
  interrupt,
  onFinish,
}: TokenVaultInterruptHandlerProps) {
  if (!interrupt || !TokenVaultInterrupt.isInterrupt(interrupt)) {
    return null;
  }

  const message = interrupt.message || "You need to approve this action via your connected Auth0 Guardian device before the agent can proceed.";
  const isHighRisk = /high risk/i.test(message);
  const authorizationWindow = "10 minutes";

  // Simplified custom consent UI instead of relying on ai-components package
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/10 border border-white/20 p-8 rounded-2xl max-w-md w-full backdrop-blur-md shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-blue-500/20 to-transparent pointer-events-none" />
        
        <h3 className="text-2xl font-bold text-white mb-2 relative z-10">
          Authorization Required
        </h3>
        
        <p className="text-slate-300 mb-6 relative z-10 whitespace-pre-wrap">
          {message}
        </p>

        <div className="relative z-10 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-xl border border-white/15 bg-white/5 p-3">
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-1">Risk</p>
            <p className={`text-sm font-bold ${isHighRisk ? "text-amber-300" : "text-emerald-300"}`}>
              {isHighRisk ? "High" : "Standard"}
            </p>
          </div>
          <div className="rounded-xl border border-white/15 bg-white/5 p-3">
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-1">Scope</p>
            <p className="text-sm font-bold text-slate-100">contract:award</p>
          </div>
          <div className="rounded-xl border border-white/15 bg-white/5 p-3">
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-1">Window</p>
            <p className="text-sm font-bold text-slate-100">{authorizationWindow}</p>
          </div>
        </div>
        
        <div className="flex gap-4 relative z-10">
          <button 
            onClick={onFinish}
            className="flex-1 px-4 py-2 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors"
          >
            I have Approved
          </button>
        </div>
      </div>
    </div>
  );
}

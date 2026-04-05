"use client";

import { Shield, Clock, CheckCircle, Search, Cpu, UserCheck, Database, HardDrive, ExternalLink } from "lucide-react";
import Link from 'next/link';

const typeStyleMap: Record<string, string> = {
  READ: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  WRITE: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  PROCESS: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  AUTH: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

export default function AuditTrail() {
  const mockLogs = [
    { 
      id: 1, 
      action: "Contract Finalized (RFP-2026)", 
      type: "WRITE", 
      actor: "Human + Agent", 
      time: "2 mins ago", 
      status: "Confirmed", 
      hash: "0x8f72a...4c2a9d", 
      color: "blue" 
    },
    { 
      id: 2, 
      action: "Risk Assessment Generated", 
      type: "PROCESS", 
      actor: "IBM Granite 3.1", 
      time: "15 mins ago", 
      status: "Verified", 
      hash: "0x3a91b...1b9e82", 
      color: "violet" 
    },
    { 
      id: 3, 
      action: "Bid Data Decryption", 
      type: "READ", 
      actor: "Token Vault Proxy", 
      time: "1 hour ago", 
      status: "Verified", 
      hash: "0x91cc4...cc4f10", 
      color: "emerald" 
    },
    { 
      id: 4, 
      action: "CIBA Step-Up Request", 
      type: "AUTH", 
      actor: "Auth0 Guardian", 
      time: "1 hour ago", 
      status: "Authorized", 
      hash: "0x5d2a1...bb3e21", 
      color: "amber" 
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="mb-8 sm:mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-5 sm:gap-6">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-widest border border-blue-500/20">
              Live Ledger
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-3 tracking-tight">Blockchain Audit Trail</h1>
          <p className="text-slate-400 max-w-xl text-base sm:text-lg leading-relaxed">
            Every step the agent takes—from bid analysis to contract awarding—is recorded 
            immutably using Auth0 Token Vault state and mock blockchain hashes.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row w-full md:w-auto items-stretch sm:items-center gap-3 sm:gap-4">
           <div className="relative group w-full sm:w-auto">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Filter by hash..." 
              className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all w-full sm:w-64 backdrop-blur-xl" 
            />
          </div>
          <Link href="/dashboard" className="bg-white/10 hover:bg-white/20 text-white rounded-2xl px-6 py-3 text-sm font-medium transition-all backdrop-blur-xl border border-white/10 text-center">
            Back to Agent
          </Link>
        </div>
      </div>

      <div className="relative">
        {/* Decorative background glow */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/10 blur-[120px] pointer-events-none" />
        
        <div className="bg-white/5 border border-white/10 rounded-3xl sm:rounded-[2.5rem] backdrop-blur-2xl overflow-hidden shadow-2xl relative z-10">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10">
                  <th className="px-4 sm:px-8 py-5 sm:py-6 font-bold text-xs uppercase tracking-widest text-slate-400">Operation</th>
                  <th className="px-4 sm:px-8 py-5 sm:py-6 font-bold text-xs uppercase tracking-widest text-slate-400">Entity</th>
                  <th className="px-4 sm:px-8 py-5 sm:py-6 font-bold text-xs uppercase tracking-widest text-slate-400">Time</th>
                  <th className="px-4 sm:px-8 py-5 sm:py-6 font-bold text-xs uppercase tracking-widest text-slate-400">L1 Hash</th>
                  <th className="px-4 sm:px-8 py-5 sm:py-6 font-bold text-xs uppercase tracking-widest text-slate-400 text-right">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {mockLogs.map((log) => (
                  <tr key={log.id} className="group hover:bg-white/10 transition-all duration-300">
                    <td className="px-4 sm:px-8 py-5 sm:py-6">
                       <div className="flex items-center gap-4">
                        <div className={`p-2.5 rounded-xl border ${typeStyleMap[log.type] || typeStyleMap.PROCESS}`}>
                          {log.type === 'READ' && <Database size={18} />}
                          {log.type === 'WRITE' && <Cpu size={18} />}
                          {log.type === 'PROCESS' && <HardDrive size={18} />}
                          {log.type === 'AUTH' && <Shield size={18} />}
                        </div>
                        <div>
                          <p className="font-bold text-white text-base group-hover:text-blue-400 transition-colors">{log.action}</p>
                          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-tighter mt-0.5">{log.type} SUB-COMMAND</p>
                        </div>
                       </div>
                    </td>
                    <td className="px-4 sm:px-8 py-5 sm:py-6">
                      <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 w-fit">
                        {log.actor.includes("Human") ? <UserCheck size={14} className="text-amber-400" /> : <Cpu size={14} className="text-blue-400" />}
                        <span className="text-sm font-medium text-slate-200">{log.actor}</span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-8 py-5 sm:py-6 text-slate-400">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock size={14} className="opacity-50" /> {log.time}
                      </div>
                    </td>
                    <td className="px-4 sm:px-8 py-5 sm:py-6">
                      <code className="text-xs font-mono text-slate-500 group-hover:text-blue-300 transition-colors bg-black/20 px-2 py-1 rounded">
                        {log.hash}
                      </code>
                    </td>
                    <td className="px-4 sm:px-8 py-5 sm:py-6 text-right">
                      <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-[10px] border border-emerald-500/20 uppercase tracking-wider backdrop-blur-md">
                        <CheckCircle size={14} /> {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-10 sm:mt-12 p-5 sm:p-8 rounded-3xl sm:rounded-[2rem] bg-gradient-to-r from-blue-600/20 to-violet-600/20 border border-white/10 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 sm:gap-8">
        <div className="max-w-2xl">
          <h3 className="text-xl sm:text-2xl font-bold mb-2">Immutable Trust Model</h3>
          <p className="text-slate-300 leading-relaxed">
            Every transaction ID resolves to a cryptographically signed event stored in the Auth0 Token Vault Audit Log. 
            This ensures that even if the AI compromises its local context, the source of truth remains governed.
          </p>
        </div>
        <button className="w-full sm:w-auto whitespace-nowrap bg-white text-blue-900 font-bold px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl">
          Export full TLS-Notary Proof
        </button>
      </div>
    </div>
  );
}

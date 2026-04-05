import React from 'react';
import { Shield, Database, Lock, Activity, CheckCircle2, AlertCircle } from "lucide-react";

interface Permission {
  id: string;
  title: string;
  description: string;
  status: 'allowed' | 'step-up' | 'denied';
  icon: React.ReactNode;
}

const permissions: Permission[] = [
  {
    id: 'read:bids',
    title: 'read:bids',
    description: 'Grant agent access to view all active RFP submissions and vendor profiles.',
    status: 'allowed',
    icon: <Database size={18} />
  },
  {
    id: 'write:evaluations',
    title: 'write:evaluations',
    description: 'Allow agent to generate technical scores and risk assessments.',
    status: 'allowed',
    icon: <Activity size={18} />
  },
  {
    id: 'contract:award',
    title: 'contract:award',
    description: 'High-stakes: Authorize agent to finalize legal contracts and fund allocations.',
    status: 'step-up',
    icon: <Lock size={18} />
  }
];

export function PermissionDashboard() {
  return (
    <div className="perm-card">
      <div className="perm-glow" />

      <div className="perm-head">
        <div className="perm-title-wrap">
          <div className="perm-icon-wrap">
            <Shield size={20} />
          </div>
          <div>
            <h2 className="perm-title">Agent Permissions</h2>
            <p className="perm-subtitle">Auth0 Token Vault Scopes</p>
          </div>
        </div>
      </div>

      <div className="perm-list">
        {permissions.map((p) => (
          <div key={p.id} className="perm-item">
            <div className="perm-item-inner">
              <div className={`perm-item-icon ${
                p.status === 'allowed' ? 'ok' : 'step'
              }`}>
                {p.icon}
              </div>
              <div className="perm-item-body">
                <div className="perm-item-top">
                  <span className="perm-scope">{p.title}</span>
                  {p.status === 'allowed' ? (
                    <div className="perm-chip ok">
                      <CheckCircle2 size={10} /> Authorized
                    </div>
                  ) : (
                    <div className="perm-chip step">
                      <AlertCircle size={10} /> Step-Up Req.
                    </div>
                  )}
                </div>
                <p className="perm-desc">
                  {p.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="perm-foot">
        <div className="perm-note-wrap">
          <p className="perm-note">
            <strong>Security Isolation:</strong> This agent uses a Scoped Access Token managed by Auth0 Token Vault. The user maintains full control and can revoke these permissions at any time via the Auth0 dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}

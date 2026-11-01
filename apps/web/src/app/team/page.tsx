'use client';

import React from 'react';
import { Users, UserPlus, Shield, CheckCircle2 } from 'lucide-react';
import { SignatureHeroCard } from '@/components/hero/SignatureHeroCard';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import { ROLE_LABELS } from '@synergy/shared';

export default function TeamPage() {
  const { getCurrentBusiness } = useWorkspaceStore();
  const business = getCurrentBusiness();

  const members = [
    {
      id: 'm-1',
      name: 'Alex Vance',
      email: 'alex@crosstech.io',
      role: 'super_admin',
      assignedWorkspaces: 'All Businesses',
      status: 'Active',
    },
    {
      id: 'm-2',
      name: 'Elena Rostova',
      email: 'elena@aura-apparel.com',
      role: 'business_admin',
      assignedWorkspaces: 'Aura Apparel',
      status: 'Active',
    },
    {
      id: 'm-3',
      name: 'Marcus Chen',
      email: 'marcus@crosstech.io',
      role: 'marketing_manager',
      assignedWorkspaces: 'Aura Apparel, Novacode SaaS',
      status: 'Active',
    },
    {
      id: 'm-4',
      name: 'Sarah Jenkins',
      email: 'sarah@creatives.io',
      role: 'designer',
      assignedWorkspaces: 'Aura Apparel',
      status: 'Active',
    },
  ];

  return (
    <div className="animate-page-enter space-y-5">
      <SignatureHeroCard
        tagBadge={`${business?.name || 'Business'} • Team & Governance`}
        title="Team Members & Role-Based Permissions (RBAC)"
        description="Manage human team access. Granular permission scoping per business workspace ensures an employee assigned to one business cannot view or publish to another."
        primaryAction={
          <button type="button" className="btn-hero-primary">
            <UserPlus className="w-3.5 h-3.5" />
            <span>Invite Team Member</span>
          </button>
        }
      />

      <div className="card p-5 space-y-3">
        <div className="border-b border-border pb-3 flex items-center justify-between">
          <div>
            <h3 className="font-heading font-bold text-base text-neutral-900">
              Workspace Team Members
            </h3>
            <p className="text-xs text-muted">
              Employees with active permissions on {business?.name}
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-500">
            {members.length} Members
          </span>
        </div>

        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-border text-slate-400 font-bold uppercase text-[10px]">
              <th className="py-2.5">Member Name</th>
              <th className="py-2.5">Email</th>
              <th className="py-2.5">Assigned Role</th>
              <th className="py-2.5">Workspace Scope</th>
              <th className="py-2.5">Status</th>
              <th className="py-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-slate-50">
                <td className="py-3 font-semibold text-neutral-900 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-neutral-900 text-white text-[10px] font-bold flex items-center justify-center">
                    {member.name.charAt(0)}
                  </div>
                  <span>{member.name}</span>
                </td>
                <td className="py-3 font-mono text-slate-600">{member.email}</td>
                <td className="py-3">
                  <span className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-bold text-[10.5px]">
                    {ROLE_LABELS[member.role as keyof typeof ROLE_LABELS] || member.role}
                  </span>
                </td>
                <td className="py-3 text-slate-600">{member.assignedWorkspaces}</td>
                <td className="py-3">
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {member.status}
                  </span>
                </td>
                <td className="py-3 text-right">
                  <button type="button" className="text-blue-600 font-bold hover:underline">
                    Edit Role
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


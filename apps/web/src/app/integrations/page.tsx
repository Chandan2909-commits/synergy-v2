'use client';

import React from 'react';
import {
  Share2,
  Instagram,
  Linkedin,
  Twitter,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { SignatureHeroCard } from '@/components/hero/SignatureHeroCard';
import { useWorkspaceStore } from '@/stores/workspaceStore';

export default function IntegrationsPage() {
  const { getCurrentBusiness } = useWorkspaceStore();
  const business = getCurrentBusiness();

  const platforms = [
    {
      id: 'instagram',
      name: 'Instagram Graph API',
      accountName: '@aura.apparel.official',
      accountId: 'ig_948271048',
      status: 'Connected',
      isConnected: true,
      lastSync: '10m ago',
      tokenHealth: 'Valid (Expires in 58 days)',
      permissions: ['instagram_basic', 'instagram_content_publish', 'pages_read_engagement'],
      icon: Instagram,
      color: 'text-pink-600',
    },
    {
      id: 'linkedin',
      name: 'LinkedIn Community & Marketing API',
      accountName: 'Aura Apparel Global Inc.',
      accountId: 'urn:li:organization:849204',
      status: 'Connected',
      isConnected: true,
      lastSync: '22m ago',
      tokenHealth: 'Valid (Expires in 42 days)',
      permissions: ['w_member_social', 'w_organization_social', 'r_organization_social'],
      icon: Linkedin,
      color: 'text-blue-700',
    },
    {
      id: 'x',
      name: 'X (Twitter) Developer API v2',
      accountName: '@AuraApparelHQ',
      accountId: 'x_1294801824',
      status: 'Connected',
      isConnected: true,
      lastSync: '1h ago',
      tokenHealth: 'Valid (OAuth 2.0 PKCE)',
      permissions: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'],
      icon: Twitter,
      color: 'text-neutral-900',
    },
  ];

  return (
    <div className="animate-page-enter space-y-5">
      <SignatureHeroCard
        tagBadge={`${business?.name || 'Business'} • Platform Integrations`}
        title="Social Media Channels & Official API Connectors"
        description="Official OAuth 2.0 connectors for Instagram, LinkedIn, and X. Deterministic publishing engine checks platform eligibility, media dimension constraints, and rate limits prior to dispatch."
        primaryAction={
          <button type="button" className="btn-hero-primary">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync All Tokens</span>
          </button>
        }
      />

      <div className="grid grid-cols-3 gap-5">
        {platforms.map((plat) => {
          const Icon = plat.icon;
          return (
            <div key={plat.id} className="card p-6 flex flex-col justify-between space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                    <Icon className={`w-5 h-5 ${plat.color}`} />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-sm text-neutral-900">
                      {plat.name}
                    </h3>
                    <span className="text-xs font-semibold text-slate-500">
                      {plat.accountName}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-pill border border-emerald-200">
                  {plat.status}
                </span>
              </div>

              <div className="space-y-2 py-2 border-y border-border text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Account ID</span>
                  <span className="font-mono text-slate-700">{plat.accountId}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Token Health</span>
                  <span className="text-emerald-600 font-semibold">{plat.tokenHealth}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Last Synchronized</span>
                  <span className="text-slate-700">{plat.lastSync}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Granted API Permissions
                </span>
                <div className="flex flex-wrap gap-1">
                  {plat.permissions.map((perm) => (
                    <span
                      key={perm}
                      className="text-[9.5px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded"
                    >
                      {perm}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" className="btn btn-secondary text-xs">
                  Re-authenticate
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


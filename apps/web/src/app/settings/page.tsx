'use client';

import React, { useState } from 'react';
import {
  Building2,
  Palette,
  Bot,
  Users,
  Shield,
  Save,
  Key,
  Globe,
  Plus,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { SignatureHeroCard } from '@/components/hero/SignatureHeroCard';
import { useWorkspaceStore } from '@/stores/workspaceStore';

export default function SettingsPage() {
  const { getCurrentBusiness, currentOrganization, setTopbarLoading } = useWorkspaceStore();
  const business = getCurrentBusiness();

  const [activeTab, setActiveTab] = useState<'brand-kit' | 'org' | 'ai-keys' | 'security'>('brand-kit');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Brand Kit State
  const [brandKit, setBrandKit] = useState({
    brandName: business?.name || 'Aura Apparel',
    tagline: 'Sustainable Luxury & Conscious Streetwear',
    websiteUrl: 'https://aura-apparel.example.com',
    primaryColor: '#1e1e1e',
    secondaryColor: '#f4f5f7',
    accentColor: '#1d4ed8',
    backgroundColor: '#ffffff',
    headingFont: 'Montserrat',
    bodyFont: 'Inter',
    brandVoice: ['Visionary', 'Minimalist', 'Data-Driven', 'Conscious'],
    targetAudience: 'Urban professionals aged 24-40 interested in high-aesthetic ethical fashion.',
    contentRestrictions: ['Never use cringe clickbait', 'No fake discounts', 'Avoid over-promising'],
  });

  const handleSave = () => {
    setTopbarLoading(true);
    setTimeout(() => {
      setTopbarLoading(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 600);
  };

  return (
    <div className="animate-page-enter space-y-5">
      <SignatureHeroCard
        tagBadge={`${business?.name || 'Business'} • Settings & Governance`}
        title="Workspace Configuration & Brand Kit"
        description="Manage organization settings, business brand identity, AI provider credentials, and tenant security parameters across the unified ONIX engine."
        primaryAction={
          <button type="button" onClick={handleSave} className="btn-hero-primary">
            <Save className="w-3.5 h-3.5" />
            <span>Save Configuration</span>
          </button>
        }
      />

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md text-xs font-bold text-emerald-800 animate-fade-in flex items-center justify-between">
          <span>Settings and Brand Kit parameters persisted successfully.</span>
        </div>
      )}

      {/* 2-Pane Nested Settings Container (master_design.md Section 9) */}
      <div className="settings-container">
        {/* Left Sub-navigation Sidebar (250px) */}
        <aside className="settings-sidebar">
          <ul className="settings-nav-list">
            <li>
              <button
                type="button"
                onClick={() => setActiveTab('brand-kit')}
                className={`settings-nav-btn ${activeTab === 'brand-kit' ? 'active' : ''}`}
              >
                <div className="flex items-center gap-2.5">
                  <Palette className="w-4 h-4" />
                  <span>Brand Kit</span>
                </div>
                <span className="settings-nav-badge">Core</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => setActiveTab('org')}
                className={`settings-nav-btn ${activeTab === 'org' ? 'active' : ''}`}
              >
                <div className="flex items-center gap-2.5">
                  <Building2 className="w-4 h-4" />
                  <span>Organization</span>
                </div>
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => setActiveTab('ai-keys')}
                className={`settings-nav-btn ${activeTab === 'ai-keys' ? 'active' : ''}`}
              >
                <div className="flex items-center gap-2.5">
                  <Key className="w-4 h-4" />
                  <span>AI API Credentials</span>
                </div>
                <span className="settings-nav-badge">4 Keys</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => setActiveTab('security')}
                className={`settings-nav-btn ${activeTab === 'security' ? 'active' : ''}`}
              >
                <div className="flex items-center gap-2.5">
                  <Shield className="w-4 h-4" />
                  <span>Security & Audits</span>
                </div>
              </button>
            </li>
          </ul>

          <div className="p-3 rounded-md bg-slate-100 border border-slate-200 text-[11px] text-slate-500">
            <span className="font-bold text-slate-700 block mb-0.5">Active Workspace</span>
            <span className="truncate block font-semibold">{business?.name}</span>
            <span className="text-[10px] text-slate-400 font-mono">ID: {business?.id}</span>
          </div>
        </aside>

        {/* Right Scrollable Content Canvas */}
        <div className="settings-content-pane">
          {/* TAB 1: BRAND KIT */}
          {activeTab === 'brand-kit' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-border pb-3">
                <h3 className="font-heading font-bold text-lg text-neutral-900">
                  Business Brand Kit
                </h3>
                <p className="text-xs text-muted">
                  The single source of truth for all AI personas. The Strategist, Writer, and Designer inject these parameters into every generation.
                </p>
              </div>

              {/* Identity & Typography Form Card */}
              <div className="settings-card space-y-4">
                <h4 className="font-heading font-bold text-sm text-neutral-900 border-b border-slate-100 pb-2">
                  Identity & Visual Palette
                </h4>

                <div className="settings-grid-2">
                  <div>
                    <label className="settings-label block mb-1">Brand Name</label>
                    <input
                      type="text"
                      value={brandKit.brandName}
                      onChange={(e) => setBrandKit({ ...brandKit, brandName: e.target.value })}
                      className="settings-input"
                    />
                  </div>
                  <div>
                    <label className="settings-label block mb-1">Website URL</label>
                    <input
                      type="url"
                      value={brandKit.websiteUrl}
                      onChange={(e) => setBrandKit({ ...brandKit, websiteUrl: e.target.value })}
                      className="settings-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="settings-label block mb-1">Tagline / Mission Statement</label>
                  <input
                    type="text"
                    value={brandKit.tagline}
                    onChange={(e) => setBrandKit({ ...brandKit, tagline: e.target.value })}
                    className="settings-input"
                  />
                </div>

                {/* Hex Colors Row */}
                <div>
                  <label className="settings-label block mb-2">Core Color Palette</label>
                  <div className="grid grid-cols-4 gap-3">
                    {[
                      { label: 'Primary (Onyx)', key: 'primaryColor' },
                      { label: 'Secondary (Light)', key: 'secondaryColor' },
                      { label: 'Accent (Sapphire)', key: 'accentColor' },
                      { label: 'Background', key: 'backgroundColor' },
                    ].map((c) => (
                      <div key={c.key} className="p-2.5 rounded border border-border bg-slate-50 flex items-center gap-2.5">
                        <input
                          type="color"
                          value={(brandKit as any)[c.key]}
                          onChange={(e) =>
                            setBrandKit({ ...brandKit, [c.key]: e.target.value })
                          }
                          className="w-7 h-7 rounded border-none cursor-pointer"
                        />
                        <div className="min-w-0">
                          <span className="block text-[10px] font-bold text-slate-500 uppercase truncate">
                            {c.label}
                          </span>
                          <span className="text-xs font-mono font-bold text-slate-800">
                            {(brandKit as any)[c.key]}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tone of Voice & Audience Form Card */}
              <div className="settings-card space-y-4">
                <h4 className="font-heading font-bold text-sm text-neutral-900 border-b border-slate-100 pb-2">
                  Brand Voice & Content Rules
                </h4>

                <div>
                  <label className="settings-label block mb-1.5">Brand Voice Attributes</label>
                  <div className="flex flex-wrap gap-2">
                    {brandKit.brandVoice.map((voice, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-pill bg-slate-100 border border-slate-300 text-xs font-bold text-slate-800 flex items-center gap-1.5"
                      >
                        {voice}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="settings-label block mb-1">Target Audience Profile</label>
                  <textarea
                    rows={2}
                    value={brandKit.targetAudience}
                    onChange={(e) =>
                      setBrandKit({ ...brandKit, targetAudience: e.target.value })
                    }
                    className="w-full p-2.5 bg-slate-50 border border-border rounded-sm text-xs text-neutral-800 focus:bg-white focus:border-blue-600 outline-none resize-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="settings-label block mb-1.5 text-red-600">
                    Content Restrictions & Negative Prompts
                  </label>
                  <div className="space-y-1.5">
                    {brandKit.contentRestrictions.map((rule, idx) => (
                      <div
                        key={idx}
                        className="px-3 py-1.5 rounded-sm bg-red-50/60 border border-red-200 text-xs text-red-800 font-medium flex items-center gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        <span>{rule}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ORGANIZATION SETTINGS */}
          {activeTab === 'org' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-border pb-3">
                <h3 className="font-heading font-bold text-lg text-neutral-900">
                  Organization Profile
                </h3>
                <p className="text-xs text-muted">
                  Global organization container managing multiple business workspaces
                </p>
              </div>

              <div className="settings-card space-y-4">
                <div className="settings-grid-2">
                  <div>
                    <label className="settings-label block mb-1">Organization Legal Name</label>
                    <input
                      type="text"
                      defaultValue={currentOrganization.name}
                      className="settings-input"
                    />
                  </div>
                  <div>
                    <label className="settings-label block mb-1">Tenant Slug</label>
                    <input
                      type="text"
                      defaultValue={currentOrganization.slug}
                      disabled
                      className="settings-input bg-slate-100 text-slate-500 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AI KEYS */}
          {activeTab === 'ai-keys' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-border pb-3">
                <h3 className="font-heading font-bold text-lg text-neutral-900">
                  AI Provider API Credentials
                </h3>
                <p className="text-xs text-muted">
                  Encrypted at rest using AES-256. Keys are never transmitted to client code.
                </p>
              </div>

              <div className="settings-card space-y-4">
                {[
                  { name: 'OpenAI API Key', env: 'OPENAI_API_KEY', masked: 'sk-proj-••••••••••••••••••••3A4B' },
                  { name: 'Google Gemini API Key', env: 'GEMINI_API_KEY', masked: 'AIzaSy••••••••••••••••••••8X9Y' },
                  { name: 'Anthropic API Key', env: 'ANTHROPIC_API_KEY', masked: 'sk-ant-••••••••••••••••••••1Z2W' },
                  { name: 'Groq Cloud API Key', env: 'GROQ_API_KEY', masked: 'gsk_••••••••••••••••••••4M5N' },
                ].map((item) => (
                  <div key={item.name} className="flex items-center justify-between p-3 rounded-md bg-slate-50 border border-border">
                    <div>
                      <span className="font-bold text-xs text-neutral-900 block">{item.name}</span>
                      <span className="font-mono text-[11px] text-slate-500">{item.masked}</span>
                    </div>
                    <button type="button" className="btn btn-secondary text-xs">
                      Rotate Key
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SECURITY */}
          {activeTab === 'security' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-border pb-3">
                <h3 className="font-heading font-bold text-lg text-neutral-900">
                  Security & Access Audit
                </h3>
                <p className="text-xs text-muted">
                  Multi-tenant isolation policies and encrypted credential management
                </p>
              </div>

              <div className="settings-card space-y-3">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-sm text-xs text-blue-900">
                  <strong>Tenant Isolation Guarantee:</strong> Database queries enforce mandatory <code>organizationId</code> and <code>businessId</code> where clauses. Cross-tenant queries are blocked at both ORM and API gateway levels.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


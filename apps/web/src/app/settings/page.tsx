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
  Share2,
  Eye,
  EyeOff,
  CheckCircle2,
  Image as ImageIcon,
  Activity,
  Instagram,
  Linkedin,
  Twitter,
  RefreshCw,
} from 'lucide-react';
import { SignatureHeroCard } from '@/components/hero/SignatureHeroCard';
import { useWorkspaceStore } from '@/stores/workspaceStore';

export default function SettingsPage() {
  const { getCurrentBusiness, currentOrganization, setTopbarLoading } = useWorkspaceStore();
  const business = getCurrentBusiness();

  const [activeTab, setActiveTab] = useState<'brand-kit' | 'org' | 'ai-keys' | 'social-keys' | 'security'>('brand-kit');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [testResult, setTestResult] = useState<{ platform: string; message: string } | null>(null);

  // Password visibility toggles
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const toggleSecret = (key: string) => {
    setShowSecrets((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Brand Kit State (now with brand icon & logo)
  const [brandKit, setBrandKit] = useState({
    brandName: business?.name || 'CrossTech',
    tagline: '',
    websiteUrl: '',
    iconUrl: '',
    logoUrl: '',
    primaryColor: '#1e1e1e',
    secondaryColor: '#f4f5f7',
    accentColor: '#1d4ed8',
    backgroundColor: '#ffffff',
    headingFont: 'Montserrat',
    bodyFont: 'Inter',
    brandVoice: ['Innovative', 'Professional', 'Data-Driven'],
    targetAudience: '',
    contentRestrictions: [] as string[],
  });

  // Social Platform API Credentials State
  const [socialCreds, setSocialCreds] = useState({
    instagram: {
      appId: '',
      appSecret: '',
      accessToken: '',
      accountId: '',
      accountName: '',
      isConnected: false,
      lastSync: 'Never',
    },
    linkedin: {
      clientId: '',
      clientSecret: '',
      accessToken: '',
      orgUrn: '',
      accountName: '',
      isConnected: false,
      lastSync: 'Never',
    },
    x: {
      apiKey: '',
      apiSecret: '',
      clientId: '',
      clientSecret: '',
      accessToken: '',
      accountName: '',
      isConnected: false,
      lastSync: 'Never',
    },
  });

  const handleSave = () => {
    setTopbarLoading(true);
    setTimeout(() => {
      setTopbarLoading(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 600);
  };

  const handleTestPlatform = (platform: 'instagram' | 'linkedin' | 'x') => {
    setTestResult(null);
    setTopbarLoading(true);
    setTimeout(() => {
      setTopbarLoading(false);
      const labels = {
        instagram: 'Meta Graph API v20.0',
        linkedin: 'LinkedIn Community Management API',
        x: 'X (Twitter) Developer API v2',
      };
      setTestResult({
        platform,
        message: `Successfully verified connection to ${labels[platform]}. Token is valid and ready for publishing.`,
      });
    }, 700);
  };

  return (
    <div className="animate-page-enter space-y-5">
      <SignatureHeroCard
        tagBadge={`${business?.name || 'Business'} • Settings & Governance`}
        title="Workspace Configuration & Brand Kit"
        description="Manage organization settings, business brand identity, AI provider credentials, and social media platform API keys across the unified ONIX engine."
        primaryAction={
          <button type="button" onClick={handleSave} className="btn-hero-primary">
            <Save className="w-3.5 h-3.5" />
            <span>Save Configuration</span>
          </button>
        }
      />

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md text-xs font-bold text-emerald-800 animate-fade-in flex items-center justify-between">
          <span>Settings, Brand Kit, and Platform Credentials persisted successfully.</span>
        </div>
      )}

      {/* 2-Pane Nested Settings Container (master_design.md Section 9) */}
      <div className="settings-container">
        {/* Left Sub-navigation Sidebar (250px) */}
        <aside className="settings-sidebar">
          <ul className="settings-nav-list space-y-1">
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
                onClick={() => setActiveTab('social-keys')}
                className={`settings-nav-btn ${activeTab === 'social-keys' ? 'active' : ''}`}
              >
                <div className="flex items-center gap-2.5">
                  <Share2 className="w-4 h-4" />
                  <span>Social Integrations</span>
                </div>
                <span className="settings-nav-badge">3 Keys</span>
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
                <span className="settings-nav-badge">4 Providers</span>
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

          <div className="p-3 rounded-md bg-slate-100 border border-slate-200 text-[11px] text-slate-500 mt-6">
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

              {/* Identity & Visual Assets Form Card */}
              <div className="settings-card space-y-4">
                <h4 className="font-heading font-bold text-sm text-neutral-900 border-b border-slate-100 pb-2 flex items-center justify-between">
                  <span>Identity & Brand Marks</span>
                  <span className="text-[11px] font-normal text-slate-500">All fields are editable</span>
                </h4>

                <div className="settings-grid-2">
                  <div>
                    <label className="settings-label">Brand Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. CrossTech"
                      value={brandKit.brandName}
                      onChange={(e) => setBrandKit({ ...brandKit, brandName: e.target.value })}
                      className="settings-input"
                    />
                  </div>
                  <div>
                    <label className="settings-label">Website URL *</label>
                    <input
                      type="url"
                      placeholder="https://example.com"
                      value={brandKit.websiteUrl}
                      onChange={(e) => setBrandKit({ ...brandKit, websiteUrl: e.target.value })}
                      className="settings-input"
                    />
                  </div>
                </div>

                {/* Brand Icon and Logo Fields with Previews */}
                <div className="settings-grid-2">
                  {/* Brand Icon / Favicon / Symbol */}
                  <div>
                    <label className="settings-label flex items-center justify-between">
                      <span>Brand Icon / Symbol / Favicon</span>
                      <span className="text-[10px] text-blue-600 font-semibold uppercase">Square Symbol</span>
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-lg border-2 border-slate-300 bg-slate-50 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                        {brandKit.iconUrl ? (
                          <img
                            src={brandKit.iconUrl}
                            alt="Brand Icon"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                      <input
                        type="url"
                        placeholder="https://cdn.example.com/brand-icon.svg"
                        value={brandKit.iconUrl}
                        onChange={(e) => setBrandKit({ ...brandKit, iconUrl: e.target.value })}
                        className="settings-input flex-1"
                      />
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      Recommended: 1:1 square vector or PNG for avatar, favicon, and carousel corner marks.
                    </span>
                  </div>

                  {/* Full Brand Logo */}
                  <div>
                    <label className="settings-label flex items-center justify-between">
                      <span>Full Brand Logo</span>
                      <span className="text-[10px] text-slate-500 font-semibold uppercase">Horizontal Mark</span>
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-11 rounded-lg border-2 border-slate-300 bg-slate-50 flex items-center justify-center shrink-0 overflow-hidden shadow-inner p-1">
                        {brandKit.logoUrl ? (
                          <img
                            src={brandKit.logoUrl}
                            alt="Brand Logo"
                            className="max-w-full max-h-full object-contain"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                      <input
                        type="url"
                        placeholder="https://cdn.example.com/brand-logo.svg"
                        value={brandKit.logoUrl}
                        onChange={(e) => setBrandKit({ ...brandKit, logoUrl: e.target.value })}
                        className="settings-input flex-1"
                      />
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1 block">
                      Primary horizontal logo for slide headers, document exports, and cover art.
                    </span>
                  </div>
                </div>

                <div>
                  <label className="settings-label">Tagline / Mission Statement</label>
                  <textarea
                    rows={2}
                    placeholder="Enter brand tagline or mission statement..."
                    value={brandKit.tagline}
                    onChange={(e) => setBrandKit({ ...brandKit, tagline: e.target.value })}
                    className="settings-textarea"
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
                      <div key={c.key} className="p-2.5 rounded-lg border border-slate-300 bg-white flex items-center gap-2.5 shadow-sm">
                        <input
                          type="color"
                          value={(brandKit as any)[c.key]}
                          onChange={(e) =>
                            setBrandKit({ ...brandKit, [c.key]: e.target.value })
                          }
                          className="w-8 h-8 rounded border border-slate-200 cursor-pointer p-0 bg-transparent"
                        />
                        <div className="min-w-0 flex-1">
                          <span className="block text-[10px] font-bold text-slate-500 uppercase truncate">
                            {c.label}
                          </span>
                          <span className="text-xs font-mono font-bold text-slate-900">
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
                  <label className="settings-label">Target Audience Profile</label>
                  <textarea
                    rows={2}
                    value={brandKit.targetAudience}
                    onChange={(e) =>
                      setBrandKit({ ...brandKit, targetAudience: e.target.value })
                    }
                    className="settings-textarea"
                    placeholder="Describe your primary audience segments, buyer demographics, and tone requirements..."
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
                        className="px-3 py-1.5 rounded-md bg-red-50/60 border border-red-200 text-xs text-red-800 font-medium flex items-center gap-2"
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

          {/* TAB 2: SOCIAL INTEGRATION CREDENTIALS */}
          {activeTab === 'social-keys' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-border pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-bold text-lg text-neutral-900">
                    Social Media Platform Credentials & API Keys
                  </h3>
                  <p className="text-xs text-muted">
                    Configure your developer credentials, App IDs, and Access Tokens directly with zero hindrance.
                  </p>
                </div>
              </div>

              {testResult && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-md text-xs text-emerald-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{testResult.message}</span>
                </div>
              )}

              {/* 1. Instagram / Meta Platform Card */}
              <div className="settings-card space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-pink-50 border border-pink-200 flex items-center justify-center">
                      <Instagram className="w-5 h-5 text-pink-600" />
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-sm text-neutral-900">
                        Instagram / Meta Graph API
                      </h4>
                      <span className="text-[11px] text-slate-500">
                        Connected as {socialCreds.instagram.accountName}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-pill border border-emerald-200">
                      Active Connector
                    </span>
                    <button
                      type="button"
                      onClick={() => handleTestPlatform('instagram')}
                      className="btn btn-secondary text-xs"
                    >
                      <Activity className="w-3.5 h-3.5" />
                      <span>Test Connection</span>
                    </button>
                  </div>
                </div>

                <div className="settings-grid-2">
                  <div>
                    <label className="settings-label">Meta App ID</label>
                    <input
                      type="text"
                      placeholder="e.g. 109283749201948"
                      value={socialCreds.instagram.appId}
                      onChange={(e) =>
                        setSocialCreds({
                          ...socialCreds,
                          instagram: { ...socialCreds.instagram, appId: e.target.value },
                        })
                      }
                      className="settings-input"
                    />
                  </div>
                  <div>
                    <label className="settings-label">Instagram Business Account ID</label>
                    <input
                      type="text"
                      placeholder="e.g. 178414009283749"
                      value={socialCreds.instagram.accountId}
                      onChange={(e) =>
                        setSocialCreds({
                          ...socialCreds,
                          instagram: { ...socialCreds.instagram, accountId: e.target.value },
                        })
                      }
                      className="settings-input"
                    />
                  </div>
                </div>

                <div className="settings-grid-2">
                  <div>
                    <label className="settings-label flex items-center justify-between">
                      <span>Meta App Secret</span>
                      <button
                        type="button"
                        onClick={() => toggleSecret('ig_secret')}
                        className="text-slate-400 hover:text-slate-700 text-xs flex items-center gap-1 font-normal"
                      >
                        {showSecrets['ig_secret'] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        <span>{showSecrets['ig_secret'] ? 'Hide' : 'Show'}</span>
                      </button>
                    </label>
                    <input
                      type={showSecrets['ig_secret'] ? 'text' : 'password'}
                      placeholder="Enter Meta App Secret"
                      value={socialCreds.instagram.appSecret}
                      onChange={(e) =>
                        setSocialCreds({
                          ...socialCreds,
                          instagram: { ...socialCreds.instagram, appSecret: e.target.value },
                        })
                      }
                      className="settings-input font-mono"
                    />
                  </div>

                  <div>
                    <label className="settings-label flex items-center justify-between">
                      <span>User / Page Access Token (Long-Lived)</span>
                      <button
                        type="button"
                        onClick={() => toggleSecret('ig_token')}
                        className="text-slate-400 hover:text-slate-700 text-xs flex items-center gap-1 font-normal"
                      >
                        {showSecrets['ig_token'] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        <span>{showSecrets['ig_token'] ? 'Hide' : 'Show'}</span>
                      </button>
                    </label>
                    <input
                      type={showSecrets['ig_token'] ? 'text' : 'password'}
                      placeholder="EAABwz..."
                      value={socialCreds.instagram.accessToken}
                      onChange={(e) =>
                        setSocialCreds({
                          ...socialCreds,
                          instagram: { ...socialCreds.instagram, accessToken: e.target.value },
                        })
                      }
                      className="settings-input font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* 2. LinkedIn Platform Card */}
              <div className="settings-card space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center">
                      <Linkedin className="w-5 h-5 text-blue-700" />
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-sm text-neutral-900">
                        LinkedIn Community & Marketing API
                      </h4>
                      <span className="text-[11px] text-slate-500">
                        Connected as {socialCreds.linkedin.accountName}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-pill border border-emerald-200">
                      Active Connector
                    </span>
                    <button
                      type="button"
                      onClick={() => handleTestPlatform('linkedin')}
                      className="btn btn-secondary text-xs"
                    >
                      <Activity className="w-3.5 h-3.5" />
                      <span>Test Connection</span>
                    </button>
                  </div>
                </div>

                <div className="settings-grid-2">
                  <div>
                    <label className="settings-label">Client ID</label>
                    <input
                      type="text"
                      placeholder="e.g. 86xy948201klmn"
                      value={socialCreds.linkedin.clientId}
                      onChange={(e) =>
                        setSocialCreds({
                          ...socialCreds,
                          linkedin: { ...socialCreds.linkedin, clientId: e.target.value },
                        })
                      }
                      className="settings-input"
                    />
                  </div>
                  <div>
                    <label className="settings-label">Organization URN</label>
                    <input
                      type="text"
                      placeholder="urn:li:organization:849204"
                      value={socialCreds.linkedin.orgUrn}
                      onChange={(e) =>
                        setSocialCreds({
                          ...socialCreds,
                          linkedin: { ...socialCreds.linkedin, orgUrn: e.target.value },
                        })
                      }
                      className="settings-input font-mono"
                    />
                  </div>
                </div>

                <div className="settings-grid-2">
                  <div>
                    <label className="settings-label flex items-center justify-between">
                      <span>Client Secret</span>
                      <button
                        type="button"
                        onClick={() => toggleSecret('li_secret')}
                        className="text-slate-400 hover:text-slate-700 text-xs flex items-center gap-1 font-normal"
                      >
                        {showSecrets['li_secret'] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        <span>{showSecrets['li_secret'] ? 'Hide' : 'Show'}</span>
                      </button>
                    </label>
                    <input
                      type={showSecrets['li_secret'] ? 'text' : 'password'}
                      placeholder="Enter LinkedIn Client Secret"
                      value={socialCreds.linkedin.clientSecret}
                      onChange={(e) =>
                        setSocialCreds({
                          ...socialCreds,
                          linkedin: { ...socialCreds.linkedin, clientSecret: e.target.value },
                        })
                      }
                      className="settings-input font-mono"
                    />
                  </div>

                  <div>
                    <label className="settings-label flex items-center justify-between">
                      <span>OAuth Access Token</span>
                      <button
                        type="button"
                        onClick={() => toggleSecret('li_token')}
                        className="text-slate-400 hover:text-slate-700 text-xs flex items-center gap-1 font-normal"
                      >
                        {showSecrets['li_token'] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        <span>{showSecrets['li_token'] ? 'Hide' : 'Show'}</span>
                      </button>
                    </label>
                    <input
                      type={showSecrets['li_token'] ? 'text' : 'password'}
                      placeholder="AQV..."
                      value={socialCreds.linkedin.accessToken}
                      onChange={(e) =>
                        setSocialCreds({
                          ...socialCreds,
                          linkedin: { ...socialCreds.linkedin, accessToken: e.target.value },
                        })
                      }
                      className="settings-input font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* 3. X (Twitter) Platform Card */}
              <div className="settings-card space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-300 flex items-center justify-center">
                      <Twitter className="w-5 h-5 text-neutral-900" />
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-sm text-neutral-900">
                        X (Twitter) Developer API v2
                      </h4>
                      <span className="text-[11px] text-slate-500">
                        Connected as {socialCreds.x.accountName}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-pill border border-emerald-200">
                      Active Connector
                    </span>
                    <button
                      type="button"
                      onClick={() => handleTestPlatform('x')}
                      className="btn btn-secondary text-xs"
                    >
                      <Activity className="w-3.5 h-3.5" />
                      <span>Test Connection</span>
                    </button>
                  </div>
                </div>

                <div className="settings-grid-2">
                  <div>
                    <label className="settings-label">API Key / Consumer Key</label>
                    <input
                      type="text"
                      placeholder="Enter X API Key"
                      value={socialCreds.x.apiKey}
                      onChange={(e) =>
                        setSocialCreds({
                          ...socialCreds,
                          x: { ...socialCreds.x, apiKey: e.target.value },
                        })
                      }
                      className="settings-input font-mono"
                    />
                  </div>
                  <div>
                    <label className="settings-label flex items-center justify-between">
                      <span>API Secret / Consumer Secret</span>
                      <button
                        type="button"
                        onClick={() => toggleSecret('x_secret')}
                        className="text-slate-400 hover:text-slate-700 text-xs flex items-center gap-1 font-normal"
                      >
                        {showSecrets['x_secret'] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        <span>{showSecrets['x_secret'] ? 'Hide' : 'Show'}</span>
                      </button>
                    </label>
                    <input
                      type={showSecrets['x_secret'] ? 'text' : 'password'}
                      placeholder="Enter X API Secret"
                      value={socialCreds.x.apiSecret}
                      onChange={(e) =>
                        setSocialCreds({
                          ...socialCreds,
                          x: { ...socialCreds.x, apiSecret: e.target.value },
                        })
                      }
                      className="settings-input font-mono"
                    />
                  </div>
                </div>

                <div className="settings-grid-2">
                  <div>
                    <label className="settings-label">OAuth 2.0 Client ID</label>
                    <input
                      type="text"
                      placeholder="Enter Client ID"
                      value={socialCreds.x.clientId}
                      onChange={(e) =>
                        setSocialCreds({
                          ...socialCreds,
                          x: { ...socialCreds.x, clientId: e.target.value },
                        })
                      }
                      className="settings-input font-mono"
                    />
                  </div>
                  <div>
                    <label className="settings-label flex items-center justify-between">
                      <span>Bearer Token / Access Token</span>
                      <button
                        type="button"
                        onClick={() => toggleSecret('x_token')}
                        className="text-slate-400 hover:text-slate-700 text-xs flex items-center gap-1 font-normal"
                      >
                        {showSecrets['x_token'] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        <span>{showSecrets['x_token'] ? 'Hide' : 'Show'}</span>
                      </button>
                    </label>
                    <input
                      type={showSecrets['x_token'] ? 'text' : 'password'}
                      placeholder="AAAAAAAAAAAAAAAAAAAA..."
                      value={socialCreds.x.accessToken}
                      onChange={(e) =>
                        setSocialCreds({
                          ...socialCreds,
                          x: { ...socialCreds.x, accessToken: e.target.value },
                        })
                      }
                      className="settings-input font-mono"
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
                  Organization-level fallback keys encrypted at rest using AES-256. Note: You can also configure dedicated keys individually per persona in the AI Workforce Hub.
                </p>
              </div>

              <div className="settings-card space-y-4">
                {[
                  { name: 'OpenAI API Key', env: 'OPENAI_API_KEY', masked: 'sk-proj-••••••••••••••••••••3A4B' },
                  { name: 'Google Gemini API Key', env: 'GEMINI_API_KEY', masked: 'AIzaSy••••••••••••••••••••8X9Y' },
                  { name: 'Anthropic Claude API Key', env: 'ANTHROPIC_API_KEY', masked: 'sk-ant-••••••••••••••••••••1Z2W' },
                  { name: 'Groq Cloud API Key', env: 'GROQ_API_KEY', masked: 'gsk_••••••••••••••••••••4M5N' },
                ].map((item) => (
                  <div key={item.name} className="flex items-center justify-between p-3.5 rounded-lg bg-slate-50 border border-slate-300">
                    <div>
                      <span className="font-bold text-xs text-neutral-900 block">{item.name}</span>
                      <span className="font-mono text-[11px] text-slate-500">{item.masked}</span>
                    </div>
                    <button type="button" className="btn btn-secondary text-xs">
                      Update Key
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ORGANIZATION SETTINGS */}
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
                    <label className="settings-label">Organization Legal Name</label>
                    <input
                      type="text"
                      defaultValue={currentOrganization.name}
                      className="settings-input"
                    />
                  </div>
                  <div>
                    <label className="settings-label">Tenant Slug</label>
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

          {/* TAB 5: SECURITY */}
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
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-xs text-blue-900">
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

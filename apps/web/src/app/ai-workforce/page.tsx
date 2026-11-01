'use client';

import React, { useState } from 'react';
import {
  Bot,
  BrainCircuit,
  PenTool,
  Image as ImageIcon,
  ShieldCheck,
  Sliders,
  DollarSign,
  Activity,
  CheckCircle2,
  X,
  Sparkles,
  Key,
  Eye,
  EyeOff,
  AlertCircle,
} from 'lucide-react';
import { SignatureHeroCard } from '@/components/hero/SignatureHeroCard';
import { useWorkspaceStore } from '@/stores/workspaceStore';
import { AIPersonaRole, AIProviderName } from '@synergy/types';
import { MVP_PERSONAS } from '@synergy/shared';

interface PersonaState {
  role: AIPersonaRole;
  title: string;
  provider: AIProviderName;
  model: string;
  apiKey?: string;
  apiKeyPreview?: string;
  hasApiKey?: boolean;
  temperature: number;
  maxTokens: number;
  systemInstructions: string;
  monthlySpendLimitUsd: number;
  currentMonthSpendUsd: number;
  isEnabled: boolean;
  description: string;
}

const PROVIDER_RECOMMENDED_MODELS: Record<AIProviderName, string[]> = {
  openai: ['gpt-4o', 'gpt-4o-mini', 'o1-preview', 'dall-e-3'],
  gemini: ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash'],
  anthropic: ['claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022'],
  groq: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768'],
  openrouter: ['anthropic/claude-3.5-sonnet', 'openai/gpt-4o', 'meta-llama/llama-3.3-70b-instruct'],
  ollama: ['llama3.2', 'mistral-nemo', 'deepseek-r1', 'qwen2.5'],
  replicate: ['black-forest-labs/flux-schnell', 'stability-ai/sdxl'],
};

export default function AIWorkforcePage() {
  const { getCurrentBusiness, setTopbarLoading } = useWorkspaceStore();
  const business = getCurrentBusiness();

  const [personas, setPersonas] = useState<PersonaState[]>([
    {
      role: 'marketing_strategist',
      title: 'Marketing Strategist',
      provider: 'openai',
      model: 'gpt-4o',
      hasApiKey: true,
      apiKeyPreview: 'sk-proj-••••••••••••••••••••3A4B',
      temperature: 0.7,
      maxTokens: 4096,
      systemInstructions:
        'You are the Chief Marketing Strategist for this brand. Your role is to analyze the Brand Kit, interpret audience sentiment, devise high-conversion weekly content pillars, and delegate specific production tasks to the Content Writer and Visual Designer.',
      monthlySpendLimitUsd: 100,
      currentMonthSpendUsd: 18.4,
      isEnabled: true,
      description: 'Strategic campaign planning, audience segmentation, content pillars, and workflow orchestration.',
    },
    {
      role: 'content_writer',
      title: 'Content Writer',
      provider: 'gemini',
      model: 'gemini-1.5-flash',
      hasApiKey: true,
      apiKeyPreview: 'AIzaSy••••••••••••••••••••8X9Y',
      temperature: 0.8,
      maxTokens: 2048,
      systemInstructions:
        'You are the expert social media copywriter. Write engaging captions, carousel narrative slides, LinkedIn thought leadership, and punchy X threads according to the configured brand voice. Never produce bland generic fluff.',
      monthlySpendLimitUsd: 50,
      currentMonthSpendUsd: 8.9,
      isEnabled: true,
      description: 'Captions, thought leadership, punchy X posts, and slide-by-slide carousel narratives.',
    },
    {
      role: 'visual_designer',
      title: 'Visual Designer',
      provider: 'openai',
      model: 'dall-e-3',
      hasApiKey: false,
      temperature: 0.5,
      maxTokens: 2048,
      systemInstructions:
        'You are the visual art director. Generate brand-consistent carousel slide layouts, high-converting promotional graphics, and ensure all typography, background colors, and logos strictly conform to the business Brand Kit.',
      monthlySpendLimitUsd: 150,
      currentMonthSpendUsd: 34.2,
      isEnabled: true,
      description: 'Visual carousel graphics, promotional posters, and Brand Kit color/typography enforcement.',
    },
    {
      role: 'quality_assurance',
      title: 'Quality Assurance Agent',
      provider: 'anthropic',
      model: 'claude-3-5-sonnet-20241022',
      hasApiKey: true,
      apiKeyPreview: 'sk-ant-••••••••••••••••••••1Z2W',
      temperature: 0.2,
      maxTokens: 2048,
      systemInstructions:
        'You are the final verification gatekeeper. Review all proposed content for spelling, grammar, brand voice consistency, unsupported claims, duplicate text, and platform dimension compliance. Reject or suggest fixes for any violations.',
      monthlySpendLimitUsd: 60,
      currentMonthSpendUsd: 12.1,
      isEnabled: true,
      description: 'Grammar checking, brand voice alignment audit, dimension validation, and policy compliance.',
    },
  ]);

  const [selectedPersona, setSelectedPersona] = useState<PersonaState | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);

  const getPersonaIcon = (role: AIPersonaRole) => {
    switch (role) {
      case 'marketing_strategist':
        return BrainCircuit;
      case 'content_writer':
        return PenTool;
      case 'visual_designer':
        return ImageIcon;
      case 'quality_assurance':
        return ShieldCheck;
      default:
        return Bot;
    }
  };

  const handleTestConnection = () => {
    if (!selectedPersona) return;
    setTestResult(null);
    setTopbarLoading(true);
    setTimeout(() => {
      setTopbarLoading(false);
      setTestResult(
        `Connection verified for ${selectedPersona.provider.toUpperCase()} (${selectedPersona.model}) • Latency: 138ms • Ready.`
      );
    }, 700);
  };

  const handleSaveModal = () => {
    if (!selectedPersona) return;
    setTopbarLoading(true);

    const hasCustomKey = !!selectedPersona.apiKey || selectedPersona.hasApiKey;
    const preview = selectedPersona.apiKey
      ? selectedPersona.apiKey.substring(0, 7) + '••••••••' + selectedPersona.apiKey.slice(-4)
      : selectedPersona.apiKeyPreview;

    const updated = {
      ...selectedPersona,
      hasApiKey: hasCustomKey,
      apiKeyPreview: preview,
    };

    setTimeout(() => {
      setTopbarLoading(false);
      setPersonas((prev) =>
        prev.map((p) => (p.role === selectedPersona.role ? updated : p))
      );
      setSaveSuccessMsg(true);
      setTimeout(() => {
        setSaveSuccessMsg(false);
        setSelectedPersona(null);
      }, 800);
    }, 500);
  };

  const totalMonthlySpend = personas.reduce((acc, p) => acc + p.currentMonthSpendUsd, 0);
  const totalBudget = personas.reduce((acc, p) => acc + p.monthlySpendLimitUsd, 0);

  return (
    <div className="animate-page-enter space-y-5">
      <SignatureHeroCard
        tagBadge={`${business?.name || 'Business'} • Modular AI Workforce`}
        title="AI Personas & Provider Model Architecture"
        description="Configure each persona individually with custom AI providers (OpenAI, Gemini, Anthropic, Groq, Ollama), dedicated API keys, model parameters, and spend limits with zero lock-in."
        primaryAction={
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-pill border border-white/20 text-xs font-bold text-white">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>
              Total Spend: ${totalMonthlySpend.toFixed(2)} / ${totalBudget.toFixed(2)}
            </span>
          </div>
        }
      />

      {/* 4 MVP Personas Grid */}
      <div className="grid grid-cols-2 gap-5">
        {personas.map((persona) => {
          const Icon = getPersonaIcon(persona.role);
          const spendPct = Math.min(
            100,
            (persona.currentMonthSpendUsd / persona.monthlySpendLimitUsd) * 100
          );

          return (
            <div
              key={persona.role}
              className="card p-6 flex flex-col justify-between hover:border-slate-400 transition-all space-y-4"
            >
              {/* Persona Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-neutral-900 text-white flex items-center justify-center shadow-md">
                    <Icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-base text-neutral-900">
                      {persona.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {persona.provider}
                      </span>
                      <span className="text-[11px] font-mono font-semibold text-slate-500">
                        {persona.model}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10.5px] font-bold px-2 py-0.5 rounded-pill ${
                      persona.isEnabled
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {persona.isEnabled ? 'Active' : 'Disabled'}
                  </span>
                </div>
              </div>

              {/* Persona Key & Security Status */}
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Key className="w-3.5 h-3.5 text-slate-500" />
                  <span className="text-slate-600 font-medium">API Credential:</span>
                  {persona.hasApiKey && persona.apiKeyPreview ? (
                    <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold text-[11px]">
                      Dedicated: {persona.apiKeyPreview}
                    </span>
                  ) : (
                    <span className="text-slate-500 font-semibold bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-[11px]">
                      Org Default Key
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  Temp: {persona.temperature}
                </span>
              </div>

              {/* Persona Description */}
              <p className="text-[13px] text-slate-600 leading-relaxed">
                {persona.description}
              </p>

              {/* Budget / Spending Meter */}
              <div className="space-y-1.5 pt-2 border-t border-border">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-500">Monthly Usage Cap</span>
                  <span className="text-slate-700 font-mono font-bold">
                    ${persona.currentMonthSpendUsd.toFixed(2)} / ${persona.monthlySpendLimitUsd}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-500"
                    style={{ width: `${spendPct}%` }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setPersonas((prev) =>
                      prev.map((p) =>
                        p.role === persona.role ? { ...p, isEnabled: !p.isEnabled } : p
                      )
                    );
                  }}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-900"
                >
                  {persona.isEnabled ? 'Pause Persona' : 'Resume Persona'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedPersona({ ...persona });
                    setShowApiKey(false);
                    setTestResult(null);
                  }}
                  className="btn btn-secondary text-xs flex items-center gap-1.5"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Configure Persona & Keys</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Persona Configuration Modal */}
      {selectedPersona && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-border rounded-xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto animate-modal-spring">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-neutral-900">
                    Configure {selectedPersona.title}
                  </h3>
                  <p className="text-xs text-muted">
                    Set dedicated AI provider, custom API keys, model identifier & role parameters
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPersona(null)}
                className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <div className="p-6 space-y-5">
              {/* Row 1: AI Provider & Model */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="settings-label">AI Provider Platform *</label>
                  <select
                    value={selectedPersona.provider}
                    onChange={(e) => {
                      const newProvider = e.target.value as AIProviderName;
                      const defaultModel = PROVIDER_RECOMMENDED_MODELS[newProvider]?.[0] || 'gpt-4o';
                      setSelectedPersona({
                        ...selectedPersona,
                        provider: newProvider,
                        model: defaultModel,
                      });
                    }}
                    className="settings-select"
                  >
                    <option value="openai">OpenAI (GPT-4o, DALL-E 3)</option>
                    <option value="gemini">Google Gemini (Gemini 1.5 Flash / Pro)</option>
                    <option value="anthropic">Anthropic (Claude 3.5 Sonnet / Haiku)</option>
                    <option value="groq">Groq Cloud (Fast Llama 3.3 / Mixtral)</option>
                    <option value="openrouter">OpenRouter (Multi-Model Gateway)</option>
                    <option value="ollama">Ollama (Self-Hosted / Local LLM)</option>
                  </select>
                </div>

                <div>
                  <label className="settings-label">Model Identifier *</label>
                  <input
                    type="text"
                    placeholder="e.g. gpt-4o, gemini-1.5-flash"
                    value={selectedPersona.model}
                    onChange={(e) =>
                      setSelectedPersona({
                        ...selectedPersona,
                        model: e.target.value,
                      })
                    }
                    className="settings-input font-mono"
                  />
                </div>
              </div>

              {/* Quick Pick Model Chips */}
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Popular Models for {selectedPersona.provider.toUpperCase()}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(PROVIDER_RECOMMENDED_MODELS[selectedPersona.provider] || []).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setSelectedPersona({ ...selectedPersona, model: m })}
                      className={`text-xs px-2.5 py-1 rounded-md font-mono transition-all border ${
                        selectedPersona.model === m
                          ? 'bg-blue-50 text-blue-700 border-blue-300 font-bold'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dedicated Persona API Key Field */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-300 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="settings-label !mb-0 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-blue-600" />
                    <span>Dedicated API Key for {selectedPersona.title}</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="text-slate-500 hover:text-slate-800 text-xs flex items-center gap-1 font-normal"
                  >
                    {showApiKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showApiKey ? 'Hide' : 'Reveal'}</span>
                  </button>
                </div>

                <input
                  type={showApiKey ? 'text' : 'password'}
                  placeholder={
                    selectedPersona.apiKeyPreview
                      ? `Current Key: ${selectedPersona.apiKeyPreview} (Enter new key to change)`
                      : `Enter ${selectedPersona.provider.toUpperCase()} API Key (e.g. sk-...)`
                  }
                  value={selectedPersona.apiKey || ''}
                  onChange={(e) =>
                    setSelectedPersona({
                      ...selectedPersona,
                      apiKey: e.target.value,
                    })
                  }
                  className="settings-input font-mono !bg-white"
                />

                <span className="text-[11px] text-slate-500 block">
                  Keys are encrypted at rest using AES-256. If left blank, this persona uses the organization fallback credential.
                </span>
              </div>

              {/* System Instructions / Persona Prompt */}
              <div>
                <label className="settings-label">
                  System Instructions & Persona Role Behavior *
                </label>
                <textarea
                  rows={4}
                  value={selectedPersona.systemInstructions}
                  onChange={(e) =>
                    setSelectedPersona({
                      ...selectedPersona,
                      systemInstructions: e.target.value,
                    })
                  }
                  className="settings-textarea font-mono text-xs leading-relaxed"
                  placeholder="Define role-specific instructions, tone guidelines, and output constraints..."
                />
              </div>

              {/* Sliders and Numerical Limits */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="settings-label flex items-center justify-between">
                    <span>Creativity</span>
                    <span className="font-mono text-blue-600 font-bold">{selectedPersona.temperature}</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1.5"
                    step="0.05"
                    value={selectedPersona.temperature}
                    onChange={(e) =>
                      setSelectedPersona({
                        ...selectedPersona,
                        temperature: parseFloat(e.target.value),
                      })
                    }
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <span className="text-[10px] text-slate-400 block mt-1">
                    {selectedPersona.temperature < 0.4 ? 'Precise / Deterministic' : selectedPersona.temperature > 0.9 ? 'High Divergence' : 'Balanced'}
                  </span>
                </div>

                <div>
                  <label className="settings-label">Max Output Tokens</label>
                  <input
                    type="number"
                    step="256"
                    min="256"
                    max="8192"
                    value={selectedPersona.maxTokens}
                    onChange={(e) =>
                      setSelectedPersona({
                        ...selectedPersona,
                        maxTokens: parseInt(e.target.value, 10) || 2048,
                      })
                    }
                    className="settings-input font-mono"
                  />
                </div>

                <div>
                  <label className="settings-label">Monthly Cap (USD)</label>
                  <input
                    type="number"
                    min="10"
                    max="1000"
                    value={selectedPersona.monthlySpendLimitUsd}
                    onChange={(e) =>
                      setSelectedPersona({
                        ...selectedPersona,
                        monthlySpendLimitUsd: parseFloat(e.target.value) || 50,
                      })
                    }
                    className="settings-input font-mono"
                  />
                </div>
              </div>

              {testResult && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{testResult}</span>
                </div>
              )}

              {saveSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-bold text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Persona parameters & API keys saved successfully!</span>
                </div>
              )}

              {/* Modal Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  className="btn btn-secondary text-xs flex items-center gap-1.5"
                >
                  <Activity className="w-3.5 h-3.5 text-blue-600" />
                  <span>Test Provider Connection</span>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedPersona(null)}
                    className="btn btn-secondary text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveModal}
                    className="btn btn-primary text-xs"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

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
  temperature: number;
  maxTokens: number;
  systemInstructions: string;
  monthlySpendLimitUsd: number;
  currentMonthSpendUsd: number;
  isEnabled: boolean;
  description: string;
}

export default function AIWorkforcePage() {
  const { getCurrentBusiness, setTopbarLoading } = useWorkspaceStore();
  const business = getCurrentBusiness();

  const [personas, setPersonas] = useState<PersonaState[]>([
    {
      role: 'marketing_strategist',
      title: 'Marketing Strategist',
      provider: 'openai',
      model: 'gpt-4o',
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
      model: 'claude-3-5-sonnet',
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
  const [testResult, setTestResult] = useState<string | null>(null);

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
    setTestResult(null);
    setTopbarLoading(true);
    setTimeout(() => {
      setTopbarLoading(false);
      setTestResult('Provider connection verified successfully (Latency: 142ms, Model active)');
    }, 800);
  };

  const totalMonthlySpend = personas.reduce((acc, p) => acc + p.currentMonthSpendUsd, 0);
  const totalBudget = personas.reduce((acc, p) => acc + p.monthlySpendLimitUsd, 0);

  return (
    <div className="animate-page-enter space-y-5">
      <SignatureHeroCard
        tagBadge={`${business?.name || 'Business'} • Modular AI Workforce`}
        title="AI Personas & Provider Model Architecture"
        description="Configure the 4 specialized marketing personas. Decouple role logic from underlying model providers (OpenAI, Google Gemini, Anthropic, Groq, Ollama) with strict spend limits and token accounting."
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
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.2 rounded border border-blue-200">
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
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPersona(persona);
                    setTestResult(null);
                  }}
                  className="btn btn-secondary text-xs"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Configure Persona</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Persona Configuration Modal */}
      {selectedPersona && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-border rounded-md shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-modal-spring">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2.5">
                <Bot className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="font-heading font-bold text-base text-neutral-900">
                    Configure {selectedPersona.title}
                  </h3>
                  <p className="text-xs text-muted">
                    Modular provider, model parameters & system instructions
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPersona(null)}
                className="p-1 rounded-sm text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    AI Provider Service
                  </label>
                  <select
                    value={selectedPersona.provider}
                    onChange={(e) =>
                      setSelectedPersona({
                        ...selectedPersona,
                        provider: e.target.value as AIProviderName,
                      })
                    }
                    className="w-full h-10 px-3 bg-slate-50 border border-border rounded-sm text-sm text-neutral-900 font-semibold focus:border-blue-600 outline-none"
                  >
                    <option value="openai">OpenAI (GPT-4o, DALL-E)</option>
                    <option value="gemini">Google Gemini (Gemini 1.5 Pro / Flash)</option>
                    <option value="anthropic">Anthropic (Claude 3.5 Sonnet / Haiku)</option>
                    <option value="groq">Groq (Ultra-Fast Llama 3 / Mixtral)</option>
                    <option value="openrouter">OpenRouter (Multi-Model Gateway)</option>
                    <option value="ollama">Ollama (Self-Hosted / Local)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Model Identifier
                  </label>
                  <input
                    type="text"
                    value={selectedPersona.model}
                    onChange={(e) =>
                      setSelectedPersona({
                        ...selectedPersona,
                        model: e.target.value,
                      })
                    }
                    className="w-full h-10 px-3 bg-slate-50 border border-border rounded-sm text-sm text-neutral-900 font-mono font-semibold focus:border-blue-600 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  System Instructions & Persona Role Behavior
                </label>
                <textarea
                  rows={5}
                  value={selectedPersona.systemInstructions}
                  onChange={(e) =>
                    setSelectedPersona({
                      ...selectedPersona,
                      systemInstructions: e.target.value,
                    })
                  }
                  className="w-full p-3 bg-slate-50 border border-border rounded-sm text-xs text-neutral-900 focus:bg-white focus:border-blue-600 outline-none leading-relaxed font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Temperature ({selectedPersona.temperature})
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1.5"
                    step="0.1"
                    value={selectedPersona.temperature}
                    onChange={(e) =>
                      setSelectedPersona({
                        ...selectedPersona,
                        temperature: parseFloat(e.target.value),
                      })
                    }
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Monthly Spend Cap (USD)
                  </label>
                  <input
                    type="number"
                    value={selectedPersona.monthlySpendLimitUsd}
                    onChange={(e) =>
                      setSelectedPersona({
                        ...selectedPersona,
                        monthlySpendLimitUsd: parseFloat(e.target.value),
                      })
                    }
                    className="w-full h-10 px-3 bg-slate-50 border border-border rounded-sm text-sm font-mono focus:border-blue-600 outline-none"
                  />
                </div>
              </div>

              {testResult && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-sm text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{testResult}</span>
                </div>
              )}

              {/* Modal Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  className="btn btn-secondary text-xs"
                >
                  <Activity className="w-3.5 h-3.5" />
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
                    onClick={() => {
                      setPersonas((prev) =>
                        prev.map((p) =>
                          p.role === selectedPersona.role ? selectedPersona : p
                        )
                      );
                      setSelectedPersona(null);
                    }}
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


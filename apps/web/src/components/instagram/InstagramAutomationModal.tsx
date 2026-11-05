'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Lock,
  ExternalLink,
  RefreshCw,
  Eye,
  Sliders,
  Layers,
  Sparkles,
  Smartphone,
  Flame,
  Copy,
  Check,
  Radio,
  Wifi,
  WifiOff,
  Terminal,
  Download,
  Puzzle,
  Shield,
  ArrowRight,
} from 'lucide-react';

interface InstagramAutomationModalProps {
  isOpen: boolean;
  onClose: () => void;
  compiledSlides: string[];
  initialCaption?: string;
  onCompileRequest?: () => Promise<string[] | undefined | void>;
}

export function InstagramAutomationModal({
  isOpen,
  onClose,
  compiledSlides,
  initialCaption = '🚀 Dispatched with Synergy Autonomous AI Engine! #marketing #automation #synergy',
  onCompileRequest,
}: InstagramAutomationModalProps) {
  const [caption, setCaption] = useState(initialCaption);
  const [status, setStatus] = useState<{
    isCloud?: boolean;
    hasAuthSession: boolean;
    postsCountToday: number;
    maxDaily: number;
    canPost: boolean;
    lastPostAt: string | null;
  } | null>(null);

  // Flow & Mode Selection
  const [activeMode, setActiveMode] = useState<'extension' | 'bridge'>('extension');

  // Chrome Extension State
  const [extensionDetected, setExtensionDetected] = useState<boolean>(false);
  const [extensionVersion, setExtensionVersion] = useState<string | null>(null);
  const [hasInstagramSession, setHasInstagramSession] = useState<boolean | null>(null);
  const [isVerifyingFlow, setIsVerifyingFlow] = useState<boolean>(false);
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verified' | 'no_session' | 'not_installed' | 'failed'>('idle');

  // Local Companion Bridge State
  const [bridgeConnected, setBridgeConnected] = useState<boolean | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const [isLaunchingLogin, setIsLaunchingLogin] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  // Settings
  const [isHeadless, setIsHeadless] = useState(false);
  const [isStealth, setIsStealth] = useState(true);
  const [forcePublish, setForcePublish] = useState(false);

  // Execution Feedback
  const [logs, setLogs] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Copy helper
  const copyCommand = (cmd: string, key: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Refresh status from Local Companion Bridge or fallback to Next.js API
  const checkStatus = async () => {
    setIsLoadingStatus(true);
    let bridgeOk = false;

    // 1. Probe local companion bridge at http://127.0.0.1:4545/status
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500);
      const bridgeRes = await fetch('http://127.0.0.1:4545/status', {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (bridgeRes.ok) {
        const bridgeData = await bridgeRes.json();
        if (bridgeData.online) {
          bridgeOk = true;
          setBridgeConnected(true);
          setStatus({
            isCloud: false,
            hasAuthSession: bridgeData.hasAuthSession,
            postsCountToday: bridgeData.postsCountToday,
            maxDaily: bridgeData.maxDaily,
            canPost: bridgeData.canPost,
            lastPostAt: bridgeData.lastPostAt,
          });
        }
      }
    } catch {
      bridgeOk = false;
    }

    if (!bridgeOk) {
      setBridgeConnected(false);
      // 2. Fall back to internal API check
      try {
        const res = await fetch('/api/instagram');
        const data = await res.json();
        if (data.success) {
          setStatus({
            isCloud: data.isCloud,
            hasAuthSession: data.hasAuthSession,
            postsCountToday: data.postsCountToday,
            maxDaily: data.maxDaily,
            canPost: data.canPost,
            lastPostAt: data.lastPostAt,
          });
        }
      } catch (err) {
        console.error('Failed to fetch Instagram status:', err);
      }
    }

    setIsLoadingStatus(false);
  };

  // Listen to Chrome Extension Handshake via postMessage
  useEffect(() => {
    if (!isOpen) return;

    // Initial check for data-synergy-extension attribute on <html>
    const extAttr = document.documentElement.getAttribute('data-synergy-extension');
    if (extAttr) {
      setExtensionDetected(true);
      setExtensionVersion(extAttr);
    }

    const handleMessage = (event: MessageEvent) => {
      if (!event.data || event.data.source !== 'SYNERGY_EXTENSION') return;

      const { type, message, success, error, version, hasInstagramSession: igSession } = event.data;

      if (type === 'PONG') {
        setExtensionDetected(true);
        if (version) setExtensionVersion(version);
      }

      if (type === 'VERIFY_RESULT') {
        setIsVerifyingFlow(false);
        if (success) {
          setExtensionDetected(true);
          if (version) setExtensionVersion(version);
          setHasInstagramSession(Boolean(igSession));
          if (igSession) {
            setVerificationStatus('verified');
            setSuccessMsg('🎉 Flow Integrity Verified! Extension is connected with an active Instagram session.');
          } else {
            setVerificationStatus('no_session');
            setErrorMsg('Extension connected, but no active Instagram login found in Chrome. Please open instagram.com, log in, and verify again.');
          }
        } else {
          setVerificationStatus('failed');
          setErrorMsg(error || 'Extension integrity verification failed.');
        }
      }

      if (type === 'PROGRESS_UPDATE' && message) {
        setLogs((prev) => [...prev, message]);
      }

      if (type === 'POST_RESULT') {
        setIsPublishing(false);
        if (success) {
          setLogs((prev) => [...prev, '🎉 Post published successfully to Instagram!']);
          setSuccessMsg('🎉 Carousel successfully published to Instagram via Synergy Social Assistant!');
          checkStatus();
        } else {
          setErrorMsg(error || 'Failed to complete Instagram post via extension.');
          if (message) setLogs((prev) => [...prev, `❌ ${message}`]);
        }
      }
    };

    window.addEventListener('message', handleMessage);

    // Send PING to query extension presence
    window.postMessage({ source: 'SYNERGY_WEB_STUDIO', type: 'PING' }, '*');

    // Also run status check
    checkStatus();
    setLogs([]);
    setErrorMsg(null);
    setSuccessMsg(null);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [isOpen]);

  // Trigger Extension Flow Integrity Check
  const handleVerifyFlowIntegrity = () => {
    setIsVerifyingFlow(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    setVerificationStatus('idle');

    // Send verify request to extension content script
    window.postMessage({ source: 'SYNERGY_WEB_STUDIO', type: 'VERIFY_FLOW' }, '*');

    // Timeout safety fallback if extension isn't installed
    setTimeout(() => {
      setIsVerifyingFlow((currentlyVerifying) => {
        if (currentlyVerifying) {
          setVerificationStatus('not_installed');
          setErrorMsg(
            'Extension not responding. Please make sure you unzipped the extension, loaded it in chrome://extensions, and refreshed this page.'
          );
          return false;
        }
        return currentlyVerifying;
      });
    }, 3500);
  };

  // Launch Desktop Chrome Login (Bridge Mode)
  const handleLaunchLogin = async () => {
    setIsLaunchingLogin(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const loginEndpoint = bridgeConnected
      ? 'http://127.0.0.1:4545/login'
      : '/api/instagram/login';

    try {
      const res = await fetch(loginEndpoint, { method: 'POST' });
      const data = await res.json();

      if (data.success) {
        setLogs((prev) => [
          ...prev,
          '🌐 Chrome window opened on your desktop! Please log into Instagram manually, complete 2FA, and return here.',
        ]);

        let attempts = 0;
        const interval = setInterval(async () => {
          attempts++;
          const checkUrl = bridgeConnected
            ? 'http://127.0.0.1:4545/status'
            : '/api/instagram';
          try {
            const check = await fetch(checkUrl);
            const json = await check.json();
            if (json.hasAuthSession) {
              clearInterval(interval);
              setStatus((prev) => (prev ? { ...prev, hasAuthSession: true } : json));
              setIsLaunchingLogin(false);
              setLogs((prev) => [
                ...prev,
                '✅ Instagram session captured & saved to storage/instagram/auth.json! Ready to publish.',
              ]);
            } else if (attempts >= 40) {
              clearInterval(interval);
              setIsLaunchingLogin(false);
            }
          } catch {
            if (attempts >= 40) {
              clearInterval(interval);
              setIsLaunchingLogin(false);
            }
          }
        }, 3000);
      } else {
        setErrorMsg(data.error || 'Failed to start login process');
        setIsLaunchingLogin(false);
      }
    } catch (err: any) {
      setErrorMsg(
        err.message || 'Failed to communicate with login endpoint. Please make sure the local bridge is running.'
      );
      setIsLaunchingLogin(false);
    }
  };

  // Launch Automated Publishing
  const handlePublish = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);

    let slidesToPublish = compiledSlides;

    // Trigger compilation if needed
    if (slidesToPublish.length === 0 && onCompileRequest) {
      setLogs((prev) => [...prev, '⚙️ Compiling slides to 2x Retina PNGs...']);
      try {
        const res = await onCompileRequest();
        if (Array.isArray(res) && res.length > 0) {
          slidesToPublish = res;
        }
      } catch (err: any) {
        setErrorMsg('Failed to compile slides: ' + err.message);
        return;
      }
    }

    if (!slidesToPublish || slidesToPublish.length === 0) {
      setErrorMsg('No slide images found. Please compile slides first.');
      return;
    }

    setIsPublishing(true);

    // =========================================================================
    // BRANCH A: Chrome Extension Publishing (Primary zero-code method)
    // =========================================================================
    if (activeMode === 'extension' && (extensionDetected || verificationStatus === 'verified')) {
      setLogs((prev) => [
        ...prev,
        `🚀 Dispatching carousel (${slidesToPublish.length} slides) to Synergy Social Assistant Extension...`,
      ]);

      window.postMessage(
        {
          source: 'SYNERGY_WEB_STUDIO',
          type: 'PUBLISH_INSTAGRAM',
          payload: {
            slides: slidesToPublish,
            caption,
            stealthMode: isStealth,
          },
        },
        '*'
      );
      return;
    }

    // =========================================================================
    // BRANCH B: Local Companion Bridge / Serverless API Fallback
    // =========================================================================
    setLogs((prev) => [
      ...prev,
      `🚀 Initializing Playwright automation (${slidesToPublish.length} slide carousel via ${
        bridgeConnected ? 'Local Companion Bridge' : 'Local Engine'
      })...`,
    ]);

    const publishEndpoint = bridgeConnected
      ? 'http://127.0.0.1:4545/publish'
      : '/api/instagram';

    try {
      const res = await fetch(publishEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slides: slidesToPublish,
          caption,
          headless: isHeadless,
          force: forcePublish,
          stealthMode: isStealth,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setLogs(data.logs || ['Post published successfully!']);
        setSuccessMsg('🎉 Successfully posted to Instagram via Playwright automation!');
        checkStatus();
      } else {
        setErrorMsg(data.error || 'Failed to complete Instagram post');
        if (data.logs) setLogs(data.logs);
      }
    } catch (err: any) {
      setErrorMsg(
        err.message || 'Failed to reach execution runner. If using the hosted website, ensure the extension or bridge is active.'
      );
    } finally {
      setIsPublishing(false);
    }
  };

  if (!isOpen) return null;

  const isExtensionReady = extensionDetected && verificationStatus === 'verified';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 max-w-2xl w-full p-6 space-y-5 animate-scale-up max-h-[92vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-md">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-extrabold text-base text-neutral-900">
                  Instagram Automated Poster
                </h3>
                <span className="text-[10px] font-mono uppercase bg-purple-100 text-purple-800 border border-purple-200 px-2 py-0.5 rounded-full font-bold">
                  Residential Engine
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Post carousels with human-like delays, anti-ban protections, and zero datacenter flags.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isPublishing}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs (Extension vs Terminal Bridge) */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-2 text-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveMode('extension')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                activeMode === 'extension'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Puzzle className="w-3.5 h-3.5" />
              <span>Chrome Extension (Zero Code)</span>
              {isExtensionReady && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-purple-600"></span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveMode('bridge')}
              className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                activeMode === 'bridge'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Local Bridge (Terminal)</span>
              {bridgeConnected && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-900"></span>
              )}
            </button>
          </div>

          <span className="text-[11px] font-semibold text-slate-400">
            {activeMode === 'extension' ? 'Recommended for Customers' : 'For Developers'}
          </span>
        </div>

        {/* ====================================================================
            MODE 1: CHROME EXTENSION FLOW (Zero-code package for end-users)
            ==================================================================== */}
        {activeMode === 'extension' && (
          <div className="space-y-3">
            {isExtensionReady ? (
              /* Verified Banner */
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Synergy Social Assistant Active (v{extensionVersion || '1.0.0'})</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-emerald-200/60 text-emerald-800 px-2 py-0.5 rounded-full">
                    Flow Integrity Verified
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-emerald-800">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>Instagram Session: <strong>Logged In</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>IP Origin: <strong>Residential (Natural Browser)</strong></span>
                  </div>
                </div>
              </div>
            ) : (
              /* Download & Unpack Installation Card */
              <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white space-y-3 shadow-lg border border-slate-700/80">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 shrink-0">
                      <Puzzle className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-white flex items-center gap-1.5">
                        <span>Install Synergy Social Assistant</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 bg-purple-500/30 text-purple-200 border border-purple-400/30 rounded">
                          1-Minute Setup
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-300 leading-relaxed mt-0.5">
                        Download the extension, unpack it, and automate Instagram posts safely from your own browser.
                      </p>
                    </div>
                  </div>

                  <a
                    href="/downloads/synergy-social-assistant.zip"
                    download="synergy-social-assistant.zip"
                    className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shrink-0 transition-all hover:scale-[1.02]"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Extension (.zip)</span>
                  </a>
                </div>

                {/* 3 Step Instruction Guide */}
                <div className="bg-black/40 rounded-lg p-3 text-xs border border-white/10 space-y-2">
                  <div className="text-[11px] font-bold text-purple-300 uppercase tracking-wider">
                    How to Load the Extension:
                  </div>
                  <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-300 leading-relaxed">
                    <li>Download &amp; <strong>unzip</strong> the downloaded file on your computer.</li>
                    <li>
                      Open a new tab and go to{' '}
                      <code className="text-amber-300 bg-white/10 px-1.5 py-0.5 rounded font-mono">
                        chrome://extensions
                      </code>
                    </li>
                    <li>
                      Turn ON <strong>&quot;Developer mode&quot;</strong> (top right toggle) &rarr; click{' '}
                      <strong>&quot;Load unpacked&quot;</strong> and choose the unzipped folder.
                    </li>
                  </ol>
                </div>

                {/* Verification Action */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400">
                    Once loaded, verify the connection here:
                  </span>
                  <button
                    type="button"
                    onClick={handleVerifyFlowIntegrity}
                    disabled={isVerifyingFlow}
                    className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-50"
                  >
                    <Shield className={`w-3.5 h-3.5 ${isVerifyingFlow ? 'animate-spin' : ''}`} />
                    <span>{isVerifyingFlow ? 'Verifying Integrity...' : '🛡️ Verify Flow Integrity'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ====================================================================
            MODE 2: TERMINAL COMPANION BRIDGE FLOW (Developer / Local Runner)
            ==================================================================== */}
        {activeMode === 'bridge' && (
          <div className="space-y-3">
            {bridgeConnected === true ? (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                    <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Local Companion Bridge Connected (127.0.0.1:4545)</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full border border-emerald-300">
                    🛡️ Residential IP Active
                  </span>
                  <button
                    type="button"
                    onClick={checkStatus}
                    disabled={isLoadingStatus}
                    className="text-emerald-700 hover:text-emerald-900 p-1 rounded hover:bg-emerald-100"
                    title="Refresh Bridge Connection"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoadingStatus ? 'animate-spin' : ''}`} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white space-y-3 shadow-lg border border-slate-700/80">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 shrink-0">
                      <Terminal className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-white">Local Terminal Bridge Runner</h4>
                      <p className="text-[11px] text-slate-300 leading-relaxed mt-0.5">
                        Run the companion bridge from your terminal to launch Playwright on your desktop.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={checkStatus}
                    disabled={isLoadingStatus}
                    className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white flex items-center gap-1 transition-all shrink-0 border border-white/10"
                  >
                    <RefreshCw className={`w-3 h-3 ${isLoadingStatus ? 'animate-spin' : ''}`} />
                    <span>{isLoadingStatus ? 'Checking...' : 'Check Bridge'}</span>
                  </button>
                </div>

                <div className="bg-black/60 rounded-lg p-2.5 flex items-center justify-between border border-white/10 font-mono text-xs">
                  <div className="flex items-center gap-2 text-slate-200">
                    <span className="text-emerald-400 font-bold">$</span>
                    <span className="text-purple-300 font-semibold">npm run ig:bridge</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyCommand('npm run ig:bridge', 'bridge')}
                    className="px-3 py-1 rounded-md bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-sans font-bold flex items-center gap-1 transition-colors shadow-sm"
                  >
                    {copiedKey === 'bridge' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Command</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Status & Velocity Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Auth Session Card */}
          <div className="p-3.5 rounded-xl border bg-slate-50 border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase text-slate-600 tracking-wider">
                Session Auth Status
              </span>
              <button
                type="button"
                onClick={checkStatus}
                disabled={isLoadingStatus}
                className="text-slate-400 hover:text-slate-700 text-xs p-1"
                title="Refresh Status"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingStatus ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              {isExtensionReady || status?.hasAuthSession ? (
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    {isExtensionReady ? 'Extension Session Active' : 'Session Active (auth.json)'}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>No Session Verified</span>
                </div>
              )}

              {activeMode === 'extension' ? (
                <button
                  type="button"
                  onClick={() => {
                    window.postMessage({ source: 'SYNERGY_WEB_STUDIO', type: 'OPEN_LOGIN_WINDOW' }, '*');
                  }}
                  className="btn btn-secondary text-xs px-2.5 py-1 flex items-center gap-1"
                  title="Open dedicated Instagram popup window to log in or handle 2FA"
                >
                  <ExternalLink className="w-3 h-3 text-purple-600" />
                  <span>Launch Login Popup</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleLaunchLogin}
                  disabled={isLaunchingLogin || (!bridgeConnected && Boolean(status?.isCloud))}
                  className="btn btn-secondary text-xs px-2.5 py-1 flex items-center gap-1 disabled:opacity-50"
                  title={
                    !bridgeConnected && Boolean(status?.isCloud)
                      ? 'Start local bridge first to launch desktop Chrome'
                      : 'Launch Chrome to log in'
                  }
                >
                  <Lock className="w-3 h-3 text-purple-600" />
                  <span>{isLaunchingLogin ? 'Waiting for Login...' : 'Log In / Refresh'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Daily Velocity Card */}
          <div className="p-3.5 rounded-xl border bg-slate-50 border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase text-slate-600 tracking-wider">
                Anti-Flag Daily Velocity
              </span>
              <span className="text-[10px] font-mono text-slate-500">Safe: ≤ 2/day</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>
                  {status ? `${status.postsCountToday} / ${status.maxDaily}` : '0 / 2'} Posts Used Today
                </span>
              </div>

              {status && !status.canPost && (
                <span className="text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full">
                  Daily Cap Reached
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Carousel Content Summary */}
        <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200 flex items-center justify-between text-xs text-purple-900">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-purple-600" />
            <span className="font-semibold">
              Ready to post {compiledSlides.length > 0 ? compiledSlides.length : 'all'} slide carousel to Instagram
            </span>
          </div>
          <span className="text-[11px] font-mono font-bold bg-white px-2 py-0.5 rounded border border-purple-200">
            {compiledSlides.length > 0 ? `${compiledSlides.length} Images Ready` : 'Compile on Launch'}
          </span>
        </div>

        {/* Caption Editor */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider">
            Instagram Caption &amp; Hashtags
          </label>
          <textarea
            rows={4}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            disabled={isPublishing}
            className="w-full p-3 bg-white border border-slate-300 rounded-xl text-xs font-medium text-neutral-900 focus:border-purple-600 focus:ring-2 focus:ring-purple-500/20 outline-none leading-relaxed shadow-sm"
            placeholder="Write your Instagram caption..."
          />
        </div>

        {/* Bulletproof Anti-Flag Configuration */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-800 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-slate-600" />
              <span>Anti-Detection &amp; Execution Settings</span>
            </span>
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
              Stealth Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Viewport Mode */}
            <label className="flex items-start gap-2 cursor-pointer p-2 rounded-lg bg-white border border-slate-200 hover:border-slate-300">
              <input
                type="checkbox"
                checked={!isHeadless}
                onChange={(e) => setIsHeadless(!e.target.checked)}
                className="mt-0.5 rounded text-purple-600 focus:ring-purple-500"
              />
              <div>
                <span className="font-bold text-neutral-800 block">Visible Execution Tab</span>
                <span className="text-[11px] text-slate-500 block leading-tight">
                  Watch carousel upload, human typing &amp; post creation live
                </span>
              </div>
            </label>

            {/* Stealth Typing Mode */}
            <label className="flex items-start gap-2 cursor-pointer p-2 rounded-lg bg-white border border-slate-200 hover:border-slate-300">
              <input
                type="checkbox"
                checked={isStealth}
                onChange={(e) => setIsStealth(e.target.checked)}
                className="mt-0.5 rounded text-purple-600 focus:ring-purple-500"
              />
              <div>
                <span className="font-bold text-neutral-800 block">Human Delay Profile</span>
                <span className="text-[11px] text-slate-500 block leading-tight">
                  Randomized keystroke jitter (35-70ms) &amp; natural review pauses
                </span>
              </div>
            </label>
          </div>

          {status && !status.canPost && (
            <label className="flex items-center gap-2 text-xs text-rose-700 bg-rose-50 p-2 rounded-lg border border-rose-200">
              <input
                type="checkbox"
                checked={forcePublish}
                onChange={(e) => setForcePublish(e.target.checked)}
                className="rounded text-rose-600 focus:ring-rose-500"
              />
              <span className="font-semibold">
                Override velocity limit (Force publish 3rd post today at your own risk)
              </span>
            </label>
          )}
        </div>

        {/* Live Terminal Logs */}
        {logs.length > 0 && (
          <div className="bg-slate-900 rounded-xl p-3.5 font-mono text-[11px] text-emerald-400 space-y-1 max-h-36 overflow-y-auto shadow-inner border border-slate-800">
            <div className="text-[10px] text-slate-400 border-b border-slate-800 pb-1 mb-1 font-sans font-bold flex items-center justify-between">
              <span>AUTOMATION EXECUTION CONSOLE</span>
              {isPublishing && <span className="animate-pulse text-purple-400">● RUNNING</span>}
            </div>
            {logs.map((log, i) => (
              <div key={i} className="leading-relaxed">
                {log}
              </div>
            ))}
          </div>
        )}

        {/* Error Feedback */}
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fade-in">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Success Feedback */}
        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between border-t border-slate-200 pt-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isPublishing}
            className="btn btn-secondary text-xs"
          >
            Cancel / Close
          </button>

          <button
            type="button"
            onClick={handlePublish}
            disabled={
              isPublishing ||
              (activeMode === 'extension' && !isExtensionReady && !extensionDetected) ||
              (activeMode === 'bridge' && !bridgeConnected && Boolean(status?.isCloud))
            }
            className="btn btn-primary text-xs flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 via-rose-600 to-amber-600 hover:from-purple-500 hover:to-amber-500 text-white font-bold shadow-md disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 fill-current ${isPublishing ? 'animate-spin' : ''}`} />
            <span>
              {isPublishing
                ? 'Publishing to Instagram...'
                : activeMode === 'extension' && !isExtensionReady && !extensionDetected
                ? 'Install & Verify Extension'
                : '⚡ Launch Instagram Post'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

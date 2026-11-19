'use client';

import React from 'react';
import { X, Layers, Terminal, Server, Globe, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';

interface WorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WorkflowModal: React.FC<WorkflowModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                System Architecture & Modernization Workflow
              </h3>
              <p className="text-xs text-slate-500">
                From Monolithic Python CLI to Node.js REST API and Next.js Frontend
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Architecture Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {/* 1. Legacy Python */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider mb-2">
                <Terminal className="w-4 h-4 text-amber-600" />
                <span>1. Legacy Python CLI</span>
              </div>
              <p className="text-xs text-slate-600 mb-3">
                Single-file procedural script (<code>main.py</code>).
              </p>
              <ul className="text-xs space-y-1.5 text-slate-600 list-disc list-inside">
                <li>Blocking <code>input()</code> console loops</li>
                <li>Single terminal user only</li>
                <li>Direct file overwrite risks</li>
                <li>Zero external API access</li>
              </ul>
            </div>

            {/* 2. Express Backend */}
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80">
              <div className="flex items-center gap-2 text-blue-800 font-bold text-xs uppercase tracking-wider mb-2">
                <Server className="w-4 h-4 text-blue-600" />
                <span>2. Node.js Express API</span>
              </div>
              <p className="text-xs text-slate-600 mb-3">
                Asynchronous, non-blocking REST service.
              </p>
              <ul className="text-xs space-y-1.5 text-slate-600 list-disc list-inside">
                <li>Non-blocking V8 Event Loop</li>
                <li>Interactive OpenAPI Swagger UI</li>
                <li>Atomic crash-safe temp writes</li>
                <li>Centralized error handling</li>
              </ul>
            </div>

            {/* 3. Next.js Frontend */}
            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/80">
              <div className="flex items-center gap-2 text-indigo-800 font-bold text-xs uppercase tracking-wider mb-2">
                <Globe className="w-4 h-4 text-indigo-600" />
                <span>3. Next.js App Router</span>
              </div>
              <p className="text-xs text-slate-600 mb-3">
                Modern reactive client dashboard.
              </p>
              <ul className="text-xs space-y-1.5 text-slate-600 list-disc list-inside">
                <li>Server & Client component tree</li>
                <li>Instant filtering & sorting</li>
                <li>Academic report cards & metrics</li>
                <li>Full-stack TypeScript integrity</li>
              </ul>
            </div>
          </div>

          {/* End-to-End Pipeline */}
          <div className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/40">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-600" />
              <span>Deterministic Request-Response Pipeline</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <span className="font-bold text-blue-600">Step 1: Next.js UI</span>
                <p className="text-slate-500 mt-1">Client triggers typed API call with filters or payload.</p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <span className="font-bold text-blue-600">Step 2: Middleware</span>
                <p className="text-slate-500 mt-1">CORS, JSON Parser, and Schema validator sanitize input.</p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <span className="font-bold text-blue-600">Step 3: Service Domain</span>
                <p className="text-slate-500 mt-1">Checks roll uniqueness and computes letter grade (A+ to F).</p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <span className="font-bold text-blue-600">Step 4: Atomic Store</span>
                <p className="text-slate-500 mt-1">Writes to temporary file before atomic OS rename.</p>
              </div>
            </div>
          </div>

          {/* Integrity Note */}
          <div className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-900">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-emerald-950 font-bold mb-0.5">
                Primary Key Immutability & Concurrency Safety
              </strong>
              Student roll numbers cannot be altered upon update. All writes execute asynchronously via atomic file replacement, completely preventing database corruption even if the server process terminates abruptly.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition-colors"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
};

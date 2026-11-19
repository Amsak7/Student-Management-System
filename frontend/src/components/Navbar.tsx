'use client';

import React from 'react';
import {
  GraduationCap,
  ExternalLink,
  Layers,
  BarChart3,
  Activity,
  Plus,
} from 'lucide-react';
import { HealthStatus } from '@/types/student';

interface NavbarProps {
  backendHealth: HealthStatus | null;
  onOpenAddModal: () => void;
  onOpenWorkflowModal: () => void;
  onOpenAnalyticsModal: () => void;
  onResetSeed: () => void;
  isResetting: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  backendHealth,
  onOpenAddModal,
  onOpenWorkflowModal,
  onOpenAnalyticsModal,
  onResetSeed,
  isResetting,
}) => {
  const isOnline = backendHealth?.status === 'UP';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Subtitle */}
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Student Management System
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60">
                  Next.js App
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Academic Project: Python CLI &rarr; Node.js Express REST API &rarr; Next.js
              </p>
            </div>
          </div>

          {/* Action Navigation Controls */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Backend Health Badge */}
            <div
              className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${
                isOnline
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}
              title={
                isOnline
                  ? `Backend Online (Uptime: ${backendHealth?.uptimeSeconds}s | Node: ${backendHealth?.nodeVersion})`
                  : 'Backend Disconnected'
              }
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                }`}
              />
              <Activity className="w-3.5 h-3.5" />
              <span>{isOnline ? 'API Connected' : 'API Offline'}</span>
            </div>

            {/* Architecture / Workflow Button */}
            <button
              onClick={onOpenWorkflowModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 transition-colors border border-slate-200"
              title="View Architecture comparison & Request Lifecycle"
            >
              <Layers className="w-4 h-4 text-slate-600" />
              <span className="hidden sm:inline">Architecture</span>
            </button>

            {/* Analytics Modal Button */}
            <button
              onClick={onOpenAnalyticsModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 transition-colors border border-slate-200"
              title="View Class Analytics & Grade Histogram"
            >
              <BarChart3 className="w-4 h-4 text-slate-600" />
              <span className="hidden sm:inline">Analytics</span>
            </button>

            {/* Interactive Swagger Button */}
            <a
              href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api-docs`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors border border-blue-200"
              title="Open Swagger OpenAPI 3.0 Documentation"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden md:inline">Swagger Docs</span>
            </a>

            {/* Add Student Primary Button */}
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-sm shadow-blue-600/30 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Student</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

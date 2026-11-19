'use client';

import React from 'react';
import {
  GraduationCap,
  ExternalLink,
  Layers,
  BarChart3,
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
}) => {
  const isOnline = backendHealth?.status === 'UP';

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Department Context */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold tracking-tight text-slate-900">
                  Student Information System
                </span>
                <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Dept. of Computer Science & Engineering &bull; Academic Portal
              </p>
            </div>
          </div>

          {/* Controls & Navigation */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* System Status Dot */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200"
              title={
                isOnline
                  ? `API Connected (Uptime: ${backendHealth?.uptimeSeconds}s)`
                  : 'Backend API Offline'
              }
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isOnline ? 'bg-emerald-600' : 'bg-rose-500'
                }`}
              />
              <span className="text-[11px] font-mono hidden md:inline">
                {isOnline ? 'API :5000' : 'Offline'}
              </span>
            </div>

            {/* Architecture / DFD Modal */}
            <button
              onClick={onOpenWorkflowModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200"
              title="System Architecture & Request Lifecycle"
            >
              <Layers className="w-3.5 h-3.5 text-slate-500" />
              <span>Architecture</span>
            </button>

            {/* Analytics Modal */}
            <button
              onClick={onOpenAnalyticsModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200"
              title="Class Analytics & Performance"
            >
              <BarChart3 className="w-3.5 h-3.5 text-slate-500" />
              <span>Analytics</span>
            </button>

            {/* Interactive Swagger Button */}
            <a
              href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api-docs`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200"
              title="Open Swagger OpenAPI Documentation"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Swagger Docs</span>
            </a>

            {/* Add Student Primary Action */}
            <button
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Enroll Student</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

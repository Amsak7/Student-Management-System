'use client';

import React from 'react';
import { Users, TrendingUp, Trophy, CheckCircle2 } from 'lucide-react';
import { StudentStats } from '@/types/student';

interface KpiCardsProps {
  stats: StudentStats | null;
  loading: boolean;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs animate-pulse"
          >
            <div className="h-4 bg-slate-200 rounded w-24 mb-3"></div>
            <div className="h-8 bg-slate-200 rounded w-16 mb-2"></div>
            <div className="h-3 bg-slate-100 rounded w-32"></div>
          </div>
        ))}
      </div>
    );
  }

  const total = stats?.totalStudents ?? 0;
  const avg = stats?.averageMarks ? `${stats.averageMarks}%` : '0.00%';
  const topScorer = stats?.highestMarks
    ? `${stats.highestMarks.name} (${stats.highestMarks.marks}%)`
    : 'None';
  const passRate = stats?.passingPercentage
    ? `${stats.passingPercentage}%`
    : '0%';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* 1. Total Enrolled */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Total Students
          </span>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{total}</h3>
          <p className="text-xs text-slate-500 mt-1">Active student records</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <Users className="w-6 h-6" />
        </div>
      </div>

      {/* 2. Class Average */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Class Average
          </span>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{avg}</h3>
          <p className="text-xs text-emerald-600 font-medium mt-1">Aggregate score</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <TrendingUp className="w-6 h-6" />
        </div>
      </div>

      {/* 3. Top Performer */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow flex items-start justify-between">
        <div className="max-w-[70%]">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Top Scorer
          </span>
          <h3 className="text-lg font-bold text-slate-900 mt-1 truncate" title={topScorer}>
            {topScorer}
          </h3>
          <p className="text-xs text-amber-600 font-medium mt-1">
            {stats?.highestMarks?.course || 'Academic leader'}
          </p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
          <Trophy className="w-6 h-6" />
        </div>
      </div>

      {/* 4. Passing Rate */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-shadow flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Passing Rate
          </span>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{passRate}</h3>
          <p className="text-xs text-purple-600 font-medium mt-1">
            {stats?.passedStudents ?? 0} passed &bull; {stats?.failedStudents ?? 0} failed
          </p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
          <CheckCircle2 className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

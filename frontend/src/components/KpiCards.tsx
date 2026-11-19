'use client';

import React from 'react';
import { Users, TrendingUp, Award, CheckCircle } from 'lucide-react';
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
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs animate-pulse"
          >
            <div className="h-3.5 bg-slate-200 rounded w-24 mb-3"></div>
            <div className="h-7 bg-slate-200 rounded w-16 mb-2"></div>
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
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Total Enrolled
          </span>
          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <span className="text-2xl font-bold tracking-tight text-slate-900">{total}</span>
          <p className="text-xs text-slate-500 mt-1">Active student records</p>
        </div>
      </div>

      {/* 2. Class Average */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Class Average
          </span>
          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <span className="text-2xl font-bold tracking-tight text-slate-900">{avg}</span>
          <p className="text-xs text-slate-500 mt-1">Aggregate score across courses</p>
        </div>
      </div>

      {/* 3. Top Performer */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Top Performer
          </span>
          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
            <Award className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <span className="text-lg font-bold tracking-tight text-slate-900 truncate block" title={topScorer}>
            {topScorer}
          </span>
          <p className="text-xs text-slate-500 mt-1 truncate">
            {stats?.highestMarks?.course || 'Department Lead'}
          </p>
        </div>
      </div>

      {/* 4. Passing Rate */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Passing Rate
          </span>
          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
            <CheckCircle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <span className="text-2xl font-bold tracking-tight text-slate-900">{passRate}</span>
          <p className="text-xs text-slate-500 mt-1">
            {stats?.passedStudents ?? 0} Passed &bull; {stats?.failedStudents ?? 0} Failed
          </p>
        </div>
      </div>
    </div>
  );
};

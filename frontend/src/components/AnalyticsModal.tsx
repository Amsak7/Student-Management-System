'use client';

import React from 'react';
import { X, BarChart3, Trophy, TrendingDown, BookOpen, CheckCircle2 } from 'lucide-react';
import { StudentStats } from '@/types/student';

interface AnalyticsModalProps {
  stats: StudentStats | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AnalyticsModal: React.FC<AnalyticsModalProps> = ({
  stats,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !stats) return null;

  const grades = ['A+', 'A', 'B', 'C', 'D', 'E', 'F'];
  const total = stats.totalStudents || 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Academic Performance Analytics
              </h3>
              <p className="text-xs text-slate-500">
                Class distribution, grade metrics, and department statistics
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
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Key Metrics Banner */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100">
              <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">
                Average Score
              </span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {stats.averageMarks}%
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100">
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                Pass Percentage
              </span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {stats.passingPercentage}%
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100">
              <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider">
                Enrolled Total
              </span>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {stats.totalStudents}
              </div>
            </div>
          </div>

          {/* Grade Distribution Histogram */}
          <div className="p-5 rounded-2xl border border-slate-200/80 bg-white">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-slate-900">
                Grade Distribution Histogram
              </h4>
              <span className="text-xs text-slate-500 font-medium">
                Criterion: A+ (&ge;90) to F (&lt;40)
              </span>
            </div>

            <div className="space-y-2.5">
              {grades.map((grade) => {
                const count = stats.gradeDistribution?.[grade] || 0;
                const percentage = Math.round((count / total) * 100);

                let barColor = 'bg-slate-400';
                if (grade === 'A+' || grade === 'A') barColor = 'bg-emerald-500';
                else if (grade === 'B') barColor = 'bg-sky-500';
                else if (grade === 'C') barColor = 'bg-amber-500';
                else if (grade === 'D') barColor = 'bg-orange-500';
                else if (grade === 'F') barColor = 'bg-rose-500';

                return (
                  <div key={grade} className="flex items-center gap-3 text-xs">
                    <span className="w-8 font-bold font-mono text-slate-700">
                      {grade}
                    </span>
                    <div className="flex-1 h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                        style={{ width: `${Math.max(percentage, count > 0 ? 8 : 0)}%` }}
                      />
                    </div>
                    <span className="w-14 text-right font-semibold text-slate-600">
                      {count} ({percentage}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top & Lowest Performer Comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {stats.highestMarks && (
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/70">
                <div className="flex items-center gap-2 text-amber-800 text-xs font-bold mb-2">
                  <Trophy className="w-4 h-4 text-amber-600" />
                  <span>Highest Scoring Student</span>
                </div>
                <div className="text-base font-bold text-slate-900">
                  {stats.highestMarks.name}
                </div>
                <div className="text-xs text-slate-600 font-mono mt-0.5">
                  Roll No: {stats.highestMarks.roll_number} &bull; {stats.highestMarks.marks}%
                </div>
                <div className="text-[11px] text-amber-700 mt-1 font-medium">
                  {stats.highestMarks.course}
                </div>
              </div>
            )}

            {stats.lowestMarks && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 text-slate-700 text-xs font-bold mb-2">
                  <TrendingDown className="w-4 h-4 text-slate-500" />
                  <span>Lowest Scoring Student</span>
                </div>
                <div className="text-base font-bold text-slate-900">
                  {stats.lowestMarks.name}
                </div>
                <div className="text-xs text-slate-600 font-mono mt-0.5">
                  Roll No: {stats.lowestMarks.roll_number} &bull; {stats.lowestMarks.marks}%
                </div>
                <div className="text-[11px] text-slate-500 mt-1 font-medium">
                  {stats.lowestMarks.course}
                </div>
              </div>
            )}
          </div>

          {/* Course Distribution */}
          {stats.courseDistribution && Object.keys(stats.courseDistribution).length > 0 && (
            <div className="p-5 rounded-2xl border border-slate-200/80 bg-white">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>Department / Course Breakdown</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {Object.entries(stats.courseDistribution).map(([course, count]) => (
                  <div
                    key={course}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between"
                  >
                    <span className="text-xs font-medium text-slate-700 truncate mr-2" title={course}>
                      {course}
                    </span>
                    <span className="text-xs font-bold bg-white px-2 py-0.5 rounded-full border border-slate-200 text-slate-800">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-sm font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition-colors"
          >
            Close Analytics
          </button>
        </div>
      </div>
    </div>
  );
};

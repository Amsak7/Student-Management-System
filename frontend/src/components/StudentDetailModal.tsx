'use client';

import React from 'react';
import { X, Award, BookOpen, Calendar, Clock, CheckCircle, XCircle, Pencil } from 'lucide-react';
import { Student } from '@/types/student';

interface StudentDetailModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (student: Student) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  isOpen,
  onClose,
  onEdit,
}) => {
  if (!isOpen || !student) return null;

  const isPass = student.status === 'PASS';

  const getGradeTheme = (grade: string) => {
    switch (grade) {
      case 'A+':
        return { bg: 'bg-emerald-500', text: 'text-emerald-700', light: 'bg-emerald-50' };
      case 'A':
        return { bg: 'bg-indigo-500', text: 'text-indigo-700', light: 'bg-indigo-50' };
      case 'B':
        return { bg: 'bg-sky-500', text: 'text-sky-700', light: 'bg-sky-50' };
      case 'C':
        return { bg: 'bg-amber-500', text: 'text-amber-700', light: 'bg-amber-50' };
      case 'D':
        return { bg: 'bg-orange-500', text: 'text-orange-700', light: 'bg-orange-50' };
      default:
        return { bg: 'bg-rose-500', text: 'text-rose-700', light: 'bg-rose-50' };
    }
  };

  const theme = getGradeTheme(student.grade);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-white/20 text-white mb-2">
            Academic Report Card
          </span>
          <h3 className="text-xl font-bold tracking-tight">{student.name}</h3>
          <p className="text-sm text-blue-100 font-mono">Roll No: {student.roll_number}</p>
        </div>

        {/* Details Card */}
        <div className="p-6 space-y-6">
          {/* Main Score & Grade Hero */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Overall Score
              </span>
              <div className="text-3xl font-black text-slate-900 mt-0.5">
                {Number(student.marks).toFixed(2)}
                <span className="text-base font-normal text-slate-500">%</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                {isPass ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700">
                    <CheckCircle className="w-3.5 h-3.5" /> PASSED
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700">
                    <XCircle className="w-3.5 h-3.5" /> FAILED
                  </span>
                )}
              </div>
            </div>

            <div className="text-center">
              <div
                className={`w-16 h-16 rounded-2xl ${theme.bg} text-white flex items-center justify-center text-2xl font-black shadow-lg shadow-blue-500/20`}
              >
                {student.grade}
              </div>
              <span className="block text-[11px] font-semibold text-slate-600 mt-1.5">
                {student.grade_description}
              </span>
            </div>
          </div>

          {/* Academic Profile Grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-3.5 rounded-xl border border-slate-100 bg-white shadow-2xs">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
                <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                <span>Program</span>
              </div>
              <span className="font-semibold text-slate-800 line-clamp-1">{student.course}</span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-100 bg-white shadow-2xs">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
                <Calendar className="w-3.5 h-3.5 text-blue-500" />
                <span>Semester</span>
              </div>
              <span className="font-semibold text-slate-800">Semester {student.semester}</span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-100 bg-white shadow-2xs">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                <span>Student Age</span>
              </div>
              <span className="font-semibold text-slate-800">{student.age} Years</span>
            </div>

            <div className="p-3.5 rounded-xl border border-slate-100 bg-white shadow-2xs">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
                <Award className="w-3.5 h-3.5 text-blue-500" />
                <span>Standing</span>
              </div>
              <span className="font-semibold text-slate-800">
                {isPass ? 'Good Standing' : 'Needs Review'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 pt-2">
            <button
              onClick={() => {
                onClose();
                onEdit(student);
              }}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors border border-blue-200"
            >
              <Pencil className="w-4 h-4" />
              <span>Edit Record</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

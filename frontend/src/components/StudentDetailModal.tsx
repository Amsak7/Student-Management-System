'use client';

import React from 'react';
import { X, BookOpen, Calendar, Clock, Award, Pencil } from 'lucide-react';
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
  const isFail = student.grade === 'F';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Academic Header Banner */}
        <div className="bg-slate-900 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-mono tracking-wider uppercase bg-slate-800 text-slate-300 border border-slate-700 mb-2">
            Academic Transcript Record
          </span>
          <h3 className="text-xl font-bold tracking-tight text-white">{student.name}</h3>
          <p className="text-xs text-slate-400 font-mono mt-0.5">Roll No: {student.roll_number}</p>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Main Score & Grade Hero */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-200">
            <div>
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                Overall Aggregate
              </span>
              <div className="text-3xl font-bold text-slate-900 mt-0.5 font-mono">
                {Number(student.marks).toFixed(2)}
                <span className="text-sm font-normal text-slate-500">%</span>
              </div>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isPass ? 'bg-emerald-600' : 'bg-rose-500'
                  }`}
                />
                <span
                  className={`text-xs font-semibold ${
                    isPass ? 'text-emerald-700' : 'text-rose-700'
                  }`}
                >
                  {isPass ? 'Passed Requirements' : 'Failed Minimum Passing Grade'}
                </span>
              </div>
            </div>

            <div className="text-center">
              <div
                className={`w-14 h-14 rounded-lg flex items-center justify-center text-xl font-bold font-mono ${
                  isFail
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : 'bg-slate-900 text-white'
                }`}
              >
                {student.grade}
              </div>
              <span className="block text-[11px] font-medium text-slate-600 mt-1">
                {student.grade_description}
              </span>
            </div>
          </div>

          {/* Academic Profile Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-lg border border-slate-200 bg-white">
              <div className="flex items-center gap-1.5 text-slate-500 font-medium mb-1">
                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                <span>Program</span>
              </div>
              <span className="font-semibold text-slate-900 truncate block" title={student.course}>
                {student.course}
              </span>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-white">
              <div className="flex items-center gap-1.5 text-slate-500 font-medium mb-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Semester</span>
              </div>
              <span className="font-semibold text-slate-900">Semester {student.semester}</span>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-white">
              <div className="flex items-center gap-1.5 text-slate-500 font-medium mb-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Student Age</span>
              </div>
              <span className="font-semibold text-slate-900">{student.age} Years</span>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-white">
              <div className="flex items-center gap-1.5 text-slate-500 font-medium mb-1">
                <Award className="w-3.5 h-3.5 text-slate-400" />
                <span>Standing</span>
              </div>
              <span className="font-semibold text-slate-900">
                {isPass ? 'Good Standing' : 'Academic Probation'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => {
                onClose();
                onEdit(student);
              }}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Edit Record</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

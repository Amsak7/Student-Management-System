'use client';

import React, { useState, useEffect } from 'react';
import { X, UserPlus, UserCheck, AlertCircle, Loader2 } from 'lucide-react';
import { Student, CreateStudentInput, UpdateStudentInput } from '@/types/student';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    data: CreateStudentInput | UpdateStudentInput,
    isEdit: boolean,
    rollNumber?: string
  ) => Promise<boolean>;
  studentToEdit?: Student | null;
}

export const StudentModal: React.FC<StudentModalProps> = ({
  isOpen,
  onClose,
  onSave,
  studentToEdit,
}) => {
  const isEdit = !!studentToEdit;

  const [rollNumber, setRollNumber] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | string>('');
  const [course, setCourse] = useState('');
  const [semester, setSemester] = useState<number | string>('');
  const [marks, setMarks] = useState<number | string>('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (studentToEdit) {
      setRollNumber(studentToEdit.roll_number);
      setName(studentToEdit.name);
      setAge(studentToEdit.age);
      setCourse(studentToEdit.course);
      setSemester(studentToEdit.semester);
      setMarks(studentToEdit.marks);
    } else {
      setRollNumber('');
      setName('');
      setAge(20);
      setCourse('Computer Science');
      setSemester(4);
      setMarks(85.0);
    }
    setErrors({});
    setServerError(null);
  }, [studentToEdit, isOpen]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!isEdit) {
      if (!rollNumber.trim()) {
        errs.roll_number = 'Roll Number is required.';
      }
    }

    if (!name.trim()) {
      errs.name = 'Student Name is required.';
    }

    const numAge = Number(age);
    if (!age || isNaN(numAge) || numAge < 1 || numAge > 100 || !Number.isInteger(numAge)) {
      errs.age = 'Age must be a whole number between 1 and 100.';
    }

    if (!course.trim()) {
      errs.course = 'Course is required.';
    }

    const numSem = Number(semester);
    if (!semester || isNaN(numSem) || numSem < 1 || numSem > 12 || !Number.isInteger(numSem)) {
      errs.semester = 'Semester must be a whole number between 1 and 12.';
    }

    const numMarks = Number(marks);
    if (marks === '' || isNaN(numMarks) || numMarks < 0 || numMarks > 100) {
      errs.marks = 'Marks must be between 0.00 and 100.00.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      let success = false;
      if (isEdit) {
        const payload: UpdateStudentInput = {
          name: name.trim(),
          age: Number(age),
          course: course.trim(),
          semester: Number(semester),
          marks: Number(Number(marks).toFixed(2)),
        };
        success = await onSave(payload, true, studentToEdit?.roll_number);
      } else {
        const payload: CreateStudentInput = {
          roll_number: rollNumber.trim(),
          name: name.trim(),
          age: Number(age),
          course: course.trim(),
          semester: Number(semester),
          marks: Number(Number(marks).toFixed(2)),
        };
        success = await onSave(payload, false);
      }

      if (success) {
        onClose();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save student record.';
      setServerError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              {isEdit ? <UserCheck className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isEdit ? `Edit Student: ${studentToEdit?.roll_number}` : 'Add New Student'}
              </h3>
              <p className="text-xs text-slate-500">
                {isEdit ? 'Update details (Roll number is permanent)' : 'Enroll a student into the system'}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {serverError && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Roll Number */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700">
                Roll Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                disabled={isEdit}
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                placeholder="e.g. CS108"
                className={`w-full px-3.5 py-2 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-100 disabled:text-slate-500 font-mono ${
                  errors.roll_number ? 'border-rose-300' : 'border-slate-200'
                }`}
              />
              {errors.roll_number ? (
                <p className="text-[11px] text-rose-600">{errors.roll_number}</p>
              ) : (
                <p className="text-[11px] text-slate-400">
                  {isEdit ? 'Roll number is immutable' : 'Unique student primary key'}
                </p>
              )}
            </div>

            {/* Student Full Name */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700">
                Student Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Divya Sharma"
                className={`w-full px-3.5 py-2 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                  errors.name ? 'border-rose-300' : 'border-slate-200'
                }`}
              />
              {errors.name && <p className="text-[11px] text-rose-600">{errors.name}</p>}
            </div>

            {/* Age */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Age (1-100) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="20"
                className={`w-full px-3.5 py-2 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                  errors.age ? 'border-rose-300' : 'border-slate-200'
                }`}
              />
              {errors.age && <p className="text-[11px] text-rose-600">{errors.age}</p>}
            </div>

            {/* Semester */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">
                Semester (1-12) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="12"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                placeholder="4"
                className={`w-full px-3.5 py-2 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                  errors.semester ? 'border-rose-300' : 'border-slate-200'
                }`}
              />
              {errors.semester && <p className="text-[11px] text-rose-600">{errors.semester}</p>}
            </div>

            {/* Course */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700">
                Course / Academic Major <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                placeholder="e.g. Computer Science"
                className={`w-full px-3.5 py-2 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                  errors.course ? 'border-rose-300' : 'border-slate-200'
                }`}
              />
              {errors.course && <p className="text-[11px] text-rose-600">{errors.course}</p>}
            </div>

            {/* Marks */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700">
                Aggregate Marks (%) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="100"
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
                placeholder="88.5"
                className={`w-full px-3.5 py-2 text-sm bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                  errors.marks ? 'border-rose-300' : 'border-slate-200'
                }`}
              />
              {errors.marks ? (
                <p className="text-[11px] text-rose-600">{errors.marks}</p>
              ) : (
                <p className="text-[11px] text-slate-400">
                  Grade is automatically computed (A+ &ge; 90, A &ge; 80, B &ge; 70, C &ge; 60, D &ge; 50, E &ge; 40, F &lt; 40)
                </p>
              )}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-sm disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isEdit ? 'Save Changes' : 'Enroll Student'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

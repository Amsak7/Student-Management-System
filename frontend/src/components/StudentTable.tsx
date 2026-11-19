'use client';

import React from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  RotateCcw,
  Eye,
  Pencil,
  Trash2,
  FolderOpen,
} from 'lucide-react';
import { Student, FilterParams } from '@/types/student';

interface StudentTableProps {
  students: Student[];
  loading: boolean;
  filters: FilterParams;
  onFilterChange: (newFilters: Partial<FilterParams>) => void;
  onViewStudent: (student: Student) => void;
  onEditStudent: (student: Student) => void;
  onDeleteStudent: (student: Student) => void;
  onResetSeed: () => void;
  isResetting: boolean;
}

export const StudentTable: React.FC<StudentTableProps> = ({
  students,
  loading,
  filters,
  onFilterChange,
  onViewStudent,
  onEditStudent,
  onDeleteStudent,
  onResetSeed,
  isResetting,
}) => {
  const getGradeBadge = (grade: string) => {
    switch (grade) {
      case 'A+':
      case 'A':
        return 'bg-slate-900 text-white border-slate-900';
      case 'B':
      case 'C':
        return 'bg-slate-100 text-slate-800 border-slate-200';
      case 'D':
      case 'E':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-rose-50 text-rose-700 border-rose-200';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
      {/* Table Toolbar: Search & Filters */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/50">
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by student name or roll number..."
              value={filters.search || ''}
              onChange={(e) => onFilterChange({ search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* Filters & Sorting */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Course Filter */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={filters.course || ''}
                onChange={(e) => onFilterChange({ course: e.target.value })}
                className="bg-transparent focus:outline-none text-slate-700 cursor-pointer pr-1"
              >
                <option value="">All Courses</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Electronics & Communication">Electronics</option>
                <option value="Mechanical Engineering">Mechanical</option>
                <option value="cse">CSE</option>
              </select>
            </div>

            {/* Semester Filter */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700">
              <span className="text-slate-400">Sem:</span>
              <select
                value={filters.semester || ''}
                onChange={(e) => onFilterChange({ semester: e.target.value })}
                className="bg-transparent focus:outline-none text-slate-700 cursor-pointer pr-1"
              >
                <option value="">All</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>
                    Sem {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={filters.sortBy || 'roll_number'}
                onChange={(e) =>
                  onFilterChange({
                    sortBy: e.target.value as FilterParams['sortBy'],
                  })
                }
                className="bg-transparent focus:outline-none text-slate-700 cursor-pointer pr-1"
              >
                <option value="roll_number">Roll No</option>
                <option value="name">Name</option>
                <option value="marks">Marks</option>
                <option value="semester">Semester</option>
                <option value="age">Age</option>
              </select>
            </div>

            {/* Order Toggle */}
            <button
              onClick={() =>
                onFilterChange({
                  order: filters.order === 'desc' ? 'asc' : 'desc',
                })
              }
              className="px-2.5 py-1.5 text-xs font-medium bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors text-slate-700"
              title="Toggle Ascending/Descending"
            >
              {filters.order === 'desc' ? 'Desc ↓' : 'Asc ↑'}
            </button>

            {/* Reset Seed Button */}
            <button
              onClick={onResetSeed}
              disabled={isResetting}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
              title="Reset records back to initial seed data"
            >
              <RotateCcw
                className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`}
              />
              <span>Reset Seed</span>
            </button>
          </div>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-200 text-xs font-medium text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4 sm:px-6">Roll No</th>
              <th className="py-3 px-4">Student Name</th>
              <th className="py-3 px-3">Age</th>
              <th className="py-3 px-4">Course</th>
              <th className="py-3 px-3">Sem</th>
              <th className="py-3 px-4">Marks</th>
              <th className="py-3 px-3 text-center">Grade</th>
              <th className="py-3 px-3 text-center">Status</th>
              <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {loading ? (
              [1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="animate-pulse">
                  <td className="py-3.5 px-6">
                    <div className="h-4 bg-slate-200 rounded w-16"></div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="h-4 bg-slate-200 rounded w-32"></div>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="h-4 bg-slate-200 rounded w-8"></div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="h-4 bg-slate-200 rounded w-28"></div>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="h-4 bg-slate-200 rounded w-6"></div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="h-4 bg-slate-200 rounded w-12"></div>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <div className="h-5 bg-slate-200 rounded w-8 mx-auto"></div>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <div className="h-5 bg-slate-200 rounded w-14 mx-auto"></div>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <div className="h-7 bg-slate-200 rounded w-20 ml-auto"></div>
                  </td>
                </tr>
              ))
            ) : students.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-16 text-center text-slate-500">
                  <FolderOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="font-medium text-slate-700">
                    No student records found
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Try adjusting your search criteria or resetting to sample
                    data.
                  </p>
                </td>
              </tr>
            ) : (
              students.map((student) => {
                const isPass = student.status === 'PASS';
                return (
                  <tr
                    key={student.roll_number}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    {/* Roll Number */}
                    <td className="py-3 px-4 sm:px-6 font-semibold text-slate-900 font-mono text-xs">
                      {student.roll_number}
                    </td>

                    {/* Name */}
                    <td className="py-3 px-4 font-medium text-slate-900">
                      {student.name}
                    </td>

                    {/* Age */}
                    <td className="py-3 px-3 text-slate-600">{student.age}</td>

                    {/* Course */}
                    <td className="py-3 px-4 text-slate-600">
                      {student.course}
                    </td>

                    {/* Semester */}
                    <td className="py-3 px-3 text-slate-600">
                      Sem {student.semester}
                    </td>

                    {/* Marks */}
                    <td className="py-3 px-4 font-semibold text-slate-900 font-mono text-xs">
                      {Number(student.marks).toFixed(2)}%
                    </td>

                    {/* Grade Badge */}
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${getGradeBadge(
                          student.grade
                        )}`}
                        title={student.grade_description}
                      >
                        {student.grade}
                      </span>
                    </td>

                    {/* Status Indicator */}
                    <td className="py-3 px-3 text-center">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700">
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isPass ? 'bg-emerald-600' : 'bg-rose-500'
                          }`}
                        />
                        {student.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onViewStudent(student)}
                          className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                          title="View Official Record"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEditStudent(student)}
                          className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                          title="Edit Student"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteStudent(student)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                          title="Delete Student"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="p-3.5 bg-slate-50/50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
        <span>Showing {students.length} student records</span>
        <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600 text-[11px]">
          API Endpoint: GET /api/v1/students
        </span>
      </div>
    </div>
  );
};

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/Navbar';
import { KpiCards } from '@/components/KpiCards';
import { StudentTable } from '@/components/StudentTable';
import { StudentModal } from '@/components/StudentModal';
import { StudentDetailModal } from '@/components/StudentDetailModal';
import { AnalyticsModal } from '@/components/AnalyticsModal';
import { WorkflowModal } from '@/components/WorkflowModal';
import { Toast, ToastMessage } from '@/components/Toast';
import { api } from '@/lib/api';
import {
  Student,
  StudentStats,
  HealthStatus,
  FilterParams,
  CreateStudentInput,
  UpdateStudentInput,
} from '@/types/student';

export default function HomePage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [backendHealth, setBackendHealth] = useState<HealthStatus | null>(null);

  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [isResetting, setIsResetting] = useState(false);

  const [filters, setFilters] = useState<FilterParams>({
    search: '',
    course: '',
    semester: '',
    sortBy: 'roll_number',
    order: 'asc',
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Modal states
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const [isWorkflowModalOpen, setIsWorkflowModalOpen] = useState(false);

  // Toast Helper
  const showToast = useCallback(
    (message: string, type: 'success' | 'error' | 'info' = 'info') => {
      const id = `${Date.now()}-${Math.random()}`;
      setToasts((prev) => [...prev, { id, message, type }]);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch Students list
  const fetchStudents = useCallback(async () => {
    setLoadingStudents(true);
    try {
      const res = await api.getStudents(filters);
      if (res.success) {
        setStudents(res.data);
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Error retrieving student records';
      showToast(msg, 'error');
    } finally {
      setLoadingStudents(false);
    }
  }, [filters, showToast]);

  // Fetch Academic Statistics
  const fetchStats = useCallback(async () => {
    setLoadingStats(true);
    try {
      const res = await api.getStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch {
      // Background statistics fetch error can be silent on initial load
    } finally {
      setLoadingStats(false);
    }
  }, []);

  // Check Backend Health
  const checkHealth = useCallback(async () => {
    try {
      const health = await api.getHealth();
      setBackendHealth(health);
    } catch {
      setBackendHealth(null);
    }
  }, []);

  // Initial Load
  useEffect(() => {
    checkHealth();
    fetchStats();
  }, [checkHealth, fetchStats]);

  // Re-fetch on filter change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudents();
    }, 200);
    return () => clearTimeout(timer);
  }, [fetchStudents]);

  // Filter change handler
  const handleFilterChange = (newFilters: Partial<FilterParams>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Student CRUD actions
  const handleOpenAddModal = () => {
    setStudentToEdit(null);
    setIsStudentModalOpen(true);
  };

  const handleOpenEditModal = (student: Student) => {
    setStudentToEdit(student);
    setIsStudentModalOpen(true);
  };

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    setIsDetailModalOpen(true);
  };

  const handleSaveStudent = async (
    data: CreateStudentInput | UpdateStudentInput,
    isEdit: boolean,
    rollNumber?: string
  ): Promise<boolean> => {
    try {
      if (isEdit && rollNumber) {
        const res = await api.updateStudent(
          rollNumber,
          data as UpdateStudentInput
        );
        showToast(
          res.message || `Student '${res.data.name}' updated successfully!`,
          'success'
        );
      } else {
        const res = await api.createStudent(data as CreateStudentInput);
        showToast(
          res.message || `Student '${res.data.name}' enrolled successfully!`,
          'success'
        );
      }

      fetchStudents();
      fetchStats();
      return true;
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Failed to save student record.';
      showToast(msg, 'error');
      return false;
    }
  };

  const handleDeleteStudent = async (student: Student) => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete student "${student.name}" (Roll No: ${student.roll_number})?`
    );

    if (!confirmed) return;

    try {
      const res = await api.deleteStudent(student.roll_number);
      showToast(
        res.message || `Student '${student.name}' deleted successfully`,
        'success'
      );
      fetchStudents();
      fetchStats();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Failed to delete student.';
      showToast(msg, 'error');
    }
  };

  const handleResetSeed = async () => {
    const confirmed = window.confirm(
      'Reset student database back to initial sample records? Any newly added students will be replaced.'
    );

    if (!confirmed) return;

    setIsResetting(true);
    try {
      const res = await api.resetDatabase();
      showToast('Student database restored to default seed records!', 'info');
      setStudents(res.data);
      fetchStats();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : 'Failed to reset seed database.';
      showToast(msg, 'error');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Navigation Header */}
      <Navbar
        backendHealth={backendHealth}
        onOpenAddModal={handleOpenAddModal}
        onOpenWorkflowModal={() => setIsWorkflowModalOpen(true)}
        onOpenAnalyticsModal={() => setIsAnalyticsModalOpen(true)}
        onResetSeed={handleResetSeed}
        isResetting={isResetting}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* KPI Academic Metrics */}
        <KpiCards stats={stats} loading={loadingStats} />

        {/* Student Data Table */}
        <StudentTable
          students={students}
          loading={loadingStudents}
          filters={filters}
          onFilterChange={handleFilterChange}
          onViewStudent={handleViewStudent}
          onEditStudent={handleOpenEditModal}
          onDeleteStudent={handleDeleteStudent}
          onResetSeed={handleResetSeed}
          isResetting={isResetting}
        />
      </main>

      {/* Academic Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            Department of Computer Science & Engineering &bull; Final Year Capstone Project
          </p>
          <div className="flex items-center gap-4">
            <a
              href="http://localhost:3000/api-docs"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline font-semibold"
            >
              Interactive Swagger Docs (/api-docs)
            </a>
            <span>&bull;</span>
            <button
              onClick={() => setIsWorkflowModalOpen(true)}
              className="text-slate-600 hover:text-slate-900 font-semibold"
            >
              Architecture & Workflow
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <StudentModal
        isOpen={isStudentModalOpen}
        onClose={() => setIsStudentModalOpen(false)}
        onSave={handleSaveStudent}
        studentToEdit={studentToEdit}
      />

      <StudentDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onEdit={handleOpenEditModal}
        student={selectedStudent}
      />

      <AnalyticsModal
        isOpen={isAnalyticsModalOpen}
        onClose={() => setIsAnalyticsModalOpen(false)}
        stats={stats}
      />

      <WorkflowModal
        isOpen={isWorkflowModalOpen}
        onClose={() => setIsWorkflowModalOpen(false)}
      />

      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

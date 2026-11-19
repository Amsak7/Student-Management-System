import {
  Student,
  StudentStats,
  CreateStudentInput,
  UpdateStudentInput,
  FilterParams,
  ApiResponse,
  HealthStatus,
} from '@/types/student';

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || 'http://localhost:3000';

class ApiError extends Error {
  statusCode: number;
  details?: Array<{ field: string; message: string }>;

  constructor(
    message: string,
    statusCode: number = 500,
    details?: Array<{ field: string; message: string }>
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const errMsg =
        data?.error?.message ||
        data?.message ||
        `HTTP Request failed with status ${res.status}`;
      throw new ApiError(errMsg, res.status, data?.error?.details);
    }

    return data as T;
  } catch (err: unknown) {
    if (err instanceof ApiError) {
      throw err;
    }
    const message =
      err instanceof Error
        ? err.message
        : 'Failed to connect to Student Management System backend server';
    throw new ApiError(message, 503);
  }
}

export const api = {
  // Retrieve all students with optional search, filtering, and sorting
  async getStudents(params: FilterParams = {}): Promise<ApiResponse<Student[]>> {
    const searchParams = new URLSearchParams();

    if (params.search?.trim()) searchParams.append('search', params.search.trim());
    if (params.course) searchParams.append('course', params.course);
    if (params.semester) searchParams.append('semester', String(params.semester));
    if (params.minMarks !== undefined && params.minMarks !== '') {
      searchParams.append('minMarks', String(params.minMarks));
    }
    if (params.maxMarks !== undefined && params.maxMarks !== '') {
      searchParams.append('maxMarks', String(params.maxMarks));
    }
    if (params.sortBy) searchParams.append('sortBy', params.sortBy);
    if (params.order) searchParams.append('order', params.order);
    if (params.page) searchParams.append('page', String(params.page));
    if (params.limit) searchParams.append('limit', String(params.limit));

    const qs = searchParams.toString();
    const endpoint = `/api/v1/students${qs ? `?${qs}` : ''}`;
    return request<ApiResponse<Student[]>>(endpoint, { method: 'GET' });
  },

  // Lookup single student by roll number (case-insensitive)
  async getStudent(rollNumber: string): Promise<ApiResponse<Student>> {
    return request<ApiResponse<Student>>(
      `/api/v1/students/${encodeURIComponent(rollNumber)}`,
      { method: 'GET' }
    );
  },

  // Enroll a new student
  async createStudent(input: CreateStudentInput): Promise<ApiResponse<Student>> {
    return request<ApiResponse<Student>>('/api/v1/students', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  // Update existing student details (roll number is immutable)
  async updateStudent(
    rollNumber: string,
    input: UpdateStudentInput
  ): Promise<ApiResponse<Student>> {
    return request<ApiResponse<Student>>(
      `/api/v1/students/${encodeURIComponent(rollNumber)}`,
      {
        method: 'PUT',
        body: JSON.stringify(input),
      }
    );
  },

  // Remove student by roll number
  async deleteStudent(rollNumber: string): Promise<ApiResponse<Student>> {
    return request<ApiResponse<Student>>(
      `/api/v1/students/${encodeURIComponent(rollNumber)}`,
      { method: 'DELETE' }
    );
  },

  // Fetch aggregate academic metrics and statistics
  async getStats(): Promise<ApiResponse<StudentStats>> {
    return request<ApiResponse<StudentStats>>('/api/v1/students/stats', {
      method: 'GET',
    });
  },

  // Reset database back to baseline seed dataset
  async resetDatabase(): Promise<ApiResponse<Student[]>> {
    return request<ApiResponse<Student[]>>('/api/v1/students/reset', {
      method: 'POST',
    });
  },

  // Health check
  async getHealth(): Promise<HealthStatus> {
    return request<HealthStatus>('/api/v1/health', { method: 'GET' });
  },
};

export interface Student {
  roll_number: string;
  name: string;
  age: number;
  course: string;
  semester: number;
  marks: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  grade_description: string;
  status: 'PASS' | 'FAIL';
}

export interface StudentStats {
  totalStudents: number;
  averageMarks: number;
  highestMarks: {
    roll_number: string;
    name: string;
    marks: number;
    course: string;
  } | null;
  lowestMarks: {
    roll_number: string;
    name: string;
    marks: number;
    course: string;
  } | null;
  passingPercentage: number;
  passedStudents: number;
  failedStudents: number;
  gradeDistribution: Record<string, number>;
  courseDistribution: Record<string, number>;
}

export interface CreateStudentInput {
  roll_number: string;
  name: string;
  age: number;
  course: string;
  semester: number;
  marks: number;
}

export interface UpdateStudentInput {
  name?: string;
  age?: number;
  course?: string;
  semester?: number;
  marks?: number;
}

export interface FilterParams {
  search?: string;
  course?: string;
  semester?: number | string;
  minMarks?: number | string;
  maxMarks?: number | string;
  sortBy?: 'roll_number' | 'name' | 'marks' | 'semester' | 'age';
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  count?: number;
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  data: T;
  error?: {
    message: string;
    statusCode: number;
    details?: Array<{ field: string; message: string }>;
    timestamp?: string;
  };
}

export interface HealthStatus {
  status: 'UP' | 'DOWN';
  uptimeSeconds: number;
  nodeVersion: string;
  environment: string;
  timestamp: string;
}

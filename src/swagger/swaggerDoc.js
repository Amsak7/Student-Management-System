const swaggerUi = require('swagger-ui-express');

const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'Student Management System API',
    version: '2.0.0',
    description: `
### Academic Project Demonstration
**Department of Computer Science & Engineering**
This interactive API documentation serves as a live demonstration interface for professors and evaluators. 
It replaces the legacy Python CLI console application with a robust, asynchronous RESTful Node.js + Express web service.

#### Key Architectural Highlights:
- **Layered Architecture**: Controller $\\rightarrow$ Service $\\rightarrow$ Repository $\\rightarrow$ Storage
- **Idempotency & Data Integrity**: Case-insensitive unique roll numbers, immutable primary keys
- **Academic Analytics**: Real-time statistics, average calculation, letter grading (A+ through F)
- **Interactive Sandbox**: Use the **"Try it out"** button on any endpoint below to test live requests against the backend!
    `,
    contact: {
      name: 'Project Development Team (Computer Science & Engineering)',
      email: 'student.project@university.edu',
    },
    license: {
      name: 'MIT License',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Local Development & Demonstration Server',
    },
  ],
  tags: [
    {
      name: 'Students',
      description: 'Core CRUD endpoints for managing student records',
    },
    {
      name: 'Analytics & Reports',
      description: 'Computed academic metrics, grade distributions, and performance statistics',
    },
    {
      name: 'System & Utilities',
      description: 'System health checks, database reset, and diagnostics',
    },
  ],
  paths: {
    '/api/v1/students': {
      get: {
        tags: ['Students'],
        summary: 'Retrieve all students (with filtering, sorting & pagination)',
        description: 'Returns a complete list of students stored in the system, or filtered/sorted subsets based on query parameters.',
        parameters: [
          {
            name: 'search',
            in: 'query',
            description: 'Search substring matching student name or roll number (case-insensitive)',
            required: false,
            schema: { type: 'string', example: 'Aarav' },
          },
          {
            name: 'course',
            in: 'query',
            description: 'Filter students by course name',
            required: false,
            schema: { type: 'string', example: 'Computer Science' },
          },
          {
            name: 'semester',
            in: 'query',
            description: 'Filter students by semester (1-12)',
            required: false,
            schema: { type: 'integer', minimum: 1, maximum: 12, example: 4 },
          },
          {
            name: 'minMarks',
            in: 'query',
            description: 'Filter students scoring greater than or equal to this mark',
            required: false,
            schema: { type: 'number', minimum: 0, maximum: 100, example: 75 },
          },
          {
            name: 'maxMarks',
            in: 'query',
            description: 'Filter students scoring less than or equal to this mark',
            required: false,
            schema: { type: 'number', minimum: 0, maximum: 100, example: 100 },
          },
          {
            name: 'sortBy',
            in: 'query',
            description: 'Property to sort by',
            required: false,
            schema: {
              type: 'string',
              enum: ['roll_number', 'name', 'age', 'course', 'semester', 'marks'],
              default: 'roll_number',
            },
          },
          {
            name: 'order',
            in: 'query',
            description: 'Sorting direction',
            required: false,
            schema: {
              type: 'string',
              enum: ['asc', 'desc'],
              default: 'asc',
            },
          },
          {
            name: 'page',
            in: 'query',
            description: 'Page number for pagination',
            required: false,
            schema: { type: 'integer', minimum: 1, default: 1 },
          },
          {
            name: 'limit',
            in: 'query',
            description: 'Number of items per page',
            required: false,
            schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
          },
        ],
        responses: {
          200: {
            description: 'Array of student records retrieved successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Students retrieved successfully' },
                    count: { type: 'integer', example: 6 },
                    total: { type: 'integer', example: 6 },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Student' },
                    },
                  },
                },
              },
            },
          },
          500: {
            $ref: '#/components/responses/InternalServerError',
          },
        },
      },
      post: {
        tags: ['Students'],
        summary: 'Add a new student record',
        description: 'Creates a new student record. Roll number must be unique. Input values are strictly validated according to academic rules.',
        requestBody: {
          required: true,
          description: 'Student details to create',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateStudentInput' },
            },
          },
        },
        responses: {
          201: {
            description: 'Student successfully created',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: "Student 'Rohan Verma' created successfully" },
                    data: { $ref: '#/components/schemas/Student' },
                  },
                },
              },
            },
          },
          400: {
            $ref: '#/components/responses/ValidationError',
          },
          409: {
            description: 'Conflict - Duplicate roll number detected',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
                  error: {
                    message: "A student with Roll Number 'CS101' already exists. Cannot add a duplicate record.",
                    statusCode: 409,
                    timestamp: '2026-11-14T19:50:00.000Z',
                  },
                },
              },
            },
          },
          500: {
            $ref: '#/components/responses/InternalServerError',
          },
        },
      },
    },
    '/api/v1/students/stats': {
      get: {
        tags: ['Analytics & Reports'],
        summary: 'Compute academic statistics & analytics',
        description: 'Calculates high-level academic performance metrics including average marks, highest/lowest scores, pass percentage, grade distribution, and course enrollment.',
        responses: {
          200: {
            description: 'Analytics metrics computed successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Academic statistics computed successfully' },
                    data: { $ref: '#/components/schemas/StudentStats' },
                  },
                },
              },
            },
          },
          500: {
            $ref: '#/components/responses/InternalServerError',
          },
        },
      },
    },
    '/api/v1/students/{rollNumber}': {
      get: {
        tags: ['Students'],
        summary: 'Search a student by roll number',
        description: 'Looks up a student by roll number using case-insensitive comparison (e.g., "cs101" matches "CS101").',
        parameters: [
          {
            name: 'rollNumber',
            in: 'path',
            required: true,
            description: 'Unique student roll number',
            schema: { type: 'string', example: 'CS101' },
          },
        ],
        responses: {
          200: {
            description: 'Student found and details returned',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Student retrieved successfully' },
                    data: { $ref: '#/components/schemas/Student' },
                  },
                },
              },
            },
          },
          404: {
            description: 'Student not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
                example: {
                  success: false,
                  error: {
                    message: "No student found with Roll Number 'CS999'.",
                    statusCode: 404,
                    timestamp: '2026-11-14T19:50:00.000Z',
                  },
                },
              },
            },
          },
          500: {
            $ref: '#/components/responses/InternalServerError',
          },
        },
      },
      put: {
        tags: ['Students'],
        summary: 'Update student details by roll number',
        description: 'Updates one or more fields of an existing student. The roll number itself is immutable to maintain relational integrity.',
        parameters: [
          {
            name: 'rollNumber',
            in: 'path',
            required: true,
            description: 'Unique student roll number to update',
            schema: { type: 'string', example: 'CS101' },
          },
        ],
        requestBody: {
          required: true,
          description: 'Fields to update (at least one field must be supplied)',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/UpdateStudentInput' },
            },
          },
        },
        responses: {
          200: {
            description: 'Student successfully updated',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: "Student 'Aarav Sharma' updated successfully" },
                    data: { $ref: '#/components/schemas/Student' },
                  },
                },
              },
            },
          },
          400: {
            $ref: '#/components/responses/ValidationError',
          },
          404: {
            description: 'Student not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          500: {
            $ref: '#/components/responses/InternalServerError',
          },
        },
      },
      delete: {
        tags: ['Students'],
        summary: 'Delete a student record by roll number',
        description: 'Permanently removes a student record from the system after finding them by roll number.',
        parameters: [
          {
            name: 'rollNumber',
            in: 'path',
            required: true,
            description: 'Unique student roll number to delete',
            schema: { type: 'string', example: 'CS101' },
          },
        ],
        responses: {
          200: {
            description: 'Student successfully deleted',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: {
                      type: 'string',
                      example: "Student 'Aarav Sharma' (Roll No: CS101) deleted successfully",
                    },
                    data: { $ref: '#/components/schemas/Student' },
                  },
                },
              },
            },
          },
          404: {
            description: 'Student not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ErrorResponse' },
              },
            },
          },
          500: {
            $ref: '#/components/responses/InternalServerError',
          },
        },
      },
    },
    '/api/v1/students/reset': {
      post: {
        tags: ['System & Utilities'],
        summary: 'Reset database to initial seed dataset',
        description: 'Special demonstration utility for professors. Resets students.json back to standard baseline sample data for testing.',
        responses: {
          200: {
            description: 'Database reset completed',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: {
                      type: 'string',
                      example: 'Student database successfully restored to initial seed state',
                    },
                    count: { type: 'integer', example: 6 },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/v1/health': {
      get: {
        tags: ['System & Utilities'],
        summary: 'Server health check and diagnostics',
        description: 'Returns server runtime status, memory consumption, uptime, and environment details.',
        responses: {
          200: {
            description: 'Server is healthy and functioning properly',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'UP' },
                    uptimeSeconds: { type: 'number', example: 120.45 },
                    nodeVersion: { type: 'string', example: 'v24.11.0' },
                    environment: { type: 'string', example: 'development' },
                    timestamp: { type: 'string', example: '2026-11-14T19:50:00.000Z' },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Student: {
        type: 'object',
        properties: {
          roll_number: {
            type: 'string',
            description: 'Unique primary identifier for student',
            example: 'CS101',
          },
          name: {
            type: 'string',
            description: 'Full name of the student',
            example: 'Aarav Sharma',
          },
          age: {
            type: 'integer',
            description: 'Age in years (1 to 100)',
            example: 20,
          },
          course: {
            type: 'string',
            description: 'Degree / Academic program enrolled',
            example: 'Computer Science',
          },
          semester: {
            type: 'integer',
            description: 'Current academic semester (1 to 12)',
            example: 4,
          },
          marks: {
            type: 'number',
            format: 'float',
            description: 'Aggregate percentage marks (0.00 to 100.00)',
            example: 88.5,
          },
          grade: {
            type: 'string',
            description: 'Calculated letter grade (A+, A, B, C, D, E, F)',
            example: 'A',
          },
          grade_description: {
            type: 'string',
            description: 'Qualitative remark',
            example: 'Excellent',
          },
          status: {
            type: 'string',
            enum: ['PASS', 'FAIL'],
            description: 'Academic result status',
            example: 'PASS',
          },
        },
      },
      CreateStudentInput: {
        type: 'object',
        required: ['roll_number', 'name', 'age', 'course', 'semester', 'marks'],
        properties: {
          roll_number: {
            type: 'string',
            description: 'Unique alphanumeric identifier',
            example: 'CS105',
          },
          name: {
            type: 'string',
            description: 'Student full legal name',
            example: 'Sneha Rao',
          },
          age: {
            type: 'integer',
            minimum: 1,
            maximum: 100,
            description: 'Age in years',
            example: 20,
          },
          course: {
            type: 'string',
            description: 'Academic department / major',
            example: 'Computer Science',
          },
          semester: {
            type: 'integer',
            minimum: 1,
            maximum: 12,
            description: 'Current enrolled semester',
            example: 4,
          },
          marks: {
            type: 'number',
            minimum: 0,
            maximum: 100,
            description: 'Aggregate percentage (0 to 100)',
            example: 92.5,
          },
        },
      },
      UpdateStudentInput: {
        type: 'object',
        description: 'Provide any subset of fields to update. Roll number cannot be modified.',
        properties: {
          name: {
            type: 'string',
            description: 'Updated name',
            example: 'Sneha K. Rao',
          },
          age: {
            type: 'integer',
            minimum: 1,
            maximum: 100,
            example: 21,
          },
          course: {
            type: 'string',
            example: 'Artificial Intelligence & Data Science',
          },
          semester: {
            type: 'integer',
            minimum: 1,
            maximum: 12,
            example: 5,
          },
          marks: {
            type: 'number',
            minimum: 0,
            maximum: 100,
            example: 95.0,
          },
        },
      },
      StudentStats: {
        type: 'object',
        properties: {
          totalStudents: { type: 'integer', example: 6 },
          averageMarks: { type: 'number', example: 83.17 },
          highestMarks: {
            type: 'object',
            properties: {
              roll_number: { type: 'string', example: 'CS102' },
              name: { type: 'string', example: 'Priya Patel' },
              marks: { type: 'number', example: 94.0 },
              course: { type: 'string', example: 'Computer Science' },
            },
          },
          lowestMarks: {
            type: 'object',
            properties: {
              roll_number: { type: 'string', example: 'ME401' },
              name: { type: 'string', example: 'Vikram Singh' },
              marks: { type: 'number', example: 68.0 },
              course: { type: 'string', example: 'Mechanical Engineering' },
            },
          },
          passingPercentage: { type: 'number', example: 100.0 },
          passedStudents: { type: 'integer', example: 6 },
          failedStudents: { type: 'integer', example: 0 },
          gradeDistribution: {
            type: 'object',
            example: { 'A+': 2, A: 2, B: 1, C: 1, D: 0, E: 0, F: 0 },
          },
          courseDistribution: {
            type: 'object',
            example: {
              'Computer Science': 2,
              'Information Technology': 1,
              'Electronics & Communication': 1,
              'Mechanical Engineering': 1,
              cse: 1,
            },
          },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: {
            type: 'object',
            properties: {
              message: { type: 'string', example: 'Error description message' },
              statusCode: { type: 'integer', example: 400 },
              details: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    field: { type: 'string', example: 'age' },
                    message: { type: 'string', example: 'Age must be a valid whole number between 1 and 100.' },
                  },
                },
              },
              timestamp: { type: 'string', example: '2026-11-14T19:50:00.000Z' },
            },
          },
        },
      },
    },
    responses: {
      ValidationError: {
        description: 'Bad Request - Validation constraints violated',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
            example: {
              success: false,
              error: {
                message: 'Student validation failed',
                statusCode: 400,
                details: [
                  { field: 'age', message: 'Age must be a valid whole number between 1 and 100.' },
                  { field: 'marks', message: 'Marks must be a valid number between 0 and 100.' },
                ],
                timestamp: '2026-11-14T19:50:00.000Z',
              },
            },
          },
        },
      },
      InternalServerError: {
        description: 'Internal server error occurred',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ErrorResponse' },
          },
        },
      },
    },
  },
};

const customCss = `
  .topbar { display: none !important; }
  .swagger-ui .info { margin: 25px 0 20px 0; }
  .swagger-ui .info .title { font-family: 'Segoe UI', system-ui, sans-serif; color: #1e3a8a; }
  .swagger-ui .opblock.opblock-get { border-color: #3b82f6; background: rgba(59, 130, 246, .05); }
  .swagger-ui .opblock.opblock-post { border-color: #10b981; background: rgba(16, 185, 129, .05); }
  .swagger-ui .opblock.opblock-put { border-color: #f59e0b; background: rgba(245, 158, 11, .05); }
  .swagger-ui .opblock.opblock-delete { border-color: #ef4444; background: rgba(239, 68, 68, .05); }
  .swagger-ui .btn.execute { background-color: #2563eb !important; border-color: #1d4ed8 !important; }
  .custom-header-banner {
    background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
    color: white;
    padding: 16px 24px;
    border-radius: 8px;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
  }
  .custom-header-banner h2 { margin: 0; color: white !important; font-size: 20px; }
  .custom-header-banner a {
    color: #1e3a8a;
    background: white;
    padding: 8px 16px;
    border-radius: 6px;
    text-decoration: none;
    font-weight: 600;
    font-size: 14px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
`;

function setupSwagger(app) {
  const swaggerHtml = swaggerUi.generateHTML(openApiSpec, {
    customCss,
    customSiteTitle: 'Student Management System - Interactive Swagger API Docs',
  });

  // Inject banner into the Swagger UI wrapper
  const bannerInjectedHtml = swaggerHtml.replace(
    '<div id="swagger-ui"></div>',
    `<div class="swagger-ui" style="max-width: 1460px; margin: 0 auto; padding: 20px 20px 0 20px;">
      <div class="custom-header-banner">
        <div>
          <h2>Student Management System API - Academic Evaluation Console</h2>
          <small>Department of Computer Science & Engineering | Express.js RESTful Architecture</small>
        </div>
        <a href="/">Back to Web Dashboard</a>
      </div>
    </div>
    <div id="swagger-ui"></div>`
  );

  app.use('/api-docs', swaggerUi.serveFiles(openApiSpec, {}));
  app.get('/api-docs', (req, res) => {
    res.send(bannerInjectedHtml);
  });
  app.get('/docs', (req, res) => res.redirect('/api-docs'));

  // Expose raw OpenAPI JSON spec for automated tool ingestion
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(openApiSpec);
  });
}

module.exports = {
  setupSwagger,
  openApiSpec,
};

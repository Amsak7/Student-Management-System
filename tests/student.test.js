const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const fs = require('fs');
const path = require('path');

// Set test environment
process.env.NODE_ENV = 'test';
process.env.DATA_FILE_NAME = 'test_students.json';

const app = require('../src/app');
const config = require('../src/config');
const studentRepository = require('../src/repositories/studentRepository');

describe('Student Management System - Integration Test Suite', () => {
  before(async () => {
    // Reset test data file before tests
    await studentRepository.resetToSeed();
  });

  after(async () => {
    // Clean up temporary test data file
    if (fs.existsSync(config.dataFile)) {
      try {
        fs.unlinkSync(config.dataFile);
      } catch (e) {}
    }
  });

  it('1. GET /api/v1/health should return UP status and server metrics', async () => {
    const res = await request(app).get('/api/v1/health');
    assert.equal(res.status, 200);
    assert.equal(res.body.status, 'UP');
    assert.ok(res.body.uptimeSeconds >= 0);
    assert.ok(res.body.nodeVersion);
  });

  it('2. GET /api/v1/students should list all student records', async () => {
    const res = await request(app).get('/api/v1/students');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
    assert.ok(res.body.total >= 1);
  });

  it('3. GET /api/v1/students/:rollNumber should find student case-insensitively', async () => {
    // Look up "cs101" in lowercase (stored as "CS101")
    const res = await request(app).get('/api/v1/students/cs101');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.roll_number, 'CS101');
    assert.equal(res.body.data.name, 'Aarav Sharma');
    assert.ok(res.body.data.grade);
    assert.equal(res.body.data.status, 'PASS');
  });

  it('4. GET /api/v1/students/:rollNumber should return 404 for non-existent roll number', async () => {
    const res = await request(app).get('/api/v1/students/NON_EXISTENT_999');
    assert.equal(res.status, 404);
    assert.equal(res.body.success, false);
    assert.match(res.body.error.message, /No student found/);
  });

  it('5. POST /api/v1/students should successfully create a new student record', async () => {
    const newStudent = {
      roll_number: 'TEST2026',
      name: 'Evaluation Test Student',
      age: 22,
      course: 'Software Engineering',
      semester: 6,
      marks: 95.5,
    };

    const res = await request(app).post('/api/v1/students').send(newStudent);
    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.roll_number, 'TEST2026');
    assert.equal(res.body.data.grade, 'A+');
    assert.equal(res.body.data.status, 'PASS');
  });

  it('6. POST /api/v1/students should return 409 Conflict for duplicate roll number', async () => {
    const duplicateStudent = {
      roll_number: 'test2026', // case-insensitive match
      name: 'Another Name',
      age: 20,
      course: 'IT',
      semester: 2,
      marks: 80,
    };

    const res = await request(app).post('/api/v1/students').send(duplicateStudent);
    assert.equal(res.status, 409);
    assert.equal(res.body.success, false);
    assert.match(res.body.error.message, /already exists/);
  });

  it('7. POST /api/v1/students should return 400 Bad Request for invalid age (> 100)', async () => {
    const invalidStudent = {
      roll_number: 'FAIL01',
      name: 'Bad Age Student',
      age: 150,
      course: 'CSE',
      semester: 2,
      marks: 80,
    };

    const res = await request(app).post('/api/v1/students').send(invalidStudent);
    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
    assert.ok(res.body.error.details.some((d) => d.field === 'age'));
  });

  it('8. POST /api/v1/students should return 400 Bad Request for invalid marks (> 100)', async () => {
    const invalidStudent = {
      roll_number: 'FAIL02',
      name: 'Bad Marks Student',
      age: 21,
      course: 'CSE',
      semester: 2,
      marks: 105,
    };

    const res = await request(app).post('/api/v1/students').send(invalidStudent);
    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
    assert.ok(res.body.error.details.some((d) => d.field === 'marks'));
  });

  it('9. PUT /api/v1/students/:rollNumber should update allowable fields and recalculate grade', async () => {
    const res = await request(app)
      .put('/api/v1/students/TEST2026')
      .send({
        name: 'Evaluation Test Student (Updated)',
        marks: 45.0,
      });

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.name, 'Evaluation Test Student (Updated)');
    assert.equal(res.body.data.marks, 45.0);
    assert.equal(res.body.data.grade, 'E'); // 45 is grade E
    assert.equal(res.body.data.status, 'PASS');
  });

  it('10. PUT /api/v1/students/:rollNumber should disallow modifying roll number', async () => {
    const res = await request(app)
      .put('/api/v1/students/TEST2026')
      .send({
        roll_number: 'NEW_ROLL_CHANGED',
        marks: 50,
      });

    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
    assert.match(res.body.error.details[0].message, /Roll number cannot be changed/);
  });

  it('11. DELETE /api/v1/students/:rollNumber should delete the record', async () => {
    const res = await request(app).delete('/api/v1/students/TEST2026');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.roll_number, 'TEST2026');

    // Confirm deletion
    const verifyRes = await request(app).get('/api/v1/students/TEST2026');
    assert.equal(verifyRes.status, 404);
  });

  it('12. GET /api/v1/students/stats should compute accurate analytics', async () => {
    const res = await request(app).get('/api/v1/students/stats');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.data.totalStudents >= 1);
    assert.ok(res.body.data.averageMarks >= 0);
    assert.ok(res.body.data.highestMarks);
    assert.ok(res.body.data.gradeDistribution);
  });

  it('13. GET /api/v1/students with search query should filter records', async () => {
    const res = await request(app).get('/api/v1/students?search=Aarav');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.data.length >= 1);
    assert.match(res.body.data[0].name, /Aarav/);
  });

  it('14. GET /api-docs should serve the interactive Swagger documentation page', async () => {
    const res = await request(app).get('/api-docs/');
    assert.equal(res.status, 200);
    assert.match(res.text, /swagger-ui/);
    assert.match(res.text, /Student Management System API/);
  });
});

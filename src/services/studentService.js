const studentRepository = require('../repositories/studentRepository');
const { NotFoundError, ConflictError } = require('../middlewares/errors');

class StudentService {
  calculateGrade(marks) {
    if (marks >= 90) return { letter: 'A+', description: 'Outstanding' };
    if (marks >= 80) return { letter: 'A', description: 'Excellent' };
    if (marks >= 70) return { letter: 'B', description: 'Very Good' };
    if (marks >= 60) return { letter: 'C', description: 'Good' };
    if (marks >= 50) return { letter: 'D', description: 'Satisfactory' };
    if (marks >= 40) return { letter: 'E', description: 'Pass' };
    return { letter: 'F', description: 'Fail' };
  }

  enrichStudent(student) {
    const gradeInfo = this.calculateGrade(student.marks);
    return {
      ...student,
      grade: gradeInfo.letter,
      grade_description: gradeInfo.description,
      status: student.marks >= 40 ? 'PASS' : 'FAIL',
    };
  }

  async getAllStudents(query = {}) {
    let students = await studentRepository.findAll();

    // Enrich all students with academic metrics
    students = students.map((s) => this.enrichStudent(s));

    // 1. Search filter (roll_number or name substring)
    if (query.search) {
      const q = String(query.search).trim().toLowerCase();
      students = students.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          String(s.roll_number).toLowerCase().includes(q)
      );
    }

    // 2. Course filter
    if (query.course) {
      const courseFilter = String(query.course).trim().toLowerCase();
      students = students.filter((s) =>
        s.course.toLowerCase().includes(courseFilter)
      );
    }

    // 3. Semester filter
    if (query.semester !== undefined) {
      const sem = parseInt(query.semester, 10);
      if (!isNaN(sem)) {
        students = students.filter((s) => s.semester === sem);
      }
    }

    // 4. Marks range filter
    if (query.minMarks !== undefined) {
      const minM = parseFloat(query.minMarks);
      if (!isNaN(minM)) {
        students = students.filter((s) => s.marks >= minM);
      }
    }
    if (query.maxMarks !== undefined) {
      const maxM = parseFloat(query.maxMarks);
      if (!isNaN(maxM)) {
        students = students.filter((s) => s.marks <= maxM);
      }
    }

    // 5. Sorting
    const sortBy = query.sortBy || 'roll_number';
    const order = (query.order || 'asc').toLowerCase() === 'desc' ? -1 : 1;

    students.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      if (typeof valA === 'string') {
        return valA.localeCompare(valB) * order;
      }
      return ((valA ?? 0) - (valB ?? 0)) * order;
    });

    const totalCount = students.length;

    // 6. Pagination
    if (query.page || query.limit) {
      const page = Math.max(1, parseInt(query.page, 10) || 1);
      const limit = Math.max(1, parseInt(query.limit, 10) || 10);
      const startIndex = (page - 1) * limit;
      const paginatedData = students.slice(startIndex, startIndex + limit);

      return {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
        data: paginatedData,
      };
    }

    return {
      total: totalCount,
      data: students,
    };
  }

  async getStudentByRollNumber(rollNumber) {
    const student = await studentRepository.findByRollNumber(rollNumber);
    if (!student) {
      throw new NotFoundError(
        `No student found with Roll Number '${rollNumber}'.`
      );
    }
    return this.enrichStudent(student);
  }

  async createStudent(studentData) {
    const existing = await studentRepository.findByRollNumber(
      studentData.roll_number
    );
    if (existing) {
      throw new ConflictError(
        `A student with Roll Number '${studentData.roll_number}' already exists. Cannot add a duplicate record.`
      );
    }

    const students = await studentRepository.findAll();
    const newRecord = {
      roll_number: String(studentData.roll_number).trim(),
      name: String(studentData.name).trim(),
      age: parseInt(studentData.age, 10),
      course: String(studentData.course).trim(),
      semester: parseInt(studentData.semester, 10),
      marks: Number(parseFloat(studentData.marks).toFixed(2)),
    };

    students.push(newRecord);
    await studentRepository.saveAll(students);
    return this.enrichStudent(newRecord);
  }

  async updateStudent(rollNumber, updateData) {
    const students = await studentRepository.findAll();
    const normalized = String(rollNumber).trim().toLowerCase();
    const index = students.findIndex(
      (s) => String(s.roll_number).trim().toLowerCase() === normalized
    );

    if (index === -1) {
      throw new NotFoundError(
        `No student found with Roll Number '${rollNumber}'.`
      );
    }

    const existingStudent = students[index];

    // Update allowable fields, keeping roll_number strictly immutable
    if (updateData.name !== undefined) existingStudent.name = updateData.name;
    if (updateData.age !== undefined) existingStudent.age = updateData.age;
    if (updateData.course !== undefined) existingStudent.course = updateData.course;
    if (updateData.semester !== undefined) existingStudent.semester = updateData.semester;
    if (updateData.marks !== undefined) existingStudent.marks = updateData.marks;

    students[index] = existingStudent;
    await studentRepository.saveAll(students);
    return this.enrichStudent(existingStudent);
  }

  async deleteStudent(rollNumber) {
    const students = await studentRepository.findAll();
    const normalized = String(rollNumber).trim().toLowerCase();
    const index = students.findIndex(
      (s) => String(s.roll_number).trim().toLowerCase() === normalized
    );

    if (index === -1) {
      throw new NotFoundError(
        `No student found with Roll Number '${rollNumber}'.`
      );
    }

    const [deletedStudent] = students.splice(index, 1);
    await studentRepository.saveAll(students);
    return this.enrichStudent(deletedStudent);
  }

  async getStatistics() {
    const students = await studentRepository.findAll();

    if (students.length === 0) {
      return {
        totalStudents: 0,
        averageMarks: 0,
        highestMarks: null,
        lowestMarks: null,
        passingPercentage: 0,
        gradeDistribution: { 'A+': 0, A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 },
        courseDistribution: {},
      };
    }

    let totalMarks = 0;
    let highestStudent = students[0];
    let lowestStudent = students[0];
    let passCount = 0;
    const gradeDistribution = { 'A+': 0, A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };
    const courseDistribution = {};

    for (const student of students) {
      totalMarks += student.marks;

      if (student.marks > highestStudent.marks) {
        highestStudent = student;
      }
      if (student.marks < lowestStudent.marks) {
        lowestStudent = student;
      }

      if (student.marks >= 40) {
        passCount += 1;
      }

      const grade = this.calculateGrade(student.marks).letter;
      if (gradeDistribution[grade] !== undefined) {
        gradeDistribution[grade] += 1;
      }

      const cName = student.course || 'Unknown';
      courseDistribution[cName] = (courseDistribution[cName] || 0) + 1;
    }

    const averageMarks = Number((totalMarks / students.length).toFixed(2));
    const passingPercentage = Number(
      ((passCount / students.length) * 100).toFixed(2)
    );

    return {
      totalStudents: students.length,
      averageMarks,
      highestMarks: {
        roll_number: highestStudent.roll_number,
        name: highestStudent.name,
        marks: highestStudent.marks,
        course: highestStudent.course,
      },
      lowestMarks: {
        roll_number: lowestStudent.roll_number,
        name: lowestStudent.name,
        marks: lowestStudent.marks,
        course: lowestStudent.course,
      },
      passingPercentage,
      passedStudents: passCount,
      failedStudents: students.length - passCount,
      gradeDistribution,
      courseDistribution,
    };
  }

  async resetData() {
    const resetList = await studentRepository.resetToSeed();
    return resetList.map((s) => this.enrichStudent(s));
  }
}

module.exports = new StudentService();

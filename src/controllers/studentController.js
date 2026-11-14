const studentService = require('../services/studentService');

class StudentController {
  async getAllStudents(req, res, next) {
    try {
      const result = await studentService.getAllStudents(req.query);
      res.status(200).json({
        success: true,
        message: 'Students retrieved successfully',
        count: Array.isArray(result.data) ? result.data.length : result.total,
        ...result,
      });
    } catch (err) {
      next(err);
    }
  }

  async getStudentByRollNumber(req, res, next) {
    try {
      const { rollNumber } = req.params;
      const student = await studentService.getStudentByRollNumber(rollNumber);
      res.status(200).json({
        success: true,
        message: 'Student retrieved successfully',
        data: student,
      });
    } catch (err) {
      next(err);
    }
  }

  async createStudent(req, res, next) {
    try {
      const newStudent = await studentService.createStudent(req.body);
      res.status(201).json({
        success: true,
        message: `Student '${newStudent.name}' created successfully`,
        data: newStudent,
      });
    } catch (err) {
      next(err);
    }
  }

  async updateStudent(req, res, next) {
    try {
      const { rollNumber } = req.params;
      const updatedStudent = await studentService.updateStudent(
        rollNumber,
        req.body
      );
      res.status(200).json({
        success: true,
        message: `Student '${updatedStudent.name}' updated successfully`,
        data: updatedStudent,
      });
    } catch (err) {
      next(err);
    }
  }

  async deleteStudent(req, res, next) {
    try {
      const { rollNumber } = req.params;
      const deletedStudent = await studentService.deleteStudent(rollNumber);
      res.status(200).json({
        success: true,
        message: `Student '${deletedStudent.name}' (Roll No: ${deletedStudent.roll_number}) deleted successfully`,
        data: deletedStudent,
      });
    } catch (err) {
      next(err);
    }
  }

  async getStatistics(req, res, next) {
    try {
      const stats = await studentService.getStatistics();
      res.status(200).json({
        success: true,
        message: 'Academic statistics computed successfully',
        data: stats,
      });
    } catch (err) {
      next(err);
    }
  }

  async resetData(req, res, next) {
    try {
      const data = await studentService.resetData();
      res.status(200).json({
        success: true,
        message: 'Student database successfully restored to initial seed state',
        count: data.length,
        data,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new StudentController();

const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const {
  validateCreateStudent,
  validateUpdateStudent,
  validateRollParam,
} = require('../middlewares/validationMiddleware');

// Analytical & utility routes (must precede param routes)
router.get('/stats', (req, res, next) =>
  studentController.getStatistics(req, res, next)
);

router.post('/reset', (req, res, next) =>
  studentController.resetData(req, res, next)
);

// Standard CRUD routes
router.get('/', (req, res, next) =>
  studentController.getAllStudents(req, res, next)
);

router.post('/', validateCreateStudent, (req, res, next) =>
  studentController.createStudent(req, res, next)
);

router.get('/:rollNumber', validateRollParam, (req, res, next) =>
  studentController.getStudentByRollNumber(req, res, next)
);

router.put(
  '/:rollNumber',
  validateRollParam,
  validateUpdateStudent,
  (req, res, next) => studentController.updateStudent(req, res, next)
);

router.delete('/:rollNumber', validateRollParam, (req, res, next) =>
  studentController.deleteStudent(req, res, next)
);

module.exports = router;

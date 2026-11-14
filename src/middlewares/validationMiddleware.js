const { ValidationError } = require('./errors');

function validateCreateStudent(req, res, next) {
  const { roll_number, name, age, course, semester, marks } = req.body;
  const errors = [];

  // Roll number validation
  if (roll_number === undefined || roll_number === null || String(roll_number).trim() === '') {
    errors.push({ field: 'roll_number', message: 'Roll Number is required and cannot be empty.' });
  }

  // Name validation
  if (name === undefined || name === null || String(name).trim() === '') {
    errors.push({ field: 'name', message: 'Student Name is required and cannot be empty.' });
  }

  // Age validation: 1 to 100
  const parsedAge = Number(age);
  if (age === undefined || age === null || !Number.isInteger(parsedAge) || parsedAge < 1 || parsedAge > 100) {
    errors.push({ field: 'age', message: 'Age must be a valid whole number between 1 and 100.' });
  }

  // Course validation
  if (course === undefined || course === null || String(course).trim() === '') {
    errors.push({ field: 'course', message: 'Course is required and cannot be empty.' });
  }

  // Semester validation: 1 to 12
  const parsedSemester = Number(semester);
  if (semester === undefined || semester === null || !Number.isInteger(parsedSemester) || parsedSemester < 1 || parsedSemester > 12) {
    errors.push({ field: 'semester', message: 'Semester must be a valid whole number between 1 and 12.' });
  }

  // Marks validation: 0.0 to 100.0
  const parsedMarks = Number(marks);
  if (marks === undefined || marks === null || isNaN(parsedMarks) || parsedMarks < 0 || parsedMarks > 100) {
    errors.push({ field: 'marks', message: 'Marks must be a valid number between 0 and 100.' });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Student validation failed', errors));
  }

  // Clean / normalize values
  req.body.roll_number = String(roll_number).trim();
  req.body.name = String(name).trim();
  req.body.age = parsedAge;
  req.body.course = String(course).trim();
  req.body.semester = parsedSemester;
  req.body.marks = Number(parsedMarks.toFixed(2));

  next();
}

function validateUpdateStudent(req, res, next) {
  const { roll_number, name, age, course, semester, marks } = req.body;
  const errors = [];

  // Warn or prevent changing roll number if passed in body
  if (roll_number !== undefined && String(roll_number).trim().toLowerCase() !== String(req.params.rollNumber).trim().toLowerCase()) {
    errors.push({
      field: 'roll_number',
      message: 'Roll number cannot be changed. This maintains data integrity.',
    });
  }

  if (name !== undefined) {
    if (String(name).trim() === '') {
      errors.push({ field: 'name', message: 'Student Name cannot be empty.' });
    } else {
      req.body.name = String(name).trim();
    }
  }

  if (age !== undefined) {
    const parsedAge = Number(age);
    if (!Number.isInteger(parsedAge) || parsedAge < 1 || parsedAge > 100) {
      errors.push({ field: 'age', message: 'Age must be a valid whole number between 1 and 100.' });
    } else {
      req.body.age = parsedAge;
    }
  }

  if (course !== undefined) {
    if (String(course).trim() === '') {
      errors.push({ field: 'course', message: 'Course cannot be empty.' });
    } else {
      req.body.course = String(course).trim();
    }
  }

  if (semester !== undefined) {
    const parsedSemester = Number(semester);
    if (!Number.isInteger(parsedSemester) || parsedSemester < 1 || parsedSemester > 12) {
      errors.push({ field: 'semester', message: 'Semester must be a valid whole number between 1 and 12.' });
    } else {
      req.body.semester = parsedSemester;
    }
  }

  if (marks !== undefined) {
    const parsedMarks = Number(marks);
    if (isNaN(parsedMarks) || parsedMarks < 0 || parsedMarks > 100) {
      errors.push({ field: 'marks', message: 'Marks must be a valid number between 0 and 100.' });
    } else {
      req.body.marks = Number(parsedMarks.toFixed(2));
    }
  }

  // Ensure at least one field is provided for update
  const updatableKeys = ['name', 'age', 'course', 'semester', 'marks'];
  const hasUpdates = updatableKeys.some((k) => req.body[k] !== undefined);
  if (!hasUpdates && errors.length === 0) {
    errors.push({
      field: 'body',
      message: 'At least one field (name, age, course, semester, marks) must be provided to update.',
    });
  }

  if (errors.length > 0) {
    return next(new ValidationError('Student update validation failed', errors));
  }

  next();
}

function validateRollParam(req, res, next) {
  const { rollNumber } = req.params;
  if (!rollNumber || String(rollNumber).trim() === '') {
    return next(new ValidationError('Roll number parameter is required and cannot be blank.'));
  }
  req.params.rollNumber = String(rollNumber).trim();
  next();
}

module.exports = {
  validateCreateStudent,
  validateUpdateStudent,
  validateRollParam,
};

const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const config = require('../config');

class StudentRepository {
  constructor(filePath = config.dataFile, seedPath = config.seedFile) {
    this.filePath = filePath;
    this.seedPath = seedPath;
    this._ensureFileExists();
  }

  _ensureFileExists() {
    try {
      const dir = path.dirname(this.filePath);
      if (!fsSync.existsSync(dir)) {
        fsSync.mkdirSync(dir, { recursive: true });
      }
      if (!fsSync.existsSync(this.filePath)) {
        if (fsSync.existsSync(this.seedPath)) {
          const seedData = fsSync.readFileSync(this.seedPath, 'utf8');
          fsSync.writeFileSync(this.filePath, seedData, 'utf8');
        } else {
          fsSync.writeFileSync(this.filePath, '[]', 'utf8');
        }
      }
    } catch (err) {
      console.error('Failed to initialize student data file:', err.message);
    }
  }

  async findAll() {
    try {
      this._ensureFileExists();
      const content = await fs.readFile(this.filePath, 'utf8');
      const trimmed = content.trim();
      if (!trimmed) {
        return [];
      }
      const data = JSON.parse(trimmed);
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.warn('Warning: Could not parse students.json, returning empty list:', err.message);
      return [];
    }
  }

  async findByRollNumber(rollNumber) {
    if (!rollNumber) return null;
    const normalized = String(rollNumber).trim().toLowerCase();
    const students = await this.findAll();
    return students.find(
      (s) => String(s.roll_number).trim().toLowerCase() === normalized
    ) || null;
  }

  async saveAll(students) {
    const jsonContent = JSON.stringify(students, null, 2);
    // Write atomically via temporary file to prevent corruption on crash
    const tempFile = `${this.filePath}.tmp.${Date.now()}`;
    await fs.writeFile(tempFile, jsonContent, 'utf8');
    await fs.rename(tempFile, this.filePath);
    return students;
  }

  async resetToSeed() {
    if (fsSync.existsSync(this.seedPath)) {
      const seedData = await fs.readFile(this.seedPath, 'utf8');
      await fs.writeFile(this.filePath, seedData, 'utf8');
      return JSON.parse(seedData);
    }
    const emptyList = [];
    await this.saveAll(emptyList);
    return emptyList;
  }
}

module.exports = new StudentRepository();

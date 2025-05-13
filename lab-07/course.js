/* The fs/promises module is used for asynchronous file management. 
Asynchronous file handling ensures web applications remain fast, scalable, and user friendly, even under heavy load or during resource intensive tasks. */

const fs = require('fs/promises');
const Student = require('./student');

class Course {
  constructor(title, description, duration) {
    this.title = title;
    this.description = description;
    this.duration = duration;
    this.students = [];
  }

  addStudent(student) {
    this.students.push(student);
  }

  calculateAverageAge() {
    if (this.students.length === 0) return 0;
    const totalAge = this.students.reduce((sum, student) => sum + student.age, 0);
    return totalAge / this.students.length;
  }

  toJSON() {
    return {
      title: this.title,
      description: this.description,
      duration: this.duration,
      students: this.students
    };
  }

  async saveToFile(filename) {
    try {
      const jsonData = JSON.stringify(this, null, 2);
      await fs.writeFile(filename, jsonData);
      console.log(`Course data saved to ${filename}`);
    } catch (error) {
      console.error(`Error saving course data: ${error}`);
    }
  }

  static async loadFromFile(filename) {
    try {
      const fileContent = await fs.readFile(filename, 'utf-8');
      const data = JSON.parse(fileContent);
      const course = new Course(data.title, data.description, data.duration);
      course.students = data.students.map(
        (studentData) =>
          new Student(studentData.name, studentData.age, studentData.subjects)
      );
      return course;
    } catch (error) {
      console.error(`Error loading course data: ${error}`);
      return null;
    }
  }
}

module.exports = Course;


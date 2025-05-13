const Course = require('./course');
const Student = require('./student');

async function main() {
  const course = new Course('Math 101', 'Introduction to Algebra', 3);
  course.addStudent(new Student('John Doe', 20, ['Algebra', 'Calculus']));
  course.addStudent(new Student('Gerard Smith', 22, ['Geometry', 'Statistics']));

  await course.saveToFile('course.json');

  let loadedCourse = await Course.loadFromFile('course.json');
  if (loadedCourse) {
    console.log('\nLoaded Course Details:');
    console.log(`Title: ${loadedCourse.title}`);
    console.log(`Description: ${loadedCourse.description}`);
    console.log(`Duration: ${loadedCourse.duration}`);
    console.log('Students:');
    loadedCourse.students.forEach((student, index) => {
      console.log(
        `  Student ${index + 1}: Name: ${student.name}, Age: ${student.age}, Subjects: ${student.subjects.join(', ')}`
      );
    });
  }

  const courseToUpdate = await Course.loadFromFile('course.json');
  if (courseToUpdate) {
    courseToUpdate.addStudent(new Student('Steph Johnson', 19, ['Trigonometry', 'Statistics']));
    await courseToUpdate.saveToFile('course.json');
    console.log('\nUpdated course with new student.');

    const updatedCourse = await Course.loadFromFile('course.json');
    console.log('\nUpdated Course Details:');
    console.log(`Title: ${updatedCourse.title}`);
    console.log(`Description: ${updatedCourse.description}`);
    console.log(`Duration: ${updatedCourse.duration}`);
    console.log('Students:');
    updatedCourse.students.forEach((student, index) => {
      console.log(
        `  Student ${index + 1}: Name: ${student.name}, Age: ${student.age}, Subjects: ${student.subjects.join(', ')}`
      );
    });
  }
}

main();

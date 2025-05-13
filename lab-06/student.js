const student = {
    name: "Daniel Aparicio",
    age: 21,
    subjects: ["Math", "English", "Computer Science"]
};

module.exports = student;

console.log("Initial Student Object:", student);

console.log("Student Name:", student.name);
console.log("Student Age:", student.age);

student.grade = "A";
student.age = 22;

console.log("Updated Student Object:", student);

const course = {
    title: "Web Programming",
    description: "An introduction to JavaScript, objects, and classes",
    students: [student],
    duration: "10 weeks",
    getTotalStudents: function() {
        return this.students.length;
    }
};

console.log("Course Object:", course);
console.log("Total Students in Course:", course.getTotalStudents());
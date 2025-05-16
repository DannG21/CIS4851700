class Student {
    constructor(name, age, subjects = []) {
        this.name = name;
        this.age = age;
        this.subjects = subjects;
    }

    addSubject(subject) {
        this.subjects.push(subject);
    }
}

const student1 = new Student("John", 20, ["Math", "English"]);
student1.addSubject("Computer Science");

const student2 = new Student("Gerard", 22, ["Physics", "Chemistry"]);
student2.addSubject("Biology");

console.log("Student 1:", student1);
console.log("Student 2:", student2);

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
        return JSON.stringify(this);
    }

    static fromJSON(jsonString) {
        const data = JSON.parse(jsonString);
        const course = new Course(data.title, data.description);
        course.students = data.students;
        return course;
    }

}

module.exports = Course;

const webProgramming = new Course("Web Programming", "Learn JavaScript, Objects, and Classes", "10 weeks");
webProgramming.addStudent(student1);
webProgramming.addStudent(student2);

console.log("Course Object:", webProgramming);
console.log("Average Age of Students:", webProgramming.calculateAverageAge());

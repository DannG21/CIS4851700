/* Importance of JSON for Data Interchange:
JSON is a lightweight data format that is widely used for exchanging data between a client and a server.

It has many advantages such as: Easy to read and write. It uses a minimal syntax, which makes it efficient. 
It can also be parsed by most programming languages.

It is widely used in APIs, Many web services and databases use JSON for data exchange.

Example:

javascript
Copy
Edit
const person = {
    name: "Alice",
    age: 25,
    hobbies: ["Reading", "Gaming", "Traveling"]
};

const personJSON = JSON.stringify(person);
console.log(personJSON); */



// Putting it all together
const Student = require("./student");
const Course = require("./course");

const webProgramming = new Course("Web Programming II", "Learn JavaScript, Node.js, and more!");

const student1 = new Student("John", 20, ["Math", "English", "CSS"]);
const student2 = new Student("Gerard", 22, ["Physics", "Chemistry", "Database"]);
const student3 = new Student("Charlie", 21, ["Python", "Machine Learning"]);

webProgramming.addStudent(student1);
webProgramming.addStudent(student2);
webProgramming.addStudent(student3);

console.log("Average Student Age:", webProgramming.calculateAverageAge());

const courseJSON = webProgramming.toJSON();
console.log("Serialized Course JSON:", courseJSON);

const loadedCourse = Course.fromJSON(courseJSON);
console.log("\nLoaded Course Details:");
console.log("Title:", loadedCourse.title);
console.log("Description:", loadedCourse.description);
console.log("Students:", loadedCourse.students);


function doTask(taskName){
    return new Promise((resolve, reject) => {
        console.log('Starting task: ${taskName}');
        setTimeout(() => {
            if (taskName === 'Task 2') {
                reject('Error: Something went wrong with the task 2!');
            } else {
                console.log('Completed task: ${taskName}');
                resolve();
            }
        }, 1000);
    });
}

async function runTasks() {
    try {
        await doTask('Task 1');
        await doTask('Task 2');
        await doTask('Task 3');
        console.log('All tasks completed!');
    } catch (error) {
        console.error(error);
    }
}
runTasks();
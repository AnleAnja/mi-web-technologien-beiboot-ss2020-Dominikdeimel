const { spawn } = require('child_process');
const sassWatcher = spawn('sass', ['--style=compressed', '--watch', 'assets/scss/styles.scss:public/css/styles.min.css']);
const startApp = spawn('nodemon', ['-L', 'src/app.js']);

// sassWatcher Console Output
sassWatcher.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
});

sassWatcher.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
});

sassWatcher.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
});

// startApp Console Output
startApp.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
});

startApp.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
});

startApp.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
});
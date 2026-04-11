const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const legacyDir = path.join(rootDir, 'legacy-html');
const reactDir = path.join(rootDir, 'svastrino-react');

// Move non-React files to legacy-html First
const files = fs.readdirSync(rootDir);
for (const file of files) {
  if (file === 'legacy-html' || file === 'svastrino-react' || file === '.git' || file === 'README.md' || file === 'migrate.js') {
    continue;
  }
  const oldPath = path.join(rootDir, file);
  const newPath = path.join(legacyDir, file);
  fs.renameSync(oldPath, newPath);
}

// Move React files to Root
if (fs.existsSync(reactDir)) {
  const reactFiles = fs.readdirSync(reactDir);
  for (const file of reactFiles) {
    const oldPath = path.join(reactDir, file);
    const newPath = path.join(rootDir, file);
    fs.renameSync(oldPath, newPath);
  }
  fs.rmdirSync(reactDir);
}

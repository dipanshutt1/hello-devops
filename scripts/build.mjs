import { mkdir, copyFile, rm } from 'node:fs/promises';

// A static website needs packaging, not compilation.
// Only copy public website files into the deployment folder.
await rm('dist', { recursive: true, force: true });
await mkdir('dist');
for (const file of ['index.html', 'styles.css', 'script.js']) {
  await copyFile(file, `dist/${file}`);
}
console.log('Website packaged into dist/');

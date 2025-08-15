/* eslint-disable no-console */
import { spawn } from 'child_process';
import path from 'path';
import waitOn from 'wait-on';
import { fileURLToPath } from 'url';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let serverProcess;

export const baseUrl ='http://localhost:3000';

export default async function globalSetup() {
  const appPath = path.resolve(__dirname, '../../app');

  console.log('Checking if the server is already running...');

  const isServerRunning = await checkServerRunning(baseUrl);

  if (isServerRunning) {
    console.log('Server is already running!');
  } else {
    console.log('Starting the web server...');
    serverProcess = spawn('npm', ['run', 'start'], {
      cwd: appPath,
      stdio: 'inherit',
      shell: true,
    });

    await waitOn({
      resources: [baseUrl],
      timeout: 40 * 1000,
    });

    console.log('Web server is ready!');
  }

  return async () => {
    if (serverProcess) {
      console.log('Stopping the web server...');
      serverProcess.kill('SIGTERM');
      serverProcess.stdout?.destroy();
      serverProcess.stderr?.destroy();

      // Wait for the process to exit
      await new Promise((resolve) => {
        serverProcess.on('exit', () => {
          console.log('Server process exited.');
          resolve();
        });
      });
    } else {
      console.log('No server process to stop (server was already running).');
    }
  };
}

async function checkServerRunning(url) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      resolve(res.statusCode === 200);
    });

    req.on('error', () => resolve(false));
    req.end();
  });
}

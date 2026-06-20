const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { fork } = require('child_process');

let mainWindow;
let backendProcess;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // DB Path in user data directory
  const dbPath = path.join(app.getPath('userData'), 'todo.db');
  console.log('Database path:', dbPath);

  // Fork the NestJS backend
  const backendEntry = path.join(__dirname, 'backend', 'dist', 'main.js');
  
  backendProcess = fork(backendEntry, [], {
    env: { 
      ...process.env, 
      ELECTRON_RUN_AS_NODE: '1',
      DATABASE_PATH: dbPath,
      PORT: '3001'
    }
  });

  backendProcess.on('error', (err) => {
    console.error('Failed to start backend process:', err);
  });

  // Setup IPC handlers to proxy HTTP calls to NestJS
  ipcMain.handle('getTodos', async () => {
    const res = await fetch('http://localhost:3001/todo');
    return res.json();
  });
  
  ipcMain.handle('addTodo', async (event, todo) => {
    const res = await fetch('http://localhost:3001/todo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todo)
    });
    return res.json();
  });
  
  ipcMain.handle('toggleTodo', async (event, id, currentStatus) => {
    if (!currentStatus) {
      const res = await fetch(`http://localhost:3001/todo/${id}/done`, { method: 'PATCH' });
      return res.json();
    } else {
      const res = await fetch(`http://localhost:3001/todo/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: false })
      });
      return res.json();
    }
  });

  ipcMain.handle('deleteTodo', async (event, id) => {
    const res = await fetch(`http://localhost:3001/todo/${id}`, { method: 'DELETE' });
    return res.json();
  });

  // Load the web app
  setTimeout(() => {
    mainWindow.loadURL('http://localhost:3001');
  }, 2000); // Give backend 2s to start
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('quit', () => {
  if (backendProcess) {
    backendProcess.kill();
  }
});

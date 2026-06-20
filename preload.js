const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getTodos: () => ipcRenderer.invoke('getTodos'),
  addTodo: (todo) => ipcRenderer.invoke('addTodo', todo),
  toggleTodo: (id, status) => ipcRenderer.invoke('toggleTodo', id, status),
  deleteTodo: (id) => ipcRenderer.invoke('deleteTodo', id)
});

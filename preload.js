// preload.js
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  saveTasks: (tasks) => ipcRenderer.send("save-tasks", tasks),
  loadTasks: () => ipcRenderer.invoke("load-tasks"),
});

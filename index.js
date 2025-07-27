const { app, BrowserWindow, Menu, ipcMain } = require('electron')
const fs = require("fs");
const path = require("path");

// Create a new window
const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js")
    },
  });

  mainWindow.loadFile('index.html')
}

// Listen for app to be ready 
app.whenReady().then(() => {
  // Execute createWindow function
  createWindow()

// Run the Create window function
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()

    }
  })
  
  window.Electron.loadTasks().then(tasks => {
  tasks.forEach(task => {
    // Use the existing logic to re-create each task
    createTaskFromData(task);
  });
});

})

const tasksFilePath = path.join(app.getPath("userData"), "tasks.json");
ipcMain.handle("load-tasks", () => {
  try {
    const data = fs.readFileSync(tasksFilePath, "utf-8");
    return JSON.parse(data);
  } catch {
    return []; // empty if there is no file or get an error
  }
});

ipcMain.on("save-tasks", (_, tasks) => {
  fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
});

// Quit app when windows closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})


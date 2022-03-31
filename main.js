const {
  BrowserWindow,
  app,
  ipcMain,
  Notification,
  Tray,
  nativeImage,
  Menu,
  dialog,
} = require("electron");
const path = require("path");
const isDev = !app.isPackaged;

let tray, mainWindow, menu, sound;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 420,
    height: 10,
    backgroundColor: "#023047",
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    transparent: false,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: false,
      worldSafeExecuteJavaScript: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadFile("index.html");
}

function createTray() {
  const icon = nativeImage.createFromPath("./assets/tangerine32@2x.png");
  tray = new Tray(icon);
  tray.setToolTip("EMP");
  tray.on("click", () => toggleWindow());
  tray.on("right-click", () => toggleMenu());

  createMenu();
}

function createMenu() {
  menu = Menu.buildFromTemplate([
    { label: "About" },
    { label: "Quit", click: () => app.quit() },
  ]);
}

function toggleWindow() {
  mainWindow.isVisible() ? hideWindow() : showWindow();
}

function toggleMenu() {
  tray.popUpContextMenu(menu);
}

function showWindow() {
  const windowBounds = mainWindow.getBounds();
  const trayBounds = tray.getBounds();
  const x = Math.round(
    trayBounds.x + (trayBounds.width / 2 - windowBounds.width / 2)
  );
  const y = Math.round(trayBounds.y + trayBounds.height);
  mainWindow.setPosition(x, y);
  mainWindow.show();
  mainWindow.setSize(420, 560, true);
}

function hideWindow() {
  mainWindow.hide();
  mainWindow.setSize(420, 10);
}

if (isDev) {
  require("electron-reload")(__dirname, {
    electron: path.join(__dirname, "node_modules", ".bin", "electron"),
  });
}

ipcMain.on("notify", (_, title, body) => {
  new Notification({ title: title, body: body }).show();
});

ipcMain.on("startAudio", (_, path) => {
  sound = require("sound-play");
  sound.play(path);
});

async function handleFileOpen() {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ["openFile", "multiSelections"],
    filters: [{ name: "Audio", extensions: ["mp3", "wav"] }],
  });
  if (canceled) {
    return;
  } else {
    return filePaths;
  }
}

app.whenReady().then(() => {
  ipcMain.handle("dialog:openFile", handleFileOpen);
  app.dock.setIcon("./assets/tangerine192.png");
  app.dock.hide();
  createWindow();
  createTray();
});

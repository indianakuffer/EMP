const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  notificationApi: {
    sendNotification(title, body) {
      ipcRenderer.send("notify", title, body);
    },
  },
  audioApi: {
    startAudio(path) {
      ipcRenderer.send("startAudio", path);
    },
    pauseAudio() {
      ipcRenderer.send("pauseAudio");
    },
  },
  dialogApi: {
    selectFiles() {
      ipcRenderer.send("selectFiles");
    },
  },
  storageApi: {
    getPlaylists: () => ipcRenderer.invoke("storage:getPlaylists"),
    setPlaylists: (playlists) => ipcRenderer.send("setPlaylists", playlists),
  },
  openFile: () => ipcRenderer.invoke("dialog:openFile"),
});

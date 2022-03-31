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
  },
  openFile: () => ipcRenderer.invoke("dialog:openFile"),
});

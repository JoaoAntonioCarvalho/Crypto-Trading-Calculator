const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    sendTelegram: (message, pnl) => ipcRenderer.invoke('send-telegram', { message, pnl }),
    closeApp: () => ipcRenderer.send('close-app') // Envia um evento para o main process
});
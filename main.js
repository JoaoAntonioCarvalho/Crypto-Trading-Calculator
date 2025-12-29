const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const https = require('https');

const TOKEN = '7978856710:AAHIYIAo-RPWVn3RLF-pGIyXmMV1euoySDU';
const CHAT_ID = '1302714261';

function sendTelegramMessage(message) {
    const url = `/bot${TOKEN}/sendMessage`;
    const postData = JSON.stringify({
        chat_id: CHAT_ID,
        text: message, // <--- This should be the formatted string
        parse_mode: 'Markdown'
    });

    const options = {
        hostname: 'api.telegram.org',
        port: 443,
        path: url,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': postData.length
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (error) {
                    console.error('Erro ao analisar resposta do Telegram:', error, data);
                    resolve({ ok: false, description: 'Falha ao analisar resposta' });
                }
            });
        });

        req.on('error', (error) => {
            console.error('Erro ao enviar mensagem para o Telegram:', error);
            resolve({ ok: false, description: error.message });
        });

        req.write(postData);
        req.end();
    });
}

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 400,
        height: 600,
        frame: false,
        resizable: false, // Impede o redimensionamento da janela
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.loadFile('index.html');
    // mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
    createWindow();

    ipcMain.handle('send-telegram', async (event, data) => {
        const message = data.message.message;
        const pnl = data.message.pnl;
        const emoji = pnl > 0 ? '🟢 ' : '🔴 ';
        const formattedMessage = emoji + message;
        return await sendTelegramMessage(formattedMessage);
    });

    ipcMain.on('close-app', () => {
        mainWindow.close();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
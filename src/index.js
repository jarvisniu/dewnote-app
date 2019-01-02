const {app, BrowserWindow} = require('electron')
const os = require('os')

let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: __dirname + os.platform === 'win32' ? '/logo.ico' : '/logo.png'
  })
  mainWindow.loadURL('http://dewnote.com')
  mainWindow.setMenu(null)

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})

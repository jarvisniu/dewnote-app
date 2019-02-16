
const {app, BrowserWindow, Menu} = require('electron')
const shell = require('electron').shell

const isWin = process.platform === 'win32'
const isMac = process.platform === 'darwin'
const isLinux = process.platform === 'linux'

const WINDOW_WIDTH = (isMac ? 878 : 894)
const WINDOW_HEIGHT = (isMac ? 612 : 629)

let openDev = false
// openDev = true // TODO 调试模式

let mainWindow

function createWindow () {
  mainWindow = new BrowserWindow({
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT + (openDev ? 300 : 0),
    icon: __dirname + isWin ? '/logo.ico' : '/logo.png',
    webPreferences: {
      sandbox: true, // 必须这样才能获取到 window.open() 的返回值，目的看下面的注释
    },
  })

  if (isWin) mainWindow.setMenu(null)

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // Create the Application's main menu TO SUPPORT COPY/PASTE!
  if (isMac) {
    Menu.setApplicationMenu(Menu.buildFromTemplate([{
      label: "Application",
      submenu: [
          { label: "About Application", selector: "orderFrontStandardAboutPanel:" },
          { type: "separator" },
          { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
      ]}, {
      label: "Edit",
      submenu: [
          { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
          { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
          { type: "separator" },
          { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
          { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
          { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
          { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
      ]}
    ]))
  }

  mainWindow.loadURL('http://dewnote.com')

  if (openDev) mainWindow.webContents.openDevTools({mode: 'bottom'})
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  app.quit()
})

/*
hack: 使 monaco-editor 使用的下面这种点击链接功能生效:
https://github.com/Microsoft/vscode/blob/master/src/vs/base/browser/dom.ts#L1147
function windowOpenNoOpener (url) {
  let newTab = window.open();
  if (newTab) {
      newTab.opener = null;
      newTab.location.href = url;
  }
}
*/
app.on('browser-window-created', function (ev, win) {
  win.webContents.on('will-navigate', function (ev, url) {
    ev.preventDefault()
    shell.openExternal(url)
    win.close()
  })
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})

const { app, BrowserWindow } = require('electron')
const shell = require('electron').shell
const windowStateKeeper = require('electron-window-state')

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  // eslint-disable-line global-require
  app.quit()
}

const isWin = process.platform === 'win32'
const isMac = process.platform === 'darwin'
const isLinux = process.platform === 'linux'

const WINDOW_WIDTH = (isMac ? 878 : (isLinux ? 880 : 894))
const WINDOW_HEIGHT = (isMac ? 612 : (isLinux ? 590 : 629))
const HOMEPAGE = 'https://dewnote.niujunwei.com'

let openDev = false
// openDev = true // TODO 调试模式

let win

const createWindow = () => {
  let mainWindowState = windowStateKeeper({
    defaultWidth: WINDOW_WIDTH,
    defaultHeight: WINDOW_HEIGHT,
  })

  // Create the browser window.
  win = new BrowserWindow({
    width: mainWindowState.width,
    height: mainWindowState.height,
    x: mainWindowState.x,
    y: mainWindowState.y,
    icon: __dirname + (isWin ? '/assets/logo.ico' : '/assets/logo.png'),
    webPreferences: {
      sandbox: true, // 必须这样才能获取到 window.open() 的返回值，目的看下面的注释
    },
  })

  mainWindowState.manage(win)
  if (isWin) win.setMenu(null)
  else if (isLinux) win.setMenuBarVisibility(false)

  win.on('closed', () => {
    win = null
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

  win.loadURL(HOMEPAGE)

  if (openDev) win.webContents.openDevTools()
}

app.on('ready', createWindow)

app.on('browser-window-created', function (ev, win) {
  win.webContents.on('will-navigate', function (ev, url) {
    if (url.startsWith(HOMEPAGE)) return
    ev.preventDefault()
    shell.openExternal(url)
    win.close()
  })
})

app.on('window-all-closed', () => {
  app.quit()
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

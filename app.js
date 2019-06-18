const {app, BrowserWindow} = require('electron') // http://electronjs.org/docs/api
const path = require('path') // https://nodejs.org/api/path.html
const url = require('url') // https://nodejs.org/api/url.html
const {ipcMain, dialog} = require('electron')
let window = null


ipcMain.on('save-dialog', (event) => {
  const options = {
    title: 'Save',
    filters: [
      { name: 'csv', extensions: ['csv'] }
    ]
  }
  dialog.showSaveDialog(options, (filename) => {
    event.sender.send('saved-file', filename)
  })
})

ipcMain.on('open-file-dialog', function (event) {
  let startPath = ''
  if (process.platform === 'darwin') {
    startPath = '/Users/<username>/Documents/'
  }
  dialog.showOpenDialog({
    title: 'Select a workspace...',
    properties: ['openFile'],
    defaultPath: startPath,
    buttonLabel: "Select...",
  }, function (files) {
    if (files) event.sender.send('selectedItem', files)
  })
})

// Wait until the app is ready
app.once('ready', () => {
  // Create a new window
  window = new BrowserWindow({
    // Set the initial width to 400px
    width: 400,
    // Set the initial height to 500px
    height: 400,
    // Don't show the window until it ready, this prevents any white flickering
    show: false,
  })

  // Load a URL in the window to the local index.html path
  window.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  })
  )

  //window.webContents.openDevTools()

  // Show window when page is ready
  window.once('ready-to-show', () => {
    window.show()
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
})

module.exports = {
  mongodbMemoryServerOptions: {
    instance: {
      dbName: 'jest'
    },
    binary: {
      version: '6.0.5',
      skipMD5: true
    },
    autoStart: false,
    debug: 1
  }
}

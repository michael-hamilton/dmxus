// The dmxus server class

const http = require('http');
const express = require('express');
const io = require('socket.io');

class Server {

  constructor(port = 9090, dmxus) {
    this.port = port;
    this.app = express();
    this.dmxus = dmxus;
    this.server = http.Server(this.app);
    this.io = io(this.server, {transports: ['websocket']});
  }

  init() {
    this.app.get('/', (req, res) => {
      res.sendFile(`${__dirname}/dist/index.html`);
    });

    this.io.on('connection', (socket) => {
      console.log('dmxus client connected')
      socket.emit('patch', this.dmxus.getPatch());
      socket.on('getPorts', this.getSerialPorts.bind(this));
    });

    this.server.listen(this.port);

    console.log(`Initialized dmxus server on port ${this.port}.`)
  }

  async getSerialPorts() {
    console.log('get ports')
    this.emit('ports', await this.dmxus.listPorts())
  }

  // Wraps the socket.io emit method
  emit(channel, message) {
    if (this.io) {
      this.io.emit(channel, message);
    }
  }
}

module.exports = Server;

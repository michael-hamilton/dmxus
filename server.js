// The dmxus server class

const express = require('express');
const http = require('http');
const io = require('socket.io');

class Server {

  constructor(port = 9090, dmxus) {
    this.app = express();
    this.dmxus = dmxus;
    this.port = port;
    this.server = http.Server(this.app);
    this.io = io(this.server, {transports: ['websocket']});
  }


  // Initializes a server which interfaces with the current dmxus instance
  init() {
    this.app.use(express.static('dist'));

    this.app.get('/', (req, res) => {
      res.sendFile(`${__dirname}/dist/index.html`);
    });

    this.io.on('connection', (socket) => {
      console.log('dmxus client connected')

      socket.emit('patch', this.dmxus.getPatch());
      socket.emit('port', this.dmxus.getPort());
      socket.on('getPorts', async () => socket.emit('ports', await this.dmxus.listPorts()));
      socket.on('changePort', (port) => this.dmxus.changeInterfacePort(port));

      this.dmxus.on('update', (universe) => socket.emit('update', universe));
    });

    this.server.listen(this.port);

    console.log(`Initialized dmxus server on port ${this.port}.`)
  }
}

module.exports = Server;

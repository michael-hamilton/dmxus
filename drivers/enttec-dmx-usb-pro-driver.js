// Driver for Enttec DMX USB PRO interface

const SerialPort = require('serialport');

class EnttecDmxUsbProDriver {

  constructor(port) {
    this.port = new SerialPort(port,  {
      'baudRate': 250000,
      'dataBits': 8,
      'stopBits': 2,
      'parity': 'none'
    });
  }

  // Accepts a universe buffer and writes the data to the device
  send(universe){
    const header = Buffer.from([
      0x7e,
      0x06,
      (universe.length) & 0xff,
      ((universe.length) >> 8) & 0xff,
      0x00,
    ]);

    const data = Buffer.concat([
      header,
      universe.slice(1),
      Buffer.from([0xe7]),
    ]);

    this.port.write(data);
  }

}

module.exports = EnttecDmxUsbProDriver;

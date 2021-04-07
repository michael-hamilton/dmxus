// Driver simulator

class SimulatorDriver {

  constructor(port, serialPortInstance = SimulatorDriver.SerialPortDummyInstance) {
    this.port = serialPortInstance;
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

  // Accepts and object which replaces the dummy SerialPort instance
  changePort(serialPortInstance = SimulatorDriver.SerialPortDummyInstance) {
    this.closePort();

    this.port = serialPortInstance;
  }

  // Closes the serial port connection
  closePort() {
    if(this.port.isOpen) {
      this.port.close();
    }
  }

  // Default dummy SerialPort instance
  static SerialPortDummyInstance = {
    isOpen: (() => true)(),
    close: () => null,
    write: () => null,
  };
}

module.exports = SimulatorDriver;

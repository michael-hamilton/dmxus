// Main dmxus class

const EventEmitter = require('events');
const SerialPort = require('serialport');
const Driver = require('./drivers');
const Server = require('./server');
const profiles = require('./profiles');

class DMXUS extends EventEmitter {

  constructor(driverName, interfacePort = '') {
    super();

    this.devices = [];
    this.driver = new (Driver(driverName))(interfacePort);
    this.driverName = driverName;
    this.groups = {};
    this.interfacePort = interfacePort;
    this.io = null;
    this.patch = {};
    this.refreshRate = 25;
    this.server = null;
    this.timers = {};
    this.universe = Buffer.alloc(513, 0);

    this.initDevices();
  }


  // Initializes a server on the provided port (default 3000) with a reference to the dmxus instance
  initServer(port) {
    this.server = new Server(port, this);
    this.server.init();
  }

  initDevices(deviceCount = 128) {
    for(let i = 0; i < deviceCount; i++) {
      this.devices[i] = {
        id: i + 1,
        deviceName: null,
        startAddress: null,
        profile: null
      }
    }
  }

  // Returns a list of serial ports as reported by the system
  async listPorts() {
    return await SerialPort.list();
  }


  // Re-initializes the interface
  reinitializeDriver(driverName, interfacePort) {
    this.interfacePort = interfacePort;
    this.driverName = driverName;
    this.driver = new (Driver(driverName))(interfacePort);
  }


  // Accepts a deviceId, start address and a fixture profile object, and adds the fixture to the device list.  Returns the device object.
  addDevice(deviceId, startAddress, profile, deviceName) {
    const newDevice = {
      deviceName,
      startAddress,
      profile
    };

    const deviceIndex = this.devices.findIndex(device => device.id === deviceId);

    this.devices[deviceIndex] = {...this.devices[deviceIndex], ...newDevice};
    return this.devices[deviceIndex];
  }


  // Accepts a start address and a fixture profile object, and adds the fixture to the patch.  Returns the start address of the patched fixture.
  patchFixture(startAddress, profile) {
    this.patch[startAddress] = profile;
    return startAddress;
  }


  // Accepts a group name and a fixture address and creates/adds the fixture to the group.
  addFixtureToGroup(groupName, fixture) {
    if(!this.groups[groupName]) {
      this.groups[groupName] = [fixture];
    }
    else {
      this.groups[groupName].push(fixture);
    }

    this.emit('patch', this.patch);

    return fixture;
  }


  // Updates a single fixture at the provided start address with the provided parameters.
  updateSingleFixture(startAddress, parameters) {
    const fixtureParameters = this.patch[startAddress].parameters;

    fixtureParameters.forEach((fixtureParameter, index) => {
      this.universe[parseInt(startAddress) + index] = parameters[fixtureParameter];
    });

    this.update();
  }


  // Updates all fixtures with the provided parameters.
  updateAllFixtures(parameters) {
    Object.keys(this.patch).forEach(startAddress => {
      this.updateSingleFixture(startAddress, parameters);
    });

    this.update();
  }


  // Updates all fixtures in the provided group name with the provided parameters.
  updateAllFixturesInGroup(groupName, parameters, fadeIn = 0) {
    const oldFixtureParameterValues = {};

    if(this.groups[groupName]) {
      let updateCount = 0;
      const targetUpdateCount = Math.round(fadeIn/this.refreshRate) || 1;
      const intervalTime = fadeIn/targetUpdateCount;

      clearInterval(this.timers[groupName]);

      this.groups[groupName].forEach(fixtureAddress => {
        oldFixtureParameterValues[fixtureAddress] = this.getFixtureValues(fixtureAddress);
      });

      this.timers[groupName] = setInterval(() => {
        this.groups[groupName].forEach(fixtureAddress => {
          const nextUpdate = {};
          Object.keys(parameters).forEach(parameter => {
            const oldParamValue = oldFixtureParameterValues[fixtureAddress][parameter];
            const targetParamValue = parameters[parameter];
            nextUpdate[parameter] = Math.round(oldParamValue + (targetParamValue - oldParamValue) * (updateCount/targetUpdateCount));
          });
          this.updateSingleFixture(fixtureAddress, nextUpdate);
        });

        if(updateCount === targetUpdateCount) {
          clearInterval(this.timers[groupName]);
          return true;
        }
        else {
          updateCount+=1;
        }
      }, intervalTime);
    }
  }


  // Returns the profile of the fixture patched at the provided start address
  getPatchedFixtureProfile(startAddress) {
    return this.patch[startAddress];
  }


  // Returns the parameter values of the fixture at the provided start address
  getFixtureValues(startAddress) {
    const fixtureParameterNames = this.getPatchedFixtureProfile(startAddress).parameters;
    const fixtureParameterValues = {};
    let parameterNameIndex = 0;

    for(let address = 0; address <= fixtureParameterNames.length; address++) {
      fixtureParameterValues[fixtureParameterNames[parameterNameIndex]] = this.universe[startAddress + address];
      parameterNameIndex++;
    }

    return fixtureParameterValues;
  }


  // Returns the interfacePort currently used by dmxus
  getInterfacePort() {
    return this.interfacePort;
  }


  // Returns the driver currently used by dmxus
  getDriverName() {
    return this.driverName;
  }


  // Returns the patch
  getPatch() {
    return this.patch;
  }


  // Returns the device list
  getDevices() {
    return this.devices;
  }


  // Sets the patch
  setPatch(patch) {
    this.patch = patch;
  }


  // Calls the update method on the driver with the current state of the universe
  update() {
    this.driver.send(this.universe);

    this.emit('update', this.universe.toJSON());
  }


  // Returns the device profile of the provided profile name
  static getFixtureProfile(profileName) {
    return profiles[profileName];
  }


  // Returns a random integer value from 0-255
  static getRandom8BitValue() {
    return Math.floor(Math.random() * 255);
  }

}

module.exports = DMXUS;

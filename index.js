// Main dmxus class

const EventEmitter = require('events');
const SerialPort = require('serialport');
const Driver = require('./drivers');
const Server = require('./server');
const profiles = require('./profiles');

class DMXUS extends EventEmitter {

  constructor(driverName, interfacePort = '', deviceCount = 96) {
    super();

    this.devices = [];
    this.driver = new (Driver(driverName))(interfacePort);
    this.driverName = driverName;
    this.groups = {};
    this.interfacePort = interfacePort;
    this.io = null;
    this.refreshRate = 25;
    this.server = null;
    this.timers = {};
    this.universe = Buffer.alloc(513, 0);

    this.initDevices(deviceCount);
  }


  // Initializes a webserver on the provided port (default 9090) with a reference to the dmxus instance
  initWebServer(port) {
    this.server = new Server(port, this);
    this.server.init();
  }


  // Initializes the device list with a default count of 96 devices
  initDevices(deviceCount) {
    for(let i = 0; i < deviceCount; i++) {
      this.devices[i] = {
        id: i + 1,
        deviceName: null,
        startAddress: null,
        profile: null,
        groups: [],
      }
    }
  }


  // Closes the port used by the current driver and re-initializes the interface
  reinitializeDriver(driverName, interfacePort) {
    this.driver.closePort();
    this.interfacePort = interfacePort;
    this.driverName = driverName;
    this.driver = new (Driver(driverName))(interfacePort);
  }


  // Accepts a deviceId, start address and a device profile object, and adds the device to the device list.  Returns the device object.
  addDevice(deviceId, startAddress, profile, deviceName = '', groups = []) {
    const newDevice = {
      deviceName,
      startAddress,
      profile,
      groups
    };

    const deviceIndex = this.devices.findIndex(device => device.id === deviceId);

    this.devices[deviceIndex] = {...this.devices[deviceIndex], ...newDevice};

    return this.devices[deviceIndex];
  }


  // Accepts a DMX address and updates with the provided value.
  updateAddressValue(address, value) {
    this.universe[parseInt(address)] = value;

    this.update();
  }


  // Updates a single device at the provided start address with the provided parameters.
  updateDevice(deviceId, parameters) {
    const device = this.getDeviceById(deviceId);

    if(device.profile) {
      device.profile.parameters.forEach((parameter, index) => {
        this.universe[parseInt(device.startAddress) + index] = parameters[parameter];
      });
    }

    this.update();
  }

  // Changes the start address of the specified deviceId
  changeDeviceStartAddress(deviceId, startAddress) {
    const deviceIndex = this.devices.findIndex(device => device.id === deviceId);
    this.devices[deviceIndex].startAddress = startAddress;

    return this.devices[deviceIndex];
  }

  // Updates all devices with the provided parameters.
  updateAllDevices(parameters) {
    this.devices.forEach(device => {
      this.updateDevice(device.id, parameters);
    });

    this.update();
  }


  // Returns the device with the provided deviceId
  getDeviceById(deviceId) {
    const deviceIndex = this.devices.findIndex(device => device.id === deviceId);

    return this.devices[deviceIndex];
  }


  // Returns devices which are a part of the provided group name
  getDevicesByGroup(group) {
    return this.devices.filter(device => device.groups.includes(group));
  }


  // Updates all devices in the provided group name with the provided parameters.
  updateAllDevicesInGroup(groupName, parameters, fadeIn = 0) {
    const oldDeviceParameterValues = {};
    const devices = this.getDevicesByGroup(groupName);

    if(devices) {
      let updateCount = 0;
      const targetUpdateCount = Math.round(fadeIn/this.refreshRate) || 1;
      const intervalTime = fadeIn/targetUpdateCount;

      clearInterval(this.timers[groupName]);

      devices.forEach(device => {
        oldDeviceParameterValues[device.id] = this.getDeviceParameterValues(device.id);
      });

      this.timers[groupName] = setInterval(() => {
        devices.forEach(device => {
          const nextUpdate = {};
          Object.keys(parameters).forEach(parameter => {
            const oldParamValue = oldDeviceParameterValues[device.id][parameter];
            const targetParamValue = parameters[parameter];
            nextUpdate[parameter] = Math.round(oldParamValue + (targetParamValue - oldParamValue) * (updateCount/targetUpdateCount));
          });

          this.updateDevice(device.id, nextUpdate);
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


  // Returns the parameter values of the specified device
  getDeviceParameterValues(deviceId) {
    const device = this.getDeviceById(deviceId)
    const fixtureParameterValues = {};

    if(device.profile) {
      const fixtureParameterNames = device.profile.parameters;
      let parameterNameIndex = 0;

      for (let address = 0; address < fixtureParameterNames.length; address++) {
        fixtureParameterValues[fixtureParameterNames[parameterNameIndex]] = this.universe[device.startAddress + address];
        parameterNameIndex++;
      }
    }

    return fixtureParameterValues;
  }


  // Returns a list of serial ports as reported by the system
  async listPorts() {
    return await SerialPort.list();
  }


  // Returns the device list
  getDevices() {
    return this.devices;
  }


  // Returns the driver currently used by dmxus
  getDriverName() {
    return this.driverName;
  }


  // Returns the interfacePort currently used by dmxus
  getInterfacePort() {
    return this.interfacePort;
  }


  // Calls the update method on the driver with the current state of the universe then emits and update event with the universe state.
  update() {
    this.driver.send(this.universe);

    this.emit('update', this.universe.toJSON());
  }


  // Returns the JSON value of the current state of the universe
  getUniverseState() {
    return this.universe.toJSON();
  }


  // Returns the device profile of the provided profile name
  static getDeviceProfile(profileName) {
    return profiles[profileName];
  }


  // Returns a random integer value from 0-255
  static getRandom8BitValue() {
    return Math.floor(Math.random() * 255);
  }

}

module.exports = DMXUS;

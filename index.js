// The main dmxus class

const http = require('http');
const express = require('express');
const io = require('socket.io');
const Driver = require('./drivers');
const profiles = require('./profiles');

class DMXUS {

  constructor(driverName, port) {
    this.driver = new (Driver(driverName))(port);
    this.universe = Buffer.alloc(513, 0);
    this.patch = {};
    this.groups = {};
    this.refreshRate = 25;
    this.timers = {};
    this.app = null;
    this.io = null;
    this.server = null;
    this.socket = null;
  }


  // Initializes a server on the provided port (default 3000)
  initServer(port = 9090) {
    this.app = express();
    this.server = http.Server(this.app);
    this.io = io(this.server, {transports: ['websocket']});

    this.app.get('/', (req, res) => {
      res.sendFile(`${__dirname}/dist/index.html`);
    });

    this.io.on('connection', (socket) => {
      console.log('dmxus client connected')
      this.socket = socket;
      this.socket.emit('patch', this.getPatch());
    });

    this.server.listen(port);
    console.log(`Initialized dmxus server on port ${port}.`)
  }


  // Accepts a start address and a fixture profile object, and adds the fixture to the the patch.  Returns the start address of the patched fixture.
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

    if(this.socket) {
      this.socket.emit('patch', this.patch);
    }

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


  // Returns the patch
  getPatch() {
    return this.patch;
  }


  // Sets the patch
  setPatch(patch) {
    this.patch = patch;
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

  // Calls the update method on the driver with the current state of the universe
  update() {
    this.driver.send(this.universe);

    if (this.socket) {
      this.socket.emit('update', this.universe.toJSON());
    }
  }


  // Returns the device profile of the provided profile name
  static getFixtureProfile(profileName) {
    return profiles[profileName];
  }

  // Utility method that returns a random value from 0-255
  static getRandom8BitValue() {
    return Math.floor(Math.random() * 255);
  }

}

module.exports = DMXUS;

// The main dmxus class

const Driver = require('./drivers')('enttec-dmx-usb-pro');
const profiles = require('./profiles');

class DMXUS {

  constructor(port) {
    this.driver = new Driver(port);
    this.universe = Buffer.alloc(513, 0);
    this.patch = {};
  }


  patchFixture(startAddress, profile) {
    this.patch[startAddress] = profile;
  }


  updateAllFixtures(parameters) {
    Object.keys(this.patch).forEach(startAddress => {
      const fixtureParameters = this.patch[startAddress].parameters;

      fixtureParameters.forEach((fixtureParameter, index) => {
        this.universe[parseInt(startAddress) + index] = parameters[fixtureParameter];
      });
    });

    this.driver.send(this.universe);
  }


  getPatch() {
    return this.patch;
  }


  setPatch(patch) {
    this.patch = patch;
  }


  static getDeviceProfile(profile) {
    return profiles[profile];
  }

}

module.exports = DMXUS;

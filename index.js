// The main dmxus class

const Driver = require('./lib/driver');
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


  static getDeviceProfile(profile) {
    return profiles[profile];
  }

}

module.exports = DMXUS;

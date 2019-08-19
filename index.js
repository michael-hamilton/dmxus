// DMXUS DMX library

const Driver = require('./lib/driver');

class DMXUS {

  constructor(port) {
    this.driver = new Driver(port);
    this.universe = Buffer.alloc(513, 0);
  }

  updateFixtures(fixtures, parameters) {
    Object.keys(fixtures).forEach(startAddress => {
      const fixtureParameters = fixtures[startAddress].parameters;

      fixtureParameters.forEach((fixtureParameter, index) => {
        this.universe[parseInt(startAddress) + index] = parameters[fixtureParameter];
      });
    });

    this.driver.send(this.universe);
  }
}

module.exports = DMXUS;

// Example usage of dmxus

// Require the module
const dmxus = require('./index');


// Create an instance of dmxus with the correct port
const d = new dmxus('enttec-dmx-usb-pro', 'COM3');


// Initialize server
d.initServer(3000);


// Patch some fixtures
d.patchFixture(1, dmxus.getFixtureProfile('IRGB'));
d.patchFixture(5, dmxus.getFixtureProfile('IRGB'));
d.patchFixture(9, dmxus.getFixtureProfile('IRGB'));
d.patchFixture(13, dmxus.getFixtureProfile('IRGB'));


// Add fixtures to a group
d.addFixtureToGroup('group1', 1);
d.addFixtureToGroup('group2', 5);
d.addFixtureToGroup('group3', 9);
d.addFixtureToGroup('group4', 13);


// Keys are a standardized parameter name, value is a hex value (0 - 255)
const initParameters = {
  intensity: 0,
  red: 0,
  green: 0,
  blue: 0,
};


// Update all the fixtures in the universe with the provided parameters
// d.updateAllFixturesInGroup("group", initParameters);
d.updateAllFixtures(initParameters);

// Update all the fixtures in 'group' every 2s with a random color
setInterval(() => {
  // Update all the fixtures in the group with the provided parameters
  d.updateAllFixturesInGroup('group1', {
    intensity: 255,
    red: dmxus.getRandom8BitValue(),
    green: dmxus.getRandom8BitValue(),
    blue: dmxus.getRandom8BitValue(),
  }, 500);

  d.updateAllFixturesInGroup('group2', {
    intensity: 255,
    red: dmxus.getRandom8BitValue(),
    green: dmxus.getRandom8BitValue(),
    blue: dmxus.getRandom8BitValue(),
  }, 500);

  d.updateAllFixturesInGroup('group3', {
    intensity: 255,
    red: dmxus.getRandom8BitValue(),
    green: dmxus.getRandom8BitValue(),
    blue: dmxus.getRandom8BitValue(),
  }, 500);

  d.updateAllFixturesInGroup('group4', {
    intensity: 255,
    red: dmxus.getRandom8BitValue(),
    green: dmxus.getRandom8BitValue(),
    blue: dmxus.getRandom8BitValue(),
  }, 500);
}, 2000);

// Example usage of dmxus

// Require the module
const dmxus = require('./index');


// Create an instance of dmxus with the correct port
const d = new dmxus('enttec-dmx-usb-pro', 'COM3');


// Initialize server
d.initServer(3000);


// Patch some fixtures
d.patchFixture(1, dmxus.getFixtureProfile('RGBW'));

// Add fixtures to a group
d.addFixtureToGroup('group1', 1);


// Keys are a standardized parameter name, value is a hex value (0 - 255)
const initParameters = {
  red: 0,
  green: 0,
  blue: 0,
  white: 0
};


// Update all the fixtures in the universe with the provided parameters
// d.updateAllFixturesInGroup("group", initParameters);
d.updateAllFixtures(initParameters);

// Update all the fixtures in 'group' every 2s with a random color
setInterval(() => {
  // Update all the fixtures in the group with the provided parameters
  d.updateAllFixturesInGroup('group1', {
    red: dmxus.getRandom8BitValue(),
    green: dmxus.getRandom8BitValue(),
    blue: dmxus.getRandom8BitValue(),
    white: dmxus.getRandom8BitValue(),
  }, 500);
}, 2000);

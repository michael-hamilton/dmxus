// Example usage of dmxus

// Require the module
const dmxus = require('./index');


// Create an instance of dmxus with an interface and port
const d = new dmxus('simulator', '');


// Initialize webserver
d.initWebServer();


// Patch some fixtures
d.patchFixture(1, dmxus.getFixtureProfile('RGBW'));


// Add fixtures to a group
d.addFixtureToGroup('group1', 1);


// Add devices
d.addDevice(1, 1, dmxus.getFixtureProfile('RGBW'), 'Test Device 1')
d.addDevice(2, 5, dmxus.getFixtureProfile('RGBW'), 'Test Device 2')
d.addDevice(3, 9, dmxus.getFixtureProfile('RGBW'), 'Test Device 3')


// Keys are a standardized parameter name, value is a hex value (0 - 255)
const initParameters = {
  red: 0,
  green: 0,
  blue: 0,
  white: 0
};


// Update all the fixtures in the universe with the provided parameters
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

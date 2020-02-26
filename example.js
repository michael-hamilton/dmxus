// Example usage of dmxus

// Require the module
const dmxus = require("./index");


// Create an instance of dmxus with the correct port
const d = new dmxus("enttec-dmx-usb-pro", "COM3");


// Patch some fixtures
d.patchFixture(1, dmxus.getFixtureProfile("RGBW"));
d.patchFixture(6, dmxus.getFixtureProfile("RGBW"));
d.patchFixture(11, dmxus.getFixtureProfile("RGBW"));
d.patchFixture(16, dmxus.getFixtureProfile("RGBW"));


// Add fixtures to a group
d.addFixtureToGroup("group", 1);
d.addFixtureToGroup("group2", 6);
d.addFixtureToGroup("group2", 11);
d.addFixtureToGroup("group", 16);
d.addFixtureToGroup("group3", 16);


// Keys are a standardized parameter name, value is a hex value (0 - 255)
const initParameters = {
  "red": 0,
  "green": 0,
  "blue": 0,
  "white": 0
};


// Update all the fixtures in the universe with the provided parameters
// d.updateAllFixturesInGroup("group", initParameters);
d.updateAllFixtures(initParameters);

// Update all the fixtures in the group with the provided parameters
d.updateAllFixturesInGroup("group", {
  "red": 0,
  "green": 255,
  "blue": 60,
  "white": 0,
}, 2000);

d.updateAllFixturesInGroup("group2", {
  "red": 0,
  "green": 60,
  "blue": 120,
  "white": 0,
}, 1000);
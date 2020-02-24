// Example usage of dmxus

// Require the module
const dmxus = require("./index");


// Create an instance of dmxus with the correct port
const d = new dmxus("enttec-dmx-usb-pro", "COM3");


// Patch some fixtures
d.patchFixture(1, dmxus.getFixtureProfile("IRGB"));


// Add fixtures to a group
d.addFixtureToGroup("group", 1);


// Keys are a standardized parameter name, value is a hex value (0 - 255)
const initParameters = {
  "intensity": 0,
  "red": 0,
  "green": 0,
  "blue": 0
};


// Update all the fixtures in the universe with the provided parameters
d.updateAllFixtures(initParameters);


// Some parameters to fade into from black
const updateParameters = {
  "intensity": 255,
  "red": 255,
  "green": 255,
  "blue": 255
};

// Update all the fixtures in the group with the provided parameters
d.updateAllFixturesInGroup("group", updateParameters, 2500);

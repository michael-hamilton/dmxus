// Example usage of dmxus

// Require the module
const dmxus = require("./index");


// Create an instance of dmxus with the correct port
const d = new dmxus("enttec-dmx-usb-pro", "COM6");


// Patch some fixtures
d.patchFixture(1, dmxus.getFixtureProfile("IRGB"));
d.patchFixture(8, dmxus.getFixtureProfile("IRGB"));


// Add fixtures to a group
d.addFixtureToGroup("group", 1);
d.addFixtureToGroup("group", 8);


// Keys are a standardized parameter name, value is a hex value (0 - 255)
const parameters = {
  "intensity": 0,
  "red": 255,
  "green": 255,
  "blue": 255
};


// Update all the fixtures in the universe with the provided parameters
d.updateAllFixtures(parameters);


// Update all the fixtures in the group with the provided parameters
d.updateAllFixturesInGroup("group", parameters);

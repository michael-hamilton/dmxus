// Example usage of dmxus

// Require the module
const dmxus = require("./index");


// Create an instance of dmxus with the correct port
const d = new dmxus("enttec-dmx-usb-pro", "COM6");


// Patch some fixtures
d.patchFixture(1, dmxus.getFixtureProfile("RGBW"));
d.patchFixture(5, dmxus.getFixtureProfile("RGBW"));
d.patchFixture(9, dmxus.getFixtureProfile("RGBW"));
d.patchFixture(13, dmxus.getFixtureProfile("RGBW"));


// Add fixtures to a group
d.addFixtureToGroup("group", 1);
d.addFixtureToGroup("group", 5);
d.addFixtureToGroup("group", 9);
d.addFixtureToGroup("group", 13);


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

// Some parameters to fade into from black
const updateParameters = {
  "red": 120,
  "green": 200,
  "blue": 100,
  "white": 0,
};

// Update all the fixtures in the group with the provided parameters
d.updateAllFixturesInGroup("group", updateParameters, 2000);

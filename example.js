// Example usage of dmxus

// Require the module
const dmxus = require('./index');

// Create an instance of dmxus with the correct port
const d = new dmxus('COM6');

// Patch a fixture
d.patchFixture( 1, dmxus.getDeviceProfile("IRGB"));

// Keys are a standardized parameter name, value is a hex value (0 - 255)
const parameters = {
  "intensity": 255,
  "red": 255,
  "green": 255,
  "blue": 255
};

// Update the all the fixtures in the universe with the provided parameters
d.updateAllFixtures(parameters);

// Example usage of dmxus

const dmxus = require('./index');
const profiles = require('./profiles');

// Keys are fixture start address, value is a device profile object
const fixtures = {
  1: profiles.IRGB
};

// Keys are a standardized parameter name, value is a hex value (0 - 255)
const parameters = {
  "intensity": 255,
  "red": 255,
  "green": 255,
  "blue": 255
};

const d = new dmxus('COM6');

d.updateFixtures(fixtures, parameters);

// Example usage of dmxus

// Require the module
const dmxus = require('./index');


// Create an instance of dmxus with an interface and port
const d = new dmxus('enttec-dmx-usb-pro', '/dev/tty.usbserial-EN288085');
// const d = new dmxus('simulator', '');


// Initialize webserver - default http://localhost:9090
d.initWebServer();


// Add devices
d.addDevice(1, 1, dmxus.getFixtureProfile('RGBW'), 'Test Device 1', ['group']);
d.addDevice(2, 6, dmxus.getFixtureProfile('RGBW'), 'Test Device 2', ['group']);
d.addDevice(3, 11, dmxus.getFixtureProfile('RGBW'), 'Test Device 3', ['group']);
d.addDevice(4, 16, dmxus.getFixtureProfile('RGBW'), 'Test Device 4', ['group']);


// Keys are a standardized parameter name, value is a hex value (0 - 255)
const initParameters = {
  red: 0,
  green: 0,
  blue: 0,
  white: 0
};


// Update all the fixtures in the universe with the provided parameters
d.updateAllDevices(initParameters);


// Loop every 5 seconds
setInterval(() => {
  // Update all the fixtures in the group with the provided parameters
  d.updateAllDevicesInGroup('group', {
    red: dmxus.getRandom8BitValue(),
    green: dmxus.getRandom8BitValue(),
    blue: dmxus.getRandom8BitValue(),
    white: dmxus.getRandom8BitValue(),
  }, 1000);
}, 5000);

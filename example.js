// Example usage of dmxus

// Require the module
const dmxus = require('./index');


// Create an instance of dmxus with an interface and port
const d = new dmxus('simulator', '');


// Initialize webserver - default http://localhost:9090
d.initWebServer();


// Add devices
d.addDevice(1, 1, dmxus.getDeviceProfile('RGB'), 'Test Device 1', ['group']);
d.addDevice(2, 4, dmxus.getDeviceProfile('RGB'), 'Test Device 2', ['group']);
d.addDevice(3, 10, dmxus.getDeviceProfile('RGB'), 'Test Device 3', ['group']);
d.addDevice(4, 13, dmxus.getDeviceProfile('RGB'), 'Test Device 4', ['group']);
d.addDevice(5, 16, dmxus.getDeviceProfile('RGB'), 'Test Device 5', ['group']);
d.addDevice(6, 19, dmxus.getDeviceProfile('RGB'), 'Test Device 6', ['group']);
d.addDevice(7, 22, dmxus.getDeviceProfile('RGB'), 'Test Device 7', ['group']);
d.addDevice(8, 25, dmxus.getDeviceProfile('RGB'), 'Test Device 8', ['group']);


// Keys are a standardized parameter name, value is a hex value (0 - 255)
const initParameters = {
  red: 0,
  green: 0,
  blue: 0,
  white: 0
};


// Update all the devices in the universe with the provided parameters
d.updateAllDevices(initParameters);

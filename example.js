// Example usage of dmxus

// Require the module
const dmxus = require('./index');


// Create an instance of dmxus with an interface and port
const d = new dmxus('simulator', '');


// Initialize webserver - default http://localhost:9090
d.initWebServer();


// Add devices
d.addDevice(1, 1, dmxus.getDeviceProfile('RGB'), 'Test Device 1', ['all', 'left', 'back']);
d.addDevice(2, 4, dmxus.getDeviceProfile('RGB'), 'Test Device 2', ['all', 'left', 'middle', 'back']);
d.addDevice(3, 10, dmxus.getDeviceProfile('RGB'), 'Test Device 3', ['all', 'left', 'middle', 'front']);
d.addDevice(4, 13, dmxus.getDeviceProfile('RGB'), 'Test Device 4', ['all', 'left', 'front']);
d.addDevice(5, 16, dmxus.getDeviceProfile('RGB'), 'Test Device 5', ['all', 'right', 'front']);
d.addDevice(6, 19, dmxus.getDeviceProfile('RGB'), 'Test Device 6', ['all', 'right', 'middle', 'front']);
d.addDevice(7, 22, dmxus.getDeviceProfile('RGB'), 'Test Device 7', ['all', 'right', 'middle', 'back']);
d.addDevice(8, 25, dmxus.getDeviceProfile('RGB'), 'Test Device 8', ['all', 'right', 'back']);

d.addScene('All White', () => {
  d.updateAllDevicesInGroup('all', {
    intensity: 255,
    red: 255,
    green: 255,
    blue: 255,
  })
});

d.addScene('All Red', () => {
  d.updateAllDevicesInGroup('all', {
    intensity: 255,
    red: 255,
    green: 0,
    blue: 0,
  })
});

d.addScene('All Green', () => {
  d.updateAllDevicesInGroup('all', {
    intensity: 255,
    red: 0,
    green: 255,
    blue: 0,
  })
});

d.addScene('All Blue', () => {
  d.updateAllDevicesInGroup('all', {
    intensity: 255,
    red: 0,
    green: 0,
    blue: 255,
  })
});

d.addScene('Left White', () => {
  d.updateAllDevicesInGroup('left', {
    intensity: 255,
    red: 255,
    green: 255,
    blue: 255,
  })
});

d.addScene('Left Red', () => {
  d.updateAllDevicesInGroup('left', {
    intensity: 255,
    red: 255,
    green: 0,
    blue: 0,
  })
});

d.addScene('Left Green', () => {
  d.updateAllDevicesInGroup('left', {
    intensity: 255,
    red: 0,
    green: 255,
    blue: 0,
  })
});

d.addScene('Left Blue', () => {
  d.updateAllDevicesInGroup('left', {
    intensity: 255,
    red: 0,
    green: 0,
    blue: 255,
  })
});

d.addScene('Right White', () => {
  d.updateAllDevicesInGroup('right', {
    intensity: 255,
    red: 255,
    green: 255,
    blue: 255,
  })
});

d.addScene('Right Red', () => {
  d.updateAllDevicesInGroup('right', {
    intensity: 255,
    red: 255,
    green: 0,
    blue: 0,
  })
});

d.addScene('Right Green', () => {
  d.updateAllDevicesInGroup('right', {
    intensity: 255,
    red: 0,
    green: 255,
    blue: 0,
  })
});

d.addScene('Right Blue', () => {
  d.updateAllDevicesInGroup('right', {
    intensity: 255,
    red: 0,
    green: 0,
    blue: 255,
  })
});

d.addScene('All White Fade', () => {
  d.updateAllDevicesInGroup('all', {
    intensity: 255,
    red: 255,
    green: 255,
    blue: 255,
  }, 2000)
});

d.addScene('All Red Fade', () => {
  d.updateAllDevicesInGroup('all', {
    intensity: 255,
    red: 255,
    green: 0,
    blue: 0,
  }, 2000)
});

d.addScene('All Green Fade', () => {
  d.updateAllDevicesInGroup('all', {
    intensity: 255,
    red: 0,
    green: 255,
    blue: 0,
  }, 2000)
});

d.addScene('All Blue Fade', () => {
  d.updateAllDevicesInGroup('all', {
    intensity: 255,
    red: 0,
    green: 0,
    blue: 255,
  }, 2000)
});

d.addScene('Left White Fade', () => {
  d.updateAllDevicesInGroup('left', {
    intensity: 255,
    red: 255,
    green: 255,
    blue: 255,
  }, 2000)
});

d.addScene('Left Red Fade', () => {
  d.updateAllDevicesInGroup('left', {
    intensity: 255,
    red: 255,
    green: 0,
    blue: 0,
  }, 2000)
});

d.addScene('Left Green Fade', () => {
  d.updateAllDevicesInGroup('left', {
    intensity: 255,
    red: 0,
    green: 255,
    blue: 0,
  }, 2000)
});

d.addScene('Left Blue Fade', () => {
  d.updateAllDevicesInGroup('left', {
    intensity: 255,
    red: 0,
    green: 0,
    blue: 255,
  }, 2000)
});

d.addScene('Right White Fade', () => {
  d.updateAllDevicesInGroup('right', {
    intensity: 255,
    red: 255,
    green: 255,
    blue: 255,
  }, 2000)
});

d.addScene('Right Red Fade', () => {
  d.updateAllDevicesInGroup('right', {
    intensity: 255,
    red: 255,
    green: 0,
    blue: 0,
  }, 2000)
});

d.addScene('Right Green Fade', () => {
  d.updateAllDevicesInGroup('right', {
    intensity: 255,
    red: 0,
    green: 255,
    blue: 0,
  }, 2000)
});

d.addScene('Right Blue Fade', () => {
  d.updateAllDevicesInGroup('right', {
    intensity: 255,
    red: 0,
    green: 0,
    blue: 255,
  }, 2000)
});

d.addScene('All Off', () => {
  d.updateAllDevicesInGroup('all', {
    intensity: 0,
    red: 0,
    green: 0,
    blue: 0,
  })
});

d.addScene('All Off Fade', () => {
  d.updateAllDevicesInGroup('all', {
    intensity: 0,
    red: 0,
    green: 0,
    blue: 0,
  }, 2000)
});


// Keys are a standardized parameter name, value is a hex value (0 - 255)
const initParameters = {
  intensity: 0,
  red: 0,
  green: 0,
  blue: 0,
  white: 0
};


// Update all the devices in the universe with the provided parameters
d.updateAllDevices(initParameters);

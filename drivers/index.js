// Used to select the correct driver based on provided driver name

const Driver = (driverName) => {
  switch(driverName) {
    case "enttec-dmx-usb-pro":
      console.log("Using driver enttec-dmx-usb-pro");
      return require('./enttec-dmx-usb-pro-driver');

    default:
      console.log("No driver found");
      return false;
  }
};

module.exports = Driver;

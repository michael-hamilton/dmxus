# dmxus

dmxus is a high level Javascript library for controlling lighting fixtures via DMX. The aim of dmxus is to provide a friendly API with conventions that feel similar to working directly on a lighting console.



## Installation

```
npm install dmxus --save
```

dmxus works on Windows, Mac, and Linux and should be compatible with all active/LTS versions of NodeJS.



## Usage

Require the library as you would any node module. Instantiate the class by passing in the name of the driver to use, and the name or path of the port for the DMX interface.  Each instance of dmxus is capable of controlling a single 512 channel DMX universe.
```
const dmxus = require("dmxus");

// Windows
const universe = new dmxus("enttec-dmx-usb-pro", "COM6");

// Mac/Linux
const universe = new dmxus("enttec-dmx-usb-pro", "/dev/tty.usbserial-EN288085");
```

At the moment, dmxus only comes with support for the Enttec DMX USB Pro interface. Additional drivers can be registered in `drivers/index.js`. See `drivers/enttec-dmx-usb-pro-driver.js` to get an idea for how to write a driver for a different interface.

There is a driver called "simulator" which allows use of dmxus without a hardware interface. See appendix for more information about ways to use this.


#### Devices

Lighting fixtures are represented by dmxus as devices. dmxus by default can manage and control up to 96 devices. To add a device, use the `addDevice()` method. 
The first parameter is the device's ID (1-96), the second is the device start address (1-512), the third is a device profile object (see appendix for the shape of this object), the fourth is an optional device name, and the fifth is an optional array of group names.
dmxus also includes a utility method `getDeviceProfile()` for retrieving pre-existing device profiles.
```
universe.addDevice(1, 1, dmxus.getDeviceProfile("IRGB"), "Test Device", ["group"]);
```


#### Updating Devices

dmxus provides a few methods for controlling a device.  All methods for updating devices expect a parameters object that defines what device parameters should update. The object's keys are the names of the parameter to control (see appendix for standardized parameter names), and values are a hex value (0 - 255).
```
const parameters = {
    "intensity": 255,
    "red": 255,
    "green": 255,
    "blue": 255
};
```

To update a single device, call the `updateDevice()` method, passing in the deviceId and parameters to update on the device.

To update all the devices in a group, call the `updateAllDevicesInGroup()` method, passing in a group name and parameters to update on the devices in the group. This method accepts an optional third parameter for defining the number of milliseconds to fade into the new scene.

To update all the devices at once, call the `updateAllDevices()` method, passing in parameters to update on all of the devices.



## Utilities

dmxus provides a few misc utility functions that are useful for things like persisting dmxus instance data or for retrieving device profiles.

Use the `getDevices()` method to retrieve the current list of devices.

Use the `getDeviceById()` method passing in a deviceId to retrieve the device at the specified id.

Use the `getDevicesByGroup()` method passing in a group name to retrieve the devices belonging to the specified group.

`getRandom8BitValue()` returns a random decimal value from 0-255. This is a static method that can be run outside the context of a dmxus instance. 

`getUniverseState()` returns the JSON value of the current universe state. 

dmxus is best suited for manipulating devices, however individual address values can be manipulated with the `updateAddressValue()` method by passing in an address and a dmx value. For single address devices, consider using a device assigned with the `Dimmer` profile. 



## Web Client

There is a simple (opt-in) web client that provides a visual interface for access to some basic dmxus features. Use the `initWebServer()` method to start a server on the default port `9090`. You can optionally pass a port number to this method if you want to run the server on a different port.

Interfaces can be selected with the dropdown, and serial port selection for interfaces other than Simulator.

The Devices tab shows all the devices and their statuses (namely color). Clicking on a device will show some more details about the device such as start address, device profile, device parameters, and any groups which the device belongs to.

The Universe tab shows the status of all 512 addresses in the dmx universe controlled by dmxus. Gray numbers represent an address while red numbers (0-255) represent the DMX value at that address.

The Virtual Console tab allows individual control of all 512 addresses in the universe. The sliders can be adjusted to change the value at a specific address.


## Appendix

#### Device Profiles

Some generic profiles come standard with dmxus. If you want to add a device for which a profile does not exist, use the following format in your device profile object:
```
{
    "description": "4 channel rgb fixture with intensity",
    "parameters": [
      "intensity",
      "red",
      "green",
      "blue"
    ]
}
```
The order of the profile's list of parameters is important and should correspond to the respective channels on the device. Existing profiles can be found in `profiles.json` at the root of the dmxus repo.

Parameter names can be arbitrary, however for consistency it is recommended that you use the same names across your profiles. Some standard parameter names commonly found in the industry are:
* amber
* beam
* blue
* color_wheel
* gobo
* green
* intensity
* pan
* pan_fine
* red
* strobe
* tilt
* tilt_fine
* white


#### Simulator Driver

The simulator driver exposes the same `send()`, `changePort()`, and `closePort()` methods as a hardware interface driver, but by default they don't do anything.

In place of a port name, you can optionally provide a custom dummy SerialPort instance to be used within the driver:
```
{
  isOpen: bool,
  close: function,
  write: function,
}
```


#### Running From Source

After cloning the repo, run `npm install`. dmxus relies on the [Node SerialPort](https://serialport.io/) in order to communicate with DMX interfaces. This library relies on native modules to work correctly. Please consult their documentation if you run into any issues.



## Contributing

If you find this library useful and want to contribute to it, please feel free to do so on the GitHub page. 

Contributions that would be especially useful are device profiles as well as drivers to support other interfaces.

For help with making a profile for a specific device or using an unsupported interface, please open an issue! 



## License

Released under the MIT license - do whatever you wish with it and have fun!

_**dmxus is pre 1.0.0**_ - If you do find yourself using it, please keep in mind things may become incompatible between versions.



## Acknowledgement
Made with love by [Michael Hamilton](http://miska.me).

# dmxus

dmxus is a high level Javascript library for controlling lighting fixtures via DMX. The aim of dmxus is to provide a friendly API with conventions that feel similar to working directly on a lighting console.



## Installation

```
npm install dmxus --save
```

dmxus works on Windows, Mac, and Linux and should be compatible with all active/LTS versions of NodeJS.



## Usage

Require the library as you would any node module. Instantiate the class by passing in the name of the driver to use, and the name or path of the port of the DMX interface.  Each instance of dmxus is capable of controlling a single 512 channel DMX universe.
```
const dmxus = require("dmxus");

// Windows
const d = new dmxus("enttec-dmx-usb-pro", "COM6");

// Mac/Linux
const d = new dmxus("enttec-dmx-usb-pro", "/dev/tty.usbserial-EN288085");
```

At the moment, dmxus only comes with support for the Enttec DMX USB Pro interface. Drivers can be registered in `drivers/index.js`. See `drivers/enttec-dmx-usb-pro-driver.js` to get an idea for how to write a driver for a different interface.


#### Patching and Grouping

Patch fixtures using the `patchFixture()` method. The first parameter is the start address of the fixture to be patched, and the second is a fixture profile object (see appendix for the shape of this object). dmxus also includes a utility method `getFixtureProfile()` for retrieving pre-existing fixture profiles.
```
d.patchFixture(1, dmxus.getFixtureProfile("IRGB"));
```

Fixtures can be grouped using the `addFixtureToGroup()` method. Pass in a group name and the starting address of the fixture to add the fixture to the group.
```
d.addFixtureToGroup("group", 1);
```


#### Updating Fixtures

dmxus provides a few methods for updating fixtures.  All methods for updating fixtures expect a parameters object that defines what fixture parameters should update. The object's keys are the names of the parameter to control (see appendix for standardized parameter names), and values are a hex value (0 - 255).
```
const parameters = {
    "intensity": 255,
    "red": 255,
    "green": 255,
    "blue": 255
};
```
  

To update a single fixture, call the `updateSingleFixture()` method, passing in the fixture start address and parameters to update on the fixture.

To update all of the fixtures in a group, call the `updateAllFixturesInGroup()` method, passing in a group name and parameters to update on the fixtures in the group. This method accepts an optional third parameter for defining the number of milliseconds to fade into the new scene.

To update all of the fixtures in the DMX universe, call the `updateAllFixtures()` method, passing in parameters to update on all of the fixtures.



## Utilities

dmxus provides a few misc utility functions that are useful for things like persisting patch data of a dmxus instance or for retrieving device profiles.

Use the `getPatch()` method to retrieve the current patch configuration.
`setPatch()` accepts an object of the same shape as that returned from `getPatch()`, and sets the dmxus instance's patch accordingly.

`getPatchedFixtureProfile()` accepts a start address and returns the profile of the fixture patched at that address.



## Appendix
Some generic profiles come standard with dmxus. If you want to patch a fixture for which a profile does not exist, use the following format in your patch object:
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
The order of the profile's list of parameters is important and should correspond to the respective channels on the fixture. Existing profiles can be found in `profiles.json` in the root of the dmxus repo.

Parameter names are arbitrary, but the standardized names currently used within dmxus profiles are:
* amber
* blue
* green
* intensity
* pan
* pan_fine
* red
* tilt
* tilt_fine
* white



## License
Released under the MIT license - do whatever you wish with it.



## Acknowledgement
Made with love by [Michael Hamilton](http://hamblest.one).

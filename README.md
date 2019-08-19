# dmxus

A high level Javascript library for controlling lighting fixtures via DMX. The aim of dmxus is to provide a friendly API with conventions that feel similar to working directly on a lighting console.

At the moment, only the Enttec DMX USB Pro interface is supported.


## Installation

```
npm install dmxus --save
```


## Usage

Require the library as you would any node module. Instantiate the class by passing in the name or path of the port for the DMX interface.  Each instance of dmxus is capable of controlling a single 512 channel DMX universe.
```
const dmxus = require('dmxus');

const d = new dmxus('COM6');
```

Patch fixtures using the `patchFixture()` method. The first parameter is the start address of the fixture to be patch, and the second is a fixture profile object (see appendix for the shape of this object). dmxus also includes a utility method `getDeviceProfile()` for retrieving preexisting fixture profiles.
```
d.patchFixture( 1, dmxus.getDeviceProfile("IRGB"));
```

To update all of the devices in the DMX universe, call the `updateAllFixtures()` method passing in a patch object, and an update object.  Object keys are the parameter name to control (see appendix for standardized parameter names), and values are a hex value (0 - 255).
```
const parameters = {
    "intensity": 255,
    "red": 255,
    "green": 255,
    "blue": 255
};

d.updateFixtures(fixtures, parameters);
```  


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

Parameter names are arbitrary, but the standardized names used within dmxus profiles are:
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
Released under the MIT license. Do whatever you wish with it, just don't @ me.


## Acknowledgement
Made with love by [Michael Hamilton](http://hamblest.one).

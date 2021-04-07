// dmxus web client

import React, {Component} from 'react';
import io from 'socket.io-client';
import {Fixture_IRGB, Fixture_RGBW} from './fixtures';
import './client.scss';

class Client extends Component {
  constructor(props) {
    super(props);

    this.state = {
      interfaceName: '',
      patch: {},
      interfacePort: '',
      interfacePorts: [],
      universe: [],
    };

    this.socket = null;
  }

  componentDidMount() {
    this.socket = io(`localhost:3000`, {transports: ['websocket']});

    this.socket.on('update', (universe) => {
      this.setState({universe: universe.data});
    });

    this.socket.on('patch', (patch) => {
      this.setState({patch});
    });

    this.socket.on('interfacePorts', (interfacePorts) => {
      this.setState({interfacePorts});
    });

    this.socket.on('interfaceName', (interfaceName) => {
      this.setState({interfaceName, port: null});
    });

    this.socket.on('interfacePort', (interfacePort) => {
      this.setState({interfacePort});
    });

    this.socket.emit('getPorts');
  }

  handleChangeInterfaceDevice(event) {
    const interfaceName = event.target.value;
    this.setState({interfaceName, interfacePort: ''})
    if(interfaceName === 'simulator') {
      this.socket.emit('initializeInterface', interfaceName, '');
    }
  }

  handleChangePort(event) {
    const interfacePort = event.target.value;
    this.setState({interfacePort})
    this.socket.emit('initializeInterface', this.state.interfaceName, interfacePort);
  }

  render() {

    const _u = this.state.universe;

    return (
      <div className={'app-wrapper'}>
        <h1 className={'header'}>dmxus client</h1>

        <Select
          defaultOption={"Select an interface..."}
          options={[
            {value: 'simulator', option: 'Simulator'},
            {value: 'enttec-dmx-usb-pro', option: 'Enttec DMX USB PRO'}
          ]}
          onChange={this.handleChangeInterfaceDevice.bind(this)}
          value={this.state.interfaceName}
        />

        <Select
          disabled={this.state.interfaceName === "simulator"}
          defaultOption={"Select an interface port..."}
          options={this.state.interfacePorts.map(port => (
            {value: port.path, option: port.path}
          ))}
          onChange={this.handleChangePort.bind(this)}
          value={this.state.interfacePort}
        />

        {renderFixtures(this.state.patch, this.state.universe)}
      </div>
    );
  }
}

// Accepts a dmxus patch and a universe object, returns an array of fixture components
const renderFixtures = (fixtures, universe) => {
  const fixtureComponents = [];
  Object.keys(fixtures).forEach((address) => {
    const _a = parseInt(address);
    const _f = fixtures[address];
    const _p = _f.parameters;

    if (_f.type === 'irgb') {
      fixtureComponents.push(
        <Fixture_IRGB
          key={address}
          startAddress={address}
          intensity={universe[_a + _p.indexOf('intensity')]}
          red={universe[_a + _p.indexOf('red')]}
          green={universe[_a + _p.indexOf('green')]}
          blue={universe[_a + _p.indexOf('blue')]}
        />
      );
    }
    else if (_f.type === 'rgbw') {
      fixtureComponents.push(
        <Fixture_RGBW
          key={address}
          startAddress={address}
          red={universe[_a + _p.indexOf('red')]}
          green={universe[_a + _p.indexOf('green')]}
          blue={universe[_a + _p.indexOf('blue')]}
          white={universe[_a + _p.indexOf('white')]}
        />
      );
    }
  });

  return fixtureComponents;
}

// Generic select dropdown component
const Select = props => (
  <select onChange={props.onChange} value={props.value} disabled={props.disabled}>
    <option value={''} disabled>{props.defaultOption}</option>
    {
      props.options.map((option, i) =>
        <option key={i} value={option.value}>{option.option}</option>
      )
    }
  </select>
);

export default Client;

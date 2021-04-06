// dmxus web client

import io from 'socket.io-client';
import React, {Component} from 'react';
import {Fixture_IRGB, Fixture_RGBW} from './fixtures';
import './client.scss';

class Client extends Component {
  constructor(props) {
    super(props);

    this.state = {
      universe: [],
      patch: {},
      ports: [],
      port: null,
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

    this.socket.on('ports', (ports) => {
      this.setState({ports});
    });

    this.socket.on('port', (port) => {
      this.setState({port});
    });

    this.socket.emit('getPorts');
  }

  handleChangePort(event) {
    const port = event.target.value;
    this.setState({port})
    this.socket.emit('changePort', port);
  }

  render() {

    const _u = this.state.universe;

    return (
      <div className={'app-wrapper'}>
        <h1 className={'header'}>dmxus client</h1>

        <Select
          defaultOption={"Select an interface port..."}
          options={this.state.ports.map(port => (
            {value: port.path, option: port.path}
          ))}
          onChange={this.handleChangePort.bind(this)}
          value={this.state.port}
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
  <select onChange={props.onChange} value={props.value}>
    <option disabled>{props.defaultOption}</option>
    {
      props.options.map((option, i) =>
        <option key={i} value={option.value}>{option.option}</option>
      )
    }
  </select>
);

export default Client;

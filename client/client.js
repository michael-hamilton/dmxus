import io from 'socket.io-client';
import React, {Component} from 'react';
import {Fixture_IRGB, Fixture_RGBW} from './fixtures';
import './client.scss';

class Client extends Component {
  constructor(props) {
    super(props);

    this.state = {
      universe: [],
      patch: {}
    };

    this.socket = null;
  }

  componentDidMount() {
    this.socket = io(`localhost:3000`, {transports: ['websocket']});

    this.socket.on('update', (universe) => {
      this.setState({universe: universe.data});
    });

    this.socket.on('patch', (patch) => {
      console.log(patch);
      this.setState({patch});
    });

    this.socket.emit('getPorts');

    // this.socket.on('ports', (ports) => console.log(ports));
  }

  render() {

    const _u = this.state.universe;

    return (
      <div className={'app-wrapper'}>
        <h1 className={'header'}>dmxus client</h1>

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

export default Client;

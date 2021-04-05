import io from 'socket.io-client';
import React, {Component} from 'react';
import './client.scss';

class Universe extends Component {
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
      this.setState({patch});
    });
  }

  render() {
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

  });

  return fixtureComponents;
}

export default Universe;

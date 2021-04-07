// dmxus web client

import React, {Component} from 'react';
import io from 'socket.io-client';
import './client.scss';

class Client extends Component {
  constructor(props) {
    super(props);

    this.state = {
      devices: [],
      interfaceName: '',
      interfacePort: '',
      interfacePorts: [],
      page: 0,
      patch: {},
      universe: [],
    };

    this.socket = null;
  }

  componentDidMount() {
    this.socket = io({transports: ['websocket']});

    this.socket.on('update', (universe) => {
      this.setState({universe: universe.data});
    });

    this.socket.on('patch', (patch) => {
      this.setState({patch});
    });

    this.socket.on('devices', (devices) => {
      this.setState({devices});
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

  componentWillUnmount() {
    this.socket.offAny();
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
    return (
      <div className={'app-wrapper'}>
        <div className={'header'}>
          <h1 className={'app-title'}>dmxus client</h1>

          <div className={'interface-selection-wrapper'}>
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
          </div>
        </div>

        <div className={'tab-navigation'}>
          <button className={`tab-button ${this.state.page === 0 ? 'active' : ''}`} onClick={() => this.setState({page: 0})}>Devices</button>
          <button className={`tab-button ${this.state.page === 1 ? 'active' : ''}`} onClick={() => this.setState({page: 1})}>Universe</button>
        </div>

        {
          this.state.page === 0 ? (
            <div className={'content-wrapper'}>
              <div className={'devices'}>
                {renderDevices(this.state.devices, this.state.universe)}
              </div>
            </div>
          ) : null
        }

        {
          this.state.page === 1 ? (
            <div className={'content-wrapper'}>
              <div className={'universe'}>
                {renderUniverse(this.state.universe)}
              </div>
            </div>
          ) : null
        }
      </div>
    );
  }
}

// Accepts a list of dmxus devices and a universe object and renders a grid of devices
const renderDevices = (devices, universe) => {
  return devices.map((device) => {
    const _a = parseInt(device.startAddress);
    let backgroundColor;

    if(device.profile) {
      const _p = device.profile.parameters;

      backgroundColor = `rgb(${universe[_a + _p.indexOf('red')]}, ${universe[_a + _p.indexOf('green')]}, ${universe[_a + _p.indexOf('blue')]})`;
    }

    return (
      <div
        className={`device ${device.startAddress ? 'isRegistered' : ''}`}
        style={{backgroundColor}}
      >
        <span className={'deviceId'}>{device.id}</span>
      </div>
  )});
};

// Accepts a universe object and renders addresses with their corresponding values
const renderUniverse = (universe) => {
  return universe.slice(1).map((address, index) => {
    return (
      <div
        className={'address'}
      >
        <p>{index + 1}</p>
        <p className={'value'}>{universe[index + 1]}</p>
      </div>
    )});
};

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

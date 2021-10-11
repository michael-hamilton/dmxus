// dmxus web client

import React, {Component, useEffect, useState} from 'react';
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
      selectedDevice: null,
      showEditor: false,
      tab: 0,
      universe: [],
    };

    this.socket = null;
  }

  componentDidMount() {
    this.socket = io({transports: ['websocket']});

    this.socket.on('update', (universe) => {
      this.setState({universe: universe.data});
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

  // Handles changing the interface device
  handleChangeInterfaceDevice(event) {
    const interfaceName = event.target.value;
    this.setState({interfaceName, interfacePort: ''})
    if(interfaceName === 'simulator') {
      this.socket.emit('initializeInterface', interfaceName, '');
    }
  }

  // Handles changing the start address of the specified device
  handleChangeDeviceAddress(deviceId, startAddress) {
    this.socket.emit('changeDeviceStartAddress', deviceId, startAddress);
  }

  // Handles changing the interface port
  handleChangePort(event) {
    const interfacePort = event.target.value;
    this.setState({interfacePort})
    this.socket.emit('initializeInterface', this.state.interfaceName, interfacePort);
  }

  // Toggles the device editor for the specified device
  toggleEditor(selectedDevice) {
    this.setState({showEditor: !this.state.showEditor, selectedDevice})
  }

  // Handles updating the dmx at an address based on the input received from a slider
  handleSliderChange(e) {
    this.socket.emit('updateAddressValue', e.target.getAttribute('address'), e.target.value)
  }

  render() {
    return (
      <div className={`app-wrapper`}>
        <div className={'header'}>
          <h1 className={'app-title'}>dmxus client</h1>

          <div className={'interface-selection-wrapper'}>
            <Select
              defaultOption={'Select an interface...'}
              options={[
                {value: 'simulator', option: 'Simulator'},
                {value: 'enttec-dmx-usb-pro', option: 'Enttec DMX USB PRO'}
              ]}
              onChange={this.handleChangeInterfaceDevice.bind(this)}
              value={this.state.interfaceName}
            />

            <Select
              disabled={this.state.interfaceName === 'simulator'}
              defaultOption={'Select an interface port...'}
              options={this.state.interfacePorts.map(port => (
                {value: port.path, option: port.path}
              ))}
              onChange={this.handleChangePort.bind(this)}
              value={this.state.interfacePort}
            />
          </div>
        </div>

        <div className={'tab-navigation'}>
          <button className={`tab-button ${this.state.tab === 0 ? 'active' : ''}`} onClick={() => this.setState({tab: 0})}>Devices</button>
          <button className={`tab-button ${this.state.tab === 1 ? 'active' : ''}`} onClick={() => this.setState({tab: 1})}>Universe</button>
          <button className={`tab-button ${this.state.tab === 2 ? 'active' : ''}`} onClick={() => this.setState({tab: 2})}>Virtual Desk</button>
        </div>

        {
          this.state.tab === 0 ? (
            <div className={'content-wrapper'}>
              <div className={'devices'}>
                {renderDevices(this.state.devices, this.state.universe, this.toggleEditor.bind(this), this.handleChangeDeviceAddress.bind(this))}
              </div>
            </div>
          ) : null
        }

        {
          this.state.tab === 1 ? (
            <div className={'content-wrapper'}>
              <div className={'universe'}>
                {renderUniverse(this.state.universe)}
              </div>
            </div>
          ) : null
        }

        {
          this.state.tab === 2 ? (
            <div className={'content-wrapper'}>
              <div className={'desk'}>
                {renderSliders(this.state.universe, this.handleSliderChange.bind(this))}
              </div>
            </div>
          ) : null
        }

        {
          this.state.showEditor ? <Editor toggleEditor={this.toggleEditor.bind(this)} device={this.state.selectedDevice} changeStartAddress={this.handleChangeDeviceAddress.bind(this)} /> : null
        }
      </div>
    );
  }
}

// Accepts a list of dmxus devices and a universe object and renders a grid of devices
const renderDevices = (devices, universe, toggleEditor) => {
  return devices.map((device) => {
    const _a = parseInt(device.startAddress);
    let color;

    if(device.profile) {
      const _p = device.profile.parameters;
      color = `rgb(${universe[_a + _p.indexOf('red')]}, ${universe[_a + _p.indexOf('green')]}, ${universe[_a + _p.indexOf('blue')]})`;
    }

    return <Device key={device.id} color={color} device={device} toggleEditor={toggleEditor} />;
  });
};

// Accepts a universe object and renders addresses with their corresponding values
const renderUniverse = (universe) => {
  return universe.slice(1).map((address, index) => {
    return (
      <div className={'address'}>
        <p>{index + 1}</p>
        <p className={'value'}>{universe[index + 1]}</p>
      </div>
    )});
};

// Accepts a universe object and renders addresses with their corresponding values
const renderSliders = (universe, onChange) => {
  return universe.slice(1).map((address, index) =>
    <VerticalSlider key={index} address={index + 1} value={universe[index + 1]} onChange={onChange} />
  );
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

// Vertical slider component
const VerticalSlider = props => {
  const [value, setValue] = useState(props.value);

  useEffect(() => {
    setValue(props.value);
  }, [props.value])

  return (
    <div className={'slider-wrapper'}>
      <p className={'value'}>{value}</p>
      <input
        address={props.address}
        className={'slider'}
        max={255}
        min={0}
        onChange={props.onChange}
        orient={'vertical'}
        type={'range'}
        value={value}
      />
      <p className={'address'}>{props.address}</p>
    </div>
  );
}

// Device component
class Device extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div
          className={`device ${this.props.device.startAddress ? 'isRegistered' : ''}`}
          onClick={() => this.props.toggleEditor(this.props.device)}
          style={{backgroundColor: this.props.color}}
        >
          <span className={'deviceId'}>{this.props.device.id}</span>
        </div>
      </div>
    )
  }
}


// Editor component
class Editor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      deviceStartAddress: ''
    }
  }

  componentDidMount() {
    this.setState({deviceStartAddress: this.props.device.startAddress})
  }

  // Handles changing the start address of the device
  handleChangeAddress(e) {
    const deviceStartAddress = e.target.value;
    this.props.changeStartAddress(this.props.device.id, deviceStartAddress);
    this.setState({deviceStartAddress})
  }

  render() {
    return (
      <div className={'editor-wrapper'}>
        <div className={'editor'}>
          <button className={'close'} onClick={this.props.toggleEditor}>x</button>
          <div className={'device-details'}>
            <p><span>Device ID:</span> {this.props.device.id}</p>
            <p>
              <span>Start Address:</span>
              <Select
                defaultOption={'Select an address...'}
                onChange={this.handleChangeAddress.bind(this)}
                options={addressOptions()}
                value={this.state.deviceStartAddress || ''}
              />
            </p>
            {
              this.props.device.profile && this.props.device.profile.type && this.props.device.profile.description ?
                <p><span>Fixture Profile:</span> {this.props.device.profile.type} ({this.props.device.profile.description})</p>
                : <p><span>Fixture Profile:</span> not set</p>
            }
            {
              this.props.device.profile && this.props.device.profile.parameters ?
                <p><span>Fixture Parameters:</span> {this.props.device.profile.parameters.join(', ')}</p>
                : <p><span>Fixture Parameters:</span> none</p>
            }
            {
              this.props.device.groups.length ?
                <p><span>Groups:</span> {this.props.device.groups.join(', ')}</p>
                : null
            }
          </div>
        </div>
      </div>
    )
  }
}

const addressOptions = () => {
  const addresses = [];

  for(let i = 1; i <= 512; i++) {
    addresses[i] = {value: i, option: i}
  }

  return addresses;
}

export default Client;

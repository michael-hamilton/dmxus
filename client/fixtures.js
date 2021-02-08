import React from 'react';
import './fixtures.scss';

const Fixture_IRGB = (props) => {
  return (
    <div className={'fixture'}>
      <p>Address: {props.startAddress}</p>
      <div
        className={'color'}
        style={{
          backgroundColor: `rgb(${props.red}, ${props.green}, ${props.blue})`
        }}
      />
      <p><small>i: {props.intensity}, r: {props.red}, g: {props.green}, b: {props.blue}</small></p>
    </div>
  );
};

const Fixture_RGBW = (props) => {
  return (
    <div className={'fixture'}>
      <div
        className={'color'}
        style={{
          backgroundColor: `rgb(${props.red}, ${props.green}, ${props.blue})`
        }}
      />
      <div className={'readout'}>
        <p>
          Address: {props.startAddress}
          <br />
          <small>r: {props.red}, g: {props.green}, b: {props.blue}, w: {props.white}, </small>
        </p>
      </div>
    </div>
  );
};

export {Fixture_IRGB, Fixture_RGBW};

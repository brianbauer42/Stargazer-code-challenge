import React, { Component } from 'react';
import Main from './components/Main.js';
import Title from './components/Title.js';
import 'normalize.css';
import './App.css';

export default class App extends Component {

  render() {
    return (
      <div className="App">
        <Title />
        <Main />
      </div>
    );
  }
};
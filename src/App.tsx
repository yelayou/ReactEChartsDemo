//import React from 'react';
import React, { useState, useEffect } from "react";

import Demo from './Demo';

//import logo from './logo.png';
//const logo = require("./logo.png");

import "./App.css";
import FXChart from "./FXChart";

//echarts.registerTheme('dark', require('echarts/theme/dark'));

class App extends React.Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">React ECharts v3 Demo</h1>
        </header>
        <p className="App-intro">
          Echart components using Typescript (<code>*.ts</code>)
        </p>
        <FXChart />
      </div>
    );
  }
}

export default App;

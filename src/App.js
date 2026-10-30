import React, { Component } from 'react';
import './App.css';
import SideBar from './SideBar.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div className="App-header-brand">
            <img src="./lantern.svg" alt="lantern" className="App-header-lantern" />
            <span className="App-title">新竹市朝山靈德宮管理系統</span>
            <img src="./lantern.svg" alt="lantern" className="App-header-lantern" />
          </div>
          <div className="App-header-blessing">
            風調雨順 ‧ 國泰民安
          </div>
        </header>
  
        <SideBar/>
      </div>
    );
  }
}

export default App;

import React, { Component } from 'react';
import './App.css';
import SideBar from './SideBar.js';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <label className="App-title">  朝山靈德宮管理系統</label>
        </header>
  
        <SideBar/>
      </div>
    );
  }
}

export default App;

import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Believer from './Believer/Believer.js';
import './SideBar.css';
import './Button.css';

const routes = [
    {
        path: '/',
        exact: true,
        main: () => <Believer/>
    },
    {
        path: '/Believer',
        exact: true,
        main: () => <Believer/>
    }
];

class SideBar extends Component{
    render(){
        return(
            <Router>
                <div className="SideBar_Div_All">
                    <div className="SideBar_Div">
                        <ul>
                            <li><Link className="Link" to = '/Believer'><img src="../../customer.png" alt="believer"/>信徒資訊</Link></li>
                        </ul>
                    </div>
                    
                    <div className="SideBar_Div_Main">
                        {routes.map((route) => (
                            <Route
                                key = {route.path}
                                path = {route.path}
                                exact = {route.exact}
                                component = {route.main}
                            />
                        ))}
                    </div>
                </div>
            </Router>
        );
    }
}

export default SideBar;

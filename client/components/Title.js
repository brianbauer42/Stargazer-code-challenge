import React, { Component } from 'react';

export default class Title extends Component {
    render() {
        return (
            <div className="titleBar">
                <img className="logo" src="./logo-stargazer2.png" alt="Stargazer logo" />
                <h2 className="title">Kairos API Interface</h2>
            </div>
        )
    }
};
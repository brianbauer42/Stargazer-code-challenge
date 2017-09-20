import React, { Component } from 'react';
import Form from './Form.js';
import Results from './Results.js';

export default class Main extends Component {
        constructor(props) {
        super(props);

        this.state = {
            apiHistory: []
        }

        this.addToAPIHistory = this.addToAPIHistory.bind(this);
    }

    addToAPIHistory(item) {
        const newStateAPIHistory = this.state.apiHistory;
        newStateAPIHistory.push(item);
        this.setState({ apiHistory: newStateAPIHistory });
    }

    render() {
        return (
            <div className="main">
                <Results apiHistory={this.state.apiHistory} />
                <Form apiHistory={this.state.apiHistory} addToAPIHistory={this.addToAPIHistory} />
            </div>
        )
    }
};
import React, { Component } from 'react';
import ResultCard from './ResultCard.js';

export default class Results extends Component {    
    constructor(props) {
        super(props);

        this.getResultCards = this.getResultCards.bind(this);
    }

    getResultCards() {
        var reverseHistory = this.props.apiHistory.slice().reverse();
        if (this.props.apiHistory.length > 0) {
            return (
                reverseHistory.map(item => {
                    return ( <ResultCard info={item} key={item.imageURL}/> );
                })
            );
        }
    }

    render() {
        return (
            <div className="resultsContainer">
                {this.getResultCards()}
            </div>
        )
    }
};
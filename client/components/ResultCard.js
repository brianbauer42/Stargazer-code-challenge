import React, { Component } from 'react';


export default class ResultCard extends Component {
    constructor(props) {
        super(props);

        state: {
            descriptionMajor: '';
            descriptionMinor: '';
        }
        this.buildDescriptions = this.buildDescriptions.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    componentDidMount() {
        this.buildDescriptions();
    }

    buildDescriptions() {
        var descriptionMajor = '';
        if (this.props.info.predominant) {
            descriptionMajor += "Predominantly " + this.props.info.predominant + '.';
        } else {
            descriptionMajor += "None predominant.";
        }

        var descriptionMinor = '';
        if (this.props.info.minor.length > 0) {
            descriptionMinor += "Some" + this.props.info.minor.map(function(item){return (' ' + item)}) + '.'; 
        } else {
            descriptionMinor += "Nothing else detected."
        }
        
        this.setState({
            descriptionMinor: descriptionMinor,
            descriptionMajor: descriptionMajor
        });
    }

    render() {
        return (
            this.state ? (
                <div className="resultCard">
                    <img className="resultImage" src={this.props.info.imageURL} />
                    <p className='description'>{this.state.descriptionMajor}</p>
                    <p className='description'>{this.state.descriptionMinor}</p>
                </div>
            ) : null
        )
    }
};
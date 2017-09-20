import React, { Component } from 'react';

export default class Form extends Component {
    constructor(props) {
        super(props);

        this.state = {
            message: 'Select an image...',
            image: '',
            imagePreviewUrl: ''
        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleImageChange = this.handleImageChange.bind(this);
    }

    handleImageChange(e) {
        e.preventDefault();
        var reader = new FileReader();
        var file = e.target.files[0];

        reader.onloadend = () => {
            this.setState({
                image: file,
                imagePreviewUrl: reader.result,
                message: 'Ready to submit...'
            });
        }

        reader.readAsDataURL(file)
    }

    handleSubmit(e) {
        e.preventDefault();
        if (this.state.image === '') {
            this.setState({ message: "No image selected!" });
            return ;
        } else {
            this.setState({
                message: "Working...",
                image: '',
                imagePreviewUrl: ''
            });
        }
        var formElement = document.querySelector('#imageSelectionForm');
        var formData = new FormData(formElement);
        fetch("/api/query", {
            method: "POST",
            body: formData
        }).then((result) => {
            return result.json();
        }).then((result) => {
            if (result.errorMessage) {
                this.imageSelection.value = '';
                this.setState({
                    message: result.errorMessage,
                    image: '',
                    imagePreviewUrl: ''
                });
            } else {
                this.props.addToAPIHistory(result);
                this.imageSelection.value = '';
                this.setState({
                    message: 'Done!'
                });
                setTimeout(() => {
                    this.setState({
                        message: 'Select another image...',
                    });
                }, 2500);
            }
        });
    }

    render() {
        var imagePreviewUrl = this.state.imagePreviewUrl;
        var imagePreview = null;
        if (imagePreviewUrl) {
            imagePreview = (
                <img className="preview" src={imagePreviewUrl} alt="Preview of image to be uploaded." />
            );
        }

        return (
            <div className="uploadFormContainer">
                {imagePreview} 
                <h3 className="statusMessage">{this.state.message}</h3>
                <form id="imageSelectionForm" onSubmit={this.handleSubmit}>
                    <div>
                        <label>Image Selection:</label>
                    </div>
                    <div>
                        <input type='file'
                            name='image'
                            accept='.png,.jpeg,.jpg, image/jpeg,image/png'
                            ref={el => this.imageSelection = el}
                            onChange={(e) => this.handleImageChange(e)}
                        />
                    </div> 
                    <button type="submit">Submit</button>
                </form>
            </div>
        )
    }
};
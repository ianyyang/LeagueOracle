// Modules & Libraries
import React, { Component } from 'react';
import axios from 'axios';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            maxSize: 5000000,
            validTypes: ['image/png', 'image/jpeg', 'image/jpg'],
            selectedFile: null,
            loaded: 0
        }
    }

    // Check if the upload follows proper file size limits
    checkFileSize = (event) => {
        let files = event.target.files
        let err = ''

        for (let x = 0; x < files.length; x++) {
            if (files[x].size > this.state.maxSize) {
                err += files[x].type + ' is too large!\n'
            }
        };

        if (err !== '') {
            event.target.value = null
            console.log(err)
            return false
        }

        return true;
    }

    // Check if the upload follows proper file types
    checkFileType = (event) => {
        let files = event.target.files
        let err = ''

        for (let x = 0; x < files.length; x++) {
            if (this.state.validTypes.every(type => files[x].type !== type)) {
                err += files[x].type + ' is not a supported format!\n';
            }
        };

        if (err !== '') {
            event.target.value = null
            console.log(err)
            return false;
        }

        return true;
    }

    // onChange handler for choosing files
    chooseFileOnChangeHandler = (event) => {
        var files = event.target.files

        if (this.checkFileSize(event) && this.checkFileType(event)) {
            this.setState({
                selectedFile: files[0]
            })
        }
    }

    // onClick handler for upload file button
    uploadFileOnClickHandler = (event) => {
        const data = new FormData()
        data.append('file', this.state.selectedFile)
        axios.post("http://localhost:5000/upload", data)
            .then(res => { console.log(res.statusText) })
    }

    render() {
        return (
            <div>
                <form action="#" method="POST" enctype="multipart/form-data">
                    <input type="file" name="file" onChange={this.chooseFileOnChangeHandler} />
                    <button type="button" onClick={this.uploadFileOnClickHandler}>Upload</button>
                </form>
            </div>
        )
    }
}

export default App;

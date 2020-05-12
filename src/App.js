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
            <div className="container">
                <div className="row">
                    <div className="col-md-6">
                        <form method="post" action="#" id="#">
                            <div className="form-group files">
                                <label>Upload Your File </label>
                                <br />
                                <input type="file" name="file" onChange={this.chooseFileOnChangeHandler} />
                                <br />
                                <button type="button" className="btn btn-success btn-block" onClick={this.uploadFileOnClickHandler}>
                                    Upload
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default App;

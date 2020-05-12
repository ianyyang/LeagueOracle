// Modules & Libraries
import React, { Component } from 'react';
import axios from 'axios';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedFile: null,
            loaded: 0
        }
    }

    chooseFileOnChangeHandler = (event) => {
        console.log(event.target.files[0])
        this.setState({
            selectedFile: event.target.files[0],
            loaded: 0,
        })
    }

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

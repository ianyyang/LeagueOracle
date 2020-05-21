// Imports
import React, {Component} from 'react';
import axios from 'axios';

// CSS
import './../styles/css/uploads.css';

class Uploads extends Component {
    constructor(props) {
        super(props);
        this.state = {
            maxSize: 5000000,
            validTypes: ['image/png', 'image/jpeg', 'image/jpg'],
            selectedFile: null,
            data: '',
            team: [],
            image: [],
        };
    }

    // Check if the upload follows proper file size limits
    checkFileSize(event) {
        const files = event.target.files;
        let err = '';

        for (let x = 0; x < files.length; x++) {
            if (files[x].size > this.state.maxSize) {
                err += files[x].type + ' is too large!\n';
            }
        };

        if (err !== '') {
            event.target.value = null;
            console.log(err);
            return false;
        }

        return true;
    }

    // Check if the upload follows proper file types
    checkFileType(event) {
        const files = event.target.files;
        let err = '';

        for (let x = 0; x < files.length; x++) {
            if (this.state.validTypes.every((type) => files[x].type !== type)) {
                err += files[x].type + ' is not a supported format!\n';
            }
        };

        if (err !== '') {
            event.target.value = null;
            console.log(err);
            return false;
        }

        return true;
    }

    // onChange handler for choosing files
    chooseFileOnChangeHandler(event) {
        const files = event.target.files;

        if (this.checkFileSize(event) && this.checkFileType(event)) {
            this.setState({
                selectedFile: files[0],
            });
        }
    }

    // onClick handler for upload file button
    uploadFileOnClickHandler() {
        if (this.state.selectedFile) {
            const data = new FormData();
            data.append('file', this.state.selectedFile);
            axios.post('http://localhost:5000/upload', data)
                .then((res) => {
                    this.setState({
                        data: res.data,
                    }, () => {
                        axios.get('http://localhost:5000/teams/' + this.state.data[0])
                            .then((res) => {
                                this.setState({team: res.data});
                            });
                        axios.get('http://localhost:5000/images/' + this.state.data[1])
                            .then((res) => {
                                this.setState({image: res.data});
                            });
                    });
                });
        }
    }

    conditionalRender() {
        if (this.state.data === '' || this.state.team.length === 0) {
            return (
                <div>
                    <form action="#" method="POST" encType="multipart/form-data">
                        <input type="file" className="fileUpload" onChange={this.chooseFileOnChangeHandler} />
                        <br />
                        <button type="button" onClick={this.uploadFileOnClickHandler}>Upload</button>
                    </form>
                </div>
            );
        } else {
            const userTeam = this.state.team.userTeam.map((userPlayer) =>
                <div key={userPlayer.id} className="userPlayer">
                    <li>{userPlayer[1]} ({userPlayer[0]})</li>
                </div>,
            );

            const oppTeam = this.state.team.oppTeam.map((oppPlayer) =>
                <div key={oppPlayer.id} className="oppPlayer">
                    <li>{oppPlayer[1]} ({oppPlayer[0]})</li>
                </div>,
            );

            return (
                <div className="userTeam oppTeam">
                    <ul>
                        Your Team:
                        <ul>{userTeam}</ul>

                        Enemy Team:
                        <ul>{oppTeam}</ul>
                    </ul>
                </div>
            );
        }
    }

    render() {
        return (
            <div className="uploads">
                {this.conditionalRender()}
            </div>
        );
    }
}

export default Uploads;

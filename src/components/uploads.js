// Imports
import React, { Component } from 'react';
import axios from 'axios';

// CSS
import './../styles/css/uploads.css';

// Material UI
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

class Uploads extends Component {
    constructor(props) {
        super(props);
        this.state = {
            maxSize: 5000000,
            validTypes: ['image/png', 'image/jpeg', 'image/jpg'],
            data: '',
            team: [],
            image: [],
        };
    }

    // Check if the upload follows proper file size limits
    checkFileSize = (event) => {
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
    checkFileType = (event) => {
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

    // onChange handler for upload
    uploadOnChangeHandler = (event) => {
        const files = event.target.files;

        if (this.checkFileSize(event) && this.checkFileType(event)) {
            const data = new FormData();
            data.append('file', files[0]);
            axios.post('http://localhost:5000/upload', data)
                .then((res) => {
                    this.setState({
                        data: res.data,
                    }, () => {
                        axios.get('http://localhost:5000/teams/' + this.state.data[0])
                            .then((res) => {
                                this.setState({ team: res.data });
                            });
                        axios.get('http://localhost:5000/images/' + this.state.data[1])
                            .then((res) => {
                                this.setState({ image: res.data });
                            });
                    });
                });
        }
    }

    conditionalRender = () => {
        if (this.state.data === '' || this.state.team.length === 0) {
            return (
                <div className="header">
                    <div className="title">
                        <Box display="flex" justifyContent="center" m={1} p={1}>
                            <h1>League Oracle</h1>
                        </Box>
                    </div>
                    <div className="upload">
                        <Box display="flex" justifyContent="center" m={1} p={1}>
                            <form action="#" method="POST" encType="multipart/form-data">
                                <Button size="large" variant="contained" color="secondary" disableElevation component="label">
                                    Upload Image
                                    <input type="file" accept="image/*" style={{ display: "none" }} onChange={this.uploadOnChangeHandler} />
                                </Button>
                            </form>
                        </Box>
                    </div>
                </div>
            );
        } else {
            const userTeam = this.state.team.userTeam.map((userPlayer) =>
                <div className="user-player">
                    <li>{userPlayer[1]} ({userPlayer[0]})</li>
                </div>,
            );

            const oppTeam = this.state.team.oppTeam.map((oppPlayer) =>
                <div className="opp-player">
                    <li>{oppPlayer[1]} ({oppPlayer[0]})</li>
                </div>,
            );

            return (
                <div className="user-team opp-team">
                    <Box display="flex" justifyContent="center" m={1} p={1}>
                        <Box p={1} bgcolor="grey.400">
                            <ul>{userTeam}</ul>
                        </Box>

                        <Box p={1} bgcolor="grey.400">
                            <ul>{oppTeam}</ul>
                        </Box>
                    </Box>
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

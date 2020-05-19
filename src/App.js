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
            data: '',
            teams: [],
            images: [],
            // team: [],
            image: [],
            team: { "_id": "5ec3525163343b031e258ae3", "imgName": "1589858861794 - All Unflipped (1920 x 1080).png", "userTeam": [["Riven", "peerin"], ["Skarner", "malaise //zzz"], ["Steel Legion Garen", "KeyLimePies 12Yrs"], ["Sona", "PrinceTiff"], ["Pyke", "GioGio Reference 3ES"]], "oppTeam": [["Snow Day Graves", "poro want up up MLGB("], ["Ahri", "rAjAnsel"], ["Veigar", "CHNmissplaying"], ["SSG Xayah", "Fzz"], ["Fiddlesticks", "Camille Lily"]], "createdAt": "2020-05-19T03:28:17.041Z", "updatedAt": "2020-05-19T03:28:17.041Z", "__v": 0 }
        }
    }

    // Fetch all team and image data
    componentWillMount = () => {
        if ((this.state.teams.length + this.state.images.length) === 0) {
            axios.get("http://localhost:5000/teams")
                .then(res => { this.setState({ teams: res.data }) })
            axios.get("http://localhost:5000/images")
                .then(res => { this.setState({ images: res.data }) })
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
    uploadFileOnClickHandler = () => {
        if (this.state.selectedFile) {
            const data = new FormData()
            data.append('file', this.state.selectedFile)
            axios.post("http://localhost:5000/upload", data)
                .then(res => {
                    this.setState({
                        data: res.data
                    }, () => {
                        axios.get("http://localhost:5000/teams/" + this.state.data[0])
                            .then(res => { this.setState({ team: res.data }) })
                        axios.get("http://localhost:5000/images/" + this.state.data[1])
                            .then(res => { this.setState({ image: res.data }) })
                    })
                })
        }
    }

    // Display all teams
    displayAllTeams = () => {
        const allTeams = this.state.teams.map((team) => {
            const userTeam = team.userTeam.map((userPlayer) =>
                <div className="userPlayer">
                    <li>{userPlayer[1]} ({userPlayer[0]})</li>
                </div>
            )

            const oppTeam = team.oppTeam.map((oppPlayer) =>
                <div className="oppPlayer">
                    <li>{oppPlayer[1]} ({oppPlayer[0]})</li>
                </div>
            )

            return (
                <div className="userTeam oppTeam">
                    Game
                    <ul>
                        Your Team:
                        <ul>{userTeam}</ul>

                        Enemy Team:
                        <ul>{oppTeam}</ul>
                    </ul>
                </div>
            )
        })

        return (
            <div className="allTeams">
                {allTeams}
            </div>
        )
    }

    conditionalRender = () => {
        if (this.state.data === '' || this.state.team.length === 0) {
            return (
                <div>
                    <form action="#" method="POST" enctype="multipart/form-data">
                        <input type="file" name="file" onChange={this.chooseFileOnChangeHandler} />
                        <br />
                        <button type="button" onClick={this.uploadFileOnClickHandler}>Upload</button>
                    </form>

                    Previous History:
                    { this.displayAllTeams()}
                </div>
            )
        } else {
            const userTeam = this.state.team.userTeam.map((userPlayer) =>
                <div className="userPlayer">
                    <li>{userPlayer[1]} ({userPlayer[0]})</li>
                </div>
            )

            const oppTeam = this.state.team.oppTeam.map((oppPlayer) =>
                <div className="oppPlayer">
                    <li>{oppPlayer[1]} ({oppPlayer[0]})</li>
                </div>
            )

            return (
                <div className="userTeam oppTeam">
                    <ul>
                        Your Team:
                        <ul>{userTeam}</ul>

                        Enemy Team:
                        <ul>{oppTeam}</ul>
                    </ul>
                </div>
            )
        }
    }

    render() {
        return (
            <div>
                {this.conditionalRender()}
            </div>
        )
    }
}

export default App;

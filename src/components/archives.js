// Imports
import React, {Component} from 'react';
import axios from 'axios';

// CSS
import './../styles/css/archives.css';

// Material UI
import Box from '@material-ui/core/Box';

class Archives extends Component {
    constructor(props) {
        super(props);
        this.state = {
            teams: [],
            images: [],
        };
    }

    // Fetch all team and image data
    componentDidMount() {
        if ((this.state.teams.length + this.state.images.length) === 0) {
            axios.get('http://localhost:5000/teams')
                .then((res) => {
                    this.setState({teams: res.data});
                });
            axios.get('http://localhost:5000/images')
                .then((res) => {
                    this.setState({images: res.data});
                });
        }
    }

    // Display all teams
    displayAllTeams() {
        const allTeams = this.state.teams.map((team) => {
            const userTeam = team.userTeam.map((userPlayer) =>
                <div className="user-player">
                    <li>{userPlayer[1]} ({userPlayer[0]})</li>
                </div>,
            );

            const oppTeam = team.oppTeam.map((oppPlayer) =>
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
        });

        return (
            <div className="all-teams" >
                {allTeams}
            </div>
        );
    }

    render() {
        return (
            <div className="archives">
                {this.displayAllTeams()}
            </div>
        );
    }
}

export default Archives;

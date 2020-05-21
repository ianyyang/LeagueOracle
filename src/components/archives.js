// Imports
import React, {Component} from 'react';
import axios from 'axios';

// CSS
import './../styles/css/archives.css';

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
                <div key={userPlayer.id} className="userPlayer">
                    <li>{userPlayer[1]} ({userPlayer[0]})</li>
                </div>,
            );

            const oppTeam = team.oppTeam.map((oppPlayer) =>
                <div key={oppPlayer.id} className="oppPlayer">
                    <li>{oppPlayer[1]} ({oppPlayer[0]})</li>
                </div>,
            );

            return (
                <div key={team.id} className="userTeam oppTeam">
                    Game
                    <ul>
                        Your Team:
                        <ul>{userTeam}</ul>

                            Enemy Team:
                        <ul>{oppTeam}</ul>
                    </ul>
                </div>
            );
        });

        return (
            <div className="allTeams">
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

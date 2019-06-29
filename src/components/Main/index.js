import requestPromise from "request-promise";
import React, { Component } from "react";

import Search from "./Search";
import Card from "./Card";
import styles from "./styles";

const localhostServer = 'http://localhost:3008';

class Main extends Component {
    constructor(props){
        super(props);
        this.state = {
            players: [],
            teams: [],
        };
        this.loadData();
    }
    
    loadData = async () => {
        var playersOptions = {
            uri: `${localhostServer}/players`,
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true
        };
        const playersPromise = requestPromise(playersOptions)
        
        var teamsOptions = {
            uri: `${localhostServer}/teams`,
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true
        };
        const teamsPromise = requestPromise(teamsOptions)
        try {
            const players = await playersPromise;
            const teams = await teamsPromise;
            console.log({
                teams,
                players
            })
            this.setState({
                teams,
                players
            })
        } catch (e){
            console.log(e);
        }
    }

    render() {
        return (
            <div style={{ ...styles.container, ...this.props.style }}>
                <div style={styles.title}>NBA Interview</div>
                <Search style={styles.search} />
                {
                    this.state.players.map((player, index)=>
                        <Card
                            key = {index}
                            name={player.name}
                            image={`${localhostServer}/${player.image}`} 
                            team={this.state.teams.find(team=>team.id === player.team).name} 
                        />
                    )
                }
            </div>
        );
    }
}

export default Main;

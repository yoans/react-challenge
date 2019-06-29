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
            players: []
        };
        this.loadData();
    }
    
    loadData = async () => {
        var options = {
            uri: `${localhostServer}/players`,
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true
        };
        const players = await requestPromise(options)
            .catch(function (err) {
                console.log({err});
            });
        this.setState({players})
    }

    render() {
        return (
            <div style={{ ...styles.container, ...this.props.style }}>
                <div style={styles.title}>NBA Interview</div>
                <Search style={styles.search} />
                {
                    this.state.players.map((player)=>
                        <Card
                            name={player.name}
                            image={`${localhostServer}/${player.image}`} 
                            team={player.team} 
                        />
                    )
                }
            </div>
        );
    }
}

export default Main;

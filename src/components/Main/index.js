import requestPromise from "request-promise";
import React, { Component } from "react";

import Search from "./Search";
import Card from "./Card";
import styles from "./styles";

const localhostServer = 'http://localhost:3008';

class Main extends Component {
    constructor(props){
        super(props);
        const page = 1;
        this.state = {
            players: [],
            teams: [],
            page,
        };
        this.loadData(page);
    }
    setLastPage = (lastPage) => {
        this.setState({lastPage});
    }

    loadData = async (page) => {
        var playersOptions = {
            uri: `${localhostServer}/players`,
            qs: {
                _page: `${page}`,
            },
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true,
            transform: (body, response, resolveWithFullResponse) => {
                const lastPage = response.headers.link.split(',').pop().match(/.*_page=(.*)>;.*/)[1]
                this.setLastPage(lastPage)
                return body;
            }
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
            this.setState({
                teams,
                players
            })
        } catch (e){
            console.log(e);
        }
    }
    prevPage = () =>{
        const page = this.state.page - 1 <=0 ? 1 : this.state.page - 1;
        
        this.loadData(page);
        this.setState({
            page
        })
    }
    nextPage = () =>{
        const page = this.state.page + 1 >= this.state.lastPage ? this.state.lastPage : this.state.page + 1;
        this.loadData(page);
        this.setState({
            page
        })
    }

    render() {
        return (
            <div style={{ ...styles.container, ...this.props.style }}>
                <div style={styles.title}>NBA Interview</div>
                <Search style={styles.search} />
                <button onClick={this.prevPage}>Previous Page</button>
                <button  onClick={this.nextPage}>Next Page</button>
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

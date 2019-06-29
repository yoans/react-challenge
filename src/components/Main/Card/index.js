import React, { Component } from "react";
import requestPromise from "request-promise";

import styles from "./styles";

const localhostServer = 'http://localhost:3008';

class Card extends Component {
    constructor(props){
        super(props);
        this.state = {
            editing:false,
            newPlayer: Object.assign({}, props.player),
        }
    }
    componentDidUpdate(prevProps, prevState){
        if (this.props.player !== prevProps.player) {
            this.setState({newPlayer: {...this.props.player}});
          }
    }
    cancel = () =>{
        this.setState({
            newPlayer:this.props.player,
            editing:!this.state.editing
        })
    }
    saveChanges = async () =>{
        this.setState({
            editing:!this.state.editing
        })
        var savePlayerOptions = {
            method: 'PATCH',
            uri: `${localhostServer}/players/${this.props.player.id}`,
            qs: {
            },
            body: {
                ...this.state.newPlayer
            },
            headers: {
                'User-Agent': 'Request-Promise',
                'Content-Type': 'application/json'
            },
            json: true,
        };
        const playersPromise = requestPromise(savePlayerOptions)
        
        try {
            const players = await playersPromise;
            this.setState({
                players
            })
        } catch (e){
            console.log(e);
        }
        this.props.reLoad();
    }
    toggleEditing = () =>{
        const wasEditing = this.state.editing;
        this.setState({editing:!this.state.editing})
        if(wasEditing){
            this.saveChanges();
        }
    }
    updateNewPlayer=(property)=>(e)=>{
        this.setState({newPlayer:{
            ...this.state.newPlayer,
            [property]: e.target.value,
        }})
    }
    render(){
        const {
            style,
            player,
        } = this.props;
        const {
            name,
            team,
            image,
        } = player;
        return (
            <div style={{ ...styles.container, ...style }}>
                <button onClick={this.toggleEditing}>{this.state.editing?'Save':'Edit'}</button>
                <div style = {{
                    ...(this.state.editing?{}:{display:'none'})
                    }}
                >
                    <button onClick={this.cancel}>Cancel</button>
                </div>
                <div style = {{
                    ...(this.state.editing?{}:{display:'none'})
                    }}
                >
                    {
                        ['image','name','position'].map((property)=>
                            <input
                                type='text'
                                onChange={this.updateNewPlayer(property)}
                                value={this.state.newPlayer[property]}
                            />
                        )
                    }
                </div>
                <div style={styles.name}>{name}</div>
                <img src={`${localhostServer}/${image}`} style={styles.playerImage} alt="player_image" />

                <div>{this.props.teams.find(aTeam=>aTeam.id === team).name}</div>
            </div>
        );
    }
};

export default Card;

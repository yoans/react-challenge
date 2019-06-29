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
            favorited: props.favorites.find((aFav)=>aFav===props.player.id),
        }
    }
    componentDidUpdate(prevProps, prevState){
        if (this.props.player !== prevProps.player) {
            this.cancel();
        }
        if (this.props.favorites !== prevProps.favorites) {
            this.setState({
                favorited: this.props.favorites.find((aFav)=>aFav.id===this.props.player.id),
            })
        }
    }
    cancel = () =>{
        this.setState({
            newPlayer:{...this.props.player},
            editing:false,
        })
    }
    saveChanges = async () =>{
        this.setState({
            editing:false
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
    saveFavorite = async () =>{
        this.setState({
            editing:false
        })
        var saveFavoriteOptions = {
            method: 'POST',
            uri: `${localhostServer}/favorites`,
            qs: {
            },
            body: {
                id: this.props.player.id
            },
            headers: {
                'User-Agent': 'Request-Promise',
                'Content-Type': 'application/json'
            },
            json: true,
        };
        const favoritePromise = requestPromise(saveFavoriteOptions)
        
        try {
            await favoritePromise;
        } catch (e){
            console.log(e);
        }
    }
    removeFavorite = async () =>{
        this.setState({
            editing:false
        })
        var saveFavoriteOptions = {
            method: 'DELETE',
            uri: `${localhostServer}/favorites/${this.props.player.id}`,
            headers: {
                'User-Agent': 'Request-Promise',
                'Content-Type': 'application/json'
            },
        };
        const favoritePromise = requestPromise(saveFavoriteOptions)
        
        try {
            await favoritePromise;
        } catch (e){
            console.log(e);
        }
    }
    toggleEditing = () =>{
        const wasEditing = this.state.editing;
        this.setState({editing:!this.state.editing})
        if(wasEditing){
            this.saveChanges();
        }
    }
    togglefavorited = () =>{
        const wasFavorited= this.state.favorited;
        this.setState({favorited:!this.state.favorited})
        if(wasFavorited){
            this.removeFavorite()
            this.props.removeFromFavorites(this.props.player);
        }else{
            this.saveFavorite();
            this.props.addToFavorites(this.props.player);
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
                        
                <div style = {{
                        ...(this.props.mini?{display:'none'}:{})
                        }}
                >
                    <button onClick={this.togglefavorited}>{this.state.favorited?'Remove From Favorites':'Add To Favorites'}</button>
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
                            ['image','name','position'].map((property,index)=>
                                <input
                                    key={index}
                                    type='text'
                                    onChange={this.updateNewPlayer(property)}
                                    value={this.state.newPlayer[property]}
                                />
                            )
                        }
                        <select
                            value={this.state.newPlayer.team}
                            onChange={this.updateNewPlayer('team')}
                        >
                            {this.props.teams.map((aTeam,index)=>
                                <option
                                    key={index}
                                    value={aTeam.id}
                                >
                                    {aTeam.name}
                                </option>
                            )}
                        </select>
                    </div>
                </div>
                <div style={styles.name}>{name}</div>
                <img
                    src={`${localhostServer}/${image}`}
                    style={{
                        ...styles.playerImage,
                        ...(this.props.mini?{
                            height:'25px',
                            padding: '0'
                        }:{})
                    }}
                    alt="player_image"
                />

                <div>{this.props.teams.find(aTeam=>aTeam.id === team).name}</div>
            </div>
        );
    }
};

export default Card;

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
        const searchText = '';
        this.state = {
            players: [],
            teams: [],
            page,
            searchText,
            favorites:[],
            showFavorites:false,
        };
        this.loadData(page,searchText);
        this.loadFavorites();
    }
    setLastPage = (lastPage) => {
        this.setState({lastPage});
    }

    loadData = async (page, searchText) => {
        var playersOptions = {
            uri: `${localhostServer}/players`,
            qs: {
                _page: page,
                q: searchText,
            },
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true,
            transform: (body, response, resolveWithFullResponse) => {
                if(response.headers.link){
                    const lastPage = response.headers.link.split(',').pop().match(/.*_page=([0-9]*).*/)[1]
                    this.setLastPage(lastPage)
                }else{
                    this.setLastPage(1)
                }
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
                teams:[...teams],
                players:[...players]
            })
        } catch (e){
            console.log(e);
        }
    }
    
    loadFavorites = async () => {
        var favoritesOptions = {
            uri: `${localhostServer}/favorites`,
            qs: {
            },
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true,
        };
        const favoritesPromise = requestPromise(favoritesOptions)
        
        try {
            const favorites = await favoritesPromise;
            this.setState({
                favorites:[...favorites]
            })
        } catch (e){
            console.log(e);
        }
    }
    prevPage = () =>{
        const page = this.state.page - 1 <=0 ? 1 : this.state.page - 1;
        this.loadData(page, this.state.searchText);
        this.setState({
            page
        })
    }
    nextPage = () =>{
        const page = this.state.page + 1 >= this.state.lastPage ? this.state.lastPage : this.state.page + 1;
        this.loadData(page, this.state.searchText);
        this.setState({
            page
        })
    }

    loadDataOnSearch = (searchText) => {
        const page = 1;
        this.loadData(page, searchText);
        this.setState({
            page,
            searchText
        })
    }
    addToFavorites = (player)=>{
        this.setState({favorites: [...this.state.favorites,{id:player.id}]})
    }
    removeFromFavorites = (player)=>{
        this.setState({favorites: [...this.state.favorites].filter((aFavId)=>aFavId.id !== player.id)})
    }
    render() {
        return (
            <>
            <div style={
                {
                    ...styles.container,
                    ...this.props.style,
                    ...(this.state.showFavorites?{display:'none'}:{})
                }
            }>
                <div style={styles.title}>NBA Interview</div>
                <button onClick={()=>{this.setState({showFavorites:true})}}># of Favorites:{this.state.favorites.length}</button>
                <Search
                    loadDataOnSearch={this.loadDataOnSearch}
                    style={styles.search}
                />
                <button onClick={this.prevPage}>Previous Page</button>
                <button onClick={this.nextPage}>Next Page</button>
                {
                    this.state.players.map((player, index)=>
                        <Card
                            key = {index}
                            player={player}
                            teams={this.state.teams}
                            favorites={this.state.favorites}
                            reLoad={()=>{this.loadData(this.state.page, this.state.searchText)}}
                            addToFavorites={this.addToFavorites}
                            removeFromFavorites={this.removeFromFavorites}
                        />
                    )
                }
            </div>
            <div
                style = {{
                    position:'absolute',
                    top:'0',
                    width:'100%',
                    height:'100%',
                    zIndex:'10',
                    backgroundColor:'white',
                    ...(this.state.showFavorites?{}:{display:'none'})
                }}
            >
                <button onClick={()=>{this.setState({showFavorites:false})}}>back</button>
                {
                    this.state.players.map((player, index)=>
                        <Card
                            key = {index}
                            mini = {true}
                            player={player}
                            teams={this.state.teams}
                            favorites={this.state.favorites}
                            reLoad={()=>{this.loadData(this.state.page, this.state.searchText)}}
                            addToFavorites={this.addToFavorites}
                            removeFromFavorites={this.removeFromFavorites}
                        />
                    )
                }
            </div>
            </>
        );
    }
}

export default Main;

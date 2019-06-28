import React, { Component } from "react";
import Search from "./Search";
import Card from "./Card";
import styles from "./styles";

class Main extends Component {
    render() {
        return (
            <div style={{ ...styles.container, ...this.props.style }}>
                <div style={styles.title}>NBA Interview</div>
                <Search style={styles.search} />
                <Card />
            </div>
        );
    }
}

export default Main;

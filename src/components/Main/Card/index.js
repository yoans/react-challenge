import React from "react";
import styles from "./styles";

const Card = props => {
    const {
        style,
        name,
        image,
        team,
    } = props;
    return (
        <div style={{ ...styles.container, ...style }}>
            <div style={styles.name}>{name}</div>
            <img src={image} style={styles.playerImage} alt="player_image" />

            <div>{team}</div>
        </div>
    );
};

export default Card;

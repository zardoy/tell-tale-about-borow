import React from "react";
import classes from "./styles.module.scss";

interface Props {
    startGameCallback: () => unknown;
}

let MainMenu: React.FC<Props> = ({ startGameCallback }) => {
    return <div
        className={classes["home-screen"]}
    >
        <h1 className={classes["app-title"]}>{process.env.REACT_APP_NAME}</h1>
        <div className={classes["menu"]}>
            <div className={classes["title"]}>Main Menu</div>
            <div className={classes["item"] + " " + classes["blink-animation"]} onClick={startGameCallback}>Start the game</div>
            <div className={classes["item"]} onClick={startGameCallback}>Start the game</div>
            <div className={classes["item"]} onClick={startGameCallback}>Start the game</div>
        </div>
    </div>;
};

export default MainMenu;
import { makeStyles } from "@material-ui/core";
import React from "react";

interface Props {
}

const useStyles = makeStyles({
    outer: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "black",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },
    title: {
        textAlign: "center",
        color: "lime",
        margin: 10
    }
});

let EndScreen: React.FC<Props> = () => {
    const classes = useStyles();

    return <div className={classes.outer}>
        <h1 className={classes.title}>Thank You For Playing!</h1>
    </div>;
};

export default EndScreen;
import React, { useCallback, useState } from "react";

import classNames from "classnames";

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
    root: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `url("/background.gif") no-repeat bottom right/contain fixed black`,
        overflow: "hidden",
        padding: `30px 20px`,
        fontSize: `1.1em`,
    },
    appTitle: {
        fontSize: "2.5em",
        fontStyle: "italic",
        fontWeight: 900,
        fontFamily: "Arial, Helvetica, sans-serif",
        textTransform: "uppercase",
        textShadow: `0 0 8px currentColor`,
    },

    menuRoot: {
        margin: `20px 20px`,
        padding: `8px 25px`,
        borderLeft: `1px solid darkgray`,
        overflow: "auto",
        fontStyle: "italic",
        fontWeight: "bold"
    },
    menuTitle: {
        marginBottom: 15,
        fontSize: "1.6em",
        textShadow: `0 0 10px currentColor`,
    },
    menuButton: {
        fontSize: "2em",
        cursor: "pointer",
        transition: ".05s all",
        padding: "3px",
        fontFamily: "Arial, Helvetica, sans-serif",
        "&:hover": {
            paddingLeft: "8px"
        },
        "&::before": {
            content: '">"',
            paddingRight: "6px",
            verticalAlign: "middle",
            color: "lime",
            fontFamily: "'Courier New', Courier, monospace",
            fontSize: ".8em"
        }
    },
    menuFirstButton: {
        animation: "blink 2s infinite"
    }
});

interface Props {
    startGameCallback: () => unknown,
    volume: number;
}

const DO_NOT_DISPLAY_WARNING = "doNotDisplayWarning";

let MainMenu: React.FC<Props> = ({ startGameCallback, volume }) => {
    const classes = useStyles();

    // STATE
    const [showWarning, setShowWarning] = useState(!localStorage.getItem(DO_NOT_DISPLAY_WARNING));

    // CALLBACKS
    const closeWarningHanlder = useCallback(() => {
        localStorage.setItem(DO_NOT_DISPLAY_WARNING, "yes");
        setShowWarning(false);
    }, []);

    return <div className={classes.root}>
        {
            showWarning && <Dialog open={true} disableBackdropClick={true}>
                <DialogTitle>Hey!</DialogTitle>
                <DialogContent>
                    A lot of Russian swearing. Headphones recommended.
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={closeWarningHanlder}>OKAY</Button>
                </DialogActions>
            </Dialog>
        }
        <h1 className={classes.appTitle}>{process.env.REACT_APP_NAME}</h1>
        <div className={classes.menuRoot}>
            <div className={classes.menuTitle}>Main Menu</div>
            {
                new Array(3).fill(null).map((_, index) => {
                    return <div
                        key={index}
                        className={classNames({
                            [classes.menuButton]: true,
                            [classes.menuFirstButton]: index === 0
                        })}
                        onClick={startGameCallback}
                    >Start The Game</div>;
                })
            }
            <a className={classes.menuButton} href={process.env.REACT_APP_GITHUB_LINK}>View on GitHub</a>
        </div>
    </div>;
};

export default MainMenu;

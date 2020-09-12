import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@material-ui/core";
import React, { useCallback, useEffect, useRef, useState } from "react";
import classes from "./styles.module.scss";

interface Props {
    startGameCallback: () => unknown,
    volume: number;
}

const DO_NOT_DISPLAY_WARNING = "doNotDisplayWarning";

let MainMenu: React.FC<Props> = ({ startGameCallback, volume }) => {
    //REFS
    const audioElRef = useRef(null as null | HTMLAudioElement);

    //STATE
    const [showWarning, setShowWarning] = useState(!localStorage.getItem(DO_NOT_DISPLAY_WARNING));

    //CALLBACKS
    const closeWarningHanlder = useCallback(() => {
        localStorage.setItem(DO_NOT_DISPLAY_WARNING, "yes");
        setShowWarning(false);
    }, []);

    //EFFECTS
    useEffect(() => {
        if (showWarning) return;
        const { current: audioEl } = audioElRef;
        if (!audioEl) throw new TypeError("can't set audio to background audio");
        audioEl.volume = volume;
        audioEl.oncanplay = () => audioEl.play();
    }, [showWarning, volume]);

    return <div
        className={classes["home-screen"]}
    >
        {
            showWarning ? <Dialog open={true} disableBackdropClick={true}>
                <DialogTitle>Hey!</DialogTitle>
                <DialogContent>
                    Возможен мат, лучше играть с наушниками.
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={closeWarningHanlder}>Поехали!</Button>
                </DialogActions>
            </Dialog> :
                <audio src={"/MainMenuLoop.mp3"} autoPlay loop ref={audioElRef} />
        }
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
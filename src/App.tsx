import { CssBaseline } from "@material-ui/core";
import React, { useCallback, useState } from "react";
import EpisodePlayer from "./components/episode-player";
import EndScreen from "./components/EndScreen";
import MainMenu from "./components/main-menu";

interface Props {
}

let App: React.FC<Props> = () => {
    //STATE
    const [currentScreen, setCurrentScreen] = useState("home" as "home" | "player" | "end");

    //CALLBACKS
    const startGameCallback = useCallback(() => {
        setCurrentScreen("player");
    }, []);
    const onGameEndCallback = useCallback(() => {
        setCurrentScreen("end");
    }, []);

    return <>
        <CssBaseline />
        <MainMenu startGameCallback={startGameCallback} />
        {
            currentScreen === "home" ? <MainMenu startGameCallback={startGameCallback} /> :
                currentScreen === "end" ? <EndScreen /> :
                    currentScreen === "player" ? <EpisodePlayer onGameEnded={onGameEndCallback} /> :
                        null
        }
    </>;
};

export default App;
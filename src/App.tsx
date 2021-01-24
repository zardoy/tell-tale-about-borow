import React, { useCallback, useMemo, useState } from "react";

import { createMuiTheme, CssBaseline, Grid, makeStyles, Slider, ThemeProvider } from "@material-ui/core";
import { VolumeUp as VolumeUpIcon } from "@material-ui/icons";

import EndScreen from "./components/EndScreen";
import EpisodePlayer from "./components/EpisodePlayer";
import MainMenu from "./components/MainMenu";

interface Props {
}

const useStyles = makeStyles({
    volumeSlider: {
        position: "fixed",
        bottom: 5,
        left: 5,
        zIndex: 5
    }
});

let App: React.FC<Props> = () => {
    const classes = useStyles();

    // STATE
    const [currentScreen, setCurrentScreen] = useState("home" as "home" | "player" | "end");
    const [appVolume, setAppVolume] = useState(0.7);

    // MUI-THEME
    const muiTheme = useMemo(() => {
        return createMuiTheme({
            palette: {
                type: "dark"
            }
        });
    }, []);

    // CALLBACKS
    const startGameCallback = useCallback(() => {
        setCurrentScreen("player");
    }, []);
    const onGameEndCallback = useCallback(() => {
        setCurrentScreen("end");
    }, []);

    const volumeChangeHandler = useCallback((_, val: number) => setAppVolume(val), []);

    return <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <Grid container className={classes.volumeSlider}>
            <Grid item>
                <VolumeUpIcon />
            </Grid>
            <Grid item style={{ width: 200, marginLeft: 5 }}>
                <Slider color="secondary" max={1} step={0.05} value={appVolume} onChange={volumeChangeHandler as any} />
            </Grid>
        </Grid>
        {
            currentScreen === "home" ? <MainMenu startGameCallback={startGameCallback} volume={appVolume} /> :
                currentScreen === "end" ? <EndScreen /> :
                    currentScreen === "player" ? <EpisodePlayer onGameEnded={onGameEndCallback} volume={appVolume} /> :
                        null
        }
    </ThemeProvider>;
};

export default App;
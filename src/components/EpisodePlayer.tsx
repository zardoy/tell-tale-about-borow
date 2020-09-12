import React, { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { Button, makeStyles, Typography } from "@material-ui/core";
import episodesSchema from "../episodes-schema";

interface Props {
    onGameEnded: () => unknown;
    volume: number;
}

const fixedContent = {
    position: "fixed",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
};

const useStyles = makeStyles({
    outer: {
        ...fixedContent as any,
        background: "black"
    },
    player: {
        ...fixedContent as any,
        width: "100%",
        height: "100%",
        overflow: "hidden"
    },
    desicionsMenu: {
        ...fixedContent as any,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        height: "100vh",
        zIndex: 15
    },
    pausedText: {
        zIndex: 10,
        background: "rgba(0, 0, 0, 50%)"
    },
    pausedOuter: {
        ...fixedContent as any,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
    },
    desicionItem: {
        width: 300
    }
});

interface State {
    episode: number,
    scene: number,
    videoSrc: string,
    decisionsMenu: null | {
        text: string,
        callback: () => unknown;
    }[];
}

type Action = {
    type: "nextScene" | "nextEpisode" | "resetState";
} | {
    type: "setVideoIdToPlay",
    payload: string;
} | {
    type: "setDecisionsMenu",
    payload: State["decisionsMenu"];
};

const getVideoSrc = (videoId: string): string => `https://drive.google.com/uc?export=download&id=${videoId}`;
const reducer = (state: State, action: Action): State => {

    switch (action.type) {
        case "resetState":
            return { episode: 0, scene: 0, videoSrc: getVideoSrc(episodesSchema[0].scenes[0].videoId!), decisionsMenu: null };
        case "nextScene":
            return { ...state, scene: state.scene + 1 };
        case "nextEpisode":
            return { ...state, episode: state.episode + 1, scene: 0 };
        case "setVideoIdToPlay":
            return { ...state, decisionsMenu: null, videoSrc: getVideoSrc(action.payload) };
        case "setDecisionsMenu":
            return { ...state, decisionsMenu: action.payload };
        default:
            //todo never
            return state;
    }
};

let EpisodePlayer: React.FC<Props> = ({ onGameEnded, volume }) => {
    const classes = useStyles();

    //STATE
    const [videoPaused, setVideoPaused] = useState(false);
    const [state, dispatch] = useReducer(reducer, {
        episode: 0, scene: 0, videoSrc: getVideoSrc(episodesSchema[0].scenes[0].videoId!), decisionsMenu: null
    });

    //REF
    const videoElRef = useRef(null as null | HTMLVideoElement);

    // //CALBACKS
    const onVideoEndHandler = useCallback(() => {
        let { episode, scene } = state;
        const episodeScenes = episodesSchema[state.episode].scenes;
        if (scene + 1 >= episodeScenes.length) {
            // if episode has ended
            if (episode + 1 >= episodesSchema.length) {
                // if all episodes has ended
                onGameEnded();
                return;
            } else {
                dispatch({
                    type: "nextEpisode"
                });
                episode += 1;
                scene = 0;
                //CRINGEEEEE
            }
        } else {
            dispatch({
                type: "nextScene"
            });
            scene += 1;
        }

        const { makeChoice, videoId } = episodesSchema[episode].scenes[scene];


        if (makeChoice) {
            dispatch({
                type: "setDecisionsMenu",
                payload:
                    makeChoice.map(({ text, videoId }) => ({
                        text: text,
                        callback: () => {
                            dispatch({
                                type: "setVideoIdToPlay",
                                payload: videoId
                            });
                            videoElRef.current!.play();
                        }
                    })
                    )
            });
        } else if (videoId) {
            dispatch({
                type: "setVideoIdToPlay",
                payload: videoId
            });
        }
    }, [state, onGameEnded]);

    const onVideoClickHandler = useCallback(() => {
        const { current: videoEl } = videoElRef;
        if (!videoEl || videoEl.ended) return;
        videoEl.paused ? videoEl.play() : videoEl.pause();
    }, []);
    const onVideoDoubleClickHandler = useCallback(() => {
        try {
            if (!document.fullscreenEnabled) throw new Error("fullscreen isn't enabled");
            if (document.fullscreenElement === null) document.documentElement.requestFullscreen();
            else document.exitFullscreen();
        } catch (err) {
            console.error(err);
        }
    }, []);

    //EFFECTS
    useEffect(() => {
        const keyboardListener = (e: KeyboardEvent) => {
            const { current: videoEl } = videoElRef;
            if (!videoEl || videoEl.ended) return;

            if (e.code.toLowerCase() === "space") {
                videoEl.paused ? videoEl.play() : videoEl.pause();
            }
        };

        const { current: videoEl } = videoElRef;
        if (!videoEl) throw new TypeError("video is not defined");
        videoEl.onpause = () => !videoEl.ended && setVideoPaused(true);
        videoEl.onplay = () => setVideoPaused(false);

        window.addEventListener("keydown", keyboardListener);
        document.onfullscreenerror = () => { };

        return () => {
            window.removeEventListener("keydown", keyboardListener);
            document.onfullscreenerror = null;
        };
    }, []);
    useEffect(() => {
        const { current: videoEl } = videoElRef;
        if (!videoEl || videoEl.ended) return;
        videoEl.volume = volume;
    }, [volume]);

    return <div className={classes.outer} onClick={onVideoClickHandler} onDoubleClick={onVideoDoubleClickHandler}>
        <video autoPlay className={classes.player} src={state.videoSrc} onEnded={onVideoEndHandler} ref={videoElRef} />
        {
            videoPaused && <div className={classes.pausedOuter}>
                <Typography variant="h2" component="h2" className={classes.pausedText}>PAUSED</Typography>
            </div>
        }
        {
            state.decisionsMenu &&
            <div className={classes.desicionsMenu}>
                {
                    state.decisionsMenu.map(({ text, callback }) => (
                        <Button
                            key={text}
                            onClick={(e) => {
                                e.stopPropagation();
                                callback();
                            }}
                            size="large"
                            color="default"
                            variant="contained"
                            className={classes.desicionItem}
                        >{text}</Button>
                    ))
                }
            </div>
        }
    </div>;
};

export default EpisodePlayer;
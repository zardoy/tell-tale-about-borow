import React, { useCallback, useEffect, useReducer, useRef } from "react";
import { Button, makeStyles } from "@material-ui/core";
import episodesSchema from "./episodes-schema";

interface Props {
    onGameEnded: () => unknown;
}

const useStyles = makeStyles({
    outer: {
        position: "fixed",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        background: "black"
    },
    actionsMenu: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column"
    },
    player: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden"
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

let EpisodePlayer: React.FC<Props> = ({ onGameEnded }) => {
    const classes = useStyles();

    //STATE
    const [state, dispatch] = useReducer(reducer, {
        episode: 0, scene: 0, videoSrc: getVideoSrc(episodesSchema[0].scenes[0].videoId!), decisionsMenu: null
    });

    //REF
    const videoElRef = useRef(null as null | HTMLVideoElement);

    // //CALBACKS
    const onVideoEndHandler = useCallback(() => {
        const episodeScenes = episodesSchema[state.episode].scenes;
        let newEpisodeScene: [number, number];
        if (state.scene + 1 >= episodeScenes.length) {
            // if episode has ended
            if (state.episode + 1 >= episodesSchema.length) {
                // if all episodes has ended
                onGameEnded();
                return;
            } else {
                dispatch({
                    type: "nextEpisode"
                });
            }
        } else {
            dispatch({
                type: "nextScene"
            });
        }

        const { makeChoice, videoId } = episodesSchema[newEpisodeScene![0]].scenes[newEpisodeScene![1]];


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

    //EFFECTS
    useEffect(() => {
        const keyboardListener = (e: KeyboardEvent) => {
            const { current: videoEl } = videoElRef;
            if (!videoEl || videoEl.ended) return;

            if (e.code.toLowerCase() === "space") {
                videoEl.paused ? videoEl.play() : videoEl.pause();
            }
        };

        window.addEventListener("keydown", keyboardListener);

        return () => {
            window.removeEventListener("keydown", keyboardListener);
        };
    }, []);

    return <div className={classes.outer}>
        <video className={classes.player} src={state.videoSrc} onEnded={onVideoEndHandler} ref={videoElRef} onClick={onVideoClickHandler} />
        {/* <h1>PAUSED</h1> */}
        {
            state.decisionsMenu &&
            <div className={classes.actionsMenu}>
                {
                    state.decisionsMenu.map(({ text, callback }) => (
                        <Button onClick={callback} size="large" color="primary">{text}</Button>
                    ))
                }
            </div>
        }
    </div>;
};

export default EpisodePlayer;
type EpisodeScene = {
    file?: string;
    makeChoice?: {
        text: string,
        file: string;
    }[];
}[];

export default [
    {
        title: "Начало. Домашнее пробуждение.",
        scenes: [
            {
                file: "1/1.mp4",
                videoId: "12ttDGSpxdWF7zsqadB3hPTlUp9-v6Z56"
            },
            {
                makeChoice: [
                    {
                        text: "Сесть за комп",
                        file: "1/2-1.mp4",
                        videoId: "1KDjB_VI-A3PckKOOGe51GwLnvrIBVjpU"
                    },
                    {
                        text: "Включить телек",
                        file: "1/2-2.mp4",
                        videoId: "1ykOceSFoXxxUErTN3SSv4ySuqAlFBDeh"
                    },
                    {
                        text: "Закинуться еще",
                        file: "1/2-3.mp4",
                        videoId: "1k0Ux3aZpbhABMADvSpF3clfRgImVOC6M"
                    }
                ]
            }
        ]
    },
    {
        title: "Развитие. Возвращение на улицу.",
        scenes: [
            {
                file: "2/1.mp4",
                videoId: "1mFqU6zoJjdha-eLc62NYNXOEMoYAigmi"
            },
            {
                makeChoice: [
                    {
                        text: "Пойти пешком по лестнице",
                        file: "2/2-1.mp4",
                        videoId: "1MkSoCWs3I3s5B-h2-0TTmj8XZ4eg6Vqd"
                    },
                    {
                        text: "Поехать на лифте",
                        file: "2/2-2.mp4",
                        videoId: "1LlqTPu-hYR3gTsfd7wnYOC-_Two7xF69"
                    }
                ]
            },
            {
                file: "2/3.mp4",
                videoId: "1uoLSsAjybgWtpIDNNIEFK0KCnl4W806F"
            },
            {
                makeChoice: [
                    {
                        text: "Лада",
                        file: "2/4.mp4",
                        videoId: "1cv5uIEr-M0QiPd2Zwx1SEj8AKpXEiCRv"
                    },
                    {
                        text: "Ауди",
                        file: "2/4.mp4",
                        videoId: "1cv5uIEr-M0QiPd2Zwx1SEj8AKpXEiCRv"
                    }
                ]
            }
        ]
    }
];
export type bangMapAppElements = {
    // Buttons
    Button: {
        loadSongButton:HTMLButtonElement,
        gamePlayButton:HTMLElement,
        showInfoButton:HTMLElement,
        closeInfoButton:HTMLElement,
        showPrefButton:HTMLElement,
        savePrefButton:HTMLElement,
        closePrefButton:HTMLElement,
    },
    // TextBoxes
    TextBox: {
    songIdTextBox:HTMLInputElement,
    },
    // Filter Controls
    Filter: {
        allRadio:HTMLInputElement,
        dlRadio:HTMLInputElement,
        historyRadio:HTMLInputElement,
        favoriteRadio:HTMLInputElement,
        bandCombo:HTMLInputElement
    },
    // SongList Fragments
    Fragment: {
        songList_all: HTMLElement,
        songList_dl: HTMLElement,
        songList_history: HTMLElement,
        songList_favorite: HTMLElement,
    },
    // Panels
    Panel:{
        panel_preference: HTMLElement,
        panel_info: HTMLElement
    },
    // Containers
    Container:{
        songInfo: {
            body: HTMLElement,
            childlen: {
                Title: HTMLElement,
                BandName: HTMLElement,
                DifficultySelection: {
                    Easy: HTMLInputElement,
                    Normal: HTMLInputElement,
                    Hard: HTMLInputElement,
                    Expert: HTMLInputElement,
                    Special: HTMLInputElement
                },
                Levels: {
                    Easy: HTMLElement,
                    Normal: HTMLElement,
                    Hard: HTMLElement,
                    Expert: HTMLElement,
                    Special: HTMLElement
                },
                Notes: {
                    Easy: HTMLElement,
                    Normal: HTMLElement,
                    Hard:HTMLElement,
                    Expert:HTMLElement,
                    Special:HTMLElement
                },
                SpecialLabel: HTMLElement
            }
        }
    },
    MainCanvas: HTMLElement
};

export function initBangmapAppElements():bangMapAppElements {
    return {
        Button:{
            loadSongButton: document.getElementById("load_song") as HTMLButtonElement,
            gamePlayButton: document.getElementById("game_play"),
            showInfoButton: document.getElementById("show_information"),
            closeInfoButton: document.getElementById("close_infoPanel_button"),
            showPrefButton: document.getElementById("show_preference_panel"),
            savePrefButton: document.getElementById("preference_save"),
            closePrefButton: document.getElementById("close_preference_button"),
        },
        TextBox:{
            songIdTextBox: document.getElementById("song_id") as HTMLInputElement,
        },
        Filter: {
            allRadio: document.getElementById("filter_all") as HTMLInputElement,
            dlRadio: document.getElementById("filter_dl") as HTMLInputElement,
            historyRadio: document.getElementById("filter_history") as HTMLInputElement,
            favoriteRadio: document.getElementById("filter_favorite") as HTMLInputElement,
            bandCombo: document.getElementById("filter_band") as HTMLInputElement,
        },
        Fragment:{
            songList_all: document.getElementById("songlist_all"),
            songList_dl: document.getElementById("songlist_dl"),
            songList_history: document.getElementById("songlist_history"),
            songList_favorite: document.getElementById("songlist_favorite"),
        },
        Panel:{
            panel_preference: document.getElementById("preference"),
            panel_info: document.getElementById("info_panel"),
        },
        Container:{
            songInfo: {
                body: document.getElementById("setting_songInfo"),
                childlen: {
                    Title: document.getElementById("song_name"),
                    BandName: document.getElementById("song_band"),
                    DifficultySelection: {
                        Easy: document.getElementById("song_diff_select_easy") as HTMLInputElement,
                        Normal: document.getElementById("song_diff_select_normal") as HTMLInputElement,
                        Hard: document.getElementById("song_diff_select_hard") as HTMLInputElement,
                        Expert: document.getElementById("song_diff_select_expert") as HTMLInputElement,
                        Special: document.getElementById("song_diff_select_special") as HTMLInputElement
                    },
                    Levels: {
                        Easy: document.getElementById("song_level_easy"),
                        Normal: document.getElementById("song_level_normal"),
                        Hard: document.getElementById("song_level_hard"),
                        Expert: document.getElementById("song_level_expert"),
                        Special: document.getElementById("song_level_special")
                    },
                    Notes: {
                        Easy: document.getElementById("song_notes_easy"),
                        Normal: document.getElementById("song_notes_normal"),
                        Hard: document.getElementById("song_notes_hard"),
                        Expert: document.getElementById("song_notes_expert"),
                        Special: document.getElementById("song_notes_special")
                    },
                    SpecialLabel: document.getElementById("song_level_special_title")
                }
            }
        },
        MainCanvas: document.getElementById("app_game")
    };
}
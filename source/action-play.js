var icon = "Play";

var playButtons = document.getElementsByClassName("player-controls__btn deco-player-controls__button player-controls__btn_play");
var isPlayingNow = document.getElementsByClassName("player-controls__btn deco-player-controls__button player-controls__btn_play player-controls__btn_pause").length > 0;

if (playButtons.length != 0) {
    playButtons[playButtons.length - 1].click();
}

if (!isPlayingNow) {
    icon = "Pause";
}

icon;

var icon = "Play";

var playButtons = document.getElementsByClassName("player-controls__btn deco-player-controls__button player-controls__btn_play");

var isPlaying = isPlayingNow();
var needAdditionalClick = !isPlaying;
var additionalClickPerformed = false;

if (!isPlaying) {
    icon = "Pause";
}

if (playButtons.length != 0) {
    click();
}

function click() {
    console.log("click(). isPlayingNow:" + isPlayingNow() + " needAdditionalClick:" + needAdditionalClick);
    playButtons[playButtons.length - 1].click();

    if (needAdditionalClick && !additionalClickPerformed) {
        setTimeout(clickAgain, 150);
    }
}

function clickAgain() {
    console.log("clickAgain(). isPlayingNow:" + isPlayingNow() + " needAdditionalClick:" + needAdditionalClick + " clickedAgain:" + additionalClickPerformed);
    if (!isPlayingNow()) {
        console.log("clickAgain(). clicked again");
        additionalClickPerformed = true;
        click();
    }
}

function isPlayingNow() {
    return document.getElementsByClassName("player-controls__btn deco-player-controls__button player-controls__btn_play player-controls__btn_pause").length > 0;
}

icon;

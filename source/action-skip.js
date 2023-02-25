function performSkip(type) {
    var buttons = document.getElementsByClassName("player-controls__btn deco-player-controls__button player-controls__btn_" + type);
    if (buttons.length) {
        buttons[0].click();
    }
}

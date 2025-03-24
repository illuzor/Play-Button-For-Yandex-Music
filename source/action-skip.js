function performSkip(type) {
    let button = null;
    let buttons = null;

    // New design
    const controlButtons = document.querySelectorAll("button.BaseSonataControlsDesktop_sonataButton__GbwFt");
    if (controlButtons.length >= 3) {
        if (type === "prev") {
            button = controlButtons[0];
        } else if (type === "next") {
            button = controlButtons[2];
        }
    }

    // Old design
    if (!button) {
        buttons = document.getElementsByClassName("player-controls__btn deco-player-controls__button player-controls__btn_" + type);
        if (buttons.length) {
            button = buttons[0];
        }
    }

    if (button) {
        button.click();
    }
}

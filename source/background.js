const URL = "https://music.yandex.ru";

const ACTION_PLAY = "play";
const ACTION_FORWARD = "forward";
const ACTION_BACK = "back";

var ymTab;
var playFromMediaKey;
var action = "";

chrome.browserAction.onClicked.addListener(buttonClick);
chrome.commands.onCommand.addListener(mediaButtonPress);

function buttonClick() {
    action = ACTION_PLAY;
    playFromMediaKey = false;
    gotoGetWindows();
}

function mediaButtonPress(command) {
    switch (command) {
        case "play-pause":
            playButtonPress();
            break;
        case "jump-forward":
            skipButtonPress(ACTION_FORWARD);
            break;
        case "jump-back":
            skipButtonPress(ACTION_BACK);
            break;
    }
}

function playButtonPress() {
    chrome.storage.sync.get({ play_enabled: true },
        function (items) {
            if (items.play_enabled) {
                action = ACTION_PLAY;
                playFromMediaKey = true;
                gotoGetWindows();
            }
        });
}

function skipButtonPress(skipDirection) {
    chrome.storage.sync.get({ skip_enabled: true },
        function (items) {
            if (items.skip_enabled) {
                action = skipDirection;
                gotoGetWindows();
            }
        });
}

function gotoGetWindows() {
    ymTab = null;
    chrome.windows.getAll({ populate: true }, getWindows);
}

function getWindows(windows) {
    var ymTabs = [];
    for (var i = 0; i < windows.length; i++) {
        for (var j = 0; j < windows[i].tabs.length; j++) {
            if (windows[i].tabs[j].url.includes(URL))
                ymTabs.push(windows[i].tabs[j]);
        }
    }

    if (ymTabs.length) {
        ymTab = ymTabs[0];
        performAction();
    } else {
        if (action == ACTION_PLAY && !playFromMediaKey)
            openNewTab();
    }
}

function performAction() {
    switch (action) {
        case ACTION_PLAY:
            chrome.storage.sync.get({ play: "first" }, function (items) {
                chrome.tabs.executeScript(ymTab.id, { code: 'var play = "' + items.play + '";' }, function () {
                    chrome.tabs.executeScript(ymTab.id, { file: "action-play.js" }, playPause);
                });
            });
            break;
        case ACTION_FORWARD:
            skip("next");
            break;
        case ACTION_BACK:
            skip("prev");
            break;
    }
}

function openNewTab() {
    chrome.browserAction.setIcon({ path: "images/Play.png" });
    chrome.browserAction.setTitle({ title: chrome.i18n.getMessage("Play") });
    chrome.storage.sync.get({ page: "default" }, function (items) {
        if (items.page != "none") {
            chrome.storage.sync.get({ pin_tab: false }, function (items) {
                chrome.tabs.create({ url: URL, pinned: items.pin_tab });
            });
        }
    });
}

function skip(type) {
    chrome.tabs.executeScript(ymTab.id, { code: 'var type = "' + type + '";' },
        function () {
            chrome.tabs.executeScript(ymTab.id, { file: "action-skip.js" });
        });
}

function playPause(icon) {
    chrome.browserAction.setIcon({ path: "images/" + icon + ".png" });
    chrome.browserAction.setTitle({ title: chrome.i18n.getMessage(icon.toString()) });
}

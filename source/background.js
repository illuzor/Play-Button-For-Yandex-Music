const URL = "https://music.yandex.ru";

const ACTION_PLAY = "play";
const ACTION_FORWARD = "forward";
const ACTION_BACK = "back";

var ymTab;
var playFromMediaKey;
var action = "";

chrome.action.onClicked.addListener(buttonClick);
chrome.commands.onCommand.addListener(mediaButtonPress);

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        chrome.action.setIcon({path: "images/" + request.state + ".png"});
        chrome.action.setTitle({title: chrome.i18n.getMessage(request.state)});
    }
);

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
    chrome.storage.sync.get({play_enabled: true},
        function (items) {
            if (items.play_enabled) {
                action = ACTION_PLAY;
                playFromMediaKey = true;
                gotoGetWindows();
            }
        });
}

function skipButtonPress(skipDirection) {
    chrome.storage.sync.get({skip_enabled: true},
        function (items) {
            if (items.skip_enabled) {
                action = skipDirection;
                gotoGetWindows();
            }
        });
}

function gotoGetWindows() {
    ymTab = null;
    chrome.windows.getAll({populate: true}, getWindows);
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
            play()
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
    chrome.action.setIcon({path: "images/Play.png"});
    chrome.action.setTitle({title: chrome.i18n.getMessage("Play")});
    chrome.storage.sync.get({page: "default"}, function (items) {
        if (items.page != "none") {
            chrome.storage.sync.get({pin_tab: false}, function (items) {
                chrome.tabs.create({url: URL, pinned: items.pin_tab});
            });
        }
    });
}

function play() {
    chrome.scripting.executeScript({
        target: {tabId: ymTab.id},
        files: ["action-play.js"]
    })
}

function skip(type) {
    chrome.scripting.executeScript({target: {tabId: ymTab.id}, files: ["action-skip.js"]}, () => {
        chrome.scripting.executeScript({
            target: {tabId: ymTab.id},
            args: [type],
            func: (...args) => performSkip(...args),
        })
    });
}

function playPause(state) {
    chrome.action.setIcon({path: "images/" + state + ".png"});
    chrome.action.setTitle({title: chrome.i18n.getMessage(state.toString())});
}

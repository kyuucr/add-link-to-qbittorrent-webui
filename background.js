// Create root context menu item
browser.contextMenus.create({
    id: "add-link-to-qbt",
    title: browser.i18n.getMessage("contextItemTitle"),
    icons: {
        "16": browser.extension.getURL("icons/qbittorrent-tray.svg")
    },
    contexts: ["link"]
});

var options = {};

browser.storage.local.get().then(results => {
    options = results;
    if (!options.qbtUrl) {
        browser.tabs.create({ url: browser.extension.getURL("options.html"), active: true });
        createNotification(browser.i18n.getMessage("errorNoQbtURL"));
    }
});

browser.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "local") {
        for (var key in changes) {
            options[key] = changes[key].newValue;
        }
    }
});

var createNotification = function (message) {
    browser.notifications.create("add-link-to-qbt-notif", {
        type: "basic",
        iconUrl: browser.extension.getURL("icons/qbittorrent-tray.svg"),
        title: browser.i18n.getMessage("notificationTitle"),
        message: message
    });
};

var doPost = function (url, tabUrl) {
    console.log("Do post url: " + url + "; qbtUrl: " + options.qbtUrl + "; tabUrl: " + tabUrl);

    if (url.match(/^https?:\/\/|magnet:|bt:\/\/bc\//)) {
        browser.cookies.getAll({url: tabUrl}).then(cookies => {
            var cookiesStr = "";
            for (var cookie of cookies) {
                cookiesStr += cookie.name + "=" + cookie.value + ";";
            }

            var formData = new FormData();

            // Populate FormData
            formData.append("urls", url);
            formData.append("cookie", cookiesStr);
            if (options.savepath)           { formData.append("savepath", options.savepath); }
            if (options.category)           { formData.append("category", options.category); }
            if (options.skipChecking)       { formData.append("skip_checking", options.skipChecking); }
            if (options.paused)             { formData.append("paused", options.paused); }
            if (options.rootFolder)         { formData.append("root_folder", options.rootFolder); }
            if (options.rename)             { formData.append("rename", options.rename); }
            if (options.upLimit)            { formData.append("upLimit", options.upLimit); }
            if (options.dlLimit)            { formData.append("dlLimit", options.dlLimit); }
            if (options.sequentialDownload) { formData.append("sequentialDownload", options.sequentialDownload); }
            if (options.firstLastPiecePrio) { formData.append("firstLastPiecePrio", options.firstLastPiecePrio); }

            var req = new XMLHttpRequest();
            req.open("post", options.qbtUrl + (options.qbtUrl.match(/[^\/]$/) ? "/" : "") + "command/download");
            req.withCredentials = true;
            req.addEventListener("load", function() {
                console.log(req.status, req.statusText);
                createNotification(req.responseText ? req.responseText : req.status === 403 ? browser.i18n.getMessage("errorCookieExpired") : (req.status + " " + req.statusText));
                if (!req.responseText && req.status === 403) {
                    browser.tabs.create({ url: options.qbtUrl, active: true });
                }
            });
            req.addEventListener("error", function() {
                console.log("XMLHttpRequest error occured");
                createNotification(browser.i18n.getMessage("errorXHR"));
            });
            req.send(formData);
        });
    } else {
        console.log("URL not supported!");
        createNotification(browser.i18n.getMessage("errorNotSupported"));
    }
};

// On context menu item clicked
browser.contextMenus.onClicked.addListener((info, tab) => {
    console.log("Add " + info.linkUrl + " now");

    // Check if qbtUrl set
    if (!options.qbtUrl) {
        browser.tabs.create({ url: browser.extension.getURL("options.html"), active: true });
        createNotification(browser.i18n.getMessage("errorNoQbtURL"));
    } else {
        // Check for cookie
        browser.cookies.get({ name: "SID", url: options.qbtUrl.replace(/:[0-9]+\/?$/, "") }).then((cookie) => {
            if (cookie !== null && cookie.value) {
                doPost(info.linkUrl, tab.url);
            } else {
                // No cookie, open page
                console.log("Cannot find cookie, opening web ui..." );
                createNotification(browser.i18n.getMessage("errorNoCookie"));
                browser.tabs.create({ url: options.qbtUrl, active: true });
            }
        });
    }
});

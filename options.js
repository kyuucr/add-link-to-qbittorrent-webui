function saveOptions(e) {
  e.preventDefault();
  var formData = new FormData(document.querySelector("form"));
  var optionData = {};
  for (const entry of formData) {
    optionData[entry[0]] = entry[1];
  }
  browser.storage.local.set(optionData);
}

function restoreOptions() {

  function setCurrentChoice(result) {
    // Fix for FF < 52
    if (result.length > 0) {
      result = result[0];
    }

    // qbtUrl option
    for (const key in result) {
      switch (key) {
        case "skipChecking":
        case "paused":
        case "rootFolder":
        case "sequentialDownload":
        case "firstLastPiecePrio":
          document.querySelector("select[name=" + key + "]").value = result[key];
          break;
        default:
          document.querySelector("input[name=" + key + "]").value = result[key];
          break;
      }
    }
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  var getting = browser.storage.local.get();
  getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);

// ----------------- Internationalization ------------------
for (let node of document.querySelectorAll('[data-i18n]')) {
  let [text, attr] = node.dataset.i18n.split('|');
  text = chrome.i18n.getMessage(text);
  attr ? node[attr] = text : node.appendChild(document.createTextNode(text));
}
// ----------------- /Internationalization -----------------
const NEW_PROFILE_ID = "newProfileHopeNobodyUseThisName";
const DEFAULT_PROFILE_ID = "defaultProfileHopeNobodyUseThisName";

// Contains saved profile names except Default
var profiles = new Proxy([], {
  set: function(target, prop, value) {
    let profileBox = document.querySelector("#profile");

    // Filter out length property and duplicates
    if (prop !== "length" && profileBox.namedItem(value) === null){
      console.log("adding new profile: " + value);
      let opt = document.createElement("option");
      opt.id = value;
      opt.name = value;
      opt.value = value;
      opt.text = value;
      profileBox.add(opt, profileBox.length - 1);
    }
    return Reflect.set(...arguments);
  }
});

function saveOptions(e) {
  e.preventDefault();
  var formData = new FormData(document.querySelector("form"));
  var optionData = {};

  // Get profile
  let profile = formData.get("profile");
  let profileName = formData.get("profileName");
  let profileSuffix = "";
  if (profile === NEW_PROFILE_ID) {
    if (profileName === "" || profileName === NEW_PROFILE_ID || profileName === DEFAULT_PROFILE_ID) {
      return; // Kill it with fire
    }
    profileSuffix += "-" + profileName;   // Append '-'
  } else if (profile !== DEFAULT_PROFILE_ID) {
    profileSuffix += "-" + profile;
  }

  // Purge unused inputs
  formData.delete("profile");
  formData.delete("profileName");

  // Map FormData to option entry
  for (const entry of formData) {
    optionData[entry[0] + profileSuffix] = entry[1];
  }
  browser.storage.local.set(optionData).then(() => {
    if (profile === NEW_PROFILE_ID) {
      profiles.push(profileName);
      document.querySelector("#profile").value = profileName;
      // Somehow change event isn't fired
      document.querySelector("#profileName").style.display = "none";
    }
  });
}

function restoreOptions(profile) {

  function setCurrentChoice(result) {
    // Fix for FF < 52
    if (result.length > 0) {
      result = result[0];
    }

    // qbtUrl option
    for (const key in result) {
      let keyName, profileName;
      [ keyName, profileName ] = key.split("-");
      // Set only selected profile
      if (profile === profileName) {
        switch (keyName) {
          case "skipChecking":
          case "paused":
          case "rootFolder":
          case "sequentialDownload":
          case "firstLastPiecePrio":
            document.querySelector("select[name=" + keyName + "]").value = result[key];
            break;
          default:
            document.querySelector("input[name=" + keyName + "]").value = result[key];
            break;
        }
      }

      // Store new profile name
      if (profileName !== undefined && !profiles.includes(profileName)) {
        profiles.push(profileName);
      }
    }
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  var getting = browser.storage.local.get();
  getting.then(setCurrentChoice, onError);
}

// Proxy domLoaded to restoreOptions instead of supplying restoreOptions as callback directly,
// since we need the first parameter of restoreOptions
function domLoaded() {
  restoreOptions();
}

function clear() {
  for (let node of document.querySelectorAll("select:not([name=profile]),input:not([name=qbtUrl])")) {
    if (node.type == "number") {
      node.value = "0";
    } else {
      node.value = "";
    }
  }
}

// Reload input texts on profile box change
function profileChanged(event) {
  let profileName = document.querySelector("#profileName");
  // TODO: Enable siteRegex once implemented
  // let siteRegex = document.querySelector("#siteRegex");

  switch (event.target.value) {
    case NEW_PROFILE_ID:
      profileName.style.display = "inherit";
      // siteRegex.disabled = false;
      clear();
      break;
    case DEFAULT_PROFILE_ID:
      profileName.style.display = "none";
      // siteRegex.disabled = true;
      // siteRegex.value = "*";
      restoreOptions();
      break;
    default:
      profileName.style.display = "none";
      // siteRegex.disabled = false;
      restoreOptions(event.target.value);
      break;
  }
}

// We will delete profiles directly from this function instead as a callback of the proxy object, since:
// - Deleting array entry is complicated, set callback will also be fired
// - Deletion is one entry at a time
function deleteProfile() {
  let profile = document.querySelector("#profile");

  // Let's not delete defaults
  if (profile.value !== DEFAULT_PROFILE_ID && profile.value !== NEW_PROFILE_ID) {

    // They should implement get query with wildcard
    browser.storage.local.get().then(function(result) {
      let deleteKeys = [];

      // Get all profile's keys
      for (const key in result) {
        if (key.endsWith(profile.value)) {
          deleteKeys.push(key);
        }
      }

      // Delete and cleanup
      browser.storage.local.remove(deleteKeys).then(function() {
        profiles.splice(profiles.indexOf(profile.value), 1);
        profile.remove(profile.selectedIndex);
        profile.selectedIndex = 0;
        // Change event not fired
        restoreOptions();
      })
    });
  }
}

document.addEventListener("DOMContentLoaded", domLoaded);
document.querySelector("form").addEventListener("submit", saveOptions);
document.querySelector("#profile").addEventListener("change", profileChanged);
document.querySelector("#optionButtonDeleteProfile").addEventListener("click", deleteProfile);

// ----------------- Internationalization ------------------
for (let node of document.querySelectorAll('[data-i18n]')) {
  let [text, attr] = node.dataset.i18n.split('|');
  text = chrome.i18n.getMessage(text);
  attr ? node[attr] = text : node.appendChild(document.createTextNode(text));
}
// ----------------- /Internationalization -----------------
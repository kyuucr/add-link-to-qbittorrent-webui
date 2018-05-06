# Add Link to qBittorrent WebUI

Add torrent link directly to a local (or even public? haven't tested that yet)
qBittorrent WebUI from context menu. Supports HTTP, Magnet, and BitComet Tracker
links, and includes options from the WebUI API.

__Features:__
* Sending HTTP, Magnet, or BitComet Tracker links with full support of qBt WebUI's options
* Multiple profiles, each with its own option. You can even set different WebUI address!
* Regex matching for profile: Set regex string on a profile, and when using Default profile, Tab URL will be matched to the regex. If it's matched, the associated profile will be used instead of Default profile. Combine with hide profile option to automate link sending!

__Disclaimer:__ the author is not in any way affiliated with qBittorrent development
team.

__Another disclaimer:__ This extension needs to use third-party cookie setting for
authentication. The "Accept Third-Party Cookies" option must be set as "Always"
or "From visited". Setting it to "Never" will break the authentication process.
Please refer to https://support.mozilla.org/id/kb/disable-third-party-cookies
for instructions on how to modify the setting.

Firefox AMO link: https://addons.mozilla.org/en-US/firefox/addon/add-link-to-qbittorrent-webui/

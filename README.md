# Add Link to qBittorrent WebUI

Add torrent link directly to a local and public qBittorrent WebUI from context
menu. Supports HTTP, Magnet, and BitComet Tracker links, and includes options
from the WebUI API.

__Features:__
* Sending HTTP, Magnet, or BitComet Tracker links with full support of qBt WebUI's options
* Multiple profiles, each with its own option. You can even set different WebUI address!
* Regex matching for profile: Set regex string on a profile, and when using Default profile, Tab URL will be matched to the regex. If it's matched, the associated profile will be used instead of Default profile. Combine with hide profile option to automate link sending!
* Toolbar button to open the URL defined in the "Default" profile

__Disclaimer:__ the author is not in any way affiliated with qBittorrent development
team.

__Another disclaimer:__ This extension needs to use third-party cookie setting for
authentication. Setting the Content Blocking -> Custom -> Cookie to "All third-party
cookies" __will break the authentication process__.
Please refer to https://support.mozilla.org/id/kb/disable-third-party-cookies
for instructions on how to modify the setting.
Firefox may need to be restarted for the new setting to be applied.

__Contributors:__
* simonbcn

Firefox AMO link: https://addons.mozilla.org/en-US/firefox/addon/add-link-to-qbittorrent-webui/

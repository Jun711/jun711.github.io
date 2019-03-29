---
layout: single
header:
  teaser: /assets/images/2019-01-03-how-to-inspect-network-request-and-response-headers-on-safari/safari-logo-2018-11-11.jp2
title: "How to inspect request and response headers on Safari?"
date: 2019-01-03 12:00:00 -0800
categories: Web
tags:
  - Safari
  - Debug
---
Learn how to inspect request and response headers on Safari.

## Steps
### 1. Enable Developer Mode
On Safari, first, you have to enable Develop Menu.

1. Click Safari button on top left corner.
2. Open up Safari preferences. 
3. Select Advanced tab. 
4. Check 'Show Develop menu in menu bar'.

Please refer to the following image for the above listed steps.
![Show Develop Menu in Safari menu bar](/assets/images/2019-01-03-how-to-inspect-network-request-and-response-headers-on-safari/safari-turn-on-develop-menu-2018-11-11.png)

### 2. Open up Safari Web Inspector
You can open by Safari Web Inspector by selecting Develop menu and click `Show Web Inspector` button.

Please refer to the following image for the above listed steps.
![Open Safari Web Inspector](/assets/images/2019-01-03-how-to-inspect-network-request-and-response-headers-on-safari/safari-open-web-inspector-2018-11-11.png)

### 3. Open up Network tab
With web inspector opened, 
1. Navigate to Network tab and you can see the files requested over network. 
2. Select one of the requested items and go to its Headers item.
3. You can see the following image showing Summary, Request and Response sections.

Please refer to the following image for the above listed steps.
![Open Safari Web Inspector Network tab](/assets/images/2019-01-03-how-to-inspect-network-request-and-response-headers-on-safari/safari-web-inspector-network-2018-11-11.png)

### 4. Refresh the page 
1. Refresh the page by using the refresh button next to the address bar.
2. Network Request and Response Headers will be listed.

You can see network request and response headers similar to the image below.
![Safari Network Request Headers](/assets/images/2019-01-03-how-to-inspect-network-request-and-response-headers-on-safari/safari-network-request-and-response-headers-2018-11-11.png)

## Mac Shorcuts / Hotkeys
You would be more productive if you know the shorcuts to the above steps. When you are familiar with the shortcut keys, you can speed up and use your time on developing and solving problems.

Shortcuts or hotkeys to inspect network requests and responses on Safari:

| Actions | Shortcuts |
|---|:---|
| Open Safari Preference | Command + , |
| Show Web Inspector | Option + Command + i |
| Close Web Inspector | Option + Command + i |
| Show JavaScript Console | Option + Command + c |
| Show Page Source | Option + Command + u |
| Empty Caches | Option + Command + e |
| Open Safari Preference | Command + , |
| Refresh Page | Command + r |

With this, you can inspect your network requests and responses on Safari. 

{% include eof.md %}


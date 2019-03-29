---
layout: single
header:
  teaser: /assets/images/service-worker-2019-03-12.png
title: "How to force update a service worker on Chrome, Firefox and Safari?"
date: 2019-03-12 12:00:00 -0800
categories: Web
tags:
  - Service Worker
  - PWA
  - Chrome
  - Firefox
  - Safari
---
## Overview:
Learn how to force update or activate your updated service worker when it is in waiting state.

## Chrome
### 1. Open up Chrome DevTools 
Open up your website on Google Chrome. On your website, you can open up Google Chrome DevTools by right click and select Inspect from the drop-down menu.

You can also use the following shortcut.
Keyboard Shortcut:

| Action | Mac | Windows |
|---|---|:---|
| Open Console tab | Command + Option + J | Control + Shift + J |
| Open the last used DevTools tab| Command + Option + I | Control + Shift + I |

### 2. Go to Application Tab
When Chrome DevTools is open, select `Application` tab. Then, choose `Service Workers` item on Application panel.

### 3. Update and Skip Waiting
You will see an image like below if a service worker is installed for your website. 

![Chrome Service Worker Skip Waiting](/assets/images/chrome-service-worker-skip-waiting-2019-03-12.png)

1. Then, to the latest version of service worker, you click update. 
2. After new service worker installs, skipWaiting button will appear. 
3. You should click skipWaiting button to activate the new service worker.

> skipWaiting() makes the waiting service worker to the active service worker so that update takes effect.

### Note
If you are testing on your test server, you may not want to do this step every time you publish an update. Instead, to make the service worker to update automatically at page reload, you should check `Update on reload`. Then, page reload will update and activate the new service worker. 

![Chrome Service Worker Update on Reload](/assets/images/chrome-service-worker-update-on-reload-2019-03-12.png)

## Firefox
### 1. Open up Firefox Service Worker List
In the url bar, type in `about:serviceworkers` to display a list of service workers.

![Firefox Service Worker List](/assets/images/firefox-service-worker-list-2019-03-12.png)

### 2. Identify your Service Worker
Look for your service worker by searching for your website url.

### 3. Update Service Worker
Click Update button to get new updates.

To be certain about using the new service worker, you can unregister your website's service worker and reload your page.

## Safari
On Safari, as of version 12.1, you need to remove your website's service worker cache in order to force update the service worker. Future Safari version might provide this force update service worker function.

### 1. Open up Privacy Menu
1. Click Safari button on top left corner.
2. Open up Safari preferences. 
3. Select Privacy tab. 
4. Click Manage Website Data.

Please refer to the following image for the above listed steps.
![Safari Privacy Manage Website Data](/assets/images/safari-open-up-privacy-menu-2019-03-12.png)

### 2. Remove Cache from Website
1. On Manage Website Data menu, search for your website.
2. Click Remove to remove your website cache.

![Safari Privacy Manage Website Data](/assets/images/safari-privacy-remove-website-data-2019-03-12.png)


With this, you can activate the updated service worker of your progressive web app or website. 

{% include eof.md %}


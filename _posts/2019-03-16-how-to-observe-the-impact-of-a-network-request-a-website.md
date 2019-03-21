---
layout: single
header: 
  teaser: /assets/images/network-2019-03-16.jpg
title: "How to observe the impact of a network request on a website?"
date: 2019-03-16 20:00:00 -0800
categories: ['Web']
tags: ['Debug', 'Test']
---
## Overview:
You can block a network request on Google Chrome DevTools to see its effect on your web application or website.

## Purposes
It can help you answer the following questions:
1. Can your web app handle http 3XX, 4XX and 5XX responses from this requst url?
2. How much does this particular request affect the performance of your web application? 

## Steps
### 1. Google Chrome
Open up your web application on Google Chrome.

### 2. Open up Chrome DevTools
On your web page, you can open up Google Chrome DevTools by right click and select Inspect from the drop-down menu.

Keyboard Shortcut:  

| Action | Mac | Windows |
|---|---|:---|
| Open Console tab | Command + Option + J | Control + Shift + J |
| Open the last used DevTools tab| Command + Option + I | Control + Shift + I |


### 3. Navigate to Network Tab
You will see something similar like the image below:  

![Google Chrome DevTools Network tab](/assets/images/chrome-devtools-network-2019-03-16.jpg)

### 4. Refresh your Page
Without closing Network tab, you can click the refresh button next to address bar to refresh your page.

| Action | Mac | Windows |
|---|---|:---|
| Refresh Page | Command + R | Control + R |

You will then see all the network requests that your web application makes.
![Google Chrome DevTools Network Requests](/assets/images/chrome-devtools-network-requests-2019-03-16.png)

### 5. Block a Request of Interest
Look for the request(s) that you want to investigate. Then, right click and select `Block request url` or `Block request domain` that blocks a specific request url or all requests coming from that domain.

![Google Chrome DevTools Block Requests](/assets/images/chrome-devtools-block-requests-2019-03-16.png)

### 6. Enable Request Blocking
Notice that a new panel called Request Blocking will be opened. Check `Enable request blocking` to start using this function.

![Google Chrome DevTools Block Requests](/assets/images/chrome-devtools-enable-request-blocking-2019-03-16.png)

### 7. Refresh your Page
Similar to step 4, refresh your page. However, this time, this blocked request will be blocked by Chrome and cannot send any request to the intended server. 

The blocked request(s) will have red font and status as `(blocked:devtools)`.

![Google Chrome DevTools Request Blocked](/assets/images/chrome-devtools-request-blocked-2019-03-19.png)


With this, you can monitor how your web application behaves with and without a network request. 

{% include eof.md %}
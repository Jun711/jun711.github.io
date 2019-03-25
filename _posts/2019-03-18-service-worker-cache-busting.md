---
layout: single
header:
  teaser: /assets/images/service-worker-2019-03-12.png
title: "Service Worker Cache Busting"
date: 2019-03-18 12:00:00 -0800
categories: Web
tags:
  - Service Worker
  - PWA
---
## Overview:
Learn how to publish the latest version of your progressive web app.

Ever deploy a progressive web app(PWA) but found that it is still serving the old version? And, you might have to update service worker and / or clear cache manually to see the latest version of your website. 

In my case, I published a PWA with my service-worker.js file having cache life more than a day (It was a mistake). After that, when I republished my PWA with a major revamp, there was a web application version clash issue on browsers especially persistent on Firefox 66. Old and new versions just kept showing up alternatively when I refreshed my website.

Continue reading to see how to fix it.

## Solutions
There are multiple ways to solve it depending on which deployment stage your website is in.
### 1. Cache-control Header
If you haven't deployed your website, it would be best to set a cache-control header for your service-worker.js file. 

```
Cache-Control: no-cache,no-store,must-revalidate
```
#### htaccess example
If you are using an Apache server, you can use the following regex to set your Cache-Control rules for different file types. 

The first FilesMatch regex sets Cache-Control header of every file that doesn't start with sw and has the specified endpoint to be `max-age=31536000, public`.

The second FilesMatch regex sets Cache-Control header of sw.js file to be `no-cache, no-store, must-revalidate`, which prevents caching.

```bash
<IfModule mod_headers.c>
  <FilesMatch "^(?!sw).+\.(ico|jpg|jpeg|png|html|js|css)$">
    Header set Cache-Control "max-age=31536000, public"
  </FilesMatch>
  <FilesMatch "^(sw\.js)$">
    Header set Cache-Control "no-cache, no-store, must-revalidate"
  </FilesMatch>
  #...other rules
</IfModule>
```

Check out this [MDN Cache-Control doc](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control#Preventing_caching){:target="_blank"} for more information regarding Cache-Control header.

### 2. Delete Cache
If you have already deployed your app but forgot to set Cache-Control header of your service-worker.js file to be no cache, you can write code to clear your website's cache programmatically. Then, republish your website by setting Cache-Control header as no-cache.

You can include the following code to remove your cache upon app loads then, you can use local storage to remember that it has cleared cache so that it doesn't clear cache on every page refresh and is able to cache on subsequent loads. 

```javascript
function async deleteCaches() {
  try {
    const keys = await window.caches.keys();
    await Promise.all(keys.map(key => caches.delete(key)));
  } catch (err) {
    console.log('deleteCache err: ', err);
  }
}

// run this function on your app load
function resetCacheForUpdate() {
  if (!localStorage.getItem('cacheReset')) {
    deleteCaches()
      .then(_ => {
        localStorage.setItem('cacheReset', 'yes');
      }) 
  }
}
```
window.caches here refers to browsers' [CacheStorage](https://developer.mozilla.org/en-US/docs/Web/API/CacheStorage){:target="_blank"}. 

Note that caches.delete doesn't work if your website is opened up on incognito mode.

### 3. Clear-Site-Data Header
I don't recommend using this header unless the above 2 ways didn't work for you because this will clear caches on your users' browser every time. If you resort to use `Clear-Site-Data` Header, you should remove it after some time so that service worker caches your PWA again. 

[Clear-Site-Data header](https://w3c.github.io/webappsec-clear-site-data/#header){:target="_blank"} clears browsing data associated with your website. 

To do a service worker cache busting, we only need to clear cache unless you want to remove cookies and storage too (which is also doable via this header).

```
Clear-Site-Data: "cache", "cookies", "storage"
```
#### htaccess example
If you are using an Apache server, you can use the following snippet.

```bash
<IfModule mod_headers.c>
  Header set Clear-Site-Data: "cache"
  #...other rules
</IfModule>
```

With this, you can deploy the latest version of your progressive web app and it will appear on the next page load.

{% include eof.md %}
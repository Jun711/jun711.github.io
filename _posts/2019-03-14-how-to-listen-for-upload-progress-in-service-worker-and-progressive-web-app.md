---
layout: single
header:
  teaser: /assets/images/2019-03-14-how-to-listen-for-upload-progress-in-service-worker-and-progressive-web-app/client-server-interaction-ajax-xhr-fetch-2019-03-14.jpg
title: "How to listen for upload progress in a service worker scope - progressive web app(PWA)?"
date: 2019-03-14 12:00:00 -0800
categories: Web
tags:
  - Angular
  - Javascript
  - PWA
  - Service Worker
---
Since XMLHttpRequest(XHR) is not usable in a service worker scope and fetch API hasn't supported upload progress as of 2019 March, how to listen for upload progress when we use a service worker?

It is possible to listen for upload progress with a workaround.

## General Solution
Since fetch API hasn't supported upload progress, we have to keep using XHR to listen for upload progress. The question now is how to use XHR when we use a service worker to handle fetch events.

On [MDN document](https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent){:target="_blank"}, a fetch event is described as so:
> event type for fetch events dispatched on the service worker global scope. It contains information about the fetch, including the request and how the receiver will treat the response. It provides the event.respondWith() method, which allows us to provide a response to this fetch.

Thus, to keep using XHR for uploading, whenever there is a fetch event that matches your upload endpoint, the function should return and let upload happens outside of service worker scope instead of using event.respondWith.

You should have a similar function in your service worker file.
```javascript
self.addEventListener('fetch', event => {
  // SOLUTION: 
  // i) detect your upload endpoint 
  // ii) return so that you can use XHR
  if (event.request.url.indexOf('upload') !== -1) {
    return;
  }

  // Prevent the default, and handle the request ourselves.
  event.respondWith(async function() {
    // Try to get the response from a cache.
    const cachedResponse = await caches.match(event.request);
    // Return it if we found one.
    if (cachedResponse) return cachedResponse;
    // If we didn't find a match in the cache, use the network.
    return fetch(event.request);
  }());
});
```
This code snippet above is adopted from FetchEvent MDN document and I added the following to enable the use of XHR for upload progress.
```
if (event.request.url.indexOf('upload') !== -1) {
  return;
}
```
In short, we shouldn't use FetchEvent [respondWith](https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent/respondWith){:target="_blank"} to handle an upload request. Instead, we use XHR upload object to listen for upload progress.

## Angular
To enable upload progress for Angular PWA, we need to modify ngsw-worker.js file.

### Intro
Angular provides a [service worker implementation (ngsw)](https://angular.io/guide/service-worker-intro){:target="_blank"} that has service worker code written in `ngsw-worker.js` file. 

To open up this file:
1. you can look for it in your node_modules folder. The relative path from your project is `./node_modules/@angular/service-worker/ngsw-worker.js`. 
2. You can also run `ng build --prod` and this file will be added to your dist folder. The relative path would be `./dist/project-name/ngsw-worker.js`.

To keep using XHR for upload in your Angular project, follow the steps below for the modification that you need in your Angular project.
### 1. Make a copy of ngsw-worker.js
Instead of modifying the ngsw-worker.js file in node_modules, you should create a copy and modify this new file so that it can be checked in your source control so that everyone in the team doesn't have to modify their file in node_modules.

You can probably keep it in `src/app` folder or in the application root directory.

### 2. Modify ngsw-worker.js onFetch function
This onFetch function is the handler for fetch events in Angular service worker. You need to examine the request url and if it is your upload url, you terminate onFetch function execution so that XHR can be used. 

```javascript
// The handler for fetch events.
onFetch(event) {
  if (event.request.url.indexOf('upload') !== -1) {
      return;
  }
  ...
}
```

### 3. Replace ngsw-worker.js after ng build
From now on, you will have to replace the ngsw-worker.js file that is prepared in your dist folder when `ng build prod` command is run. 

You can write a simple shell script to replace this file after `ng build prod`. You can then save it as `replace-ngsw-worker.sh` and keep it in your project root directory.
```bash
#!/bin/bash
cp ./ngsw-worker.js ./dist/your-project-name/
```

I am not sure if you can use `ng build fileReplacement flag`. You can check it out if that is more convenient for you.

### 4. Modify npm build command
Open up package.json, add a new npm command or modify your build command.
For example, you can add `"build-prod": "ng build --prod && ./replace-ngsw-worker.sh"` to the scripts object in your package.json. Make sure the file path is correct.

Refer to this image below.
![package.json npm scripts](/assets/images/2019-03-14-how-to-listen-for-upload-progress-in-service-worker-and-progressive-web-app/npm-run-build-prod-2019-03-14.png)

Then, you can use `npm run build-prod` when you want to build your Angular project.

## XHR Upload Progress
You can use XHR upload's methods to listen for upload progress. Refer to this code snippet below for an idea of how to listen for XHR upload progresss.

You can also check out my [XHR upload progress article](https://jun711.github.io/web/how-to-listen-for-upload-progress-when-using-AJAX-XMLHttpRequest-XHR/){:target="_blank"} for a simple example.

```javascript
let xhr = new XMLHttpRequest();

xhr.upload.onloadstart = function() {
  console.log('Upload has started.');
};

xhr.upload.onprogress = function(event) {
  console.log(`${event.loaded} bytes uploaded.`);
};

xhr.upload.onload = function() {
  console.log('Upload completed successfully.');
};
```

## Fetch Upload Progress Listener Implementation (FetchObserver)
You can subscribe to [whatwg FetchObserver GitHub thread](https://github.com/whatwg/fetch/issues/607){:target="_blank"} and [World Wide Web Consortium w3c ServiceWorker GitHub thread](https://github.com/w3c/ServiceWorker/issues/1141){:target="_blank"} to get update for fetch upload progress(FetchObserver) implemention.

With this, you should be able to continue using XHR to listen for upload progress.

{% include eof.md %}
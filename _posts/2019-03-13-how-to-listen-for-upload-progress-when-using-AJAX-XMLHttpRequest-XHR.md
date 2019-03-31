---
layout: single
header:
  teaser: /assets/images/2019-03-13-how-to-listen-for-upload-progress-when-using-AJAX-XMLHttpRequest-XHR/client-server-interaction-ajax-xhr-fetch-2019-03-13.jpg
title: "How to listen for upload progress when using AJAX - XMLHttpRequest(XHR)?"
date: 2019-03-13 12:00:00 -0800
categories: Web
tags:
  - Javascript
---
## Overview:
Learn how to listen for upload progress when you use AJAX - XMLHttpRequest(XHR). 

## Introduction
XHR is a Web API that is built in with most if not all browsers that that enables website interaction with servers. If you have heard of AJAX but not XHR, AJAX(Asynchronous JavaScript and XML) is an acronym that describes (asynchronous) interaction between websites and servers which uses APIs such as XHR. 

When you upload files to your server, it is a good idea to show upload progress to your website users. This is especially true for larger files that can't finish uploading instantly.

## XHR - JavaScript
You can use browsers' XHR upload object to listen for upload progress using `onprogress` and `onload` methods.
```javascript
let xhr = new XMLHttpRequest();

xhr.upload.onloadstart = function() {
  console.log('Upload has started.');
};

xhr.upload.onprogress = function(event) {
  let uploadedBytes = event.loaded / event.total;
  console.log(`Uploaded ${uploadedBytes} bytes`);
};

xhr.upload.onload = function() {
  console.log('Upload completed successfully.');
};

xhr.upload.onerror = function() {
  console.log(`Error during the upload: ${xhr.status}.`);
};
```
### Example
This is a simple example using input element for file input and XHR to tranfer the file to your server. 
```html
<input type="file" onchange="upload(this.files[0])">

<script>
function upload(file) {
  let xhr = new XMLHttpRequest();

  // listen for upload progress
  xhr.upload.onprogress = function(event) {
    let percent = Math.round(100 * event.loaded / event.total);
    console.log(`File is ${percent} uploaded.`);
  };

  // handle error
  xhr.upload.onerror = function() {
    console.log(`Error during the upload: ${xhr.status}.`);
  };

  // upload completed successfully
  xhr.onload = function() {
    console.log('Upload completed successfully.');
  };

  xhr.open('POST', 'https://domain.com/upload');
  xhr.send(file);
}
</script>
```
You can refer to [MDN Upload API document](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/upload){:target="_blank"} for the complete API.

With this, you could show upload progress during file(s) upload on your website. 

{% include eof.md %}
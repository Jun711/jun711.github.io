---
layout: single
header:
  teaser: /assets/images/teasers/amazon-s3.jpg
title: "Download From Amazon Simple Storage Service(S3) Buckets using JavaScript"
date: 2019-08-05 20:00:00 -0800
categories: AWS
tags:
  - Amazon S3
  - JavaScript
  - serverless
--- 
Learn how to download from Amazon S3 buckets in your web application(frontend) using JavaScript.  

## Configure CORS Policy
First of all, configure `Cross-Origin Resource Sharing(CORS)` policy for your S3 bucket before proceeding as you may get CORS error when you download using fetch and other JavaScript APIs.  

Check out [Handle Amazon S3 Download No Access-Control-Allow-Origin Header Error](https://jun711.github.io/aws/handle-amazon-s3-no-access-control-allow-origin-header-cors-error/){:target="view_window"} article to learn how to set up CORS policy for an S3 bucket. 

## Download From Amazon S3
This is not a comprehensive list of all possible ways to download from Amazon S3. They are just methods that I would like to share with you.  

Your Amazon S3 item url looks like this. If it is a [presigned url](https://jun711.github.io/aws/how-to-download-from-amazon-s3-private-buckets-using-presigned-urls/#presigned-urls){:target="view_window"}, it has several signature and expiry parameters appended to the url. The following url will be referred as `YOUR-S3-ITEM-URL` throughout the rest of this article.  

<pre class='code'><code>
https://bucket-name.s3.amazonaws.com/path-to-item.extension

</code></pre>

### HTML Anchor element \<a\>
This is probably the easiest way to download from an S3 url. You can set as S3 url as the value for your anchor element's href attribute. In addition, you can style your anchor element to look like a button.  

```html

<a href='YOUR-S3-ITEM-URL' 
   download='ITEM-NAME.extension'>Download!</a>

```

### Fetch and Achor Element 
To enable automatic download, you can simulate a click on an anchor element using anchor element's `click()` method. You can specify the downloaded item name plus file extension using anchor element's `download` attribute, for example, 'my-item.text'.  

```javascript
fetch('YOUR-S3-ITEM-URL', {method: 'GET'})
  .then(res => {
    return res.blob();
  })
  .then(blob => {
    var url = window.URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'myItem.extension';
    document.body.appendChild(a); 
    a.click();  
    setTimeout(
      _ => { window.URL.revokeObjectURL(url); }, 
      60000); 
    a.remove(); 
  })
  .catch(err => {
    console.error('err: ', err);
  })
```

### Fetch and FileSaver
To reduce risk of browser incompatibility but at the expense of dependency, you can use [FileSaver.js](https://github.com/eligrey/FileSaver.js/blob/master/src/FileSaver.js){:target="view_window"} which is a maintained open source script on your website. 

For self improvement, it is a good idea to read what is inside FileSaver.js to see how saveAs polyfill is implemented.  

#### Include FileSaver.js File
Using FileSaver on your website, you can use `saveAs` polyfill method which automatically downloads and saves a file(blob) item to your user's local machine.   

You can download FileSaver.js and include it in your web application. It is better to minimize it if you use it for production.

Then, to use it, you can include the following script within '<head>' element of your index.html with the correct path to where you put FileSaver.js.  

```html 

<script 
  type='text/javascript'
  src='assets/js/FileSaver.js'></script>

```

#### NPM
On the other hand, you can also install FileSaver using npm.  

```

npm install file-saver --save

# if TypeScrirpt
npm install @types/file-saver --save-dev

```

#### saveAs example  
After including FileSaver.js script or installing FileSaver package, you can use it to enable automatic download of S3 items to your user's device.   

```javascript
fetch('YOUR-S3-ITEM-URL', {method: 'GET'})
  .then(res => {
    return res.blob();
  })
  .then(blob => {
    saveAs(blob, 'myItem.extension');
  })
  .catch(err => {
    console.error('err: ', err);
  })
```

## Summary
Choose the way to download from S3 that is user-friendly for your users and use case so that you can provide the best user experience.  

Check out [Download From Amazon (S3) Private Buckets Using Presigned URLs](https://jun711.github.io/aws/how-to-download-from-amazon-s3-private-buckets-using-presigned-urls/){:target="view_window"} article if you are interested in keeping your bucket private and at the same time letting users download from your S3 buckets.  

{% include eof.md %}
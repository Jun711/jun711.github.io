---
layout: single
header: 
  teaser: /assets/images/teasers/loading-bar.gif
title: "Add Read or Scroll Progress Bar To A Website To Indicate Read Progress"
date: 2019-02-27 20:00:00 -0800
categories: 'Web'
tags: 
  - 'User Interface(UI)'
  - 'JavaScript'
  - 'HTML-CSS'
  - 'Jekyll'
---
Learn how to add a scroll progress bar(read progress bar) to your web page to inform readers how much they have read from your article or to indicate how much page has been scrolled.  

Follow the steps below to add a scroll progress bar to your website. Steps for adding to a Jekyll site are also included.   

## Scroll Progress Bar Components
You can use a div element, its background property and linear-gradient CSS function to make a scroll progress bar.  

### Background
An HTML element's `background` property is a CSS property that sets all the following background style properties in a single declaration.  

Background properties with initial values:  
1) background-image: none  
2) background-position: 0% 0%   
3) background-size: auto auto   
4) background-repeat: repeat   
5) background-origin: padding-box   
6) background-clip: border-box   
7) background-attachment: scroll   
8) background-color: transparent    
  
### Linear Gradient
`linear-gradient()` CSS function is used to create a progressive transition of multiple colours along a straight line of a specified direction. Its output is a \<gradient\> data type, a special type of \<image\>.  

**Example:**  
This linear-gradient function below generates a linear gradient titled at 45° starting in orange colour and ending in red colour.  
```css
linear-gradient(45deg, orange, red);
```

## Scroll Progress Bar Code
Check out the code snippets below to learn how to add a scroll progress bar to your website.   
 
### HTML
Add a div with a CSS id within \<body\> element in your `index.html` if you want this scroll progress bar to appear on all pages.  

If you only want it to appear within your component (e.g. Angular, React, Vue component), you can add this div element within a component.  

```html
<div id="progress-bar"></div>
```

For Jekyll sites, you can include the HTML above inside head.html. For the Jekyll theme that I am using, I had to create a folder called head inside `_includes` folder and add the HTML above to a HTML file named `custom.html`.  

### CSS
You can set linear gradient of the colour you like as the background of the div element.   
Using `var() CSS function`, you can use `var(--variableName)` to assign values to a CSS property during run time.   

<pre class='code'>
<code>
#progress-bar {
  background: linear-gradient(to right, red var(--progress), transparent 0);
  position: sticky;
  overflow: hidden;
  width: 100%;
  height: 3px;
  z-index: 1;
}

</code></pre>   
  
For Jekyll sites, include this CSS in `main.scss` file inside `assets/css` folder.  

**linear gradient breakdown**  
1) `to right` means the color transition is going from left to right direction.  

2) `red var(--progress)` which will be replaced as `red 0%` at the beginning of run time to tell linear-gradient to start in red colour and increase the portion of red based on the percentage.  

3) `transparent 0` tells linear-gradient to end in transparent starting at 0% unless red percentage is greater than 0%.  

### JavaScript
After including scroll progress bar HTML and CSS, add a callback function to document's `scroll` event. When page is scrolled, this callback function will dynamically change linear gradient percentage (scroll css variable) based on how much page has been scrolled. When page is scrolled back to top, linear gradient will set colour part of linear gradient to 0%. 

For Jekyll sites, put the JavaScript code below inside a JavaScript file and include this JS file in the head_scripts section of your `_config.yml` file.  

```yaml
head_scripts:
  - /assets/js/my-javscript.js
```  

With `var() CSS function`, you can use the following JavaScript to change linear gradient width in percentage. 
<pre class='code'>
<code>
document.addEventListener('scroll', _ => {
  var docElem = document.documentElement;
  var docBody = document.body;
  var scrollTop = (docBody.scrollTop || docElem.scrollTop);
  var height = docElem.scrollHeight - docElem.clientHeight;

  readPercent = scrollTop / height * 100;

  if (readPercent > 0) {
    progressBar = document.querySelector('#progress-bar');
    progressBar.style.setProperty('--progress', readPercent + '%');
  } else {
    progressBar.style.setProperty('--progress', '0%');
  }
})

</code></pre> 

---

If you prefer not to use `var() CSS function` as it may not work on some browsers, you can change progress-bar div element's background value to indicate scroll progress using the code below.   
<pre class='code'>
<code>
document.addEventListener('scroll', _ => {
  var docElem = document.documentElement;
  var docBody = document.body;
  var scrollTop = (docBody.scrollTop || docElem.scrollTop);
  var height = docElem.scrollHeight - docElem.clientHeight;

  progress = scrollTop / height * 100;

  if (progress > 0) {
    progressBar = document.querySelector('#progress-bar');
    var bgVal = '';
    bgVal = 'linear-gradient(to right, red ' + progress + '%, transparent 0)';
    progressBar.style.background = bgVal;
  } else {
    var bgVal = 'linear-gradient(to right, red 0%, transparent 0)';
    progressBar.style.background = bgVal;
  }
})

</code></pre>     

## Rainbow Scroll Progress Bar
To make a scroll progress bar have rainbow colours, you can use this linear gradient colour combination as the value of your div element's background property value.  

<pre class='code'>
<code>
background: linear-gradient(to right, red, orange , yellow, green,   
blue, indigo, violet var(--scroll), transparent 0);

</code></pre>

## Summary
By having a read / scroll progress bar, readers can be better informed of how much they have read and how much remains for an article which definitely make a website more user friendly.  

To make your website more user friendly, check out [How to Add A Scroll To Top Button to A Website article](https://jun711.github.io/web/adding-scroll-to-top-button-to-a-website/){:target="view_window"}.  

{% include eof.md %}

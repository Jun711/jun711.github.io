---
layout: single
header: 
  teaser: /assets/images/scroll-to-top-button-19-02-27.png
title: "Add Scroll-To-Top Button to a Website"
date: 2019-02-26 20:00:00 -0800
categories: ['Web']
tags: ['User Interface(UI)', 'JavaScript', 'HTML-CSS', 'Jekyll']
---
When a page has long content, it would be good to have anchors at sections' titles and also a scroll-to-top that help users navigate and scroll. 

This post talks about how to add a scroll-to-top button to a jekyll site but in general, it applies to any websites. 

## Setup
### HTML
1) Using html, create a button that let users click to scroll to top of your webpage. You can use a button or font-awesome icons or style a div to make your scroll-to-top button. 

For examples:
```html
<button id='scroll-to-top'>up</button>

<h3><i class="icon-arrow-up"></i></h3>
```

2) You can include this above html inside footer.html. For the Jekyll stheme that I am using, I had to create a folder called footer inside `_includes` folder and add code to a html file named `custom.html`.  
```html
<!-- start custom footer snippets -->
<button id='scroll-to-top'>up</button>
<!-- end custom footer snippets -->
````

### CSS
1) Then, style your button to your liking. 
You will need position, bottom and right css to place it in the bottom right corner.
```css
position: fixed;
bottom: 30px;
right: 40px;
```

2) There are many ways to display a scroll-to-top button. To display or hide it, you can use one of the following options. This is not a comprehensive list.
1. opacity 
2. display (none vs block)
3. transform translateY or translateX

For examples:
```javascript
document.getElementById('scroll-to-top').style.display = 'block';
document.getElementById('scroll-to-top').style.opacity = 1;
document.getElementById('scroll-to-top').style.transform = 'translateY(-30%)'
```    
  
3) For Jekyll sites, you can include this CSS in `main.scss` file inside `assets/css` folder.    

## Examples
### 1 - Smooth Scroll JS + CSS id
This 'BACK TO TOP' button provided by Minimal Mistakes theme uses a [Smooth Scroll JavaScript](https://github.com/cferdinandi/smooth-scroll){:target="view_window"} for animating scrolling to anchor links. 

It works because href points to another element that has id page-title. Once this element is clicked, it will scroll to the top of the page-title element. Without using JavaScript for smooth scrolling, upon clicking the element, the page will display anchored view rather abruptly.  

![Jekyll Minimal Mistakes Theme Back To Top Button](/assets/images/jekyll-back-to-top-button-19-02-27.png)

To initialize Smooth Scroll:   
```javascript
var scroll = new SmoothScroll('a[href*="#"]');
```

Minimal Mistakes repo initializes [Smooth Scroll with customized options](https://github.com/mmistakes/minimal-mistakes/blob/cf0c046dd231a5eb7f2d1d234740f102f2ad44c2/assets/js/_main.js#L69){:target="view_window"}.   

```javascript
var scroll = new SmoothScroll('a[href*="#"]', {
  offset: 20,
  speed: 400,
  speedAsDuration: true,
  durationMax: 500
});
```

Its HTML is
```html
<h1 id="page-title" class="page__title">
  Posts by Category
</h1>
...
<a href="#page-title" class="back-to-top">
  {{ site.data.ui-text[site.locale].back_to_top | default: 'Back to Top' }} &uarr;
</a>
...
```

In case you wonder what `&uarr;` is, it is a [named HTML entity](https://www.w3.org/TR/WD-html40-970708/sgml/entities.html){:target="view_window"} that represents a Unicode arrow-up character.

`back-to-top` css class contains the following css:
```
.back-to-top {
  display: block;
  clear: both;
  color: lighten($text-color, 50%);
  font-size: 0.6em;
  text-transform: uppercase;
  text-align: right;
  text-decoration: none;
}
```

### 2 - JQuery + HTML + CSS
For HTML and CSS, you can use the button that is made earlier.

Use JQuery fadeIn and fadeOut functions to make scroll-to-top button display and hide. And, attach JQuery animate function with scrollTop property to make screen scroll to top.

The reason it animates both html and body is for browser compatability. html is needed to work on Safari while body is needed to work on Firefox and Edge.

The reason scrollToTop click event handler returns false is that it prevents the default action and stops the event bubbling up through the DOM.

```javascript
function scrollToTop() {
  $('html, body').animate({ scrollTop: 0 }, 400);
  return false;
}

function toggleScrollToTopButton() {
  var threshold = 200;
  if ($(window).scrollTop() > threshold) {
    $('#scroll-to-top').fadeIn('slow');
  } else {
    $('#scroll-to-top').fadeOut('slow');
  }
}

$(document).ready(function () {
  $('#scroll-to-top').click(scrollToTop);
  $(window).scroll(toggleScrollToTopButton);
});
```

You can play around using this [scroll-to-top button using Jquery codepen](https://codepen.io/jun711/pen/rRVeMe){:target="view_window"}.

For Jekyll sites, put the JavaScript code above inside a JavaScript file and include this JS file in the head_scripts section of your `_config.yml` file.    

```yaml
head_scripts:
  - /assets/js/my-javscript.js
```

### 3 - Vanilla JS + HTML + CSS
For HTML and CSS, you can use the button that is made earlier.

Use `"scrollBehavior" in document.documentElement.style` to check if a browser support to decide whether you can use smooth scrolling. 
```javascript
function hasScrollBehavior() {
  return "scrollBehavior" in document.documentElement.style;
}
```

If it does, `window.scrollTo({ top: 0, behavior: "smooth" });` is feasible. If not, you have to write your own smooth scrolling function. 

#### browser smooth scroll
Some ways to scroll if smooth scrolling is supported:   
i) scroll to an ID or a class name
```javascript
document.getElementById('id').scrollIntoView({behavior: 'smooth'});
```

ii) window scrollTo function
```javascript
window.scrollTo({ top: 0, behavior: 'smooth' });
```

#### simple smooth scroll
I wrote a simple smooth scrolling function that scroll a setInterval at 1000 / 60 fps.
```javascript
function smoothScroll() {
  var currentY = window.scrollY;
  var int = setInterval(function() {
    window.scrollTo(0, currentY);

    if (currentY > 500) {
      currentY -= 70;
    } else if (currentY > 100) {
      currentY -= 50;
    } else {
      currentY -= 10;
    }

    if (currentY <= 0) clearInterval(int);
  }, 1000 / 60); // 60fps
}
```

To toggle scroll-to-top button, you can change the button's transform and opacity css dynamically at different window's scrollY.
```javascript
function toggleScrollUpButton() {
  var y = window.scrollY;
  var e = document.getElementById("scroll-to-top");
  if (y >= 200) {
    e.style.transform = "translateY(-30%)";
    e.style.opacity = 1;
  } else {
    e.style.opacity = 0;
    e.style.transform = "translateY(30%)";
  }
}
```

Then, you can attach respective functions to window's scroll and button's click events.
```javascript
window.addEventListener("scroll", toggleScrollUpButton);

var e = document.getElementById("scroll-to-top");
e.addEventListener("click", scrollToTop, false);
```

You can play around using this [scroll-to-top button using vanilla JavaScript codepen](https://codepen.io/jun711/pen/WmQGrE){:target="view_window"}.

For Jekyll sites, put the JavaScript code above inside a JavaScript file and include this JS file in the head_scripts section of your `_config.yml` file.   

```yaml
head_scripts:
  - /assets/js/my-javscript.js
```

## Improvement
You can use an easing timing function and window.requestAnimationFrame to scroll with easing.

You can check out this [github gist](https://gist.github.com/gre/1650294){:target="view_window"} for easing functions.

This is a smooth scrolling function written using easing timing function and window.requestAnimationFrame shared on this [scroll top with a transition effect](https://codepen.io/dsheiko/pen/XZEgXW?editors=1010){:target="view_window"} codepen. Check it out to learn more.
```javascript
function scrollTopSmooth( initY, duration = 300, timingName = "linear" ) {  
  const timingFunc = TIMINGFUNC_MAP[ timingName ];
  let start = null;
  const step = ( timestamp ) => {
    start = start || timestamp;
    const progress = timestamp - start,
          // Growing from 0 to 1
          time = Math.min( 1, ( ( timestamp - start ) / duration ) );

    window.scrollTo( 0, initY - ( timingFunc( time ) * initY ) );
    if ( progress < duration ) {
      window.requestAnimationFrame( step );
    }
  };

  window.requestAnimationFrame( step );  
}
```
## Summary
By having a scroll-to-top button, a navigation menu and breadcrumb, readers can navigate around your website conveniently.  

To make your website more user friendly, check out [How to Add A Scroll To Top Button to A Website article](https://jun711.github.io/web/adding-scroll-to-top-button-to-a-website/){:target="view_window"}. 

{% include eof.md %}

---
layout: single
header: 
  teaser: /assets/images/google-celebrating-30-years-of-world-wide-web-screenshot-2019-03-11.png
title: "Chrome Remote Debugging Websites on Android"
date: 2019-03-11 20:00:00 -0800
categories: ['Web']
tags: ['Chrome', 'Debug']
---
## Overview:
Web browsers and mobile browsers don't behave the same and sometimes don't support the same functionalities. It is important for us to test our app on mobile browsers too especially the browsers that most of our users are using. 

This post just discusses on how to test and debug web applications and websites on Google Chrome remotely.

## Chrome + Android
With a USB cable to connect your phone to your machine, you can test on Android Chrome browser using Chrome DevTools Port Forwarding. 

According to Wikipedia, [port forwarding](https://en.wikipedia.org/wiki/Port_forwarding){:target="_blank"}  means  
>  In computer networking, port forwarding or port mapping is an application of network address translation (NAT) that redirects a communication request from one address and port number combination to another while the packets are traversing a network gateway, such as a router or firewall.

In this case, by using Chrome DevTools Port Forwarding, it set up a listening port on your Android device that maps to your machine port where app is being served.

### 1. Turn on your phone developer options
For Android 4.1 and lower, the Developer options is available on Settings menu by default.
For Android 4.2 and higher, to turn on developer options, we have to do the following:  
i) Open Settings Menu >  
ii) Open About phone >  
iii) Look for Build number (it may be under Software information) >   
iv) Look for Build number >  
v) Tap on Build number 7 times >  
vi) Return to Settings Menu >  
vii) Developer options appear at the bottom of the menu  

It will tell you if developer options is already on when you tap on Build number.  
![Android Developer options](/assets/images/android-developer-options-item-2019-03-11.jpeg)

### 2. Turn on USB debugging
After turning on developer options, you should turn on USB debugging. This will enable debugging via USB connection between your Android device and your machine.
![Android Developer options](/assets/images/android-developer-options-menu-2019-03-11.jpeg)

### 3. Chrome Discover USB Devices 
In case it doesn't detect your Android device, you have to make sure Chrome's 'Discover USB devices' option is checked. On Chrome browser, go to chrome://inspect/#devices and then check 'Discover USB devices' option if it is not.

Another way to do it is:  
First, open up remote devices menu from Chrome DevTools shown in the image below. When it is opened, check 'Discover USB devices' option if it isn't.
![Chrome DevTools Remote Devices](/assets/images/chrome-devtools-more-tools-remote-devices-2019-03-11.png)

![Chrome DevTools Discover USB Devices](/assets/images/chrome-devtools-remote-devices-discover-usb-devices-2019-03-11.png)

### 4. Connect Android device via USB
Connect your Android device to your machine via USB and it should show a prompt asking for your permission to connect and debug via USB.

### 5. Chrome inspect
On Chrome, type `chrome://inspect/#devices` in your address bar and enter, you will see following image with your connected phone listed under Remote Target.
![Chrome Inspect Devices Tab](/assets/images/chrome-inspect-devices-remote-target-2019-03-11.png)

### 6. Open Mobile Chrome 
After that, you can open up your chrome browser on your Android device. You will notice that your browser is listed under your phone ID in Remote Target section. Since I have a new tab opened, it shows the address as `chrome://newtab/#most_visited`.
![Chrome Inspect Mobile Chrome Browser](/assets/images/chrome-devices-remote-target-most-visited-2019-03-11.png)

### 7. Set up Port Forwarding
On top of chrome inspect page, you can see a Port forwarding button. Click on that and you will see the following menu opened up. There are 2 fields to be filled out. 

i) Check 'Enable port forwarding'.  
ii) Write in the first field the listening port on your Android device.  
iii) Write the IP address and port of your web app running on localhost such as `localhost:4000`.  
iv) Click done to set up.  

![Chrome Inspect Port Forwarding Menu](/assets/images/chrome-devtools-port-forwarding-menuchrome-devtools-port-forwarding-menu-2019-03-11.png)

### 8. Inspect localhost address on Mobile Chrome
You can open your web application or website running on localhost on your mobile Chrome.  
Then, click inspect below the localhost address on chrome inspect page.  

![Chrome Inspect localhost tab](/assets/images/chrome-devtools-inspect-jun711-blog-with-port-forwarding-2019-03-11.png)

![Chrome Devtools Remote Debugging](/assets/images/chrome-devtools-remote-debugging-jun711-blog-2019-03-11.png)

Now you can test, debug and inspect your web application or website on your mobile Chrome browser.

## Note
The teaser is a screenshot of [Google Search Doodle image for celebrating 30 years of World-Wide-Web](https://www.google.com/search?q=World+Wide+Web&oi=ddle&ct=30th-anniversary-of-the-world-wide-web-4871946884874240&hl=en&kgmid=/m/0828v&source=doodle-ntp){:target="_blank"} 

{% include eof.md %}
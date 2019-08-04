---
layout: single
header: 
  teaser: /assets/images/angular-logo-from-wikipedia-2019-03-10.png
title: "How to access an Angular App running on localhost from mobile devices?"
date: 2019-03-10 20:00:00 -0800
categories: ['Web']
tags: ['Debug', 'Test', 'Angular']
---
When you develop your Angular app on localhost, you might wonder how it looks like on a real mobile device(phone, tablet, etc.), whether it is responsive to different screen sizes.   
To do that, you can load your site running on localhost on your mobile devices when they are connected to the same local area network(LAN) such as connecting to the same WiFi.

## Steps
### 1. Locate your local IP address 
Following are how to get your local IP address on Mac OSX and Windows 10.  
#### Mac OSX 
you can get your local IP address by holding down option key and click WiFi icon on your menu bar. You can get your local IP address through this menu. Note the the red circle in the following image:   
![WiFi information by holding option key and click](/assets/images/mac-wifi-information--holding-option-key-2019-03-10.png)

There are multiple ways to get your local IP address such as via Network Preference or using a command such as `ifconfig` command. Choose one that works for you.

#### Windows 10
you can follow these steps to get your local address(> means next step):  
i) Click Start icon >   
ii) Choose Settings >   
iii) Select Network & Internet >   
iv) Select Ethernet or WiFi on the left panel >  
v) Select network connection (Ethernet) or Advanced Options(WiFi) >  
vi) The IP address next to IPv4 Address is your local IP address

The steps are different if you have a different Windows OS. 

{:start="2"}
### 2. Ng serve with host flag
When you serve your Angular app using [Angular CLI ng serve](https://angular.io/cli/serve){:target="_blank"} command with host flag, you specify the host to listen on.  

`ng serve --port your-local-ip-address`

### 3. Connect your phone to the same WiFi
It is important that you connect your mobile devices to the same WiFi local network.

### 4. Open app on a mobile browser
Open a mobile browser on your phone then type in the address in this format `your-local-ip-address:port-number`.   
For example: `192.168.1.114:4200`

With this, you can load your app in development on your mobile devices. 

{% include eof.md %}
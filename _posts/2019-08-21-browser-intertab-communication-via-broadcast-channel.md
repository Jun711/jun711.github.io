---
layout: single
header: 
  teaser: /assets/images/teasers/html5.png
title: "Browser Intertab Communication via Broadcast Channel API"
date: 2019-08-21 20:00:00 -0800
categories: 'Web'
tags: 
  - 'JavaScript'
  - 'User Interface(UI)'
---
Learn how to manage communication across browser windows and tabs for your websites and web applications.  

## Browser Intertab Communication
To keep your website's state up to date across browser tabs, you can use browser's Broadcast Channel API. 

According to MDN document: 
> Broadcast Channel API allows simple bi-directional communication between browsing contexts (that is windows, tabs, frames, or iframes) with the same origin (usually pages from the same site).

When a client(an instance of your webpage) broadcasts a message, all other clients who have already subscribed to this channel will receive the message. Upon receiving the message, clients can respond accordingly. 

You can imagine this as a radio channel. Messages are broadcasted by a radio channel and radios which are listening at the same frequency are able to receive the broadcasted messages.  

Note that a broadcast channel doesn't broadcast to itself. That means you won't receive the message fired by a broadcast channel on the same page.   

### Broadcaster
You can create a broadcast channel by using `BroadcastChannel` constructor with a channel name value. Your website can then broadcast a message using `postMessage` method.   

```javascript
const channelName = 'jun711'
const jun711Channel = new BroadcastChannel(channelName);

jun711Channel.postMessage({action: 'doSomething'});
```

### Receiver
To receive a message, you can use `onmessage` method. The received message has a `data` parameter. This data parameter contains the object that the broadcaster sends via postMessage.  

```javascript
function listenForMessage() {
  const jun711Channel = new BroadcastChannel('jun711');
  jun711Channel.onmessage(e => {
    console.log('message received: ', e);
    if (e.data.action === 'doSomething') {
      doSomething();
    }
});
```

### Message Types
Available message types are JavaScript objects supported by [structured clone algorithm](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm){:target="view_window"}. For example, all promitive types except Symbol, String, Boolean, Blob, File, Array, Object, Map, Set et cetera.  

An example of sending a Blob via Broadcast Channel API.  
```javascript
const jun711Channel = new BroadcastChannel('jun711');
const textBlob = new Blob(['hello', 'world'], 
                        {type: 'plain/text'});
jun711Channel.postMessage(textBlob);
```
  
### Clean Up
When a broadcast channel is done being used, it is a good idea to close it so that it doesn't consume unnecessary memory and can be garbage collected. You can close a broadcast channel by calling its `close` method.  

```javascript
const jun711Channel = new BroadcastChannel('jun711');
jun711Channel.close();
```  

## Example usage  
1. Log users out across a browser tabs. This is useful to prevent conflict that can arise due to out-of-sync application state.   

2. Update your web application UI. For example, changing a UI settings on a tab should be reflected on other tabs too. 

3. Synchroze web application state.  

## Caveat
Note that this is not available on Safari, Internet Explorer and older Edge.    

{% include eof.md %}

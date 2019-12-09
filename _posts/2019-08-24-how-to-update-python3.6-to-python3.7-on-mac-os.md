---
layout: single
header:
  teaser: /assets/images/teasers/python.png
title: "How to Update Python 3.6 to Python 3.7 on Mac OS"
date: 2019-08-24 20:00:00 -0800
categories: DevOp
tags:
  - Python
---
Learn how to upgrade Python 3.6 to Python 3.7 on Mac OS.  

This post has been updated on [How to Update Python 3.6 to Python 3.8 on Mac OS](https://jun711.github.io/devops/how-to-update-python3.6-to-python3.7-plus-on-mac-os/). This post will be removed end of this month.  

## Python Official Site
1) Open up [Python official download site](https://www.python.org/downloads/){:target="view_window"}. It looks something like the image below. Press `Download Python 3.7.4` or the version you would like to download.  

![Python Official Site](/assets/images/2019-08-22-how-to-install-python3-on-mac-os/python-official-download-site.png)

2) Use the download installer to install Python 3.7. You can refer to [How to Install Python3 article](https://jun711.github.io/devops/how-to-install-python3-on-mac-os/){:target="view_window"} for more information.  

## Homebrew
If you use [Homebrew](https://brew.sh/){:target="view_window"}, you can run `brew install` command to update Python to Python 3.7  

<pre class='code'><code>
brew install python3

</code></pre>

## Verification 
After you install, python3 command will point to `Python 3.7`. You can verify by using commands below.    

<pre class='code'><code>
python3 --version
# Python 3.7.4

</code></pre>

You can use `which` command to find out the location of Python 3.7      

<pre class='code'><code>
which python3  
# /Library/Frameworks/Python.framework/Versions/3.7/bin/python3

which python3.7
# /Library/Frameworks/Python.framework/Versions/3.7/bin/python3.7

</code></pre>

## Note
You can check out [How to Install Pip article](https://jun711.github.io/devops/how-to-install-pip-on-mac-os/){:target="view_window"} to learn how to install Pip.   

{% include eof.md %}
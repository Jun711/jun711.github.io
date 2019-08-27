---
layout: single
header:
  teaser: /assets/images/teasers/python.png
title: "How to Install Python 3 on Mac OS"
date: 2019-08-22 20:00:00 -0800
categories: DevOp
tags:
  - Python
---
Check out the steps below to install Python 3 on Mac OSX.  

## How to download Python3 
You can download Python 3 by downloading from official [Python website](https://www.python.org/downloads/){:target="view_window"} or using [Homebrew](https://brew.sh/){:target="view_window"} package manager for macOS .

### Python Official Site
1) Open up [Python official download site](https://www.python.org/downloads/){:target="view_window"}. It looks something like the image below. Press `Download Python 3.7.4` or the version you would like to download.  

![Python Official Site](/assets/images/2019-08-22-how-to-install-python3-on-mac-os/python-official-download-site.png)

2) After downloading the installer, open it to install Python 3.  

![Python 3.7.4 Installer](/assets/images/2019-08-22-how-to-install-python3-on-mac-os/python3.7.4-installer.png)

Python 3.7.4 installer `Read Me` contains the following note about Python 3 and Python 2 Co-existence. Thus, to run Python 3, you can run `Python3` or `Python3.X.X` (a specific version that you installed on your machine). To run Python 2, you can run `Python` or `Python2.7`.   

<pre class='code'><code>
Python 3 and Python 2 Co-existence

Python.org Python 3.7 and 2.7.x versions can both be installed on your system 
and will not conflict. Command names for Python 3 contain a 3 in them, python3 
(or python3.7), idle3 (or idle3.7), pip3 (or pip3.7), etc.  Python 2.7 command 
names contain a 2 or no digit: python2 (or python2.7 or python), idle2 (or 
idle2.7 or idle), etc.

</code></pre>

![Installing Python 3.7.4](/assets/images/2019-08-22-how-to-install-python3-on-mac-os/python3.7.4-installer-readme.png)

3) Remove Python installer when you are done installing

![Remove Python Installer After Installing](/assets/images/2019-08-22-how-to-install-python3-on-mac-os/remove-python-installer.png)

4) Run `python3 --version` to check if Python 3 is installed.  

<pre class='code'><code>
python3 --version
# Python 3.7.4

</code></pre>


If you install Python 3.7.X, you can also check its version using this command: 

<pre class='code'><code>
python3.7 --version
# Python 3.7.4

</code></pre>

### Homebrew
Another way to install Python 3 on Mac OS is using Homebrew package manager.     

1) If you don't have Homebrew install, you can install Homebrew by following the steps on [Homebrew site](https://brew.sh/){:target="view_window"}. You can also use the following command to install Homebrew by copy and pasting it onto your terminal.  

<pre class='code'><code>
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

</code></pre>

2) To install the latest version of Python 3, run the command below.  

<pre class='code'><code>
brew install python3

</code></pre>

If you already have the latest Python installed, you will see something like the message below.  

<pre class='code'><code>
brew install python3
Updating Homebrew...
==> Auto-updated Homebrew!
Updated 1 tap (homebrew/core).
==> Updated Formulae
sbcl                                     yosys

Warning: python 3.7.4 is already installed and up-to-date
To reinstall 3.7.4, run `brew reinstall python`

</code></pre>

3) Run `python3 --version` to check if Python 3 is installed.  

<pre class='code'><code>
python3 --version
# Python 3.7.4

</code></pre>

If you install Python 3.7.X, you can also check its version using this command: 

<pre class='code'><code>
python3.7 --version
# Python 3.7.4

</code></pre>

## Python 3 Shell
To open Python 3 shell from terminal, you can run `Python 3`.  

```python
python3
Python 3.7.4 (v3.7.4:e09359112e, Jul  8 2019, 14:54:52) 
[Clang 6.0 (clang-600.0.57)] on darwin
Type "help", "copyright", "credits" or "license" for 
more information.
>>> import time
>>> time.ctime()
'Thu Aug 22 20:00:00 2019'
>>> exit()

```

To close Python shell, you can type in `exit()`. The hotkeys to close it is to press `Ctrl` and `D` simultaneously.   
Note that `Command` and `D` splits your Python shell view.  

Note that you can still access Python 2 by running `python` command.  

## Python 3 Package Manager Pip3
Python 3 comes with its own package manager `pip3`. You can check out [Python Package Index](https://pypi.org){:target="view_window"} to look for packages that you need.

To install a package using pip, you can run `pip3 install package_name`. 

## Switch between Python 3 Versions  
  
### Python Official Site
The easier way is to download multiple versions from Python official website and run Python command with a version appeneded such as `python3.7` and `python3.6`.  

### Homebrew
If you have previous versions of Python installed, you can run the following commands to check what versions you have and switch the version you need.  

<pre class='code'><code>
# list installed Python versions
brew info python

# switch to a specific Python version
brew switch python 3.6.5

</code></pre>

{% include eof.md %}
---
layout: single
header:
  teaser: /assets/images/teasers/python.png
title: "How to Install Pip on Mac OSX"
date: 2019-08-23 20:00:00 -0800
categories: DevOp
tags:
  - Python
  - AWS CLI
---
Learn how to handle `bash: pip: command not found` error.  

## Reasons
1) One possible reason for this error could be pip was not installed or its path wasn't configured correctly. In general, reinstalling pip can fix this error.

<pre class='code'><code>
bash: pip: command not found

</code></pre>

2) Another reason is you have Python3 installed and you could use `pip3` instead of pip. To check if you have pip3, you can run

<pre class='code'><code>
pip3 --version

</code></pre>

## Install Pip
As of 2019, you can install `pip` using a Python script 
Download <a download='get-pip.py' href='https://bootstrap.pypa.io/get-pip.py'>get-pip.py</a> provided by https://pip.pypa.io using the following command. 

1) Run the following command via your terminal.    
<pre class='code'><code> 
curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py

</code></pre>

Output:    

<pre class='code'><code> 
% Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100 1733k  100 1733k    0     0  3154k      0 --:--:-- --:--:-- --:--:-- 3152k

</code></pre>

2) After you download `get-pip.py` Python file, run it using this command. You have to type in your password.    

<pre class='code'><code>
sudo python get-pip.py

</code></pre>

Output:   
<pre class='code'><code>
Password:  
DEPRECATION: Python 2.7 will reach the end of its life on January 1st, 2020.    
Please upgrade your Python as Python 2.7 won't be maintained after 
that date. A future version of pip will drop support for Python 2.7.   
More details about Python 2 support in pip,   
can be found at    
https://pip.pypa.io/en/latest/development/release-process/#python-2-support   
Collecting pip   
  Downloading https://files.pythonhosted.org/packages/30/db/     
  9e38760b32e3e7f40cce46dd5fb107b8c73840df38f0046d8e6514e675a1/   
  pip-19.2.3-py2.py3-none-any.whl (1.4MB)
     |████████████████████████████████| 1.4MB 1.8MB/s 
Installing collected packages: pip
  Found existing installation: pip 19.2.3
    Uninstalling pip-19.2.3:
      Successfully uninstalled pip-19.2.3
Successfully installed pip-19.2.3

</code></pre>

3) After you done installing, run this command to check if pip is installed.   

<pre class='code'><code>
pip --version

</code></pre>

Possible output:   

<pre class='code'><code>
pip 19.2.3 from /Library/Frameworks/Python.framework/
Versions/3.7/lib/python3.7/site-packages/pip (python 3.7)

</code></pre>

4) Remember to clean up after installing pip by removing the installer file, `get-pip.py`.  

<pre class='code'><code>
rm get-pip.py

</code></pre>

## Note
1) To install a package using pip, you can run `pip install package_name` or `pip3 install package_name`.    

2) Note that Python 2.7 will not be maintained starting January 1st, 2020. Check out [How to Install Python 3 on Mac OSX](https://jun711.github.io/devop/how-to-install-python3-on-mac-os/){:target="view_window"} article to install Python 3.   

{% include eof.md %}
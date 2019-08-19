---
layout: single
header:
  teaser: /assets/images/teasers/browsers.png
title: "How to Open Websites On A Web Browser Using A Command on Mac (OSX)?"
date: 2019-04-13 12:00:00 -0800
categories: Productivity
tags:
  - Mac
  - Shell
---
Learn how to write simple shell script to open websites on a web browser window by using a command.     

## Shell Script
You can use open command to open specified URLs on a web browser.  

### Open Command
1) To read documentation of 'open' command, run `man open` on your terminal. The following is part of the documentation which says that 'open' command is used to open files and directories. 

<pre class='code'><code>
OPEN(1)                   BSD General Commands Manual                  OPEN(1)

NAME
     open -- open files and directories

SYNOPSIS
     open [-e] [-t] [-f] [-F] [-W] [-R] [-n] [-g] [-j] [-h] [-s sdk]
          [-b bundle_identifier] [-a application] file ... [--args arg1 ...]

DESCRIPTION
     The open command opens a file (or a directory or URL), just as if you had
     double-clicked the file's icon. If no application name is specified, the
     default application as determined via LaunchServices is used to open the
     specified files.

     ...

     The options are as follows:

     -a application
         Specifies the application to use for opening the file

     ...

</code></pre>

2) To open a website using your default web browser, you can use `open YOUR_URL` command.  

```bash
$ open https://jun711.github.io/
```

3) Note that `-a` flag is used to specify which application to open. Thus, to open a website on Google Chrome browser, the command would be `open -a "Google Chrome" YOUR_URL`. This will open the specified URL on an already opened Google Chrome window instance.  

```bash
$ open -a "Google Chrome" https://jun711.github.io/
```

4) To open a website on a new window instance, you can add `--args --new-window` flag. The command would be:  

```bash
$ open -a "Google Chrome" \
  --args --new-window https://jun711.github.io/
```

5) If you would like to open multiple URLs, you can append multiple URLs to the command and multiple websites will be opened. Note that `--args --new-window` flag can't be used when you use the following command to open multiple websites.  

```bash
$ open -a "Google Chrome" URL1 URL2 URL3
```

### Shell Alias
If you open certain websites frequently, you may consider creating an alias for this command. It works like a shortcut command.  

To add an alias, open up your `~/.bashrc` or `~/.zshrc` file and add the following command to your script. Save the file and reopen your terminal so that changes to bashrc or zshrc can take effect. You can use `vim` to edit bashrc or zshrc file by running `vim ~/.bashrc`.    

```bash
alias jun = 'open https://jun711.github.io'
alias blog = 'open -a "Google Chrome" https://jun711.github.io'

```

### Function with Argument
You can also create a function so that you can specify which website or which page of a website to open. You can add the following function in your `~/.bashrc` or `~/.zshrc` file.  

```bash
function load() {
  if [ $# -eq 0 ]; then
    open -a "Google Chrome" https://jun711.github.io/
  else
    open -a "Google Chrome" https://jun711.github.io/$1
  fi
}
```  

`$#` variable represents the number of arguments(positional parameters) passed with the command.  

`-eq` means equal.  

`$1` variable is the value of a command's first argument.  

You can then, open my blog using the following commands.

```bash
# open https://jun711.github.io/ 
$ load

# open https://jun711.github.io/categories
$ load categories
```

## Summary
With this configuration to your Shell to open a URL on your web browser, you can save time from typing the same website URL over and over again.   

{% include eof.md %}
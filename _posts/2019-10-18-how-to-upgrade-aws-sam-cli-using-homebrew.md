---
layout: single
header:
  teaser: /assets/images/teasers/aws-sam-squirrel-mascot.png
title: "Upgrade AWS SAM CLI using Homebrew"
date: 2019-10-18 20:00:00 -0800
categories: AWS
tags:
  - AWS Serverless Application Model(AWS SAM)
  - serverless
---
Learn how to upgrade your AWS SAM CLI using Homebrew.

If you haven't had AWS SAM CLI installed, you can refer to my [Install AWS SAM CLI article](https://jun711.github.io/aws/aws-sam-invoke-local-to-execute-lambda-locally/){:target="view_window"} to learn how to install AWS SAM CLI using Homebrew.  

## Current Version
You can get the version of the installed AWS SAM CLI by running the following command. 

```
$ sam --version
SAM CLI, version 0.37.0
```

## Latest Version
You can get the information of the latest released version of AWS SAM CLI by using the this command.  

The printed output shows the latest stable version of AWS SAM CLI.

```
$ brew info aws-sam-cli                                          
aws/tap/aws-sam-cli: stable 0.37.0 (bottled), HEAD
AWS SAM CLI 🐿 is a tool for local development   
and testing of Serverless applications
https://github.com/awslabs/aws-sam-cli/
/usr/local/Cellar/aws-sam-cli/0.37.0 (4,567 files, 67.2MB) *
  Poured from bottle on 2019-12-05 at 15:05:24
From:   
https://github.com/aws/homebrew-tap/blob/master/
Formula/aws-sam-cli.rb
==> Dependencies
Required: python ✔
==> Options
--HEAD
	Install HEAD version
```

## Upgrade Version
You can run this command to upgrade your AWS SAM CLI. It will first update Homebrew so it takes a bit of time if your Homebrew is not up to date.   

If you already have the latest AWS SAM CLI installed, you will see this warning message.  

```
$ brew upgrade aws-sam-cli
Warning: aws/tap/aws-sam-cli 0.37.0 already installed
```

{% include eof.md %}
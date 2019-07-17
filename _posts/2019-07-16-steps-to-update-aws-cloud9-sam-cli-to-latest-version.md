---
layout: single
header:
  teaser: /assets/images/teasers/aws-cloud9-ide.png
title: "Steps to update AWS Cloud9 IDE SAM CLI to Latest Version"
date: 2019-07-16 20:00:00 -0800
categories: AWS
tags:
  - serverless
  - AWS Lambda
  - AWS Cloud9

  - AWS Serverless Application Model(AWS SAM)
---

## Overview:
Learn how to update AWS Cloud9 IDE(Integrated development environment) AWS SAM(Serverless Application Model) CLI(command-line interface) version. 

As of 2019-07-16, when you create a new AWS CodeStar project with Cloud9 as IDE, its environment is installed with AWS SAM CLI version 0.2.11 but the latest SAM CLI version is 0.18.0

## Issues:
The following issues caused by required functionalities not supported by older SAM CLI versions. They can be solved by updating AWS SAM CLI version to a later version that supports it.  

1. AWS Cloud9 IDE fails to invoke(run local an AWS Resources) a local Lambda function that has python3.7 as runtime. It requires at least SAM CLI version 0.8.0 to enable Python 3.7 runtime.

Lambda Function Declaration:
```yaml
Resources:
  HelloWorld:
    Type: AWS::Serverless::Function
    Properties:
      Handler: index.handler
      Runtime: python3.7
      ...
```

Error Message:
<pre class='code'>
<code>
A newer version of the AWS SAM CLI is available!
Your version:   0.2.11
Latest version: 0.18.0
See https://github.com/awslabs/aws-sam-local for upgrade instructions
2019/07/17 03:35:11 Successfully parsed template.yml
2019/07/17 03:35:11 Connected to Docker 1.38
2019/07/17 03:35:11 Could not initiate python3.7 runtime: unsupported runtime

</code></pre>  

![Cloud9 Fails to Run Local Lambda that has python3.7 as runtime](/assets/images/2019-07-16-steps-to-update-aws-cloud9-sam-cli-to-latest-version/aws-cloud9-outdated-sam-cli-2019-07-16.png)

{:start="2"}
2. When trying to invoke Lambda functions locally, you get local not configured properly error:
<pre class='code'>
<code>
Command 'local' is not configured correctly.  
Unable to import 'samcli.commands.local.local'

</code></pre>

{:start="3"}
3. Unable to invoke a global environment variable. With the following declaration, but with SAM CLI versions that don't support Globals Environment Variables, you will get `KeyError: 'Stage'` when you try to access via `os.environ['Stage']`.  

```yaml
Globals:
  Function:
    Environment:
      Variables:
        Stage: 'Dev'
```  

## Steps to install latest SAM CLI

### 1. Install Homebrew for Linux
The following steps are listed on [Homebrew-on-Linux](https://docs.brew.sh/Homebrew-on-Linux){:target="view_window"} and pasted here for your convenience.
#### 1.1 Download and Run Install Script
<pre class='code'>
<code>
sh -c "$(curl -fsSL https://raw.githubusercontent.com/Linuxbrew/install/master/install.sh)"

</code></pre>  

#### 1.2 Add Homebrew to PATH
Do the following steps to add Homebrew to the environment PATH and to bash shell profile script: either ~/.profile on Debian/Ubuntu or ~/.bash_profile on CentOS/Fedora/RedHat.   
You can copy all 4 lines and paste on the terminal.  
<pre class='code'>
<code>
test -d ~/.linuxbrew && eval $(~/.linuxbrew/bin/brew shellenv)
test -d /home/linuxbrew/.linuxbrew && eval $(/home/linuxbrew/.linuxbrew/bin/brew shellenv)
test -r ~/.bash_profile && echo "eval \$($(brew --prefix)/bin/brew shellenv)" >>~/.bash_profile
echo "eval \$($(brew --prefix)/bin/brew shellenv)" >>~/.profile

</code></pre>

### 2. Update SAM CLI Version
The second part involves uninstalling older SAM CLI and installing of latest version of SAM CLI. The following steps are a combination and updated version of commands listed on AWS SAM documents.

#### 2.1 Uninstall Older SAM   

<pre class='code'>
<code>
# Uninstall the older version of SAM Local 
$ npm uninstall -g aws-sam-local

# Uninstall the older version of SAM CLI 
$ pip uninstall aws-sam-cli

# Remove SAM symlink 
$ rm -rf $(which sam)

</code></pre>

If you run `which sam` after running `rm -rf $(which sam)`, you will see output similar to the following:

<pre class='code'>
<code>
# Check if SAM is in PATH
$ which sam
/usr/bin/which: no sam in (/home/ec2-user/.rvm/gems/ruby-2.6.3/bin:
/home/ec2-user/.rvm/gems/ruby-2.6.3@global/bin:...
...truncated...)

</code></pre>  

#### 2.2 Install Latest SAM using Homebrew
<pre class='code'>
<code>
# Add brew tap
$ brew tap aws/tap

# Install aws-sam-cli from brew tap
$ brew install aws-sam-cli

# Verify that SAM is installed
$ /home/linuxbrew/.linuxbrew/bin/sam

# Check installed SAM version
$ sam --version

# Symlink sam to path where Cloud9 looks for SAM
$ ln -sf $(which sam) ~/.c9/bin/sam 

# To make sure Cloud9 SAM is linked to the right SAM CLI version
$ ls -la ~/.c9/bin/sam

</code></pre>

When you run `/home/linuxbrew/.linuxbrew/bin/sam`, you will see the following prompt. That means SAM is installed correctly at that location.

<pre class='code'>
<code>
Usage: sam [OPTIONS] COMMAND [ARGS]...

  AWS Serverless Application Model (SAM) CLI

  The AWS Serverless Application Model extends AWS CloudFormation to provide
  a simplified way of defining the Amazon API Gateway APIs, AWS Lambda
  functions, and Amazon DynamoDB tables needed by your serverless
  application. You can find more in-depth guide about the SAM specification
  here: https://github.com/awslabs/serverless-application-model.

Options:
  --debug    Turn on debug logging to print debug message generated by SAM
             CLI.
  --version  Show the version and exit.
  --info
  --help     Show this message and exit.

Commands:
  package   Package an AWS SAM application. This is an alias for 'aws
            cloudformation package'.
  logs      Fetch logs for a function
  deploy    Deploy an AWS SAM application. This is an alias for 'aws
            cloudformation deploy'.
  build     Build your Lambda function code
  init      Initialize a serverless application with a...
  validate  Validate an AWS SAM template.
  publish   Publish a packaged AWS SAM template to the AWS Serverless
            Application Repository.
  local     Run your Serverless application locally for...
  
</code></pre>

## Summary
With the latest SAM CLI installed, you can invoke Lambda function that set runtime as Python 3.7 locally, access global environment variables and other updated features.
  
## Support  
  
{% include eof.md %}

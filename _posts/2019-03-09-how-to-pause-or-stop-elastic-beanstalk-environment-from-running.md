---
layout: single
header:
  teaser: /assets/images/aws-elastic-beanstalk-2019-03-09.png
title: "How to pause or stop AWS Elastic Beanstalk environment from running?"
date: 2019-03-09 12:00:00 -0800
categories: AWS
tags:
  - AWS Elastic Beanstalk
---
There is no straightforward way to pause an Elastic Beanstalk(EB) environment on AWS console. You can't terminate it as it will be deleted.   
Fret not, you can stop your EB environment from running when it is not needed so that you only pay when you use it.

## AWS Elastic Beanstalk
In case you aren't familiar with AWS Elastic Beanstalk. On [AWS Elastic Beanstalk doc](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/Welcome.html){:target="_blank"}, it says that 

> With Elastic Beanstalk, you can quickly deploy and manage applications in the AWS Cloud without having to learn about the infrastructure that runs those applications. Elastic Beanstalk reduces management complexity without restricting choice or control. You simply upload your application, and Elastic Beanstalk automatically handles the details of capacity provisioning, load balancing, scaling, and application health monitoring.

For an example use case, you can host your Angular, React or Vue app or your website and manage your hosting via AWS Elastic Beanstalk.

## Issue
There is no pause action on AWS Elastic Beanstalk console menu:

![AWS Elastic Beanstalk Console Action Menu](/assets/images/aws-elastic-beanstalk-console-actions-menu-2019-03-09.png)

## Solutions
### Use Time-based Scaling
You can modify your EB environment capacity on AWS console. Using time-based scaling, you can schedule a task to turn your EB environment to have 0 instances running and thus pausing your environment.

#### Steps to pause an EB environment
1. On AWS Elastic Beanstalk console, select the **environment** you want to pause.
2. On left panel, select **Configuration**.
3. On Configuration Overview menu, modify **Capacity** (first row, third from right).
4. On Modify Capacity menu, scroll down to **Time-based scaling**.
![AWS Elastic Beanstalk Time-based Scaling](/assets/images/aws-elastic-beanstalk-console-time-based-scaling-2019-03-09.png)

5. Choose **Local** for time zone unless you know your UTC time. 
6. Select **Add scheduled action** and you will see a menu like this:   
![AWS Elastic Beanstalk Scheduled Action](/assets/images/aws-elastic-beanstalk-console-scheduled-action-2019-03-09.png)

7. Set the Min and Max of instances and Desired capacity to 0.  
8. Set the start time about 5 minutes from your current time so that the pause action has enough time to execute. 
9. Click Add and then **Apply**.
10. Your environment will be updated and will be set to 0 instance.  
Environment Overview page will look like this:
![AWS Elastic Beanstalk Environment Paused State](/assets/images/aws-elastic-beanstalk-environment-paused-instance-zero-2019-03-09.png)

Now that you have your instance paused, when you want to continue, you can repeat the above steps but this time, you should set min, max of instances and desired capacity to the number that you would like it to be.
### Using Elastic Beanstalk CLI
You can use `eb scale` to scale your environment to run on a specified number of instances. To pause your environment, you will have to scale it 0. 

eb scale Syntax:
```
eb scale number-of-instances

eb scale number-of-instances environment-name
```

This would work if you are using a load-balancing environment. If you are a using a single instance type of environment, you will see the following message when you use `eb scale 0 myEnvName`. If that is the case, you will have to modify your environment to use a load-balancing environment before you can use `eb scale 0 myEnvName`.

```
eb scale 0 myEnvName
The environment is currently a single-instance. Do you want to change to a load-balancing environment?
WARNING: If you choose yes, the environment and your application will be temporarily unavailable.
(Y/n): 
```

## Summary
With this, you can pause and continue running your Elastic Beanstalk environment whenever you want.

Check out [Elastic Beanstalk Worker Auto Scaling By Queue Size](https://jun711.github.io/aws/aws-elastic-beanstalk-worker-auto-scale-by-queue-size/){:target="view_window"} if you would like to know how to pause an Elastic Beanstalk environment instance temporarily.  

{% include eof.md %}


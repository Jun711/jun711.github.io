---
layout: single
header:
  teaser: /assets/images/teasers/aws-codestar.png
title: "Continuous Integration and Continuous Deployment(CI/CD) using AWS CodePipeline and AWS CodeStar"
date: 2019-06-15 20:00:00 -0800
categories: AWS
tags:
  - AWS CodePipeline
  - AWS CodeStar
  - serverless
  - CI/CD
---
Learn how to create development and production pipelines for your web service projects using AWS CodePipeline and AWS CodeStar. Having a development and a production pipeline can streamline development and production workflow.

## AWS CodeStar
CodeStar is a service that unifies and streamlines the following AWS services to provide smooth CI/CD experience.
1. AWS CodeCommit
2. AWS CodeBuild
3. AWS CloudFormation
4. Amazon CloudWatch
5. AWS Cloud9

Quoted from AWS CodeStar page:
> AWS CodeStar provides a unified user interface, enabling you to easily manage your software development activities in one place. With AWS CodeStar, you can set up your entire continuous delivery toolchain in minutes, allowing you to start releasing code faster. 

## AWS CodePipeline
CodePipeline is a managed continuous integration and development service.

Quoted from AWS CodePipeline page:
> AWS CodePipeline is a fully managed continuous delivery service that helps you automate your release pipelines for fast and reliable application and infrastructure updates.

## CI/CD Configuration Steps
If there is any build error when following the steps, it is probably caused by IAM permission issue. Check status reasons and error messages on CodeBuild and CloudFormation console. You may need to add permission for your project CloudFormation role.   

### 1. Create a CodeStar Project
Create a CodeStar web service project. You can choose Cloud9 as your IDE and CodeCommit as your code repository. It may take a few minutes for AWS to create and configure resources for your CodeStar project.

When CodeStar project is ready, you can open up the default project code using Cloud9 IDE or git clone and open it using your local IDE.  

![CodeStar Project Ready](/assets/images/2019-06-15-aws-serverless-cd-ci-using-codepipeline-and-codestar/codestar-codepipeline-setup-1-codestar.png)

### 2. Add Production Branch
Add `FunctionName: !Sub 'hello-world-${Stage}'` property to the default HelloWorld function. This function name value is based on Stage parameter value. 

`!Sub` is a CloudFormation template intrinsic function that replaces a variable with the specified value when a project is built.

```yaml
Resources:
  HelloWorld:
    Type: AWS::Serverless::Function
    Properties:
      Handler: index.handler
      Runtime: python3.7
      FunctionName: !Sub 'hello-world-${Stage}'
      ...
```

Template.yml on Cloud9 IDE.  

![Cloud9 Edit yaml](/assets/images/2019-06-15-aws-serverless-cd-ci-using-codepipeline-and-codestar/codestar-codepipeline-setup-2-edit-yaml-functionName.png)


After that, run the following Git commands to push function name change and create a new Git branch for production. If you are on Cloud9 IDE, you can click `+` button and select `New Terminal` to open a terminal tab to run the following commands.    

```bash
git add template.yml; 
git commit -m 'update function name'; 
git push
git checkout -b prod; 
git push -u origin prod
```

### 3. Edit Dev Pipeline
Open CodeStar project console. On the left panel of a CodeStar project console, you can see a Pipeline button. Clicking on it will open up the default pipeline created for your project. At this step, you will modify the default pipeline to make it a development pipeline.

Click on `Edit` button edit pipeline.   

![CodePipeline Console](/assets/images/2019-06-15-aws-serverless-cd-ci-using-codepipeline-and-codestar/codestar-codepipeline-setup-5-default-codepipeline.png)

Click `Edit stage` on GenerateChangeSet and edit button to edit pipeline 'GenerateChangeSet' action.  

![CodePipeline Edit GenerateChangeSet](/assets/images/2019-06-15-aws-serverless-cd-ci-using-codepipeline-and-codestar/codestar-codepipeline-setup-6-edit-generateChangeSet.png)

Scroll to advanced section, click the arrow icon to the left of Advanced subtitle and an input field for parameter overrides will show up. Add `"Stage": "Dev"` to parameter JSON object.   

![CodePipeline GenerateChangeSet Parameter JSON object](/assets/images/2019-06-15-aws-serverless-cd-ci-using-codepipeline-and-codestar/codestar-codepipeline-setup-7-add-stage-param.png)

After that, click `Done` to close action menu and `Save` button on top to save changes.

You would see the following warning popup saying that changes saved cannot be undone when you save pipeline changes for the first time.  

![CodePipeline GenerateChangeSet Parameter JSON object](/assets/images/2019-06-15-aws-serverless-cd-ci-using-codepipeline-and-codestar/codestar-codepipeline-setup-7-5-save-pipeline-changes-the-first-time.png)

### 4. Clone Pipeline
Now, development pipeline is ready. You can clone this pipeline to create a production pipeline.
Click `Clone pipeline` button to open up clone pipeline menu.

![CodePipeline Clone Pipeline](/assets/images/2019-06-15-aws-serverless-cd-ci-using-codepipeline-and-codestar/codestar-codepipeline-setup-8-clone-action.png)

Do the following to create a production pipeline.
1. Change pipeline name to something that makes sense. I usually add the word `prod` to inform colleagues that this is the prod pipeline.

2. Choose `new service role` to create a new service role for your production pipeline.  

3. Choose `custom location` for Artifact store and search for your project name in `Bucket` field. Based on typeahead suggestion, select the same S3 bucket location as the default pipeline.  

4. Click `clone` to start cloning pipeline.

### 5. Configure Prod Pipeline
After production pipeline is created, configure it to make it build from prod branch.

Click `Edit` on top to switch to pipeline edit mode. Then, click `Edit stage` in 'Edit:Source' stage. Next, click edit button (inside red circle in the picture below) to modify ApplicationSource action.   

![CodePipeline Edit Application Source](/assets/images/2019-06-15-aws-serverless-cd-ci-using-codepipeline-and-codestar/codestar-codepipeline-setup-9-edit-prod-pipeline.png)

On the 'Edit action' menu, look for 'Branch name' and change source branch to prod (it was created in step 2) to make pipeline build from prod branch. Click `Done` to complete the change.  

![CodePipeline Application Source](/assets/images/2019-06-15-aws-serverless-cd-ci-using-codepipeline-and-codestar/codestar-codepipeline-setup-10-change-application-git-source-prod.png)

Then, edit Deploy stage to modify GenerateChangeSet and ExecuteChangeSet actions.

![CodePipeline GenerateChangeSet and ExecuteChangeSet Actions](/assets/images/2019-06-15-aws-serverless-cd-ci-using-codepipeline-and-codestar/codestar-codepipeline-setup-11-edit-prod-pipeline-GenerateChangeSet-and-ExecuteChangeSet-actions.png)

On GenerateChangeSet 'Edit action' menu, look for 'Change set name', it is somewhere in the middle of the menu.  

Copy 'Change set name' value as you will need to paste it back later. As of June 2019, its value is `pipeline-changeset`.  

Look for 'Stack name' and change its value to create a new stack. I usually add the word `prod` to label it as prod stack. When you do that, 'Change set name' field is reset. Thus, paste the copied value in 'Change set name' field.  

![CodePipeline GenerateChangeSet Stack](/assets/images/2019-06-15-aws-serverless-cd-ci-using-codepipeline-and-codestar/codestar-codepipeline-setup-13-change-stack-name-to-include-prod.png)

Scroll to advanced section and change `"Stage": "Dev"` key-value to `"Stage": "Prod"` parameter overrides input field.    

![CodePipeline GenerateChangeSet Parameter JSON object](/assets/images/2019-06-15-aws-serverless-cd-ci-using-codepipeline-and-codestar/codestar-codepipeline-setup-14-change-generateChangeSet-param-stage-to-prod.png)

After modifying GenerateChangeSet action, do the same as editing stack name step above for ExecuteChangeSet action.  

On ExecuteChangeSet 'Edit action' menu, look for 'Change set name', it is somewhere in the middle of the menu.  
Copy 'Change set name' value as you will need to paste it back later.  

Look for 'Stack name' and change its value to create a new stack. Use the same stack name as GenerateChangeSet action. After that, paste the copied value in 'Change set name' field.  

![CodePipeline ExecuteChangeSet Stack](/assets/images/2019-06-15-aws-serverless-cd-ci-using-codepipeline-and-codestar/codestar-codepipeline-setup-13-change-stack-name-to-include-prod.png)

Click Done and Save buttons to save pipeline changes.   
When you save, you may see `stack does not exist error` like this, it is ok. A new stack will be created.

![CodePipeline Stack Non-existent error](/assets/images/2019-06-15-aws-serverless-cd-ci-using-codepipeline-and-codestar/codestar-codepipeline-setup-15-ignore-clone-pipeline-error-and-save.png)

### 6. Production Pipeline
Production pipeline has been created successfully. You can test it by clicking `Release change` button to build from prod branch. 

![CodeStar Production Pipeline Ready](/assets/images/2019-06-15-aws-serverless-cd-ci-using-codepipeline-and-codestar/codestar-codepipeline-setup-16-prod-pipeline-build.png)

## CodePipeline Approval Stage
You can also add a manual approval stage to enable code review, prevent accidental commits and other reasons.  

If you include a SNS(Simple Notifcation Service) topic ARN, users listed in that ARN will receive an email notification when approval is needed.  

![CodePipeline Add Approval Stage](/assets/images/2019-06-15-aws-serverless-cd-ci-using-codepipeline-and-codestar/codestar-codepipeline-setup-17-approval-stage.png)

After adding an approval stage, it will appear like this on CodePipeline console when approval is needed.  

![CodePipeline Pending Approval](/assets/images/2019-06-15-aws-serverless-cd-ci-using-codepipeline-and-codestar/codestar-codepipeline-setup-18-pending-approval-on-codepipeline.png)

On CodeStar console, it will look like this.  

![CodeStar Pending Approval](/assets/images/2019-06-15-aws-serverless-cd-ci-using-codepipeline-and-codestar/codestar-codepipeline-setup-18-pending-approval.png)

## Conclusion
Note that git push on master branch will deploy to development API and git push on prod branch will deploy to production API. To prevent accidental commits on production branch, I suggest adding an approval stage. 

With this setup, you can develop new features, execute hot-fix and at the same time keep your production API unaffected.

## Caveats
1. There is a maximum number of 300 pipelines allowed per AWS Region in an AWS account. It is a soft limit which be increased if needed.
2. All resources will be duplicated based by stage. This means you can't have a resource that is declared using a constant name as CodePipeline will try to create the same resource in both pipelines. For example, this DDB table declaration will cause build error.  

```yaml
DdbTable:
  Type: AWS::DynamoDB::Table
  Properties:
    AttributeDefinitions:
      -
        AttributeName: "key"
        AttributeType: "S"
    KeySchema:
      -
        AttributeName: "key"
        KeyType: "HASH"
    BillingMode: "PAY_PER_REQUEST"
    TableName: ddb-table
```

{:start="3"}
3. If you don't mind creating two tables, one for development stage and one for production stage. You can append stage value to their names like this: `TableName: !Sub 'ddb-${Stage}-table'`.  
4. Note that changing DDB name in yaml will cause DDB table to be rebuilt and thus all data will be lost. Be careful if you are adding a production pipeline to an in production yaml.  
5. If there is any build error, it is probably caused by IAM permission issue. Check status reasons and error messages on CodeBuild and CloudFormation console. You may need to add permission for your project CloudFormation role.   
You can check out [Add IAM:CreateRole to CloudFormation Role article](https://jun711.github.io/aws/authorizing-aws-cloudformation-to-perform-iam-create-role/){:target="view_window"} to see how to add permission for your roles.  

{% include eof.md %}
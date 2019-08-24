---
layout: single
header: 
  teaser: /assets/images/teasers/angular.png
title: "What Is A Service In Angular"
date: 2019-08-12 20:00:00 -0800
categories: Web
tags: 
  - 'Angular'
  - 'TypeScript'
  - 'JavaScript'
---
Learn about Angular services and how to write a service.

## What is a service in Angular
A service in Angular is a class that serves a single responsibility and a well-defined purpose. Methods contained within a service perform different tasks to provide functionality for a single purpose. This is a practice to promote modularity, reusability and maintability.     

Angular services are instantiated only once during the lifetime of an application. They are singleton objects. The same instance of a service is injected and reused in components, services, directives and other modular units throughout the application.  

For example, an authentication service: `AuthenticationService`. This service probably contains methods such as signup, login, logout, reset password, verify password and other related functions.   

Another example could be a text processing service: `TextProcessingService`. TextProcessingService contains methods to process and manipulate text but definitely not login and logout functions.

When you create Angular services, you should keep functions that serve the same purpose within the same service.  

## Advantages
Using services provides the following benefits to Angular application development process.  

1. **Modularity**  
Separating methods by different purposes enables encapsulation of related functions into independent modules. This is a good practice of separation of concerns.   
For example, when you want to add a new method for text processing, you know which service it should go to and addition of this method probably would not affect other aspects of the application.  

2. **Reusability**    
Take TextProcessingService for example, if text processing functions are used in several components, is it better to have the same functions written in multiple components or have the functions reside in a service and the service is imported by components that use text processing.   
Keeping text processing functions in a service is a win here because it enables reusing of the same code at multiple places.  

3. **Maintainability**    
Having similar functions at one place (a file) makes it more convenient to make changes to these functions. Instead of having to edit the same function in different files which is more error-prone, you can just edit the function in its respective service file and all its references will use the updated function.

## Angular Service Examples
Check out the following examples to have a sense of how an Angular service looks like.  

`Injectable` is a decorater that describes a service. Including an injectable decorator enables this service to be injected in components, other services or at application root level.

You can include / inject a service in another service. In the example below, `LoggingService` is injected in `UserService`.

```typescript
import { Injectable } from '@angular/core';
import { LoggingService } from './logging.service';
import { User } from './user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private user: User;

  constructor(private loggingService: LoggingService) { }

  setUser(user: User) {
    this.user = user;
  }

  getUser() {
    return this.user;
  }
}
```

### Tree-shakable Service with Factory Provider   
The Angular service example below uses a `service factory provider` that configures the service based on application state during run time. [Read more about Angular Service Factory Provider](https://jun711.github.io/web/angular-factory-providers-and-abstract-classes/){:target="view_window"}.  

When a factory provider definition is included in `userFactory` attribute of the service's `Injectable` decorator, this service is [tree-shakable](https://jun711.github.io/web/angular-tree-shaking/){:target="view_window"}. This is because Angular compiler has a way to determine whether this service should be included in the build bundle when a service factory provider is included this way.

```typescript
import { Injectable } from '@angular/core';
import { userServiceFactory } from './user.service.factory';
import { LoggingService } from './logging.service';
import { 
  SubscriptionService 
} from './subscription.service';

@Injectable({
  providedIn: 'root',
  useFactory: userServiceFactory,
  deps: [LoggingService, SubscriptionService],
})
export class UserService {
  constructor(private loggingService: LoggingServic) { }

  setUser(user: User) {
    this.user = user;
  }

  getUser() {
    return this.user;
  }
}
```

## Next - Injecting Services
In order to use services, you need to inject them. Check out [How to Inject Angular Service article](https://jun711.github.io/web/angular-service-and-how-to-inject-a-service-in-angular/){:target="view_window"} to learn how to inject services in an Angular app.  

{% include eof.md %}
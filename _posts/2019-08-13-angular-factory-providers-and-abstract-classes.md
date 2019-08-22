---
layout: single
header: 
  teaser: /assets/images/teasers/angular.png
title: "Angular Factory Providers And Abstract Classes For More Organized Code Structure"
date: 2019-08-13 20:00:00 -0800
categories: Web
tags: 
  - 'JavaScript'
  - 'Angular'
  - 'TypeScript'
---
Learn how to use Angular factory providers and abstract classes to make your Angular project code more organized.   

## Factory Providers
A factory provider is a provider that can create different services depending on the conditions and information available during run time. This provider contains the methods to instantiate different types of services dynamically based on application state.  

For example, consider `UserService` factory provider. It creates different types of users depending on login information such as different user services for a paid user and a free user. Without using a factory provider, there would be a need to use conditional expressions(if-else) to separate functionalities for paid users and free users inside UserService class.

## User Service Factory Provider
`UserService Factory Provider` can be used to instantiate different types of `UserService` that extends `UserService` abstract class.    

### User Service Abstract Class
The code below is a UserService abstract class that imports `LoginService` and has `setUser` abstract method and `getUser` implemented method.  

`user.service.ts`:    
```typescript
import  { LoggingService } from '/logging.service';

interface User {
  userId: string;
  email: string;
  status: string;
}

abstract class UserService {
  protected user: User;
  constructor(protected logger: LoggingService) { }

  public abstract setUser(userInfo: User): void;

  public getUser(): User {
    return this.user;
  }
}
```
  
**What is an Abstract Class?**  
An abstract class is a base class that consists of common methods which other classes can extend. It is a blueprint that other classes. Abstract methods contained within an abstract class do not contain an implementation. These abstract functions must be implemented by thederiving classes that extend this abstract class.  

**Private and Protected Modifier?**   
When a class member or property is marked private, it cannot be accessed from outside of its class instances.   
On the other hand, protected modifier is pretty similar to private modifier with the exception that class members declared protected can be accessed within deriving classes. Thus, classes that extend a base class can access the base class' protected members.    

The following are `FreeUserService` and `PaidUserService` classes that extend `UserService` abstract class above. Either one of them would be created by UserService factory function depending on application state during run time.  

`user.service.ts`:    
```typescript
class FreeUserService extends UserService {
  constructor(
    protected logger: LoggingService, 
    private freeService: FreeService) {
    super(logger);
  }

  public setUser(user: User): void {
    this.user = user;
    this.freeService.init();
  }
}

class PaidUserService extends UserService {
  constructor(
    protected logger: LoggingService, 
    private paidService: PaidService) {
    super(logger);
  }

  public setUser(user: User): void {
    this.user = user;
    this.paidService.init();
  }
}
```

### User Service Factory Function
A factory function is a function that generates a suitable service based on a set of rules.  

The following is UserService's factory function that is used to create `PaidUserService` when `SubscriptionService`'s 'isPaidUser' method returns true and `FreeUserService` otherwise.  

`user.service.provider.ts`:    
```typescript
let userServiceFactory = (
  logger: LoggingService,
  subscriptionService: SubscriptionService,
  freeService: FreeService, 
  paidService: PaidService) => {
  if (subscriptionService.isPaidUser()) {
    return new PaidUserService(logger, paidService);
  } else {
    return new FreeUserService(logger, freeService);
  }
};
```

### User Service Provider
A service provider is a configuration object that tells Angular what factory function to call and what dependencies to inject when the specified token is called. 

The following is `UserService` provider which can be included in AppModule's `NgModule` decorator provider list or in an Angular component's `Component` decorator provider list. In this case, `UserService` is the token that is being configured by using this userServiceProvider object.   

- **provide** key tells Angular this provider is providing UserService which is the token that will be used in dependency injection.  

- **useFactory** key tells Angular which factory function to used when creating `UserService`.   

- **deps** key tells Angular all the dependencies that are needed by `UserService` factory function.  

`user.service.provider.ts`:    
```typescript
export let userServiceProvider = {
  provide: UserService,
  useFactory: userServiceFactory,
  deps: [
    LoggingService, 
    SubscriptionService, 
    FreeService, 
    PaidService
  ]
};
```

## Import Factory Provider
You can use `UserService Factory Provider` at component level or at application root level.  

### Component level
UserService Factory Provider can be used to provide UserService for a component.  

`user.component.ts`:  
```typescript
import { Component } from '@angular/core';
import { userServiceProvider } from './user.service.provider';

@Component({
  selector: 'app-user',
  providers: [ userServiceProvider ],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent { }
```

### Application level
UserService Factory Provider can be included in the `@NgModule` decorator of AppModule to provide for the whole application.  

`app.module.ts`:  
```typescript
@NgModule({
  declarations: [ AppComponent ],
  imports: [ BrowserModule ],
  providers: [ 
    heroServiceProvider 
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

## Advantages
Use of Service Factory Providers enables injection of a specific type of service based on application state.   
With abstract classes, they can maintain single responsibility for Angular services.    
Furthermore, addition of new extensions to the abstract service would be cleaner as derived classes only have take on a single responsibility.     

{% include eof.md %}

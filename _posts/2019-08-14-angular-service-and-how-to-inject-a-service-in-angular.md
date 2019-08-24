---
layout: single
header: 
  teaser: /assets/images/teasers/angular.png
title: "Angular Service and How to Inject A Service in Angular"
date: 2019-08-14 20:00:00 -0800
categories: Web
tags: 
  - 'Angular'
  - 'TypeScript'
  - 'JavaScript'
---
Learn how to inject an Angular services.  

## What is a service in Angular
An Angular service is a class that serves a single responsibility and a well-defined purpose. Methods contained within a service perform different but related tasks to provide functionality to achieve a purpose.     
Angular services are singleton objects. They are instantiated only once during the lifetime of an application.   

[Read more about Angular Service here](https://jun711.github.io/web/what-is-a-service-in-angular/){:target="view_window"}

## How to inject a service
There are a couple of ways to inject an Angular services. 

### Angular Injector
You can import `Injector` from '@angular/core' and use this injector object to inject / get a service by its token.    

Using injector allows more control on when and whether to inject a service. However, greater flexibility comes with a cost.   

When you use an injector to inject a service and if the service is not used, it is not [tree-shakable](https://jun711.github.io/web/angular-tree-shaking/){:target="view_window"}. This is because Angular compiler cannot identiy all the places in your code where a service is injected and thus, services injected using an injector will be included by default (not tree-shakable).  

**Without Factory Provider**:  
```typescript
import { Component, Injector } from '@angular/core';
import { NoteService } from './note.service';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent {
  noteService: NoteService;

  constructor(private injector: Injector) { }

  ngOnInit() {
    this.noteService = this.injector.get(NoteService);
  }
}
```

**With Factory Provider**:  
You can read more about [Angular Factory Provider](https://jun711.github.io/web/angular-factory-providers-and-abstract-classes/){:target="view_window"} here.  

```typescript
import { Component, Injector } from '@angular/core';
import { NoteService } from './note.service';
import { 
  noteServiceProvider 
} from './note.service.provider';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
  providers: [ noteServiceProvider ]
})
export class NoteComponent {
  noteService: NoteService;

  constructor(private injector: Injector) { }

  ngOnInit() {
    this.noteService = this.injector.get(NoteService);
  }
}
```  

### Component constructor
You can inject an Angular service in a component, service, directive etc by specifying the service and its type in a component's constructor.  

```typescript
import { MyService } from './my.service';

constructor(private myService: MyService) {}
```
  
**Without Factory Provider**:
```typescript
import { Component } from '@angular/core';
import { NoteService } from './note.service';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent {
  constructor(private noteService: NoteService) {}

  takeNote(note) {
    this.noteService.write(note);
  }
}
``` 

**With Factory Provider**:   
When you use Angular service with a factory provider, you can include its factory provider in the providers attribute in a service's `@Component` decorator.    

However, note that configuring a service provider this way is not tree-shakable. This is because Angular compiler cannot determine whether to exclude service factory provider definition based on whether service itself is being used.   

To make your service tree-shakable, service factory provider definition should be included in the service's `@Injectable` decorator. Check out [this tree-shakable service example](https://jun711.github.io/web/what-is-a-service-in-angular/#tree-shakable-service-with-factory-provider){:target="view_window"} on how to write a tree-shakable service that is configured with a factory provider.      

```typescript
import { Component } from '@angular/core';
import { NoteService } from './note.service';
import { 
  noteServiceProvider 
} from './note.service.provider';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
  providers: [ noteServiceProvider ]
})
export class NoteComponent {
  constructor(
    private noteService: NoteService) {}

  takeNote(note) {
    this.noteService.write(note);
  }
}
```

{% include eof.md %}
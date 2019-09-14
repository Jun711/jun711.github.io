---
layout: single
header: 
  teaser: /assets/images/teasers/angular.png
title: "Angular 8 Lazy Loading With Angular CLI"
date: 2019-09-11 20:00:00 -0800
categories: Web
tags: 
  - 'Angular'
  - 'TypeScript'
  - 'JavaScript'
---
Learn how to create a lazy loading path with Angular 8 apps using Angular CLI.    

## Lazy Loading
Lazy loading literally means loading your Angular app in a lazy manner. In other words, it means your Angular app doesn't load a specific feature (JavaScript, HTML and CSS) bundle until it is needed. This is effective in keeping your app's main bundle size small and thus also minimizing initial app load time / first paint time.     

In this guide, I will walk you through steps to configure and create a lazy loading path by using Angular CLI.  

## Angular CLI
Run `ng --version` command to check if you have Angular CLI installed by . If you have it installed, it would print out your Angular CLI, related packages and system information.  

<pre class='code'><code>
     _                      _                 ____ _     ___
    / \   _ __   __ _ _   _| | __ _ _ __     / ___| |   |_ _|
   / △ \ | '_ \ / _` | | | | |/ _` | '__|   | |   | |    | |
  / ___ \| | | | (_| | |_| | | (_| | |      | |___| |___ | |
 /_/   \_\_| |_|\__, |\__,_|_|\__,_|_|       \____|_____|___|
                |___/
    

Angular CLI: 8.3.3
Node: 11.0.0
OS: darwin x64
Angular: 
... 

Package                      Version
------------------------------------------------------
@angular-devkit/architect    0.803.3
@angular-devkit/core         8.3.3
@angular-devkit/schematics   8.3.3
@schematics/angular          8.3.3
@schematics/update           0.803.3
rxjs                         6.4.0

</code></pre>

## Create A Lazy Loading Path
Check out the steps below to create a lazy loading path.   

### 1 Create An Angular App
Use `ng new` command to create an Angular app with routing configured.  

<pre class='code'><code>
ng new lazyLoadingApp --routing --style=scss

</code></pre>

1. `--routing` flag is to set up routing for your Angular app.
2. `--style=scss` flag is to configure your app to process scss stylesheets. 

Run the following command to open the newly created Angular app directory.  

<pre class='code'><code>
cd lazyLoadingApp

</code></pre>

### 2 Generate A Lazy Loading Module  
To create a lazy loading path, you need to encapsulate the code used only for this path in an Angular module. To create a module with an entry component, use `ng generate module` command.   
 
<pre class='code'><code>
ng generate module ./lazy-path-one --route lazy-path-one --module app.module

</code></pre>

The shorter command is
<pre class='code'><code>
ng g m ./lazy-path-one --route lazy-path-one --module app.module

</code></pre>

1. `--route` flag is used to specify the route / path name.  
2. `--module` flag is used to specify the parent module of this new module.  

Under the hood, Angular CLI creates a module with its base path points to an entry component. It also updates app-routing to create a lazy loading path.   

<pre class='code'><code>
CREATE src/app/lazy-path-one/lazy-path-one-routing.module.ts (366 bytes)
CREATE src/app/lazy-path-one/lazy-path-one.module.ts (388 bytes)
CREATE src/app/lazy-path-one/lazy-path-one.component.scss (0 bytes)
CREATE src/app/lazy-path-one/lazy-path-one.component.html (28 bytes)
CREATE src/app/lazy-path-one/lazy-path-one.component.spec.ts (665 bytes)
CREATE src/app/lazy-path-one/lazy-path-one.component.ts (296 bytes)
UPDATE src/app/app-routing.module.ts (370 bytes)

</code></pre>

in **app-routing.module.ts**, Angular CLI adds a lazy loading path.   

<pre class='code'><code>
const routes: Routes = [
  {
    path: 'lazy-path-one', 
    loadChildren: () => import('./lazy-path-one/lazy-path-one.module')
        .then(m => m.LazyPathOneModule)
  }
];

</code></pre>

### 3 Create Components For Module
Run `ng generate component` command to create more components for your lazy loading module.

<pre class='code'><code>
ng generate component ./lazy-path-one/component1 --module lazy-path-one

</code></pre>

The shorter command is  
<pre class='code'><code>
ng g c ./lazy-path-one/component1 --module lazy-path-one

</code></pre>

Under the hood, Angular CLI creates a new component and imports the component in the respective module.  

<pre class='code'><code>
CREATE src/app/lazy-path-one/component1/component1.component.scss (0 bytes)
CREATE src/app/lazy-path-one/component1/component1.component.html (25 bytes)
CREATE src/app/lazy-path-one/component1/component1.component.spec.ts (656 bytes)
CREATE src/app/lazy-path-one/component1/component1.component.ts (286 bytes)
UPDATE src/app/lazy-path-one/lazy-path-one.module.ts (482 bytes)

</code></pre>

## Angular Commands Used
All the commands used in the steps above are listed here.  

<pre class='code'><code>
ng new lazyLoadingApp --routing --style=scss
cd lazyLoadingApp
ng g m ./lazy-path-one --route lazy-path-one --module app.module
ng g c ./lazy-path-one/component1 --module lazy-path-one

</code></pre>


## Verify Lazy Loading On Localhost
Run `ng serve --open` to run your Angular app on localhost. To inspect whether a module is loaded lazily, you can check when it is loaded via a browser DevTools. 

1) On Chrome, you can open up Chrome DevTools by right click `inspect`. The shortcut keys to open DevTools is `Commandd + Option + j` on a Mac or `Ctrl + Shift + j` on a PC.

When DevTools is open, go to `Network` tab.  

2) Type in your lazy loading path after 'http://localhost:4200/'.   
In my case, I use `http://localhost:4200/lazy-path-one` to load my lazy loading module.    
Then, you can notice that a new module that is named after your lazy loading module will be loaded.  

![Inspect Lazy Loaded Module On Chrome DevTools Network Tab](/assets/images/2019-09-11-angular-8-lazy-loading-with-angular-cli/lazy-loading-module-on-network-tab.png)

3) It would be easier to notice the download of a lazy loading module if you add a router link in your `app.component.html`. Then, you can click on `Lazy Load` button to load your lazy loading path.   

In **app.component.html**, add the following button.    

```
<button routerLink="/lazy-path-one">Lazy Load</button>

<router-outlet></router-outlet>
```

## Conclusion
The sample repo is on my [GitHub](https://github.com/Jun711/Angular8LazyLoading){:target="view_window"}.   

Consider using lazy loading to load your app bundles that are not immediately needed to reduce your Angular app load time. With reduced app load time, you would be able to provide better user experience and thus retain more users.  

{% include eof.md %}
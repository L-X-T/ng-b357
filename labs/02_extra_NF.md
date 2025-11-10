# Micro Frontends with Native Federation

[[TOC]]

For this lab, we need to check out another repository, the `flight-app`:

```bash
git clone https://github.com/angular-architects/flight-app --branch lab512-nf-starter
cd flight-app
npm i
```

## Loading a Micro Frontend

In this lab, you create a `miles` app and integrate it into the `flights` app via Native Federation.

### Adding a Miles App

1. Create a new `miles` app:

   ```bash
   nx g app apps/miles
   ```

   **Remarks:** When prompted, select the builder `@nx/angular:application` and `esbuild`. For all other prompts, go with the **default settings** by pressing **ENTER**.

2. Switch to the file `app.html` (`apps/miles/src/app/app.html`) and add some markup:

   <details>
   <summary>Show Code</summary>

   ```html
   <h2>Your Miles</h2>

   <table class="table table-striped">
     <tr>
       <td>FRA - NYC</td>
       <td>3000 Miles</td>
     </tr>
     <tr>
       <td>FRA - MUC</td>
       <td>300 Miles</td>
     </tr>
     <tr>
       <td>FRA - CDG</td>
       <td>600 Miles</td>
     </tr>
   </table>
   ```

   </details><br>

3. Open the file `app.ts` (`apps/miles/src/app/app.ts`) and export the `App` via a `default export`. Also, empty the `import` array:

   <details>
   <summary>Show Code</summary>

   ```typescript
   import { Component } from '@angular/core';

   @Component({
     standalone: true,
     imports: [],
     selector: 'app-root',
     templateUrl: './app.component.html',
     styleUrls: ['./app.component.css'],
   })
   export class App {
     title = 'miles';
   }

   export default App;
   ```

   </details><br>

   **Remarks:** This `default export` will make lazy loading the component a bit easier.

### Adding Native Federation

1. Add Native Federation to the `miles` app and make it a remote:

   ```bash
   nx g @angular-architects/native-federation:init --project miles --port 4201 --type remote
   ```

   **Hint:** Make sure to assign the port `4201`.

2. Add Native Federation to the `flights` app and make it a dynamic host:

   ```bash
   nx g @angular-architects/native-federation:init --project flights --port 4200 --type dynamic-host
   ```

   **Hint:** Make sure to assign the port 4200.

   **Remarks:** A dynamic host is a host that is configured at runtime with a list of available remotes. For this, a .json file is read.

3. Open the file `federation.config.js` (`apps/miles/federation.config.js`) and inspect the `miles` app's federation configuration:

   <details>
   <summary>Show Code</summary>

   ```javascript
   const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

   module.exports = withNativeFederation({
     name: 'miles',

     exposes: {
       './Component': './apps/miles/src/app/app.ts',
     },

     shared: {
       ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
     },

     skip: [
       'rxjs/ajax',
       'rxjs/fetch',
       'rxjs/testing',
       'rxjs/webSocket',
       // Add further packages you don't need at runtime
     ],

     features: {
       ignoreUnusedDeps: true,
     },
   });
   ```

   </details><br>

   **Remarks:** Assure yourself that the `App` is exposed under the alias `./Component`. Also, please note that all the dependencies listed in your `package.json` are shared via the `shareAll` helper.

4. Switch to the file `federation.config.js` in the `flights` app (`apps/flights/federation.config.js`) and see that also here all the dependencies are shared:

   <details>
   <summary>Show Code</summary>

   ```javascript
   const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

   module.exports = withNativeFederation({
     shared: {
       ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
     },

     skip: [
       'rxjs/ajax',
       'rxjs/fetch',
       'rxjs/testing',
       'rxjs/webSocket',
       // Add further packages you don't need at runtime
     ],

     features: {
       ignoreUnusedDeps: true,
     },
   });
   ```

   </details><br>

5. Open the file `federation.manifest.json` (`apps/flights/src/assets/federation.manifest.json`) and adjust it so that **only** the mapping for the `miles` app is configured:

   <details>
   <summary>Show Code</summary>

   ```json
   {
     "miles": "http://localhost:4201/remoteEntry.json"
   }
   ```

   </details><br>

   **Important:** Make sure, you are pointing to port **4201** and **remove** all other mappings.

### Adding a Route for Loading a Remote

1. Open the file `app.routes.ts` (`apps/flights/src/app/app.routes.ts`) and add a route pointing to the component exposed by the `miles` app:

   <details>
   <summary>Show Code</summary>

   ```diff
    import { HomeComponent } from './shell/home/home.component';
    import { BasketComponent } from './shell/basket/basket.component';
    import { ConfigService } from '@demo/shared/util-config';
    import { NotFoundComponent } from './shell/not-found/not-found.component';
   +import { loadRemoteModule } from '@angular-architects/native-federation';

    export const APP_ROUTES: Routes = [
      {

   [...]

        component: BasketComponent,
        outlet: 'aux',
      },
   +
   +  {
   +    path: 'miles',
   +    loadComponent: () => loadRemoteModule('miles', './Component'),
   +  },
   +
      {
        path: '',
        resolve: {
   ```

   </details><br>

   **Important:** Make sure to import `loadRemoteModule` from the package `@angular-architects/native-federation` (!)

2. Switch to the file `sidebar.component.html` (`apps/flights/src/app/shell/sidebar/sidebar.component.html`) and add a menu item for the new route:

   <details>
   <summary>Show Code</summary>

   ```diff
    </a>
        </li>

   +    <hr />
   +
   +    <li>
   +      <a routerLink="miles">
   +        <p>Miles</p>
   +      </a>
   +    </li>
   +
        <li>
          <a routerLink="about">
            <p>About</p>
   ```

   </details><br>

3. Start both applications in a **separate** shell window:

   ```bash
   nx serve flights -o
   nx serve miles -o
   ```

   **Remarks:** If your applications are already running, close the dev server and start it again using `nx serve` as shown above.

   **Hint:** Nx also allows you to start several applications with one command: `nx run-many -t serve -p flights,miles`

4. In the `flights` app, click the link and assure yourself that the `miles` is loaded

## Inspecting Changes to the Bootstrapping

The above-used schematic `@angular-architects/native-federation:init` implements a typical pattern by splitting the bootstrapping into two parts:

- `main.ts`: Initializes Native Federation by loading the manifest. In our case, the the manifest is loaded here. Then, the file `bootstrap.ts` is loaded.
- `bootstrap.ts`: Bootstraps Angular

This pattern is necessary because we need to initialize Native Federation before we can load shared libraries like `@angular/core`.

Have a look into your `main.ts` and `bootstrap.ts` files and inspect the implementation of this pattern.

## Bonus: Sharing Data

In this lab, you establish communication between the Micro Frontend and the shell. For this, you use a shared library as a mediator.

1. Add an `util-auth` lib:

   ```bash
   nx g lib libs/util-auth
   ```

   **Hint:** When prompted, choose the builder `@nx/angular:library`.

2. Create a file `auth.service.ts` in your lib (`libs/util-auth/src/lib/auth.service.ts`):

   <details>
   <summary>Show Code</summary>

   ```typescript
   import { Injectable } from '@angular/core';
   import { BehaviorSubject } from 'rxjs';

   @Injectable({
     providedIn: 'root',
   })
   export class AuthService {
     // userName = '';
     userName = new BehaviorSubject<string>('');

     login(userName: string): void {
       // Auth for very honest people TM
       this.userName.next(userName);
     }
   }
   ```

   </details><br>

3. Open the file `index.ts` (`libs/util-auth/src/index.ts`) and export the `AuthService` for other apps and libs:

   <details>
   <summary>Show Code</summary>

   ```diff
   [...]
   +export * from './lib/auth.service';
   ```

   </details><br>

4. Restart your IDE so that the project config (that was changed when generating the lib) is read again.

   **Remarks:** Just restarting or refreshing parts of your IDE might be enough, but with a full restart, you are on the safe side.

5. Switch to the `flight` app's `app.component.ts` (`apps/flights/src/app/app.component.ts`) and inject the `AuthService`. Use it to log in a dummy user:

   <details>
   <summary>Show Code</summary>

   ```diff
    import { filter, map, merge, Observable } from 'rxjs';
    import { SidebarComponent } from './shell/sidebar/sidebar.component';
    import { NavbarComponent } from './shell/navbar/navbar.component';
    import { ConfigService } from '@demo/shared/util-config';
   +import { AuthService } from '@flight-demo/util-auth';

    @Component({
      standalone: true,

   [...]

      router = inject(Router);
      loading$: Observable<boolean>;

   +  private readonly authService = inject(AuthService);
   +
      constructor() {
   +    this.authService.login('Max Mustermann');
   +
        // TODO: In a later lab, we will assure that
        //  loading did happen _before_ we use the config!
        this.configService.loadConfig();
   ```

   </details><br>

   **Important:** Make sure you import the `AuthService` from `@flight-demo/util-auth`.

6. Open the miles app's `app.ts` (`apps/miles/src/app/app.ts`) and inject the `AuthService`. Use it to retrieve the current user's name and log it to the console:

   <details>
   <summary>Show Code</summary>

   ```diff
   -import { Component } from '@angular/core';
   +import { Component, inject } from '@angular/core';
    import { CommonModule } from '@angular/common';

   +import { AuthService } from '@flight-demo/util-auth';
   +
    @Component({
      selector: 'app-root',
      standalone: true,

   [...]

    })
    export class App {
      title = 'miles';
   +  private readonly authService = inject(AuthService);
   +
   +  constructor() {
   +    this.authService.userName.subscribe((userName) => {
   +      console.log('userName', userName ? userName : 'unknown');
   +    });
   +  }
    }

    export default App;
   ```

   </details><br>

   **Important:** Also here, make sure you import the `AuthService` from `@flight-demo/util-auth`.

7. Start both applications and activate the miles menu item. On the JavaScript console in your browser, you should see the current username.

   **Remarks:** If the applications are already running, you need to restart them so that the new path mapping is respected.

   **Hint:** Use `nx run-many -t serve -p flights,miles` to start both applications with one command.

## Bonus: Loading Routes via Native Federation \*

For this lab, checkout the branch `lab512c-nf-routes`:

```
git add *
git stash
git checkout lab512c-nf-routes
```

1. Inspect the updated `miles` app. It now contains a routing configuration with two routes.

2. Open the miles app's `app.routes.ts` (`apps/miles/src/app/app.routes.ts`) and add a default export at the end:

   <details>
   <summary>Show Code</summary>

   ```diff
    export const APP_ROUTES: Routes = [
      [...]
    ];
   +
   +export default APP_ROUTES;
   ```

   </details><br>

3. Open the miles app's `federation.config.js` (`apps/miles/federation.config.js`) and expose the whole routing configuration:

   <details>
   <summary>Show Code</summary>

   ```diff
    module.exports = withNativeFederation({
      name: "miles",

      exposes: {
   -    "./Component": "./apps/miles/src/app/app.ts",
   +    "./Routes": "./apps/miles/src/app/app.routes.ts",
      },

      shared: {
   ```

   </details><br>

4. Switch to the flight app's `app.routes.ts` (`apps/flights/src/app/app.routes.ts`) and adjust the lazy route so that it loads the whole routing configuration exposed by the `miles` app:

   <details>
   <summary>Show Code</summary>

   ```diff
    export const APP_ROUTES: Routes = [

      {
        path: 'miles',
   -    loadComponent: () => loadRemoteModule('miles', './Component'),
   +    loadChildren: () => loadRemoteModule('miles', './Routes'),
      },

      {
   ```

   </details><br>

5. Open the file `sidebar.component.html` (`apps/flights/src/app/shell/sidebar/sidebar.component.html`) and adjust the menu items so that one can activate both routes exposed by the `miles` app:

   <details>
   <summary>Show Code</summary>

   ```diff
    <hr />

        <li>
   -      <a routerLink="miles">
   +      <a routerLink="miles/miles-list">
            <p>Miles</p>
          </a>
        </li>

   +    <li>
   +      <a routerLink="miles/next-level">
   +        <p>Next Level</p>
   +      </a>
   +    </li>
   +
        <li>
          <a routerLink="about">
            <p>About</p>
   ```

   </details><br>

6. Start both applications (e.g. with `nx run-many -t serve -p flights,miles`) and activate the newly added menu items.

## Bonus: Loading Components without the Router \*

Now, let's load a component via Native Federation without using the router.

1. Open the miles app's `federation.config.js` (`apps/miles/federation.config.js`) and expose the `App` component:

   <details>
   <summary>Show Code</summary>

   ```diff
    module.exports = withNativeFederation({

      exposes: {
        "./Routes": "./apps/miles/src/app/app.routes.ts",
   +    "./Miles": "./apps/miles/src/app/app.ts",
      },

      shared: {
   ```

   </details><br>

1. Switch to the flight app's `about.component.html` (`src/app/shell/about/about.component.html`) and add an `ng-container` with a handle `placeholder`:

   <details>
   <summary>Show Code</summary>

   ```diff
   -<h1>About</h1>
   +<h1>About (Miles loaded dynamically)</h1>

   -Fligh-App by AngularArchitects.io
   +<hr />
   +<ng-container #vcRef></ng-container>
   +<hr />
   ```

   </details><br>

1. Open the flight app's `about.component.ts` (`src/app/shell/about/about.component.ts`) and get hold of the placeholder as a `ViewContainerRef` via `@ViewChild`. In `ngOnInit`, load the exposed component and display it within the placeholder:

   <details>
   <summary>Show Code</summary>

   ```diff
   -import { Component } from '@angular/core';
   +import {
   +  Component,
   +  OnInit,
   +  ViewChild,
   +  ViewContainerRef,
   +} from '@angular/core';
    import { CommonModule } from '@angular/common';
   +import { loadRemoteModule } from '@angular-architects/native-federation';

    @Component({
       [...]
    })
   -export class AboutComponent {}
   +export class AboutComponent implements OnInit {
   +  @ViewChild('vcRef', { read: ViewContainerRef }) vcRef?: ViewContainerRef;
   +
   +  async ngOnInit(): Promise<void> {
   +    const esm = await loadRemoteModule('miles', './Miles');
   +    if (this.vcRef) {
   +      this.vcRef.createComponent(esm.Miles);
   +    }
   +  }
   +}
   ```

   </details>

   **Important:** Make sure to import `loadRemoteModule` from the package `@angular-architects/native-federation` (!)

1. Start both applications (e.g. with `nx run-many -t serve -p flights,miles`) and activate the menu item `About`. It should display the Component `Miles`.

## Bonus: Using Multiple Versions and Frameworks \*

In this exercise, you use Native Federation for loading web components built with different frameworks and versions. For this, we use web components provided via the cloud.

For this lab, checkout the branch `lab512f-nf-multi-starter`:

```
git add *
git stash
git checkout lab512f-nf-multi-starter
```

1. Have a look to the folder `apps/flights/src/app/domains/shared/util-federation-tools` that was added in this branch. It contains a `WrapperComponent` used to load and display a Web Component via Native Federation

2. Open the flight app's federation manifest (`apps/flights/src/assets/federation.manifest.json`) and register the following svelte app:

   ```json
   {
     "miles": "http://localhost:4201/remoteEntry.json",
     "svelte-app": "https://kind-grass-08faefd03.4.azurestaticapps.net/remoteEntry.json"
   }
   ```

3. Switch to the flight app's `bootstrap.ts` and ensure it configures the router using `withComponentInputBindings`:

   ```typescript
   bootstrapApplication(AppComponent, {
     providers: [
       provideHttpClient(),
       provideRouter(
         APP_ROUTES,
         withPreloading(PreloadAllModules),

         // Make sure, this line is added:
         withComponentInputBinding(),
       ),
       importProvidersFrom(NextFlightsModule),
       importProvidersFrom(MatDialogModule),

       provideLogger({}, withColor()),
     ],
   });
   ```

   **Hint:**: You can import `withComponentInputBinding` from `@angular/router`.

4. Open the file `app.routes.ts` (`apps/flights/src/app/app.routes.ts`) and add routes pointing to the provided web components:

   <details>
   <summary>Show Code</summary>

   ```typescript
   [...]

   // Add these imports:
   import {
      WrapperComponent,
      WrapperConfig
   }
   from './domains/shared/util-federation-tools';

   [...]

   // Existing route
   {
      path: 'miles',
      loadChildren: () => loadRemoteModule('miles', './Routes'),
   },
   // Add these routes:
   {
      path: 'svelte-app',
      component: WrapperComponent,
      data: {
         config: {
            remoteName: 'svelte-app',
            exposedModule: './web-components',
            elementName: 'svelte-mfe',
         } as WrapperConfig,
      },
   },
   ```

   </details><br>

5. Switch to the file `sidebar.component.html` (`apps/flights/src/app/shell/sidebar/sidebar.component.html`) and add some menu items for the new routes:

   <details>
   <summary>Show Code</summary>

   ```html
   <li routerLinkActive="active">
     <a routerLink="svelte-app">
       <p>Svelte App</p>
     </a>
   </li>

   <li>
     <a routerLink="about">
       <p>About</p>
     </a>
   </li>
   ```

   </details><br>

6. Start your applications and try out your changes.

## More Details

Please find more details about this approach in this [blog article](https://www.angulararchitects.io/blog/micro-frontends-with-modern-angular-part-2-multi-version-and-multi-framework-solutions-with-angular-elements-and-web-components/). It also explains some workaround needed for Zone.js and the Angular Router.

The used [Svelte Application can be found here](https://github.com/manfredsteyer/nf-svelte-demo/tree/main/remote/src). The file `App.svelte` defines the loaded component. In the file `bootstrap.ts`, this component is wrapped in a Web Component and registered with the browser.

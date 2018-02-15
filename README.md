# ng-recipes
An application created with Angular-cli, to share and create recipes, and manage a customized shopping list of ingredients for any recipes that the user is interested in making.

Main Tech Stack:

- Angular / Angular-cli
- Firebase to save all user data, handled through their REST api
- Authentication also handled with Firebase, using their custom authentication api
- Materialize for css styles and layout
- SASS style sheets

Technical Structure and Features:

- The app is made of 6 modules, each defining its own NgModule:
  - Root app module
  - Core module: Holds any core features, like the Header and Home page.
  - Auth module: Is in charge of any authentication features, including sign in, register, log out, and handling route guards depending on the user's authentication status and permissions.
  - Recipes module: Contains all features related to reading, writing or editing recipes.
  - Shopping list: Manages a shopping list of ingredients for the currently logged-in user, or for a guest if the user is not logged in.
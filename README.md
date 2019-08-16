HMS REACT CMS TEMPLATE GUIDE (V1.0) 
===================================

I. Preparation
--------------
1. Download and install `Nodejs/ NPM` base on platforms:
   * https://www.npmjs.com/get-npm
   * https://nodejs.org/en/download/
2. Run `npm install` to download related libraries.

II. Project Structure
---------------------
* Using Ant-Design class UI to using/ build customs components for project: https://ant.design.
* Also allow to customize theme by change config in file `config-overrides.js`. Reference based on: https://ant.design/docs/react/customize-theme
* All of projects are located in `./src` folder, The project structure follow up the N-Tier architecture:
1. src/assets: this place store all resource related: `fonts`, `images`, `third party libraries`.
2. src/commons: 
    * components: store all custom or can re-use commons. 
    * constants: defined constants, endpoints.
    * localization: defined translation messages for literal, error message.
    * route: defined route, permissions for menus, action in components.
    * utils: for some commons function.
3. src/pages: store new pages 
4. src/services: service player, which handle fetch data from dropdown, grid also for upsert data.

III. Configuration
---------------------
1. Setup `.env` config. Environment runtime config base on suffix of name file.\
Ex: `.env.development` ===> all config for `development`
2. Change some config values about api `endpoint`, `default language`, or `google captcha site key` adapted your environment.
```
REACT_APP_API_URL="http://localhost:5000/api/"
REACT_APP_DEFAULT_LANGUAGE="en"
REACT_APP_GOOGLE_CAPTCHA_SITE_KEY="6LcxWawUAAAAAPaXCoZDsDIpB8NYgqstJPsxfVgh"
```

IV. Run
-------
* `npm start` ===> run local for development mode.
* `npm build:dev` ===> build code for development environment.
* `npm build:staging` ===> ===> build code for staging environment
* `npm build` ===> build code for production environment.

```
"scripts": {
    "clean": "rimraf ./build",
    "start": "npm run clean && env-cmd -f .env.development.local react-app-rewired start",
    "build:dev": "npm run clean && env-cmd -f .env.development react-app-rewired build",
    "build:staging": "npm run clean && env-cmd -f .env.staging react-app-rewired build",
    "build": "npm run clean && react-app-rewired build"
  },
```
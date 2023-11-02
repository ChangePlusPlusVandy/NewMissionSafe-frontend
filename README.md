<h1 align="center">react-express-firebase-auth-template</h1>
<div>
  <p align="center">
    This is a template for a TypeScript React app with a Node/Express backend and Firebase authentication, with ESLint and Prettier configured.
    <br />
    <a href="https://github.com/ChangePlusPlusVandy/react-express-firebase-auth-template/issues">Report Bug</a>
    ·
    <a href="https://github.com/ChangePlusPlusVandy/react-express-firebase-auth-template/issues">Request Feature</a>
  </p>
</div>

**Note**: if you run into any issue while following or using this template. **Report a bug** or **Request Feature** and assign it to either **@intiserp** or **@salomondush**. Feel free to reach out to us via slack as well.

## Overview of Technologies Used

- TypeScript: A superset of JavaScript that adds static type definitions. This allows us to catch errors at compile time rather than runtime.
- React: A JavaScript library for building user interfaces.
- Node/Express: A JavaScript runtime environment and web framework for building server-side applications.
- Firebase Auth: A platform developed by Google for creating mobile and web applications. It offers a variety of services including authentication, which we use in this project.
- ESLint: A tool for identifying and reporting on patterns found in JavaScript code, with the goal of making code more consistent accross team members and avoiding bugs.
- Prettier: A tool for automatically formatting code to make it more readable and consistent accross team members.

## Firebase Setup

Create a firebase project using the [Firebase Console](https://console.firebase.google.com/u/0/?pli=1)

- Click create project
- Give your project a name (preferably the same as your repo/project name) and click continue.
- Enabling Google Analytics is optional, click continue, and finally click create project.
- When your project is created, click continue.
- You'll be presented with a dashboard for your project. Click on **Authentication** from the displayed cards, Click **Get Started** go to the **Sign-in method** tab.
- The biggest advantage of firebase is that it allows you to authenticate users using a variety of methods. For this project, we will use email/password. Click on the **Email/Password** tab, enable it, and save. This will allow users to sign in using their email and password.
- You can add other providers later on if you wish.

## Firebase React Integration

After creating the project, you need to create an application

- On your Firebase Console Dashboard left navigation, click on on the settings icon, and choose **Project Settings**, then select this icon `</>` to add an application to your project. Give it a name and click register app.
- This above step will give you config data. Create `.env` file in the root directory of the `react-auth-template` project and store the config data with the following exact format and names (don't use lowercase camelCase variables from firebase, use uppercase instead with the REACT*APP* prefix):
  **measurementId is not needed**

```
// .env

VITE_FIREBASE_API_KEY =
VITE_FIREBASE_AUTH_DOMAIN =
VITE_FIREBASE_PROJECT_ID =
VITE_FIREBASE_STORAGE_BUCKET =
VITE_FIREBASE_MESSAGING_SENDER_ID =
VITE_FIREBASE_APP_ID =
```

**NOTE:** Make sure that you `.env` files are added to `.gitignore`, so that your secrets won't be uploaded to github. I included them in the `.gitignore` file in the root directory, but if you restructure the project in anyway, you'll need to update the path. If you want to add more environment variables, make sure to prefix them with `VITE_` so that vite can access them.

## Frontend and Backend interaction

In `react-auth-template/src/components/Home.ts`, there's a writen sample code in the useEffect hook
that makes a request to get a quote from a protected route/endpoint at the backend using the token from the frontend. You can use this as a reference to make requests to protected routes at the backend. After configuring the backend, you can test this by running the frontend and backend and navigating to the home page. You should see a quote displayed on the page.

You will notice that the fetch request is made to `/api/example` without specifying the actual url or port number of the backend. This is because we are using a proxy in the `vite.config.ts` file of the frontend to redirect all requests to the backend we specify. As it's currently set up, all the requests to `/api/**` will be redirected to `http://localhost:3001/**`. For example, requests to `/api/name` will be redirected to `http://localhost:3001/name`. This is super convenient because when we deploy our app, we don't have to change the url of the backend in every file that makes a request, we just have to change the proxy in the `vite.config.ts` file.

## Firebase Node/Express Integration

At the backend, we will create a middleware that we will rely on for accessing frontend requests to verify tokens. We will utilize a [firebase backend module](https://github.com/ChangePlusPlusVandy/react-express-firebase-auth-template/issues) to verify the token that will be recieved from frontend requests.

- We will need to create a configuration file with our service account crednetials (created earlier). This will alow us to use the Firebase Admin SDK service account to communicate with Firebase when verifying a token.
- Go to Frebase Dashboard and click the settings icon from the side panel and choose **Project Settings**
- Click **Service Accounts** tab and click **Generate New Private Key**, and click **Generate Key** to confirm.
- Navigate to the `express-auth-template/config/` directory and create `serviceAccountKey.json` file in that directory, **Exactly that name**, and paste the contents from the downloaded json file. Note that this file is already added to `.gitignore` and **should not be uploaded to github**.

The default port is set in `index.ts` in the backend as `3001`. If you want to change it, you can do so by creating a `.env` file in the root directory of the `express-auth-template` project and store the port number with the following exact format and name:

```
PORT=3001
```

Just make sure that the port number in the `.env` file is the same as the one in the `vite.config.ts` file in the frontend.

## Running the project

### Running the backend

- Navigate to the backend folder

```
express-auth-template
```

and run

```
npm install
```

to install dependencies. Run

```
npm start
```

to start the server.

- The server should be running on port `3001`.

### Running the frontend (React)

- Navigate to the frontend directory

```
react-auth-template
```

and run

```
npm i
```

to install dependencies. Run

```
npm start
```

to start the frontend app.

- Choose register and provide your email and password to test the app. Once you submit, firebase will authenticate you and redirect you to the home page. Then you can click to go to your profile then logout. Now login with the same credentials, and you'll be redirected to the home page where you'll see a quote displayed from the backend.

# Sources

For a more detailed guide on how to set up firebase, and an explanation of all involved steps and files, check out the guide below.

- [Build Authentication using Firebase | React | Express](https://dev.to/earthcomfy/build-authentication-using-firebase-react-express-28ig#firebase-react)

**Note**: if you run into any issue while following or using this template. **Report a bug** or **Request Feature** and assign it to either **@intiserp** or **@salomondush**. Feel free to reach out to us via slack as well.

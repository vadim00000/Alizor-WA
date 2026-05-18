# Workout Builder Application

## Project Description

This project is a web application that allows users to create and manage personalized workouts. Users can browse exercises by body part using the ExerciseDB API, create multiple workouts, and organize exercises within each workout, including sets and repetitions.

The application is built using React with MobX for state management and integrates with external APIs and Firebase for data persistence.

---

## Implemented Features

High-level features:

- Exercise browsing and discovery
- Create and manage workout templates
- Record and persist sessions per user
- Profile and weight history tracking
- Statistics and records with charts (weight history, PRs, muscle summaries)
- Authentication and per-user persistence

---

## Project Structure

```
index.html
package.json
vite.config.js
public/
src/
  index.css
  resolvePromise.js

  firebase/
    config.js

  models/
    authModel.js
    sessionModel.js
    profileModel.js
    trainModel.js
    statsModel.js
    firestoreModel.js
    mobxReactiveModel.js

  reactjs/
    App.jsx
    main.jsx
    homePresenter.jsx
    navBarPresenter.jsx
    profilePresenter.jsx
    statsPresenter.jsx
    trainPresenter.jsx
    authPresenter.jsx

  views/
    homeView.jsx
    navBarView.jsx
    profileView.jsx
    statsView.jsx
    trainView.jsx
    recordsView.jsx
    weightChart.jsx

  css/
    index.css
    navBar.css
    profile.css
    stats.css
    train.css
    home.css

```

---

## How to run 
1) Prerequisites

- Node.js (>=16 recommended) and npm installed
- A Firebase project configured (Firestore) and credentials set in `src/firebase/config.js` or environment variables used by that file

2) Install dependencies

```bash
# from project root
npm install
```

If you plan to use the charts (recommended for Stats), install these packages as well:

```bash
# install Chart.js, react wrapper and date adapter
npm install chart.js react-chartjs-2 chartjs-adapter-date-fns --save
```

3) Local development server

```bash
# start dev server (Vite)
npm run dev
```

Open http://localhost:5173 (or the URL indicated by Vite) in your browser.


---

## Third-Party Components

This project uses several third-party libraries and external services:

### Frameworks & Libraries
- React → UI framework
- React Router DOM → client-side routing
- MobX + mobx-react-lite → state management and reactivity
- Firebase → authentication and Firestore database persistence
- Vite → development server and build tool

### Charts
- chart.js
- react-chartjs-2
- chartjs-adapter-date-fns

These libraries are used for the statistics and weight history visualizations.

### External APIs
- ExerciseDB API (RapidAPI)
  - Used to fetch body parts and exercise information.
  - Implemented in:
    - `apiConfig.js`
    - `exerciseSource.js`

### User-visible third-party components
- Exercise animations/GIFs returned by ExerciseDB API
- Loading GIF used in:
  - `views/suspenseView.jsx`


# Workout Builder Application

## Project Description

This project is a web application that allows users to create and manage personalized workouts. Users can browse exercises by body part using the ExerciseDB API, create multiple workouts, and organize exercises within each workout, including sets and repetitions.

The application is built using React with MobX for state management and integrates with external APIs and Firebase for data persistence.

---

## Implemented Features

The following functionalities have been implemented:

* Fetch and display available body parts from the ExerciseDB API
* Fetch and display exercises for a selected body part
* Create multiple workouts with custom names
* Select a workout and add exercises to it
* Remove exercises from a workout
* Manage sets for each exercise (add/remove sets, edit weight and repetitions)
* Delete a selected workout
* Persist workouts using Firebase Firestore (per user)
* Handle asynchronous operations using a structured promise state pattern

---

## Planned Improvements

The following features are planned but not yet implemented:

* Improve the user interface (layout, styling, and responsiveness)
* Add search and filtering for exercises
* Enable renaming of workouts
* Add statistics and records features
* Enhance the home page

---

## Project Structure

```txt
src/

  apiConfig.js          # Configuration for API requests (headers, base URL)
  App.css               # Global application styles
  exercise.js           # Exercise data structure / helpers
  exerciseSource.js     # API calls to fetch exercises and body parts
  index.css             # Base styling
  resolvePromise.js     # Utility to manage async promise states
  utilities.js          # General helper functions
  workout.js            # Workout and exercise creation logic

  firebase/             # Firebase configuration and authentication
    auth.js             # Authentication logic
    config.js           # Firebase initialization

  models/               # Application state and business logic (MobX)
    authModel.js        # Authentication state management
    firestoreModel.js   # Firestore interaction logic
    profileModel.js     # User profile state
    sessionModel.js     # Session handling (user state)
    trainModel.js       # Workout and training logic

  presenters/           # Connect models with views (logic + interaction)
    authPresenter.jsx   # Handles authentication flow
    profilePresenter.jsx# Handles profile interactions

  reactjs/              # Main React presenters and app orchestration
    App.jsx             # Root React component
    main.jsx            # Application entry point
    homePresenter.jsx   # Home page logic
    navBarPresenter.jsx # Navigation bar logic
    profilePresenter.jsx# Profile logic (duplicate responsibility)
    recordsPresenter.jsx# Workout records logic
    statsPresenter.jsx  # Statistics logic
    trainPresenter.jsx  # Training/workout logic

  views/                # Pure UI components (rendering only)
    authView.jsx        # Authentication UI
    bodyPartsView.jsx   # Displays body parts list
    exercisesView.jsx   # Displays exercises list
    homeView.jsx        # Home page UI
    navBarView.jsx      # Navigation bar UI
    profileView.jsx     # Profile UI
    recordsView.jsx     # Records UI
    statsView.jsx       # Statistics UI
    suspenseView.jsx    # Loading/error handling UI
    workoutsView.jsx    # List of workouts UI
    workoutView.jsx     # Single workout UI (sets, reps, etc.)
```

---

## Notes

* API keys are managed using environment variables and are not included in the repository
* Each developer must provide their own API key when running the project locally
* Firebase is used for persistent storage of workouts

---

**Overview**

- Links
- Back-end
- Intro
- Technologies
- Techniques
- Video
- Final Thoughts

**Links**

Link to live site: To be added...

**Back-end**

Link to backend project: https://github.com/gillty1995/futbol-scores-backend

**Intro**

This project is a football-themed web application that allows users to search for football teams, view live games, and save their favorite games. The application provides user authentication so that users can register, log in, and save game data to their personal profile. It integrates with a football API to display live and team-specific data while leveraging a custom-built backend server for handling user authentication and saving user-specific information.

**Technologies**

    •	React: Used to build the user interface and manage component-based structure.
    •	React Router: Handles client-side navigation between pages and routes.
    •	Axios: Used for making API requests to both the backend server and football API.
    •	Express.js: Backend framework used to build the API for user authentication and saved game management.
    •	MongoDB: NoSQL database for storing user profiles, authentication tokens, and saved games.
    •	AuthContext / CurrentUserContext: Provides global state management for user authentication and session data.
    •	CSS Modules: Used for styling components with modular, maintainable CSS.
    •	RapidAPI’s Football API: Provides football data, including team statistics and live matches.
    •	JWT (JSON Web Tokens): Handles authentication tokens, stored in localStorage and used for protected routes.
    •	Local Storage: Persists user authentication tokens and user state across sessions.

**Techniques**

    •	State Management: The app uses React’s useState and useEffect hooks for managing application state, such as user authentication status, search results, and saved games. Context APIs like AuthContext and CurrentUserContext are used to provide global state for authentication and the current user’s data.
    •	User Authentication:
    •	Registration & Login: Users can register and log in through modals that open on the homepage. Upon successful login, a JWT token is returned from the backend and stored in localStorage, allowing users to remain logged in across sessions.
    •	Token Validation: The backend checks the validity of the JWT token on every request to authenticate users before giving access to protected routes.
    •	Saving Games:
    •	Authenticated users can save football games of interest to their profile. These saved games are stored in the backend database and are accessible across sessions.
    •	API Integration:
    •	Football Data: The app integrates with RapidAPI’s Football API to allow users to search for football teams, view live matches, and explore team details.
    •	Protected Routes: Routes like the “Saved Games” section are only accessible to logged-in users.
    •	Error Handling: The app implements error handling for API requests and user actions. For example, users will receive feedback if their login fails, or if their search query returns no results from the football API.

**Video**

Video demonstration of project: To be added...

**Final Thoughts**

This project demonstrates the integration of a custom-built backend with a React frontend. By implementing user authentication, saved data management, and API integration, it provides a dynamic and personalized experience for football fans. With technologies like MongoDB, Express, and JWT, this project showcases the core concepts of full-stack web development.

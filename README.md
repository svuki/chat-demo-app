# Toy Typescript Chat App (Zustand + React-Router + PouchDB + SASS)

This is a small chat application app using zustand, react-router, and pouchdb. It supports chatting bewteen different tabs or windows of the same browser. It is not a fully fledged chat application, rather a minimal demonstration of how to stitch things together.

When a new tab is opened, the tab is assigned a username. The application opens to the default chat room. From there the user can send messages, navigate to other chat rooms, or create additional chat rooms.

This app demonstrates the following:
1. using zustand for basic shared state
2. using pouchDB for basic CRUD operations
3. using pouchDB for realtime update listening
4. using react-router for routing
5. using SASS in place of plain css files

## How This Was Setup

1. Create a new react app: `npx create-react-app chat-app --template typescript`
2. Install dependencies: `npm i zustand react-router-dom pouchdb pouchdb-find`
3. Install SASS globally: `npm i -g sass` (this is the sass CLI tool).
4. Start the development server: `npm start`. This automatically compiles code changes and updates the dev server.
5. Start the SASS watch process: `sass --watch src/sass:public/stylesheets`. This automaticalyl compiles any sass files in src/sass and writes them to public/stylesheets.

### Adding React Cosmos

React cosmos is a UI for component driven development. Here are the steps to get it setup.
1. Install react cosmos.
2. Add a cosmos.config.json to the root of the repo.
3. Start react cosmos `npm run cosmos`
4. Navigate to localhost:5000 to view components.
5. Additional components can be added by created files called `xxx.fixture.jsx` in the `src/` folder.

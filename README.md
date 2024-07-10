# Toy Typescript Chat App (Zustand + React-Router + PouchDB + SASS)

This is a small chat application app using zustand, react-router, and pouchdb. It supports chatting bewteen different tabs or windows of the same browser. It is not a fully fledged chat application, rather a minimal demonstration of how to stitch things together and enable development tooling (react cosmos + chrome plugins for react and redux).

When a new tab is opened, the tab is assigned a username. The application opens to the default chat room. From there the user can send messages, navigate to other chat rooms, or create additional chat rooms.

This app demonstrates the following:
1. using zustand for basic shared state
2. using pouchDB for basic CRUD operations
3. using pouchDB for realtime update listening
4. using react-router for routing

## How This Was Setup

(these are more notes for me when I eventually revisit this)

1. Create a new react app: `npx create-react-app chat-app --template typescript`
2. Install dependencies: `npm i zustand react-router-dom pouchdb pouchdb-find` (note: also install types for typescript)
3. Start the development server: `npm start`. This automatically compiles code changes and updates the dev server.

### Adding React Cosmos

React cosmos is a UI for component driven development. Here are the steps to get it setup.
1. Install react cosmos.
2. Add a cosmos.config.json to the root of the repo.
3. Start react cosmos `npm run cosmos`
4. Navigate to localhost:5000 to view components.
5. Additional components can be added by created files called `xxx.fixture.jsx` in the `src/` folder.

### Adding React & Redux Dev Tools

Zustand comes with mdidleware for enabling redux's dev tools extensions. Because we don't have an explicit reducer like in redux, state changes are logged as 'anonymous' changes, but it is still useful.

1. Install react-tools plugin from chrome: https://chromewebstore.google.com/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi
2. Install redux devtools plugin from chrome: https://chromewebstore.google.com/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd
3. Maybe it shows up in your dev tools. If it doesn't (didn't for me the first time), open devtools, hit the gear in the upper right corner, and at the bottom of the preferences tab hit Restore defaults and reload.
4. Then open devtools and you should see three new tabs: Redux, Components, and Profiler.

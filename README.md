# Toy Typescript Chat App (Zustand + PouchDB)

This is a small chat application app using zustand, and pouchdb. It supports chatting bewteen different tabs or windows of the same browser. It is not a fully fledged chat application, rather a minimal demonstration of how to stitch things together and enable development tooling (react cosmos + chrome plugins for react and redux).

When a new tab is opened, the tab is assigned a username. The application opens to the default chat room. From there the user can send messages, navigate to other chat rooms, or create additional chat rooms.

This app demonstrates the following:
1. using zustand for basic shared state
2. using pouchDB for basic CRUD operations
3. using pouchDB for realtime update listening

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

## Browser URL Management

Initially I experimented with using react-router, but it was awkward to have both react-router and zustand managing the state of my application. I ended up implementing lighweight history management. Chat rooms are the only navigable states. Navigation between chat rooms is handled via the `onEnterRoom` state transition in zustand's state store. This function takes an addition parameter that indicates the desired history action -- a replacement of the current page, a navigation to a new page, or backtracking in the history. Depending on which it is, we either push new state on the history stack, replace it, or do nothing.

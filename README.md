# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

## ChatBot Feature

This application includes a ChatBot powered by OpenAI's GPT-3.5 that can answer questions about stars and galaxies.

### Setup

1. Create a `.env` file in the root directory with the following content:
   ```
   REACT_APP_API_URL=http://localhost:3001
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=3001
   MONGODB_URI=mongodb://localhost:27017/stargazer_db
   ```

2. Replace `your_openai_api_key_here` with your actual OpenAI API key. You can get one from [OpenAI's website](https://platform.openai.com/api-keys).

3. Install dependencies:
   ```
   npm install
   ```

4. Make sure MongoDB is installed and running on your machine. If you don't have MongoDB installed, you can download it from [MongoDB's website](https://www.mongodb.com/try/download/community).

5. Seed the database with initial star data:
   ```
   npm run seed
   ```

### Running the Application

To run both the React frontend and the Express backend:

```
npm run dev
```

This will start the React development server on port 3000 and the Express server on port 3001.

### Backend Features

The backend includes:

1. **Express.js Server**: Serves the API endpoints and handles requests from the frontend
2. **MongoDB Database**: Stores information about stars, galaxies, and chat conversations
3. **OpenAI Integration**: Processes user questions through the OpenAI API
4. **Persistent Conversations**: Saves chat history so users can continue conversations later

### API Endpoints

- **GET /api/stars**: Get a list of stars and galaxies 
- **GET /api/stars/:id**: Get information about a specific star/galaxy
- **POST /api/stars**: Add a new star/galaxy to the database
- **GET /api/conversations**: Get a list of recent conversations
- **GET /api/conversations/:id**: Get a specific conversation
- **POST /api/chat**: Send a message to the chatbot

### Using the ChatBot

The ChatBot appears as a chat button on all pages except the Contact Us page. Click the button to open the chat window and ask questions about stars, galaxies, and other astronomical objects.

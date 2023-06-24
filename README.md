# Lunch API

This is the README file for the Lunch API app.

## Description

The Lunch API is a backend application built with Node.js and Express.js. It provides various endpoints to manage lunch-related data. It includes features such as authentication, Google API integration, and data validation using Zod.

## Installation

1. Clone the repository: `git clone https://github.com/your-username/lunch-api.git`
2. Change to the project directory: `cd lunch-api`
3. Install the dependencies: `npm install`

## Usage

To start the application locally for development, run the following command:

```bash
npm run dev
```

The server will start running at http://localhost:8080.

## Scripts

The following scripts are available:

- `build`: Transpiles the TypeScript code to JavaScript.
- `start`: Starts the server using the transpiled JavaScript code.
- `dev`: Starts the server in development mode using ts-node-dev for automatic restart on file changes.
- `test`: Runs the unit tests using Jest.
- `deploy`: Builds the application and deploys it using flyctl.

To execute a script, run npm run <script-name>.

## Configuration

The Lunch API uses environment variables for configuration. Follow the steps below to set up the required environment variables:

Copy the .env_template file to .env:

```bash
cp .env_template .env
```

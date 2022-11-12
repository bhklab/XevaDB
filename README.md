# XevaDB: A Database For PDX Pharmacogenomic Data.

## Setup Instructions

- Clone the repo
  
```bash
git clone git@github.com:bhklab/XevaDB.git
cd XevaDB
```

- In the project directory, install all server dependencies `npm i`
- Create .env using .env.example as a reference to access the database
- Start the server by running `npm start` or `npm run devstart`(development mode) or `nodemon start`(to see the live updates) command
- Start the client (development mode) by running `npm start`
- Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Dependencies

- ReactJS
- React-Router
- NodeJS/ExpressJS
- KnexJS
- Body-parser

## Dev Dependenices

- Nodemon
- Eslint

## Build Instructions

### `cd client && npm build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

## Servers

- Testing Server: [http://beta.xevadb.ca](http://beta.xevadb.ca)
- Production Server: [http://xevadb.ca](http://xevadb.ca)

## Migrations

- If knex is globally available use `knex` with the specific command else use `./node_modules/.bin/knex`.
- `knex migrate:make (migration_name)` - To create a new migration file.
- `knex migrate:latest` - To run the latest migrations and create corresponding tables.

## Seeds (Seeding Files)

- Create manually a file (`touch file_name`).
- Run `knex seed:run` to run the seeding file(s) in order to seed the table(s) in the database.

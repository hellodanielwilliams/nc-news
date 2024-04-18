# Northcoders News API

## 📰 Overview

This is a backend project created as part of the Northcoders software development bootcamp.

It comprises a RESTful API for creating, reading, updating and deleting data for "NC News". This will be a social news aggregation site with articles and comments that can be up or downvoted (something along the lines of [Reddit](https://www.reddit.com/)). The API provides endpoints to interact with the content stored in a PostgreSQL database.

## 💫 Project Features and Technologies

* __RESTful API__: Facilitating CRUD operations on data.
* __PostgreSQL Database__: Structured and relational data storage.
* __Node.js with Express__: Server-side logic and routing.
* __MVC framework__: Organised with MVC architecture.
* __Jest and Supertest__: Unit and integration testing.


## 🌐 [Hosted Version](https://nc-news-dw.onrender.com/api)

A hosted version of this API is available [here](https://nc-news-dw.onrender.com/api).  
The __[/api](https://nc-news-dw.onrender.com/api)__ endpoint provides details of all currently available endpoints.  
> ℹ️ __Note:__ The API is hosted on the free tier of [Render](https://render.com). This means that the server goes to sleep after 15 minutes of inactivity. Therefore, there may be a short delay when accessing the API as the server spins up. If the link does not connect at first, please wait a few moments and try again.

---

## ⚙️ Installation Instructions

Follow these instructions if you want to install and run a local copy of this project.

### Prerequisites

* Node.js (v21.4.0 or later)
* PostgreSQL (v14.10 or later)

#### 1. Clone this repo

Navigate to your target directory and clone this repo using your preferred method, e.g.:

```bash
git clone https://github.com/hellodanielwilliams/nc-news.git
```
Open the directory in your preferred editor.

#### 2. Install dependencies

This project uses the following dependencies:
* "dotenv"
* "express"
* "pg"

and dev dependencies:
* "husky"
* "jest"
* "jest-extended"
* "jest-sorted"
* "supertest"
* "pg-format"

All can be installed by running the following command in the root directory:
```bash
npm install
```

#### 3. Create environment variables

The database names for the test and development environments have been hidden in .env environment variable files. You will need to recreate these files locally in the root directory. You can do from this the command line as follows:

```bash
echo "PGDATABASE=nc_news_test" > .env.test
echo "PGDATABASE=nc_news" > .env.development
```

Add both .env files to your .gitignore file.

#### 4. Setup the databases

Ensure that your local postgres server is running.  
A setup.sql file and script have been provided to create the local databases, and can be run with the following command:
```bash
npm run setup-dbs
``` 

#### 5. Run the test suite

The integration tests in app.test.js should now be able to be run properly, with the test database being seeded with test data before each test.  
You can check this with the following command: 
```bash
npm test app.test.js
``` 
#### 6. Seed the development database

If you want to run the development database locally, a script has been provided to execute the run-seed.js file, which can be run as follows:
```bash
npm run seed
``` 
#### 7. Start the local server
Now you can start the local server with the following  command:
```bash
npm start
``` 
You should see a console log like this:
```
Listening on 9090...
```
#### 8. Send requests
You should now be able to interact with the server by using a client tool (such as [Insomnia](https://insomnia.rest/) or [Postman](https://www.postman.com/)) to make requests. You can check out the available endpoints in the end.points.json file in the root directory.


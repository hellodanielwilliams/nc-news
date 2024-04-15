# Northcoders News API

This is a project created as part of the Northcoders software development bootcamp.

The database names have been "hidden" in .env environment variable files.
If you wish to clone this project and run it locally, you will need to create these files in the root directory. You can do from this the command line as follows:

    touch .env.test
    printf "PGDATABASE=nc_news_test" > .env.test

    touch .env.development
    printf "PGDATABASE=nc_news" > .env.development
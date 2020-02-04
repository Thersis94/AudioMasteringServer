## What is AI Audio?
Ai audio is a platform that allows users to master audio files using a machine learning application that has been trained on thousands of hit songs.

## Requirements
The program that this server uses to master its audio is proprietary. However you are welcome to use it as a framework for your own audio file transfer and persistence service. With the help of programs like MrsWatson by Teragon Audio http://teragonaudio.com/MrsWatson you can run your own realtime audio manipulation programs.

## Setting Up

    Install dependencies: npm install
    Create development and test databases: createdb PLACEHOLDER_DB, createdb PLACEHOLDER_DB_TEST
    Create database user: createuser USER_PLACEHOLDER
    Grant privileges to new user in psql:
        GRANT ALL PRIVILEGES ON DATABASE "PLACEHOLDER_DB" TO "USER_PLACEHOLDER";
        GRANT ALL PRIVILEGES ON DATABASE "PLACEHOLDER_test" TO "PLACEHOLDER_TEST";
    Prepare environment file: cp example.env .env
    Replace values in .env with your custom values.
    Bootstrap development database: npm run migrate
    Bootstrap test database: npm run migrate:test

## Configuring Postgres

For tests involving time to run properly, your Postgres database must be configured to run in the UTC timezone.

    Locate the postgresql.conf file for your Postgres installation.
        OS X, Homebrew: /usr/local/var/postgres/postgresql.conf
    Uncomment the timezone line and set it to UTC as follows:

# - Locale and Formatting -

datestyle = 'iso, mdy'
#intervalstyle = 'postgres'
timezone = 'UTC'
#timezone_abbreviations = 'Default'     # Select the set of available time zone

Sample Data

    To seed the database for development: psql -U USER_PLACEHOLDER -d PLACEHOLDER_DB -a -f seeds/seed.PLACEHOLDER_TABLES.sql
    To clear seed data: psql -U USER_PLACEHOLDER -d PLACEHOLDER_DB -a -f seeds/trunc.PLACEHOLDER_TABLES.sql
    To seed Heroku with data (replace postgres URL with your Heroku URI): psql -U USER_PLACEHOLDER -d postgres://ncfuvjkvpxjvsj:4d58e0f44dfdddf5a82636b4155c7adfe6c25b12a8b517bcf712b64b70be3e7a@ec2-174-129-255-37.compute-1.amazonaws.com:5432/d5vd5fdg9njarh -a -f seeds/seed.PLACEHOLDER_TABLES.sql

Scripts

    Start application for development: npm run dev
    Run tests: npm test




Endpoints

User Endpoints

Post /api/users
Requires password and username in the request body.

Auth Endpoints

Post /api/auth
Requires password and username in the request body.

Audio Endpoints

Post /api/audio-master
Requires user_name as header. Setup to recieve files as blobs.

{
    headers: {
        user_name: 'EXAMPLE USERNAME'
    }
    file: {
    fieldname: 'SONG',
    originalname: 'SONG.wav',
    destination: 'uploads/',
    filename: '58f5951ccc35f88f3594172657d81f31',
    path: 'uploads\\58f5951ccc35f88f3594172657d81f31',
    size: 141628
    }
}


Get /api/audio-master
Requires user_name as header. Returns a list of persisted tracks for that user.

{
    headers: {
        user_name: 'EXAMPLE USERNAME'
    }
}

Return Download link /api/audio-master
Requires user_name and track_name as headers.

{
    headers: {
        user_name: 'EXAMPLE USERNAME',
        track_name: 'EXAMPLE TRACKNAME'
    }
}

Delete /api/audio-master
Requires user_name and track_name as headers.

{
    headers: {
        user_name: 'EXAMPLE USERNAME',
        track_name: 'EXAMPLE TRACKNAME'
    }
}
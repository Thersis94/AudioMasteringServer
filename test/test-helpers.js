const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');



function makeUsersArray() {
  return [
    {
      id: 1,
      user_name: "test-user-1",
      password: "password"
    },
    {
      id: 2,
      user_name: "test-user-2",
      password: "password"
    },
    {
      id: 3,
      user_name: "test-user-3",
      password: "password"
    },
    {
      id: 4,
      user_name: "test-user-4",
      password: "password"
    }
  ];
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }));
  return db
    .into("users")
    .insert(preppedUsers)
    .then(() =>
      // update the auto sequence to stay in sync
      db.raw(`SELECT setval('users_id_seq', ?)`, [
        users[users.length - 1].id
      ])
    );
}

function makeTracksArray(users) {
  return [
    {
      id: 1,
      name: 'Track One',
      date_created: "2029-01-22T16:28:32.615Z",
      user_id: users[0].id 
    },
    {
      id: 2,
      name: 'Track Two',
      date_created: "2029-01-22T16:28:32.615Z",
      user_id: users[1].id 
    },
    {
      id: 3,
      name: 'Track Three',
      date_created: "2029-01-22T16:28:32.615Z",
      user_id: users[2].id 
    },
    {
      id: 4,
      name: 'Track Four',
      date_created: "2029-01-22T16:28:32.615Z",
      user_id: users[3].id 
    }
  ];
}

function makeTablesFixtures() {
  const testUsers = makeUsersArray();
  const testTracks = makeTracksArray(testUsers);
  return { testUsers, testTracks };
}

function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
        tracks,
        users
      `
    )
    .then(() =>
      Promise.all([
        trx.raw(`ALTER SEQUENCE tracks_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE users_id_seq minvalue 0 START WITH 1`),
        trx.raw(`SELECT setval('tracks_id_seq', 0)`),
        trx.raw(`SELECT setval('users_id_seq', 0)`),
      ])
    )
  )
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.user_name,
    algorithm: 'HS256',
  })
  return `Bearer ${token}`
}

module.exports = {
  makeUsersArray,
  makeTracksArray,
  makeAuthHeader,
  makeTablesFixtures,
  cleanTables,
  seedUsers
};
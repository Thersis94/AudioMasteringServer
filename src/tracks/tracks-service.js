const xss = require('xss')
const usersService = require('../users/users-service')

const tracksService = {
    insertTrack(db, newTrack) {
      return db
        .insert(newTrack)
        .into('tracks')
        .returning('*')
        .then(([track]) => track)
        .then(track =>
         tracksService.getById(db, track.id)
        )
    },
    getAllTracks(db, user_name) {
      usersService.getUserId(db, user_name)
      return db()
      .select("*")
    }
  }
  
  module.exports = tracksService
  
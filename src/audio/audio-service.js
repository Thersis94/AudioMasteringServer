const xss = require("xss");
const Treeize = require("treeize");

const audioService = {
  insertTrack(db, newTrack) {
    return db
      .insert(newTrack)
      .into("tracks")
      .returning("*")
      .then(([track]) => track);
  },

  deleteTrack(db, user_id, name) {
    console.log('running delete')
    return db
    .from('tracks')
    .where('user_id', user_id)
    .andWhere('name', name)
    .del()
    .then(function(res) {
      console.log(res)
    })
  },
  
  getAllTracks(db, user_id) {
    return db.from("tracks").select("*").where("user_id", user_id);
  },

  serializeTracks(tracks) {
    return tracks.map(this.serializeTrack);
  },

  serializeTracks(track) {
    const trackTree = new Treeize();

    const trackData = trackTree.grow([track]).getData()[0];

    return {
      id: trackData.id,
      name: xss(trackData.name),
      date_created: trackData.date_created,
      user_id: trackData.user_id || {}
    };
  }
};

module.exports = audioService;

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

  getById(db, id) {
    return audioService
      .getAllThings(db)
      .where("thg.id", id)
      .first();
  },

  getReviewsForThing(db, thing_id) {
    return db
      .from("thingful_reviews AS rev")
      .select(
        "rev.id",
        "rev.rating",
        "rev.text",
        "rev.date_created",
        ...userFields
      )
      .where("rev.thing_id", thing_id)
      .leftJoin("thingful_users AS usr", "rev.user_id", "usr.id")
      .groupBy("rev.id", "usr.id");
  },

  serializeThings(things) {
    return things.map(this.serializeThing);
  },

  serializeTracks(track) {
    const trackTree = new Treeize();

    // Some light hackiness to allow for the fact that `treeize`
    // only accepts arrays of objects, and we want to use a single
    // object.
    const trackData = trackTree.grow([track]).getData()[0];

    return {
      id: trackData.id,
      name: xss(trackData.name),
      date_created: trackData.date_created,
      user_id: trackData.user_id || {}
    };
  },

  serializeThingReviews(reviews) {
    return reviews.map(this.serializeThingReview);
  },

  serializeThingReview(review) {
    const reviewTree = new Treeize();

    // Some light hackiness to allow for the fact that `treeize`
    // only accepts arrays of objects, and we want to use a single
    // object.
    const reviewData = reviewTree.grow([review]).getData()[0];

    return {
      id: reviewData.id,
      rating: reviewData.rating,
      thing_id: reviewData.thing_id,
      text: xss(reviewData.text),
      user: reviewData.user || {},
      date_created: reviewData.date_created
    };
  }
};

const userFields = [
  "usr.id AS user:id",
  "usr.user_name AS user:user_name",
  "usr.full_name AS user:full_name",
  "usr.nickname AS user:nickname",
  "usr.date_created AS user:date_created",
  "usr.date_modified AS user:date_modified"
];

module.exports = audioService;

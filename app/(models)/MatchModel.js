import mongoose from "mongoose";

const matchSchema = new mongoose.Schema({
  businessID: String,
  gameTime: Number,
  bookingType: String,
  playerJoined: Number,
  StartTimestamp: Number,
  EndTimestamp: Number,
  leftTeam: {
    type: Map,
    of: [String],
  },
  rightTeam: {
    type: Map,
    of: [String],
  },
},
);
//{ strict: false }); Add this to add custom team name

const MatchModel = mongoose.model("Matches", matchSchema);

export default MatchModel;

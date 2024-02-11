import mongoose from "mongoose";

const matchSchema = new mongoose.Schema({
  businessID: String,
  noOfSlot: Number,
  gameTime: Number,
  bookingType: String,
  playerCapacity: Number,
  playerJoined: Number,
  matchDate: Number,
  
  StartTimestamp: Number,
  EndTimestamp: Number,
  teams: {
    leftTeam: {
      type: Map,
      of: [String],
      default: new Map()
    },
    rightTeam: {
      type: Map,
      of: [String],
      default: new Map()
    },
  },
});
//{ strict: false }); Add this to add custom team name

//const MatchModel = mongoose.model("Matches", matchSchema);
const MatchModel = mongoose.models.Matches || mongoose.model("Matches", matchSchema);

export default MatchModel;


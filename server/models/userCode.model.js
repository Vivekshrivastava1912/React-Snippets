import mongoose  from "mongoose";

const userCodeSchema = new mongoose.Schema({
  
    userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },


  code: {
    type: String,
    required: true
  },

  
  title: {
    type: String,
    required: true
  }
});

const UserCodeModel = mongoose.model('UserCode', userCodeSchema);
export default UserCodeModel;
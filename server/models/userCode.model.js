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
  
  status: {
        type: String,
        enum: ["Public", "Private"],
        default: "Public"
    },
  
  title: {
    type: String,
    required: true
  },
  
},
{ timestamps: true });

userCodeSchema.index({ title: "text", code: "text" });

const UserCodeModel = mongoose.model('UserCode', userCodeSchema);
export default UserCodeModel;
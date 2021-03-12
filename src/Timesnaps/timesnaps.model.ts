import mongoose from 'mongoose';

const RimsSchema = new mongoose.Schema({
  code: String,
  diameter: String,
  width: Number,
  height: String,
  isOnePiece: Boolean,
  material: String,
}, {
  timestamps: true
});

export default mongoose.model('Rim', RimsSchema);

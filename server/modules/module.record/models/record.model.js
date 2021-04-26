import mongoose from 'mongoose';

const RecordSchema = new mongoose.Schema({
  text: {
    type: String,
    required: 'Текст запису необхідний',
  },
  photo: {
    data: Buffer,
    contentType: String,
  },
  patientECard: {
    type: String,
    required: 'E-картка пацієнта необхідна',
  },
  likes: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  comments: [
    {
      text: String,
      created: { type: Date, default: Date.now },
      postedBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
    },
  ],
  postedBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
  created: {
    type: Date,
    default: Date.now,
  },
  patientBrief: {
    type: String,
  },
});

export default mongoose.model('Record', RecordSchema);

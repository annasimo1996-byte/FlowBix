const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  company: {
    type: String,
    trim: true,
  },
  notes: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

clientSchema.index(
  { userId: 1, email: 1 },
  {
    unique: true,
    partialFilterExpression: {
      email:
      {
        $type: "string",
        $gt: ""
      }
    }
  }
);

module.exports = mongoose.model('Client', clientSchema);
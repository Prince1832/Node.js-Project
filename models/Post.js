const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },


  body: {
    type: String,
    required: true
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  active: {
    type: Boolean,
    default: true
  },

  
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },

    coordinates: {
      type: [Number],
      required: true
    }
  }
}, { timestamps: true });

postSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Post', postSchema);

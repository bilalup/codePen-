const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  html: {
    type: String,
    default: ''
  },
  css: {
    type: String,
    default: ''
  },
  js: {
    type: String,
    default: ''
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: 30
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  collaborators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  forks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }],
  forkOf: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    index: true
  },
  forkCount: {
    type: Number,
    default: 0
  }
  ,
  views: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

// Index for better performance
projectSchema.index({ owner: 1, createdAt: -1 });
projectSchema.index({ owner: 1, title: 1 }, { unique: true });
projectSchema.index({ isPublic: 1, createdAt: -1 });
projectSchema.index({ tags: 1 });

module.exports = mongoose.model('Project', projectSchema);
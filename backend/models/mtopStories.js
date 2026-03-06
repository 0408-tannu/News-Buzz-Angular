// const mongoose = require('mongoose');
import mongoose from 'mongoose';


const top_stories_schema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  imgURL: {
    type: String,
    default: ""
  },
  providerImg: {
    type: String,
    required: true
  },
  providerName: {
    type: String,
    default: ""
  }
},
  {
    timestamps: true
  });

const top_stories_model = mongoose.model('top_stories', top_stories_schema);

export {top_stories_model};
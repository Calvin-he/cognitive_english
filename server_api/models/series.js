'use strict';

var mongoose = require('mongoose');

var SeriesSchema = new mongoose.Schema({
  title: { type : String, default : '', trim : true, required: true },
  desc: { type : String, default : '', trim : true },
  bannerId: { type: mongoose.Schema.ObjectId, ref: 'Media', required: true},
  lessonList: { type: [String]},
  created: {type: Date, default: Date.now },
  updated: {type: Date, default: Date.now }
});

SeriesSchema.statics = {
    list: function(){
        return this.find({}).exec();
    }
}

var Series = mongoose.model('Series', SeriesSchema);

module.exports = Series;
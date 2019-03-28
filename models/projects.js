var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProjectSchema = new Schema({
	projCode: {
		type: Number,
		required: true,
		unique:true
	},
	name: {
		type: String,
		required: true
	},
	client: {
		type: String,
		required: false
	},
	budget:{
		type:Number,
		required:false
	}
}, {
	timestamps: true
});

var ProjectModel = new mongoose.model('Project', ProjectSchema);

module.exports = ProjectModel;
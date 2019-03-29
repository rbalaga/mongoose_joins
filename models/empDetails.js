var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DetailsSchema = new Schema({
	address: {
		type: String,
		required: true
	},
	dept: {
		type: String,
		required: false
	},
	mobile:{
		type: Number,
		required: true,
		unique:true
	},
	empId:{
		type: Schema.Types.ObjectId,
		ref:'Employee'
	}
}, {
	timestamps: true
});

var DetailsModel = new mongoose.model('Empdetails', DetailsSchema);
module.exports = DetailsModel;
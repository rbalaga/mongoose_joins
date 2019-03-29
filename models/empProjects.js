var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EmpProjectSchema = new Schema({
	empid: {
		type: Schema.Types.ObjectId,
		ref:'Employee',
		required: true
	},
	projId: {
		type: Schema.Types.ObjectId,
		ref:'Project',
		required: true
	}
}, {
	timestamps: true
});

var EmpProjectModel = new mongoose.model('EmpProject', EmpProjectSchema);

module.exports = EmpProjectModel;
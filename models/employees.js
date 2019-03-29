var mongoose = require('mongoose');
var EmpDetails = require('./empDetails');
var Schema = mongoose.Schema;

var employeeSchema = new Schema({
	empId:{
		type:Number,
		required:true,
		unique:true
	},
	name:{
		type:String,
		required:true
	}
},{
	timestamps:true
});

var EmployeeModel = new mongoose.model('Employee', employeeSchema);

module.exports = EmployeeModel;
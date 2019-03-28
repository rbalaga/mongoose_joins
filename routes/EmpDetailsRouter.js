const express = require('express');
const bodyParser = require('body-parser');
const Employees = require('../models/employees');
const DetailsModel = require('../models/empDetails');
const ProjectModel = require('../models/projects');

const EmployeeRouter = express.Router();
	EmployeeRouter.use(bodyParser.json());

EmployeeRouter.route('/')
	.get((req, res, next)=>{
		Employees.find({})
			.then((employees)=>{
				res.statusCode = 200;
				res.setHeader('Content-Type','text/json');
				res.json(employees);
			},(err)=>next(err))
			.catch(err => next(err));
	})
	.post((req, res, next) => {
		if (req.body !== null &&
			req.body.empid && req.body.name &&
			req.body.dept && req.body.mobile && req.body.address) {

			var { name, empid, dept, address, mobile } = req.body;

			DetailsModel.create({ dept, address, mobile })
				.then((details) => {
					console.log(details);
					return Employees.create({
						empId: empid,
						name,
						details: details._id
					})
				})
				.then((emp) => {
					res.statusCode = 200;
					res.setHeader('Content-Type', 'text/plain');
					res.end('Employee details saved');
				})
				.catch((err) => {
					var err = new Error('Database error occured');
				});
		} else {
			var err = new Error('Invalid request');
		}
	})
	.delete((req, res, next)=>{
		Employees.remove({})
			.then(()=>{
				res.statusCode = 200;
				res.setHeader('Content-Type','text/json');
				res.json({status:true, errmsg:'deleted successfully'});
			},(err)=>next(err))
			.catch(err=>next(err));
	});

EmployeeRouter.route('/:empId')
	.get((req, res, next)=>{
		Employees.findById(req.params.empId)
			.populate('details')
			.populate('projects')
			.then((emp)=>{
				res.statusCode = 200;
				res.setHeader('Content-Type','text/json');
				res.json(emp);
			}, (err) => next(err))
			.catch(err => next(err));
	})
	.put((req, res, next)=>{
		Employees.findByIdAndUpdate(req.params.empId, { $addToSet: { projects: req.body.projects } }, { new: true })
			.then((emp) => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'text/json');
				res.json(emp);
			}, (err) => next(err))
			.catch(err => next(err));
	})
	.delete((req, res, next)=>{
		Employees.findByIdAndDelete(req.params.empId)
			.then(() => {
				res.statusCode = 200;
				res.setHeader('Content-Type', 'text/json');
				res.json({ status: true, errmsg: 'deleted successfully' });
			}, (err) => next(err))
			.catch(err => next(err));
	});

module.exports = EmployeeRouter;
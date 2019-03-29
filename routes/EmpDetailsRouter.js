const express = require('express');
const bodyParser = require('body-parser');
const Employees = require('../models/employees');
const DetailsModel = require('../models/empDetails');
const ProjectModel = require('../models/projects');
const EmpProjModel = require('../models/empProjects');

const EmployeeRouter = express.Router();
	EmployeeRouter.use(bodyParser.json());

EmployeeRouter.route('/all')
	.get((req, res, next)=>{
		Employees.aggregate([{
			$lookup:{
				from:'empdetails',
				localField:'_id',
				foreignField:'empId',
				as:'details'
			}
		},{
			$unwind:"$details"
		},{
			$lookup:{
				from:'empprojects',
				localField:'_id',
				foreignField:'empid',
				as:'projects'
			}
		},{
			$lookup:{
				from:'projects',
				localField: "projects.projId",
				foreignField:'_id',
				as:'project'
			}
		},{
			$project: { "projects" : 0 }
		}])
		.then((employees)=>{
				res.statusCode = 200;
				res.setHeader('Content-Type', 'text/json');
				res.json(employees);
		},err=>next(err))
		.catch(err=>next(err));
	});

EmployeeRouter.route('/')
	.get((req, res, next)=>{
		Employees.find({}).lean()
			.then((employees)=>{
				if (employees !== null) {
					
					var empIds = employees.map((emp)=>emp._id);	

					DetailsModel.find({ empId:{$in:empIds}}).lean()
						.then((Details)=>{							
							employees.map((emp)=>{ 
									emp.detail = Details.filter((detail)=> detail.empId.toString() === emp._id.toString())[0];
								});
							res.statusCode = 200;
							res.setHeader('Content-Type','text/json');
							res.json(employees);
						})
						.catch((err)=>next(err));
				}
			},(err)=>next(err))
			.catch(err => next(err));
	})
	.post((req, res, next) => {
		if (req.body !== null &&
			req.body.empid && req.body.name &&
			req.body.dept && req.body.mobile && req.body.address) {

			var { name, empid, dept, address, mobile } = req.body;
			
			Employees.create({ empId:empid,name })
			.then((employee)=>{
				return DetailsModel.create({
					dept, address, mobile, empId : employee._id
				});
			})
			.then((details)=>{
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
			.then((emp)=>{
				res.statusCode = 200;
				res.setHeader('Content-Type','text/json');
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

EmployeeRouter.route('/:empId/projects')
	.get((req, res, next)=>{
		EmpProjModel.find({empid:req.params.empId}).lean()
			.then((EmpProj)=>{
				if (EmpProj !== null) {
					var projIds = EmpProj.map((proj)=>proj.projId);
					ProjectModel.find({_id:{$in : projIds }})
						.then((projects)=>{
							res.statusCode = 200;
							res.setHeader('Content-Type','text/json');
							res.json(projects);
						},err=>next(err))
						.catch((err)=>next(err));

				}else{
					var err = new Error('No Projects found for the user');
					err.status = 404;
					next(err);
				}
			})
	})
	.post((req, res, next)=>{
		EmpProjModel.create({
			empid: req.params.empId,
			projId:req.body.projId
		})
		.then((EmpProj)=>{
			res.statusCode = 200;
			res.setHeader('Content-Type','text/json');
			res.json(EmpProj);
		},(err)=>next(err))
		.catch((err)=>next(err));
	});
module.exports = EmployeeRouter;
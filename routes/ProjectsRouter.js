var express = require('express');
var bodyParser = require('body-parser');
var ProjectsModel = require('../models/projects');
var EmpProjModel = require('../models/empProjects');
var EmployeeModel = require('../models/employees');

const ProjectsRouter = express.Router();
ProjectsRouter.use(bodyParser.json());

ProjectsRouter.route('/')
	.get((req, res, next)=>{
		ProjectsModel.find({}).lean()
			.then((projects)=>{
				res.statusCode = 200;
				res.setHeader('Content-Type','text/json');
				res.json(projects);
			},err=>next(err))
			.catch((err)=>{
				next(err);
			});
	})
	.post((req, res, next)=>{
		if (!req.body) {
			var err = new Error('Invalid request');
			err.status = 401;
			next(err);
		}else{
			ProjectsModel.create(req.body)
				.then((projects)=>{
					res.statusCode = 200;
					res.setHeader('Content-Type','text/json');
					res.json(projects);
				},(err)=>next(err))
				.catch((err)=>next(err));
		}
	})
	.delete((req, res, next)=>{
		ProjectsModel.remove({})
			.then(()=>{
				res.status = 200;
				res.setHeader('Content-Type','text/json');
				res.json({stauts:true,errmsg:'deleted successfully'});
			},(err)=>next(err))
			.catch((err)=>next(err));
	});
	


ProjectsRouter.route('/:projId')
	.get((req, res, next)=>{
		EmpProjModel.find({projId : req.params.projId})
			.populate('empid')
			.populate('projId')
			.lean()
			.then((empproj)=>{
				var employees = empproj.map((emp)=>emp.empid);
				var project = empproj[0].projId;
				project.employees = employees;
				res.statusCode = 200;
				res.setHeader('Content-Type','text/json');
				res.json(project);
			},err=>nex(err))
			.catch((err)=>nex(err));
	})
	.post((req, res, next)=>{
		var err = new Error('This method not implemented');
		err.stauts = 406;
		next(err);
	});

module.exports = ProjectsRouter;
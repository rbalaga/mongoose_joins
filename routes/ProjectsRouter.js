var express = require('express');
var bodyParser = require('body-parser');
var ProjectsModel = require('../models/projects');

const ProjectsRouter = express.Router();
ProjectsRouter.use(bodyParser.json());

ProjectsRouter.route('/')
	.get((req, res, next)=>{
		ProjectsModel.find({})
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
	
module.exports = ProjectsRouter;
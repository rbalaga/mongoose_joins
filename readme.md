# Node - Mongodb
Hi! This is a sample REST API application which exposes MongoDB using [mongoose](https://mongoosejs.com/) module.

### Setup and Running
>* Copy the Source code into your directory.
>* Update `mongoURL` in `config.js` file to your mongodb database url.
>* Open terminal in the copied directory.
>* Run the command `npm update` to install all the dependency packages.
>* Run the command `npm start` 
>* Verify the REST API's 
### Schema
	
```mermaid
graph LR
A[Employees] -- 1--1 --> B[Details]
A -- n--n--> C[EmpProjects]
D[Projects] --n--n--> C
```
### List of REST Endpoints implemented
|EndPoint|Method|Purpose |
|--|--|--|
| /emp/all |GET| Gets all the employees list, their details and involved projects |
|/emp/|GET|Gets the list of employees and details|
|/emp/|POST|Inserts the employee and details into database|
|/emp/|DELETE|Removes all the employees list from database|
|/emp/:empId|GET|Gets the specified employee information|
|/emp/:empId|DELETE|Deletes the specified employee information|
|/emp/:empId/projects|GET|Gets the specified employee projects list information|
|/emp/:empId/projects|POST|Adds the specified project into Employee account|

### Models
Employee model
```js
var employeeSchema =  new Schema({
	empId:{type:Number,required:true,unique:true},
	name:{type:String,required:true	}
},{
	timestamps:true
});
```
Details model
```js
var DetailsSchema = new Schema({
	address: { type: String, required: true},
	dept: { type: String, required: false },
	mobile:{ type: Number, required: true, unique:true },
	empId:{ type: Schema.Types.ObjectId, ref:'Employee' }
}, {
	timestamps: true
});
```
Projects model
```js
var ProjectSchema = new Schema({
	projCode: { type: Number, required: true, unique:true },
	name: { type: String, required: true },
	client: { type: String, required: false },
	budget:{ type:Number, required:false }
}, {
	timestamps: true
});
```
Employee - Projects model
```js
var EmpProjectSchema = new Schema({
	empid: { type: Schema.Types.ObjectId, ref:'Employee', required: true },
	projId: { type: Schema.Types.ObjectId, ref:'Project', required: true }
}, {
	timestamps: true
});
```

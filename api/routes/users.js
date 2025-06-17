var express = require('express');
var router = express.Router();
const bcrypt= require("bcrypt-nodejs");
const is = require("is_js");
const jwt = require("jwt-simple");

const Users = require("../db/models/Users");
const Roles = require("../db/models/Roles");
const UserRoles = require("../db/models/UserRoles");
var Response = require("../lib/Response");
var CustomError= require("../lib/Error");
var Enum = require("../config/Enum");
const config = require('../config');
const auth = require('../lib/auth')();
const  { rateLimit } = require( 'express-rate-limit')
const  RateLimitMongo = require('rate-limit-mongo');
const role_privileges = require('../config/role_privileges');


const limiter = rateLimit({
    store: new RateLimitMongo ({
        uri:config.CONNECTION_STRING,
        collectionName: "rateLimits",
        expireTimeMs:15 * 60 * 1000, // 15 minutes
    }),
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	//standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Redis, Memcached, etc. See below.
});

router.post('/register', async(req, res) => {
  let body= req.body;
  try {

    let user =await Users.findOne({email: body.email});

    if(user) {
        throw new CustomError(Enum.HTTP_CODES.NOT_FOUND, "you have already registered", "you have already registered");
    }

    if(!body.email) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "validation error", "email field must be filled")
    if(is.not.email(body.email)) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "validation error", "email field must be an email ofrmat")

    if(!body.first_name) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "validation error", "first_name field must be filled")
    if(!body.last_name) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "validation error", "last_name field must be filled")
    
    if(!body.password) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "validation error", "password field must be filled")
    if(body.password.length < Enum.PASS_LENGTH) {
         throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "validation error", "password must must be gretaer than " + Enum.PASS_LENGTH)
    }

    let password = bcrypt.hashSync(body.password, bcrypt.genSaltSync(8), null);

    let createdUser = await Users.create({
            email:  body.email,
            password: password, 
            is_active: true,
            first_name: body.first_name,
            last_name: body.last_name,
            phone_number: body.phone_number,
            address: body.address
    });
    /*
    let role = await Roles.create({
            role_name: "customer",
            is_active: true,
            created_by: createdUser._id 
    });
    */
    let role = await Roles.findOne({role_name: "customer"}); 

    await UserRoles.create({
            role_id: role._id ,
            user_id: createdUser._id 
    });

    res.status(Enum.HTTP_CODES.CREATED).json(Response.successResponse( {success:true} ))

  }catch(err){
    let errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }

});

router.post('/auth', async (req, res, next) => {
  try {

    let {email, password} = req.body;
    
    Users.validateFieldsBeforeAuth(email, password);

    let user = await Users.findOne({email});
    if(!user)  throw new CustomError(Enum.HTTP_CODES.UNAUTHORIZED, "validation error", "the email or password wrong"); 
    if (!user.validatePassword(password)) throw new CustomError(Enum.HTTP_CODES.UNAUTHORIZED, "validation error", "the email or password wrong"); ;
    let userRole= await UserRoles.findOne({user_id: user._id});
    
    let payload = {
      id : user._id,
      role_id : userRole.role_id,
      exp: parseInt(Date.now() / 1000 ) + config.JWT.EXPIRE_TIME
    }

    let token = jwt.encode(payload, config.JWT.SECRET);
    const manager_role_id = "684b5260c6819a4670387f95";
    let userData = {
      _id: user._id,
      role_id : userRole.role_id,
      first_name: user.first_name,
      last_name: user.last_name,
      manager_role_id: manager_role_id,
    }
    
    res
     .cookie('token', token, {
       httpOnly: true,
       secure: false, // Set to true if using HTTPS
       maxAge: 60 * 60 * 1000 // 1 hour
     })
     .json(Response.successResponse({token, user: userData}));

  }catch(err){
    let errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
 });



router.all('*', auth.authenticate(), (req, res, next) => {
    next();
});

router.get('/customer_home', (req, res) => {
    res.render("index_logged_in",{ user: req.user });
});

router.get('/manager_home',auth.checkRoles("all_orders_view"), (req, res) => {
    res.render("index_manager", { user: req.user });
});




router.get('/manager_order', auth.checkRoles("all_orders_view"), (req, res) => {
    res.render("manager_order", { user: req.user });
});


router.get('/', auth.checkRoles("user_view"), async (req, res,next)=> {
    try {

        let users = await Users.find({}, {password: 0}).lean();

        for(let user of users) {
          let roles = await UserRoles.find({user_id: user._id}).populate("role_id");
          user.roles= roles;
        }

        res.json(Response.successResponse(users));

    } catch(err) {
        let  errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(errorResponse);
    }
});

router.post('/add',auth.checkRoles("user_add"), async (req, res,next)=> {
    let body = req.body;
    try {
        if(!body.email) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "validation error", "email field must be filled");
        if(is.not.email(body.email))  throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "validation error", "email field must be an email format");
        
        if(!body.password) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "validation error", "password field must be filled");
        if(body.password.length < Enum.PASS_LENGTH) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "validation error", "password must must be gretaer than " + Enum.PASS_LENGTH)
        
        if(!body.first_name) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "validation error", "first_name field must be filled");
        if(!body.last_name) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "validation error", "last_name field must be filled");

        let password = bcrypt.hashSync(body.password, bcrypt.genSaltSync(8), null);
        
        if(!body.roles || !Array.isArray(body.roles) || body.roles.length === 0 ){
            throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "validation error", "roles field must be an array")
        }

        let roleIDs = await Roles.find({_id: {$in:body.roles}}); // ehr bir roles item'ı bir ObjectId çünkü body.roles olaark objectId disizisi verdik
        
        if(roleIDs.length === 0) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "validation error", "there is no matching role")
        
        let user= await Users.create({
            email: body.email,
            password: password,
            is_active: body.is_active,
            first_name: body.first_name,
            last_name: body.last_name,
            address: body.address,
            phone_number: body.phone_number,
          });

          for (let roleID of roleIDs){
            await UserRoles.create({
              user_id: user._id,
              role_id: roleID
            });
          }
        

        /* eğer body'de rol_name verilseydi
        for (let role of body.roles){
          let userRole = await Roles.find( {role_name: role} );
          await UserRoles.create({
            user_id: body._id,
            role_id:userRole._id 
          })
        }*/
        
        res.json(Response.successResponse({success: true}));

    } catch(err) {
        let  errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(errorResponse);
    }
});

router.post('/update', auth.checkRoles("user_update"),async (req,res, next)=> {
  let body =req.body;
  try {

    if(!body._id)  throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "validation error", "_id field must be filled");

    let updates= {};

    if(body.password) {
      if(body.password.length < Enum.PASS_LENGTH){
       throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "validation error", "password must must be gretaer than " + Enum.PASS_LENGTH)
      }
      updates.password = bcrypt.hashSync(body.password,  bcrypt.genSaltSync(8), null);
    } 
   
    
    if(typeof body.is_active === "boolean") updates.is_active = body.is_active;
    if(body.first_name) updates.first_name =body.first_name;
    if(body.last_name) updates.last_name =body.last_name;
    if(body.address) updates.address =body.address;
    if(body.phone_number) updates.phone_number =body.phone_number;

    let super_admin = await Roles.find({role_name: "super_admin"});
    
    if (req.user.id == super_admin._id){

      if(body.roles && Array.isArray(body.roles) && body.roles.length > 0) {

        let userRoles = await UserRoles.find({user_id: body._id});
        
        let removedRoles = await userRoles.filter( x => !body.roles.includes(x.role_id.toString()));
        let newRolesID =await body.roles.filter(x => !userRoles.map( ur => ur.role_id.toString()).includes(x));

        if(removedRoles.length > 0){
          // removedRoles bir array olduğu için her bir item'ın _id değerine erişmek için map function kullandık
          await UserRoles.deleteMany( {_id: {$in: removedRoles.map(x => x._id)}} );
        }

        if (newRolesID.length > 0) {
          for (let newRoleID in newRolesID){
            await UserRoles.create({
              user_id: body._id,
              role_id: newRoleID
            });
          }
        }


      }
    }
    
    await Users.updateMany({_id: body._id}, updates);

    res.json(Response.successResponse({ success: true }));

  }catch(err) {
    let errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});


router.post("/delete", auth.checkRoles("user_delete"), async (req, res) => {
  try {
    let body = req.body;

    if (!body._id) throw new CustomError(Enum.HTTP_CODES.BAD_REQUEST, "validation error", "_id field must be filled");

    await Users.deleteOne({ _id: body._id });

    await UserRoles.deleteMany({ user_id: body._id });

    res.json(Response.successResponse({ success: true }));

  } catch (err) {
    let errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});

module.exports =router;
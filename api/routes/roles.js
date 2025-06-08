const express = require("express");
const router =express.Router();

const config= require('../config');
const Enum = require("../config/Enum");

const Response = require("../lib/Response");
const auth = require('../lib/auth')();
const CustomError =require("../lib/Error");

const Roles = require("../db/models/Roles");
const rolePrivileges = require("../config/role_privileges");
const RolePrivileges = require("../db/models/RolePrivileges");
const UserRoles = require("../db/models/UserRoles");



router.all('*', auth.authenticate(), (req, res, next) => {
    next();
});


router.get('/',auth.checkRoles("role_view") ,async (req, res,next)=> {
    try {

        let roles = await Roles.find({}).lean();

        for (let role of roles) {
            let permissions = await RolePrivileges.find({role_id: role._id});
            role.permissions= permissions;
        }
        res.json(Response.successResponse(roles));

    } catch(err) {
        let  errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(errorResponse);
    }
});

router.post('/add',auth.checkRoles("role_add") ,async (req, res,next)=> {
    let body = req.body;
    try {
        if(!body.role_name) throw new CustomError(HTTP_CODES.BAD_REQUEST, "validation error", "role_name field must be filled");
        
        let role = await Roles.create({
            role_name: body.role_name
        });

        if(body.permissions) {
            for (permission of body.permissions){
                await RolePrivileges.create({
                    role_id: role._id,
                    permission: permission
                });
            }
        }
        
        res.json(Response.successResponse({success: true}));

    } catch(err) {
        let  errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(errorResponse);
    }
});

router.post('/update',auth.checkRoles("role_update"), async (req, res, next) =>{
    let body = req.body;
    try {
        if(!body._id) throw new CustomError(HTTP_CODES.BAD_REQUEST, "validation error", "_id field must be filled");

        let updates = {};

        if(body.role_name) updates.role_name = body.role_name;
        if(typeof body.is_active === "boolean") updates.is_active = body.is_active;
        

        if(body.permissions && Array.isArray(body.permissions) && body.permissions.length > 0){

            let privileges = await RolePrivileges.find({role_id: body._id}) ;
            
            let removedPermissions = privileges.filter( x => !body.permissions.includes(x.permission)); // it returns mongoose object { role_id: ObjectID, permission: "menuitems_view", ...}
            let newPermissions = body.permissions.filter( x => !privileges.map(p => p.permission).includes(x)); //it returns only permission name "menuitems_view"

            if(removedPermissions.length > 0){
                
                await RolePrivileges.deleteMany({ _id: removedPermissions.map(x=> x._id)});
            }

            if (newPermissions.length > 0){
                for(let perm of newPermissions ){
                    await RolePrivileges.create({
                        role_id: body._id,
                        permission: perm,
                        //created_by: req?.user.id
                    });
                }
            }
        }

        await Roles.updateOne( {_id: body._id}, updates);

        res.json(Response.successResponse({success: true}));

    } catch(err) {
        let  errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(errorResponse);
    }
});

router.post('/delete', auth.checkRoles("role_delete"), async (req, res, next) =>{
    let body = req.body;
    try {
        if(!body._id) throw new CustomError(HTTP_CODES.BAD_REQUEST, "validation error", "_id field must be filled");

        await RolePrivileges.deleteMany( {role_id: body._id } );
        await Roles.deleteMany({_id: body._id});

        res.json(Response.successResponse({success: true}));

    } catch(err) {
        let  errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(errorResponse);
    }
});

module.exports =router;
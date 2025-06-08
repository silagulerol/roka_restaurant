var express = require('express');
var router = express.Router();
const Response = require("../lib/Response");
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const CustomError = require("../lib/Error");
const AuditLogs = require("../lib/AuditLogs");
const logger = require('../lib/logger/LoggerClass');
const auth = require('../lib/auth')();
const Enum = require("../config/Enum");
const config= require('../config');

const MenuItems = require("../db/models/MenuItems");


router.get('/', async (req,res,next)=>{
    try{
        
        let menuItems = await MenuItems.find({});

        res.json(Response.successResponse(menuItems));

    }catch (err){
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(errorResponse);
    }
});

router.all('*', auth.authenticate(), (req, res, next) => {
    next();
});

router.post('/add', auth.checkRoles("menuitems_add"), async (req,res,next) => {
    let body = req.body; 
    try{
        if (!body.name)  throw new CustomError(HTTP_CODES.BAD_REQUEST, "validation error", "name field must be filled");
        
        let menuItem = await MenuItems.create({
            name: body.name,
            price: body.price,
            ingredients: body.ingredients
            //created_by: req.user.id,
        });

        res.json(Response.successResponse(menuItem));

    } catch (err){
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(errorResponse);
    }
});

router.post('/update',  auth.checkRoles("menuitems_update"),async(req,res,next) => {
    let body = req.body;
    try{
        if(!body._id) throw new CustomError(HTTP_CODES.BAD_REQUEST, "validation error", "_id field must be filled");
        
        let updates ={};
        if(body.name) updates.name = body.name;
        if(body.price) updates.price =body.price;
        if(body.ingredients) updates.ingredients =body.ingredients;
        if(typeof body.is_active === "boolean") updates.is_active =body.is_active;

       await MenuItems.updateOne( { _id: body._id}, updates );
        
        res.json(Response.successResponse({success:true}));
    }catch(err) {
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(errorResponse);
    }
});

router.post('/delete',  auth.checkRoles("menuitems_delete"),async (req, res, next) => {
   let body =req.body;
    try{
        if(!body._id) throw new CustomError(HTTP_CODES.BAD_REQUEST, "validation error", "_id field must be filled");

        await MenuItems.deleteOne({_id: body._id});
        
        res.json(Response.successResponse({success:true}));

   } catch(err){
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(errorResponse);
   } 
});

module.exports = router;
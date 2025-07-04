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

const {HTTP_CODES} =require("../config/Enum")

const Orders = require("../db/models/Orders");

router.all('*', auth.authenticate(), (req, res, next) => {
    next();
});



router.get('/', async (req, res, next) => {
  try {
    const userPrivileges = req.user.roles.map(r => r?.key).filter(Boolean);

    const isManager = userPrivileges.includes("all_orders_view");
    const isRegular = userPrivileges.includes("orders_view");

    if (!isManager && !isRegular) {
      const response = Response.errorResponse(
        new CustomError(HTTP_CODES.UNAUTHORIZED, "Need Permission", "You do not have permission to view reservations.")
      );
      return res.status(response.code).json(response);
    }

    let orders;

    if (isManager) {
      orders = await Orders.find({ })
        .populate('created_by', 'first_name last_name').populate('items', 'name'); ;
    } else {
      orders = await Orders.find({ created_by: req.user.id })
        .populate('created_by', 'first_name last_name').populate('items', 'name'); ;
    }

    res.json(Response.successResponse(orders));
  } catch (err) {
    const errorResponse = Response.errorResponse(err);
    res.status(errorResponse.code).json(errorResponse);
  }
});

/*
router.get('/all',auth.checkRoles("all_orders_view"), async (req,res,next)=>{
    try{
        let orders = await Orders.find({ });

        res.json(Response.successResponse(orders));

    }catch (err){
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(errorResponse);
    }
});

router.get('/',auth.checkRoles("orders_view"), async (req,res,next)=>{
    try{
        let orders = await Orders.find({created_by: req.user.id});

        res.json(Response.successResponse(orders));

    }catch (err){
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(errorResponse);
    }
});
*/
router.post('/add',auth.checkRoles("orders_add"), async (req,res,next) => {
    let body = req.body; 
    try{
        if (!body.collectionTime)  throw new CustomError(HTTP_CODES.BAD_REQUEST, "validation error", "collectionTime field must be filled");
        if (!body.price)  throw new CustomError(HTTP_CODES.BAD_REQUEST, "validation error", "price field must be filled");
        if (!body.items || body.items.length === 0)  throw new CustomError(HTTP_CODES.BAD_REQUEST, "validation error", "items field must be filled");
        if (!body.collectionHour)  throw new CustomError(HTTP_CODES.BAD_REQUEST, "validation error", "collectionHour field must be filled");
        
        let order = await Orders.create({
            collectionTime: body.collectionTime,
            collectionHour: body.collectionHour,
            price: body.price,
            items: body.items,
            created_by: req.user.id,
        });

        res.json(Response.successResponse(order));

    } catch (err){
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(errorResponse);
    }
});

router.post('/update',auth.checkRoles("orders_update"), async(req,res,next) => {
    let body = req.body;
    try{
        if(!body._id) throw new CustomError(HTTP_CODES.BAD_REQUEST, "validation error", "_id field must be filled");
        //if(!body.items || !Array.isArray(body.items) || body.items.length === 0) throw new CustomError(HTTP_CODES.BAD_REQUEST, "validation error", "items field must be filled");
        
        let updates = {};
        if(body.collectionTime) updates.collectionTime = body.collectionTime;
        if(body.price) updates.price =body.price;
        if(body.items) updates.items =body.items;
        if(body.collectionHour) updates.collectionHour =body.collectionHour;
        if(typeof body.is_active === "boolean") updates.is_active =body.is_active;

       await Orders.updateOne( { _id: body._id}, updates );
        
        res.json(Response.successResponse({success:true}, updates));
    }catch(err) {
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(errorResponse);
    }
});

router.post('/delete',auth.checkRoles("orders_delete"), async (req, res, next) => {
   let body =req.body;
    try{
        console.log(body._id);
        if(!body._id) throw new CustomError(HTTP_CODES.BAD_REQUEST, "validation error", "_id field must be filled");

        await Orders.deleteOne({_id: body._id});
        
        res.json(Response.successResponse({success:true}));

   } catch(err){
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(errorResponse);
   } 
});

module.exports = router;
const express = require('express');
const router = express.Router();
const Response = require('../lib/Response');
const CustomError = require('../lib/Error');
const {HTTP_CODES} =require("../config/Enum")

const Reservations = require("../db/models/Reservations");

router.get('/', async (req,res,next)=>{
    try{
        let reservations = await Reservations.find({});

        res.json(Response.successResponse(reservations));

    }catch (err){
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(errorResponse);
    }
});

router.post('/add', async (req,res,next) => {
    let body = req.body; 
    try{
        if (!body.reservationTime)  throw new CustomError(HTTP_CODES.BAD_REQUEST, "validation error", "reservationTime field must be filled");
        if (!body.personNum)  throw new CustomError(HTTP_CODES.BAD_REQUEST, "validation error", "personNum field must be filled");
        if (!body.reservationHour)  throw new CustomError(HTTP_CODES.BAD_REQUEST, "validation error", "reservationHour field must be filled");
        
        let reservation = await Reservations.create({
            reservationTime: body.reservationTime,
            reservationHour: body.reservationHour,
            personNum: body.personNum,
            //created_by: req.user.id,
        });

        res.json(Response.successResponse(reservation));

    } catch (err){
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(errorResponse);
    }
});

router.post('/update', async(req,res,next) => {
    let body = req.body;
    try{
        if(!body._id) throw new CustomError(HTTP_CODES.BAD_REQUEST, "validation error", "_id field must be filled");
        
        let updates ={};
        if(body.reservationTime) updates.reservationTime = body.reservationTime;
        if(body.reservationHour) updates.reservationHour =body.reservationHour;
        if(body.personNum) updates.personNum =body.personNum;
        if(typeof body.is_active === "boolean") updates.is_active =body.is_active;

       await Reservations.updateOne( { _id: body._id}, updates );
        
        res.json(Response.successResponse({success:true}));
    }catch(err) {
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(errorResponse);
    }
});

router.post('/delete', async (req, res, next) => {
   let body =req.body;
    try{
        if(!body._id) throw new CustomError(HTTP_CODES.BAD_REQUEST, "validation error", "_id field must be filled");

        await Reservations.deleteOne({_id: body._id});
        
        res.json(Response.successResponse({success:true}));

   } catch(err){
        let errorResponse = Response.errorResponse(err);
        res.status(errorResponse.code).json(errorResponse);
   } 
});

module.exports = router;
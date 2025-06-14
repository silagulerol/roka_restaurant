const passport = require('passport');
const {ExtractJwt, Strategy} = require('passport-jwt');
const Users = require("../db/models/Users");
const config= require("../config");
const UserRoles = require("../db/models/UserRoles");
const RolePrivileges = require('../db/models/RolePrivileges');
const privs = require('../config/role_privileges'); 
const Response = require('./Response');
const {HTTP_CODES} = require('../config/Enum');
const CustomError = require('./Error')

module.exports = function() {
    let strategy = new Strategy({
        secretOrKey: config.JWT.SECRET,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    }, async (payload, done)=>{
        try {
            let user = await Users.findOne( { _id: payload.id});

            if(user) {
                let userRoles = await UserRoles.find( {user_id: payload.id});

                let rolePrivileges = await RolePrivileges.find( {role_id : {$in: userRoles.map(x => x.role_id)}} );
                
                let privileges = rolePrivileges.map( rp => privs.privileges.find( x => x.key == rp.permission));

                done(null, {
                    id: user._id,
                    roles: privileges,
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    language: user.language,
                    exp: parseInt(Date.now() / 1000) + config.JWT.EXPIRE_TIME  
                });
            } else {
                done(new Error("User not found"), null);
            }
        }catch(err) {
            done(err, null);
        }
    });

    passport.use(strategy);

    return{
        initialize: function () {
            return passport.initialize();
        },
        authenticate: function(){
            return passport.authenticate( "jwt", {session : false} );
        },
        checkRoles: function(...expectedRoles){
            return (req, res, next) =>{ 
                console.log(expectedRoles);
                

                // filter undefined ya da false alanı görürse oluşturduğu array'e parametre olarak aldığı değeri eklemez (Yani x endefined ise map fonksiyonuna girmez nöylece x.key hata vermez)
                let privileges = req.user.roles.filter(x => x).map(x => x.key);
                console.log(privileges);
                let i=0 ;

                while(i < expectedRoles.length && !privileges.includes(expectedRoles[i])) i++;
                
                
                if( i >= expectedRoles.length ) {
                    let response = Response.errorResponse(new CustomError(HTTP_CODES.UNAUTHORIZED, "Need Permission", "Need Permission"));
                    res.status(response.code).json(response);
                }

                return next();
            }
        }
    }
}
const mongoose= require("mongoose");
const Enum = require('../../config/Enum');
const is =require("is_js"); 
const bcrypt = require('bcrypt-nodejs');

const schema = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    is_active: {type: Boolean,default:true},
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    address: String,
    phone_number: String,
}, {
    versionKey: false,
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});

class Users extends mongoose.Model {
    validatePassword(password){
        return bcrypt.compareSync(password, this.password); 
    }

    static validateFieldsBeforeAuth(email, password) {
      if(typeof password !== String || password.length < Enum.PASS_LENGTH || is.not.email(email) ){
          return false;      
      }
      return null;
  }
}

schema.loadClass(Users);

module.exports = mongoose.model('Users', schema);
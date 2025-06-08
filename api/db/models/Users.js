const mongoose = require('mongoose');

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

}

schema.loadClass(Users);

module.exports = mongoose.model('Users', schema);
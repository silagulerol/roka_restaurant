const mongoose = require('mongoose');

const schema = mongoose.Schema({
    role_id:  {type: mongoose.Schema.Types.ObjectId, ref: 'Roles'},
    user_id:  {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
    is_active: {type: Boolean,default:true},
    created_by: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
},{
    versionKey: false,
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});

class UserRoles extends mongoose.Model{

}

schema.loadClass(UserRoles);

module.exports= mongoose.model("UserRoles", schema);
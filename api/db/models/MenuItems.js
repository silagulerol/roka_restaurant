const mongoose = require('mongoose');

const schema = mongoose.Schema({
    name: String,
    price: Number,
    ingredients:{type: Array, default: []}, 
    is_active:{type: Boolean, default: true},
    created_by: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
}, {
    versionKey: false,
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});

class MenuItems extends mongoose.Model{

}

schema.loadClass(MenuItems);
module.exports = mongoose.model("menu_items", schema);
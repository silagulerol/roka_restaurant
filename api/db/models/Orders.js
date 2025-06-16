const mongoose = require('mongoose');

const schema = mongoose.Schema({
    collectionTime: Date,
    collectionHour: String,
    price: Number,
    items:  [{type: mongoose.Schema.Types.ObjectId, ref: 'menu_items'}],
    accepted: Boolean,
    is_active:{type:Boolean, default:false},
    created_by: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
}, {
    versionKey: false,
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});

class Orders extends mongoose.Model {

}

schema.loadClass(Orders);
module.exports = mongoose.model("orders", schema);
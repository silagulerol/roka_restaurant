const mongoose = require('mongoose');

const schema = mongoose.Schema({
    reservationTime: Date,
    reservationHour: String,
    personNum: Number,
    accepted: Boolean,
    is_active:Boolean,
    created_by: {type: mongoose.Schema.Types.ObjectId, ref: 'Users'},
}, {
    versionKey: false,
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
});

class Reservations extends mongoose.Model {

}

schema.loadClass(Reservations);
module.exports= mongoose.model("reservations", schema);
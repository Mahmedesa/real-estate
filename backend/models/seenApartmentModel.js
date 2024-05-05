const mongoose = require('mongoose');

const seenApartmentSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    seeApartmentItem: {
        category: {type: String, required: true},
        image:{type: String, required:true},
        price: {type: Number, required: true},
        sold: {type: Boolean, required: true, default: false},
        apartment: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Apartment"
        }
    },
    seenAt: {type: Date},
    
},{
    timestamps: true
})

const SeenApartment = mongoose.model('SeenApartment', seenApartmentSchema);
export default SeenApartment;
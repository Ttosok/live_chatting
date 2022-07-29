const mongoose = require('mongoose');

const RoomshareSchema = new mongoose.Schema({
    typer:[
        {
            user:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        }
    ],
    room:{
        type:String,
        unique: true,
        required: true
    },
    name:{
        type:String
    },
    avatar:{
        type: String
    },
    chat:[
        {
            user:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            text:{
                type:String,
                required: true
            },
            date:{
                type: Date,
                default: Date.now
            }
        }
    ],
    date:{
        type: Date,
        default: Date.now
    }
});
module.exports = Room = mongoose.model('Roomshare', RoomshareSchema);
const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    location:{
        type: String
    },
    nick_name:{
        type:String
    },
    status:{
        type: String,
        required: true,
        default: "không có tâm trạng"
    },
    bio:{
        type: String
    },
    note:[
        {
            text:{
                type: String
            },
            date:{
                type: Date,
                default: Date.now
            }
        }
    ],
    education:[
        {
            school:{
                type: String,
                required: true
            },
            degree:{
                type: String,
                required: true
            },
            fieldofstudy:{
                type: String,
                required: true
            },
            from:{
                type: Date,
                required: true
            },
            to:{
                type: Date
            },
            current:{
                type: Boolean,
                default: false
            },
            description:{
                type: String
            }
        }
    ],
    social:{
        youtube:{
            type: String
        },
        twitter:{
            type: String
        },
        facebook:{
            type: String
        },
        linkin:{
            type: String
        }
    },
    date:{
        type: Date,
        default: Date.now
    }
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);
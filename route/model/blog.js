const mongoose = require('mongoose')

const articleSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    text:{
        type: String,
        required: true
    },
    name:{
        type: String
    },
    avatar:{
        type: String
    },
    picture:[
        {
            img:{
                type: String
            }
        }
    ],
    like:[
        {
            user:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        }
    ],
    comments:[
        {
            user:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            text:{
                type: String,
                required: true
            },
            name:{
                type: String
            },
            avatar:{
                type: String
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
})

module.exports = Blog = mongoose.model('Blogr', articleSchema)
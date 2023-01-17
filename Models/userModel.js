const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    _id:String,
    name:{
        type:String,
        required:[true,"User must have a name"],
        trim:true
    },
    phone:{
        type:String,
        required:[true,"User must have a phone number"],
        trim:true
    },
    favourites:[
        {
            type:mongoose.Schema.ObjectId,
            ref:'Property'
        }
    ],
    postCreated:[
        {
            type:mongoose.Schema.ObjectId,
            ref:'Property'
        }
    ]
    },{
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    });

    userSchema.pre(/^find/, function (next) {
        this.populate({
            path: 'favourites',
            select: '-images'
        }).populate({
            path:'postCreated',
            select: '-images'
        });
        next();
    });

    userSchema.statics.getUserByIds = async function (ids) {
        try {
          const users = await this.find({ _id: { $in: ids }},{favourites:0, postCreated:0});
          return users;
        } catch (error) {
          throw error;
        }
      }

module.exports = mongoose.model("User",userSchema);
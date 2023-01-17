const mongoose = require("mongoose");

const geoSchema = new mongoose.Schema({
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: {
      type: [Number]
    }
});

const propertySchema = new mongoose.Schema({
    sellerName: {
        type: String,
        required: [true,'Seller name is required'],
        trim: true,
    },
    title: {
        type: String,
        required: [true, 'A property must have a title'],
        trim: true
        },
    address: {
        type: String,
        required: [true],
        trim: true,
        },
    imageCover: {
        type: Buffer,
        required: [true, 'A property must have a imageCover'],
        },
    images: [Buffer],
    imageCount: {
        type:Number,
        default:0
    },
    price:{
        type:String,
        required:[true,"Property price is required"],
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    category:{
        type:String,
        trim:true,
        required:[true,"Please mention category"]
    },
    type:{
        type:String
    },
    location: {
        type: geoSchema,
        index: '2dsphere'
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false,
      },
    postedBy:{
        type:String,
        ref:'User'
    }
    },{
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  });

propertySchema.pre(/^find/, function (next) {
    this.populate({
        path: 'postedBy',
        select:'name id -favourites -postCreated'
    })
    next();
});

propertySchema.virtual('date').get(function(){
    return this._id.getTimestamp();
})

propertySchema.statics.getPropertiesByPage = async function (options = {}) {
    try {
      return this.aggregate([
        // apply pagination
        { $unset:"images"},
        { $skip: options.page * options.limit },
        { $limit: options.limit },
        { $sort: { createdAt: 1 } },
      ]);
    } catch (error) {
      throw error;
    }
  }

module.exports = mongoose.model("Property",propertySchema);
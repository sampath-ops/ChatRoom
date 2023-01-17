const Property = require("../Models/propertyModel");
const catchAsync = require("../utils/catchAsync");

exports.getAllProperties = catchAsync(async(req,res)=>{
    const options = {
      page: parseInt(req.query.page) || 0,
      limit: parseInt(req.query.limit) || 10,
    };
    const data = await Property.find({},{images:0});
    res.status(200).json({
        status:"success",
        data
    })
});

exports.createProperty = catchAsync(async(req,res,next)=>{

  let imagesBuffer = [];
  let imageCount = 0;
  if(req.files['images']){
    imageCount = req.files['images'].length
    req.files['images'].map(buff =>{
      imagesBuffer.push(buff.buffer);
    })
  }

  const doc = await Property.create({
      ...req.body,
      images:imagesBuffer,
      imageCount,
      imageCover:req.files['imageCover'][0].buffer,
      postedBy:req.headers['userid']
  });
  res.locals.userId = req.headers['userid'];
  res.locals.postId = doc.id;
  next();
})

exports.getProperty = catchAsync(async(req,res)=>{
    const data = await Property.findById(req.params.id,{images:0});
    res.status(200).json({
        status:"success",
        data
    })
})

exports.getPropertyImages = catchAsync(async(req,res)=>{
    const data = await Property.findById(req.params.id,{images:1})
    res.status(200).json({
      status:"success",
      data
    })
})

exports.updateProperty = catchAsync(async(req,res)=>{
  
    let updatedProp={};
    let imagesBuffer = [];
    let imageCount = 0;
    if(req.files['images']){
      imageCount = req.files['images'].length
      req.files['images'].map(buff =>{
        imagesBuffer.push(buff.buffer);
      })
      updatedProp.images = imagesBuffer;
      updatedProp.imageCount = imageCount;
    }

    if(req.files['imageCover']){
      updatedProp.imageCover = req.files['imageCover'][0].buffer;
    }
  
    const doc = await Property.findByIdAndUpdate(req.params.id, {
      ...req.body,
      ...updatedProp
    },{
        new: true,
        runValidators: true,
    });

    if (!doc) {
      res.status(404).json({
        msg: 'No doc found with that ID'
      })
    }
  
    res.status(200).json({
      status: 'success',
      data: doc,
    });
})

exports.deleteProperty = catchAsync(async(req,res,next)=>{
    
    const doc = await Property.findByIdAndDelete(res.locals.postId);

    if (!doc) {
      res.status(404).json({
        msg: 'No doc found with that ID'
       })
    }

    res.status(200).json({
      status: 'success',
      data: null
    });
})

exports.getNearest = catchAsync(async(req,res)=>{
  let lat = req.body.lat;
  let lang = req.body.lng;

  try {
    let properties = await Property.find({
      location: {
        $near: {
          $maxDistance: 3000,
          $geometry: {
            type: "Point",
            coordinates: [lat, lang]
          }
        }
      }
    });

    res.status(200).send(properties);
  } catch (e) {
    res.status(500).send(e.message);
  }
})
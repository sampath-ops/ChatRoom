const User = require("../Models/userModel");
const catchAsync = require("../utils/catchAsync");
exports.createUser = catchAsync(async(req,res)=>{
    const doc = await User.create({
      ...req.body
    });
    res.status(200).json({
        status:"success",
        data: {
            data: doc,
          },
    }) 
})

exports.getUser = catchAsync(async(req,res)=>{
  
    const user = await User.findById(req.params.id);

    if(!user){
      res.status(404).json({
        msg:"user not found",
        bool:false
      })
    }
   else{
    res.status(200).json({
      status:"success",
      data:user
    })
   } 
   
})

exports.getAllUser = catchAsync(async(req,res)=>{
  const data = await User.find();
  res.status(200).json({
    status:"success",
    data
  })
})

exports.addPostCreatedId = catchAsync(async(req,res)=>{
    const doc = await User.updateOne({_id: res.locals.userId},{ 
        $addToSet: { 
                postCreated:res.locals.postId, 
            } 
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

exports.removePostCreatedId = catchAsync(async(req,res,next)=>{
    const doc = await User.updateOne({_id: req.headers['userid']},{
        $pull:{
            postCreated:req.params.id
          }
    })
    if(!doc){
      res.status(404).json({
        msg: 'No doc found with that ID'
       })
    }
    res.locals.postId = req.params.id;
    next();
})

exports.getFavourite = catchAsync(async(req,res)=>{
  const doc = await User.findById(req.headers['userid'],{favourites:1});
  res.status(200).json({
    status:"success",
    data:doc.favourites
  })
})

exports.updateFavourite = catchAsync(async(req,res)=>{
  
  let isFav = false;
  let doc;
  const user = await User.findById(req.headers['userid']);
  
  user.favourites.map(el=>{
    if(el._id == req.params.id){
      isFav = true;
    }
  })

  if(isFav){
   doc = await User.updateOne({_id:req.headers['userid']},{
        $pull:{
          favourites:req.params.id
        }
    })
  }
  else{
   doc = await User.updateOne({_id:req.headers['userid']},{
      $addToSet:{
        favourites:req.params.id
      }
    })
  }

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

exports.updateUser = catchAsync(async(req,res)=>{
  const doc = await User.findByIdAndUpdate(req.params.id,req.body,{new:true});
  res.status(200).json({
      status:"success",
      data: {
          data: doc,
        },
  }) 
})
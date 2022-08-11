const jwt = require("jsonwebtoken");

const ObjectId = require("mongoose").Types.ObjectId
const userModel = require("../model/userModel");
const postModel=require("../model/postModel")
const { uploadFile } = require("./aws")
const isValidGender = function (Gender) {
  return ["Male", "Female", "Other"].indexOf(Gender) !== -1;
};
const isValidStatus = function (Status) {
  return ["Public", "Private"].indexOf(Status) !== -1;
};

  
  const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
  };
const isValidRequestBody = function (body) {
  return Object.keys(body).length > 0;
};

var userId=0;

const createUser = async function (req, res) {
    try {
      let body = req.body;
      
  
      if (!isValidRequestBody(body)) {
        return res
          .status(400)
          .send({
            status: false,
            message: "Invalid request parameters please provide user details",
          });
      }
      //Added loop for validation
      let required = ["name", "Password", "email_id", "User_name","Gender","Mobile"];
      let keys = Object.keys(body);
  
      for (let i = 0; i < required.length; i++) {
        if (keys.includes(required[i])) continue;
        else
          return res
            .status(400)
            .send({ status: false, msg: `Required field - ${required[i]}` });
      }
      //checking for empty values
      for (const property in body) {
        if (
          typeof body[property] == "string" &&
          body[property].trim().length == 0
        )
          return res
            .status(400)
            .send({ status: false, msg: `Required field - ${property}` });
        else continue;
      }
      const { name, Password, email_id, User_name,Gender,Mobile} = req.body;
      body.user_id=userId+1;
      if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,}$/.test(Password)){
        return res.status(400).send({status:false,message:"Password should be valid"})
      }
      if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email_id)) {
        return res
          .status(400)
          .send({ status: false, message: "Email should be valid" });
      }
      const isEmailPresent = await userModel.findOne({ email_id: email_id });
      if (isEmailPresent) {
        return res
          .status(400)
          .send({
            status: false,
            message: "email address is already registered",
          });
      }

      const isUserPresent = await userModel.findOne({ User_name: User_name });
      if (isUserPresent) {
        return res
          .status(400)
          .send({
            status: false,
            message: "User name is already registered",
          });
      }

  
      if (!isValidGender(Gender)) {
        return res
          .status(400)
          .send({ status: false, message: "Please provide right Gender" });
      }

      if (!/^(\+91)?0?[6-9]\d{9}$/.test(Mobile.trim())) {
        return res.status(400).send({ status: false, message: "Please enter valid 10 digit mobile number." })
    }


      //searching Phone in DB to maintain their uniqueness.
    const phoneExt = await userModel.findOne({ Mobile: Mobile })
    if (phoneExt) {
        return res.status(400).send({ status: false, message: "phone number already exists" })
    }
    
    
    const user = await userModel.create(body);
    res
      .status(201)
      .send({ status: true, message: "created successfully", data: user });
  } catch (err) {
    res.status(500).send({ status: false, data: err.message });
  }
};

const loginUser = async function (req, res) {
    try {
      const requestBody = req.body;
      if (!isValidRequestBody(requestBody)) {
        return res
          .status(400)
          .send({ status: false, msg: "please provide data to signIn" });
      }
      const { email_id, Password } = requestBody;
  
      if (!isValid(email_id)) {
        return res
          .status(400)
          .send({ status: false, msg: "please provide email" });
      }
      if (!isValid(Password)) {
        return res
          .status(400)
          .send({ status: false, msg: "please provide password" });
      }
  
      const findEmailAndPassword = await userModel.findOne({
        email_id: email_id,
        Password: Password,
      });
      if (!findEmailAndPassword) {
        return res
          .status(401)
          .send({ status: false, msg: "Please provide valid credentials" }); //401- for unauthorized--it lacks valid authentication credentials
      }
  
      const userId = findEmailAndPassword._id;
  
      const data = { email_id, Password };
      if (data) {
        const token =jwt.sign(
          {
            userId: userId
          
          },
          "assignment"
        );
        res
          .status(200)
          .send({ status: true, msg: "user login sucessfully", token: token });
      }
    }catch (err) {
      res.status(500).send({ status: false, data: err.message });
    }
  };

  const postApi=async function(req,res){
    try{

      //taking UserID from Params
      let pathParams = req.params.userId

      //cheacking for UserID Is valid ObjectID
      if (!ObjectId.isValid(pathParams)) {
          return res.status(400).send({ status: false, message: "Please enter valid userId" })
      }

      //Authrization
      let userToken = req.userId
      
      if (!ObjectId.isValid(userToken)) {
          return res.status(400).send({ status: false, message: "Please enter valid userId" })
      }

      let user = await userModel.findOne({ _id: pathParams })
      if (!user) {
          return res.status(404).send({ status: false, message: "No user found" })
      }

      if (userToken !== pathParams) {
          return res.status(403).send({ status: false, message: "Unauthorized user" })
      }
      let arr=[]
      let body = req.body;
      let file = req.files;
      if (file && file.length > 0) {
        for(let i=0;i<file.length;i++){

        let uploadedFileURL = await uploadFile(file[i])

        arr.push(uploadedFileURL)
        
        }
        body["files"]=arr

    }
    else {
        return res.status(400).send({ status: false, message: "No file found" })
    }
    body.userId=req.params.userId
  
      if (!isValidRequestBody(body)) {
        return res
          .status(400)
          .send({
            status: false,
            message: "Invalid request parameters please provide user details",
          });
      }
      let {Text,status}=req.body;
      if (!isValid(Text)){
        return res
          .status(400)
          .send({ status: false, msg: "please provide Text" });

      }
      if (!isValid(status)){
        return res
          .status(400)
          .send({ status: false, msg: "please provide status" });

      }
      if (!isValidStatus(status)) {
        return res
          .status(400)
          .send({ status: false, message: "Please provide right Status" });
      }
      let post =await postModel.create(body)
      res
      .status(201)
      .send({ status: true, message: "created successfully", data: post });



    }
    catch(err){
      res.status(500).send({ status: false, data: err.message });
    }
  }


  const followersApi=async function(req,res){
    try {
      let whomFollowed = await userModel.findByIdAndUpdate({ _id: req.body.followingId},
          { $push: { following: req.body.followerId } }
      );
      let whoFollowedMe = await userModel.findByIdAndUpdate({ _id: req.body.followerId },
          { $push: { followers: req.body.followingId } }
      )
      return res.status(200).send({ message: "User Follow Success"});
  } catch (e) {
      return res.status(500).send({ message: "User Follow Failed", data: e.message });
  }




  }

  const unFollowApi=async function(req,res){
    try {
      let whomUnFollowed = await userModel.findByIdAndUpdate({ _id: req.body.followingId },
          { $pull: { following: req.body.followerId } }
      );
      let whoUnFollowedMe = await userModel.findByIdAndUpdate({ _id: req.body.followerId },
          { $pull: { followers: req.body.followingId } }
      )
      return res.status(200).send({ message: "User UnFollow Success"});
  } catch (e) {
      return res.status(500).send({ message: "User UnFollow Failed", data: e.message });
  }
  }

  const editPost=async function(req,res){
    try{
      let pathParams = req.params.userId
      let postId=req.params.postId
      let file=req.files
      let body=req.body
      

      //cheacking for UserID Is valid ObjectID
      if (!ObjectId.isValid(pathParams)) {
          return res.status(400).send({ status: false, message: "Please enter valid userId" })
      }
      if (!ObjectId.isValid(postId)) {
        return res.status(400).send({ status: false, message: "Please enter valid postId" })
    }

      //Authrization
      let userToken = req.userId
      
      if (!ObjectId.isValid(userToken)) {
          return res.status(400).send({ status: false, message: "Please enter valid userId" })
      }

      let user = await userModel.findOne({ _id: pathParams })
      if (!user) {
          return res.status(404).send({ status: false, message: "No user found" })
      }

      if (userToken !== pathParams) {
          return res.status(403).send({ status: false, message: "Unauthorized user" })
      }
      let post=await postModel.findOne({_id:postId,userId:pathParams,isDeleted:false})
      if(!post){
        return res.status(400).send({status:false,message:"no post found"})
      }

      let arr=[]
      if (file && file.length > 0) {
        for(let i=0;i<file.length;i++){
        let uploadedFileURL = await uploadFile(file[i])
        arr.push(uploadedFileURL)
        }
        body["files"]=arr
    }
    let {Text}=body
    if(Text){
    if(!isValid(Text)){
      return res.status(400).send({status:false,message:"please enter valid title"})
    }
  }

    let updatePost = await postModel.findByIdAndUpdate({ _id: postId }, body, { new: true })

        return res.status(200).send({ status: true, message: "Success", data: updatePost })

    }
    catch(err){
      return res.status(500).send({message:err.message})
    }
  }

  const deletePost=async function(req,res){
    try{

      let pathParams = req.params.userId
      let postId=req.params.postId
  
      

      //cheacking for UserID Is valid ObjectID
      if (!ObjectId.isValid(pathParams)) {
          return res.status(400).send({ status: false, message: "Please enter valid userId" })
      }
      if (!ObjectId.isValid(postId)) {
        return res.status(400).send({ status: false, message: "Please enter valid postId" })
    }

      //Authrization
      let userToken = req.userId
      
      if (!ObjectId.isValid(userToken)) {
          return res.status(400).send({ status: false, message: "Please enter valid userId" })
      }

      let user = await userModel.findOne({ _id: pathParams })
      if (!user) {
          return res.status(404).send({ status: false, message: "No user found" })
      }

      if (userToken !== pathParams) {
          return res.status(403).send({ status: false, message: "Unauthorized user" })
      }
      let post=await postModel.findOne({_id:postId,userId:pathParams,isDeleted:false})
      if(!post){
        return res.status(400).send({status:false,message:"no post found"})
      }
      let deletePost = await postModel.findByIdAndUpdate({_id:postId}, { $set: { isDeleted: true } }, { new: true })
        return res.status(200).send({ status: true, message: "Success",data:deletePost })



    }
    catch(err){
      return res.status(500).send({message:err.message})
    }
  }


module.exports={createUser,loginUser,postApi,followersApi,unFollowApi,editPost,deletePost}
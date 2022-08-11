const express = require('express');
const router = express.Router();
const {auth}=require("../middleware/auth")
const {createUser,loginUser,postApi, editPost, deletePost}=require("../controller/userController")
router.post("/register",createUser)
router.post("/login",loginUser)
router.post("/post/:userId",auth,postApi)
router.put("/post/:userId/:postId",auth,editPost)
router.delete("/post/:userId/:postId",auth,deletePost)


module.exports = router;
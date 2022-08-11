const express = require('express');
const router = express.Router();
const {auth}=require("../middleware/auth")
const {createUser,loginUser,postApi, editPost, deletePost, followersApi, unFollowApi,likeApi, profileApi,editProfile, feedsApi}=require("../controller/userController")
router.post("/register",createUser)
router.post("/login",loginUser)
router.post("/post/:userId",auth,postApi)
router.put("/post/:userId/:postId",auth,editPost)
router.delete("/post/:userId/:postId",auth,deletePost)

router.post("/follow",auth,followersApi)
router.post("/unfollow",auth,unFollowApi)
router.put("/like/:userId/:postId",auth,likeApi)
router.get("/profile/:userId",auth,profileApi)
router.put("/profile/:userId",auth,editProfile)
router.get("/feeds/:userId",auth,feedsApi)


module.exports = router;
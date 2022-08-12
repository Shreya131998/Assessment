# Assessment

router.post("https://wowtalent-assesment.herokuapp.com/register",createUser)  //API 1
router.post("https://wowtalent-assesment.herokuapp.com/login",loginUser)      //API 2
router.post("https://wowtalent-assesment.herokuapp.com/post/:userId",auth,postApi)    //API 3
router.put("https://wowtalent-assesment.herokuapp.com/post/:userId/:postId",auth,editPost)  //API 10
router.delete("https://wowtalent-assesment.herokuapp.com/post/:userId/:postId",auth,deletePost) //API 11

router.post("https://wowtalent-assesment.herokuapp.com/follow",auth,followersApi) //API 4 FOLLOW
router.post("https://wowtalent-assesment.herokuapp.com/unfollow",auth,unFollowApi)  // API 4 UNFOLLOW
router.put("https://wowtalent-assesment.herokuapp.com/like/:userId/:postId",auth,likeApi)  //API 5
router.get("https://wowtalent-assesment.herokuapp.com/profile/:userId",auth,profileApi)    //API 7
router.put("https://wowtalent-assesment.herokuapp.com/profile/:userId",auth,editProfile)   //API 9
router.get("https://wowtalent-assesment.herokuapp.com/feeds/:userId",auth,feedsApi)       // API 8

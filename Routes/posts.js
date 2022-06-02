const express = require("express");
const Post = require("../models/posts");
const User = require("../models/User");
const Comm = require("../models/comment");
const authMiddleware = require("../Routes/auth-middleware");
const router = express.Router();

router.get("/", (req, res) => {
    console.log("router.get / loading")
    res.send("./main.html");
});
// 상세페이지
router.get("/posts/:postId", async (req, res) => {
    const { postId } = req.params;
    console.log(postId);

    const num = await Post.findOne({ _id: postId });
    if (!num) {
        return res.status(400).json({
            success: false,
            errorMessage: "Cannot read"
        })
    }
    console.log(num);
    res.json({ num });
});

// db에서 데이터 목록 로드
router.get('/posts', async (req,res) => {
    const { name, password, contents, date, } = req.query;

    const post = await Post.find({name, password, contents, date})
    .sort("-_id").exec();

    console.log(post.length)

    res.send({post});
});

// 게시물 등록
router.post('/posts' ,authMiddleware ,async (req, res) => {
    
    const  { title, name, password, date, contents,} =req.body;
    const user= res.locals.user.nickname;
    console.log(user)

    if(user) {
    const createPost = await Post.create({ title, contents, date, password, name,author:user});
    res.send({ posts :  createPost });
    } else if (!user){
        res.status(401).json({msg: "로그인이 필요한 기능입니다."})
    }
    
       
});

// 댓글 목록    
router.get('/comments/:postId', authMiddleware, async (req, res) => {
    const { postId } = req.params;
    const { comment} = req.body;
    await Post.findOne({_id:postId})
    const comm = await Comm.find({Id:postId, comment:comment})
    .sort('-commentId').exec();
    
    
    res.send({comm});
    
})

// post 루트 파일을 exports 해주지 않았기 때문에 폼 데이터를 받기만 하지
// db로 보내주지 못하고 있었다. 게시물 등록 코드자체는 완성

// 댓글 작성
router.post('/comments/:postId', authMiddleware, async (req, res) => {
    const { postId } = req.params;
    const { comment, commentId} = req.body; 
    const nickname = res.locals.user.nickname;
    console.log(postId)
    const post = await Post.findOne({_id:postId})
    console.log(post)

    const createComm = await Comm.create
    ({ comment:comment, commentId:commentId, Id: post._id, nickname})

    res.send({comments : createComm});
    
});


router.put("/posts/:postId",authMiddleware, async (req, res) => {
    const { postId } = req.params;

    const { title,contents, password } = req.body
    let user = res.locals.user.nickname;
    
    const existsPost = await Post.find({ _id: postId, password:password});

    // if(!existsPost.length) {
    //     res.status(400).json({ msg : "fail"});
    // } else {
    //     await Post.findOneAndUpdate({ _id: postId}, { $set: { title, contents }});
    //     res.status(200).json({ msg : "success"});
    // }
    console.log(existsPost[0]['author'])
    if (user === existsPost[0]['author']) {
        await Post.findOneAndUpdate({ _id: postId }, {$set: {title, contents}});
    } else {
        return res.status(401).json({
            success: false,
            errormessage: '작성자만 삭제할 수 있습니다.',
        });
    }

    res.json({ success: true, msg: 'Update!' });
});

router.delete("/posts/:postId",authMiddleware, async(req, res) => {
    const { postId } = req.params;
    const { password, author } = req.body;

    let user = res.locals.user.nickname;
    const existsPost = await Post.find({ _id: postId, password:password, author:author});

    // console.log(existsPost[0]['author'])
    // console.log(existsUser)

    // if(!existsPost.length && existsUser[0]['nickname'] !== existsPost[0]['author']) {
    //         res.status(400).json({ msg : "fail"});
    // } else {
    //     await Post.deleteOne({ _id: postId});
    //     res.status(200).json({ msg : "success"});
    // }
    console.log(existsPost[0]['author'])
    if (user === existsPost[0]['author']) {
        await Post.deleteOne({ _id: postId });
    } else {
        return res.status(401).json({
            success: false,
            errormessage: '작성자만 삭제할 수 있습니다.',
        });
    }

    res.json({ success: true, msg: 'Delete!' });
});

router.delete('/comments/:commentId', authMiddleware, async (req, res) => {
    const { commentId } = req.params;
    const { user } = res.locals.user;
    
    const [existComm] = await Comm.find({_id:commentId});
    const [Users] = await User.find({_id:user})
    console.log(Users);
    console.log(existComm);
    
    if (Users.nickname === existComm.nickname) {
        await Comm.deleteOne({_id:commentId});
        res.json({ msg : "success"});
    } else {
        return res.status(401).json({
            success: false,
            errormessage: '작성자만 삭제할 수 있습니다.',
        });
    }
})

router.patch('/comments/:commentId', authMiddleware, async (req, res) => {
    const { commentId } = req.params;
    const { userId } = res.locals.user;
    const { comment } = req.body;

    const [existComm] = await Comm.find({_id:commentId});
    const [Users] = await User.find({_id:userId})

    if(Users.nickname === existComm.nickname) {
        await Comm.findByIdAndUpdate({_id:commentId}, {$set: {comment}});
        res.json({ msg: "success"});
    } else {
        return res.status(401).json({
            success: false,
            errormessage: '작성자만 수정할 수 있습니다.',
        });
    }
   
})
module.exports = router;

// router.put("/posts/:postId",authMiddleware, async (req, res) => {
//     const { postId } = req.params;

//     const { title,contents, password } = req.body
//     let user = res.locals.user.nickname;
    
//     const existsPost = await Post.find({ _id: postId, password:password});

//     console.log(existsPost[0]['author'])
//     if (user === existsPost[0]['author']) {
//         await Post.findOneAndUpdate({ _id: postId }, {$set: {title, contents}});
//     } else {
//         return res.status(401).json({
//             success: false,
//             errormessage: '작성자만 삭제할 수 있습니다.',
//         });
//     }

//     res.json({ success: true, msg: 'Update!' });
// });
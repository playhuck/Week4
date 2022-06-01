const express = require("express");
const User = require("../models/User");
const Jwt = require("jsonwebtoken");
const authMiddleware = require("../Routes/auth-middleware");

const router = express.Router();

// 회원가입
router.post("/users", async (req, res) => {
    const { nickname, password, confirm_pw } = req.body;

    if( password !== confirm_pw){
        res.status(400).send({
            msg: "패스워드가 일치하지 않습니다."
        });
        return;
    }
    const existUsers = await User.find({nickname});
    if(existUsers.length) {
        res.status(400).send({
            msg: "이미 존재하는 아이디 입니다."
        });
        return;
    }
    for (let i = 0; i < password.length; i++) {
        const equal = password.split("")
        const a = nickname.search(equal[i])
        if(a > -1) {
            res.status(400).json({
                msg: "Overlap!"
            })
            return;
        }
    }
    
    const user = new User({nickname, password});
    await user.save();
    res.status(201).send({})

});

//login
router.post("/auth", async (req, res) => {

    const { nickname, password } = req.body;
    
    const user = await User.findOne({nickname});

    if(!user || password !== user.password) {
        res.status(400).send({
            errorMessage: "fail"
        })
        return;
    }
    res.send({
        token:Jwt.sign({ userId: user.userId}, "8fk9wn3eh"),
    });
  

});

router.get("/users/me", authMiddleware, async(req, res) => {
    const { user } = res.locals; // locals에 잘 담겼는지 확인!
    // 상태는 그대로지만, 터미널에 
    // [Object: null prototype] {
    //   user: {
    //     _id: new ObjectId("6291b7ed531b5b09f2fcdfb7"),
    //     email: 'test@email.com',
    //     nickname: 'playhuck',
    //     password: '123123',
    //     __v: 0
    //   }
    // } 라고 콘솔에 나타난다.
    // res.locals로 접근하면 locals에 로그인을 시도한사용자의 정보가 담기기 때문에
    // 항상 사용자 정보가 들어있는 상태로 그냥 api를 구현하는데 사용할 수 있다.
    res.send({ // satus(400)은 bae req이기 때문에 400은 지운다.
      user: { //이렇게 사용해도 되고 password가 없다면 단순히 user, 만 입력해도 정상 작동한다.,
        nickname: user.nickname
      }
      // 내 정보 조회, locals에 담긴 user값을 client에 주기만하면 끝난다.
    });
  });

module.exports = router;
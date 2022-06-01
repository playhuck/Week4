const jwt = require("jsonwebtoken"); // 검증을 위해 jwt를 불러온다.
const User = require("../models/User"); //find조회를 위해 User를 불러온다.

module.exports = async (req, res, next) => {     //middleware 기본 틀
    const { authorization } = req.headers;
    // Bearer Jwt토큰내용을 가져다 쓰기위한 시작, 헤더스안에 헤더가 포함되있다.

    const [tokenType, tokenValue] = authorization.split(" ");
    // 공백을 기준으로 배열로 아래 Bearer eyJh.......LOE를 잘라준다.
    // 0번째 인덱스인 Bearer가 토큰 타입, 1번째가 tokenValue
    if (tokenType !== 'Bearer') { //token 타입이 베어러가 아니라면, 에러 내보낸다.
        res.status(401).send({
            errorMessage: "로그인 후 사용하세요"
        })
        return;
    }
    //try 구문안에서 실행될 때 에러가 발생한다면, 에러를 잡아 캐치구문으로 넘겨준다.
    try {
        const { userId } = jwt.verify(tokenValue, "8fk9wn3eh");

        User.findById(userId).then((user) => { //await 없이 promise then을 사용,
            res.locals.user = user;
            next();   // 미들웨어는 반드시 next 호출, 이 경우에만 next 허용
        });
        // 구문설명) User가 있는데, then((user) => ) 항상 있다고 가정하고.
        // locals라는 공간에 담는데, 이 미들웨어를 사용하는 다른 곳에서도 공통으로
        // 사용할 수 있어서 무척 간편하다.
    } catch (error) {
        res.status(401).send({
            errorMessage: "로그인 후 사용하세요"
        });
        return;
    }
}
import jwt, { JwtPayload, JsonWebTokenError } from 'jsonwebtoken';
import config from '@/config/token';
import isLogin from '@/utils/login';
import { NextApiRequest, NextApiResponse } from 'next';
const db = require('@/common/config/db/db');

// 사용자 정의 에러 클래스
class AuthenticationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'AuthenticationError';
    }
}

// 로그인 POST
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const user_id = await isLogin(req, res);
    if (user_id) return res.redirect('/');
    try {
        const { userid, password } = req.body;
        const user = db.query(`SELECT * FROM user WHERE ${userid},${password}`, function (err: any, result: any) {});
        if (!user) throw new Error('유저 정보 없음');
        const { id } = user.dataValues;
        // JWT 토큰 생성
        const access = jwt.sign({ id }, config.ACCESS_TOKEN!, {
            expiresIn: '1h',
        });
        const refresh = jwt.sign({ id }, config.REFRESH_TOKEN!, {
            expiresIn: '7d',
        });
        // DB에 refresh 토큰 저장
        //UPDATE [테이블] SET [열] = '변경할값' WHERE [조건]
        await db.query(`UPDATE user SET refresh = ${refresh}`, function (err: any, result: any) {});
        // 쿠키 생성 및 설정
        if (req.body.keep == 'on') {
            res.setHeader('Set-Cookie', [
                `access=${access}; HttpOnly; Secure; Max-Age=${60 * 60 * 24 * 30}`,
                `refresh=${refresh}; HttpOnly; Secure;`,
            ]).redirect('/');
        } else {
            res.setHeader('Set-Cookie', [
                `access=${access}; HttpOnly; Secure;`,
                `refresh=${refresh}; HttpOnly; Secure;`,
            ]).redirect('/');
        }
    } catch (err) {
        console.log('콘솔 로깅', err);
        res.status(401).json({ message: '인증 오류' });
    }
}

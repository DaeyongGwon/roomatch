import jwt from 'jsonwebtoken';
import config from '@/config/token';
import isLogin from '@/utils/login';
import { promisify } from 'util'; // Node.js의 util 모듈 사용
import { NextApiRequest, NextApiResponse } from 'next';
const db = require('@/common/config/db/db');
class AuthenticationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'AuthenticationError';
    }
}
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const user_id = await isLogin(req, res);
    if (user_id) return res.redirect('/');
    try {
        const { userid, password } = req.body;
        // db.query() 콜백을 프로미스로 변환
        const queryAsync = promisify(db.query).bind(db);
        const [user] = await queryAsync(
            `SELECT * FROM user WHERE id = ${db.escape(userid)} AND pw = ${db.escape(password)}`,
        );
        console.log('dddd', user);
        if (!user) throw new Error('유저 정보 없음');
        const id = user.id;
        const access = jwt.sign({ id }, config.ACCESS_TOKEN!, {
            expiresIn: '1h',
        });
        const refresh = jwt.sign({ id }, config.REFRESH_TOKEN!, {
            expiresIn: '7d',
        });
        await queryAsync(`UPDATE user SET refresh = '${refresh}' WHERE id = '${id}'`);
        if (req.body.keep == 'on') {
            console.log('test1');
            res.setHeader('Set-Cookie', [
                `access=${access}; HttpOnly; Secure; Max-Age=${60 * 60 * 24 * 30}; Path=/`,
                `refresh=${refresh}; HttpOnly; Secure; Path=/`,
            ]).redirect('/');
        } else {
            console.log('test2');
            res.setHeader('Set-Cookie', [
                `access=${access}; HttpOnly; Secure; Path=/`,
                `refresh=${refresh}; HttpOnly; Secure; Path=/`,
            ]).redirect('/');
        }
    } catch (err) {
        console.log('콘솔 로깅', err);
        res.status(401).json({ message: '인증 오류' });
    }
}

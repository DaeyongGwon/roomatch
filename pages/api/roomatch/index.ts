import isLogin from '@/utils/login';
import { NextApiRequest, NextApiResponse } from 'next';
const db = require('@/common/config/db/db');
import { promisify } from 'util';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const userId = await isLogin(req, res);
        if (!userId) return res.redirect('/user/signin');
        console.log('로그인 O');
        const queryAsync = promisify(db.query).bind(db);
        const [data] = await queryAsync(`SELECT * FROM user WhERE id = 'daeyong'`);
        res.send(data);
        console.log(data);
    } catch (error) {
        console.error('유저 ID 가져오기 오류:', error);
        res.status(500).json({ message: '유저 ID 가져오기 실패' });
    }
}

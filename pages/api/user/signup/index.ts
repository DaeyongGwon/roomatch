const db = require('@/common/config/db/db');
import { NextApiRequest, NextApiResponse } from 'next';
import isLogin from '@/utils/login';
import { getSession } from 'next-auth/react';
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const user_id = await isLogin(req, res);
        if (user_id) return res.redirect('/');
        res.status(200).json({ page: 'signup' });
    } else if (req.method === 'POST') {
        const { userid, password } = req.body;
        const createUserQuery = `
      INSERT INTO user (id, pw)
      VALUES (${userid},${password})
    `;
        try {
            // const result = db.query(createUserQuery, function (err: any, result: any) {});
            // const userId = result.insertId;

            db.query(createUserQuery, function (err: any, result: any) {
                if (err) {
                    console.error('에러 발생:', err);
                } else {
                    const userId = result.insertId;
                    console.log('새로운 사용자 ID:', userId);
                    // 가상의 세션 설정
                    req.session.user = userId;
                    res.status(200).json({ result: true, name: userid, password });
                }
            });
        } catch (err) {
            console.log('회원가입 실패', err);
            res.status(500).json({ result: false });
        }
    } else {
        res.status(404).end();
    }
}

import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react'; // Import getSession from next-auth/react
const db = require('@/common/config/db/db');
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const session = await getSession({ req }); // Get session using getSession
        if (session?.user) return res.redirect('/');
        res.status(200).json({ page: 'signup' });
    } else if (req.method === 'POST') {
        const { user_id, password, name, email } = req.body;

        const createUserQuery = `
             INSERT INTO user (id, pw, name, email)
             VALUES ('${user_id}', '${password}','${name}','${email}')
        `;
        try {
            db.query(createUserQuery, function (err: any, result: any) {
                if (err) {
                    console.error('에러 발생:', err);
                    res.status(500).json({ result: false });
                } else {
                    const userId = result.insertId;
                    console.log('새로운 사용자 ID:', userId);
                    // req.session.user = userId; // Remove this line
                    res.status(200).json({ result: true, data: user_id, password, name, email });
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

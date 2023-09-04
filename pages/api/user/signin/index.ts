import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import { signJwtAccessToken } from '@/lib/jwt';

const db = require('@/common/config/db/db');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { user_id, password } = req.body;

            // Configure MySQL
            const [rows] = await db.promise().query('SELECT * FROM user WHERE id = ?', [user_id]);

            if (rows.length > 0) {
                const user = rows[0];

                // 비밀번호 비교
                const passwordMatch = await bcrypt.compare(password, user.password);

                if (passwordMatch) {
                    const { password, ...userWithoutPass } = user;
                    const accessToken = signJwtAccessToken(userWithoutPass);

                    const result = {
                        ...userWithoutPass,
                        accessToken,
                        user: userWithoutPass, // user 정보를 추가합니다.
                    };

                    return res.status(200).json(result);
                }
            }

            // 사용자를 찾을 수 없거나 비밀번호가 일치하지 않는 경우
            return res.status(401).json({ message: '인증 실패' });
        } catch (error) {
            console.error('[MySQL 오류]:', error);
            return res.status(500).json({ message: '서버 오류' });
        }
    } else {
        return res.status(405).json({ message: '잘못된 요청 메서드' });
    }
}

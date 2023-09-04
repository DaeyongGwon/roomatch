import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import { signJwtAccessToken } from '@/lib/jwt'; // JWT 토큰 생성 함수

// 데이터베이스 연결 설정 (db 모듈을 이용해야 함)
const db = require('@/common/config/db/db');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            const { username, pw } = req.body;

            // 데이터베이스에서 사용자 정보 조회
            const [rows] = await db.promise().query('SELECT * FROM user WHERE id = ?', [username]);
            const user = rows[0];

            if (user) {
                // 데이터베이스에서 사용자를 찾았을 때
                console.log('test : ', bcrypt.compareSync(pw, user.pw));
                if (bcrypt.compareSync(pw, user.pw)) {
                    // 비밀번호가 일치하면 JWT 토큰 생성
                    // const accessToken = signJwtAccessToken(user.id); // 사용자 ID로 JWT 토큰 생성 함수 호출///

                    return res.status(200).json({ message: '인증 성공', user: { id: user.id, name: user.name } });
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

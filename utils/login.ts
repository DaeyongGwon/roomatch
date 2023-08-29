import jwt from 'jsonwebtoken';
import config from '@/config/token';
import { NextApiRequest, NextApiResponse } from 'next';
const db = require('@/common/config/db/db');

export default async function isLogin(req: NextApiRequest, res: NextApiResponse) {
    try {
        const access = req.headers.authorization || req.cookies.access;
        if (!access) throw new Error('로그인 되어 있지 않음');
        // access 토큰이 존재하는 경우
        const { id } = jwt.verify(access, config.ACCESS_TOKEN) as jwt.JwtPayload;
        if (!id) throw new Error('유저 정보 없음');
        return id;
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            // access 토큰이 만료된 경우에만 refresh 토큰 검증
            console.log('Access 토큰 만료');
        } else {
            // 그외의 경우 모두 로그인 페이지로 리디렉션
            console.log('Access 토큰 검증 오류', err);
            return;
        }
    }
    // refresh 토큰 확인
    const refresh = (req.headers.refresh || req.cookies.refresh) as string;
    if (!refresh) {
        return;
    }
    try {
        // refresh 토큰이 유효한 경우 유저 ID 반환
        const { id } = jwt.verify(refresh, config.REFRESH_TOKEN!) as jwt.JwtPayload;
        // DB에서 유저 refresh 가져오기
        const user = db.query(`SELECT * FROM user WHERE ${id}`, function (err: any, result: any) {});
        if (!user) throw new Error('유저 정보 없음');
        if (user.refresh !== refresh) {
            // refresh 토큰이 일치하지 않는 경우
            throw new Error('Refresh 토큰 불일치');
        }
        // 새 access 토큰 발급
        const newAccess = jwt.sign({ user: id }, config.ACCESS_TOKEN!, {
            expiresIn: '1h',
        });
        req.headers.authorization = `Bearer ${newAccess}`;
        // 쿠키 설정
        res.setHeader('Set-Cookie', `access=${newAccess}; HttpOnly`);
        return id;
    } catch (err) {
        // 이외의 경우 로그인 페이지로 리디렉션합니다.
        console.log('Refresh 토큰 검증 오류', err);
        return;
    }
}

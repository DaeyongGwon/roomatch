import { NextApiRequest, NextApiResponse } from 'next';
import * as bcrypt from 'bcrypt';
const db = require('@/common/config/db/db');

// Check if there is a space or not
function checkSpace(str: string): boolean {
    if (str.search(/\s/) !== -1) {
        return false;
    } else {
        return true;
    }
}

// Check if there are special characters or not
function checkSpecial(str: string): boolean {
    const special_pattern = /[`~!@#$%^&*|\\\'\";:\/?]/gi;
    return special_pattern.test(str);
}

// Check pw pattern (more than 8 characters, check whether letters, numbers, and special characters are included)
function checkPasswordPattern(str: string): boolean {
    const pattern1 = /[0-9]/; // number
    const pattern2 = /[a-zA-Z]/; // message
    const pattern3 = /[~!@#$%^&*()_+|<>?:{}]/; // Special Characters
    return pattern1.test(str) && pattern2.test(str) && pattern3.test(str) && str.length >= 8;
}

export default async function CPostUser(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    let id: string;
    let pw: string;
    let name: string;
    let email: string;

    if (
        checkSpace(req.body.id.trim()) &&
        checkSpace(req.body.pw.trim()) &&
        checkSpecial(req.body.pw.trim()) &&
        checkPasswordPattern(req.body.pw.trim())
    ) {
        id = req.body.id.trim();
    } else {
        res.send({ msg: 'ID 또는 비밀번호 형식이 올바르지 않습니다.', result: false });
        return;
    }

    // Check for ID duplicates
    const [users] = await db.promise().query('SELECT * FROM user WHERE id = ?', [id]);
    if (users.length > 0) {
        res.send({ msg: '이 ID는 이미 사용 중입니다.', result: false });
        return;
    } else {
        email = req.body.email.trim();
    }

    // Check for duplicate emails, encrypt and add to DB
    const [usersByEmail] = await db.promise().query('SELECT * FROM user WHERE email = ?', [email]);
    if (usersByEmail.length > 0) {
        res.send({ msg: '이미 회원으로 등록되어 있습니다.', result: 'user' });
        return;
    } else {
        pw = req.body.pw.trim();
        name = req.body.name.trim();

        // Password encryption (솔트 제거)
        const saltRounds = 12;
        const hashedPassword = bcrypt.hashSync(pw, saltRounds);

        const createUserQuery = `
            INSERT INTO user (id, pw, name, email)
            VALUES (?, ?, ?, ?)
        `;

        try {
            await db.promise().query(createUserQuery, [id, hashedPassword, name, email]);
            res.send({ message: '회원 가입이 완료되었습니다.', result: true });
        } catch (error: any) {
            console.error('회원 가입 오류:', error);
            res.status(500).send({ message: '회원 가입 중 오류가 발생했습니다.', result: false });
        }
    }
}

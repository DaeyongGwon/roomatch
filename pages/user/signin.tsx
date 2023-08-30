import { signIn, signOut, useSession } from 'next-auth/react';
import styles from '@/styles/user.module.css';
import Image from 'next/image';
import kakaoButton from '@/public/image/kakao_button.png';
import GoogleButton from '@/public/image/google_button.png';
import naverButton from '@/public/image/naver_button.png';
import Link from 'next/link';
import { useState } from 'react';
import axios from 'axios';

export default function Signin() {
    const { data: session } = useSession();
    const [userid, setUserid] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleLogin = async () => {
        console.log('사용자 이름:', userid);
        console.log('비밀번호:', password);

        try {
            const response = await axios.post('/api/user/signin', {
                userid: userid,
                password: password,
            });
            const responseData = response.data;

            // 서버로부터의 응답 처리
            if (response.status === 200) {
                console.log('로그인 성공:', responseData.message);
            } else {
                console.log('로그인 실패:', responseData.message);
            }
        } catch (error) {
            console.error('에러 발생:', error);
        }
    };

    if (session) {
        return (
            <>
                {session.user?.name}님 반갑습니다 <br />
                <button onClick={() => signOut()}>로그아웃</button>
            </>
        );
    }

    return (
        <>
            <div className={styles['login-container']}>
                <h1>Login</h1>
                <div className={styles['login-form']}>
                    <fieldset>
                        <div>
                            <input
                                type="text"
                                placeholder="ID"
                                className={styles['user-input-label']}
                                value={userid}
                                onChange={(e) => setUserid(e.target.value)}
                            />
                        </div>
                        <br />
                        <div>
                            <input
                                type="password"
                                placeholder="PW"
                                className={styles['user-input-label']}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </fieldset>
                    <button onClick={handleLogin} className={styles['signin-button']}>
                        로그인
                    </button>
                    <Link href="/user/signup">
                        <div className={styles['signup-button']}>회원가입</div>
                    </Link>
                </div>
                <div className={styles['social-login']}>
                    <Image
                        src={kakaoButton}
                        style={{ width: '50px', height: '50px', padding: '6px' }}
                        alt="Kakao"
                        onClick={() => signIn('kakao')}
                    />
                    <Image
                        src={GoogleButton}
                        style={{ width: '50px', height: '50px', padding: '6px' }}
                        alt="google"
                        onClick={() => signIn('google')}
                    />
                    <Image
                        src={naverButton}
                        style={{ width: '50px', height: '50px', padding: '6px' }}
                        alt="naver"
                        onClick={() => signIn('naver')}
                    />
                </div>
            </div>
        </>
    );
}

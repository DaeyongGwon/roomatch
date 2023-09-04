'use client';
import { signIn, signOut, useSession } from 'next-auth/react';
import styles from '@/styles/user.module.css';
import Image from 'next/image';
import kakaoButton from '@/public/image/kakao_button.png';
import GoogleButton from '@/public/image/google_button.png';
import naverButton from '@/public/image/naver_button.png';
import Link from 'next/link';
import { useState } from 'react';

export default function Signin() {
    const { data: session } = useSession();
    const [username, setUserid] = useState<string>('');
    const [pw, setpw] = useState<string>('');

    const handleLogin = async () => {
        console.log('사용자 이름:', username);
        console.log('비밀번호:', pw);

        try {
            // credentials로 아이디와 패스워드를 전송하여 로그인
            const response = await signIn('credentials', {
                username: username,
                pw: pw,
                // 필요한 추가 데이터가 있다면 여기에 추가 가능
                redirect: false,
                // callbackUrl: '/',
            });
            console.log('response : ', response);
            if (response?.error) {
                console.log('로그인 실패:', response.error);
                return null;
            } else {
                //로그인 성공시 메인 페이지로 리다이렉트
                console.log('로그인 성공');
                // console.log('session.user', session.user);

                // window.location.href = '/';
            }
        } catch (error) {
            console.error('에러 발생:', error);
        }
    };

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
                                value={username}
                                onChange={(e) => setUserid(e.target.value)}
                            />
                        </div>
                        <br />
                        <div>
                            <input
                                type="password"
                                placeholder="PW"
                                className={styles['user-input-label']}
                                value={pw}
                                onChange={(e) => setpw(e.target.value)}
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

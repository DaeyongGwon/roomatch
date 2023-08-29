import { signIn, useSession, signOut } from 'next-auth/react';
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
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const handleLogin = () => {
        // 로그인 처리 또는 데이터 전송 로직을 구현합니다
        console.log('사용자 이름:', username);
        console.log('비밀번호:', password);
        // 폼 데이터 전송을 원하신다면 아래 코드를 추가합니다
        // document.getElementById("loginForm")?.submit();
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
                    <form id="loginForm">
                        <fieldset>
                            <div>
                                <input
                                    type="text"
                                    placeholder="ID"
                                    className={styles['user-input-label']}
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
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
                    </form>

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

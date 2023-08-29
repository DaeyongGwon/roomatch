import { signIn, useSession, signOut } from 'next-auth/react';
import styles from '@/styles/user.module.css';
import Image from 'next/image';
import kakaoButton from '@/public/image/kakao_button.png';
import GoogleButton from '@/public/image/google_button.png';
import naverButton from '@/public/image/naver_button.png';
export default function Signin() {
    const { data: session } = useSession();
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
                    <form>
                        <fieldset>
                            <div>
                                {/* <label className={styles['user-label']}></label> */}
                                <input type="text" placeholder="ID" className={styles['user-input-label']} />
                            </div>
                            <br />
                            <div>
                                {/* <label className={styles['user-label']}></label> */}
                                <input type="password" placeholder="PW" className={styles['user-input-label']} />
                            </div>
                        </fieldset>
                    </form>
                </div>

                <div>회원가입</div>

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

import { signIn, useSession, signOut } from 'next-auth/react';
import styles from '@/styles/user.module.css';
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
                <h1>로그인창</h1>
                <div className={styles['login-form']}>
                    <form>
                        <div>
                            <label className={styles['user-label']}>아이디</label>
                            <input type="text" />
                        </div>
                        <br />
                        <div>
                            <label className={styles['user-label']}>패스워드</label>
                            <input type="password" />
                        </div>
                    </form>
                </div>

                <div className={styles['social-login']}>
                    <button className={styles.social} onClick={() => signIn('kakao')}>
                        kakao login
                    </button>
                    <button className={styles.social} onClick={() => signIn('naver')}>
                        naver login
                    </button>
                    <button className={styles.social} onClick={() => signIn('google')}>
                        google login
                    </button>
                </div>
            </div>
        </>
    );
}

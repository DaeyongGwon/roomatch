import Link from 'next/link';
import styles from '../../styles/Navbar.module.css';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function Navbar() {
    const { data: session } = useSession();
    return (
        <div className={styles.headerBox}>
            {' '}
            <div className={styles.logo}>
                {' '}
                <Link href="/">roommate</Link>
            </div>
            <div className={styles.menu}>
                {' '}
                <Link className="nav-category" href="/roomatch">
                    룸메매칭
                </Link>
                <Link className="nav-category" href="/checklist">
                    체크리스트
                </Link>
                <Link className="nav-category" href="/community">
                    커뮤니티
                </Link>
                <Link className="nav-category" href="/admin_ask">
                    관리자문의
                </Link>
            </div>
            <div className={styles.user}>
                {session ? (
                    <>
                        <p>{session.user?.name}님 반갑습니다</p>
                        <button onClick={() => signOut()}>로그아웃</button>
                    </>
                ) : (
                    <>
                        <Link className={styles['user-category']} href="/user/signin">
                            로그인
                        </Link>
                        <Link className={styles['user-category']} href="/user/signup">
                            회원가입
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}

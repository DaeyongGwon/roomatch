import { signIn, useSession, signOut } from 'next-auth/react';

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
    return <>메인</>;
}

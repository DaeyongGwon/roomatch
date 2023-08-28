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
    return (
        <>
            <button
                className="w-full transform rounded-md bg-gray-700 px-4 py-2 tracking-wide text-white transition-colors duration-200 hover:bg-gray-600 focus:bg-gray-600 focus:outline-none"
                onClick={() => signIn('kakao')}
            >
                kakao login
            </button>
            <button
                className="w-full transform rounded-md bg-gray-700 px-4 py-2 tracking-wide text-white transition-colors duration-200 hover:bg-gray-600 focus:bg-gray-600 focus:outline-none"
                onClick={() => signIn('naver')}
            >
                naver login
            </button>
            <button
                className="w-full transform rounded-md bg-gray-700 px-4 py-2 tracking-wide text-white transition-colors duration-200 hover:bg-gray-600 focus:bg-gray-600 focus:outline-none"
                onClick={() => signIn('google')}
            >
                google login
            </button>
        </>
    );
}

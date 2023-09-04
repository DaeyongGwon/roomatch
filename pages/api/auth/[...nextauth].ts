import NextAuth from 'next-auth';
import KakaoProvider from 'next-auth/providers/kakao';
import NaverProvider from 'next-auth/providers/naver';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

export default NextAuth({
    providers: [
        NaverProvider({
            clientId: process.env.NAVER_CLIENT_ID as string,
            clientSecret: process.env.NAVER_SECRET as string,
        }),
        KakaoProvider({
            clientId: process.env.KAKAO_CLIENT_ID as string,
            clientSecret: process.env.KAKAO_SECRET as string,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_SECRET as string,
        }),
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: 'Credentials',
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, pw, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                username: {
                    label: '아이디',
                    type: 'text',
                    placeholder: '아이디 입력 요망',
                },
                pw: { label: '비밀번호', type: 'pw' },
            },

            async authorize(credentials, req) {
                const res = await fetch(`${process.env.NEXTAUTH_URL}/api/user/signin`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: credentials?.username,
                        pw: credentials?.pw,
                    }),
                });
                const user = await res.json();
                console.log('user', user);
                if (res.status === 401) {
                    console.log('로그인 실패2');
                    return null; // 로그인 실패 시 null 반환
                } else {
                    // 로그인 성공시 사용자 정보를 세션에 저장
                    const { username, name } = user.user;
                    console.log('user', user.user);
                    const sessionUser = { id: user.user.id, name: user.user.name }; // 필요한 사용자 정보만 선택
                    console.log(sessionUser, 'sessionUser');
                    console.log('로그인 성공2');
                    return sessionUser; // 세션에 저장할 사용자 정보 반환
                }
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user }) {
            return { ...token, ...user };
        },

        async session({ session, token }) {
            session.user = token as any;
            return session;
        },
    },

    pages: {
        signIn: '/user/signin',
    },
});

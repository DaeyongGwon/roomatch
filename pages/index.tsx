'use client';
import { signIn, signOut, useSession } from 'next-auth/react';
import React from 'react';

function SignInButton() {
    const { data: session } = useSession();

    if (session && session.user) {
        return (
            <button className="px-12 py-4 border rounded-xl bg-red-300" onClick={() => signOut()}>
                {session.user.name}님 <br />
                아이디{session.user.id}
                <br />
                email{session.user.email}
            </button>
        );
    }

    return (
        <button className="px-12 py-4 border rounded-xl bg-yellow-300" onClick={() => signIn()}>
            LogIn
        </button>
    );
}

export default SignInButton;

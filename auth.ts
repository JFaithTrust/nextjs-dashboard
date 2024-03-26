
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { sql } from '@vercel/postgres';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import axios from "@/app/api/axios";

// async function getUser(email: string): Promise<User | undefined> {
//     try {
//         const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
//         return user.rows[0];
//     } catch (error) {
//         console.error('Failed to fetch user:', error);
//         throw new Error('Failed to fetch user.');
//     }
// }

async function getUser(values: User): Promise<User | undefined>{
    try {
        const {data} = await axios.post("/Auth/login", values)
        console.log(data)
        return data
    }catch (error) {
        console.error('Failed to fetch user:', error);
         throw new Error('Failed to fetch user.');
    }
}

export const { auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object(
                        {
                            userName: z.string().min(1),
                            password: z.string().min(6)
                        })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    // const { email, password } = parsedCredentials.data;
                    // const user = await getUser(email);
                    const user = await getUser(parsedCredentials.data)
                    if (user){
                        return user
                    }else {
                        return null
                    }
                    // const passwordsMatch = await bcrypt.compare(password, user.password);
                    // if (passwordsMatch) return user;
                }
                return null;
            },
        }),
    ],
});
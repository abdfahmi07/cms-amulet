import Credentials from "next-auth/providers/credentials";

import bcrypt from "bcrypt";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";

import avatar3 from "@/public/images/avatar/avatar-3.jpg";
import axios from "axios";
// export const user = [
//   {
//     id: 1,
//     name: "dashtail",
//     image: avatar3,
//     password: "password",
//     email: "dashtail@codeshaper.net",
//     resetToken: null,
//     resetTokenExpiry: null,
//     profile: null,
//   },
// ];

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    GithubProvider({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    Credentials({
      name: "credentials",
      credentials: {
        value: { label: "Value", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // console.log(credentials, "creds");
        try {
          const payloads = {
            value: credentials.value,
            password: credentials.password,
          };

          const { data } = await axios.post(
            `https://api-rakhsa.inovatiftujuh8.com/api/v1/auth/login`,
            payloads,
            {
              headers: { "Content-Type": "application/json" },
            }
          );

          // console.log(data);
          if (data && data.data.token) {
            console.log("oke");
            return data.data;
          } else {
            return null;
          }
        } catch (err) {
          console.log(err);
        }
        // if (!credentials?.email || !credentials?.password) {
        //   throw new Error("Missing credentials");
        // }
        // const foundUser = user.find((u) => u.email === credentials.email);

        // if (!foundUser) {
        //   throw new Error("User not found");
        // }

        // //  check correctPassword plain without bcrypt
        // const correctPassword = credentials.password === foundUser.password;

        // if (!correctPassword) {
        //   throw new Error("Invalid password");
        // }

        // return foundUser;
      },
      callbacks: {
        // async signIn({ user }) {
        //   console.log(user, "user");
        //   if (!user.email?.endsWith(process.env.ALLOWED_DOMAIN)) {
        //     throw new Error("You are not allowed to access this platform");
        //   }
        //   return true;
        // },
        async jwt({ token, user }) {
          // Attach tokens and user role if user data is present
          if (user) {
            token.accessToken = user.token;
            token.refreshToken = user.refreshToken;
            token.role = user.role;
          }
          console.log(user, "user");
          return token;
        },
        async session({ session, token }) {
          // Make the token available in the session
          session.accessToken = token.accessToken;
          session.refreshToken = token.refreshToken;
          session.user.role = token.role; // Include role if necessary
          console.log(token, "token");
          return session;
        },
      },
      session: {
        strategy: "jwt",
      },
      pages: {
        signIn: "/", // Custom sign-in page if you have one
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  debug: process.env.NODE_ENV !== "production",
};

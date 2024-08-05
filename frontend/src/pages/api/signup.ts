"use server"
import type { NextApiRequest, NextApiResponse } from 'next'
import cookie from "cookie"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const requestBody = JSON.stringify(req.body);
    const response = await fetch("http://127.0.0.1:8000/api/signup", {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        method: "POST",
        body: requestBody,
        credentials: "include"
    })
    console.log("resssss", requestBody)

    if (response.status === 201) {
        const responseData = await response.json();
        console.log("responsedataaa", responseData)
        const isProduction = process.env.NODE_ENV === 'production';

        res.setHeader('Set-Cookie', [
            cookie.serialize(
                'access', responseData.access, {
                httpOnly: true,
                secure: false,
                maxAge: 60 * 60 * 24,
                sameSite: 'strict',
                path: '/'
            }
            ),
            // cookie.serialize(
            //     'refresh', responseData.refresh, {
            //     httpOnly: true,
            //     secure: false,
            //     maxAge: 60 * 60 * 24,
            //     sameSite: 'strict',
            //     path: '/'
            // }
            // )
        ]);
        res.status(201).json({ ...responseData })
    }else{
        const responseData = await response.json();
        res.status(response.status).json({ ...responseData })
    }
}
"use server"
import cookie from 'cookie';
import type { NextApiRequest, NextApiResponse } from 'next'
import { cookies } from 'next/headers'


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const requestBody = JSON.stringify(req.body);
    const cookies = cookie.parse(req.headers.cookie ?? '');
    const accessToken = cookies?.access
    const headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken || ""}`,
    }
    // console.log("bearer", cookies, accessToken, requestBody)
    if (req.method === "GET"){
        const response = await fetch(`${process.env.BACKEND_ENDPOINT}/apiback/profile`, {
            headers: headers,
        })
        
        if (response.status === 200){
            const responseData = await response.json();
            // console.log(response, responseData)
            res.status(200).json( responseData )
        }else 
        res.status(response.status).json( response )
    }else if (req.method === "PUT"){

        const response = await fetch(`${process.env.BACKEND_ENDPOINT}/apiback/profile`, {
            headers: headers,
            method: "PUT",
            body: requestBody
        })
        
        if (response.status === 202){
            const responseData = await response.json();
            // console.log(response, responseData)
            res.status(202).json( responseData )
        }else 
        res.status(response.status).json( response )

    }
}
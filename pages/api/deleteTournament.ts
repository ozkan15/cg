// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { randomUUID } from 'crypto'
import type { NextApiRequest, NextApiResponse } from 'next'
import { Tournament } from '../../src/common/types'
import * as fs from 'fs';

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<{ success: boolean }>
) {
    console.log(req.body);
    return new Promise((resolve) => {
        try {
            setTimeout(() => {
                const avatar = req.body.owner.avatar as string;
                const coverImage = req.body.coverImage as string;
                fs.unlinkSync("./public/" + avatar);
                fs.unlinkSync("./public/" + coverImage);
                res.status(200).json({ success: true });
            }, 5000);
        }
        catch (err) {
            console.log(err);
            resolve(res.status(400).end());
        }
    });
}

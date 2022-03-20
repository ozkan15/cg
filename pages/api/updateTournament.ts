// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { randomUUID } from 'crypto'
import type { NextApiRequest, NextApiResponse } from 'next'
import { Tournament } from '../../src/common/types'
import * as fs from 'fs';
import formidable from 'formidable';

export const config = {
    api: {
        bodyParser: false,
    },
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<Tournament>
) {
    const form = formidable({ multiples: true, uploadDir: "./public", keepExtensions: true });

    return new Promise((resolve) => {
        try {
            form.parse(req, (err, fields, files) => {
                try {
                    const updatedTournament: Tournament = {
                        __typename: "Tournament",
                        id: fields.id as string,
                        name: fields.name as string,
                        owner: {
                            __typename: "User",
                            id: fields.ownerId as string,
                            avatar: (files?.avatar as any)?.newFilename || fields?.oldAvatar,
                            username: fields.ownerUsername as string
                        },
                        alias: fields.alias as string,
                        coverImage: (files?.coverImage as any)?.newFilename || fields?.oldCoverImage,
                        deadline: fields.deadline as string,
                        prize: Number(fields.prize),
                        vote: Number(fields.vote),
                        lastVoteTime: fields?.lastVoteTime as string || "",
                        waitlistParticipantsCount: Number(fields.waitlistParticipantsCount)
                    };

                    resolve(res.status(200).json(updatedTournament));
                } catch (err) {
                    console.log(err);
                    resolve(res.status(400).end());
                }
            });
        }
        catch (err) {
            console.log(err);
            resolve(res.status(400).end());
        }
    });
}

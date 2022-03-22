// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { randomUUID } from 'crypto'
import type { NextApiRequest, NextApiResponse } from 'next'
import { Tournament } from '../../src/common/types'
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
          const newTournament:Tournament = {
            __typename: "Tournament",
            id: randomUUID(),
            name: fields.name as string,
            owner: {
              __typename: "User",
              id: randomUUID(),
              avatar: (files?.avatar as any)?.newFilename,
              username: fields.ownerUsername as string
            },
            waitlistParticipantsCount: 0,
            alias: fields.alias as string,
            coverImage: (files?.coverImage as any)?.newFilename,
            deadline: fields.deadline as string,
            prize: Number(fields.prize as string),
            lastVoteTime: "",
            vote: 0
          };

          resolve(res.status(200).json(newTournament));
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

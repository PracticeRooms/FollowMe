// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import CoordinatesModel from '@/src/models/Coordinates';
import { Coordinates } from '@/src/types'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Coordinates>
) {
  const coordinates = req.body;

  await CoordinatesModel.saveAll(coordinates)
  res.status(200).json(coordinates);
}

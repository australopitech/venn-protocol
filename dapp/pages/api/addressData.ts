import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchBalancesData } from '../../utils/covalentFetchData'; // Import your utility function
import { BalancesResponse } from '../../types/typesNftApi';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BalancesResponse | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  const { network, address } = req.query;

  if (typeof network !== 'string' || typeof address !== 'string') {
    return res.status(400).json({ error: 'Invalid query parameters' });
  }

  try {
    const data = await fetchBalancesData(network, address);
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

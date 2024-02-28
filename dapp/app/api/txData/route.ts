import { fetchTransactionsData } from '../../../utils/covalentFetchData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const network = searchParams.get('network');
  const txHash = searchParams.get('txHash');

  console.log("GET txData", network, txHash);

  if (!network || !txHash) {
    return new Response(JSON.stringify({ error: 'Invalid query parameters' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    const data = await fetchTransactionsData(network, txHash);
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
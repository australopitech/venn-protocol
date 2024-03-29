import { fetchBalancesDataCovalent } from '../../../utils/covalentFetchData';
import { fetchAddressDataAlchemy } from '../../../utils/alchemyFetchData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const network = searchParams.get('network');
  const address = searchParams.get('address');

  console.log("GET", network, address);

  if (!network || !address) {
    return new Response(JSON.stringify({ error: 'Invalid query parameters' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    // const data = await fetchBalancesDataCovalent(network, address);
    const data = await fetchAddressDataAlchemy(network, address);
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
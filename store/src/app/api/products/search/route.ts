import { cmsClient } from '@/lib'
import { NextRequest, NextResponse } from 'next/server'

async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('query')

  if (!query) {
    return NextResponse.json(
      { message: 'Query param is requried' },
      { status: 400 },
    )
  }

  try {
    const products = await cmsClient.searchProducts({ query, limit: 4 })
    if (process.env.NODE_ENV === 'development')
      await new Promise((res) => setTimeout(res, 1000))
    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    )
  }
}

export { GET }

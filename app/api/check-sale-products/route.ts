import { getProducts } from "@/lib/database"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check if there are any products on sale
    const onSaleProducts = await getProducts({ 
      on_sale: true, 
      active: true,
      limit: 1 // We only need to know if any exist
    })

    return NextResponse.json({ 
      hasSaleProducts: onSaleProducts.length > 0 
    })
  } catch (error) {
    console.error('Error checking sale products:', error)
    return NextResponse.json({ hasSaleProducts: false })
  }
}

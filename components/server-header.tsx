import { getProducts } from "@/lib/database"
import { Header } from "./header"

export async function ServerHeader() {
  // Check if there are any products on sale
  const onSaleProducts = await getProducts({ 
    on_sale: true, 
    active: true,
    limit: 1 // We only need to know if any exist
  })

  const hasSaleProducts = onSaleProducts.length > 0

  return <Header hasSaleProducts={hasSaleProducts} />
}

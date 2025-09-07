"use client"

import { useEffect, useState } from "react"
import { Header } from "./header"

export function ClientHeaderWrapper() {
  const [hasSaleProducts, setHasSaleProducts] = useState(false)

  useEffect(() => {
    // Check if there are sale products by making a request to the on-sale page
    // This is a simple way to check without duplicating the database logic
    fetch('/api/check-sale-products')
      .then(res => res.json())
      .then(data => setHasSaleProducts(data.hasSaleProducts))
      .catch(() => setHasSaleProducts(false))
  }, [])

  return <Header hasSaleProducts={hasSaleProducts} />
}

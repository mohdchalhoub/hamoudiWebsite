import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle, Home } from "lucide-react"
import { OrderConfirmationClient } from "./order-confirmation-client"

interface OrderConfirmationPageProps {
  params: {
    id: string
  }
}

export default function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-green-600 mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground">Thank you for your order. We'll process it shortly.</p>
        </div>

        <OrderConfirmationClient orderId={params.id} />

        <div className="text-center mt-8 space-y-4">
          <p className="text-muted-foreground">
            We'll send you updates about your order via your selected confirmation method.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button variant="outline">Continue Shopping</Button>
            </Link>
            <Link href="/">
              <Button>
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

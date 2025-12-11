// app/(store)/policies/refund/page.tsx
export default function RefundPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Return & Refund Policy</h1>
        
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              30-Day Return Policy
            </h2>
            <p className="text-gray-600 mb-4">
              We offer a 30-day return policy for all purchases. To be eligible 
              for a return:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>The item must be unused and in the same condition you received it</li>
              <li>The item must be in the original packaging</li>
              <li>All protective films, tags, and accessories must be intact</li>
              <li>Proof of purchase is required</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Return Process
            </h2>
            <ol className="list-decimal pl-6 text-gray-600 space-y-2">
              <li>Contact our customer service team to initiate a return</li>
              <li>Receive a return authorization number and shipping label</li>
              <li>Pack the item securely in its original packaging</li>
              <li>Ship the item using the provided label within 7 days</li>
              <li>Once received, we will process your refund within 5-7 business days</li>
            </ol>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Refunds
            </h2>
            <p className="text-gray-600 mb-4">
              Refunds will be issued to the original payment method. Please note:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Shipping costs are non-refundable</li>
              <li>Return shipping fees may apply unless the return is due to our error</li>
              <li>International customs duties and taxes are non-refundable</li>
              <li>Processing time may vary depending on your payment provider</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Exchanges
            </h2>
            <p className="text-gray-600">
              We currently do not offer direct exchanges. To exchange an item, 
              please return the original item for a refund and place a new order 
              for the desired item.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Damaged or Defective Items
            </h2>
            <p className="text-gray-600">
              If you receive a damaged or defective item, please contact us 
              immediately. We will arrange for a replacement or refund and 
              cover all shipping costs.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
// app/(store)/policies/privacy/page.tsx
export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Information We Collect
            </h2>
            <p className="text-gray-600 mb-4">
              We collect information you provide directly to us, such as when you 
              create an account, make a purchase, or contact customer service. 
              This may include:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Contact information (name, email address, phone number)</li>
              <li>Shipping and billing address</li>
              <li>Payment information (processed securely by our payment partners)</li>
              <li>Order history and preferences</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              How We Use Your Information
            </h2>
            <p className="text-gray-600 mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Process and fulfill your orders</li>
              <li>Communicate with you about orders, products, and promotions</li>
              <li>Improve our website and customer experience</li>
              <li>Prevent fraud and enhance security</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Data Security
            </h2>
            <p className="text-gray-600">
              We implement appropriate technical and organizational security 
              measures to protect your personal information against unauthorized 
              access, alteration, disclosure, or destruction.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Your Rights
            </h2>
            <p className="text-gray-600 mb-4">
              Depending on your location, you may have the right to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your personal information</li>
              <li>Object to or restrict certain processing activities</li>
              <li>Data portability</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
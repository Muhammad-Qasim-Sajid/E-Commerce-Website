// app/(store)/page.tsx
import ProductCard from '@/components/store/ProductCard'
import Testimonials from '@/components/store/Testimonials'
import FAQ from '@/components/store/FAQ'
import { products } from '@/data/products'
import { ArrowRight, Shield, Truck, Clock } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const featuredProducts = products.filter(p => p.isFeatured)

  return (
    <div>
      <section className="relative overflow-hidden bg-linear-to-br from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Timeless Elegance,<br />Modern Precision
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Discover our collection of handcrafted timepieces where traditional
              craftsmanship meets contemporary design.
            </p>
            <Link
              href="/product/1"
              className="btn-primary inline-flex items-center gap-2 bg-white text-gray-900 hover:bg-gray-100"
            >
              Explore Collection
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Collections
            </h2>
            <p className="text-gray-600">
              Curated selections for the discerning collector
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="#"
              className="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700"
            >
              View All Products
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Free Shipping</h3>
              <p className="text-gray-600">On orders over $500</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">2-Year Warranty</h3>
              <p className="text-gray-600">Comprehensive protection</p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">30-Day Returns</h3>
              <p className="text-gray-600">Hassle-free returns</p>
            </div>
          </div>
        </div>
      </section>

      <Testimonials />
      <FAQ />
    </div>
  )
}
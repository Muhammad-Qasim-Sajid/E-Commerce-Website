// app/(store)/about/page.tsx
import { Award, Users, Heart } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Our Story</h1>
        
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">
            Founded in 1995, ChronoPrestige began with a simple vision: to create 
            timepieces that transcend trends and become lifelong companions. Our 
            journey started in a small workshop in Geneva, where master watchmakers 
            dedicated themselves to the art of precision engineering.
          </p>
          
          <p className="text-gray-600 mb-6">
            Today, we continue to honor traditional craftsmanship while embracing 
            modern innovation. Each watch is a testament to our commitment to 
            excellence, with every component meticulously designed and assembled 
            by skilled artisans.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="text-center">
            <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-10 h-10 text-primary-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Swiss Craftsmanship</h3>
            <p className="text-gray-600">Every piece meets Swiss quality standards</p>
          </div>
          
          <div className="text-center">
            <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-primary-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Global Community</h3>
            <p className="text-gray-600">10,000+ collectors worldwide</p>
          </div>
          
          <div className="text-center">
            <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10 text-primary-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Sustainable Luxury</h3>
            <p className="text-gray-600">Ethically sourced materials</p>
          </div>
        </div>
      </div>
    </div>
  )
}
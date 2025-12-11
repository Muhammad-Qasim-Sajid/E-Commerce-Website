// components/store/Testimonials.tsx
import { Star } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: 'Alex Johnson',
    role: 'Watch Collector',
    content: 'The craftsmanship is exceptional. This watch exceeded all my expectations.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Maria Garcia',
    role: 'Luxury Enthusiast',
    content: 'Impeccable service and a timepiece that turns heads. Worth every penny.',
    rating: 5,
  },
  {
    id: 3,
    name: 'David Chen',
    role: 'Business Executive',
    content: 'The perfect balance of elegance and functionality. My daily companion.',
    rating: 4,
  },
]

const Testimonials = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join thousands of satisfied collectors who have found their perfect timepiece.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="card p-6">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < testimonial.rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-700 mb-6">{testimonial.content}</p>
              <div>
                <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                <p className="text-sm text-gray-500">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials
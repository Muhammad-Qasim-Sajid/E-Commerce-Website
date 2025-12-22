"use client";

import { useState, useRef } from "react";
import { useInView } from "framer-motion";
import { Send, MapPin, Phone, Mail, Clock } from "lucide-react";

const AnimatedSection = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div
      ref={ref}
      style={{
        transform: isInView ? "none" : "translateY(20px)",
        opacity: isInView ? 1 : 0,
        transition: "all 0.6s cubic-bezier(0.17, 0.55, 0.55, 1) 0.2s",
      }}
    >
      {children}
    </div>
  );
};

const AnimatedText = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <div
      ref={ref}
      style={{
        transform: isInView ? "none" : "translateY(10px)",
        opacity: isInView ? 1 : 0,
        transition: "all 0.5s ease-out",
      }}
    >
      {children}
    </div>
  );
};

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    alert("Message sent successfully!");
    setFormData({ name: "", email: "", subject: "", message: "" });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#eeeceb] text-[#1a1a1a] pt-20 lg:pt-22">
      <section className="relative h-[50vh] overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative flex flex-col items-center justify-center text-center pt-0 sm:pt-6">
            <p
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tight px-4 font-['Playfair_Display'] italic"
              style={{
                animation: "heroTagline 1.5s cubic-bezier(0.4, 0, 0.2, 1)",
                animationFillMode: "both",
              }}
            >
              - Connect with us -
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Information */}
      <section className="pb-26 pt-14">
        <div className="container mx-auto lg:px-40 sm:px-20 px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Left Column - Contact Form */}
            <div>
              <AnimatedSection>
                <div className="mb-10">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[#d4af37] text-4xl font-light">
                      01
                    </span>
                    <div className="w-12 h-px bg-[#d4af37]" />
                  </div>
                  <p className="text-2xl md:text-3xl font-['Playfair_Display'] italic font-light mb-5">
                    - Send a Message -
                  </p>
                </div>
              </AnimatedSection>

              <AnimatedText>
                <p className="text-gray-500 text-sm mb-8">
                  For inquiries about our collections, bespoke commissions, or
                  to schedule a private viewing, please complete the form
                  below. A dedicated client advisor will respond within 24
                  hours.
                </p>
              </AnimatedText>

              <form onSubmit={handleSubmit} className="space-y-6">
                <AnimatedText>
                  <div>
                    <label className="block text-xs mb-0.5 ml-0.5">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full p-4 py-3 border border-[#1a1a1a]/20 bg-transparent focus:border-[#d4af37] focus:outline-none transition-colors duration-300 text-sm"
                      placeholder="Your full name"
                    />
                  </div>
                </AnimatedText>

                <AnimatedText>
                  <div>
                    <label className="block text-xs mb-0.5 ml-0.5">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full p-4 py-3 border border-[#1a1a1a]/20 bg-transparent focus:border-[#d4af37] focus:outline-none transition-colors duration-300 text-sm"
                      placeholder="your@email.com"
                    />
                  </div>
                </AnimatedText>

                <AnimatedText>
                  <div>
                    <label className="block text-xs mb-0.5 ml-0.5">
                      Subject *
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full p-4 py-3 border border-[#1a1a1a]/20 bg-transparent focus:border-[#d4af37] focus:outline-none transition-colors duration-300 text-sm"
                      placeholder="Inquiry subject"
                    />
                  </div>
                </AnimatedText>

                <AnimatedText>
                  <div>
                    <label className="block text-xs mb-0.5 ml-0.5">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full p-4 py-3 border border-[#1a1a1a]/20 bg-transparent focus:border-[#d4af37] focus:outline-none transition-colors duration-300 resize-none text-sm"
                      placeholder="Your message here..."
                    />
                  </div>
                </AnimatedText>

                <AnimatedText>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group inline-flex items-center gap-3 border border-[#1a1a1a] text-[#1a1a1a] px-8 py-4 hover:border-[#d4af37] hover:text-[#d4af37] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <Send className="w-5 h-5" />
                    <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
                  </button>
                </AnimatedText>
              </form>
            </div>

            {/* Right Column - Contact Information */}
            <div>
              <AnimatedSection>
                <div className="mb-10">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[#d4af37] text-4xl font-light">
                      02
                    </span>
                    <div className="w-12 h-px bg-[#d4af37]" />
                  </div>
                  <p className="text-2xl md:text-3xl font-['Playfair_Display'] italic font-light mb-5">
                    - Visit Our Atelier -
                  </p>
                </div>
              </AnimatedSection>

              <AnimatedText>
                <p className="text-gray-500 text-sm mb-8">
                  Our Swiss atelier welcomes visitors by appointment only.
                  Experience the art of watchmaking firsthand and explore our
                  collections in an intimate setting.
                </p>
              </AnimatedText>

              <div className="space-y-8">
                <AnimatedText>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#d4af37]/10 flex items-center justify-center shrink-0 mt-1">
                      <MapPin className="w-5 h-5 text-[#d4af37]" />
                    </div>
                    <div>
                      <p className="font-light mb-1">Atelier Location</p>
                      <p className="text-gray-500 text-xs">Rue du Rhône 88</p>
                      <p className="text-gray-500 text-xs">
                        1204 Geneva, Switzerland
                      </p>
                    </div>
                  </div>
                </AnimatedText>

                <AnimatedText>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#d4af37]/10 flex items-center justify-center shrink-0 mt-1">
                      <Phone className="w-5 h-5 text-[#d4af37]" />
                    </div>
                    <div>
                      <p className="font-light mb-1">Telephone</p>
                      <p className="text-gray-500 text-xs">+41 22 123 4567</p>
                      <p className="text-gray-500 text-xs">
                        Monday to Friday, 9am-6pm CET
                      </p>
                    </div>
                  </div>
                </AnimatedText>

                <AnimatedText>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#d4af37]/10 flex items-center justify-center shrink-0 mt-1">
                      <Mail className="w-5 h-5 text-[#d4af37]" />
                    </div>
                    <div>
                      <p className="font-light mb-1">Email</p>
                      <p className="text-gray-500 text-xs">
                        contact@greatnesswatches.com
                      </p>
                      <p className="text-gray-500 text-xs">
                        General inquiries
                      </p>
                    </div>
                  </div>
                </AnimatedText>

                <AnimatedText>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#d4af37]/10 flex items-center justify-center shrink-0 mt-1">
                      <Clock className="w-5 h-5 text-[#d4af37]" />
                    </div>
                    <div>
                      <p className="font-light mb-1">Appointment Hours</p>
                      <p className="text-gray-500 text-xs">
                        Monday to Saturday
                      </p>
                      <p className="text-gray-500 text-xs">
                        10:00 AM - 7:00 PM CET
                      </p>
                    </div>
                  </div>
                </AnimatedText>
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        @keyframes heroTagline {
          0% {
            opacity: 0;
            transform: translateY(60px);
          }
          40% {
            opacity: 0;
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
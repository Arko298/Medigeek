

"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Stethoscope,
  Users,
  Briefcase,
  GraduationCap,
  Heart,
  Shield,
  Globe,
  ArrowRight,
  Menu,
  X,
  Star,
  CheckCircle,
} from "lucide-react"

export default function HealthcareLandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const testimonials = [
    {
      name: "Dr. Sarah Chen",
      specialty: "Cardiologist",
      content:
        "MediGeek has revolutionized how I network with colleagues and stay updated with the latest medical research.",
      rating: 5,
      avatar: "/avatar.svg?height=60&width=60",
    },
    {
      name: "Dr. Michael Rodriguez",
      specialty: "Emergency Medicine",
      content: "The job opportunities section helped me find my dream position at a leading trauma center.",
      rating: 5,
      avatar: "/avatar.svg?height=60&width=60",
    },
    {
      name: "Dr. Emily Johnson",
      specialty: "Pediatrics",
      content: "I love the community aspect - connecting with other pediatricians worldwide has enhanced my practice.",
      rating: 5,
      avatar: "/avatar.svg?height=60&width=60",
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [testimonials.length])

  const features = [
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: "Professional Networking",
      description: "Connect with healthcare professionals worldwide and build meaningful professional relationships.",
    },
    {
      icon: <Briefcase className="h-8 w-8 text-green-600" />,
      title: "Career Opportunities",
      description: "Discover exclusive job openings, residency programs, and fellowship opportunities in healthcare.",
    },
    {
      icon: <GraduationCap className="h-8 w-8 text-purple-600" />,
      title: "Continuing Education",
      description: "Access medical conferences, webinars, and continuing education resources to advance your career.",
    },
    {
      icon: <Heart className="h-8 w-8 text-red-600" />,
      title: "Patient Care Excellence",
      description: "Share best practices, case studies, and collaborate on improving patient outcomes.",
    },
    {
      icon: <Shield className="h-8 w-8 text-indigo-600" />,
      title: "Secure & Compliant",
      description: "HIPAA-compliant platform ensuring your professional discussions remain secure and private.",
    },
    {
      icon: <Globe className="h-8 w-8 text-teal-600" />,
      title: "Global Community",
      description: "Join a worldwide community of healthcare professionals sharing knowledge and experiences.",
    },
  ]

  const specialties = [
    "Cardiology",
    "Neurology",
    "Pediatrics",
    "Emergency Medicine",
    "Surgery",
    "Radiology",
    "Psychiatry",
    "Dermatology",
    "Oncology",
    "Orthopedics",
    "Anesthesiology",
    "Pathology",
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Stethoscope className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">MediGeek</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">
                Features
              </Link>
              <Link href="#specialties" className="text-gray-700 hover:text-blue-600 transition-colors">
                Specialties
              </Link>
              <Link href="#testimonials" className="text-gray-700 hover:text-blue-600 transition-colors">
                Testimonials
              </Link>
              <Link href="/auth/login" className="text-gray-700 hover:text-blue-600 transition-colors">
                Sign In
              </Link>
              <Button asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/auth/signup">Get Started</Link>
              </Button>
            </div>

            {/* Mobile menu button */}
            <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link href="#features" className="block px-3 py-2 text-gray-700 hover:text-blue-600">
                Features
              </Link>
              <Link href="#specialties" className="block px-3 py-2 text-gray-700 hover:text-blue-600">
                Specialties
              </Link>
              <Link href="#testimonials" className="block px-3 py-2 text-gray-700 hover:text-blue-600">
                Testimonials
              </Link>
              <Link href="/auth/login" className="block px-3 py-2 text-gray-700 hover:text-blue-600">
                Sign In
              </Link>
              <div className="px-3 py-2">
                <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                  <Link href="/auth/signup">Get Started</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-16 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">For Healthcare Professionals</Badge>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Connect. Learn.
                  <span className="text-blue-600"> Advance.</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Join the premier social network for healthcare professionals. Connect with colleagues, discover career
                  opportunities, and advance your medical practice.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
                  <Link href="/auth/signup">
                    Start Connecting
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="text-lg px-8 py-3">
                  <Link href="#features">Learn More</Link>
                </Button>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>HIPAA Compliant</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Verified Professionals</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Global Network</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10">
                <Image
                  src="/LandingPage_Images/community23.jpg?height=600&width=500"
                  alt="Healthcare professionals collaborating"
                  width={500}
                  height={600}
                  className="rounded-2xl shadow-2xl"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
              <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-indigo-200 rounded-full opacity-20 blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Advance Your Career
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform provides comprehensive tools and resources designed specifically for healthcare professionals
              to network, learn, and grow.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4 p-3 bg-gray-50 rounded-full w-fit">{feature.icon}</div>
                  <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section id="specialties" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Connect Across All Medical Specialties
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join communities of professionals in your specialty and discover opportunities for collaboration and
              growth.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {specialties.map((specialty, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 text-center hover:from-blue-100 hover:to-indigo-100 transition-colors duration-300 cursor-pointer"
              >
                <span className="font-medium text-gray-800">{specialty}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Trusted by Healthcare Professionals Worldwide
            </h2>
            <p className="text-xl text-gray-600">See what medical professionals are saying about MediGeek</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="border-0 shadow-xl">
              <CardContent className="p-8">
                <div className="text-center">
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-xl text-gray-700 mb-6 italic">
                    "{testimonials[currentTestimonial].content}"
                  </blockquote>
                  <div className="flex items-center justify-center space-x-4">
                    <Image
                      src={testimonials[currentTestimonial].avatar || "/avatar.svg"}
                      alt={testimonials[currentTestimonial].name}
                      width={60}
                      height={60}
                      className="rounded-full"
                    />
                    <div>
                      <p className="font-semibold text-gray-900">{testimonials[currentTestimonial].name}</p>
                      <p className="text-gray-600">{testimonials[currentTestimonial].specialty}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentTestimonial ? "bg-blue-600" : "bg-gray-300"
                  }`}
                  onClick={() => setCurrentTestimonial(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Ready to Advance Your Medical Career?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Join thousands of healthcare professionals who are already networking, learning, and growing their careers
            on MediGeek.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-white/10 border-white/20 text-white placeholder:text-blue-200"
            />
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 whitespace-nowrap">
              Get Started Free
            </Button>
          </div>

          <p className="text-blue-200 text-sm mt-4">Free to join • No credit card required • HIPAA compliant</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Stethoscope className="h-8 w-8 text-blue-400" />
                <span className="text-2xl font-bold text-white">MediGeek</span>
              </div>
              <p className="text-gray-400">The premier social network for healthcare professionals worldwide.</p>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Platform</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:text-blue-400 transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-blue-400 transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-blue-400 transition-colors">
                    Security
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-blue-400 transition-colors">
                    API
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:text-blue-400 transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-blue-400 transition-colors">
                    Community
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-blue-400 transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-blue-400 transition-colors">
                    Webinars
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="hover:text-blue-400 transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-blue-400 transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-blue-400 transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-blue-400 transition-colors">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">© 2024 MediGeek. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

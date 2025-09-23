import React from 'react'
import { Link } from 'react-router-dom'
import { MessageSquare, Users, Image as ImageIcon, ShieldCheck } from 'lucide-react'

const LandingPage = () => {
  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-base-200 to-base-100 text-base-content overflow-hidden">
      {/* Hero */}
      <section className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <h1 className="badge badge-ghost text-1xl md:text-5xl font-extrabold">
              Welcome to Blabber
            </h1>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Simple, secure, and delightful conversations
            </h1>
            <p className="text-base-content/70 leading-relaxed">
              Chat in real-time with a clean interface, media sharing, and privacy in mind.
              Keep it focused, friendly, and fast—across all your devices.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link to="/signup" className="btn btn-primary">
                Get Started
              </Link>
              <Link to="/login" className="btn btn-outline">
                Log In
              </Link>
            </div>

            <div className="flex items-center gap-4 pt-2 text-sm text-base-content/60">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Privacy-first
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" /> For teams & friends
              </div>
            </div>
          </div>

          {/* Image stack with subtle 3D/float */}
          <div className="relative h-[420px] lg:h-[480px]">
            <div className="absolute inset-0 -z-10 rounded-3xl bg-base-300/40 blur-3xl" />

            <div className="group relative h-full w-full">
              {/* Card 1 */}
              <figure
                className="absolute left-0 top-2 w-64 sm:w-72 lg:w-80 rounded-2xl overflow-hidden shadow-xl border border-base-300 bg-base-100 transition-transform duration-500 hover:-translate-y-1 hover:shadow-2xl float-slow"
                style={{ transform: 'rotate(-2deg) translateZ(0)' }}
              >
                <img
                  src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=1200&q=60"
                  alt="Team collaborating"
                  className="w-full h-56 object-cover"
                />
                <figcaption className="p-4 text-sm">
                  Collaborate with your team effortlessly
                </figcaption>
              </figure>

              {/* Card 2 */}
              <figure
                className="absolute right-0 top-24 w-60 sm:w-72 lg:w-72 rounded-2xl overflow-hidden shadow-xl border border-base-300 bg-base-100 transition-transform duration-500 hover:-translate-y-1 hover:shadow-2xl float-slower"
                style={{ transform: 'rotate(3deg) translateZ(0)' }}
              >
                <img
                  src="https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=1200&q=60"
                  alt="Devices with chat app"
                  className="w-full h-48 object-cover"
                />
                <figcaption className="p-4 text-sm">
                  Works beautifully across devices
                </figcaption>
              </figure>

              {/* Card 3 */}
              <figure
                className="absolute left-10 bottom-0 w-56 sm:w-64 lg:w-64 rounded-2xl overflow-hidden shadow-xl border border-base-300 bg-base-100 transition-transform duration-500 hover:-translate-y-1 hover:shadow-2xl float-slowest"
                style={{ transform: 'rotate(-1deg) translateZ(0)' }}
              >
                <img
                  src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=60"
                  alt="Messaging in workspace"
                  className="w-full h-40 object-cover"
                />
                <figcaption className="p-4 text-sm">
                  Keep conversations organized
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 mt-16 md:mt-24">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <FeatureCard
            icon={<MessageSquare className="w-5 h-5" />}
            title="Real-time chat"
            desc="Low-latency messaging with read receipts."
          />
          <FeatureCard
            icon={<ImageIcon className="w-5 h-5" />}
            title="Media sharing"
            desc="Share photos with smooth previews."
          />
          <FeatureCard
            icon={<ShieldCheck className="w-5 h-5" />}
            title="Secure by default"
            desc="JWT auth, cookie-based sessions."
          />
          <FeatureCard
            icon={<Users className="w-5 h-5" />}
            title="Group chats"
            desc="Create spaces for your teams and friends."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 mt-16 md:mt-24 mb-20">
        <div className="rounded-2xl border border-base-300 bg-base-100/70 backdrop-blur p-8 md:p-10 text-center shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold">Ready to start a conversation?</h2>
          <p className="mt-2 text-base-content/70">
            Your chats stay clear, calm, and focused—just like they should be.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/signup" className="btn btn-primary">Create account</Link>
            <Link to="/login" className="btn btn-outline">Log in</Link>
          </div>
        </div>
      </section>

      {/* Local styles for subtle float */}
      <style>{`
        .float-slow { animation: float 7s ease-in-out infinite; }
        .float-slower { animation: float 9s ease-in-out infinite; }
        .float-slowest { animation: float 11s ease-in-out infinite; }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(var(--tw-rotate)); }
          50% { transform: translateY(-8px) rotate(var(--tw-rotate)); }
        }
      `}</style>
    </div>
  )
}

const FeatureCard = ({ icon, title, desc }) => (
  <div className="card bg-base-100 border border-base-300 shadow-sm hover:shadow-md transition-shadow">
    <div className="card-body">
      <div className="flex items-center gap-2 text-sm text-base-content/70">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-base-300">{icon}</span>
        <span className="font-semibold">{title}</span>
      </div>
      <p className="mt-3 text-sm text-base-content/70">{desc}</p>
    </div>
  </div>
)

export default LandingPage

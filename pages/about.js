import Layout from "../components/layout/Layout";
import { Shield, Heart, Users, Target } from "lucide-react";

export default function About() {
  const values = [
    {
      icon: Shield,
      title: "Safety First",
      description:
        "Our primary commitment is to provide resources that help sex workers stay safe and informed.",
    },
    {
      icon: Heart,
      title: "Compassionate Support",
      description:
        "We approach every topic with empathy and understanding for the community we serve.",
    },
    {
      icon: Users,
      title: "Community Driven",
      description:
        "Our content is shaped by real experiences and needs of sex workers worldwide.",
    },
    {
      icon: Target,
      title: "Actionable Resources",
      description:
        "We provide practical, immediately useful information that can make a difference.",
    },
  ];

  return (
    <Layout
      meta={{
        title: "About Us - MeetAnEscort",
        description:
          "Learn about our mission to provide safety resources and support for sex workers through education and community.",
      }}
    >
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-pink-500 via-purple-600 to-blue-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display font-bold text-4xl md:text-5xl mb-6">
            Our Mission: Safety & Empowerment
          </h1>
          <p className="text-xl text-pink-100">
            Creating a safer environment for sex workers through education,
            resources, and community support.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Story</h2>
            <p className="text-gray-600 mb-6">
              MeetAnEscort was born from a simple but crucial observation: sex
              workers often lack access to reliable, practical safety
              information tailored to their specific needs. In an industry where
              safety can mean the difference between life and death, this
              information gap is unacceptable.
            </p>
            <p className="text-gray-600 mb-6">
              We started as a small initiative to compile and share safety tips
              within our community. What began as informal guides shared among
              friends has grown into a comprehensive resource platform trusted
              by thousands.
            </p>
            <p className="text-gray-600">
              Today, we committed to expanding our reach and impact, always
              guided by our core principle:
              <strong className="text-pink-600">
                {" "}
                every sex worker deserves to work safely and with dignity.
              </strong>
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-pink-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Commitment */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Our Commitment
          </h2>
          <div className="bg-pink-50 rounded-2xl p-8 border border-pink-100">
            <p className="text-lg text-gray-700 italic mb-4">
              We believe that access to safety information is a fundamental
              right. Our team, which includes former and current sex workers,
              safety experts, and allies, works tirelessly to ensure our
              resources are accurate, relevant, and immediately useful
            </p>
            <p className="text-pink-600 font-semibold">
              — The MeetAnEscort Team
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}

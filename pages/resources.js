import Layout from "../components/layout/Layout";
import { Phone, Globe, Book, Users, Shield, Heart } from "lucide-react";

export default function Resources() {
  const emergencyContacts = [
    {
      name: "National Human Trafficking Hotline",
      phone: "1-888-373-7888",
      description: "24/7 confidential hotline for trafficking situations",
      type: "hotline",
    },
    {
      name: "Crisis Text Line",
      phone: "Text HOME to 741741",
      description: "Free, 24/7 crisis counseling via text",
      type: "text",
    },
    {
      name: "National Domestic Violence Hotline",
      phone: "1-800-799-7233",
      description: "24/7 support for domestic violence situations",
      type: "hotline",
    },
    {
      name: "Trevor Project (LGBTQ)",
      phone: "1-866-488-7386",
      description: "24/7 crisis intervention for LGBTQ youth",
      type: "hotline",
    },
  ];

  const safetyResources = [
    {
      icon: Shield,
      title: "Safety Planning Guide",
      description: "Step-by-step guide to creating your personal safety plan",
      link: "/blog/safety-planning-guide",
    },
    {
      icon: Users,
      title: "Screening Clients",
      description: "Best practices for vetting and screening potential clients",
      link: "/blog/client-screening-best-practices",
    },
    {
      icon: Book,
      title: "Legal Rights Handbook",
      description: "Know your rights and legal protections",
      link: "/blog/legal-rights-handbook",
    },
    {
      icon: Heart,
      title: "Mental Health Support",
      description: "Resources for maintaining mental health and well-being",
      link: "/blog/mental-health-support",
    },
  ];

  const organizations = [
    {
      name: "SWOP (Sex Workers Outreach Project)",
      website: "https://swopusa.org",
      description:
        "National social justice network dedicated to fundamental human rights",
    },
    {
      name: "Red Umbrella Project",
      website: "https://redumbrellaproject.org",
      description: "Amplifying the voices of people who have done sex work",
    },
    {
      name: "Decrim NY",
      website: "https://decrimny.org",
      description: "Coalition working to decriminalize sex work in New York",
    },
  ];

  return (
    <Layout
      meta={{
        title: "Safety Resources - MeetAnEscort",
        description:
          "Emergency contacts, safety guides, and support organizations for sex workers. Immediate help and long-term resources.",
      }}
    >
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-pink-500 via-purple-600 to-blue-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display font-bold text-4xl md:text-5xl mb-6">
            Safety Resources
          </h1>
          <p className="text-xl text-pink-100">
            Immediate help and essential resources for your safety and
            well-being
          </p>
        </div>
      </section>

      {/* Emergency Contacts */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-gray-900 mb-4">
              Emergency Contacts
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Immediate help available 24/7. These services are confidential and
              free.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {emergencyContacts.map((contact, index) => (
              <div
                key={index}
                className="bg-red-50 border border-red-200 rounded-xl p-6"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-red-800 mb-2">
                      {contact.name}
                    </h3>
                    <p className="text-red-700 font-medium text-lg mb-1">
                      {contact.phone}
                    </p>
                    <p className="text-red-600 text-sm">
                      {contact.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
            <p className="text-yellow-800 font-medium">
              If you are in immediate danger, please call your local emergency
              services (911 in the US) first.
            </p>
          </div>
        </div>
      </section>

      {/* Safety Guides */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-gray-900 mb-4">
              Safety Guides & Resources
            </h2>
            <p className="text-xl text-gray-600">
              Practical information to help you stay safe
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {safetyResources.map((resource, index) => {
              const Icon = resource.icon;
              return (
                <a
                  key={index}
                  href={resource.link}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 group border border-gray-100"
                >
                  <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-pink-200 transition-colors duration-200">
                    <Icon className="h-6 w-6 text-pink-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors duration-200">
                    {resource.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {resource.description}
                  </p>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Support Organizations */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-gray-900 mb-4">
              Support Organizations
            </h2>
            <p className="text-xl text-gray-600">
              Trusted organizations advocating for sex workers rights and safety
            </p>
          </div>

          <div className="space-y-6">
            {organizations.map((org, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-6 border border-gray-200"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Globe className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {org.name}
                    </h3>
                    <p className="text-gray-600 mb-3">{org.description}</p>
                    <a
                      href={org.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-600 hover:text-pink-700 font-medium text-sm inline-flex items-center space-x-1"
                    >
                      <span>Visit Website</span>
                      <Globe className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Immediate Help CTA */}
      <section className="py-16 bg-gradient-to-r from-pink-500 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-4">
            Need Immediate Safety Assistance?
          </h2>
          <p className="text-xl text-pink-100 mb-8">
            Our community is here to help. Do not hesitate to reach out.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-pink-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-200">
              Contact Support
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-colors duration-200">
              Safety Planning Guide
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
}

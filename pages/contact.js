import { useState } from "react";
import Layout from "../components/layout/Layout";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    // Here you would integrate with your email service
    // For now, we'll just show a success message
    setTimeout(() => {
      alert("Thank you for your message! We'll get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setSending(false);
    }, 1000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Layout
      meta={{
        title: "Contact Us - MeetAnEscort",
        description:
          "Get in touch with the MeetAnEscort team. We welcome feedback, suggestions, and collaboration opportunities.",
      }}
    >
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-pink-500 via-purple-600 to-blue-600 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display font-bold text-4xl md:text-5xl mb-6">
            Get In Touch
          </h1>
          <p className="text-xl text-pink-100">
            We here to help and always welcome your feedback
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                Contact Information
              </h2>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-600">contact@meetanescort.com</p>
                    <p className="text-sm text-gray-500">
                      We respond within 24 hours
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Support
                    </h3>
                    <p className="text-gray-600">
                      Available for urgent safety matters
                    </p>
                    <p className="text-sm text-gray-500">
                      Mon-Fri, 9AM-6PM EST
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Based In
                    </h3>
                    <p className="text-gray-600">Global Team</p>
                    <p className="text-sm text-gray-500">
                      Serving the international community
                    </p>
                  </div>
                </div>
              </div>

              {/* Emergency Notice */}
              <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2">
                  Emergency Situation?
                </h4>
                <p className="text-red-700 text-sm">
                  If you in immediate danger, please contact local emergency
                  services first For urgent safety support, use our emergency
                  resources page.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-gray-50 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Send us a Message
                </h2>

                <form
                  onSubmit={handleSubmit}
                  className="space-y-6 text-black placeholder:bg-black"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Your Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors duration-200"
                        placeholder="Enter your name"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors duration-200"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors duration-200"
                    >
                      <option value="">Select a subject</option>
                      <option value="safety-resource">
                        Safety Resource Suggestion
                      </option>
                      <option value="partnership">Partnership Inquiry</option>
                      <option value="feedback">Website Feedback</option>
                      <option value="support">Support Request</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors duration-200 resize-none"
                      placeholder="Tell us how we can help..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full bg-pink-600 text-white py-3 px-6 rounded-lg hover:bg-pink-700 focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <Send className="h-4 w-4" />
                    <span>{sending ? "Sending..." : "Send Message"}</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

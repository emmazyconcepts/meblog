import { useState } from "react";
import { db } from "../../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Mail, Check } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // 'idle', 'loading', 'success', 'error'
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setStatus("error");
      setMessage("Please enter your email address");
      return;
    }

    setStatus("loading");

    try {
      await addDoc(collection(db, "subscribers"), {
        email: email.toLowerCase(),
        subscribed: true,
        createdAt: serverTimestamp(),
        source: "website",
      });

      setStatus("success");
      setMessage(
        "Thank you for subscribing! Please check your email to confirm."
      );
      setEmail("");
    } catch (error) {
      setStatus("error");
      if (error.code === "already-exists") {
        setMessage("This email is already subscribed.");
      } else {
        setMessage("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <section className="py-16 bg-gradient-to-r from-purple-600 to-pink-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-2xl mx-auto">
          <Mail className="h-12 w-12 text-white mx-auto mb-4" />
          <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-4">
            Stay Safe & Informed
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Get the latest safety guides, resources, and community updates
            delivered to your inbox.
          </p>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 rounded-lg border border-white focus:ring-2 focus:ring-white focus:border-transparent text-gray-900 placeholder-white"
                  required
                  disabled={status === "loading"}
                />
              </div>
              <button
                type="submit"
                disabled={status === "loading"}
                className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2 min-w-[140px]"
              >
                {status === "loading" ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                    <span>Subscribing...</span>
                  </>
                ) : status === "success" ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Subscribed!</span>
                  </>
                ) : (
                  <span>Subscribe</span>
                )}
              </button>
            </div>

            {message && (
              <p
                className={`mt-3 text-sm ${
                  status === "error" ? "text-red-200" : "text-green-200"
                }`}
              >
                {message}
              </p>
            )}

            <p className="text-purple-200 text-xs mt-4">
              We respect your privacy. Unsubscribe at any time. No spam, ever.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

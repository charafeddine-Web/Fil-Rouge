import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Loader from "../components/Loader";
import Button from "../components/Button";

const Contact = () => {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setFormSubmitted(true);
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
    setTimeout(() => {
      setFormSubmitted(false);
    }, 5000);
  };

  const contactInfo = [
    {
      icon: (
        <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: "Phone",
      info: "+1 (555) 123-4567",
      action: "tel:+15551234567",
    },
    {
      icon: (
        <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: "Email",
      info: "contact@swiftcar.com",
      action: "mailto:contact@swiftcar.com",
    },
    {
      icon: (
        <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: "Location",
      info: "Safi Azibdari 99 dar lk7la",
      action: "https://maps.google.com/?q=San+Francisco,+CA+94103",
    },
    {
      icon: (
        <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: "Hours",
      info: "Monday - Friday: 9AM - 6PM",
      action: null,
    },
  ];

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-green-50 to-blue-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Contact <span className="text-green-600">SwiftCar</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Have questions or feedback? We'd love to hear from you. Our team is always ready to help.
            </p>
          </motion.div>
        </div>

        {/* Wave SVG */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" fill="#ffffff">
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,100L1360,100C1280,100,1120,100,960,100C800,100,640,100,480,100C320,100,160,100,80,100L0,100Z"></path>
          </svg>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:w-2/3 mb-12 lg:mb-0 lg:pr-12"
            >
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Send Us a Message</h2>
              <p className="text-lg text-gray-600 mb-8">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>

              {formSubmitted && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p>Thank you for your message! We'll be in touch soon.</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    placeholder="How can we help you?"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    placeholder="Your message here..."
                  ></textarea>
                </div>
                <div>
                  <Button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white py-3 px-6"
                  >
                    Send Message
                  </Button>
                </div>
              </form>
            </motion.div>
            
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:w-1/3"
            >
              <div className="bg-gray-50 rounded-xl p-8">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">Contact Information</h3>
                <div className="space-y-6">
                  {contactInfo.map((item, index) => (
                    <div key={index} className="flex items-start">
                      <div className="bg-white rounded-full p-3 mr-4 shadow-sm">
                        {item.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">{item.title}</h4>
                        {item.action ? (
                          <a 
                            href={item.action} 
                            className="text-gray-600 hover:text-green-600 transition-colors"
                            target={item.title === "Location" ? "_blank" : ""}
                            rel={item.title === "Location" ? "noopener noreferrer" : ""}
                          >
                            {item.info}
                          </a>
                        ) : (
                          <p className="text-gray-600">{item.info}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Connect With Us</h4>
                  <div className="flex space-x-4">
                    <a href="#" className="bg-white p-3 rounded-full shadow-sm hover:bg-gray-100 transition-colors">
                      <svg className="h-5 w-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                      </svg>
                    </a>
                    <a href="#" className="bg-white p-3 rounded-full shadow-sm hover:bg-gray-100 transition-colors">
                      <svg className="h-5 w-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                    <a href="#" className="bg-white p-3 rounded-full shadow-sm hover:bg-gray-100 transition-colors">
                      <svg className="h-5 w-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M16.98 0a6.9 6.9 0 016.9 6.9v10.2a6.9 6.9 0 01-6.9 6.9H7.02a6.9 6.9 0 01-6.9-6.9V6.9a6.9 6.9 0 016.9-6.9h9.96zm.1 2H7.12a4.82 4.82 0 00-4.8 4.8v10.4a4.82 4.82 0 004.8 4.8h9.96a4.82 4.82 0 004.8-4.8V6.8a4.82 4.82 0 00-4.8-4.8zm-4.97 4.5a5.5 5.5 0 11-.08 11 5.5 5.5 0 01.08-11zm0 2a3.5 3.5 0 100 7 3.5 3.5 0 000-7zm5.69-2.83a1.25 1.25 0 11-.08 2.5 1.25 1.25 0 01.08-2.5z" />
                      </svg>
                    </a>
                    <a href="#" className="bg-white p-3 rounded-full shadow-sm hover:bg-gray-100 transition-colors">
                      <svg className="h-5 w-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
              <p className="text-xl text-gray-600">
                Find quick answers to common questions about our services.
              </p>
            </div>
            
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-3">How do I get started with SwiftCar?</h3>
                <p className="text-gray-600">
                  Simply sign up for an account, verify your identity, and you're ready to start either looking for rides or offering rides, depending on your needs.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Is my personal information safe?</h3>
                <p className="text-gray-600">
                  Yes, we take data privacy very seriously. We use encryption and secure servers to protect your information and never share your personal details without your consent.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-3">How do I report an issue with a ride?</h3>
                <p className="text-gray-600">
                  You can report any issues through the app immediately after your ride, or contact our support team through this form or by emailing support@swiftcar.com.
                </p>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-3">Can I use SwiftCar for business travel?</h3>
                <p className="text-gray-600">
                  Absolutely! We offer business accounts for companies looking to provide sustainable transportation options for their employees. Contact our sales team for more details.
                </p>
              </motion.div>
            </div>
            
            <div className="text-center mt-10">
              <p className="text-gray-600 mb-6">Still have questions? We're here to help!</p>
              <Link to="/how-it-works">
                <Button className="bg-green-100 text-green-700 hover:bg-green-200">
                  View All FAQs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      
    </div>
  );
};

export default Contact; 
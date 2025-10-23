"use client";

import React, { useState } from "react";

export default function InquiryPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    country: "",
    interest: [] as string[],
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null);

  const toggleInterest = (value: string) => {
    setForm((prev) => {
      const exists = prev.interest.includes(value);
      const next = exists
        ? prev.interest.filter((v) => v !== value)
        : [...prev.interest, value];
      return { ...prev, interest: next };
    });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setResult({ ok: true, msg: data.message || "문의가 접수되었습니다." });
        setForm({ name: "", email: "", company: "", country: "", interest: [], message: "" });
      } else {
        setResult({ ok: false, msg: data.message || "제출에 실패했습니다." });
      }
    } catch (err: any) {
      setResult({ ok: false, msg: "네트워크 오류가 발생했습니다." });
    } finally {
      setSubmitting(false);
    }
  };

  const interestOptions = [
    { key: "vision", label: "AI 영상" },
    { key: "web", label: "AI 웹사이트" },
    { key: "marketing", label: "마케팅/SEO" },
    { key: "etc", label: "기타" },
  ];

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8">
            Contact TOTARO
          </h1>
          <p className="text-xl text-center text-gray-600 mb-12">
            Get expert consultation for your B2B export solutions and global business expansion
          </p>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
              <form onSubmit={submit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your full name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="your.email@company.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your company name"
                  />
                </div>

                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your country"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interest Areas
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {interestOptions.map((opt) => (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => toggleInterest(opt.key)}
                        className={`px-3 py-1 rounded-full text-sm border ${
                          form.interest.includes(opt.key)
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-700 border-gray-300 hover:border-blue-500"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tell us about your export needs..."
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {submitting ? "Sending..." : "Send Message"}
                </button>
              </form>

              {result && (
                <div className={`mt-4 text-center px-4 py-3 rounded-md ${
                  result.ok ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                }`}>
                  {result.msg}
                </div>
              )}
            </div>
            
            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>contact@totaro.com</span>
                  </div>
                  
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>+1 (555) 123-4567</span>
                  </div>
                  
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Global Headquarters</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Business Hours</h3>
                <div className="space-y-2 text-gray-600">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Quick Response</h3>
                <p className="text-gray-600 mb-4">
                  We typically respond to inquiries within 24 hours during business days.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Priority Support:</strong> For urgent matters, please call our support line or mention "URGENT" in your message subject.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}



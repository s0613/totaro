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
    
    // Validate interest selection
    if (form.interest.length === 0) {
      setResult({ ok: false, msg: "관심 분야를 최소 1개 이상 선택해주세요." });
      return;
    }
    
    setSubmitting(true);
    setResult(null);
    
    // Debug logging
    console.log("[Inquiry Form] Submitting data:", JSON.stringify(form, null, 2));
    
    try {
      // Clean up form data before sending
      const formData = {
        ...form,
        country: form.country.trim() || undefined, // Convert empty string to undefined
      };
      
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const isEmailSent = data.emailSent !== false; // 기본값을 true로 설정
        setResult({ 
          ok: isEmailSent, 
          msg: data.message || (isEmailSent ? "문의가 접수되었습니다." : "문의가 접수되었지만 이메일 전송에 문제가 있습니다.")
        });
        if (isEmailSent) {
          setForm({ name: "", email: "", company: "", country: "", interest: [], message: "" });
        }
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
    { key: "website", label: "Website" },
    { key: "aeo", label: "AEO/SEO/GEO" },
    { key: "ads", label: "Ads/DM" },
    { key: "crm", label: "CRM" },
  ];

  return (
    <main className="min-h-screen bg-surface pt-24 pb-20 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-textPrimary mb-4">
            지금 시작하세요
          </h1>
          <p className="text-xl text-textSecondary">
            TOTARO 팀이 곧 연락드리겠습니다.
          </p>
        </div>

        {/* Form */}
        <div className="bg-bg rounded-xl p-8 border border-line shadow-lg">
          <form onSubmit={submit} className="space-y-8">
            {/* Name */}
            <div>
              <label className="block text-textPrimary text-sm font-medium mb-2">
                이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full px-4 py-3 bg-surface border border-line rounded-lg text-textPrimary placeholder-textSecondary focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="이름"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-textPrimary text-sm font-medium mb-2">
                이메일 <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full px-4 py-3 bg-surface border border-line rounded-lg text-textPrimary placeholder-textSecondary focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="이메일"
              />
            </div>

            {/* Company */}
            <div>
              <label className="block text-textPrimary text-sm font-medium mb-2">
                회사명 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                required
                className="w-full px-4 py-3 bg-surface border border-line rounded-lg text-textPrimary placeholder-textSecondary focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="회사명"
              />
            </div>

            {/* Country */}
            <div>
              <label className="block text-textPrimary text-sm font-medium mb-2">
                국가
              </label>
              <input
                type="text"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                className="w-full px-4 py-3 bg-surface border border-line rounded-lg text-textPrimary placeholder-textSecondary focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder="국가"
              />
            </div>

            {/* Interest Areas */}
            <div>
              <label className="block text-textPrimary text-sm font-medium mb-4">
                관심 분야 <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-4">
                {interestOptions.map((opt) => (
                  <label key={opt.key} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.interest.includes(opt.key)}
                      onChange={() => toggleInterest(opt.key)}
                      className="w-4 h-4 text-accent bg-surface border-line rounded focus:ring-accent focus:ring-2"
                    />
                    <span className="text-textPrimary text-sm">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-textPrimary text-sm font-medium mb-2">
                메시지 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
                maxLength={2000}
                rows={6}
                className="w-full px-4 py-3 bg-surface border border-line rounded-lg text-textPrimary placeholder-textSecondary focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                placeholder="메시지 (최대 2000자)"
              />
              <div className="text-right text-sm text-textSecondary mt-1">
                {form.message.length}/2000
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full py-4 font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "전송 중..." : "문의 보내기"}
            </button>
          </form>

          {/* Result Message */}
          {result && (
            <div className={`mt-6 text-center px-4 py-3 rounded-lg ${
              result.ok ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}>
              {result.msg}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}



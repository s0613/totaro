"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { trackFormSubmit } from "@/lib/analytics";

const contactSchema = z.object({
  name: z.string().min(2, "이름을 입력해주세요 (최소 2자)"),
  email: z.string().email("올바른 이메일 주소를 입력해주세요"),
  company: z.string().min(2, "회사명을 입력해주세요 (최소 2자)"),
  country: z.string().optional(),
  interest: z.array(z.string()).min(1, "관심 항목을 선택해주세요"),
  message: z.string().min(10, "메시지를 입력해주세요 (최소 10자)"),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface CTAFormProps {
  content: {
    title: string;
    subtitle: string;
    form: {
      name: string;
      email: string;
      company: string;
      country: string;
      interest: string;
      message: string;
      submit: string;
      submitting: string;
    };
    interests: string[];
    success: {
      title: string;
      message: string;
    };
  };
}

export default function CTAForm({ content }: CTAFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setIsSuccess(true);
        reset();

        // Track form submission
        trackFormSubmit("contact_form");
      } else {
        alert("오류가 발생했습니다. 다시 시도해주세요.");
      }
    } catch {
      alert("오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-bg px-8">
        <div className="text-center max-w-2xl">
          <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-success/20 flex items-center justify-center">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              className="text-success"
            >
              <path
                d="M20 6L9 17L4 12"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 className="text-4xl font-bold text-textPrimary mb-4">
            {content.success.title}
          </h2>
          <p className="text-xl text-textSecondary">{content.success.message}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="min-h-screen flex items-center justify-center bg-bg py-24 px-8">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-textPrimary mb-4">
            {content.title}
          </h2>
          <p className="text-lg text-textSecondary">{content.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-textPrimary mb-2"
            >
              {content.form.name} <span className="text-accent">*</span>
            </label>
            <input
              id="name"
              type="text"
              {...register("name")}
              className="w-full px-5 py-4 bg-surface border border-line rounded-lg text-textPrimary placeholder:text-textSecondary/40 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
              placeholder={content.form.name}
            />
            {errors.name && (
              <p className="text-warning text-sm mt-2">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-textPrimary mb-2"
            >
              {content.form.email} <span className="text-accent">*</span>
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className="w-full px-5 py-4 bg-surface border border-line rounded-lg text-textPrimary placeholder:text-textSecondary/40 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
              placeholder={content.form.email}
            />
            {errors.email && (
              <p className="text-warning text-sm mt-2">{errors.email.message}</p>
            )}
          </div>

          {/* Company */}
          <div>
            <label
              htmlFor="company"
              className="block text-sm font-semibold text-textPrimary mb-2"
            >
              {content.form.company} <span className="text-accent">*</span>
            </label>
            <input
              id="company"
              type="text"
              {...register("company")}
              className="w-full px-5 py-4 bg-surface border border-line rounded-lg text-textPrimary placeholder:text-textSecondary/40 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
              placeholder={content.form.company}
            />
            {errors.company && (
              <p className="text-warning text-sm mt-2">{errors.company.message}</p>
            )}
          </div>

          {/* Country */}
          <div>
            <label
              htmlFor="country"
              className="block text-sm font-semibold text-textPrimary mb-2"
            >
              {content.form.country}
            </label>
            <input
              id="country"
              type="text"
              {...register("country")}
              className="w-full px-5 py-4 bg-surface border border-line rounded-lg text-textPrimary placeholder:text-textSecondary/40 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all"
              placeholder={content.form.country}
            />
          </div>

          {/* Interest */}
          <div>
            <fieldset>
              <legend className="block text-sm font-semibold text-textPrimary mb-3">
                {content.form.interest} <span className="text-accent">*</span>
              </legend>
              <div className="grid grid-cols-2 gap-3">
                {content.interests.map((item) => (
                  <label
                    key={item}
                    className="flex items-center gap-3 px-4 py-3 bg-surface border border-line rounded-lg cursor-pointer hover:border-accent/40 transition-all"
                  >
                    <input
                      type="checkbox"
                      value={item}
                      {...register("interest")}
                      className="w-5 h-5 text-accent bg-bg border-line rounded focus:ring-accent focus:ring-2"
                    />
                    <span className="text-textPrimary">{item}</span>
                  </label>
                ))}
              </div>
              {errors.interest && (
                <p className="text-warning text-sm mt-2">{errors.interest.message}</p>
              )}
            </fieldset>
          </div>

          {/* Message */}
          <div>
            <label
              htmlFor="message"
              className="block text-sm font-semibold text-textPrimary mb-2"
            >
              {content.form.message} <span className="text-accent">*</span>
            </label>
            <textarea
              id="message"
              rows={6}
              {...register("message")}
              className="w-full px-5 py-4 bg-surface border border-line rounded-lg text-textPrimary placeholder:text-textSecondary/40 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all resize-none"
              placeholder={content.form.message}
            />
            {errors.message && (
              <p className="text-warning text-sm mt-2">{errors.message.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-accent text-bg font-bold text-lg py-5 rounded-lg hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-soft hover:shadow-lg"
          >
            {isSubmitting ? content.form.submitting : content.form.submit}
          </button>
        </form>
      </div>
    </section>
  );
}

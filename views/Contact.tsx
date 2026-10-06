'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
} from 'lucide-react';
import toast from 'react-hot-toast';
import SEO from '../components/common/SEO';
import { useMergedSeo } from '../context/PageSeoContext';
import PageHero from '../components/common/PageHero';
import CTASection from '../components/common/CTASection';
import api from '../services/api';
import { useSettings } from '../context/SettingsContext';

const REQUIRED_ORDER = ['name', 'email', 'message'];

function validateContact(form) {
  const errors: any = {};
  if (!form.name.trim()) errors.name = 'Please enter your name.';
  if (!form.email.trim()) errors.email = 'Please enter your email address.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    errors.email = 'Please enter a valid email address.';
  if (!form.message.trim()) errors.message = 'Please enter a message.';
  return errors;
}

function FieldError({ id, children }: any) {
  return (
    <p id={id} role="alert" className="mt-1.5 flex items-start gap-1.5 text-xs font-medium text-accent-600">
      <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      {children}
    </p>
  );
}

export default function Contact() {
  const { settings } = useSettings();
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const fieldRefs = useRef<any>({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => (prev[name] ? { ...prev, [name]: '' } : prev));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextErrors = validateContact(form);
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      const firstInvalid = REQUIRED_ORDER.find((n) => nextErrors[n]);
      fieldRefs.current[firstInvalid]?.focus();
      toast.error('Please correct the highlighted fields.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/contact', form);
      setSubmitted(true);
      toast.success('Your message has been sent.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    { icon: MapPin, label: 'Address', value: settings.address || 'Kathmandu, Nepal' },
    { icon: Phone, label: 'Phone', value: settings.phone || '+977-1-4XXXXXX', href: `tel:${settings.phone || '+97714XXXXXX'}` },
    { icon: Mail, label: 'Email', value: settings.email || 'info@eduvia.com.np', href: `mailto:${settings.email || 'info@eduvia.com.np'}` },
    { icon: Clock, label: 'Office Hours', value: 'Sun - Fri: 9:00 AM - 5:00 PM' },
  ];

  const seo = useMergedSeo('contact', {
    title: 'Contact Us - Get in Touch with Eduvia Consultancy',
    description: 'Contact Eduvia Consultancy for free study abroad counseling. Visit our office in Kathmandu, call us, or fill out the contact form. We are here to help.',
    keywords: 'contact Eduvia, study abroad counseling, education consultancy contact, Kathmandu office',
  });

  return (
    <>
      <SEO {...seo} />

      {/* Hero */}
      <PageHero
        title="Contact Us"
        subtitle="Have questions? We are here to help. Reach out to us for free study abroad counseling."
      />

      {/* Contact Info & Form */}
      <section className="py-16 md:py-20 lg:py-24 bg-dark-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-display font-bold tracking-tight text-dark-900 mb-6">Get in Touch</h2>
              <div className="space-y-6 mb-8">
                {contactInfo.map((info, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ delay: i * 0.06, duration: 0.45 }}
                    className="flex items-start gap-4"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 shrink-0">
                      <info.icon className="h-5 w-5 text-primary-500" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs text-dark-500 mb-0.5">{info.label}</p>
                      {info.href ? (
                        <a href={info.href} className="text-sm font-medium text-dark-700 hover:text-primary-500 transition-colors">{info.value}</a>
                      ) : (
                        <p className="text-sm font-medium text-dark-700">{info.value}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Directions */}
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  settings.address || 'Kathmandu, Nepal'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group mb-6 flex flex-col items-center justify-center gap-2.5 rounded-2xl border border-dark-200/70 bg-dark-100 px-6 py-8 text-center transition-all duration-200 hover:border-primary-300 hover:bg-primary-50"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-xs">
                  <MapPin className="h-5 w-5 text-primary-500" aria-hidden="true" />
                </span>
                <span className="text-sm font-medium leading-relaxed text-dark-600">
                  {settings.address || 'Kathmandu, Nepal'}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-500">
                  Get directions
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </a>

              {/* Social Links */}
              <div>
                <h3 className="text-sm font-semibold text-dark-700 mb-3">Follow Us</h3>
                <div className="flex gap-3">
                  {[
                    { icon: Facebook, href: settings.facebook, label: 'Facebook', color: 'bg-dark-100 text-dark-600 hover:bg-primary-50 hover:text-primary-600' },
                    { icon: Instagram, href: settings.instagram, label: 'Instagram', color: 'bg-dark-100 text-dark-600 hover:bg-primary-50 hover:text-primary-600' },
                    { icon: Twitter, href: settings.twitter, label: 'Twitter', color: 'bg-dark-100 text-dark-600 hover:bg-primary-50 hover:text-primary-600' },
                    { icon: Linkedin, href: settings.linkedin, label: 'LinkedIn', color: 'bg-dark-100 text-dark-600 hover:bg-primary-50 hover:text-primary-600' },
                    { icon: Youtube, href: settings.youtube, label: 'YouTube', color: 'bg-dark-100 text-dark-600 hover:bg-primary-50 hover:text-primary-600' },
                  ].filter((s) => s.href).map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Eduvia on ${social.label}`}
                      className={`inline-flex h-11 w-11 items-center justify-center rounded-xl transition-colors ${social.color}`}
                    >
                      <social.icon className="h-4 w-4" aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </div>

              {/* WhatsApp / Viber */}
              <div className="mt-6 flex gap-3">
                {settings.phone2 && (
                  <a href={`https://wa.me/${settings.phone2.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 bg-green-700 text-white text-sm font-semibold transition-colors hover:bg-green-800">
                    <MessageCircle className="w-4 h-4" aria-hidden="true" /> WhatsApp
                  </a>
                )}
                <a href={`viber://chat?number=${(settings.phone || '').replace(/[^0-9]/g, '')}`} className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 bg-dark-100 text-dark-600 text-sm font-semibold transition-colors hover:bg-primary-50 hover:text-primary-600">
                  <Phone className="w-4 h-4" aria-hidden="true" /> Viber
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-dark-200/70 bg-white p-6 md:p-8 shadow-soft">
                <h2 className="text-2xl font-display font-bold tracking-tight text-dark-900 mb-6">Send Us a Message</h2>
                {submitted ? (
                  <div className="flex flex-col items-center py-12 text-center">
                    <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" aria-hidden="true" />
                    <h3 className="text-xl font-display font-semibold text-dark-900 mb-2">Message Sent!</h3>
                    <p className="text-sm text-dark-500">Thank you for reaching out. We will get back to you within 24 hours.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="contact-name" className="label">Full Name <span className="text-accent-500" aria-hidden="true">*</span></label>
                        <input
                          ref={((el) => (fieldRefs.current.name = el)) as any}
                          id="contact-name"
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Your full name"
                          autoComplete="name"
                          aria-invalid={!!errors.name || undefined}
                          aria-describedby={errors.name ? 'contact-name-error' : undefined}
                          aria-required="true"
                          className={`input-field ${errors.name ? 'input-error' : ''}`}
                        />
                        {errors.name && <FieldError id="contact-name-error">{errors.name}</FieldError>}
                      </div>
                      <div>
                        <label htmlFor="contact-email" className="label">Email <span className="text-accent-500" aria-hidden="true">*</span></label>
                        <input
                          ref={((el) => (fieldRefs.current.email = el)) as any}
                          id="contact-email"
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="your@email.com"
                          autoComplete="email"
                          aria-invalid={!!errors.email || undefined}
                          aria-describedby={errors.email ? 'contact-email-error' : undefined}
                          aria-required="true"
                          className={`input-field ${errors.email ? 'input-error' : ''}`}
                        />
                        {errors.email && <FieldError id="contact-email-error">{errors.email}</FieldError>}
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="contact-phone" className="label">Phone</label>
                        <input id="contact-phone" type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="+977-98XXXXXXXX" className="input-field" />
                      </div>
                      <div>
                        <label htmlFor="contact-subject" className="label">Subject</label>
                        <input id="contact-subject" type="text" name="subject" value={form.subject} onChange={handleChange} placeholder="How can we help?" className="input-field" />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="contact-message" className="label">Message <span className="text-accent-500" aria-hidden="true">*</span></label>
                      <textarea
                        ref={((el) => (fieldRefs.current.message = el)) as any}
                        id="contact-message"
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        rows={5}
                        placeholder="Write your message here..."
                        aria-invalid={!!errors.message || undefined}
                        aria-describedby={errors.message ? 'contact-message-error' : undefined}
                        aria-required="true"
                        className={`input-field ${errors.message ? 'input-error' : ''}`}
                      />
                      {errors.message && <FieldError id="contact-message-error">{errors.message}</FieldError>}
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold whitespace-nowrap transition-all duration-200 active:scale-[0.98] bg-accent-500 text-white shadow-xs hover:bg-accent-600 hover:shadow-accent disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" aria-hidden="true" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </>
  );
}

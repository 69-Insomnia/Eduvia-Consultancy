'use client';

import { useState, useRef } from 'react';
import { Send, Loader2, CheckCircle2, ChevronDown, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../services/api';

const DESTINATIONS = [
  'Australia', 'Canada', 'United Kingdom', 'United States', 'New Zealand',
  'Germany', 'Japan', 'Ireland', 'Netherlands', 'France', 'Other',
];

const EDUCATION_LEVELS = [
  'High School / +2', 'Diploma', 'Bachelor\'s Degree', 'Master\'s Degree',
  'PhD', 'Other',
];

const INTAKES = [
  'Spring (Feb/Mar)', 'Summer (May/Jun)', 'Fall (Aug/Sep)', 'Winter (Nov/Dec)',
  'As Soon As Possible',
];

const ENGLISH_TESTS = [
  'IELTS', 'TOEFL', 'PTE', 'Duolingo', 'Not Yet Taken', 'Other',
];

const initialForm = {
  fullName: '',
  phone: '',
  email: '',
  preferredCountry: '',
  highestEducation: '',
  interestedCourse: '',
  preferredIntake: '',
  englishTest: '',
  message: '',
};

const FIELD_ORDER = ['fullName', 'phone', 'email', 'preferredCountry', 'highestEducation',
  'interestedCourse', 'preferredIntake', 'englishTest', 'message'];

const BASE_INPUT =
  'w-full rounded-xl border bg-white text-sm text-dark-900 placeholder:text-dark-400 shadow-xs transition-all duration-200 focus:outline-none focus:ring-4';
const OK_INPUT =
  `${BASE_INPUT} border-dark-200 hover:border-dark-300 focus:border-primary-500 focus:ring-primary-500/10`;
const BAD_INPUT =
  `${BASE_INPUT} border-accent-400 focus:border-accent-500 focus:ring-accent-500/10`;

function validateField(name, value, form) {
  const v = (value ?? '').trim();
  switch (name) {
    case 'fullName':
      if (!v) return 'Please enter your full name.';
      if (v.length < 2) return 'Name must be at least 2 characters.';
      return '';
    case 'phone': {
      if (!v) return 'Please enter your phone number.';
      const digits = v.replace(/\D/g, '');
      if (digits.length < 7) return 'Please enter a valid phone number.';
      return '';
    }
    case 'email':
      if (!v) return 'Please enter your email address.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Please enter a valid email address.';
      return '';
    default:
      return '';
  }
}

function Field({ label, name, required, error, children }: any) {
  const errorId = `${name}-error`;
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-xs font-medium text-dark-600">
        {label}
        {required && (
          <span className="ml-0.5 text-accent-500" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {error && (
        <p
          id={errorId}
          role="alert"
          className="mt-1.5 flex items-start gap-1.5 text-xs font-medium text-accent-600"
        >
          <AlertCircle className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}

function Select({ name, value, onChange, onBlur, placeholder, options, invalid }: any) {
  return (
    <div className="relative">
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        aria-invalid={invalid || undefined}
        aria-describedby={invalid ? `${name}-error` : undefined}
        className={`${invalid ? BAD_INPUT : OK_INPUT} cursor-pointer appearance-none py-2.5 pl-3.5 pr-10`}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-400"
        aria-hidden="true"
      />
    </div>
  );
}

export default function CounselingForm({ onSuccess, compact = false, minimal = false }: any) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fieldRefs = useRef({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear a resolved error as soon as the user fixes it.
    setErrors((prev) => (prev[name] ? { ...prev, [name]: validateField(name, value, form) } : prev));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value, form) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nextErrors = {};
    FIELD_ORDER.forEach((name) => {
      const msg = validateField(name, form[name], form);
      if (msg) nextErrors[name] = msg;
    });

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      const firstInvalid = FIELD_ORDER.find((n) => nextErrors[n]);
      fieldRefs.current[firstInvalid]?.focus();
      toast.error('Please correct the highlighted fields.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/inquiries', { ...form, type: 'counseling' });
      setSubmitted(true);
      toast.success('Your counseling request has been submitted!');
      onSuccess?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center py-10 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
          <CheckCircle2 className="h-9 w-9 text-green-600" aria-hidden="true" />
        </div>
        <h3 className="mb-2 font-display text-xl font-semibold text-dark-900">
          Request Submitted
        </h3>
        <p className="max-w-sm text-sm leading-relaxed text-dark-500">
          Thank you for your interest. One of our counselors will contact you within 24 hours.
        </p>
      </div>
    );
  }

  const columns = compact ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2';
  const reg = (name) => ({ ref: (el) => (fieldRefs.current[name] = el) });

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className={`grid gap-4 ${columns}`}>
        <Field label="Full Name" name="fullName" required error={errors.fullName}>
          <input
            {...reg('fullName')}
            id="fullName"
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Your full name"
            autoComplete="name"
            aria-required="true"
            aria-invalid={!!errors.fullName || undefined}
            aria-describedby={errors.fullName ? 'fullName-error' : undefined}
            className={`${errors.fullName ? BAD_INPUT : OK_INPUT} px-3.5 py-2.5`}
          />
        </Field>
        <Field label="Phone" name="phone" required error={errors.phone}>
          <input
            {...reg('phone')}
            id="phone"
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="+977-98XXXXXXXX"
            autoComplete="tel"
            aria-required="true"
            aria-invalid={!!errors.phone || undefined}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
            className={`${errors.phone ? BAD_INPUT : OK_INPUT} px-3.5 py-2.5`}
          />
        </Field>
      </div>

      <Field label="Email" name="email" required error={errors.email}>
        <input
          {...reg('email')}
          id="email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="your@email.com"
            autoComplete="email"
            aria-required="true"
            aria-invalid={!!errors.email || undefined}
          aria-describedby={errors.email ? 'email-error' : undefined}
          className={`${errors.email ? BAD_INPUT : OK_INPUT} px-3.5 py-2.5`}
        />
      </Field>

      {minimal ? (
        /* Hero variant: capture the lead with the least possible friction.
           The full questionnaire lives on /contact. */
        <Field label="Preferred Country" name="preferredCountry">
          <Select
            name="preferredCountry"
            value={form.preferredCountry}
            onChange={handleChange}
            placeholder="Select country"
            options={DESTINATIONS}
          />
        </Field>
      ) : (
        <>
          <div className={`grid gap-4 ${columns}`}>
            <Field label="Preferred Country" name="preferredCountry">
              <Select
                name="preferredCountry"
                value={form.preferredCountry}
                onChange={handleChange}
                placeholder="Select country"
                options={DESTINATIONS}
              />
            </Field>
            <Field label="Highest Education" name="highestEducation">
              <Select
                name="highestEducation"
                value={form.highestEducation}
                onChange={handleChange}
                placeholder="Select level"
                options={EDUCATION_LEVELS}
              />
            </Field>
          </div>

          <Field label="Interested Course" name="interestedCourse">
            <input
              {...reg('interestedCourse')}
              id="interestedCourse"
              type="text"
              name="interestedCourse"
              value={form.interestedCourse}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="e.g. MBA, Computer Science"
              className={`${OK_INPUT} px-3.5 py-2.5`}
            />
          </Field>

          <div className={`grid gap-4 ${columns}`}>
            <Field label="Preferred Intake" name="preferredIntake">
              <Select
                name="preferredIntake"
                value={form.preferredIntake}
                onChange={handleChange}
                placeholder="Select intake"
                options={INTAKES}
              />
            </Field>
            <Field label="English Test" name="englishTest">
              <Select
                name="englishTest"
                value={form.englishTest}
                onChange={handleChange}
                placeholder="Select test"
                options={ENGLISH_TESTS}
              />
            </Field>
          </div>

          <Field label="Message" name="message">
            <textarea
              {...reg('message')}
              id="message"
              name="message"
              value={form.message}
              onChange={handleChange}
              onBlur={handleBlur}
              rows={3}
              placeholder="Any additional information..."
              className={`${OK_INPUT} resize-none px-3.5 py-2.5`}
            />
          </Field>
        </>
      )}

      <button
        type="submit"
        disabled={loading}
        className="shine flex w-full items-center justify-center gap-2 rounded-xl bg-accent-500 px-6 py-3 text-sm font-semibold text-white shadow-xs transition-all duration-200 hover:bg-accent-600 hover:shadow-accent active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Submitting...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" aria-hidden="true" />
            Submit Request
          </>
        )}
      </button>
    </form>
  );
}

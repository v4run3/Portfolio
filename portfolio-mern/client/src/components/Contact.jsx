import { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaPaperPlane, FaCheck, FaTriangleExclamation } from 'react-icons/fa6';
import { apiUrl } from '../config';

const SectionLabel = ({ children, num }) => (
  <div className="flex items-center gap-4 mb-12">
    <span className="text-accent text-sm tracking-wider">{num}</span>
    <h2 className="text-2xl md:text-3xl font-mono text-white">{children}</h2>
    <div className="flex-1 h-px bg-border" />
  </div>
);

const Field = ({ label, children, hint }) => (
  <label className="block">
    <div className="flex items-baseline gap-2 mb-2 text-[12px]">
      <span className="text-accent">{`>`}</span>
      <span className="text-white/80">{label}</span>
      {hint && <span className="text-white/30">{hint}</span>}
    </div>
    {children}
  </label>
);

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ kind: 'idle', text: '' });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ kind: 'sending', text: 'POST /api/messages ...' });
    try {
      await axios.post(`${apiUrl}/api/messages`, formData);
      setStatus({ kind: 'ok', text: '200 OK — message delivered' });
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus({
        kind: 'err',
        text: err?.response?.status
          ? `${err.response.status} — ${err.response.data?.message ?? 'failed'}`
          : 'network error — message not sent',
      });
    }
  };

  return (
    <section id="contact" className="relative px-6 md:px-12 py-24 border-t border-border">
      <div className="max-w-5xl mx-auto">
        <SectionLabel num="04 //">init.conversation</SectionLabel>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.45 }}
            className="lg:col-span-2 space-y-6"
          >
            <p className="text-white/70 text-base leading-relaxed">
              Open for collaborations, freelance contracts, or technical
              architecture consulting.
            </p>
            <div className="font-mono text-[13px] space-y-2">
              <div className="flex gap-3">
                <span className="text-white/30 w-24 shrink-0">location</span>
                <span className="text-white/80">Mumbai, IN · UTC+5:30</span>
              </div>
              <div className="flex gap-3">
                <span className="text-white/30 w-24 shrink-0">response</span>
                <span className="text-white/80">within 24h</span>
              </div>
              <div className="flex gap-3">
                <span className="text-white/30 w-24 shrink-0">status</span>
                <span className="text-accent inline-flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent pulse-dot" />
                  available
                </span>
              </div>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.45, delay: 0.08 }}
            onSubmit={handleSubmit}
            className="lg:col-span-3 card p-6 space-y-5"
          >
            <Field label="name" hint="// required">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="your name"
                className="w-full bg-bg border border-border px-3 py-2.5 text-[14px] text-white placeholder:text-white/25 focus:border-accent transition-colors"
              />
            </Field>

            <Field label="email" hint="// required">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@domain.com"
                className="w-full bg-bg border border-border px-3 py-2.5 text-[14px] text-white placeholder:text-white/25 focus:border-accent transition-colors"
              />
            </Field>

            <Field label="message" hint="// markdown ok">
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                placeholder="how can i help?"
                className="w-full bg-bg border border-border px-3 py-2.5 text-[14px] text-white placeholder:text-white/25 focus:border-accent transition-colors resize-none"
              />
            </Field>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
              <div className="text-[12px] min-h-[18px] flex items-center gap-2">
                {status.kind === 'idle' && (
                  <span className="text-white/30">waiting for input…</span>
                )}
                {status.kind === 'sending' && (
                  <span className="text-white/60">{status.text}</span>
                )}
                {status.kind === 'ok' && (
                  <span className="text-accent inline-flex items-center gap-1.5">
                    <FaCheck size={10} /> {status.text}
                  </span>
                )}
                {status.kind === 'err' && (
                  <span className="text-red-400 inline-flex items-center gap-1.5">
                    <FaTriangleExclamation size={10} /> {status.text}
                  </span>
                )}
              </div>
              <button
                type="submit"
                disabled={status.kind === 'sending'}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-[13px] tracking-wider border border-accent text-accent hover:bg-accent hover:text-bg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaPaperPlane size={11} />
                {status.kind === 'sending' ? 'sending...' : 'execute_send()'}
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default Contact;

'use client'
import { useState } from 'react'

export default function FAQs() {
  const [formData, setFormData] = useState({
    reason: '',
    preferredContact: '',
    contactInfo: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id === 'reason' ? 'reason' :
        id === 'preferred-contact' ? 'preferredContact' :
        id === 'contact-info' ? 'contactInfo' :
        id === 'subject' ? 'subject' : 'message']: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to send message');

      setFormData({
        reason: '',
        preferredContact: '',
        contactInfo: '',
        subject: '',
        message: ''
      });
      setSuccess(true);
    //   setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fieldStyle =
  "w-full p-2 rounded-md bg-[#140101] text-[#f8e4b6] border border-[#b8634c]/40 " +
  "placeholder:text-[#f8e4b6] focus:outline-none focus:ring-1 focus:ring-[#b8634c] " +
  "focus:bg-[#140101] focus:text-[#f8e4b6] active:bg-[#140101] active:text-[#f8e4b6]";


  return (
    <section className="scroll-py-16 py-24 md:py-32 bg-gradient-to-b from-[#2b0508] via-[#200305] to-[#180000] text-[#f8e4b6] font-serif">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-y-12 lg:grid-cols-2 lg:gap-x-16">
          {/* Contact Info */}
          <div className="flex flex-col justify-center text-[#e0d4c1] space-y-10">
            <div>
              <h3 className="text-xl font-semibold text-[#f8e4b6]">Email</h3>
              <p className="mt-2 text-sm">info@novationapp.com</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#f8e4b6]">Phone</h3>
              <p className="mt-2 text-sm">+1 (469) 666-4789</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#f8e4b6]">LinkedIn</h3>
              <a
                href="https://www.linkedin.com/company/novationai"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 block text-sm underline underline-offset-4 hover:text-[#ffd7a1]"
              >
                linkedin.com/company/novation
              </a>
            </div>
          </div>

          {/* Form */}
          <div className="relative bg-white/5 backdrop-blur-md border border-[#b93a52]/20 shadow-[0_0_60px_rgba(185,58,82,0.12)] rounded-3xl p-8">
            <h2 className="text-3xl mb-6 text-[#f6d8a8] font-semibold">Contact Us</h2>

            {success && (
              <div className="bg-[#140101] border border-[#b8634c]/30 text-[#f8e4b6] p-4 rounded-md mb-4 shadow-[0_0_30px_rgba(185,58,82,0.12)]">
  <h3 className="text-md font-semibold mb-1 text-[#f6d8a8]">Message Sent!</h3>
  <p className="text-sm font-light text-[#e0d4c1]">Thank you for contacting us. We’ll get back to you shortly.</p>
</div>

            )}

            {error && (
              <div className="bg-red-100/10 border border-red-400/20 text-red-400 p-4 rounded-md mb-4 text-sm">
                <h3 className="font-medium">Error</h3>
                <p>{error}</p>
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Reason */}
              <div>
                <label htmlFor="reason" className="block text-sm mb-1">Reason for Contact</label>
                <select
                  id="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  required
                  className={fieldStyle}
                >
                  <option value="">Select a reason</option>
                  <option value="support">Support</option>
                  <option value="partnership">Partnership</option>
                  <option value="purchase_interest">Purchase Interest</option>
                  <option value="betatesting_interest">Beta Testing Interest</option>
                  <option value="feedback">Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Preferred Contact */}
              <div>
                <label htmlFor="preferred-contact" className="block text-sm mb-1">Preferred Contact Method</label>
                <select
                  id="preferred-contact"
                  value={formData.preferredContact}
                  onChange={handleChange}
                  required
                  className={fieldStyle}
                >
                  <option value="">Select a method</option>
                  <option value="email">Email</option>
                  <option value="phone">Phone</option>
                </select>
              </div>

              {/* Contact Info */}
              <div>
                <label htmlFor="contact-info" className="block text-sm mb-1">Contact Information</label>
                <input
                  type="text"
                  id="contact-info"
                  value={formData.contactInfo}
                  onChange={handleChange}
                  placeholder="Enter your email or phone number"
                  required
                  className={fieldStyle}
                />
              </div>

              {/* Subject */}
              <div>
                <label htmlFor="subject" className="block text-sm mb-1">Subject</label>
                <input
                  type="text"
                  id="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Enter the subject"
                  required
                  className={fieldStyle}
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="message" className="block text-sm mb-1">Message</label>
                <textarea
                  id="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Enter your message"
                  required
                  className={fieldStyle}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 rounded-md bg-[#2b0d0d] hover:bg-[#3d1212] text-[#f8e4b6] border border-[#b8634c]/30 font-medium transition-all duration-300 cursor-pointer disabled:opacity-60"
              >
                {loading ? 'Sending...' : 'Send'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

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
        setLoading(true);
        setError('');
        
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    reason: formData.reason,
                    preferredContact: formData.preferredContact,
                    contactInfo: formData.contactInfo,
                    subject: formData.subject,
                    message: formData.message
                }),
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Failed to send message');
            }
            
            // Reset form and show success message
            setFormData({
                reason: '',
                preferredContact: '',
                contactInfo: '',
                subject: '',
                message: ''
            });
            setSuccess(true);
            
            // Hide success message after 5 seconds
            setTimeout(() => setSuccess(false), 5000);
            
        } catch (err: any) {
            setError(err.message || 'Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="scroll-py-16 py-16 md:scroll-py-32 md:py-32">
            <div className="mx-auto max-w-5xl px-6">
                <div className="grid gap-y-12 px-2 lg:grid-cols-2">
                    {/* Contact Methods */}
                    <div className="divide-y divide-dashed flex flex-col justify-center">
                        <div className="pb-6">
                            <h3 className="font-medium">Email</h3>
                            <p className="text-muted-foreground mt-4">info@novationapp.com</p>
                        </div>
                        <div className="py-6">
                            <h3 className="font-medium">Phone</h3>
                            <p className="text-muted-foreground mt-4">+1 (123) 456-7890</p>
                        </div>
                        <div className="py-6">
                            <h3 className="font-medium">LinkedIn</h3>
                            <p className="text-muted-foreground mt-4">
                                <a
                                    href="https://linkedin.com/company/novation"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="underline underline-offset-4 hover:text-primary"
                                >
                                    linkedin.com/company/novation
                                </a>
                            </p>
                        </div>
                    </div>

                    {/* Help Form */}
                    <div className="bg-white/60 dark:bg-accent/40 p-6 rounded-lg shadow-md">
                        <h2 className="mb-4 text-3xl font-semibold">Message support</h2>
                        
                        {success && (
                            <div className="bg-green-50 border border-green-200 text-green-600 p-4 rounded-md mb-4">
                                <h3 className="font-medium">Message Sent!</h3>
                                <p className="text-sm">Thank you for contacting us. We'll get back to you shortly.</p>
                            </div>
                        )}
                        
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md mb-4">
                                <h3 className="font-medium">Error</h3>
                                <p className="text-sm">{error}</p>
                            </div>
                        )}
                        
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="reason" className="block text-sm font-medium mb-1">Reason for Contact</label>
                                <select
                                    id="reason"
                                    value={formData.reason}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-input bg-background text-foreground p-2 placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                    required
                                >
                                    <option value="">Select a reason</option>
                                    <option value="support">Support</option>
                                    <option value="partnership">Partnership</option>
                                    <option value="feedback">Feedback</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="preferred-contact" className="block text-sm font-medium mb-1">Preferred Method of Contact</label>
                                <select
                                    id="preferred-contact"
                                    value={formData.preferredContact}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-input bg-background text-foreground p-2 placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                    required
                                >
                                    <option value="">Select a method</option>
                                    <option value="email">Email</option>
                                    <option value="phone">Phone</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="contact-info" className="block text-sm font-medium mb-1">Contact Information</label>
                                <input
                                    type="text"
                                    id="contact-info"
                                    value={formData.contactInfo}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-input bg-background text-foreground p-2 placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                    placeholder="Enter your email or phone number"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium mb-1">Subject</label>
                                <input
                                    type="text"
                                    id="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border border-input bg-background text-foreground p-2 placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                    placeholder="Enter the subject"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="body" className="block text-sm font-medium mb-1">Message</label>
                                <textarea
                                    id="body"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={5}
                                    className="mt-1 block w-full rounded-md border border-input bg-background text-foreground p-2 placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                                    placeholder="Enter your message"
                                    required
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded-md bg-primary text-primary-foreground py-2 px-4 font-medium hover:bg-primary/90 transition-colors disabled:opacity-70"
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

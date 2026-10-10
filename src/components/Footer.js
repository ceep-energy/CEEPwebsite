import React, { useState } from 'react';
import { FaLinkedin, FaYoutube, FaInstagram } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        email: '',
        message: ''
    });
    const [status, setStatus] = useState(''); // 'sending', 'success', 'error'

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('sending');

        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 15000);

        try {
            const body = new URLSearchParams({
                'form-name': 'contact',
                name: formData.name,
                mobile: formData.mobile,
                email: formData.email,
                message: formData.message,
                'bot-field': ''
            });

            const response = await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: body.toString(),
                signal: controller.signal
            });

            if (!response.ok) {
                throw new Error(`Form submission failed with status ${response.status}`);
            }

            setStatus('success');
            setFormData({ name: '', mobile: '', email: '', message: '' });
            setTimeout(() => setStatus(''), 6000);
        } catch (error) {
            console.error('Inquiry submit error:', error);
            setStatus('error');
        } finally {
            clearTimeout(timer);
        }
    };

    return (
        <footer id="contact" className="footer">
            <div className="footer-container">
                <div className="footer-content">
                    <div className="footer-section footer-section-left">
                        <h3>Quick Inquiry</h3>
                        <form
                            name="contact"
                            method="POST"
                            data-netlify="true"
                            netlify-honeypot="bot-field"
                            className="footer-form-minimal"
                            onSubmit={handleSubmit}
                        >
                            {/* Netlify hidden inputs for static detection and JS POST */}
                            <input type="hidden" name="form-name" value="contact" />
                            <input type="hidden" name="bot-field" aria-hidden="true" />
                            <input
                                type="text"
                                name="name"
                                placeholder="Name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                            />
                            <div className="footer-form-row">
                                <input
                                    type="tel"
                                    name="mobile"
                                    placeholder="Mobile Number"
                                    value={formData.mobile}
                                    onChange={handleInputChange}
                                    required
                                />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email Address"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <textarea
                                name="message"
                                placeholder="Inquiry Message"
                                value={formData.message}
                                onChange={handleInputChange}
                                rows={3}
                                required
                            />
                            <button
                                type="submit"
                                className="footer-form-submit-minimal"
                                disabled={status === 'sending'}
                            >
                                {status === 'sending' ? 'Sending...' : 'Send Request'}
                            </button>
                            {status === 'success' && <p className="form-status success">Sent successfully! We will contact you soon.</p>}
                            {status === 'error' && <p className="form-status error">We could not send your request. Please try again, or email admin@ceepenergy.in or call 9444882553.</p>}
                        </form>
                    </div>

                    <div className="footer-section footer-section-right">
                        <h4>Contact Information</h4>
                        <p>1039, 26th St, H Block,</p>
                        <p>Ponni Colony, Anna Nagar, Chennai 600040</p>
                        <p>Mobile: 9444882553, 8668115663</p>
                        <p>Email: <a href="mailto:admin@ceepenergy.in" className="footer-email-link">admin@ceepenergy.in</a></p>
                        <div className="footer-social" aria-label="Social media links">
                            <a href="https://www.linkedin.com/company/ceep-audit/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                                <FaLinkedin />
                            </a>
                            <a href="https://youtube.com/@tallkumar?si=idFMBzDiMdbmlPYB" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                                <FaYoutube />
                            </a>
                            <a href="https://www.instagram.com/ceep.consultancy" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                                <FaInstagram />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} by CEEP Creative team: Vasudev Kishor, Thilagan Iniyavan, Sanyam Bhardwaj. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
import React, { useState } from 'react';
import { FaLinkedin, FaYoutube, FaInstagram } from 'react-icons/fa';
import './Footer.css';

const resolveApiBaseUrl = () => {
    if (process.env.REACT_APP_API_BASE_URL) {
        return process.env.REACT_APP_API_BASE_URL;
    }

    if (typeof window !== 'undefined') {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return 'http://localhost:4000';
        }

        return window.location.origin;
    }

    return 'http://localhost:4000';
};

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
        const apiBaseUrl = resolveApiBaseUrl();

        try {
            const response = await fetch(`${apiBaseUrl}/api/inquiries`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to submit inquiry');
            }

            setStatus('success');
            setFormData({ name: '', mobile: '', email: '', message: '' });
            setTimeout(() => setStatus(''), 6000);
        } catch (error) {
            console.error('Inquiry submit error:', error);
            try {
                const newInquiry = {
                    id: Date.now().toString(),
                    ...formData,
                    createdAt: new Date().toISOString(),
                    source: 'local-fallback'
                };
                const existing = JSON.parse(localStorage.getItem('ceep-inquiries') || '[]');
                localStorage.setItem('ceep-inquiries', JSON.stringify([...existing, newInquiry]));
                setStatus('saved-local');
                setFormData({ name: '', mobile: '', email: '', message: '' });
                setTimeout(() => setStatus(''), 6000);
            } catch (storageError) {
                console.error('Inquiry local fallback failed:', storageError);
                setStatus('error');
            }
        }
    };

    return (
        <footer id="contact" className="footer">
            <div className="footer-container">
                <div className="footer-content">
                    <div className="footer-section footer-section-left">
                        <h3>Quick Inquiry</h3>
                        <form
                            className="footer-form-minimal"
                            onSubmit={handleSubmit}
                        >
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
                            {status === 'saved-local' && <p className="form-status success">Server is unavailable now. Inquiry saved locally in this browser and we will follow up once synced.</p>}
                            {status === 'error' && <p className="form-status error">Something went wrong. Please try again.</p>}
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
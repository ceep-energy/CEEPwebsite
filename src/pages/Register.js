import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import './Register.css';

const Register = () => {
    const [searchParams] = useSearchParams();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        organization: '',
        inquiry: ''
    });
    const [status, setStatus] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const requestedFile = searchParams.get('file') || '';
    const requestedName = searchParams.get('name') || 'selected document';

    const downloadUrl = useMemo(() => {
        if (!requestedFile) return '';
        return `${process.env.PUBLIC_URL}/pdfs/${requestedFile}`;
    }, [requestedFile]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!requestedFile) {
            setStatus('error');
            return;
        }

        setStatus('sending');
        
        // Submit to Netlify forms
        const postToNetlify = async (data) => {
            try {
                const body = new URLSearchParams();
                body.append('form-name', 'registration');
                body.append('name', data.name || '');
                body.append('email', data.email || '');
                body.append('mobile', data.mobile || '');
                body.append('organization', data.organization || '');
                body.append('inquiry', data.inquiry || '');
                body.append('requestedFile', requestedFile || '');
                body.append('requestedName', requestedName || '');
                body.append('bot-field', '');

                const response = await fetch('/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: body.toString()
                });

                return response.ok;
            } catch (nfErr) {
                console.warn('Netlify form POST failed:', nfErr);
                return false;
            }
        };

        try {
            const netlifySuccess = await postToNetlify(formData);
            
            // Also save locally as redundancy
            try {
                const localItem = {
                    id: Date.now().toString(),
                    ...formData,
                    requestedFile,
                    requestedName,
                    createdAt: new Date().toISOString(),
                    source: netlifySuccess ? 'netlify' : 'local-fallback'
                };
                const existing = JSON.parse(localStorage.getItem('ceep-registrations') || '[]');
                localStorage.setItem('ceep-registrations', JSON.stringify([...existing, localItem]));
            } catch (storageError) {
                console.error('Local storage save failed:', storageError);
            }

            setStatus('success');
            window.location.assign(downloadUrl);
        } catch (error) {
            console.error('Registration error:', error);
            setErrorMessage('Could not complete registration. Please try again.');
            setStatus('error');
        }
    };

    return (
        <div className="register-page">
            <div className="register-card">
                <h1>Register to Download</h1>
                <p className="register-subtitle">
                    You are requesting: <strong>{requestedName}</strong>
                </p>

                {!requestedFile && (
                    <p className="register-error">No document selected. Please return to Services and choose a PDF.</p>
                )}

                <form 
                    name="registration"
                    method="POST"
                    data-netlify="true"
                    netlify-honeypot="bot-field"
                    onSubmit={handleSubmit} 
                    className="register-form"
                >
                    {/* Netlify hidden inputs for static detection and JS POST */}
                    <input type="hidden" name="form-name" value="registration" />
                    <input type="hidden" name="bot-field" aria-hidden="true" />
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Full Name"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email Address"
                        required
                    />
                    <input
                        type="tel"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        placeholder="Mobile Number"
                        required
                    />
                    <input
                        type="text"
                        name="organization"
                        value={formData.organization}
                        onChange={handleChange}
                        placeholder="Organization"
                        required
                    />
                    <textarea
                        name="inquiry"
                        value={formData.inquiry}
                        onChange={handleChange}
                        placeholder="Detailed Inquiry (optional)"
                        rows={4}
                    />

                    <button type="submit" disabled={status === 'sending' || !requestedFile}>
                        {status === 'sending' ? 'Submitting...' : 'Register & Download'}
                    </button>
                </form>

                {status === 'success' && (
                    <p className="register-success">Registration saved. Your download has started.</p>
                )}
                {status === 'saved-local' && (
                    <p className="register-success">Server is unavailable, so your registration was saved locally in this browser and the download has started.</p>
                )}
                {status === 'error' && (
                    <p className="register-error">Could not complete registration. {errorMessage ? errorMessage : 'Please try again.'}</p>
                )}

                <Link to="/services" className="register-back-link">Back to Services</Link>
            </div>
        </div>
    );
};

export default Register;

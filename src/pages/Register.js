import React, { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import './Register.css';

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
    const apiBaseUrl = resolveApiBaseUrl();

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
        try {
            const response = await fetch(`${apiBaseUrl}/api/registrations`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    requestedFile,
                    requestedName
                })
            });

            let body = null;
            try { body = await response.json(); } catch (e) { /* ignore */ }

            if (!response.ok) {
                const msg = (body && body.message) || `status ${response.status}`;
                console.error('Registration failed:', msg, body);
                setErrorMessage(String(msg));
                setStatus('error');
                return;
            }

            setStatus('success');
            window.location.assign(downloadUrl);
        } catch (error) {
            console.error('Registration error:', error);
            try {
                const localItem = {
                    id: Date.now().toString(),
                    ...formData,
                    requestedFile,
                    requestedName,
                    createdAt: new Date().toISOString(),
                    source: 'local-fallback'
                };
                const existing = JSON.parse(localStorage.getItem('ceep-registrations') || '[]');
                localStorage.setItem('ceep-registrations', JSON.stringify([...existing, localItem]));

                setStatus('saved-local');
                window.location.assign(downloadUrl);
            } catch (storageError) {
                console.error('Local fallback failed:', storageError);
                setErrorMessage(storageError.message || String(storageError));
                setStatus('error');
            }
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

                <form onSubmit={handleSubmit} className="register-form">
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

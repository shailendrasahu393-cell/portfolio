import { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import './ContactForm.css';

export default function ContactForm() {
    const formRef = useRef();
    const [status, setStatus] = useState('idle'); // idle, sending, success, error
    const [errors, setErrors] = useState({});

    // User placeholders
    const SERVICE_ID = 'service_4hjzfsv';
    const TEMPLATE_ID = 'template_ticr5lx';
    const PUBLIC_KEY = '6t9JS3jrJ23PDoEGo';

    const validateForm = (formData) => {
        const newErrors = {};
        if (!formData.get('name').trim()) newErrors.name = 'SYS_ERR: Name required';
        if (!formData.get('email').trim()) {
            newErrors.email = 'SYS_ERR: Email required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.get('email'))) {
            newErrors.email = 'SYS_ERR: Invalid format';
        }
        if (!formData.get('message').trim()) newErrors.message = 'SYS_ERR: Message required';

        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(formRef.current);
        const validationErrors = validateForm(formData);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setErrors({});
        setStatus('sending');

        // EmailJS Configuration
        emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY)
            .then((result) => {
                console.log(result.text);
                setStatus('success');
                formRef.current.reset();
                setTimeout(() => setStatus('idle'), 5000); // Reset after 5 seconds
            }, (error) => {
                console.error(error.text);
                setStatus('error');
                setTimeout(() => setStatus('idle'), 5000);
            });
    };

    return (
        <div className="terminal-form-container">
            <div className="terminal-header">
                <span className="terminal-dot red"></span>
                <span className="terminal-dot yellow"></span>
                <span className="terminal-dot green"></span>
                <span className="terminal-title">comm_link.exe</span>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="terminal-form">
                <div className="terminal-prompt">
                    <span className="cursor-block"></span> INITIATE SYSTEM TRANSMISSION...
                </div>

                <div className="form-group">
                    <label htmlFor="name">[ SYS_NAME ]</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        className={`terminal-input ${errors.name ? 'input-error' : ''}`}
                        autoComplete="off"
                    />
                    {errors.name && <span className="error-text">{errors.name}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="email">[ SYS_EMAIL ]</label>
                    <input
                        type="email"
                        name="email"
                        id="email"
                        className={`terminal-input ${errors.email ? 'input-error' : ''}`}
                        autoComplete="off"
                    />
                    {errors.email && <span className="error-text">{errors.email}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="subject">[ SYS_SUBJECT ] <span className="optional-tag">OPTIONAL</span></label>
                    <input
                        type="text"
                        name="subject"
                        id="subject"
                        className="terminal-input"
                        autoComplete="off"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="message">[ SYS_MESSAGE ]</label>
                    <textarea
                        name="message"
                        id="message"
                        rows="5"
                        className={`terminal-input ${errors.message ? 'input-error' : ''}`}
                    ></textarea>
                    {errors.message && <span className="error-text">{errors.message}</span>}
                </div>

                <div className="form-actions">
                    <button
                        type="submit"
                        className="terminal-submit"
                        disabled={status === 'sending'}
                    >
                        {status === 'idle' && '> TRANSMIT_DATA_'}
                        {status === 'sending' && '> TRANSMITTING...'}
                        {status === 'success' && '> TRANSMISSION_SUCCESS'}
                        {status === 'error' && '> TRANSMISSION_FAILED'}
                    </button>

                    {status === 'success' && (
                        <div className="status-message success-message">
                            [OK] Message received securely. Connection terminated.
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="status-message error-message">
                            [ERR] Connection refused. Verify credentials.
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
}

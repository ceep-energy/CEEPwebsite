import React, { useState, useEffect } from 'react';
import { FaLinkedin } from 'react-icons/fa';
// Team data is stored in the frontend now
import './Company.css';

const Company = () => {
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Add two team members directly in the frontend
    useEffect(() => {
        const members = [
            {
                _id: 'team-1',
                name: 'J. Nagesh Kumar',
                position: 'Founder & Director',
                bio: 'A Mechanical Engineer with a postgraduate specialization in Energy Management, bringing over three decades of experience in the fields of energy auditing, conservation, and performance optimization across industrial sectors. As an Accredited Energy Auditor certified by the Bureau of Energy Efficiency (BEE), he has led and executed more than 100 detailed energy audits, delivering measurable improvements in energy efficiency and operational performance. He is also a Lead Auditor for ISO 50001 Energy Management Systems (EnMS), with extensive expertise in implementing structured energy management frameworks aligned with national and international standards. In addition to his consulting work, he is an accomplished professional trainer, actively contributing to capacity building and knowledge development in energy efficiency and compliance under programs such as CEEP and related initiatives.',
                image: '/images/team/nagesh.jpg',
                email: 'nageshkumar@ceepenergy.in',
                linkedin: 'https://www.linkedin.com/in/j-nagesh-kumar-b6a05755/'
            },
            {
                _id: 'team-2',
                name: 'Sakthi Aadharsh Azhagar',
                position: 'Energy Analyst',
                bio: 'A Chemical Engineer specializing in process engineering and industrial energy optimization, with a focused and evolving expertise in energy audits, utility systems, and ISO 50001 Energy Management Systems (EnMS). Positioned at an intermediate level of professional experience, he combines a strong academic foundation with practical exposure to industrial energy assessment and performance improvement initiatives. In addition to field-level audit activities, he brings a growing proficiency in computational techniques relevant to energy analysis. This includes the use of process simulation tools, data-driven modeling, and analytical methods to assess system performance, estimate savings potential, and support decision-making. His ability to integrate process engineering principles with computational analysis enables a balanced approach to identifying practical and technically sound energy efficiency measures.',
                image: '/images/team/sakthi.jpeg',
                email: 'sakthiaadharshazhagar@ceepenergy.in',
                linkedin: 'https://www.linkedin.com/in/sakthiaadharshazhagar/'
            }
        ];
        setTeamMembers(members);
        setLoading(false);
    }, []);

    useEffect(() => {
        if (typeof IntersectionObserver === 'undefined') return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('revealed');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
        );

        const elements = document.querySelectorAll('[data-scroll-reveal]');
        elements.forEach((el) => observer.observe(el));

        // Heading animations
        const headingObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const delay = entry.target.getAttribute('data-delay') || '0';
                        const delayMs = parseFloat(delay) * 100;
                        setTimeout(() => {
                            entry.target.classList.add('heading-animated');
                        }, delayMs);
                        headingObserver.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.2, rootMargin: '0px 0px -80px 0px' }
        );

        const headings = document.querySelectorAll('[data-heading-animate]');
        headings.forEach((heading) => headingObserver.observe(heading));

        return () => {
            elements.forEach((el) => observer.unobserve(el));
            headings.forEach((heading) => headingObserver.unobserve(heading));
        };
    }, [teamMembers]);

    if (loading) {
        return (
            <div className="company-page section">
                <div className="container">
                    <div className="loading">Loading company information...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="company-page section">
            <div className="container">
                <section className="philosophy-minimal" data-scroll-reveal>
                    <div className="philosophy-split">
                        <div className="philosophy-portrait">
                            <div className="artistic-portrait-frame">
                                <img src="/images/gandhi.png" alt="M.K. Gandhi" />
                                <div className="portrait-overlay-accent"></div>
                            </div>
                        </div>
                        <div className="philosophy-text">
                            <span className="philosophy-tag">Our Philosophy</span>
                            <blockquote className="philosophy-quote-raw">
                                "The world has enough for everyone's need, but not enough for everyone's greed."
                            </blockquote>
                            <cite className="philosophy-author-raw">- M.K. Gandhi</cite>
                        </div>
                    </div>
                </section>

                <section className="who-we-are-block" data-scroll-reveal>
                    <div className="who-we-are-layout">
                        <div className="who-we-are-content">
                            <span className="who-we-are-tag" data-heading-animate>Who We Are</span>
                            <p className="who-we-are-text" data-heading-animate data-delay="1">
                                We are engineers and problem-solvers dedicated to uncovering inefficiencies that directly impact industrial performance.
                            </p>
                            <p className="who-we-are-text" data-heading-animate data-delay="2">
                                At CEEP, we help organizations reduce energy consumption, optimize resource utilization, and improve productivity through structured audits and actionable insights. Our work is rooted in real-world plant experience-focusing not just on identifying issues, but delivering solutions that create measurable financial impact.
                            </p>
                            <p className="who-we-are-text" data-heading-animate data-delay="3">
                                Beyond audits, we work closely with on-ground teams-equipping employees with the knowledge and practical skills required to sustain improvements. By building internal capability alongside technical solutions, we ensure that the impact of our work is not short-lived, but embedded into everyday operations.
                            </p>
                            <p className="who-we-are-text" data-heading-animate data-delay="4">
                                We partner with industries to turn operational challenges into opportunities for efficiency and long-term growth.
                            </p>
                        </div>
                        <div className="who-we-are-images" data-heading-animate data-delay="2">
                            <img src="/images/manufacturing.jpg" alt="Industrial operations team" loading="lazy" />
                        </div>
                    </div>
                </section>

                <h1 className="section-title" data-heading-animate>Our Team</h1>
                <p className="section-subtitle" data-heading-animate data-delay="1">
                    Meet the experts who drive our mission to improve energy, environment, and productivity
                </p>

                <div className="team-grid">
                    {teamMembers.length > 0 ? (
                        teamMembers.slice(0, 2).map((member, index) => (
                            <div key={member._id} className="team-card" data-scroll-reveal style={{ transitionDelay: `${index * 0.2}s` }}>
                                <div className="team-card-inner">
                                    <div
                                        className="team-image"
                                        style={{
                                            backgroundImage: member.image ? `url(${member.image})` : 'none',
                                            backgroundSize: '100% 100%',
                                            backgroundPosition: 'center'
                                        }}
                                    >
                                        {member.image ? (
                                            <img src={member.image} alt={member.name} loading="lazy" />
                                        ) : (
                                            <div className="team-placeholder">
                                                <span>{member.name.charAt(0)}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="team-info">
                                        <h3 className="team-name">{member.name}</h3>
                                        <p className="team-position">{member.position}</p>
                                        <div className="team-expanded-content">
                                            {member.bio && (
                                                <p className="team-bio">{member.bio}</p>
                                            )}
                                            <div className="team-contact-row">
                                                {member.email && (
                                                    <a href={`mailto:${member.email}`} className="team-email">
                                                        {member.email}
                                                    </a>
                                                )}
                                                {member.linkedin && (
                                                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="team-linkedin-stylized" aria-label={`${member.name} LinkedIn`}>
                                                        <FaLinkedin />
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-data">
                            <p>No team members found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Company;

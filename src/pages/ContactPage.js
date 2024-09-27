import React from 'react';
import './ContactPage.css';  // Link to your CSS file

const ContactPage = () => {
  return (
    <div className="contact-page-container">
      <h1>Contact the SMART Soils Testbed Team</h1>

      <div className="contact-form">
        <iframe
          className="airtable-embed"
          src="https://airtable.com/embed/appZVaqaJ5gaza0Gv/pag7e81z7XuAumsk1/form"   // Replace with actual Airtable link
          frameBorder="0"
          width="100%"
          height="600"
          style={{ background: 'transparent', border: '1px solid #ccc' }}
          title="SMART Soils Contact Form"
        />
      </div>
      
      <div className="additional-contact-info">
        <p>Prefer to email us? Reach out at <a href="mailto:eesawebmaster@lbl.gov">eesawebmaster@lbl.gov</a>.</p>
      </div>
    </div>
  );
};

export default ContactPage;

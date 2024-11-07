import React, { useState, useEffect } from 'react';
import './ETPage.css'; // Ensure that the CSS file is linked
import AnalyticalSection from './ETPageAnalyticalSection';
import HybridSection from './ETPageHybridSection';
import TransferSection from './ETPageTransferSection';

function SciencePage() {

    const [isHybridVisible, setIsHybridVisible] = useState(false);
    const [isTransferVisible, setIsTransferVisible] = useState(false);

    // Function to check if sections are in view
    const handleScroll = () => {
        const screenPosition = window.innerHeight / 0.75;
        const hybridSection = document.querySelector('.hybrid');
        const hybridPosition = hybridSection.getBoundingClientRect().top;
        if (hybridPosition < screenPosition) {
            setIsHybridVisible(true);
        }
        const transferSection = document.querySelector('.transfer');
        const transferPosition = transferSection.getBoundingClientRect().top;
        if (transferPosition < screenPosition) {
            setIsTransferVisible(true);
        }
    };

    // Add event listener for scroll event
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
        window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className="et-page">
            <section className="statement-section">
                <h1 className="statement-title">Evapotranspiration</h1>
                <h3 className="statement-title">A use case of the ModEx approach</h3>
                <label className="statement-text">
                        Model-Observation-Experiment (ModEx) Paradiagm: 
                        Observations from SMARTSoils Testbed reveal ET model discrepancy and faciliate model reparametrization,
                        improving ET prediction accuracy when applied to field experiements.
                </label>
            </section>
            <div>
                <AnalyticalSection />
            </div>
            <div className={`hybrid ${isHybridVisible ? 'hybrid-visible' : 'hybrid-hidden'}`}>
                <HybridSection />
            </div>
            <div className={`transfer ${isTransferVisible ? 'transfer-visible' : 'transfer-hidden'}`}>
                <TransferSection />
            </div>
        </div>
    );
};

export default SciencePage;
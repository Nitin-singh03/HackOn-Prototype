import React, { useState } from 'react';
import '../Css/ReturnPackage.css';

export default function ReturnPackage() {
  const [isReturning, setIsReturning] = useState(false);
  const [returned, setReturned] = useState(false);

  const handleReturn = () => {
    if (isReturning || returned) return;
    setIsReturning(true);
    // Simulate API call / processing delay
    setTimeout(() => {
      setIsReturning(false);
      setReturned(true);
      alert('Package return initiated! You’ve earned 50 Gecko Points.');
      // TODO: call backend to credit points
    }, 2000);
  };

  const steps = [
    'Empty contents completely',
    'Fold along perforated lines',
    'Seal with adhesive strip',
    'Attach pre-paid return label',
    'Drop off at courier'
  ];

  return (
    <div className="return-container">
      <h1>Return Your Package</h1>

      <div className="box-instructions">
        <img
          src="https://www.shutterstock.com/image-photo/wetzlar-germany-20220425-amazon-prime-600nw-2287833361.jpg"
          alt="Foldable Return Box"
          className="box-image"
        />

        <div className="steps">
          {steps.map((text, idx) => (
            <div key={idx} className="step-item">
              <div className="step-number">{idx + 1}</div>
              <div className="step-text">{text}</div>
            </div>
          ))}
        </div>
      </div>

      <button
        className="return-btn"
        onClick={handleReturn}
        disabled={isReturning || returned}
      >
        {isReturning ? 'Processing…' : returned ? 'Returned' : 'Return & Earn 50 pts'}
      </button>

      {returned && (
        <p className="thank-you">
          Thank you! 50 Gecko Points have been added to your account.
        </p>
      )}
    </div>
  );
}
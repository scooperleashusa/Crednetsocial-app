import React, { useState, useEffect } from 'react';
import { 
  CAESAR_BUILDER_STEPS, 
  CAESAR_TEMPLATES,
  CAESAR_MOTTO,
  generateCaesarProfile,
  CAESAR_EXAMPLES 
} from '../lib/caesarBuilder';

const CaesarBuilder = ({ onComplete, onCancel, aiChat }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [builderData, setBuilderData] = useState({
    field: '',
    expertise: '',
    values: [],
    goals: '',
    style: '',
    interests: [],
    audience: ''
  });
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showTemplates, setShowTemplates] = useState(true);
  const [responses, setResponses] = useState([]);

  const currentStepData = CAESAR_BUILDER_STEPS[currentStep];
  const templateKeys = Object.keys(CAESAR_TEMPLATES);
  const selectedTemplateData = selectedTemplate ? CAESAR_TEMPLATES[selectedTemplate] : null;

  const handleTemplateSelect = (templateKey) => {
    setSelectedTemplate(templateKey);
    setShowTemplates(false);
  };

  const handleResponse = (response) => {
    const key = currentStepData.key;
    const updatedData = { ...builderData };

    // Parse response based on step
    if (key === 'values' || key === 'interests') {
      updatedData[key] = response.split(',').map(v => v.trim()).filter(v => v);
    } else {
      updatedData[key] = response;
    }

    setBuilderData(updatedData);
    setResponses([...responses, { step: currentStepData.id, response }]);

    // Move to next step or generate profile
    if (currentStep < CAESAR_BUILDER_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      generateProfile(updatedData);
    }
  };

  const generateProfile = (data) => {
    const profile = generateCaesarProfile(data, selectedTemplateData);
    setPreview(profile);
  };

  const handleSkipStep = () => {
    if (currentStep < CAESAR_BUILDER_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      generateProfile(builderData);
    }
  };

  const handleEditStep = (stepIndex) => {
    setCurrentStep(stepIndex);
  };

  const handleCompleteBuilder = () => {
    if (preview && onComplete) {
      onComplete(preview);
    }
  };

  // Template Selection Screen
  if (showTemplates) {
    return (
      <div className="caesar-builder">
        <div className="builder-header">
          <h2>👑 Build Your Caesar</h2>
          <p className="builder-motto">{CAESAR_MOTTO}</p>
          <p className="builder-subtitle">Your unique digital identity on CredNet Social</p>
        </div>

        <div className="builder-content">
          <div className="template-intro">
            <p>Start with a profile template that matches your style, then customize it with CredAI's help.</p>
          </div>

          <div className="templates-grid">
            {templateKeys.map(key => {
              const template = CAESAR_TEMPLATES[key];
              return (
                <div
                  key={key}
                  className="template-card"
                  onClick={() => handleTemplateSelect(key)}
                >
                  <div className="template-icon">{template.icon}</div>
                  <h3>{template.name}</h3>
                  <p>{template.description}</p>
                  <button className="btn-select">Select</button>
                </div>
              );
            })}
          </div>

          <div className="builder-divider">
            <span>or</span>
          </div>

          <div className="builder-quick">
            <h3>Quick Create</h3>
            <p>Build your profile from scratch with CredAI guidance</p>
            <button 
              className="btn-quick-create"
              onClick={() => {
                setSelectedTemplate(null);
                setShowTemplates(false);
              }}
            >
              Start Guided Tour
            </button>
          </div>

          <div className="builder-examples">
            <h4>Example Caesars</h4>
            <div className="examples-list">
              {CAESAR_EXAMPLES.map((example, idx) => (
                <div key={idx} className="example-card">
                  <span className="example-avatar">{example.avatar}</span>
                  <div className="example-info">
                    <p className="example-name">{example.name}</p>
                    <p className="example-tagline">{example.tagline}</p>
                    <div className="example-stats">
                      <span>⭐ {example.reputation}</span>
                      <span>🪙 {example.tokens}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button className="btn-cancel" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // Preview Screen
  if (preview) {
    return (
      <div className="caesar-builder">
        <div className="builder-header">
          <h2>👑 Your Caesar is Ready!</h2>
          <p className="builder-motto">{CAESAR_MOTTO}</p>
          <p className="builder-subtitle">Review and activate your profile</p>
        </div>

        <div className="builder-content">
          <div className="profile-preview">
            <div className="preview-avatar" style={{ backgroundColor: preview.avatar }}>
              {builderData.field ? builderData.field.charAt(0).toUpperCase() : '👑'}
            </div>

            <div className="preview-header">
              <h3 className="preview-tagline">{preview.tagline}</h3>
              <p className="preview-bio">{preview.bio}</p>
            </div>

            <div className="preview-sections">
              <div className="preview-section">
                <h4>Profile Details</h4>
                <div className="detail-item">
                  <span className="label">Field:</span>
                  <span className="value">{builderData.field}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Expertise:</span>
                  <span className="value">{builderData.expertise}</span>
                </div>
                {builderData.values.length > 0 && (
                  <div className="detail-item">
                    <span className="label">Values:</span>
                    <span className="value">{builderData.values.join(', ')}</span>
                  </div>
                )}
                <div className="detail-item">
                  <span className="label">Goals:</span>
                  <span className="value">{builderData.goals}</span>
                </div>
              </div>

              <div className="preview-section">
                <h4>Topics & Signals</h4>
                <div className="signals-list">
                  {preview.signals.map((signal, idx) => (
                    <span key={idx} className="signal-tag">
                      #{signal}
                    </span>
                  ))}
                </div>
              </div>

              <div className="preview-section">
                <h4>Starting Stats</h4>
                <div className="stats-grid">
                  <div className="stat">
                    <span className="stat-value">{preview.reputation}</span>
                    <span className="stat-label">Reputation</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{preview.tokens}</span>
                    <span className="stat-label">Starting Tokens</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{preview.credibilityScore}</span>
                    <span className="stat-label">Credibility %</span>
                  </div>
                </div>
              </div>

              <div className="preview-section">
                <h4>Your Journey</h4>
                <div className="journey-steps">
                  {CAESAR_BUILDER_STEPS.map((step, idx) => {
                    const hasResponse = responses.some(r => r.step === step.id);
                    return (
                      <div key={idx} className={`journey-step ${hasResponse ? 'completed' : ''}`}>
                        <span className="step-num">{idx + 1}</span>
                        <span className="step-title">{step.title}</span>
                        {hasResponse && <span className="step-check">✓</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="preview-actions">
              <button 
                className="btn-edit"
                onClick={() => setPreview(null)}
              >
                Edit Profile
              </button>
              <button 
                className="btn-activate"
                onClick={handleCompleteBuilder}
              >
                🚀 Activate Caesar
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Builder Steps Screen
  return (
    <div className="caesar-builder">
      <div className="builder-header">
        <h2>👑 Build Your Caesar</h2>
        <p>Step {currentStep + 1} of {CAESAR_BUILDER_STEPS.length}</p>
      </div>

      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${((currentStep + 1) / CAESAR_BUILDER_STEPS.length) * 100}%` }}
        />
      </div>

      <div className="builder-content">
        <div className="step-header">
          <h3>{currentStepData.title}</h3>
          <p>{currentStepData.description}</p>
        </div>

        <div className="step-prompt">
          <p>{currentStepData.prompt}</p>
        </div>

        <div className="step-input">
          <input
            type="text"
            placeholder={`Enter your ${currentStepData.key}...`}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && e.target.value.trim()) {
                handleResponse(e.target.value);
                e.target.value = '';
              }
            }}
            autoFocus
          />
          <button
            className="btn-submit"
            onClick={(e) => {
              const input = e.target.parentElement.querySelector('input');
              if (input.value.trim()) {
                handleResponse(input.value);
                input.value = '';
              }
            }}
          >
            Next →
          </button>
        </div>

        <button
          className="btn-skip"
          onClick={handleSkipStep}
        >
          Skip this step
        </button>

        {responses.length > 0 && (
          <div className="builder-summary">
            <h4>Your Responses</h4>
            <div className="summary-items">
              {responses.map((r, idx) => (
                <div key={idx} className="summary-item">
                  <span className="item-step">{CAESAR_BUILDER_STEPS.find(s => s.id === r.step)?.title}:</span>
                  <span className="item-response">{r.response}</span>
                  <button
                    className="btn-edit-item"
                    onClick={() => handleEditStep(CAESAR_BUILDER_STEPS.findIndex(s => s.id === r.step))}
                  >
                    Edit
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="builder-nav">
          <button
            className="btn-back"
            onClick={() => currentStep > 0 && setCurrentStep(currentStep - 1)}
            disabled={currentStep === 0}
          >
            ← Back
          </button>
          <button
            className="btn-cancel"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CaesarBuilder;

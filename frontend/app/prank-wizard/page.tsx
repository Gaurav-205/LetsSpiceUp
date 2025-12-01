'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ProgressBar from '@/components/PrankWizard/ProgressBar';
import MultiSelectPills from '@/components/PrankWizard/MultiSelectPills';
import RadioButtonGroup from '@/components/PrankWizard/RadioButtonGroup';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import GamingBackground from '@/components/ui/GamingBackground';
import { prankApi } from '@/lib/prank-api';
import { showToast } from '@/components/ToastProvider';
import { PRANK_TYPES, PERSONALITY_TYPES } from '@/lib/constants/prank';
import { DEFAULT_FORM_DATA, loadFormDataFromStorage, type FormData } from '@/lib/constants/form';
import { formatPhoneNumber } from '@/lib/utils/phone-format';
import Navbar from '@/components/Navbar';

export default function PrankWizardPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<FormData>(loadFormDataFromStorage);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login?redirect=/prank-wizard');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <GamingBackground>
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </GamingBackground>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const updateField = (field: keyof FormData, value: string | string[]) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('prank-wizard-form', JSON.stringify(updated));
      }
      return updated;
    });
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      // Validate Your Information
      if (!formData.yourName.trim()) newErrors.yourName = 'Your name is required';
      if (!formData.yourPhone.trim()) {
        newErrors.yourPhone = 'Phone number is required';
      }
      if (!formData.yourEmail.trim()) {
        newErrors.yourEmail = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.yourEmail)) {
        newErrors.yourEmail = 'Please enter a valid email';
      }
    } else if (step === 2) {
      // Validate Friend's Information
      if (!formData.friendName.trim()) newErrors.friendName = "Friend's name is required";
      if (!formData.friendAge) newErrors.friendAge = 'Age range is required';
      if (formData.personalityTypes.length === 0) {
        newErrors.personalityTypes = 'Select at least one personality type';
      }
    } else if (step === 3) {
      // Validate Prank Type
      if (!formData.prankType) newErrors.prankType = 'Please select a prank type';
    }
    // Step 4 (Additional Notes) is optional, no validation needed

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      // Scroll to first error after errors are set
      setTimeout(() => {
        const errorFields = Object.keys(errors).filter(key => errors[key]);
        const firstErrorField = errorFields[0];
        
        if (firstErrorField) {
          let element: HTMLElement | null = document.querySelector(`[name="${firstErrorField}"]`);
          
          if (!element) {
            const parent = document.querySelector(`[data-field="${firstErrorField}"]`);
            element = parent?.querySelector('input, select, textarea') as HTMLElement || null;
          }
          
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => {
              element?.focus();
            }, 100);
          }
        }
      }, 200);
      return;
    }
    
    // Validation passed - proceed to next step
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handleBack = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const validateAllSteps = (): boolean => {
    // Validate all required steps (1, 2, 3)
    return validateStep(1) && validateStep(2) && validateStep(3);
  };

  const handleSubmit = async () => {
    if (!validateAllSteps()) {
      // If validation fails, go back to the first step with errors
      if (!validateStep(1)) setCurrentStep(1);
      else if (!validateStep(2)) setCurrentStep(2);
      else if (!validateStep(3)) setCurrentStep(3);
      return;
    }

    setIsSubmitting(true);
    
    try {
      await prankApi.createPrank({
        yourName: formData.yourName,
        yourPhone: formData.yourPhone,
        yourEmail: formData.yourEmail,
        friendName: formData.friendName,
        friendAge: formData.friendAge,
        personalityTypes: formData.personalityTypes,
        prankType: formData.prankType,
        additionalInfo: formData.additionalInfo || undefined,
      });
      
      showToast('Prank plan created successfully!', 'success');
      
      // Clear saved form data after successful submission
      if (typeof window !== 'undefined') {
        localStorage.removeItem('prank-wizard-form');
      }
      
      // Reset form data to defaults
      setFormData(DEFAULT_FORM_DATA);
      
      router.push('/prank-wizard/success');
    } catch (error: unknown) {
      const apiError = error as { 
        response?: { 
          data?: { error?: { message: string; errors?: string[] } };
          status?: number;
        }; 
        message?: string;
      };
      
      const errorMessage = apiError.response?.data?.error?.message || apiError.message || 'Failed to create prank plan';
      showToast(errorMessage, 'error');
      
      // Set validation errors if provided
      if (apiError.response?.data?.error?.errors) {
        const validationErrors: Record<string, string> = {};
        apiError.response.data.error.errors.forEach((err) => {
          // Map error messages to fields
          if (err.includes('name')) {
            if (err.includes('Your')) validationErrors.yourName = err;
            else validationErrors.friendName = err;
          } else if (err.includes('phone')) validationErrors.yourPhone = err;
          else if (err.includes('email')) validationErrors.yourEmail = err;
          else if (err.includes('age')) validationErrors.friendAge = err;
          else if (err.includes('personality')) validationErrors.personalityTypes = err;
          else if (err.includes('prank type')) validationErrors.prankType = err;
        });
        setErrors(validationErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepTitle = (step: number): string => {
    switch (step) {
      case 1: return 'Your Information';
      case 2: return "Friend's Information";
      case 3: return 'Prank Type';
      case 4: return 'Additional Details';
      default: return '';
    }
  };

  const getStepDescription = (step: number): string => {
    switch (step) {
      case 1: return 'Tell us about yourself so we can reach you';
      case 2: return "Help us understand who we're pranking";
      case 3: return 'What kind of prank are you planning?';
      case 4: return 'Any extra details that might help? (Optional)';
      default: return '';
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ backgroundColor: '#0A0A0A' }}>
      <Navbar 
        breadcrumbs={[
          { label: 'Prank Wizard' }
        ]}
      />
      <div className="flex-1 overflow-y-auto">
        <GamingBackground fullHeight={false}>
      <div className="max-w-3xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
            <div className="rounded-xl backdrop-blur-sm border p-4 sm:p-6 md:p-8 lg:p-10 " style={{ backgroundColor: 'rgba(10, 10, 10, 0.6)', borderColor: 'rgba(138, 43, 226, 0.3)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)' }}>
          {/* Progress Bar */}
          <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

          {/* Step 1: Your Information */}
          {currentStep === 1 && (
            <div className="animate-slide-in">
              <h2 className="text-2xl sm:text-3xl font-semibold font-primary mb-2" style={{ color: '#FFFFFF', textShadow: '0 0 20px rgba(255, 255, 255, 0.2)' }}>
                {getStepTitle(1)}
              </h2>
              <p className="font-body text-sm mb-8" style={{ color: '#FFFFFF', opacity: 0.8 }}>{getStepDescription(1)}</p>
              
              <div className="space-y-5">
                <Input
                  label="Your Name"
                  name="yourName"
                  value={formData.yourName}
                  onChange={(e) => updateField('yourName', e.target.value)}
                  placeholder="Enter your full name"
                  error={errors.yourName}
                  required
                  showSuccessIcon={true}
                />
                <Input
                  label="Phone (WhatsApp)"
                  name="yourPhone"
                  type="tel"
                  value={formData.yourPhone}
                  onChange={(e) => {
                    const formatted = formatPhoneNumber(e.target.value);
                    updateField('yourPhone', formatted);
                  }}
                  placeholder="+91 98765 43210"
                  error={errors.yourPhone}
                  helpText="Include country code (e.g., +91 for India)"
                  required
                  showSuccessIcon={true}
                />
                <Input
                  label="Email"
                  name="yourEmail"
                  type="email"
                  value={formData.yourEmail}
                  onChange={(e) => updateField('yourEmail', e.target.value)}
                  placeholder="your.email@example.com"
                  error={errors.yourEmail}
                  showSuccessIcon={true}
                  helpText="We'll use this to send you the prank plan"
                  required
                />
              </div>
            </div>
          )}

          {/* Step 2: Friend's Information */}
          {currentStep === 2 && (
            <div className="animate-slide-in">
              <h2 className="text-2xl sm:text-3xl font-semibold font-primary mb-2" style={{ color: '#FFFFFF', textShadow: '0 0 20px rgba(255, 255, 255, 0.2)' }}>
                {getStepTitle(2)}
              </h2>
              <p className="font-body text-sm mb-8" style={{ color: '#FFFFFF', opacity: 0.8 }}>{getStepDescription(2)}</p>
              
              <div className="space-y-5">
                <Input
                  label="Friend's Name"
                  name="friendName"
                  value={formData.friendName}
                  onChange={(e) => updateField('friendName', e.target.value)}
                  placeholder="Enter friend's name"
                  error={errors.friendName}
                  required
                  showSuccessIcon={true}
                />
                <Select
                  label="Age Range"
                  name="friendAge"
                  value={formData.friendAge}
                  onChange={(e) => updateField('friendAge', e.target.value)}
                  placeholder="Select age range"
                  error={errors.friendAge}
                  helpText="This helps us tailor the prank appropriately"
                  options={[
                    { value: '18-25', label: '18-25' },
                    { value: '26-35', label: '26-35' },
                    { value: '36-45', label: '36-45' },
                    { value: '46+', label: '46+' },
                  ]}
                  required
                />
                <MultiSelectPills
                  label="Personality Type"
                  options={[...PERSONALITY_TYPES]}
                  selected={formData.personalityTypes}
                  onChange={(selected) => updateField('personalityTypes', selected)}
                  error={errors.personalityTypes}
                  required
                  helpText="Select all that apply"
                />
              </div>
            </div>
          )}

          {/* Step 3: Prank Type */}
          {currentStep === 3 && (
            <div className="animate-slide-in">
              <h2 className="text-2xl sm:text-3xl font-semibold font-primary mb-2" style={{ color: '#FFFFFF', textShadow: '0 0 20px rgba(255, 255, 255, 0.2)' }}>
                {getStepTitle(3)}
              </h2>
              <p className="font-body text-sm mb-8" style={{ color: '#FFFFFF', opacity: 0.8 }}>{getStepDescription(3)}</p>
              
              <div className="space-y-4">
                <RadioButtonGroup
                  label="Prank Type"
                  options={[...PRANK_TYPES]}
                  selected={formData.prankType}
                  onChange={(value) => updateField('prankType', value)}
                  error={errors.prankType}
                  required
                />
              </div>
            </div>
          )}

          {/* Step 4: Additional Information */}
          {currentStep === 4 && (
            <div className="animate-slide-in">
              <h2 className="text-2xl sm:text-3xl font-semibold font-primary mb-2" style={{ color: '#FFFFFF', textShadow: '0 0 20px rgba(255, 255, 255, 0.2)' }}>
                {getStepTitle(4)}
              </h2>
              <p className="font-body text-sm mb-8" style={{ color: '#FFFFFF', opacity: 0.8 }}>{getStepDescription(4)}</p>
              
              <div className="space-y-5">
                <Textarea
                  label="Additional Notes"
                  value={formData.additionalInfo}
                  onChange={(e) => updateField('additionalInfo', e.target.value)}
                  placeholder="Any personality quirks, habits, fears, or specific details about your friend that might help us plan the perfect prank..."
                  rows={8}
                  maxLength={2000}
                  showCharCount={true}
                  helpText="Share any additional details that might help us create the perfect prank plan"
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-10 gap-4 pt-6 border-t" style={{ borderColor: 'rgba(138, 43, 226, 0.2)' }}>
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="font-secondary !border-[#8A2BE2] !text-[#FFFFFF] hover:!bg-[#8A2BE2]/20 hover:!border-[#BFFF00] hover:!text-[#BFFF00] disabled:opacity-40 disabled:cursor-not-allowed px-8 py-3 min-w-[120px] text-base backdrop-blur-sm transition-all duration-300 rounded-xl"
              style={{ backgroundColor: 'transparent', boxShadow: '0 4px 15px rgba(138, 43, 226, 0.3)' }}
            >
              Back
            </Button>
            {currentStep < totalSteps ? (
              <Button
                onClick={handleNext}
                className="font-secondary !bg-[#BFFF00] !text-[#0A0A0A] hover:!bg-[#8A2BE2] hover:!text-[#FFFFFF] px-8 py-3 min-w-[140px] text-base shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl transform hover:scale-105"
                style={{ boxShadow: '0 8px 30px rgba(191, 255, 0, 0.4), 0 0 20px rgba(191, 255, 0, 0.2)' }}
              >
                Continue
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                isLoading={isSubmitting}
                disabled={isSubmitting}
                className="font-secondary !bg-[#BFFF00] !text-[#0A0A0A] hover:!bg-[#8A2BE2] hover:!text-[#FFFFFF] px-8 py-3 min-w-[200px] text-base shadow-xl hover:shadow-2xl transition-all duration-300 rounded-xl transform hover:scale-105"
                style={{ boxShadow: '0 8px 30px rgba(191, 255, 0, 0.4), 0 0 20px rgba(191, 255, 0, 0.2)' }}
              >
                {isSubmitting ? 'Creating Plan...' : 'Get Your Prank Plan'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </GamingBackground>
      </div>
    </div>
  );
}


export function validateResume(resume) {
  const errors = {};

  // Full name is required
  if (!resume.fullName?.trim()) {
    errors.fullName = "Please enter your full name.";
  }

  // Email is optional, but must be valid if provided
  if (resume.email?.trim()) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(resume.email.trim())) {
      errors.email = "Please enter a valid email address.";
    }
  }

  return errors;
}

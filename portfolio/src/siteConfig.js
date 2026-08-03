// Single source of truth for values that appear in more than one place.
// The email in particular was previously duplicated across three call sites
// and one of them carried a typo, so every reply bounced.

export const EMAIL = 'darwindarryljean.largoza@gmail.com';

// Lives in public/, so this path is stable in dev and in the build. Do not
// point it at src/assets — Vite hashes those and there is no stable URL.
export const RESUME_URL = '/DDJL_Resume.pdf';

export const GITHUB_URL = 'https://github.com/dadaisuk1';
export const LINKEDIN_URL = 'https://www.linkedin.com/in/ddjl/';

// Cert badge PDFs — same stable-URL reasoning as RESUME_URL above.
export const CERT_PDFS = {
  awsCloudArchitecting: '/certs/aws-cloud-architecting.pdf',
  awsCloudFoundations: '/certs/aws-cloud-foundations.pdf',
  ibmLifelongProfessionalSkills: '/certs/ibm-lifelong-professional-skills.pdf',
};

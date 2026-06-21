export interface ContactSubmission {
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  date?: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
}

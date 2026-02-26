import API_BASE_URL from '../config/api';

export const sendEmailOtp = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/verification/send-email-otp/${email}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to send OTP');
    }

    return result;
  } catch (error) {
    throw new Error(error.message || 'Error sending email OTP');
  }
};

export const sendPhoneOtp = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/verification/send-phone-otp/${email}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to send OTP');
    }

    return result;
  } catch (error) {
    throw new Error(error.message || 'Error sending phone OTP');
  }
};

export const verifyEmailOtp = async (email, otp) => {
  try {
    const response = await fetch(`${API_BASE_URL}/verification/verify-email-otp/${email}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ otp }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to verify OTP');
    }

    return result;
  } catch (error) {
    throw new Error(error.message || 'Error verifying email OTP');
  }
};

export const verifyPhoneOtp = async (email, otp) => {
  try {
    const response = await fetch(`${API_BASE_URL}/verification/verify-phone-otp/${email}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ otp }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to verify OTP');
    }

    return result;
  } catch (error) {
    throw new Error(error.message || 'Error verifying phone OTP');
  }
};

export const enableTwoFactor = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/verification/enable-2fa/${email}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to enable 2FA');
    }

    return result;
  } catch (error) {
    throw new Error(error.message || 'Error enabling 2FA');
  }
};

export const disableTwoFactor = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/verification/disable-2fa/${email}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to disable 2FA');
    }

    return result;
  } catch (error) {
    throw new Error(error.message || 'Error disabling 2FA');
  }
};

export const getVerificationStatus = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/verification/status/${email}`);

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to get status');
    }

    return result;
  } catch (error) {
    throw new Error(error.message || 'Error fetching verification status');
  }
};

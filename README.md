# Email OTP Module

**The Email OTP** (One-Time Password) module is a simplified implementation for generating and verifying OTPs sent via email. It provides methods for generating OTPs, sending them via email, and checking the validity of user-entered OTPs.

## Assumptions

1. **Email Sending:** The code assumes the existence of an email sending function (`send_email`) which is used to send OTPs via email. It further assumes that this function always succeeds and returns `STATUS_EMAIL_OK`. In a real-world scenario, email sending may fail due to network issues, invalid email addresses, or other factors.

2. **Email Validation:** The code validates the user's email address with a specific regular expression. It enforces a specific email format where the domain must be "`dso.org.sg.`" In practice, email validation may need to be more flexible to accommodate a wider range of email addresses.

3. **OTP Generation:** OTPs are generated using a simple method, which may not be suitable for a production environment where OTP security is critical. A more secure OTP generation method might be required.

4. **Blocking OTP Reading:** The check_OTP function assumes that reading the OTP is a synchronous, blocking call using `input.readOTP()`. If readOTP involves asynchronous operations (e.g., reading from a database or network calls), the code would need to be adapted to handle this asynchronous behavior.

5. **Maximum OTP Attempts and Timeout:** The code defines a maximum number of OTP attempts (`this.maxAttempts`) and an OTP timeout period (`this.otpTimeout`). These values are assumed to be suitable for the use case. In a production environment, these values may need to be adjusted based on security and usability requirements.

## Usage

### Installation

1. Clone the repository.
2. Install the required dependencies for running unit tests using `npm install`.
3. Run the tests using `npm run test`.

### Configuration

- `maxAttempts`: The maximum number of OTP verification attempts allowed.
- `otpTimeout`: The time (in milliseconds) for which an OTP is valid.
- `send_email`: Implement your email sending logic in this function.
- `validate_email`: Define email validation logic here.
- `generate_random_OTP`: Define OTP generation logic here.

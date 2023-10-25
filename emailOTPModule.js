const STATUS_EMAIL_OK = 0;
const STATUS_EMAIL_FAIL = 1;
const STATUS_EMAIL_INVALID = 2;
const STATUS_OTP_OK = 0;
const STATUS_OTP_FAIL = 1;
const STATUS_OTP_TIMEOUT = 2;

class Email_OTP_Module {
  constructor() {
    // Initialize user's OTP and configuration parameters
    this.userOtp = null; // Current OTP value
    this.maxAttempts = 10; // Maximum allowed OTP verification attempts
    this.otpTimeout = 1 * 60 * 1000; // OTP validity period (60 seconds in milliseconds)
    this.otpSentTime = null; // Timestamp when the OTP was sent
  }

  /*
    Generate and send an OTP to the user's email address.
    The OTP is sent via email, and the email status is checked.
    If the email is sent successfully, store the OTP and sent time.
    Return status codes indicating success or failure.
  */
  generate_OTP_email(user_email) {
    if (!this.validate_email(user_email)) {
      return STATUS_EMAIL_INVALID;
    }
    this.userOtp = this.generate_random_OTP();
    const emailBody = `Your OTP is ${this.userOtp}. The code is valid for 1 minute`;
    const emailStatus = send_email(user_email, emailBody);
    if (emailStatus === STATUS_EMAIL_OK) {
      this.otpSentTime = Date.now();
      return STATUS_EMAIL_OK;
    } else {
      return STATUS_EMAIL_FAIL;
    }
  }

  /*
    Verify the user's OTP by repeatedly checking for the correct OTP.
    This function runs on a timed interval, allowing multiple attempts.
    It tracks the number of attempts, handles OTP expiration, and reports results.
    Return status codes indicating success, timeout, or failure.
  */
  check_OTP(input) {
    return new Promise((resolve, reject) => {
      let attempts = 0;

      const checkInterval = setInterval(() => {
        if (Date.now() - this.otpSentTime > this.otpTimeout) {
          clearInterval(checkInterval);
          resolve(STATUS_OTP_TIMEOUT); // OTP has expired
          return;
        }

        if (attempts >= this.maxAttempts) {
          clearInterval(checkInterval);
          resolve(STATUS_OTP_FAIL); // Exceeded maximum OTP verification attempts
          return;
        }

        let enteredOtp;
        try {
          enteredOtp = input.readOTP(); // Read the user-entered OTP (blocking call)
        } catch (e) {
          clearInterval(checkInterval);
          reject(new Error("Error reading OTP."));
          return;
        }

        if (enteredOtp === this.userOtp) {
          clearInterval(checkInterval);
          resolve(STATUS_OTP_OK); // OTP verification succeeded
          return;
        } else {
          attempts++;
        }
      }, 5000); // Check every 5 seconds, adjust as necessary
    });
  }

  /*
    Validate the format of the user's email address.
    The regular expression enforces a specific email format.
    Return true for a valid email, false for an invalid email.
  */
  validate_email(email) {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]*?dso\.org\.sg$/;
    return regex.test(email);
  }

  /*
    Generate a random 6-digit OTP for the user.
    This is a simplified example for educational purposes.
    In practice, OTP generation may be more secure and complex.
  */
  generate_random_OTP() {
    return Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
  }
};

/*
  Implement your email sending logic here
  You can use external libraries or services to send emails
  Return appropriate status based on the result
  For simplicity, we'll assume it always succeeds in this example
*/
function send_email(emailAddress, emailBody) {
  return STATUS_EMAIL_OK;
};

module.exports = { Email_OTP_Module, STATUS_EMAIL_OK, STATUS_EMAIL_FAIL, STATUS_EMAIL_INVALID, STATUS_OTP_OK, STATUS_OTP_FAIL, STATUS_OTP_TIMEOUT };

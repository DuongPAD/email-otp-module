const chai = require('chai');
const expect = chai.expect;

const { Email_OTP_Module, STATUS_EMAIL_OK, STATUS_EMAIL_FAIL, STATUS_EMAIL_INVALID, STATUS_OTP_OK, STATUS_OTP_FAIL, STATUS_OTP_TIMEOUT } = require('./emailOTPModule');

describe('Email_OTP_Module', () => {
  let emailModule;

  before(() => {
    emailModule = new Email_OTP_Module();
  });

  it('should handle just check invalid email addresses', () => {
    const user_email = 'invalidemail@example.com';
    const status = emailModule.validate_email(user_email);
    expect(status).to.equal(false);
  });

  it('should handle just check valid email addresses', () => {
    const user_email = 'user@test.dso.org.sg';
    const status = emailModule.validate_email(user_email);
    expect(status).to.equal(true);
  });

  it('should handle invalid email addresses', () => {
    const user_email = 'invalidemail@example.com';
    const status = emailModule.generate_OTP_email(user_email);
    expect(status).to.equal(STATUS_EMAIL_INVALID);
  });

  it('should generate and send OTP successfully for a valid email', () => {
    const user_email = 'user@hi.dso.org.sg';
    const status = emailModule.generate_OTP_email(user_email);
    expect(status).to.equal(STATUS_EMAIL_OK);
  });

  it('should successfully check a valid OTP', (done) => {
    const user_email = 'user@test.dso.org.sg';
    const input = {
      readOTP: () => emailModule.userOtp, // Simulate a correct OTP
    };

    emailModule.generate_OTP_email(user_email); // Generate OTP
    emailModule.check_OTP(input)
      .then((result) => {
        expect(result).to.equal(STATUS_OTP_OK);
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  it('should fail to check OTP after 10 incorrect attempts', (done) => {
    const user_email = 'user@test.dso.org.sg';
    let incorrectAttempts = 0;

    const input = {
      readOTP: () => {
        incorrectAttempts++;
        console.log(`Incorrect OTP attempt #${incorrectAttempts}`); // Log the incorrect attempt
        return '123456'; // Simulate 10 incorrect attempts
      },
    };

    emailModule.generate_OTP_email(user_email); // Generate OTP
    emailModule.check_OTP(input)
      .then((result) => {
        expect(result).to.equal(STATUS_OTP_FAIL);
        console.log(`Total incorrect attempts: ${incorrectAttempts}`);
        done();
      })
      .catch((error) => {
        done(error);
      });
  });

  it('should handle OTP timeout', (done) => {
    const user_email = 'user@test.dso.org.sg';

    emailModule.generate_OTP_email(user_email); // Generate OTP

    setTimeout(() => {
      const input = {
        readOTP: () => '123456', // Simulate incorrect OTP
      };

      emailModule.check_OTP(input)
        .then((result) => {
          expect(result).to.equal(STATUS_OTP_TIMEOUT);
          done();
        })
        .catch((error) => {
          done(error);
        });
    }, emailModule.otpTimeout + 1000); // Wait longer than the OTP timeout
  });

});
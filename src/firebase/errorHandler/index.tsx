import { FirebaseError } from 'firebase/app';

// https://firebase.google.com/docs/auth/admin/errors

export const generateFirebaseAuthErrorMessage = (error: FirebaseError) => {
  let errorMsg;

  switch (error.code) {
    case 'auth/invalid-email':
      errorMsg = 'Invalid email address. Please enter a valid email.';
      break;
    case 'auth/user-not-found':
      errorMsg = 'User not found. Please check the email address.';
      break;
    case 'auth/wrong-password':
      errorMsg = 'Incorrect password. Please try again.';
      break;
    case 'auth/email-already-in-use':
      errorMsg = 'Email already in use. Please try another email.';
      break;
    case 'auth/weak-password':
      errorMsg = 'Password should be at least 6 characters.';
      break;
    case 'auth/operation-not-allowed':
      errorMsg = 'Operation not allowed. Please try again later.';
      break;
    case 'auth/invalid-verification-code':
      errorMsg = 'Invalid verification code. Please try again.';
      break;
    case 'auth/invalid-verification-id':
      errorMsg = 'Invalid verification ID. Please try again.';
      break;
    case 'auth/code-expired':
      errorMsg = 'Code expired. Please try again.';
      break;
    case 'auth/invalid-action-code':
      errorMsg = 'Invalid action code. Please try again.';
      break;
    case 'auth/user-disabled':
      errorMsg = 'User disabled. Please contact support.';
      break;
    case 'auth/invalid-credential':
      errorMsg = 'Invalid credentials. Please try again.';
      break;
    case 'auth/invalid-continue-uri':
      errorMsg = 'Invalid continue URL. Please try again.';
      break;
    case 'auth/unauthorized-continue-uri':
      errorMsg = 'Unauthorized continue URL. Please try again.';
      break;
    case 'auth/missing-continue-uri':
      errorMsg = 'Missing continue URL. Please try again.';
      break;
    case 'auth/missing-verification-code':
      errorMsg = 'Missing verification code. Please try again.';
      break;
    case 'auth/missing-verification-id':
      errorMsg = 'Missing verification ID. Please try again.';
      break;
    case 'auth/captcha-check-failed':
      errorMsg = 'Captcha check failed. Please try again.';
      break;
    case 'auth/invalid-phone-number':
      errorMsg = 'Invalid phone number. Please try again.';
      break;
    case 'auth/missing-phone-number':
      errorMsg = 'Missing phone number. Please try again.';
      break;
    case 'auth/quota-exceeded':
      errorMsg = 'Quota exceeded. Please try again.';
      break;
    case 'auth/missing-app-credential':
      errorMsg = 'Missing app credential. Please try again.';
      break;
    case 'auth/invalid-app-credential':
      errorMsg = 'Invalid app credential. Please try again.';
      break;
    case 'auth/session-expired':
      errorMsg = 'Session expired. Please try again.';
      break;
    case 'auth/missing-or-invalid-nonce':
      errorMsg = 'Missing or invalid nonce. Please try again.';
      break;
    case 'auth/missing-client-identifier':
      errorMsg = 'Missing client identifier. Please try again.';
      break;
    case 'auth/key-retrieval-failed':
      errorMsg = 'Key retrieval failed. Please try again.';
      break;
    case 'auth/invalid-oauth-provider':
      errorMsg = 'Invalid OAuth provider. Please try again.';
      break;
    case 'auth/invalid-oauth-client-id':
      errorMsg = 'Invalid OAuth client ID. Please try again.';
      break;
    case 'auth/invalid-cert-hash':
      errorMsg = 'Invalid cert hash. Please try again.';
      break;
    case 'auth/invalid-user-token':
      errorMsg = 'Invalid user token. Please try again.';
      break;
    case 'auth/invalid-custom-token':
      errorMsg = 'Invalid custom token. Please try again.';
      break;
    case 'auth/app-deleted':
      errorMsg = 'App deleted. Please try again.';
      break;
    case 'auth/app-not-authorized':
      errorMsg = 'App not authorized. Please try again.';
      break;
    case 'auth/argument-error':
      errorMsg = 'Argument error. Please try again.';
      break;
    case 'auth/invalid-api-key':
      errorMsg = 'Invalid API key. Please try again.';
      break;
    case 'auth/network-request-failed':
      errorMsg = 'Network request failed. Please try again.';
      break;
    case 'auth/requires-recent-login':
      errorMsg = 'Requires recent login. Please try again.';
      break;
    case 'auth/too-many-requests':
      errorMsg = 'Too many requests. Please try again.';
      break;
    case 'auth/unauthorized-domain':
      errorMsg = 'Unauthorized domain. Please try again.';
      break;
    case 'auth/user-token-expired':
      errorMsg = 'User token expired. Please try again.';
      break;
    case 'auth/web-storage-unsupported':
      errorMsg = 'Web storage unsupported. Please try again.';
      break;
    case 'auth/account-exists-with-different-credential':
      errorMsg = 'Account exists with different credential. Please try again.';
      break;
    case 'auth/auth-domain-config-required':
      errorMsg = 'Auth domain config required. Please try again.';
      break;
    case 'auth/cancelled-popup-request':
      errorMsg = 'Cancelled popup request. Please try again.';
      break;
    case 'auth/credential-already-in-use':
      errorMsg = 'Credential already in use. Please try again.';
      break;
    case 'auth/custom-token-mismatch':
      errorMsg = 'Custom token mismatch. Please try again.';
      break;
    case 'auth/provider-already-linked':
      errorMsg = 'Provider already linked. Please try again.';
      break;
    case 'auth/timeout':
      errorMsg = 'Timeout. Please try again.';
      break;
    case 'auth/missing-android-pkg-name':
      errorMsg = 'Missing Android package name. Please try again.';
      break;
    case 'auth/missing-ios-bundle-id':
      errorMsg = 'Missing iOS bundle ID. Please try again.';
      break;
    case 'auth/invalid-dynamic-link-domain':
      errorMsg = 'Invalid dynamic link domain. Please try again.';
      break;
    case 'auth/invalid-persistence-type':
      errorMsg = 'Invalid persistence type. Please try again.';
      break;
    case 'auth/unsupported-persistence-type':
      errorMsg = 'Unsupported persistence type. Please try again.';
      break;
    case 'auth/invalid-oauth-client-secret':
      errorMsg = 'Invalid OAuth client secret. Please try again.';
      break;
    case 'auth/invalid-argument':
      errorMsg = 'Invalid argument. Please try again.';
      break;
    case 'auth/invalid-creation-time':
      errorMsg = 'Invalid creation time. Please try again.';
      break;
    case 'auth/invalid-disabled-field':
      errorMsg = 'Invalid disabled field. Please try again.';
      break;
    case 'auth/invalid-display-name':
      errorMsg = 'Invalid display name. Please try again.';
      break;
    case 'auth/invalid-email-verified':
      errorMsg = 'Invalid email verified. Please try again.';
      break;
    case 'auth/invalid-hash-algorithm':
      errorMsg = 'Invalid hash algorithm. Please try again.';
      break;
    case 'auth/invalid-hash-block-size':
      errorMsg = 'Invalid hash block size. Please try again.';
      break;
    case 'auth/invalid-hash-derived-key-length':
      errorMsg = 'Invalid hash derived key length. Please try again.';
      break;
    case 'auth/invalid-hash-key':
      errorMsg = 'Invalid hash key. Please try again.';
      break;
    case 'auth/invalid-hash-memory-cost':
      errorMsg = 'Invalid hash memory cost. Please try again.';
      break;
    case 'auth/invalid-hash-parallelization':
      errorMsg = 'Invalid hash parallelization. Please try again.';
      break;
    case 'auth/invalid-hash-rounds':
      errorMsg = 'Invalid hash rounds. Please try again.';
      break;
    case 'auth/invalid-hash-salt-separator':
      errorMsg = 'Invalid hash salt separator. Please try again.';
      break;
    case 'auth/invalid-id-token':
      errorMsg = 'Invalid ID token. Please try again.';
      break;
    case 'auth/invalid-last-sign-in-time':
      errorMsg = 'Invalid last sign in time. Please try again.';
      break;
    case 'auth/invalid-page-token':
      errorMsg = 'Invalid page token. Please try again.';
      break;
    case 'auth/invalid-password':
      errorMsg = 'Invalid password. Please try again.';
      break;
    case 'auth/invalid-password-hash':
      errorMsg = 'Invalid password hash. Please try again.';
      break;
    case 'auth/invalid-password-salt':
      errorMsg = 'Invalid password salt. Please try again.';
      break;
    case 'auth/invalid-photo-url':
      errorMsg = 'Invalid photo URL. Please try again.';
      break;
    case 'auth/invalid-provider-id':
      errorMsg = 'Invalid provider ID. Please try again.';
      break;
    case 'auth/invalid-session-cookie-duration':
      errorMsg = 'Invalid session cookie duration. Please try again.';
      break;
    case 'auth/invalid-uid':
      errorMsg = 'Invalid UID. Please try again.';
      break;
    case 'auth/invalid-user-import':
      errorMsg = 'Invalid user import. Please try again.';
      break;
    case 'auth/invalid-provider-data':
      errorMsg = 'Invalid provider data. Please try again.';
      break;
    case 'auth/maximum-user-count-exceeded':
      errorMsg = 'Maximum user count exceeded. Please try again.';
      break;
    case 'auth/missing-hash-algorithm':
      errorMsg = 'Missing hash algorithm. Please try again.';
      break;
    case 'auth/missing-uid':
      errorMsg = 'Missing UID. Please try again.';
      break;
    case 'auth/reserved-claims':
      errorMsg = 'Reserved claims. Please try again.';
      break;
    case 'auth/session-cookie-revoked':
      errorMsg = 'Session cookie revoked. Please try again.';
      break;
    case 'auth/uid-already-exists':
      errorMsg = 'UID already exists. Please try again.';
      break;
    case 'auth/email-already-exists':
      errorMsg = 'Email already exists. Please try again.';
      break;
    case 'auth/phone-number-already-exists':
      errorMsg = 'Phone number already exists. Please try again.';
      break;
    case 'auth/project-not-found':
      errorMsg = 'Project not found. Please try again.';
      break;
    case 'auth/insufficient-permission':
      errorMsg = 'Insufficient permission. Please try again.';
      break;
    case 'auth/internal-error':
      errorMsg = 'Internal error. Please try again.';
      break;

    default:
      errorMsg = 'Something went wrong. Please try again later.';
  }

  return errorMsg;
};

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { config } from './index';
import { findOrCreateGoogleUser } from '../services/authService';
import { logger } from '../utils/logger';

// Only initialize Google OAuth if credentials are provided
if (config.google.clientId && config.google.clientSecret) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: config.google.clientId,
        clientSecret: config.google.clientSecret,
        callbackURL: config.google.callbackURL,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const { id, emails, displayName } = profile;
          const email = emails?.[0]?.value;

          if (!email) {
            return done(new Error('No email found in Google profile'), undefined);
          }

          const result = await findOrCreateGoogleUser(id, email, displayName || '');
          return done(null, result);
        } catch (error: unknown) {
          const err = error as Error;
          return done(err, undefined);
        }
      }
    )
  );
  logger.info('Google OAuth configured');
} else {
  logger.debug('Google OAuth not configured (optional)');
}

interface GoogleAuthResult {
  user?: {
    id: string;
  };
  token?: string;
}

passport.serializeUser((user: GoogleAuthResult | string, done: (err: any, id?: any) => void) => {
  if (typeof user === 'object' && user.user?.id) {
    done(null, user.user.id);
  } else if (typeof user === 'string') {
    done(null, user);
  } else {
    done(null, '');
  }
});

passport.deserializeUser((id: string, done: (err: any, user?: any) => void) => {
  done(null, { id });
});


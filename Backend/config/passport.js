const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../modules/users/usersSchema.js");

// CONFIGURAZIONE STRATEGIA GOOGLE
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "temp_id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "temp_secret",
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Cerchiamo se l'utente esiste già tramite il googleId
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // Se non esiste, lo creiamo prendendo i dati dal profilo Google
          user = await User.create({
            firstName: profile.name.givenName || profile.displayName,
            lastName: profile.name.familyName || "",
            email: profile.emails[0].value,
            googleId: profile.id,
          });
        }
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// CONFIGURAZIONE STRATEGIA GITHUB
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID || "temp_id",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "temp_secret",
      callbackURL: "/auth/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Cerchiamo se l'utente esiste già tramite il githubId
        let user = await User.findOne({ githubId: profile.id });

        if (!user) {
          // GitHub non sempre fornisce il nome diviso o l'email pubblica. Gestiamo i fallback:
          const nameParts = (profile.displayName || profile.username).split(" ");
          const email = profile.emails && profile.emails[0] ? profile.emails[0].value : `${profile.username}@github.placeholder.com`;

          user = await User.create({
            firstName: nameParts[0],
            lastName: nameParts.slice(1).join(" ") || "",
            email: email,
            githubId: profile.id,
          });
        }
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

module.exports = passport;
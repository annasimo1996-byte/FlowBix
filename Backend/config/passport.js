const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../modules/users/usersSchema.js");
const BACKEND_URL = process.env.BACKEND_URL || "https://flowbix-backend.onrender.com";

console.log("--> GOOGLE CLIENT ID CARICATO:", process.env.GOOGLE_CLIENT_ID),

  //GOOGLE
  passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "temp_id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "temp_secret",
      callbackURL: `${BACKEND_URL}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        //Controllo di precedenti login con Google
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // Controllo email già esistente
          user = await User.findOne({ email });

          if (user) {
            // Se esiste, collega il googleId all'account esistente
            user.googleId = profile.id;
            await user.save();
          } else {
            // Se non esiste crea il nuovo utente
            user = await User.create({
              firstName: profile.name?.givenName || profile.displayName,
              lastName: profile.name?.familyName || "",
              email: email,
              googleId: profile.id,
            });
          }
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// GITHUB
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID || "temp_id",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "temp_secret",
      callbackURL: `${BACKEND_URL}/auth/google/callback`,
      scope: ["user:email"], 
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Controllo precedenti login con GitHub
        let user = await User.findOne({ githubId: profile.id });

        if (!user) {
          //nome e cognome
          const fullName = profile.displayName || profile.username || "GitHub User";
          const nameParts = fullName.trim().split(" ");
          
          const firstName = nameParts[0];
          //In caso il cognome non ci sia
          const lastName = nameParts.slice(1).join(" ") || "-"; 

          // Gestione dell'email
          const email = profile.emails && profile.emails[0] && profile.emails[0].value
            ? profile.emails[0].value
            : `${profile.username || profile.id}@github.placeholder.com`;

          // Controllo email già esistente
          user = await User.findOne({ email });

          if (user) {
            // Se esiste già collega il githubId all'account
            user.githubId = profile.id;
            await user.save();
          } else {
            // Se non esiste crea il nuovo utente
            user = await User.create({
              firstName: firstName,
              lastName: lastName,
              email: email,
              githubId: profile.id,
            });
          }
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

module.exports = passport;
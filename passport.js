const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const db = require('./database');
const bcrypt = require('./bcrypt');

module.exports = (app) => {
    app.use(passport.initialize());
    app.use(passport.session());

    //sign in
    passport.use('local-login', new LocalStrategy({
        usernameField: 'email'
    },
        async (email, password, done) => {
            try{
                let users = await db('users').where({email:email});
                if (users.length == 0) {
                    return done(null, false, { message: 'Incorrect credentials.' });
                }
                let user = users[0];
                let result = await bcrypt.checkPassword(password, user.password);
                if (result) {
                    return done(null, user);
                }else{
                    return done(null, false, { message: 'Incorrect credentials.' });
                }
            }catch(err){
                return done(err);
            }
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        let users = await db('users').where({id:id});
        if (users.length == 0) {
            return done(new Error(`Wrong user id ${id}`));
        }
        let user = users[0];
        return done(null, user);
    });

    // sign up
    passport.use('local-signup', new LocalStrategy({
            passReqToCallback : true,
            usernameField: 'email'
        },
        async (req, email, password, done) => {
            try{
                let users = await db('users').where({email:email});
                if (users.length > 0) {
                    return done(null, false, { message: 'Email already taken' });
                }
                let hash = await bcrypt.hashPassword(password);
                const newUser = {
                    username: req.body.username,
                    email: email,
                    password: hash,
                    user_diet: req.body.diet,
                    fav_cuisine: req.body.favCuisine,
                };
                console.log(newUser);
                let userId = await db('users').insert(newUser).returning('id');
                newUser.id = userId[0];
                done(null,newUser);
            }catch(err){
                done(err);
            }
    
        })
    );
};
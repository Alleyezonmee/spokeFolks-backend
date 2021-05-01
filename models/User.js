const mongoose = require('mongoose');
bcrypt = require('bcryptjs');
SALT_WORK_FACTOR = 10;

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        index: {unique: true}
    },
    password: {
        type: String,
        reuired: true
    },
    profile: {
        type: mongoose.Schema.Types.Mixed, ref:'Profile', default: { }
    }
}, {timeStamps: true, minimize: false});

userSchema.pre('save', function(next) {
    var user = this;
    if(!user.isModified('password')) return next;
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if(err) return next(err);

        bcrypt.hash(user.password, salt, function(err, hash) {
            if(err) return next(err);
            else {
                user.password = hash;
                next();
            }
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if(err) return cb(err);
        cb(null, isMatch);
    });
};

userSchema.statics.updateProfile = function(userId, updatedProfile, cb) {
    this.findOneAndUpdate({_id: userId}, {profile: updatedProfile}, {upsert: true}, function(err, updatedDoc) {
        if(err) return cb(err, null); 
        return cb(null, updatedDoc);
    }); 
}

userSchema.statics.authenticate = function(email, password, cb) {
    this.findOne({email: email}, function(err, user) {
        if(err) return cb(err);

        if(!user) return cb(null, null);

        user.comparePassword(password, function(err, isMatch) {
            if(err) return cb(err);

            if(isMatch) return cb(null, user, isMatch); else return cb(null, null, isMatch);
        });
    });
};

module.exports = mongoose.model('User', userSchema)
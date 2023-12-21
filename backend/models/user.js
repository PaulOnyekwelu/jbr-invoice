import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from "validator";
import { USER } from '../constants/index.js';

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    email: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      validate: [validator.isEmail, 'Please provide a valid Email Address'],
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate: {
        validator: function (value) {
          return /^[A-Za-z][A-Za-z0-9]{3,20}$/.test(value);
        },
        message: 'Username must be alphanumeric, and must start with a letter',
      },
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
      validate: [
        validator.isAlphanumeric,
        'Firstname can only be alphanumeric. No special characters.',
      ],
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      validate: [
        validator.isAlphanumeric,
        'Lastname can only be alphanumeric. No special characters.',
      ],
    },
    password: {
      type: String,
      select: false,
      validate: [
        validator.isStrongPassword,
        'Password must be atleast 8 characters long and a combinations of letters, numbers, and special characters',
      ],
    },
    passwordConfirm: {
      type: String,
      validate: {
        validator: function (value) {
          return value === this.password;
        },
        message: 'passwords do not match!',
      },
    },
    phoneNumber: {
      type: String,
      default: '+4407806603443',
      required: false,
      // validate: [
      //   validator.isMobilePhone,
      //   'Please provide a valid Phone number',
      // ],
    },
    isEmailVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    provider: {
      type: String,
      required: true,
      default: 'email',
    },
    googleID: String,
    avatar: String,
    businessName: String,
    address: String,
    city: String,
    country: String,
    passwordChangedAt: Date,
    roles: {
      type: [String],
      default: [USER],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    refreshToken: [String],
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (this.roles.length === 0) {
    this.roles.push(USER);
  }
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now();
  next();
});

userSchema.methods.comparePassword = async function (givenPassword) {
  return bcrypt.compare(givenPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;

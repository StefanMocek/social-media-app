import mongoose from 'mongoose';
import {authenticationService} from '../../common';
import {PostDoc} from './post.model';

export interface UserDoc extends mongoose.Document { 
  email: string,
  password: string,
  posts?: Array<PostDoc>
};

export interface CreateUserDto { 
  email: string,
  password: string,
};

export interface UserModel extends mongoose.Model<UserDoc> {
  build(dto: CreateUserDto): UserDoc
};

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Please provide valid email"
    ],
  },

  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 30
  },

  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post'
    }
  ]
});

userSchema.pre('save', async function(done) {
  if (this.isModified('password') || this.isNew) {
    const hashPwd = authenticationService.pwdToHash(this.get('password'));
    this.set('password', hashPwd);
  };

  done();
});

userSchema.statics.build = (createUserDto: CreateUserDto) => {
  return new User(createUserDto)
};

const User = mongoose.model<UserDoc,UserModel>('User', userSchema);

export default User;
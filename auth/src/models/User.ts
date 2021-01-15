import mongoose from "mongoose";
import { Password } from "../services/Password";

interface UserAttrs {
  email: string;
  password: string;
}

//Rules for the properties/functions of the User Model
interface UserModel extends mongoose.Model<UserDocument> {
  build(attrs: UserAttrs): UserDocument;
}

//Rules for Document, this rules tell which can be accessed after instantiated. Only properties, not functions ( i think)
/*
  const newDoc = new User.build({
    email: "some@email.com",
    password: "myPassword"
  })

  //This is Good
  newDoc.email

  //Despite this being available since mongoose automatically place this, typescript will show an error sign that it's not found in the rules,
  //so you must place createdAt in the interface below.
  newDoc.createdAt

*/
interface UserDocument extends mongoose.Document {
  email: string;
  password: string;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true, 
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    //Using transform(), Whenever you MAKE this model, it remove the properties below on th returned model
    //when ever you send back this model, it will transform it first to modify it's properties 
    //In this case, it will remove _id, password, and __v. Will also add .id
    //The properties are accessable until it's sent. Check signin.ts
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id
        delete ret._id
        delete ret.password;
        delete ret.__v
      },
    },
  }
);

//this does not use the arrow function, if we do, the 'this.' keyword would refer variables in this file,
//using the not arrow function way, the 'this.' keyword would refer variables of the User Document, not schema, but User Document.
userSchema.pre("save", async function (next) {
  //this.isModified will return true even if you just recently created the User model
  if (this.isModified("password")) {
    const hashed = await Password.toHash(this.get("password"));

    this.set("password", hashed);
  }

  next();
});

userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

//to see the error, remove the angle brackets
const User = mongoose.model<UserDocument, UserModel>("User", userSchema);

export { User };

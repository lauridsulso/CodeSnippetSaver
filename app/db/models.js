import { mongoose } from "mongoose";

const { Schema } = mongoose;

const snippetSchema = new Schema({
  title: {
    type: String,
    required: true,
    minLength: [1, "That's too short"],
  },
  language: {
    type: String,
    required: true,
    minLength: [1, "That's too short"],
  },
  description: {
    type: String,
    required: true,
    minLength: [1, "That's too short"],
  },
  snippet: {
    type: String,
    required: true,
    minLength: [1, "That's too short"],
  },
  favorite: {
    type: Boolean,
  },
  timeCreated: {
    type: Date,
    default: Date.now,
  },
});

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    minLength: [1, "That's too short"],
  },
  password: {
    type: String,
    required: true,
    minLength: [1, "That's too short"],
  },
});

export const models = [
  {
    name: "Snippet",
    schema: snippetSchema,
    collection: "snippets",
  },
  {
    name: "User",
    schema: userSchema,
    collection: "users",
  },
];

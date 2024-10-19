// models/ContactModel.ts
import  { Schema, model, models } from 'mongoose';

// Define the schema for a contact submission
const ContactSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the model, only if it doesn't exist already
const ContactModel = models.Contact || model('Contact', ContactSchema);

export default ContactModel;

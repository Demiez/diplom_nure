import mongoose from 'mongoose';
import { v4 } from 'uuid';

const PatientSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: v4(),
  },
  name: {
    type: String,
    required: `Заповніть ім'я пацієнта`,
    trim: true,
  },
  age: {
    type: Number,
    required: `Заповніть вік пацієнта`,
  },
  department: {
    type: String,
    required: `Заповніть відділення`,
    trim: true,
  },
  ward: {
    type: Number,
    required: `Заповніть палату`,
  },
  diagnosis: {
    type: String,
    required: `Заповніть діагноз`,
    trim: true,
  },
  eCard: {
    type: String,
    required: `Заповніть № Е-Картки пацієнта`,
    trim: true,
  },
  bloodPressure: {
    type: String,
    required: `Заповніть АД пацієнта`,
    trim: true,
  },
  pulse: {
    type: Number,
    required: `Заповніть пульс`,
  },
  temperature: {
    type: Number,
    required: `Заповніть температуру`,
  },
  saturation: {
    type: Number,
    required: `Заповніть сатурацію`,
  },
  updated: Date,
  created: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Patient', PatientSchema);

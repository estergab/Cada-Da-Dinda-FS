const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const larSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,
    unique: true,
    required: true
  },
  hostName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  address: { type: String, required: true },
  capacity: { type: Number, required: true },
  hasYard: { type: Boolean, default: false },
  hasFence: { type: Boolean, default: false },
  experience: { type: String },
  availableFor: { type: [String], default: [] },
  description: { type: String },
  imageUrl: { type: String },
  isActive: { type: Boolean, default: true }, // ✅ CAMPO NOVO
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Lar', larSchema);

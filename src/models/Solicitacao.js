const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const solicitacaoSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,
    unique: true
  },
  homeId: {
    type: String,
    required: true,
    ref: 'Lar'
  },
  // ✅ NOVO - Email do anfitrião (dono do lar)
  hostEmail: {
    type: String,
    required: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  requesterName: {
    type: String,
    required: true
  },
  requesterEmail: {
    type: String,
    required: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  requesterPhone: {
    type: String,
    required: true
  },
  petName: {
    type: String,
    required: true
  },
  petType: {
    type: String,
    required: true,
    enum: ['dog', 'cat']
  },
  petAge: {
    type: String
  },
  petSize: {
    type: String
  },
  healthConditions: {
    type: String
  },
  behavior: {
    type: String
  },
  petImageUrl: {
    type: String
  },
  startDate: {
    type: String
  },
  duration: {
    type: String
  },
  message: {
    type: String
  },
  // ✅ NOVO - Status da solicitação
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Solicitacao', solicitacaoSchema);

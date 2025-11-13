const Solicitacao = require('../models/Solicitacao');
const Lar = require('../models/Lar');
const path = require('path');
const fs = require('fs');

// Criar solicitação
exports.createSolicitacao = async (req, res, next) => {
  try {
    const petImageUrl = req.file ? `/uploads/pets/${req.file.filename}` : null;

    // ✅ Buscar email do anfitrião
    const lar = await Lar.findOne({ id: req.body.homeId });
    if (!lar) {
      return res.status(400).json({ success: false, message: 'Lar não encontrado' });
    }

    const solicitacao = new Solicitacao({
      ...req.body,
      hostEmail: lar.email, // ✅ Adicionar email do anfitrião
      petImageUrl,
      status: 'pending' // ✅ Status inicial
    });

    await solicitacao.save();
    res.status(201).json({ success: true, data: solicitacao });
  } catch (error) {
    next(error);
  }
};

// Listar todas as solicitações
exports.getSolicitacoes = async (req, res, next) => {
  try {
    const solicitacoes = await Solicitacao.find();
    res.json({ success: true, data: solicitacoes });
  } catch (error) {
    next(error);
  }
};

// Listar solicitações por lar (homeId)
exports.getSolicitacoesByLar = async (req, res, next) => {
  try {
    const solicitacoes = await Solicitacao.find({ homeId: req.params.homeId });
    res.json({ success: true, data: solicitacoes });
  } catch (error) {
    next(error);
  }
};

// ✅ Listar solicitações por email (tutor OU anfitrião)
exports.getSolicitacoesByEmail = async (req, res, next) => {
  try {
    const email = req.params.email.toLowerCase();
    
    // Buscar solicitações onde o usuário é tutor OU anfitrião
    const solicitacoes = await Solicitacao.find({
      $or: [
        { requesterEmail: email },
        { hostEmail: email }
      ]
    });

    res.json({ success: true, data: solicitacoes });
  } catch (error) {
    next(error);
  }
};

// Buscar solicitação por ID
exports.getSolicitacaoById = async (req, res, next) => {
  try {
    const solicitacao = await Solicitacao.findOne({ id: req.params.id });
    
    if (!solicitacao) {
      return res.status(404).json({ success: false, message: 'Solicitação não encontrada' });
    }

    res.json({ success: true, data: solicitacao });
  } catch (error) {
    next(error);
  }
};

// ✅ ACEITAR SOLICITAÇÃO
exports.aceitarSolicitacao = async (req, res, next) => {
  try {
    const solicitacao = await Solicitacao.findOneAndUpdate(
      { id: req.params.id },
      { status: 'approved' },
      { new: true }
    );

    if (!solicitacao) {
      return res.status(404).json({ success: false, message: 'Solicitação não encontrada' });
    }

    res.json({ success: true, data: solicitacao, message: 'Solicitação aprovada com sucesso!' });
  } catch (error) {
    next(error);
  }
};

// ✅ NEGAR SOLICITAÇÃO
exports.negarSolicitacao = async (req, res, next) => {
  try {
    const solicitacao = await Solicitacao.findOneAndUpdate(
      { id: req.params.id },
      { status: 'rejected' },
      { new: true }
    );

    if (!solicitacao) {
      return res.status(404).json({ success: false, message: 'Solicitação não encontrada' });
    }

    res.json({ success: true, data: solicitacao, message: 'Solicitação negada.' });
  } catch (error) {
    next(error);
  }
};

// Atualizar solicitação
exports.updateSolicitacao = async (req, res, next) => {
  try {
    const solicitacao = await Solicitacao.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );

    if (!solicitacao) {
      return res.status(404).json({ success: false, message: 'Solicitação não encontrada' });
    }

    res.json({ success: true, data: solicitacao });
  } catch (error) {
    next(error);
  }
};

// Deletar solicitação
exports.deleteSolicitacao = async (req, res, next) => {
  try {
    const solicitacao = await Solicitacao.findOneAndDelete({ id: req.params.id });
    
    if (!solicitacao) {
      return res.status(404).json({ success: false, message: 'Solicitação não encontrada' });
    }

    // Remover imagem do pet se existir
    if (solicitacao.petImageUrl) {
      const imagePath = path.join(__dirname, '../../', solicitacao.petImageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.json({ success: true, message: 'Solicitação removida com sucesso' });
  } catch (error) {
    next(error);
  }
};

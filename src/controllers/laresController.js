const Lar = require('../models/Lar');
const path = require('path');
const fs = require('fs');

// ✅ Criar lar
exports.createLar = async (req, res, next) => {
  try {
    const imageUrl = req.file ? `/uploads/lares/${req.file.filename}` : null;
    
    const lar = new Lar({
      ...req.body,
      imageUrl,
      availableFor: Array.isArray(req.body.availableFor)
        ? req.body.availableFor
        : req.body.availableFor ? [req.body.availableFor] : []
    });
    
    await lar.save();
    res.status(201).json({ success: true, data: lar });
  } catch (error) {
    next(error);
  }
};

// ✅ Listar todos os lares ATIVOS
exports.getLares = async (req, res, next) => {
  try {
    const lares = await Lar.find({ isActive: true });
    res.json({ success: true, data: lares });
  } catch (error) {
    next(error);
  }
};

// ✅ Buscar lar por ID - CORRIGIDO!
exports.getLarById = async (req, res, next) => {
  try {
    const lar = await Lar.findById(req.params.id); // ✅ CORRIGIDO!
    
    if (!lar) {
      return res.status(404).json({ 
        success: false, 
        message: 'Lar não encontrado' 
      });
    }
    
    res.json({ success: true, data: lar });
  } catch (error) {
    next(error);
  }
};

// ✅ BUSCAR LAR POR EMAIL (para o anfitrião ver seu anúncio)
exports.getLarByEmail = async (req, res, next) => {
  try {
    const lar = await Lar.findOne({ email: req.params.email.toLowerCase() });
    
    if (!lar) {
      return res.status(404).json({ 
        success: false, 
        message: 'Lar não encontrado' 
      });
    }
    
    res.json({ success: true, data: lar });
  } catch (error) {
    next(error);
  }
};

// ✅ ATUALIZAR LAR - CORRIGIDO!
exports.updateLar = async (req, res, next) => {
  try {
    const lar = await Lar.findById(req.params.id); // ✅ CORRIGIDO!
    
    if (!lar) {
      return res.status(404).json({ 
        success: false, 
        message: 'Lar não encontrado' 
      });
    }

    // Se enviou nova imagem, deletar a antiga
    if (req.file && lar.imageUrl) {
      const oldImagePath = path.join(__dirname, '../../', lar.imageUrl);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    const imageUrl = req.file
      ? `/uploads/lares/${req.file.filename}`
      : lar.imageUrl;

    const updatedData = {
      ...req.body,
      imageUrl,
      availableFor: Array.isArray(req.body.availableFor)
        ? req.body.availableFor
        : req.body.availableFor ? [req.body.availableFor] : lar.availableFor,
      updatedAt: Date.now()
    };

    const updatedLar = await Lar.findByIdAndUpdate( // ✅ CORRIGIDO!
      req.params.id,
      updatedData,
      { new: true }
    );

    res.json({ 
      success: true, 
      data: updatedLar, 
      message: 'Lar atualizado com sucesso!' 
    });
  } catch (error) {
    next(error);
  }
};

// ✅ ATIVAR/DESATIVAR LAR - CORRIGIDO!
exports.toggleActiveLar = async (req, res, next) => {
  try {
    const lar = await Lar.findById(req.params.id); // ✅ CORRIGIDO!
    
    if (!lar) {
      return res.status(404).json({ 
        success: false, 
        message: 'Lar não encontrado' 
      });
    }

    lar.isActive = !lar.isActive;
    lar.updatedAt = Date.now();
    await lar.save();

    const status = lar.isActive ? 'ativado' : 'desativado';
    
    res.json({
      success: true,
      data: lar,
      message: `Lar ${status} com sucesso!`
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Deletar lar (permanentemente) - CORRIGIDO!
exports.deleteLar = async (req, res, next) => {
  try {
    const lar = await Lar.findByIdAndDelete(req.params.id); // ✅ CORRIGIDO!
    
    if (!lar) {
      return res.status(404).json({ 
        success: false, 
        message: 'Lar não encontrado' 
      });
    }

    // Remover imagem
    if (lar.imageUrl) {
      const imagePath = path.join(__dirname, '../../', lar.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.json({ 
      success: true, 
      message: 'Lar removido com sucesso' 
    });
  } catch (error) {
    next(error);
  }
};

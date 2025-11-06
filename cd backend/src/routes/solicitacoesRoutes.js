const express = require('express');
const router = express.Router();
const upload = require('../config/multer');
const validateRequest = require('../middlewares/validateRequest');

const {
  createSolicitacao,
  getSolicitacoes,
  getSolicitacoesByEmail,
  getSolicitacoesByLar,
  getSolicitacaoById,
  updateSolicitacao,
  deleteSolicitacao,
  aceitarSolicitacao, // ✅ ADICIONAR
  negarSolicitacao    // ✅ ADICIONAR
} = require('../controllers/solicitacoesController');

// Validações
const solicitacaoValidation = require('../middlewares/validateRequest').solicitacaoValidation;

router.post('/', upload.single('petImage'), solicitacaoValidation, createSolicitacao);
router.get('/', getSolicitacoes);
router.get('/email/:email', getSolicitacoesByEmail);
router.get('/lar/:homeId', getSolicitacoesByLar);
router.get('/:id', getSolicitacaoById);
router.put('/:id', updateSolicitacao);
router.delete('/:id', deleteSolicitacao);

// ✅ ROTAS NOVAS - ADICIONAR ESTAS LINHAS
router.patch('/:id/aceitar', aceitarSolicitacao);
router.patch('/:id/negar', negarSolicitacao);

module.exports = router;

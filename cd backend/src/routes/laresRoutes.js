const express = require('express');
const router = express.Router();
const {
  createLar,
  getLares,
  getLarById,
  getLarByEmail,  // ✅ NOVO
  updateLar,      // ✅ NOVO
  toggleActiveLar, // ✅ NOVO
  deleteLar
} = require('../controllers/laresController');
const upload = require('../config/multer');

router.post('/', upload.single('image'), createLar);
router.get('/', getLares);
router.get('/:id', getLarById);
router.get('/email/:email', getLarByEmail); // ✅ NOVA ROTA
router.put('/:id', upload.single('image'), updateLar); // ✅ NOVA ROTA
router.patch('/:id/toggle-active', toggleActiveLar); // ✅ NOVA ROTA
router.delete('/:id', deleteLar);

module.exports = router;

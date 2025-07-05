const express = require('express');
const router = express.Router();
const { createNote, getNoteById, getAllNotes, deleteNote } = require('../controllers/noteController');

router.get('/', getAllNotes);
router.post('/', createNote);
router.get('/:id', getNoteById);
router.delete('/:id', deleteNote);

module.exports = router;

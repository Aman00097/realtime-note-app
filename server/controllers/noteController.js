const Note = require('../models/note');

const getAllNotes = async (req, res) => {
  const notes = await Note.find().sort({ updatedAt: -1 });
  res.json(notes);
};


const createNote = async (req, res) => {
  const { title } = req.body;
  try {
    const note = new Note({ title });
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ message: 'Error creating note', error: err });
  }
};

const getNoteById = async (req, res) => {
  const { id } = req.params;
  try {
    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ message: 'Note not found' });
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching note', error: err });
  }
};

const deleteNote = async (req, res) => {
  try {
    await Note.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Note deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting note', error: err });
  }
};

module.exports = { getAllNotes, createNote, getNoteById, deleteNote };


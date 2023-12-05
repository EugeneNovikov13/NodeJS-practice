const chalk = require('chalk')
const Note = require('../models/Note')

async function addNote(title, owner) {
    await Note.create({ title, owner })
    console.log(chalk.green.inverse('Note was added!'))
}

async function editNote(data, owner) {
    const result = await Note.updateOne({ _id: data.id, owner }, { title: data.title } )

    if (result.matchedCount === 0) {
        throw new Error('No note to edit')
    }

    console.log(chalk.bgMagenta('Note was edited!'))
}

async function removeNote(id, owner) {
    const result = await Note.deleteOne({ _id: id, owner})

    if (result.matchedCount === 0) {
        throw new Error('No note to delete')
    }

    console.log(chalk.bgCyan('Note was removed!'))
}

async function getNotes() {
    return Note.find();
}

module.exports = {
    addNote, removeNote, getNotes, editNote
}

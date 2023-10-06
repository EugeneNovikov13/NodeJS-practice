const chalk = require('chalk')
const Note = require('./models/Note')

async function addNote(title) {
    await Note.create({ title })
    console.log(chalk.green.inverse('Note was added!'))
}

async function editNote(data) {
    await Note.updateOne({ _id: data.id }, { title: data.title } )
    console.log(chalk.bgMagenta('Note was edited!'))
}

async function removeNote(id) {
    await Note.deleteOne({ _id: id})
    console.log(chalk.bgCyan('Note was removed!'))
}

async function getNotes() {
    return Note.find();
}

module.exports = {
    addNote, removeNote, getNotes, editNote
}

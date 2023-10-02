const fs = require('fs/promises')
const path = require('path')
const chalk = require('chalk')

const notesPath = path.join(__dirname, 'db.json')

async function addNote(title) {
    // const notes = require('./db.json')
    // const buffer = await fs.readFile(notesPath)
    // const notes = Buffer.from(buffer).toString('utf-8')

    // const notes = await fs.readFile(notesPath, {encoding: 'utf-8'})
    const notes = await getNotes()

    const note = {
        title,
        id: Date.now().toString()
    }

    notes.push(note)

    await fs.writeFile(notesPath, JSON.stringify(notes))
    console.log(chalk.green.inverse('Note was added!'))
}

async function removeNote(id) {
    const notes = await getNotes()

    const newNotes = notes.filter(note => note.id !== id)

    await fs.writeFile(notesPath, JSON.stringify(newNotes))

    console.log(chalk.bgCyan('Note was removed!'))
}

async function getNotes() {
    const notes = await fs.readFile(notesPath, {encoding: 'utf-8'})
    return Array.isArray(JSON.parse(notes)) ? JSON.parse(notes) : []
}

async function printNotes() {
    const notes = await getNotes()

    console.log(chalk.bgBlue('Here is the list of notes'))
    notes.forEach((note) => {
        const title = note.title.padEnd(20)
        console.log('Title: ', chalk.blue(title), 'id: ', chalk.blue(note.id))
    })
}

module.exports = {
    addNote, printNotes, removeNote
}

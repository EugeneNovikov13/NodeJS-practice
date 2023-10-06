const yargs = require('yargs')
const pcg = require('./package.json')
const {addNote, editNote, printNotes, removeNote} = require('./notes.controller')

yargs.version(pcg.version)

yargs.command({
    command: 'add',
    describe: 'Add new note to list',
    builder: {
        title: {
            type: 'string',
            describe: 'Note title',
            demandOption: true,
        }
    },
    handler({title}) {
        addNote(title)
    }
})

yargs.command({
    command: 'edit',
    describe: 'Edit note by id',
    builder: {
        title: {
            type: 'string',
            describe: 'New note title',
            demandOption: true,
        },
        id: {
            type: 'string',
            describe: 'Note id',
            demandOption: true,
        }
    },
    handler({title, id}) {
        editNote(title, id)
    }
})

yargs.command({
    command: 'remove',
    describe: 'Remove note by id',
    builder: {
        id: {
            type: 'string',
            describe: 'Note id',
            demandOption: true,
        }
    },
    async handler({id}) {
        await removeNote(id)
    }
})

yargs.command({
    command: 'list',
    describe: 'Print all notes',
    async handler() {
        await printNotes()
    }
})

yargs.parse()
const yargs = require('yargs')
const pcg = require('./package.json')
const {addNote, printNotes, removeNote} = require('./notes.controller')

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
const express = require('express')
const chalk = require('chalk')
const path = require('path')
const {addNote, getNotes, removeNote, editNote} = require('./notes.controller')

const port = 3000
const app = express()

app.set('view engine', 'ejs')
app.set('views', 'pages')

app.use(express.static(path.resolve(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({
    extended: true,
}))

const renderOptions = async (isCreated = false) => ({
    title: 'Express App',
    notes: await getNotes(),
    created: isCreated,
})

const renderHTML = (response, options) => {
    return response.render('index', options)
}

app.get('/', async (req, res) => {
    renderHTML(res, await renderOptions())
})

app.post('/', async (req, res) => {
    await addNote(req.body.title)
    renderHTML(res, await renderOptions(true))
})

app.put('/:id', async (req, res) => {
    const id = req.params.id
    const updatedData = {...req.body, id};
    await editNote(updatedData)
    renderHTML(res, await renderOptions())
})

app.delete('/:id', async (req, res) => {
    const id = req.params.id
    await removeNote(id)
    renderHTML(res, await renderOptions())
})

app.listen(port, () => {
    console.log(chalk.green(`Server has been started on port ${port}`))
})
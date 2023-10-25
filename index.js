const express = require('express')
const chalk = require('chalk')
const path = require('path')
const mongoose = require('mongoose')
const {addNote, getNotes, removeNote, editNote} = require('./notes.controller')

const port = 3000
const app = express()

//указываем каким шаблонизатором мы пользуемся
app.set('view engine', 'ejs')
//задаём папку, где лежит index.ejs. По умолчанию ищет в папке views
app.set('views', 'pages')

//обозначаем папку public как папку для статических файлов
app.use(express.static(path.resolve(__dirname, 'public')))
//Для того, чтобы была возможность отправлять на сервер данные в формате JSON
app.use(express.json())
//позволяет разбирать вложенные объекты в данных, закодированных в URL
app.use(express.urlencoded({
    extended: true,
}))

const renderOptions = async () => ({
    title: 'Express App',
    notes: await getNotes(),
    created: false,
    error: false,
})

const renderHTML = (response, options) => {
    return response.render('index', options)
}

app.get('/', async (req, res) => {
    renderHTML(res, await renderOptions())
})

app.post('/', async (req, res) => {
    try {
        await addNote(req.body.title)
        renderHTML(res, {...await renderOptions(), created: true})
    } catch (e) {
        console.error('Creation error', e)
        renderHTML(res, {...await renderOptions(), error: true})
    }
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

mongoose.connect(
    'mongodb+srv://NovikovEugene:gfhjkm13@educationdb.nioilpj.mongodb.net/notes?retryWrites=true&w=majority'
).then(() => {
    app.listen(port, () => {
        console.log(chalk.green(`Server has been started on port ${port}`))
    })
})


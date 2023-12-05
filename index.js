const express = require('express')
const chalk = require('chalk')
const path = require('path')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const {addNote, getNotes, removeNote, editNote} = require('./controllers/notes.controller')
const {addUser, loginUser} = require('./controllers/user.controller')
const auth = require('./middlewares/auth')

const port = 3000
const app = express()

app.set('view engine', 'ejs')
app.set('views', 'pages')

app.use(express.static(path.resolve(__dirname, 'public')))
app.use(express.json())
//подключается миддлвара куки-парсер для того, чтобы mongoose умел работать с файлами куки
app.use(cookieParser())
app.use(express.urlencoded({
    extended: true,
}))

app.get('/login', async (req, res) => {
    res.render('login', {
        title: 'Express App',
        error: undefined,
    })
})

app.post('/login', async (req, res) => {
    try {
        const token = await loginUser(req.body.email, req.body.password)

        //{httpOnly: true} опция добавлена, чтобы к токену нельзя было получить доступ с помощью JS
        res.cookie('token', token, {httpOnly: true})

        res.redirect('/')
    } catch (e) {
        console.error('Login error', e)
        res.render('login', {
            title: 'Express App',
            error: e.message,
        })
    }
})

app.get('/register', async (req, res) => {
    res.render('register', {
        title: 'Express App',
        error: undefined,
    })
})

app.post('/register', async (req, res) => {
    try {
        await addUser(req.body.email, req.body.password)

        //отправляет обратно переход на другую страницу
        res.redirect('/login')
    } catch (e) {
        console.error('Register error', e)
        if (e.code === 11000) {
            res.render('register', {
                title: 'Express App',
                error: 'Email is already registered',
            })
            return
        }
        res.render('register', {
            title: 'Express App',
            error: e.message,
        })
    }
})

app.get('/logout', (req, res) => {
    //{httpOnly: true} опция добавлена, чтобы к токену нельзя было получить доступ с помощью JS
    res.cookie('token', '', {httpOnly: true})

    res.redirect('/login')
})

//подключаем миддлвар аутентификации в месте, после которого все запросы будут доступны только зарегистрированным пользователям
//после этой миддлвары в req.user всегда будут данные о пользователе, так как в противном случае пользователь перенаправится на страницу login
app.use(auth)

const renderOptions = async (req) => ({
    title: 'Express App',
    notes: await getNotes(),
    //добавили в опции строчку поле с email пользователя
    userEmail: req.user.email,
    created: false,
    error: false,
})
const renderHTML = (response, options) => {
    return response.render('index', options)
}

app.get('/', async (req, res) => {
    renderHTML(res, await renderOptions(req))
})

app.post('/', async (req, res) => {
    try {
        //req.user.email  здесь существует благодаря миддлваре
        await addNote(req.body.title, req.user.email)
        renderHTML(res, {...await renderOptions(req), created: true})
    } catch (e) {
        console.error('Creation error', e)
        renderHTML(res, {...await renderOptions(req), error: true})
    }
})

app.put('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const updatedData = {...req.body, id};
        await editNote(updatedData, req.user.email)
        renderHTML(res, await renderOptions(req))
    } catch (e) {
        //без изменений в app.js эта строчка не работает в браузере
        renderHTML(res, {...await renderOptions(req), error: true})
    }
})

app.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id
        await removeNote(id, req.user.email)
        renderHTML(res, await renderOptions(req))
    } catch (e) {
        renderHTML(res, {...await renderOptions(req), error: true})
    }
})

mongoose.connect(
    'mongodb+srv://NovikovEugene:gfhjkm13@educationdb.nioilpj.mongodb.net/notes?retryWrites=true&w=majority'
).then(() => {
    app.listen(port, () => {
        console.log(chalk.green(`Server has been started on port ${port}`))
    })
})


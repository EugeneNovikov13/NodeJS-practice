const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require("../constants");


async function addUser(email, password) {
    //пароль шифруется с помощью bcrypt
    //в hash передаётся сам пароль, а следом либо "соль"(некая комбинация в какой-то части пароля), либо количество раундов создания "соли"
    //чем больше раундов создания, тем дольше сервер обрабатывает запросы. 10 в самый раз.
    const passwordHash = await bcrypt.hash(password, 10)

    await User.create( {email, password: passwordHash} )
}

async function loginUser(email, password) {
    const user = await User.findOne({email})

    if (!user) {
        throw new Error('User not found')
    }

    //встроенная функция compare у bcrypt сравнивает хэш пароля с полученным паролем
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
        throw new Error('Wrong password')
    }

    //мы должны вернуть на фронт некий токен, чтобы получая его система знала, что данный пользователь залогинен
    //для этого используется jsonwebtoken и передача токена через куки (куки передаются в заголовках запроса)
    //в этой строке вызывается метод sign, который шифрует email или что-то другое, указанное в объекте
    //далее мы передаём секрет (в данном случае тестовый вариант), а также опции, среди которых наиболее полезная
    //expiresIn, которая указывает срок действия токена
    return jwt.sign({ email }, JWT_SECRET, {expiresIn: '30d'})
}

module.exports = {
    addUser,
    loginUser,
}

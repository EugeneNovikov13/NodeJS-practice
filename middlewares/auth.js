//функция проверяет jwt токен, полученный в куках в заголовке запроса
const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require("../constants");

function auth(req, res, next) {
    const token = req.cookies.token;

    try {
        //метод verify проверяет токен на валидность, для этого в него передаются сам токен и секрет
        const verifyResult = jwt.verify(token, JWT_SECRET);

        //добавляем в объект req запроса поле user с его свойствами (в данном случае только email)
        //это нужно чтобы настроить работу с ролями
        req.user = {
            email: verifyResult.email,
        }

        next();
    } catch (e) {
        res.redirect('/login')
    }
}

module.exports = auth;
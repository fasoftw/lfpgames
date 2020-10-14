module.exports = app => {
    app.route('/')
        .get(app.api.testeValidations.get)
}
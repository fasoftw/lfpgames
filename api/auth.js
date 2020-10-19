const { authSecret } = require('../.env')
// const authSecret = require('../.env')
//As duas partes do código são equivalentes, 
// mas a primeira está usando a designação de desestruturação ES6 para ser mais curta.

const jwt = require('jwt-simple') // GERA O TOKEN, QUNADO ELE É EXPIRADO, USUARIO PRECISA LOGAR NOVAMENTE.
const bcrypt = require('bcrypt-nodejs')  // Para comprar as senhas do banco e usada no login.


module.exports = app => {
    const signIn = async (req, res) => {
        console.log('oi')
        if( !req.body.email || !req.body.password ){
            return res.status(400).send('Informe usuário ou senha!')
        }

        const user = await app.db('users')
            .where({ email: req.body.email })
            .first()
        
        if( !user ) return res.status(400).send('USUÁRIO NÃO ENCONTRADO!')

        //Se eu utilizar função de igualdade para comparar a hash da senha digitada
        // com a hash da senha salva no db, vai da erro.
        // pq as hash de uma mesma senha muda com o tempo;
        //Assim, para fazer comparação vamos usar a função do bcrypt
        // compareSync ('SENHA DIGITADA', 'SENHADOBANCO')
        const isMatch = bcrypt.compareSync(req.body.password, user.password)

        
        //Se email ou senha não deram match:
        if (!isMatch) return res.status(401).send('Senha inválidos!')

        //Se der match => gerar o token com válidade.

        //date.now() => Gera milisec. desde 1970
        //date.now()/1000 => Gera sec. desde 1970
        // E essa data vou dizer em que momento foi criado meu token,
        //e aplicar em cima desse valor a validade desse token.

        const now = Math.floor(Date.now() / 1000)

        // Conteúdo do meu token.
        // Fica salvo nos localstorage do browser.
        //Posso renovar o token sempre que o usuario entrar no sistema.
        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            admin: user.admin,
            iat: now, //iat (data que token foi emitido) => sigla em inglês => 'Issued at time'.
            exp: now + (60 * 60 * 24) // Data de expiração => Quando token expirar, a aplicação vai deslogar o usuario.
                                      // now (+ 60 [seg] * 60 [min]) => Token dura uma hora.
                                      // now (+ 60 [seg] * 60 [min] * 24[Horas]) => Token dura um dia.
        }

        // Responde ao usuario o token, utilizado o payload e o authSecret
        // Lá no front end, é recebido um cabeçalho a mais, o AUTORIZATION
        // esse token é armazenado no localstorage,
        // e cada nova requisição do frontend
        // um token deve fazer parte da requisição,
        // para dizer ao backend que o usuario tem autorização aos serviços.

        res.json({
            ...payload,
            token: jwt.encode(payload, authSecret)
        })

    }

    //Ver se o token expirou
    const validateToken = async ( req, res ) => {
        const userData = req.body || null
        try{
            if(userDate){
                const token = jwt.decode(userData.token, authSecret)
                if( new Date( token.exp * 1000 ) > new date()){
                    return res.send(true) // Ao inves de mandar o true, voce poderia mandar um token novo para usuario.
                }
            }
        } catch(e){
            //problema com token.
            
        }

        res.send(false)
    }

    return { signIn, validateToken }
}
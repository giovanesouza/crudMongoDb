// RESPONSÁVEL EM SUBIR A APLICAÇÃO
const express = require('express')
const app = express()


// INDICA QUEM VAI RENDERIZAR  AS PÁGINAS (npm install ejs -save)
app.set('view engine', 'ejs')


// ==== CONFIGURAÇÃO  PARA O CRUD  - INSTALAÇÃO DE MODULOS

// BODY-PARSE (MÓDULO): PEGA OS DADOS PASSADOS PELO FORMULÁRIO -> BACK-END -> BD (npm install body-parser -save)
const bodyParser = require('body-parser')
const { ObjectID } = require('bson')
app.use(bodyParser.urlencoded({extended:true}))


// MONGO (npm install mongodb -save)
const MongoClient = require('mongodb').MongoClient
const ObjectId = require('mongodb').ObjectID
const caminho = "mongodb://localhost/escola"

MongoClient.connect(caminho,{useNewUrlParser: true, useUnifiedTopology: true},(err, client) => {

db = client.db('escola') // Busncando no sevidor MongoDB o banco Escola

})   



// === ROTAS

// ROTA INICIAL (INDEX)
app.get('/',(req,res)=>{
    res.render('index.ejs')
})


// ROTA PARA INSERIR OS DOCUMENTOS NO MONGO (tem que ser do tipo POST = INSERE)
app.post('/show', (req, res) => {

    db.collection('data').insertOne(req.body, (err, result) => {  
        res.redirect('/show')
    })

})



// ROTA PARA ATUALIZAR
app.route('/edit/:id')
.get((req, res) => {
    var id = req.params.id

    db.collection('data').find(ObjectId(id)).toArray((err, result) => {
        if(err) return res.send(err)
        res.render('edit.ejs', {data: result})
    })
})

.post((req, res) => {
    var id = req.params.id
    var name = req.body.name
    var surname = req.body.surname

    db.collection('data').updateOne({_id: ObjectId(id)}, {
        $set: {
            name: name,
            surname: surname
        }
    }, (err, result) => {
        if (err) return res.send(err)
        res.redirect('/show')
        console.log('Atualizado no banco de dados!')
    })
})




// ROTA PARA RENDERIZAR OS REGISTROS
// SHOW do com MÉTODO GET = PEGA: Vai no banco, na collection selecionada e converte em array - salva em results.
app.get('/show', (req, res) => {
    db.collection('data').find().toArray((err, results) => {
        res.render('show.ejs', { data: results })
    })
})




// ROTA PARA EXCLUIR
app.route('/delete/:id')
.get((req, res) => {
  var id = req.params.id
  db.collection('data').deleteOne({_id: ObjectId(id)}, (err, result) => {
    if (err) return res.send(500, err)
    console.log('Deletado do Banco de Dados!')
    res.redirect('/show')

  })

})



// === SERVIDOR

app.listen(3000,function() {

    console.log('Server rodando na porta 3000')

})
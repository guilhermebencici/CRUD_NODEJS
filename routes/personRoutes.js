const router = require('express').Router()

const Person = require('../models/Person')


// CREATE = CRIAÇÃO DE DADOS
router.post('/', async (req, res) => {

    // OBJECT DESTRUCTURING -> extraio propriedades de um objeto e atribuo a variavel   
    const { name, salary, approved } = req.body

    if (!name) {
        res.status(422).json({ error: "O nome é obrigatório!" })
        return
    }

    const person = {
        name,
        salary,
        approved,
    }

    try {
        // criando dados
        await Person.create(person)

        res.status(201).json({ message: 'Pessoa inserida no sistema com sucesso!' })

    } catch (error) {
        res.status(500).json({ error: error })
    }

})

// READ - LEITURA DE DADOS

router.get('/', async (req, res) => {

    try {

        const people = await Person.find() // método FIND garante o retorno de todos os dados!

        res.status(200).json(people)

    } catch (error) {
        res.status(500).json({ error: error })
    }
})

// ROTA DINÂMICA
router.get('/:id', async (req, res) => {

    //extraindo o dado da requisição pela url = req.params
    const id = req.params.id
    try {
        const person = await Person.findOne({ _id: id }) // quero encontrar o usuario que tenha o _id(MongoDB) = id(req)

        if (!person) {
            res.status(404).json({ message: "O usuário não foi encontrado!" })
            return
        }

        res.status(200).json(person)
    } catch (error) {
        res.status(500).json({ error: error })
    }
})

// UPDATE - atualização de dados (PUT, PATCH)
// PUT -> epsera que mandemos o objeto completo pra ter atualização no sitema
// PATCH -> não espera o objeto completo

router.patch('/:id', async (req, res) => {

    const id = req.params.id // ur trazendo qual usuario vai sofrer o update

    const { name, salary, approved } = req.body // corpo trazendo os dados que precisam ser atualizados

    const person = {
        name,
        salary,
        approved,
    }

    try {
        const updatedPerson = await Person.updateOne({ _id: id }, person)

        if (!updatedPerson.matchedCount === 0) {
            res.status(422).json({ message: 'O usuário não foi encontrado' })
            return
        }

        res.status(200).json(person)

    } catch (error) {
        res.status(500).json({ error: error })
    }

})

//DELETE - deletando dados

router.delete('/:id', async (req, res) => {

    const id = req.params.id

    const person = await Person.findOne({ _id: id }) // quero encontrar o usuario que tenha o _id(MongoDB) = id(req)

    if (!person) {
        res.status(422).json({ message: "O usuário não foi encontrado!" })
        return
    }

    try {
        
        await Person.deleteOne({_id: id})

        res.status(200).json({message: 'O usuário foi deletado com sucesso!'})

    } catch (error) {
        res.status(500).json({ error: error })
    }

})

module.exports = router
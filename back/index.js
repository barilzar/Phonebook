const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app  = express()

require('dotenv').config()
const Contact = require("./models/contact")

app.use(express.json())
app.use(express.static('build'))
app.use(cors())

morgan.token('data', function(req, res) {
  const body = req.body
  
  const p = {
    name: body.name,
    number: body.number,
  }

	return JSON.stringify(p);
});

app.use(morgan(":method :url :status :response-time :data"));

app.get('/info', (req, res) => {
  let d = new Date()

  Contact.find({}).then(contacts => {
    res.send(`${contacts.length} persons in the book.<br />${d.toString()}`)
  })

})

app.get("/api/persons", (req, res) => {

  Contact.find({}).then(contacts => {
    res.json(contacts)
  })
    
})

app.get("/api/persons/:id", (req, res) => {

    Contact.findById(req.params.id).then(c =>
      res.json(c.toJSON()))

})

app.delete("/api/persons/:id", (req, res) => {
    Contact.findByIdAndDelete(req.params.id)

    res.status(204).end()
})

app.post("/api/persons", (req, res) => {
    const body = req.body
    
    if (!body.name || !body.number) {
        return res.status(400).json({ 
          error: 'Name or number missing' 
        })
    }

    const c = new Contact({
      name: body.name,
      number: body.number,
    })

    c.save().then(sc => {
      res.json(sc.toJSON())
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)
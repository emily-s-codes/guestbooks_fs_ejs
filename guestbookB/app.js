import express from "express"
import fs from 'fs'
import { body, validationResult } from "express-validator"

const PORT = 9899
const app = express()

let backup = []
fs.readFile('./data.json', (err, data) => {
    if (err) return console.log(err)
    backup = JSON.parse(data)
})

app.set("view engine", "ejs")
app.use(express.static("./public"))
app.use(express.urlencoded({ extended: true }))

app.get("/", (_, res) => {
    res.render("index", { backup, errors: null })
})

app.post("/guestbookB",
    body('firstName').isLength({ min: 1, max: 50 }),
    body('lastName').isLength({ min: 1, max: 50 }),
    body('emailAddress').isEmail(),
    body('message').notEmpty(),
    (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.render("index", { backup, errors })
        }

        let newContact = { first: req.body.firstName, last: req.body.lastName, email: req.body.emailAddress, message: req.body.message }
        backup.push(newContact)

        fs.writeFile('./data.json', JSON.stringify(backup), (err) => {
            if (err) return console.log(err)
        })

        res.render("index", { backup, errors: null })
        console.log(errors)
    })

app.listen(PORT, () => console.log("PORT", PORT))
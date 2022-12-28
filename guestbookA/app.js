import express from "express"
import { body, validationResult } from "express-validator"

const PORT = 9898
const app = express()

const contacts = []

app.set("view engine", "ejs")
app.use(express.static("./public"))
app.use(express.urlencoded({ extended: true }))

app.get("/", (_, res) => {
    res.render("index", { contacts, errors: null })
})


app.post("/guestbookA",
    body('firstName').isLength({ min: 1, max: 50 }),
    body('lastName').isLength({ min: 1, max: 50 }),
    body('emailAddress').isEmail(),
    body('message').notEmpty(),
    (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.render("index", { contacts })
        }

        contacts.push({ first: req.body.firstName, last: req.body.lastName, email: req.body.emailAddress, message: req.body.message })

        res.render("index", { contacts, errors: null })
        console.log(errors)
    })

app.listen(PORT, () => console.log("PORT", PORT))
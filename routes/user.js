const express = require('express')
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const router = express.Router()

const User = require('../model/User')
const auth = require('../middleware/auth')

router.post(
    '/signup',
    [
        check('username', 'Please enter a valid username' )
        .not()
        .isEmpty(),
        
        check('password', 'Please enter a valid password')
        .isLength({ min:6 })
    ],
    async (req, res) => {
        const errors = validationResult(req)
        
        if(!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array()
            })
        }

        const { username, password } = req.body

        try {
            let user = await User.findOne({
                username
            })

            if (user) {
                return res.status(400).json({
                    msg: 'User already registered. Please Login.'
                })
            }

            user = new User({
                username,
                password
            })

            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(password, salt)

            await user.save()

            // Login

            const payload = {
                user: {
                    id: user.id
                }
            }

            jwt.sign(
                payload,
                'secret', {
                    expiresIn: 10000
                },
                (err, token) => {
                    if (err) throw err
                    res.status(200).json({token})
                }
            )
        } catch (e) {
            console.log(e.message)
            res.status(500).send('Error while saving new user.')
        }
    }
)

router.post(
    '/login',
    [
        check('username', 'Please enter a valid username')
        .not()
        .isEmpty(),

        check('password', 'Please enter a valid password')
        .isLength({ min:6 })
    ],
    async (req, res) => {
        const errors = validationResult(req)

        if(!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array()
            })
        }

        const { username, password } = req.body
        try {
            let user = await User.findOne({
                username
            })

            if(!user) {
                return res.status(400).json({
                    message: 'User does not exist.'
                })
            }

            const isMatch = await bcrypt.compare(password, user.password)

            if(!isMatch) {
                return res.status(400).json({
                    message: 'Wrong password.'
                })
            }

            const payload = {
                user: {
                    id: user.id
                }
            }

            jwt.sign(
                payload,
                'secret',
                {
                    expiresIn: 3600
                },
                (err, token) => {
                    if (err) throw err
                    res.status(200).json({
                        token
                    })
                }
            )

        } catch (e) {
            res.status(500).json({
                message: 'Server error.'
            })
        }
    }
)

router.get('/info', auth, async (req,res) => {
    try {
        const user = await User.findById(req.user.id)
        res.json(user)
    } catch (e) {
        res.send({ message: 'Error while fetching user details.'})
    }
})

module.exports = router
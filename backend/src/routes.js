import express from 'express'
import Category from './models/Category.js'

const router = express.Router()

router.post('/', async (req, res) => {
  try {
    const { name } = req.body
    const category = new Category({ name })
    await category.save()
    res.status(201).json(category)
  } catch (error) {
    res.status(500).json({ message: 'Error al guardar categoría' })
  }
})

export default router
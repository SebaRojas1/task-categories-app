import express from 'express'
import Category from './models/Category.js'

const router = express.Router()

router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 })
    res.json(categories)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las categorías' })
  }
})

router.get('/categories/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
    if (!category) return res.status(404).json({ message: 'Categoría no encontrada' })
    res.json(category)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la categoría' })
  }
})

router.put('/categories/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    )
    if (!category) return res.status(404).json({ message: 'Categoría no encontrada' })
    res.json(category)
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la categoría' })
  }
})

router.delete('/categories/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id)
    if (!category) return res.status(404).json({ message: 'Categoría no encontrada' })
    res.json({ message: 'Categoría eliminada correctamente' })
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la categoría' })
  }
})

export default router
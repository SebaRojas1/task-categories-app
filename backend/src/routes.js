import express from 'express'
import Category from './models/Category.js'
import Task from './models/Task.js'

const router = express.Router()

//////// categories ///////////
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

router.post('/categories', async (req, res) => {
  try {
    const { name } = req.body
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'El nombre es requerido' })
    }

    const newCategory = new Category({ name })
    const savedCategory = await newCategory.save()
    res.status(201).json(savedCategory)
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la categoría' })
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

//////// tasks ///////////
router.post('/categories/:categoryId/tasks', async (req, res) => {
  try {
    const { name } = req.body
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'El nombre de la tarea es requerido' })
    }

    const category = await Category.findById(req.params.categoryId)
    if (!category) return res.status(404).json({ message: 'Categoría no encontrada' })

    const task = await Task.create({ name, category: category._id })
    res.status(201).json(task)
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la tarea' })
  }
})

router.get('/categories/:categoryId/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({ category: req.params.categoryId })
    res.json(tasks)
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las tareas' })
  }
})

router.put('/tasks/:taskId', async (req, res) => {
  try {
    const { name, completed } = req.body
    const task = await Task.findById(req.params.taskId)
    if (!task) return res.status(404).json({ message: 'Tarea no encontrada' })

    if (name !== undefined) task.name = name
    if (completed !== undefined) task.completed = completed

    await task.save()
    res.json(task)
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la tarea' })
  }
})

router.delete('/tasks/:taskId', async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId)
    if (!task) return res.status(404).json({ message: 'Tarea no encontrada' })

    await task.remove()
    res.json({ message: 'Tarea eliminada correctamente' })
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la tarea' })
  }
})

router.patch('/tasks/:taskId/complete', async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId)
    if (!task) return res.status(404).json({ message: 'Tarea no encontrada' })

    task.completed = true
    await task.save()

    res.json({ message: 'Tarea marcada como completada', task })
  } catch (error) {
    res.status(500).json({ message: 'Error al marcar la tarea como completada' })
  }
})
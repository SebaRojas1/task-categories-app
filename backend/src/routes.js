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
    
    // También eliminar todas las tareas asociadas a esta categoría
    await Task.deleteMany({ category: req.params.id })
    
    res.json({ message: 'Categoría eliminada correctamente' })
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la categoría' })
  }
})

//////// tasks ///////////
router.post('/categories/:categoryId/tasks', async (req, res) => {
  try {
    const { name } = req.body
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'El nombre de la tarea es requerido' })
    }

    const category = await Category.findById(req.params.categoryId)
    if (!category) return res.status(404).json({ message: 'Categoría no encontrada' })

    const task = new Task({ 
      name, 
      category: category._id 
    })
    
    const savedTask = await task.save()
    
    // Actualizar la categoría para incluir esta tarea
    category.tasks.push(savedTask._id)
    await category.save()
    
    res.status(201).json(savedTask)
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
    const updates = {}
    if (req.body.name !== undefined) updates.name = req.body.name
    if (req.body.completed !== undefined) updates.completed = req.body.completed
    
    const task = await Task.findByIdAndUpdate(
      req.params.taskId,
      updates,
      { new: true }
    )
    
    if (!task) return res.status(404).json({ message: 'Tarea no encontrada' })
    
    res.json(task)
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la tarea' })
  }
})

router.delete('/tasks/:taskId', async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId)
    if (!task) return res.status(404).json({ message: 'Tarea no encontrada' })

    // Eliminar la tarea
    await Task.findByIdAndDelete(req.params.taskId)
    
    // Actualizar la categoría para eliminar la referencia a esta tarea
    await Category.findByIdAndUpdate(
      task.category,
      { $pull: { tasks: task._id } }
    )
    
    res.json({ message: 'Tarea eliminada correctamente' })
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la tarea' })
  }
})

router.patch('/tasks/:taskId/complete', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.taskId,
      { completed: true },
      { new: true }
    )
    
    if (!task) return res.status(404).json({ message: 'Tarea no encontrada' })

    res.json({ message: 'Tarea marcada como completada', task })
  } catch (error) {
    res.status(500).json({ message: 'Error al marcar la tarea como completada' })
  }
})

export default router
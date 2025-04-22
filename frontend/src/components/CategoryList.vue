<template>
  <div class="bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto mt-8">
    <h2 class="text-2xl font-semibold text-center text-gray-800 mb-6">Categorías</h2>

    <div v-if="editingCategory" class="mb-6">
      <h3 class="text-lg font-semibold mb-2 text-center">Editar Categoría</h3>
      <input
        v-model="editingCategory.name"
        type="text"
        class="w-full border border-gray-300 p-2 rounded mb-2"
      />
      <div class="flex justify-end gap-2">
        <button
          @click="handleUpdate"
          class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Guardar
        </button>
        <button
          @click="cancelEdit"
          class="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Cancelar
        </button>
      </div>
    </div>

    <ul v-if="categories.length">
      <li
        v-for="category in categories"
        :key="category._id"
        class="flex justify-between items-center p-4 mb-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition duration-200"
      >
        <span class="text-lg text-gray-700">{{ category.name }}</span>

        <div class="flex gap-2">
          <button
            @click="startEditing(category)"
            class="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600 transition"
          >
            Editar
          </button>
          <button
            @click="handleDelete(category._id)"
            class="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition"
          >
            Eliminar
          </button>
        </div>
      </li>
    </ul>

    <p v-else class="text-center text-gray-500">No hay categorías aún.</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axiosClient from '@/lib/helpers/axiosClient'

// Recibe las categorías como props
defineProps({
  categories: {
    type: Array,
    default: () => [],
  },
})

// Define los eventos que el componente puede emitir
const emit = defineEmits(['category-deleted', 'category-updated'])

const editingCategory = ref(null)

const startEditing = (category) => {
  editingCategory.value = { ...category } // Copia para editar sin afectar la original
}

const cancelEdit = () => {
  editingCategory.value = null
}

const handleUpdate = async () => {
  if (!editingCategory.value.name.trim()) return

  try {
    const response = await axiosClient.put(`/categories/${editingCategory.value._id}`, {
      name: editingCategory.value.name,
    })
    editingCategory.value = null
    emit('category-updated', response.data) // Emite el evento con la categoría actualizada
    alert('Categoría actualizada correctamente')
  } catch (error) {
    console.error('Error al actualizar categoría:', error)
    alert('Error al actualizar categoría')
  }
}

const handleDelete = async (id) => {
  const confirmDelete = confirm('¿Estás seguro de que deseas eliminar esta categoría?')
  if (!confirmDelete) return

  try {
    await axiosClient.delete(`/categories/${id}`)
    emit('category-deleted') // Emite el evento al eliminar
    alert('Categoría eliminada correctamente')
  } catch (error) {
    console.error('Error al eliminar categoría:', error)
    alert('Error al eliminar la categoría')
  }
}
</script>
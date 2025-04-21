<template>
  <div class="bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto mt-8">
    <h2 class="text-2xl font-semibold text-center text-gray-800 mb-6">Categorías</h2>
    
    <ul v-if="categories.length">
      <li
        v-for="category in categories"
        :key="category._id"
        class="flex justify-between items-center p-4 mb-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition duration-200"
      >
        <span class="text-lg text-gray-700">{{ category.name }}</span>
        <button
          @click="handleDelete(category._id)"
          class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-200"
        >
          Eliminar
        </button>
      </li>
    </ul>

    <p v-else class="text-center text-gray-500">No hay categorías aún.</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axiosClient from '@/lib/helpers/axiosClient'

const categories = ref([])

const fetchCategories = async () => {
  try {
    const response = await axiosClient.get('/categories')
    categories.value = response.data
  } catch (error) {
    console.error('Error al obtener categorías:', error)
  }
}

onMounted(fetchCategories)

const handleDelete = async (id) => {
  const confirmDelete = confirm('¿Estás seguro de que deseas eliminar esta categoría?')
  if (!confirmDelete) return

  try {
    await axiosClient.delete(`/categories/${id}`)
    categories.value = categories.value.filter(category => category._id !== id)
    alert('Categoría eliminada correctamente')
  } catch (error) {
    console.error('Error al eliminar categoría:', error)
    alert('Error al eliminar la categoría')
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="bg-white p-8 rounded-lg shadow-xl max-w-md mx-auto mt-8">
    <h2 class="text-2xl font-semibold text-gray-800 mb-6 text-center">Agregar Categoría</h2>
    <h2 c></h2>
    <div class="mb-4">
      <label for="category-name" class="block text-gray-700 text-sm font-medium mb-2">Nombre de la categoría</label>
      <input
        id="category-name"
        v-model="name"
        type="text"
        placeholder="Ingresa el nombre de la categoría"
        class="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
      />
    </div>

    <button
      type="submit"
      class="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
    >
      Agregar Categoría
    </button>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import axiosClient from '@/lib/helpers/axiosClient'

const name = ref('')
const emit = defineEmits(['category-added'])

const handleSubmit = async () => {
  if (!name.value.trim()) return

  try {
    await axiosClient.post('/categories', { name: name.value })
    name.value = ''
    emit('category-added')
    alert('Categoría agregada correctamente')
  } catch (error) {
    console.error(error)
    alert('Error al agregar categoría')
  }
}
</script>
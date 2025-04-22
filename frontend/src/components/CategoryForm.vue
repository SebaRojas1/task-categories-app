<template>
  <div class="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto mb-8">
    <h2 class="text-2xl font-semibold text-gray-800 mb-4 text-center">Agregar Categoría</h2>
    
    <form @submit.prevent="handleSubmit" class="flex">
      <input
        id="category-name"
        v-model="name"
        type="text"
        placeholder="Nombre de la categoría"
        class="flex-grow border border-gray-300 p-3 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
      />
      <button
        type="submit"
        class="bg-blue-600 text-white px-6 py-3 rounded-r-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
      >
        Agregar
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axiosClient from '@/lib/helpers/axiosClient'

const name = ref('')
const emit = defineEmits(['category-added'])

const handleSubmit = async () => {
  if (!name.value.trim()) return
  
  try {
    const response = await axiosClient.post('/categories', { name: name.value })
    name.value = ''
    emit('category-added', response.data)
    
    const notification = document.createElement('div')
    notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg transition-opacity duration-300'
    notification.textContent = 'Categoría agregada correctamente'
    document.body.appendChild(notification)
    
    setTimeout(() => {
      notification.style.opacity = '0'
      setTimeout(() => document.body.removeChild(notification), 300)
    }, 2000)
  } catch (error) {
    console.error(error)
    
    const notification = document.createElement('div')
    notification.className = 'fixed top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg transition-opacity duration-300'
    notification.textContent = 'Error al agregar categoría'
    document.body.appendChild(notification)
    
    setTimeout(() => {
      notification.style.opacity = '0'
      setTimeout(() => document.body.removeChild(notification), 300)
    }, 2000)
  }
}
</script>
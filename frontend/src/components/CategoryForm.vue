<template>
    <form @submit.prevent="handleSubmit" class="bg-white p-4 rounded shadow max-w-md mx-auto">
      <h2 class="text-lg font-bold mb-2">Agregar Categoría</h2>
      <input
        v-model="name"
        type="text"
        placeholder="Nombre de la categoría"
        class="w-full border border-gray-300 p-2 rounded mb-2"
      />
      <button
        type="submit"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Agregar
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
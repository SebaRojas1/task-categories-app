<template>
    <div class="bg-white p-4 rounded shadow max-w-md mx-auto mt-4">
      <h2 class="text-lg font-bold mb-2">Categorías</h2>
      <ul v-if="categories.length">
        <li
          v-for="category in categories"
          :key="category._id"
          class="border-b border-gray-200 py-2"
        >
          {{ category.name }}
        </li>
      </ul>
      <p v-else class="text-gray-500">No hay categorías aún.</p>
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
  </script>
<template>
  <div class="p-4">
    <CategoryForm @category-added="fetchCategories" />
    <CategoryList
      :categories="categories"
      @category-deleted="fetchCategories"
      @category-updated="fetchCategories"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axiosClient from '@/lib/helpers/axiosClient'
import CategoryForm from '@/components/CategoryForm.vue'
import CategoryList from '@/components/CategoryList.vue'

const categories = ref([])

const fetchCategories = async () => {
  try {
    const response = await axiosClient.get('/categories')
    categories.value = response.data
    console.log('Categorías actualizadas:', categories.value)
  } catch (error) {
    console.error('Error al obtener categorías:', error)
  }
}

onMounted(fetchCategories)
</script>
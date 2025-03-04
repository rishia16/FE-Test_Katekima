import { defineStore } from 'pinia';
import axios from 'axios';
import type { Product } from '../types/Product.ts';
import type { ComputedRef } from 'vue'

interface ProductState {
  loading: boolean;
  product: Product | null;
  addSuccess: boolean;
}

export const useProductStore = defineStore('product', {
  state: (): ProductState => ({
    loading: false,
    product: null,
    addSuccess: false,
  }),

  actions: {
    async addProduct(product: Product) {
      this.loading = true
      this.addSuccess = false

      try {
        const response = await axios.post<Product>('https://fakestoreapi.com/products', product)
        this.product = response.data
        this.addSuccess = true
        return true
      } catch (error) {
        console.error('Error adding product:', error)
        return false
      } finally {
        this.loading = false
      }
    },

    async fetchProduct(id: ComputedRef<number | string | undefined>) {
      this.loading = true

      try {
        const response = await axios.get<Product>(`https://fakestoreapi.com/products${id}`)
        this.product = response.data
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        this.loading = false
      }
    },

    async updateProduct(id: number, product: Product) {
      this.loading = true
      this.addSuccess = false

      try {
        const response = await axios.put<Product>(
          `https://fakestoreapi.com/products${id}`,
          product,
        )
        this.product = response.data
        this.addSuccess = true
        return true
      } catch (error) {
        console.error('Error updating product:', error)
        return false
      } finally {
        this.loading = false
      }
    },

    resetProduct() {
      this.product = null
      this.addSuccess = false
    },
  },
})

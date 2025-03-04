import { defineStore } from 'pinia';
import axios from 'axios';
import type { Berry, BerryResponse } from '../types/Berry.ts';

interface BerryState {
  berries: Array<{name: string, url: string}>;
  totalBerries: number;
  currentPage: number;
  itemsPerPage: number;
  searchQuery: string;
  loading: boolean;
  berryDetails: Map<string, Berry>;
  selectedBerry: Berry | null;
}

export const useBerryStore = defineStore('berry', {
  state: (): BerryState => ({
    berries: [],
    totalBerries: 0,
    currentPage: 1,
    itemsPerPage: 10,
    searchQuery: '',
    loading: false,
    berryDetails: new Map(),
    selectedBerry: null,
  }),

  getters: {
    filteredBerries(): Array<{name: string, url: string}> {
      if (!this.searchQuery) return this.berries;
      return this.berries.filter(berry =>
        berry.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },

    sortedBerries(): Array<{name: string, url: string}> {
      return [...this.filteredBerries].sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    },

    paginatedBerries(): Array<{name: string, url: string}> {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.sortedBerries.slice(startIndex, endIndex);
    },

    totalPages(): number {
      return Math.ceil(this.filteredBerries.length / this.itemsPerPage);
    }
  },

  actions: {
    async fetchBerries() {
      this.loading = true;
      try {
        const response = await axios.get<BerryResponse>('https://pokeapi.co/api/v2/berry/');
        this.berries = response.data.results;
        this.totalBerries = response.data.count;
      } catch (error) {
        console.error('Error fetching berries:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchBerryDetails(name: string) {
      if (this.berryDetails.has(name)) {
        this.selectedBerry = this.berryDetails.get(name) || null;
        return;
      }

      this.loading = true;
      try {
        const response = await axios.get<Berry>(`https://pokeapi.co/api/v2/berry/${name}`);
        this.berryDetails.set(name, response.data);
        this.selectedBerry = response.data;
      } catch (error) {
        console.error('Error fetching berry details:', error);
      } finally {
        this.loading = false;
      }
    },

    setPage(page: number) {
      this.currentPage = page;
    },

    setItemsPerPage(items: number) {
      this.itemsPerPage = items;
      this.currentPage = 1; // Reset to first page when changing items per page
    },

    setSearchQuery(query: string) {
      this.searchQuery = query;
      this.currentPage = 1; // Reset to first page when searching
    },

    deleteBerry(name: string) {
      this.berries = this.berries.filter(berry => berry.name !== name);
      if (this.berryDetails.has(name)) {
        this.berryDetails.delete(name);
      }
    }
  }
});

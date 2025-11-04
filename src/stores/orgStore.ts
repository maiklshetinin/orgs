import { defineStore } from 'pinia'
import type { Organization } from '@/types/organization'

export const useOrgsStore = defineStore('orgs', {
  state: () => ({
    organizations: [
      {
        id: '1',
        name: 'ООО "Вектор"',
        director: 'Иванов И.И.',
        phone: '+7 000 123 45 67',
        address: { city: 'Москва', street: 'Ленина', house: '1' },
      },
      {
        id: '2',
        name: 'ИП Сидоров С.С.',
        director: 'Сидоров С.С.',
        phone: '+7 000 56 78 99',
        address: { city: 'Санкт-Петербург', street: 'Невский', house: '2' },
      },
    ] as Organization[],
    isModalOpen: false,
    search: '',
    sortKey: null as 'name' | 'director' | null,
    sortDir: 'asc' as 'asc' | 'desc',
  }),

  getters: {
    filteredOrgs(state): Organization[] {
      let list = this.organizations
      const q = this.search.trim().toLowerCase()

      if (q) {
        list = list.filter(org => org.director.toLowerCase().includes(q))
      }

      if (this.sortKey) {
        const key = this.sortKey
        const dir = this.sortDir === 'asc' ? 1 : -1
        list = [...list].sort((a, b) => String(a[key]).localeCompare(String(b[key])) * dir)
      }

      return list
    },
  },

  actions: {
    addOrg(org: Organization) {
      this.organizations.push({
        ...org,
        id: crypto.randomUUID(),
      })
    },

    updateOrg(org: Organization) {
      const idx = this.organizations.findIndex(o => o.id === org.id)
      if (idx !== -1) this.organizations[idx] = { ...org }
    },

    deleteOrg(id: string) {
      this.organizations = this.organizations.filter(o => o.id !== id)
    },

    setSort(key: 'name' | 'director', order: 'asc' | 'desc') {
      this.sortKey = key
      this.sortDir = order
    },

    setIsModalOpen(value: boolean) {
      this.isModalOpen = value
    },
  },
})

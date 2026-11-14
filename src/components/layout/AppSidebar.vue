<script setup lang="ts">
import type { Component } from 'vue'
import { PhHouse, PhChartLine, PhPlus, PhGear, PhArrowSquareIn } from '@phosphor-icons/vue'

interface NavItem {
  label: string
  routeName: string
  icon: Component
}

const mainNavItems: NavItem[] = [{ label: 'Home', routeName: 'quiz-list', icon: PhHouse }]

const managementNavItems: NavItem[] = [
  { label: 'Management', routeName: 'quiz-management', icon: PhGear },
  { label: 'Create', routeName: 'quiz-create', icon: PhPlus },
  { label: 'Import / Export', routeName: 'quiz-import-export', icon: PhArrowSquareIn },
]

const otherNavItems: NavItem[] = [
  { label: 'Statistics', routeName: 'statistics', icon: PhChartLine },
]
</script>

<template>
  <div class="app-sidebar-brand">
    <span class="app-sidebar-brand-full">IQuiz</span>
    <span class="app-sidebar-brand-short">IQ</span>
  </div>

  <nav aria-label="Sections">
    <ul class="app-nav">
      <li v-for="item in mainNavItems" :key="item.routeName">
        <router-link
          :to="{ name: item.routeName }"
          class="it-nav-link app-nav-link"
          :aria-label="item.label"
        >
          <component :is="item.icon" :size="20" weight="fill" />
          <span class="app-nav-label">{{ item.label }}</span>
        </router-link>
      </li>
    </ul>

    <ul class="app-nav">
      <li class="app-nav-title">Management</li>
      <li v-for="item in managementNavItems" :key="item.routeName">
        <router-link
          :to="{ name: item.routeName }"
          class="it-nav-link app-nav-link"
          :aria-label="item.label"
        >
          <component :is="item.icon" :size="20" weight="fill" />
          <span class="app-nav-label">{{ item.label }}</span>
        </router-link>
      </li>
    </ul>

    <ul class="app-nav app-nav-grow">
      <li class="app-nav-title">Other</li>
      <li v-for="item in otherNavItems" :key="item.routeName">
        <router-link
          :to="{ name: item.routeName }"
          class="it-nav-link app-nav-link"
          :aria-label="item.label"
        >
          <component :is="item.icon" :size="20" weight="fill" />
          <span class="app-nav-label">{{ item.label }}</span>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

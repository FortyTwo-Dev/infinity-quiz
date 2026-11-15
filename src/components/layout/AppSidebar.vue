<script setup lang="ts">
import { ref, type Component } from 'vue'
import { RouterLink } from 'vue-router'
import { APP_VERSION } from '@/constants'
import { SOURCE_CODE_URL } from '@/constants/credits'
import { CreditsDialog } from '@/components/common/credits'
import {
  PhHouse,
  PhChartLine,
  PhPlus,
  PhGear,
  PhArrowSquareIn,
  PhSliders,
  PhHeart,
  PhGithubLogo,
} from '@phosphor-icons/vue'

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

const settingsNavItems: NavItem[] = [{ label: 'Settings', routeName: 'settings', icon: PhSliders }]

const isCreditsOpen = ref(false)
</script>

<template>
  <RouterLink to="/" class="app-sidebar-brand">
    <img src="/img/logo.png" alt="" aria-hidden="true" class="app-sidebar-logo" />
    <span class="app-sidebar-brand-full">IQuiz</span>
  </RouterLink>

  <nav class="app-nav-stack" aria-label="Sections">
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

    <ul class="app-nav">
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

    <ul class="app-nav app-nav-settings">
      <li v-for="item in settingsNavItems" :key="item.routeName">
        <router-link
          :to="{ name: item.routeName }"
          class="it-nav-link app-nav-link"
          :aria-label="item.label"
        >
          <component :is="item.icon" :size="20" weight="fill" />
          <span class="app-nav-label">{{ item.label }}</span>
        </router-link>
      </li>

      <li>
        <button
          type="button"
          class="app-nav-action"
          aria-label="Credits"
          @click="isCreditsOpen = true"
        >
          <PhHeart :size="20" weight="fill" aria-hidden="true" />
          <span class="app-nav-label">Credits</span>
        </button>
      </li>

      <li>
        <a
          :href="SOURCE_CODE_URL"
          target="_blank"
          rel="noopener noreferrer"
          class="app-nav-action"
          aria-label="Source code (opens in a new tab)"
        >
          <PhGithubLogo :size="20" weight="fill" aria-hidden="true" />
          <span class="app-nav-label">Source code</span>
        </a>
      </li>
    </ul>
  </nav>

  <p class="app-sidebar-version" :title="`Infinity Quiz v${APP_VERSION}`">v{{ APP_VERSION }}</p>

  <CreditsDialog :open="isCreditsOpen" @close="isCreditsOpen = false" />
</template>

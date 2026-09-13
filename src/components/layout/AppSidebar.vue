<script setup lang="ts">
import {
  PhHouse,
  PhPlay,
  PhTrophy,
  PhPlus,
  PhGear,
  PhArrowSquareIn,
} from '@phosphor-icons/vue'

interface NavItem {
  label: string
  routeName: string
  icon: any
}

const mainNavItems: NavItem[] = [
  { label: 'Home', routeName: 'quiz-list', icon: PhHouse },
  { label: 'Play', routeName: 'quiz-list', icon: PhPlay },
]

const managementNavItems: NavItem[] = [
  { label: 'Management', routeName: 'quiz-management', icon: PhGear },
  { label: 'Create', routeName: 'quiz-create', icon: PhPlus },
  { label: 'Import / Export', routeName: 'quiz-import-export', icon: PhArrowSquareIn },
]

const otherNavItems: NavItem[] = [{ label: 'Results', routeName: 'results', icon: PhTrophy }]
</script>

<template>
  <div class="w-full">
    <ul class="menu w-full">
      <li class="text-2xl font-bold text-base-content">
        <span class="is-drawer-close:hidden">IQuiz</span>
        <span class="is-drawer-open:hidden">IQ</span>
      </li>
    </ul>

    <!-- Main navigation -->
    <ul class="menu w-full">
      <li v-for="item in mainNavItems" :key="item.routeName">
        <router-link
          :to="{ name: item.routeName }"
          class="is-drawer-close:tooltip is-drawer-close:tooltip-right"
          :data-tip="item.label"
        >
          <component :is="item.icon" class="inline-block" size="20" weight="fill" />
          <span class="is-drawer-close:hidden">{{ item.label }}</span>
        </router-link>
      </li>
    </ul>

    <!-- Management section -->
    <ul class="menu w-full">
      <li class="menu-title is-drawer-close:hidden"><span>Management</span></li>
      <li v-for="item in managementNavItems" :key="item.routeName">
        <router-link
          :to="{ name: item.routeName }"
          class="is-drawer-close:tooltip is-drawer-close:tooltip-right"
          :data-tip="item.label"
        >
          <component :is="item.icon" class="inline-block" size="20" weight="fill" />
          <span class="is-drawer-close:hidden">{{ item.label }}</span>
        </router-link>
      </li>
    </ul>

    <!-- Other section -->
    <ul class="menu w-full mt-auto">
      <li class="menu-title is-drawer-close:hidden"><span>Other</span></li>
      <li v-for="item in otherNavItems" :key="item.routeName">
        <router-link
          :to="{ name: item.routeName }"
          class="is-drawer-close:tooltip is-drawer-close:tooltip-right"
          :data-tip="item.label"
        >
          <component :is="item.icon" class="inline-block" size="20" weight="fill" />
          <span class="is-drawer-close:hidden">{{ item.label }}</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

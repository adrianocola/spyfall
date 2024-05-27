import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@app', replacement: '/app' },
      { find: '@actions', replacement: '/app/actions' },
      { find: '@components', replacement: '/app/components' },
      { find: '@containers', replacement: '/app/containers' },
      { find: '@hooks', replacement: '/app/hooks' },
      { find: '@images', replacement: '/app/images' },
      { find: '@reducers', replacement: '/app/reducers' },
      { find: '@selectors', replacement: '/app/selectors' },
      { find: '@services', replacement: '/app/services' },
      { find: '@styles', replacement: '/app/styles' },
      { find: '@utils', replacement: '/app/utils' },
    ],
  },
})

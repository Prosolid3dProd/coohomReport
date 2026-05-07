import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig(({ mode }) => ({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    esbuild: {
        drop: mode === 'production' ? ['console', 'debugger'] : [],
    },
}))
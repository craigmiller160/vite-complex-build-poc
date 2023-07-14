import { defineConfig } from 'vite';
import path from 'path';
import packageJson from './package.json';

const dependencies = Object.entries(packageJson.dependencies)
    .map(([key]) => key);

export default defineConfig({
    build: {
        outDir: path.join(process.cwd(), 'lib'),
        emptyOutDir: true,
        lib: {
            entry: path.join(process.cwd(), 'src'),
            name: 'config',
            fileName: 'config'
        },
        rollupOptions: {
            external: dependencies
        }
    }
});
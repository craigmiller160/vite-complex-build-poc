import { defineConfig } from 'vite';
import path from 'path';
import packageJson from './package.json';
import dts from 'vite-plugin-dts';
import { builtinModules } from 'module';

const dependencies = Object.entries(packageJson.dependencies)
    .map(([key]) => key);

export default defineConfig({
    plugins: [
        dts({
            entryRoot: path.join(process.cwd(), 'src'),
            insertTypesEntry: true
        })
    ],
    build: {
        outDir: path.join(process.cwd(), 'build'),
        emptyOutDir: true,
        lib: {
            entry: path.join(process.cwd(), 'src'),
            name: 'config',
            fileName: 'config'
        },
        rollupOptions: {
            external: [
                ...dependencies,
                ...builtinModules
            ]
        }
    }
});
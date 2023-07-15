import { defineConfig } from 'vite';
import path from 'path';
import packageJson from './package.json';
import dts from 'vite-plugin-dts';
import { builtinModules } from 'module';
import { viteStaticCopy } from 'vite-plugin-static-copy'

const dependencies = Object.entries(packageJson.dependencies)
    .map(([key]) => key);

const rootDir = path.join(process.cwd(), 'src');
const buildDir = path.join(process.cwd(), 'build');

export default defineConfig({
    plugins: [
        dts({
            entryRoot: rootDir,
            insertTypesEntry: true
        }),
        viteStaticCopy({
            targets: [
                {
                    src: path.join(process.cwd(), 'tsconfig.json'),
                    dest: buildDir
                }
            ]
        })
    ],
    build: {
        outDir: buildDir,
        emptyOutDir: true,
        lib: {
            entry: rootDir,
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
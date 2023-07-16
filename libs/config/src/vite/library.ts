import dts from 'vite-plugin-dts';
import { defineConfig, UserConfigExport } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import packageJson from '../../package.json';

const dependencies = Object.keys(packageJson.dependencies);

const rootDir = path.join(process.cwd(), 'src');
const buildDir = path.join(process.cwd(), 'build');

export type ViteLibraryConfig = Readonly<{
	name: string;
}>;

export const configureVite = (config: ViteLibraryConfig): UserConfigExport =>
	defineConfig({
		plugins: [
			dts({
				entryRoot: rootDir,
				insertTypesEntry: true
			}),
			react()
		],
		build: {
			outDir: buildDir,
			emptyOutDir: true,
			lib: {
				entry: rootDir,
				name: config.name,
				fileName: config.name
			},
			rollupOptions: {
				external: [...dependencies]
			}
		}
	});

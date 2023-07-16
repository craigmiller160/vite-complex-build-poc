import dts from 'vite-plugin-dts';
import { defineConfig } from 'vite';
import path from 'path';
import packageJson from '../../package.json';

const dependencies = Object.keys(packageJson.dependencies);

const rootDir = path.join(process.cwd(), 'src');
const buildDir = path.join(process.cwd(), 'build');

export default defineConfig({
	plugins: [
		dts({
			entryRoot: rootDir,
			insertTypesEntry: true
		})
	],
	build: {
		outDir: buildDir,
		lib: {
			entry: rootDir,
			name: 'react-lazy',
			fileName: 'react-lazy'
		},
		rollupOptions: {
			external: [...dependencies]
		}
	}
});

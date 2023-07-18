/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentType, lazy } from 'react';

export const namedLazy = (
	importer: () => Promise<Record<string, any>>,
	name: string
) =>
	lazy(() =>
		importer().then((res) => ({
			default: res.default[name] as ComponentType<any>
		}))
	);

/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentType, lazy } from 'react';

// The response structure is mis-typed and likely due to module federation
export const namedLazy = (
	importer: () => Promise<Record<string, any>>,
	name: string
) =>
	lazy(() =>
		importer().then((res) => ({
			default: res.default[name] as ComponentType<any>
		}))
	);

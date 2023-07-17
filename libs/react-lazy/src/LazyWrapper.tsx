import { ComponentType, ReactNode, useEffect, useState } from 'react';
import { useIsMounted } from './useIsMounted';

type Props<T extends object> = Readonly<{
	path: string;
	// If I'm going to do this at work, this prop needs a better name
	name?: string;
	props?: T;
	loading?: ReactNode;
}>;

type State<T extends object> = {
	Component: ComponentType<T> | undefined;
};
type ImportedComponentType<T extends object> =
	| ComponentType<T>
	| {
			[key: string]: ComponentType<T>; // TODO in TypeScript, is there any way to make this more specific?
	  };

const isComponentType = <T extends object>(
	importedType: ImportedComponentType<T>
): importedType is ComponentType<T> => {
	// Need class support for final implementation
	return typeof importedType === 'function';
};

export const LazyWrapper = <T extends object>(props: Props<T>) => {
	const [state, setState] = useState<State<T>>({
		Component: undefined
	});
	const isMounted = useIsMounted();

	useEffect(() => {
		if (!isMounted) {
			return;
		}
		import(props.path)
			.then((component: ImportedComponentType<T>) => {
				if (isMounted) {
					let Component: ComponentType<T>;
					if (isComponentType(component)) {
						Component = component;
					} else if (props.name) {
						Component = component[props.name];
					} else {
						throw new Error(
							`Imported module is not recognized component: ${props.path}`,
							component
						);
					}

					setState((prevState) => ({
						...prevState,
						Component
					}));
				}
			})
			.catch((ex) => console.error(ex));
	}, [props.path, isMounted, props.name]);

	if (state.Component === undefined && props.loading === undefined) {
		return <></>;
	}

	if (state.Component === undefined) {
		return props.loading;
	}

	if (props.props === undefined) {
		const Component = state.Component as ComponentType<object>;
		return <Component />;
	}

	return <state.Component {...props.props} />;
};

import { ComponentType, ReactNode, useEffect, useState } from 'react';
import { useIsMounted } from './useIsMounted';

type Props<T extends object> = Readonly<{
	path: string;
	props?: T;
	loading?: ReactNode;
}>;

type State<T extends object> = {
	Component: ComponentType<T> | undefined;
};

export const LazyWrapper = <T extends object>(props: Props<T>) => {
	const [state, setState] = useState<State<T>>({
		Component: undefined
	});
	const isMounted = useIsMounted();

	useEffect(() => {
		import(props.path)
			.then((component: ComponentType<T>) => {
				if (isMounted) {
					setState((prevState) => ({
						...prevState,
						Component: component
					}));
				}
			})
			.catch((ex) => console.error(ex));
	}, [props.path, isMounted]);

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

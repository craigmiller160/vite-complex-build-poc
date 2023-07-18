import { Other } from './jsAndTs/Other';
import { Pretty } from './mui/Pretty';
import { Suspense, useState } from 'react';
import { Button } from '@mui/material';
import { namedLazy } from 'react-lazy';

const LazyMfe1 = namedLazy(() => import('mfe1/App'), 'App');

export const App = () => {
	const [showMfe1, setShowMfe1] = useState<boolean>(false);
	const toggleShowMfe1 = () => setShowMfe1((prevState) => !prevState);
	return (
		<div>
			<h1>Welcome to the Main App</h1>
			<Other />
			<Pretty />
			<Button variant="contained" onClick={toggleShowMfe1}>
				Toggle MFE1
			</Button>
			{showMfe1 && (
				<div>
					<Suspense fallback="Loading...">
						<LazyMfe1 />
					</Suspense>
				</div>
			)}
		</div>
	);
};

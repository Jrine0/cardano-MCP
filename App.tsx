import React from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { Layout } from './components/Layout';
import { ErrorBoundary } from './src/components/common/ErrorBoundary';

import { MeshProvider } from '@meshsdk/react';

function App() {
  return (
    <ErrorBoundary>
      <MeshProvider>
        <ReactFlowProvider>
          <Layout />
        </ReactFlowProvider>
      </MeshProvider>
    </ErrorBoundary>
  );
}

export default App;

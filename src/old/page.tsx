'use client'

import React, { Suspense, useState } from 'react';

const MapComponent = React.lazy(() => import('../components/mapComponent')); // Assurez-vous que MapComponent exporte votre composant de carte

export default function Home() {

  return (
      <main className="flex min-h-screen flex-col items-center justify-between">
          <MapComponent />
      </main>
  );
}

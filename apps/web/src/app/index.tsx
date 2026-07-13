import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  return (
    <main id="main-content">
      {/* Narrative sections will be composed here */}
      <div className="min-h-screen" />
    </main>
  );
}

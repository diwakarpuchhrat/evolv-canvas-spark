import { MainLayout } from '@/components/Layout/MainLayout';

const App = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your EVOLV dashboard.</p>
      </div>
    </MainLayout>
  );
};

export default App;
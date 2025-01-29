/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from '@/lib/db/prisma';
import { BarChart, Card } from '@tremor/react';

export default async function Dashboard() {
  const events = await prisma.event.findMany({
    orderBy: { timestamp: 'desc' },
  });

  const chartData = events.reduce((acc: any, event: any) => {
    const date = event.timestamp.toISOString().split('T')[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Analíticas en Tiempo Real</h1>
      
      <Card className="mb-6">
        <BarChart
          data={Object.entries(chartData).map(([date, count]) => ({
            date,
            Visitas: count
          }))}
          categories={["Visitas"]}
          index="date"
          colors={["blue"]}
        />
      </Card>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <h3>Eventos Totales</h3>
          <p>{events.length}</p>
        </Card>
        <Card>
          <h3>Páginas Visitadas</h3>
          <p>{events.filter((e: any) => e.event_type === 'pageview').length}</p>
        </Card>
      </div>
    </div>
  );
}
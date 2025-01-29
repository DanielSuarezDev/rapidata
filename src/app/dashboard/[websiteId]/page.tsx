
/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from '@/lib/db/prisma';
import { BarChart, Card } from '@tremor/react';

export default async function Dashboard({
  params
}: any) {
  const events = await prisma.event.findMany({
    where: { website_id: params.websiteId },
    orderBy: { timestamp: 'desc' },
  });

  const pageviews = events.filter((e: any) => e.event_type === 'pageview').length;
  const uniqueVisitors = new Set(events.map((e: any) => JSON.parse(e.payload).ua)).size;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Analíticas del sitio {params.websiteId}</h1>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <h3>Visitantes Únicos</h3>
          <p className="text-2xl font-bold">{uniqueVisitors}</p>
        </Card>
        <Card>
          <h3>Páginas Vistas</h3>
          <p className="text-2xl font-bold">{pageviews}</p>
        </Card>
      </div>

      <Card>
        <BarChart
          data={events.reduce((acc: any, event: any) => {
            const date = new Date(event.timestamp).toLocaleDateString();
            acc[date] = (acc[date] || 0) + 1;
            return acc;
          }, {})}
          categories={["Visitas"]}
          index="date"
        />
      </Card>
    </div>
  );
}
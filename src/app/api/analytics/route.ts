export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const websiteId = searchParams.get('website_id') || 'default';
  
    return new Response(`
      (function(){
        const websiteId = "${websiteId}";
        
        function track(event, data = {}) {
          const payload = {
            event,
            websiteId,
            url: location.href,
            ts: Date.now(),
            ...data
          };
          
          navigator.sendBeacon('/api/event', JSON.stringify(payload));
        }
        
        document.addEventListener('DOMContentLoaded', () => track('pageview'));
        window.analytics = { track };
      })();
    `, {
      headers: { 
        'Content-Type': 'application/javascript',
        'Cache-Control': 'public, max-age=31536000' 
      }
    });
  }
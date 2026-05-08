// Vercel Serverless Function - Get Events
// Endpoint: /api/events

export default function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=600');

    const events = [
        {
            id: '1',
            date: 'Fri, Jun 19, 2026',
            time: '6:00 PM',
            venue: 'Lifetime',
            city: 'Gainesville',
            state: 'VA',
            ticketUrl: '#'
        }
    ];

    res.status(200).json({ events });
}

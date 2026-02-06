// Vercel Serverless Function - Get Events
// Endpoint: /api/events

export default function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 's-maxage=300');
    
    // Demo events - update with real show dates
    const events = [
        {
            id: '1',
            date: 'Sat, Mar 15, 2026',
            time: '8:00 PM',
            venue: 'Crossroads Chantilly',
            city: 'Chantilly',
            state: 'VA',
            ticketUrl: 'https://planetaryband.com'
        },
        {
            id: '2',
            date: 'Fri, Mar 28, 2026',
            time: '9:00 PM',
            venue: 'The Blue Note Lounge',
            city: 'Arlington',
            state: 'VA',
            ticketUrl: 'https://planetaryband.com'
        },
        {
            id: '3',
            date: 'Sat, Apr 12, 2026',
            time: '7:30 PM',
            venue: 'Faith Community Church',
            city: 'Fairfax',
            state: 'VA',
            ticketUrl: null,
            isFree: true
        }
    ];

    res.status(200).json({ events });
}

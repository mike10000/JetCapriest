// Vercel Serverless Function - Get Events
// GET /api/events?site=first-sunday  — home / First Sunday page
// GET /api/events?site=jet-capriest — Jet Capriest page

const eventsFirstSunday = [
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

const eventsJetCapriest = [
    {
        id: '1',
        date: 'Thu, May 21, 2026',
        time: '2:00 PM',
        venue: "Nat's Bullpen",
        city: 'Sterling',
        state: 'VA',
        ticketUrl: '#'
    },
    {
        id: '2',
        date: 'Fri, May 22, 2026',
        time: '6:00 PM',
        venue: 'Commas Food Hall',
        city: 'Ashburn',
        state: 'VA',
        ticketUrl: '#'
    },
    {
        id: '3',
        date: 'Sat, May 23, 2026',
        time: '2:00 PM',
        venue: 'Naked Mountain Winery',
        city: 'Markham',
        state: 'VA',
        ticketUrl: '#'
    },
    {
        id: '4',
        date: 'Sat, May 30, 2026',
        time: '5:00 PM',
        venue: 'Mill St. Draft Garden',
        city: 'Occoquan',
        state: 'VA',
        ticketUrl: '#'
    },
    {
        id: '5',
        date: 'Fri, Jun 19, 2026',
        time: '6:00 PM',
        venue: 'Lifetime',
        city: 'Gainesville',
        state: 'VA',
        ticketUrl: '#'
    }
];

export default function handler(req, res) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=600');

    let rawSite = '';
    if (req.query && typeof req.query.site === 'string') {
        rawSite = req.query.site;
    } else if (typeof req.url === 'string') {
        try {
            rawSite = new URL(req.url, 'https://example.com').searchParams.get('site') || '';
        } catch {
            rawSite = '';
        }
    }
    const site = rawSite === 'jet-capriest' ? 'jet-capriest' : 'first-sunday';
    const events = site === 'jet-capriest' ? eventsJetCapriest : eventsFirstSunday;

    res.status(200).json({ events });
}

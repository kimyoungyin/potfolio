import type { Project } from "./types";

export const projects: Project[] = [
    {
        title: "TaskFlow",
        duration: "2024.01 - 2024.03",
        teamSize: "Personal Project",
        description:
            "A modern task management application with drag-and-drop functionality, real-time collaboration features, and a clean, intuitive interface.",
        features: [
            "Drag-and-drop task organization",
            "Real-time sync across devices",
            "Dark mode support",
            "Keyboard shortcuts",
        ],
        challengeSummary:
            "Performance bottleneck with drag-and-drop rendering on large lists, causing 15fps frame rates.",
        techStack: [
            "React",
            "TypeScript",
            "Tailwind CSS",
            "Supabase",
            "Framer Motion",
        ],
        liveUrl: "https://example.com",
        githubUrl: "https://github.com",
        caseStudy: {
            problem:
                "The drag-and-drop library (react-beautiful-dnd) was re-rendering the entire list on every drag event. With 500+ tasks, this created severe jank - frame rates dropped to 15fps, making the app unusable. Users with large task lists were abandoning the app.",
            investigation:
                "Used React DevTools Profiler to identify excessive re-renders. Discovered the DND context was causing all children to re-render on drag. Evaluated solutions: memo optimization, windowing libraries (react-window, react-virtualized), and alternative DND libraries (@dnd-kit). Benchmarked each approach with 1000 items.",
            solution:
                "Implemented react-window for list virtualization, only rendering ~20 visible items instead of 500+. Combined with @dnd-kit which has better render optimization. Used memo() strategically on task cards and implemented a custom drag overlay to prevent re-renders during drag operations.",
            implementation: {
                description:
                    "Replaced the flat list with FixedSizeList from react-window, integrated @dnd-kit for drag handling, and created a DragOverlay component for smooth visual feedback without triggering re-renders.",
                codeSnippet: `const TaskList = ({ tasks }) => {
  const [activeId, setActiveId] = useState(null);
  
  return (
    <DndContext onDragStart={({active}) => setActiveId(active.id)}>
      <SortableContext items={tasks}>
        <FixedSizeList
          height={600}
          itemCount={tasks.length}
          itemSize={72}
        >
          {({ index, style }) => (
            <SortableTask 
              task={tasks[index]} 
              style={style}
            />
          )}
        </FixedSizeList>
      </SortableContext>
      <DragOverlay>
        {activeId && <TaskCard task={findTask(activeId)} />}
      </DragOverlay>
    </DndContext>
  );
};`,
                codeLanguage: "tsx",
            },
            impact: {
                metrics: [
                    {
                        label: "Frame Rate",
                        value: "60fps",
                        description: "from 15fps",
                    },
                    {
                        label: "DOM Nodes",
                        value: "-90%",
                        description: "reduced from 2000 to 200",
                    },
                    {
                        label: "Initial Render",
                        value: "120ms",
                        description: "from 800ms",
                    },
                    {
                        label: "Memory Usage",
                        value: "-65%",
                        description: "reduced heap size",
                    },
                ],
                summary:
                    "User engagement increased by 40% for power users with large task lists. Zero performance complaints since deployment.",
            },
        },
    },
    {
        title: "DevHub",
        duration: "2023.09 - 2023.12",
        teamSize: "Team of 3",
        description:
            "A developer portfolio and blog platform with markdown support, syntax highlighting, and SEO optimization built with Next.js.",
        features: [
            "MDX-powered blog with syntax highlighting",
            "SEO optimized with dynamic OG images",
            "RSS feed generation",
            "Comments with GitHub OAuth",
        ],
        challengeSummary:
            "Dynamic OG image generation was slow (3s) and unreliable, causing social media preview failures.",
        techStack: ["Next.js", "TypeScript", "MDX", "Prisma", "PostgreSQL"],
        liveUrl: "https://example.com",
        githubUrl: "https://github.com",
        caseStudy: {
            problem:
                "OG images were generated on-demand using Puppeteer, taking 3-5 seconds per request. Twitter and LinkedIn crawlers would timeout waiting for images, resulting in broken previews for ~30% of shared links. This hurt content distribution significantly.",
            investigation:
                "Analyzed crawler behavior and timeout limits (Twitter: 5s, LinkedIn: 3s). Explored options: pre-generating all images at build time (slow builds), CDN caching with Puppeteer (still slow first request), and edge-side generation with @vercel/og (fast but limited styling). Tested edge rendering with Satori.",
            solution:
                "Migrated to @vercel/og which uses Satori for edge-side SVG generation, converting to PNG at the edge. Implemented aggressive caching with stale-while-revalidate pattern. Created a fallback system that serves a generic branded image if generation fails.",
            implementation: {
                description:
                    "Created an edge API route using @vercel/og with custom fonts loaded via fetch. Implemented cache headers for CDN caching and added error boundaries with fallback images.",
                codeSnippet: `export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') ?? 'DevHub';
  
  const fontData = await fetch(
    new URL('./Inter-Bold.ttf', import.meta.url)
  ).then((res) => res.arrayBuffer());

  return new ImageResponse(
    <div style={{ display: 'flex', background: '#0a0a0a' }}>
      <h1 style={{ color: 'white', fontSize: 60 }}>{title}</h1>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [{ name: 'Inter', data: fontData }],
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    }
  );
}`,
                codeLanguage: "tsx",
            },
            impact: {
                metrics: [
                    {
                        label: "Generation Time",
                        value: "200ms",
                        description: "from 3-5 seconds",
                    },
                    {
                        label: "Success Rate",
                        value: "99.9%",
                        description: "from 70%",
                    },
                    {
                        label: "Cold Start",
                        value: "<50ms",
                        description: "edge function",
                    },
                    {
                        label: "Social CTR",
                        value: "+25%",
                        description: "click-through rate",
                    },
                ],
                summary:
                    "Eliminated all timeout failures. Social media traffic increased 25% due to reliable, visually appealing previews.",
            },
        },
    },
    {
        title: "WeatherNow",
        duration: "2023.06 - 2023.07",
        teamSize: "Personal Project",
        description:
            "A weather application with location-based forecasts, interactive maps, and hourly/weekly predictions using multiple weather APIs.",
        features: [
            "Location-based weather detection",
            "Interactive weather maps",
            "7-day forecast with hourly breakdown",
            "Severe weather alerts",
        ],
        challengeSummary:
            "Multiple API calls caused 4s load times and frequent rate limiting issues on the free tier.",
        techStack: ["React", "Node.js", "Redis", "Mapbox", "OpenWeather API"],
        liveUrl: "https://example.com",
        githubUrl: "https://github.com",
        caseStudy: {
            problem:
                "Each page load triggered 4 separate API calls: current weather, hourly forecast, weekly forecast, and air quality. With free tier limits (60 calls/minute), popular locations would get rate-limited. Load time averaged 4 seconds due to waterfall requests.",
            investigation:
                "Mapped API dependencies and realized data could be cached for 10-15 minutes without affecting UX. Evaluated caching solutions: in-memory (lost on restart), Redis (persistent, fast), and CDN edge caching (complex invalidation). Chose Redis for flexibility.",
            solution:
                "Built an API aggregation layer that batches all weather data into a single cached response. Redis stores responses with location-based keys and TTL of 10 minutes. Implemented background refresh to serve stale data while fetching fresh data.",
            implementation: {
                description:
                    "Created a unified /api/weather endpoint that checks Redis cache first, returns cached data immediately if available, and triggers background refresh if data is stale.",
                codeSnippet: `async function getWeather(lat: number, lon: number) {
  const cacheKey = \`weather:\${lat.toFixed(2)}:\${lon.toFixed(2)}\`;
  
  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    const data = JSON.parse(cached);
    // Background refresh if stale
    if (Date.now() - data.timestamp > 5 * 60 * 1000) {
      refreshWeatherInBackground(lat, lon, cacheKey);
    }
    return data;
  }
  
  // Parallel fetch all data
  const [current, hourly, weekly, air] = await Promise.all([
    fetchCurrent(lat, lon),
    fetchHourly(lat, lon),
    fetchWeekly(lat, lon),
    fetchAirQuality(lat, lon),
  ]);
  
  const response = { current, hourly, weekly, air, timestamp: Date.now() };
  await redis.setex(cacheKey, 600, JSON.stringify(response));
  return response;
}`,
                codeLanguage: "typescript",
            },
            impact: {
                metrics: [
                    {
                        label: "Load Time",
                        value: "800ms",
                        description: "from 4 seconds",
                    },
                    {
                        label: "API Calls",
                        value: "-70%",
                        description: "reduced usage",
                    },
                    {
                        label: "Cache Hit Rate",
                        value: "85%",
                        description: "for popular locations",
                    },
                    {
                        label: "Rate Limits",
                        value: "0",
                        description: "incidents per month",
                    },
                ],
                summary:
                    "App now handles 10x more users on the same API tier. Users experience near-instant loads for cached locations.",
            },
        },
    },
] as const;

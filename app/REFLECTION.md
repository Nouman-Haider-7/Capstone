# Reflection

## What was hardest, and why

The hardest part was not writing the AI prompt or the React code itself - it was debugging a series of subtle, misleading infrastructure issues. Early on, Turbopack silently failed to resolve Google Fonts, which looked like a styling bug but was actually a bundler bug. Later, a bigger issue: when restructuring the project to fix performance, I accidentally ended up with two duplicate "casting-assistant" folders in different locations - one where I was actively editing, and one that Next.js was actually building from. This meant hours of changes were invisible in the live deployment, and Lighthouse scores stayed stuck around 52 no matter what I changed, because the real fix was never actually being deployed. Finding and fixing that duplication was the single biggest unlock in the whole project.

## What I would do differently next time

I would verify file locations and build output much earlier and more often, rather than trusting that a file I edited was the file actually being used. Running `npm run build` locally after every meaningful change - not just at the end - would have caught the duplicate-folder issue immediately instead of after several rounds of confusing, contradictory performance results. I would also separate server and client components from the very start of a feature, rather than building everything as one client component and refactoring afterward; it's a much smaller change to make early than to retrofit later.

## One thing that surprised me

I was surprised by how much of a real difference the server/client component split made to actual performance - moving from one all-client page to a server-rendered shell with a smaller client-only chat component took the Lighthouse Performance score from 52 to 95 on mobile. It was not a cosmetic change or a minor optimization; it was the single biggest factor in the whole audit, bigger than font loading or any other individual fix. It made concrete something I had only understood abstractly before: not everything on a page needs to ship as JavaScript to the browser, and treating "the whole page" as one component has a real, measurable cost.

# REESKOVA Launch Film

Premium 82-second global launch motion film for REESKOVA.

## Story

1. Fragmented marketplaces (problem)
2. REESKOVA as the solution
3. Real Estate
4. Vehicles
5. Financial Solutions
6. Verified Businesses
7. Search → Discover → Connect
8. Ecosystem built for the future
9. Logo ending: *One Marketplace. Endless Opportunities.*

## Commands

```bash
# Preview in Remotion Studio
npm run dev --workspace=launch-film

# Regenerate narration
python3 apps/launch-film/scripts/generate-narration.py

# Render final MP4
npm run render --workspace=launch-film
```

Output: `apps/launch-film/out/reeskova-launch.mp4`  
Published copy: `apps/web/public/promo/reeskova-launch.mp4`

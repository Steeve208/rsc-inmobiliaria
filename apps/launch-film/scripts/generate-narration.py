#!/usr/bin/env python3
"""Generate premium English narration for the REESKOVA launch film."""

import asyncio
from pathlib import Path

import edge_tts

OUT = Path(__file__).resolve().parents[1] / "public" / "audio" / "narration.mp3"

SCRIPT = """
Today, opportunities live in fragments.
Properties in one place.
Vehicles in another.
Financing somewhere else.
Businesses scattered across platforms that were never designed to work together.

REESKOVA changes that.

A modern digital marketplace that connects people, businesses, and opportunities —
in one premium experience.

Discover real estate shaped for how you live.
From modern homes to landmark addresses — all in one place.

Explore vehicles that move with your ambition.
From everyday mobility to high-performance design.

Access financial solutions built for clarity and trust.
Simple. Digital. Designed around your next decision.

Connect with verified businesses ready to deliver.
Agencies, dealerships, and partners you can rely on.

Search. Discover. Connect.
Everything you need — unified in a single marketplace.

REESKOVA is more than a marketplace.
It is an ecosystem built for the future.

REESKOVA.
One Marketplace. Endless Opportunities.
Discover what's next.
""".strip()


async def main() -> None:
    OUT.parent.mkdir(parents=True, exist_ok=True)
    communicate = edge_tts.Communicate(
        SCRIPT,
        voice="en-US-AndrewNeural",
        rate="-12%",
        pitch="-3Hz",
    )
    await communicate.save(str(OUT))
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    asyncio.run(main())

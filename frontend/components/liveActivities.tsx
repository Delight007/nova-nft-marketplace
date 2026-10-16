import Image from "next/image";

const activities = [
  {
    id: 1,
    user: "0x7a...3f2e",
    action: "purchased",
    nft: "Cyber Soul #1189",
    time: "2m",
    image: "/images/n3.jpg",
  },
  {
    id: 2,
    user: "PixelNomad",
    action: "listed",
    nft: "Floating Island #2047",
    time: "5m",
    image: "/images/n2.png",
  },
  {
    id: 3,
    user: "3xKp...9a1a",
    action: "bought",
    nft: "Ape #5271",
    time: "7m",
    image: "/images/n.png",
  },
  {
    id: 4,
    user: "Dreamer",
    action: "offered 2.5 SOL for",
    nft: "Rebirth #331",
    time: "12m",
    image: "/images/n3.jpg",
  },
  {
    id: 5,
    user: "0x9c...4e7e",
    action: "purchased",
    nft: "The Last Light #903",
    time: "15m",
    image: "/images/n2.png",
  },
  {
    id: 6,
    user: "LunaArts",
    action: "created a new collection",
    nft: "",
    time: "18m",
    image: "/images/n.png",
  },
];

export default function LiveActivities() {
  return (
    <section className="min-w-0 rounded-xl border border-blue-950 bg-[#050e1d] p-3">
      {/* Heading */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-bold text-white">Live Activity</h2>

        <span className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-400">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
          Live
        </span>
      </div>

      {/* Activity list */}
      <div className="space-y-3">
        {activities.map((activity) => (
          <div key={activity.id} className="flex min-w-0 items-center gap-3">
            {/* NFT thumbnail */}
            <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg border border-white/10">
              <Image
                src={activity.image}
                alt={activity.nft || "Collection artwork"}
                fill
                sizes="36px"
                className="object-cover"
              />
            </div>

            {/* Activity details */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-[11px] font-medium text-slate-300">
                {activity.user}
              </p>

              <p className="mt-0.5 text-[10px] leading-4 text-slate-400">
                {activity.action}{" "}
                {activity.nft && (
                  <span className="text-blue-300">{activity.nft}</span>
                )}
              </p>
            </div>

            {/* Time */}
            <span className="shrink-0 self-start pt-0.5 text-[10px] text-slate-500">
              {activity.time}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

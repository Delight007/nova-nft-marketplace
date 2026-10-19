import { traits } from "./nftDetailsData";

export default function NFTTraitsTab() {
  return (
    <div className="p-5 md:p-7">
      <h3 className="text-lg font-semibold">Traits & Rarity</h3>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[400px] text-left text-sm">
          <thead className="text-xs text-blue-400">
            <tr>
              <th className="pb-4 font-medium">Trait</th>
              <th className="pb-4 font-medium">Value</th>
              <th className="pb-4 font-medium">Frequency</th>
            </tr>
          </thead>
          <tbody>
            {traits.map((trait) => (
              <tr key={trait.name} className="border-t border-[#172c4c]">
                <td className="py-4">{trait.name}</td>
                <td className="py-4 text-blue-200">{trait.value}</td>
                <td className="py-4 text-cyan-300">{trait.rarity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

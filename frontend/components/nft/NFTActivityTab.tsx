import { FiTag } from "react-icons/fi";
import { activity } from "./nftDetailsData";

export default function NFTActivityTab() {
  return (
    <div className="p-5 md:p-7">
      <h3 className="text-lg font-semibold">Item Activity</h3>
      <p className="mt-2 text-sm text-blue-300">
        Historical events for this NFT.
      </p>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="text-xs text-blue-400">
            <tr>
              <th className="pb-4 font-medium">Event</th>
              <th className="pb-4 font-medium">Participant</th>
              <th className="pb-4 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {activity.map((item) => (
              <tr key={item.title} className="border-t border-[#172c4c]">
                <td className="py-4 font-medium">
                  <span className="flex items-center gap-2">
                    {item.type === "list" && (
                      <FiTag
                        aria-hidden="true"
                        className="text-cyan-300"
                      />
                    )}
                    {item.title}
                  </span>
                </td>
                <td className="py-4 text-blue-200">{item.detail}</td>
                <td className="py-4 text-blue-400">{item.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

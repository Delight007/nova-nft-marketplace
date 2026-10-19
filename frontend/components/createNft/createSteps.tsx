"use client";

const steps = [
  {
    number: 1,
    title: "Upload",
    description: "Add your artwork",
  },
  {
    number: 2,
    title: "Details",
    description: "Set info & traits",
  },
  {
    number: 3,
    title: "Preview",
    description: "Check your NFT",
  },
  {
    number: 4,
    title: "Mint",
    description: "Create on-chain",
  },
];

export default function CreateSteps() {
  return (
    <div className="hidden items-start md:flex">
      {steps.map((step, index) => (
        <div key={step.number} className="flex flex-1 items-start">
          <div>
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold ${
                step.number === 1
                  ? "border-purple-500 bg-purple-500/10 text-white shadow-[0_0_20px_rgba(168,85,247,0.35)]"
                  : "border-blue-500/30 bg-[#07142d] text-slate-300"
              }`}
            >
              {step.number}
            </div>

            <div className="mt-3">
              <p className="text-sm font-semibold text-white">{step.title}</p>

              <p className="mt-1 text-xs text-slate-500">{step.description}</p>
            </div>
          </div>

          {index !== steps.length - 1 && (
            <div className="mt-5 h-px flex-1 bg-gradient-to-r from-purple-500/70 to-blue-500/20" />
          )}
        </div>
      ))}
    </div>
  );
}

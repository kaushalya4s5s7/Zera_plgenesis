import BgAnimateButton from "./bg-animate-button";

const roundings = ["full", "xl", "2xl", "3xl", "sm", "xs"] as const;
const gradients = ["sunrise", "ocean", "candy", "forest", "sunset", "nebula"] as const;
const animations = ["spin-fast", "pulse", "bounce"] as const;

export const BgAnimateDemo = () => {
  return (
    <div className="w-full max-w-4xl">
      <div className="min-h-[500px] px-12 md:px-24 flex flex-col justify-center border border-dashed rounded-lg space-y-4">

        {/* Roundings Grid */}
        <div className="grid grid-cols-3 gap-4">
          {roundings.map((rounding, i) => (
            <BgAnimateButton
              key={`rounding-${rounding}`}
              rounded={rounding}
              gradient={gradients[i % gradients.length]}
            >
              {`Rounded: ${rounding}`}
            </BgAnimateButton>
          ))}
        </div>

        {/* Animations Grid */}
        <div className="grid grid-cols-3 gap-4">
          {animations.map((animation, i) => (
            <BgAnimateButton
              key={`anim-${animation}`}
              animation={animation as any}
              gradient={gradients[i % gradients.length]}
              rounded="full"
              variant="ghost"
            >
              {`Animation: ${animation}`}
            </BgAnimateButton>
          ))}
        </div>

      </div>
    </div>
  );
};

export default BgAnimateDemo;

import {
  FiChevronLeft,
  FiChevronRight,
  FiHeart,
} from "react-icons/fi";
import { images, nft } from "./nftDetailsData";

type NFTArtworkGalleryProps = {
  activeImage: number;
  favorite: boolean;
  onImageChange: (index: number) => void;
  onToggleFavorite: () => void;
  onNotice: (message: string) => void;
};

export default function NFTArtworkGallery({
  activeImage,
  favorite,
  onImageChange,
  onToggleFavorite,
  onNotice,
}: NFTArtworkGalleryProps) {
  const changeImage = (offset: number) => {
    onImageChange((activeImage + offset + images.length) % images.length);
  };

  return (
    <div className="flex h-full min-w-0 flex-col lg:min-h-0">
      <div className="group relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-[#152849] bg-[#071124] p-1.5">
        <div className="relative min-h-[280px] flex-1 overflow-hidden rounded-xl bg-[#060c1b]">
          <img
            src={images[activeImage]}
            alt={nft.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.015]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#030817]/50 via-transparent to-transparent" />
          <span className="absolute right-3 top-3 rounded-lg border border-white/10 bg-[#030a18]/80 px-3 py-1.5 text-xs font-semibold backdrop-blur-md">
            #{nft.id}
          </span>
          <button
            onClick={() => changeImage(-1)}
            aria-label="Previous artwork"
            className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-[#030a18]/80 text-xl transition hover:bg-violet-600"
          >
            <FiChevronLeft />
          </button>
          <button
            onClick={() => changeImage(1)}
            aria-label="Next artwork"
            className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-[#030a18]/80 text-xl transition hover:bg-violet-600"
          >
            <FiChevronRight />
          </button>
          <button
            onClick={onToggleFavorite}
            aria-label="Favorite artwork"
            className={`absolute bottom-4 right-4 rounded-full border border-white/10 p-3 backdrop-blur-md transition ${
              favorite
                ? "bg-pink-500 text-white"
                : "bg-[#030a18]/80 text-white hover:text-pink-400"
            }`}
          >
            <FiHeart
              className={favorite ? "fill-current" : ""}
              size={19}
            />
          </button>
        </div>
      </div>

      <div className="scrollbar-hidden mt-3 flex gap-2 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <button
            key={image}
            onClick={() => onImageChange(index)}
            aria-label={`View artwork ${index + 1}`}
            className={`h-[62px] w-[72px] shrink-0 overflow-hidden rounded-xl border-2 transition ${
              activeImage === index
                ? "border-fuchsia-500 shadow-[0_0_14px_rgba(168,85,247,0.25)]"
                : "border-[#152849] opacity-70 hover:border-cyan-400 hover:opacity-100"
            }`}
          >
            <img src={image} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
        <button
          onClick={() => onNotice("More artwork coming soon")}
          className="flex h-[62px] min-w-[72px] items-center justify-center rounded-xl border border-[#203555] bg-[#0a1730] text-sm text-blue-200 hover:border-cyan-400"
        >
          +5
        </button>
      </div>
    </div>
  );
}

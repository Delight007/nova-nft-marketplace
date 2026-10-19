"use client";

import { ChangeEvent, DragEvent, useRef } from "react";

import { FaCloudUploadAlt, FaImage, FaTimes } from "react-icons/fa";

interface UploadArtworkProps {
  image: string | null;
  onImageChange: (file: File) => void;
}

export default function UploadArtwork({
  image,
  onImageChange,
}: UploadArtworkProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file?: File) => {
    if (!file) return;

    onImageChange(file);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    handleFile(event.target.files?.[0]);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    handleFile(event.dataTransfer.files?.[0]);
  };

  return (
    <section className="rounded-2xl border border-blue-500/20 bg-[#031126]/80 p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">
          <span className="mr-2">1.</span>
          Upload Artwork
        </h2>

        <p className="mt-2 text-sm text-slate-400">
          Add your digital file. Supported formats: JPG, PNG, GIF, WEBP, MP4,
          MOV
        </p>
      </div>

      <div
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className="group cursor-pointer rounded-xl border border-dashed border-blue-500/50 bg-[#06152d] px-6 py-10 text-center transition hover:border-purple-500 hover:bg-[#081a37]"
      >
        <input
          ref={inputRef}
          type="file"
          hidden
          accept=".jpg,.jpeg,.png,.gif,.webp,.mp4,.mov"
          onChange={handleInputChange}
        />

        <FaCloudUploadAlt className="mx-auto text-5xl text-purple-500 transition group-hover:scale-110 group-hover:text-cyan-400" />

        <p className="mt-5 text-base font-medium text-white">
          Drag and drop your file here
        </p>

        <p className="my-2 text-sm text-slate-500">or</p>

        <button
          type="button"
          className="rounded-full bg-gradient-to-r from-purple-600 to-cyan-400 px-8 py-3 text-sm font-semibold text-white"
        >
          Choose File
        </button>

        <p className="mt-4 text-xs text-slate-400">
          Supports JPG, PNG, GIF, WEBP, MP4, MOV
        </p>

        <p className="mt-1 text-xs text-slate-500">Max size: 50MB</p>
      </div>

      <div className="mt-6">
        <p className="mb-3 text-sm font-medium text-white">Preview</p>

        {image ? (
          <div className="relative overflow-hidden rounded-xl border border-blue-500/20">
            <img
              src={image}
              alt="NFT artwork preview"
              className="h-[300px] w-full object-cover"
            />

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                // Parent can later expose a remove function.
              }}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur"
            >
              <FaTimes />
            </button>
          </div>
        ) : (
          <div className="flex h-[220px] items-center justify-center rounded-xl border border-blue-500/10 bg-[#06152d]">
            <div className="text-center text-slate-600">
              <FaImage className="mx-auto mb-3 text-3xl" />

              <p className="text-sm">Your artwork preview will appear here</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

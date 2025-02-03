"use client"

import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Canvas from "../components/canvas";
import Dropzone from "../components/dropzone";
import { visualizePerson } from "../lib/visualize-person";
import { XCircle as StartOverIcon } from "lucide-react";
import { Code as CodeIcon } from "lucide-react";

export default function Home() {
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);
  const [userUploadedImage, setUserUploadedImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userUploadedImage) {
      setError("Please upload an image");
      return;
    }

    const body = {
      image: await readAsDataURL(userUploadedImage)
    };

    const response = await fetch("/api/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const pred = await response.json();

    if (response.status !== 200) {
      setError(pred.detail);
      return;
    }

    const blobUrl = URL.createObjectURL(userUploadedImage);
    const img = new Image();
    img.crossOrigin = "anonymous"; // Add this if dealing with cross-origin images
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = blobUrl;
    });
    pred.visualize = visualizePerson(img, pred.bboxes, pred.vbboxes);
    setPrediction(pred);
    setUserUploadedImage(null);
  };

  const startOver = async (e) => {
    e.preventDefault();
    setPrediction(null);
    setError(null);
    setUserUploadedImage(null);
  };

  return (
    <div>
      <Head>
        <title>Inpainting with Ideogram v2 &amp; Replicate</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <main className="container mx-auto p-5">

        <div className="max-w-[min(1024px,100vw-40px)] mx-auto">
          <button className="bg-black text-white rounded-r-md text-sm font-medium px-4 py-2 flex-none" 
          onClick={startOver}
          >
            <StartOverIcon className="icon" />
            Start over
          </button>
          <button
            className="bg-black text-white rounded-r-md text-sm font-medium px-4 py-2 flex-none"
            onClick={handleSubmit}
          >
            Inferences
          </button>
        </div>


        <div className="border-hairline max-w-[min(1024px,100vw-40px)] mx-auto relative">
          <Dropzone
            onImageDropped={setUserUploadedImage}
            prediction={prediction}
            userUploadedImage={userUploadedImage}
          />
          <div
            className="bg-gray-50 relative w-full flex items-stretch"
            style={{ maxHeight: "min(768px, 100vw - 40px)", aspectRatio: "4 / 3" }}
          >
            <Canvas
              prediction={prediction}
              userUploadedImage={userUploadedImage}
            />
          </div>
        </div>

        <div className="max-w-[min(1024px,100vw-40px)] mx-auto">
          {error && <div className="text-red-700 bg-red-50 p-3 rounded-md mb-5">{error}</div>}

            <Link href="https://github.com/Minh090897/TNI-Test">
                <CodeIcon className="icon" />
                See how it&apos;s built on GitHub
            </Link>
          </div>
      </main>
    </div>
  );
}

function readAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onerror = reject;
    fr.onload = () => {
      resolve(fr.result);
    };
    fr.readAsDataURL(file);
  });
}
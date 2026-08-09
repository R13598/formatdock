declare module 'gifshot' {
  interface GifShotOptions {
    images?: string[];
    gifWidth?: number;
    gifHeight?: number;
    interval?: number;
    numFrames?: number;
    frameDuration?: number;
    fontWeight?: string;
    fontSize?: string;
    fontFamily?: string;
    fontColor?: string;
    textAlign?: string;
    textBaseline?: string;
    textXCoordinate?: number;
    textYCoordinate?: number;
    text?: string;
    transparent?: { r: number; g: number; b: number; alpha: number };
    progressCallback?: (captureProgress: number) => void;
    completeCallback?: (obj: { error: boolean; image: string; errorCode?: string; errorMsg?: string }) => void;
  }

  const gifshot: {
    createGIF: (options: GifShotOptions, callback: (obj: { error: boolean; image: string; errorCode?: string; errorMsg?: string }) => void) => void;
  };

  export default gifshot;
}

declare module 'jspdf' {
  export class jsPDF {
    constructor(options?: { orientation?: string; unit?: string; format?: string | number[] });
    internal: {
      pageSize: {
        getWidth: () => number;
        getHeight: () => number;
      };
    };
    addPage(format?: string | number[], orientation?: string): void;
    addImage(imageData: any, format: string, x: number, y: number, w: number, h: number): void;
    save(filename: string): void;
  }
  export default jsPDF;
}

declare module 'pdfjs-dist' {
  export const GlobalWorkerOptions: {
    workerSrc: string;
  };
  export function getDocument(params: any): {
    promise: Promise<any>;
  };
  const pdfjs: any;
  export default pdfjs;
}

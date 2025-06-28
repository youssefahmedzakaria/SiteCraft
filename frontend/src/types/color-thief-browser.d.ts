declare module 'color-thief-browser' {
  export function getColor(img: HTMLImageElement): Promise<[number, number, number]>;
  export function getPalette(img: HTMLImageElement, colorCount?: number): Promise<[number, number, number][]>;
  const _default: { getColor: typeof getColor; getPalette: typeof getPalette };
  export default _default;
} 
export interface Pick {
  kind: 'pane' | 'term' | 'zero' | 'xi';
  id: number;
  prime?: number;
  label: string;
  detail: string;
}
export function samePick(a: Pick | null, b: Pick | null) {
  return !!a && !!b && a.kind === b.kind && a.id === b.id;
}

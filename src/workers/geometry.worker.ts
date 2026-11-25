import { sampleRecord } from '../math/record';
import { sampleLocus } from '../math/locus';
interface Job {
  id: number;
  kind: 'record' | 'locus';
  count: number;
  sigma: number;
  centre: number;
}
self.onmessage = ({ data }: MessageEvent<Job>) => {
  const rows =
    data.kind === 'record' ? sampleRecord(data.count) : sampleLocus(data.sigma, data.centre);
  self.postMessage({ ...data, rows }, { transfer: [rows.buffer] });
};

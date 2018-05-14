import { HSLuvColor } from 'core/color/hsluv-color';
import mapColorToRegionID from 'core/image/quantz/popularity/map-color-to-region-id';

describe('should map a color to the correct region in the popularity algorithm', () => {
  it('should map [0, 0, 0] to the first region', () => {
    const regionID = mapColorToRegionID(new HSLuvColor([0, 0, 0]), [14, 9, 9]);

    expect(regionID).to.equal('0,14,0,9,0,9');
  });

  it('should map [282.4, 14.7, 73] to the correct region', () => {
    const regionID = mapColorToRegionID(new HSLuvColor([282.4, 14.7, 73]), [9, 10, 10]);

    expect(regionID).to.equal('279,288,10,20,70,80');
  });

  it('should map [17, 20.6, 25.3] to the correct region', () => {
    const regionID = mapColorToRegionID(new HSLuvColor([17, 20.6, 25.3]), [4, 25, 10]);

    expect(regionID).to.equal('16,20,0,25,20,30');
  });

  it('should map [312.9, 42, 77] to the correct region', () => {
    const regionID = mapColorToRegionID(new HSLuvColor([312.9, 42, 77.9]), [11, 1, 1]);

    expect(regionID).to.equal('308,319,42,43,77,78');
  });

  it('should map [359, 99, 99] to the last region', () => {
    const regionID = mapColorToRegionID(new HSLuvColor([359, 99, 99]), [5, 3, 8]);

    expect(regionID).to.equal('355,360,99,100,96,100');
  });

  it('should map [0, -14, 0] to an invalid region', () => {
    const regionID = mapColorToRegionID(new HSLuvColor([0, -14, 0]), [9, 9, 5]);

    expect(regionID).to.equal('0,9,,0,0,5');
  });

  it('should map [360, 0, 0] to an invalid region', () => {
    const regionID = mapColorToRegionID(new HSLuvColor([360, 0, 0]), [12, 5, 7]);

    expect(regionID).to.equal('360,,0,5,0,7');
  });
});

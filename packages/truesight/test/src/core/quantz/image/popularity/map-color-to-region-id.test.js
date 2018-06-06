import { HSLuvColor } from 'core/color/hsluv-color';
import mapColorToRegionID from 'core/quantz/image/popularity/map-color-to-region-id';

describe('should map a color to the correct region in the popularity algorithm', () => {
  it('should map [248.4, 13, 4.7] to the default black color region', () => {
    const regionID = mapColorToRegionID(new HSLuvColor([248.4, 13, 4.7]), [14.2, 9, 9]);

    expect(regionID).to.equal('0,14.2,0,10,0,5');
  });

  it('should map [4, 10, 95.4] to the default white color region', () => {
    const regionID = mapColorToRegionID(new HSLuvColor([4, 10, 95.4]), [5, 3, 8]);

    expect(regionID).to.equal('0,5,0,10,95,100');
  });

  it('should map [341.8, 7.49, 15] to the default gray color region', () => {
    const regionID = mapColorToRegionID(new HSLuvColor([341.8, 7.49, 15]), [5, 3, 8]);

    expect(regionID).to.equal('0,5,0,10,13,21');
  });

  it('should map [282.4, 14.7, 73] to the correct region', () => {
    const regionID = mapColorToRegionID(new HSLuvColor([282.4, 14.7, 73]), [9, 10, 10]);

    expect(regionID).to.equal('279,288,10,20,65,75');
  });

  it('should map [17, 20.6, 25.3] to the correct region', () => {
    const regionID = mapColorToRegionID(new HSLuvColor([17, 20.6, 25.3]), [4, 25.1, 10]);

    expect(regionID).to.equal('16,20,10,35.1,25,35');
  });

  it('should map [360, 28.4, 77.9] to the correct region', () => {
    const regionID = mapColorToRegionID(new HSLuvColor([360, 28.4, 77.9]), [11, 9.2, 1]);

    expect(regionID).to.equal('352,360,19.2,28.4,77,78');
  });

  it('should map [116, -14, 79.56] to an invalid region', () => {
    const regionID = mapColorToRegionID(new HSLuvColor([116, -14, 79.56]), [9, 9, 7.1]);

    expect(regionID).to.equal('108,117,,0,76,83.1');
  });

  it('should map [361, 42, 8.71] to an invalid region', () => {
    const regionID = mapColorToRegionID(new HSLuvColor([361, 42, 8.71]), [12, 5, 7]);

    expect(regionID).to.equal('360,,40,45,5,12');
  });
});

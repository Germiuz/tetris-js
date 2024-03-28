import {BlockType, getBlockArea} from '@app/store/game/areas.ts';
import {Block} from '@app/store/game/Block.ts';

describe('Block', () => {
  let block: Block;
  const type: BlockType = 'Hero';

  beforeEach(() => {
    block = new Block(type);
  });

  it('should correctly create a new block instance', () => {
    expect(block.type).toBe(type);
    expect(block.areaSize).toBe(getBlockArea(type).length);
  });

  it('should correctly return cell content', () => {
    const area = getBlockArea(type);
    expect(block.getCell(0, 0)).toBe(area[0][0]);
    expect(block.getCell(-1, -1)).toBe(0);
  });

  it('should correctly return points', () => {
    const points = block.getPoints();
    expect(points.length).toBe(block.areaSize);
  });

  it('should correctly rotate block to the left', () => {
    const initialArea = [...block["_area"]];
    block.rotate('left');
    block.rotate('right');
    expect(block["_area"]).toEqual(initialArea);
  });

  it('should correctly rotate block to the right', () => {
    const initialArea = [...block["_area"]];
    block.rotate('right');
    block.rotate('left');
    expect(block["_area"]).toEqual(initialArea);
  });
});

import {Game} from '@app/store/game';


describe('Game Class', () => {

  let game: Game;

  beforeEach(() => {
    game = new Game(20, 10);
  });

  it('should correctly initialize on construction', () => {
    expect(game instanceof Game).toBe(true);
  });

  it('should set the correct rows and columns on construction', () => {
    const rows = game.rows;
    const cols = game.cols;
    expect(rows).toBe(20);
    expect(cols).toBe(10);
  });

  it('should correctly start a new game', () => {
    game.startNewGame();
    expect(game.state).toBe('Started');
    expect(game.totalLines).toBe(0);
    expect(game.level).toBe(1);
    expect(game.score).toBe(0);
  });

  it('should correctly calculate score', () => {
    const perLine_1 = game['getScoreForLines'](1);
    const perLine_2 = game['getScoreForLines'](2);
    const perLine_3 = game['getScoreForLines'](3);
    const perLine_4 = game['getScoreForLines'](4);

    game['calcScore'](1);
    expect(game.score).toBe(perLine_1);

    game['calcScore'](2);
    expect(game.score).toBe(perLine_1 + perLine_2);

    game['calcScore'](3);
    expect(game.score).toBe(perLine_1 + perLine_2 + perLine_3);

    game['calcScore'](4);
    expect(game.score).toBe(perLine_1 + perLine_2 + perLine_3 + perLine_4);
  });

  it('should start and end a new game correctly', () => {
    game.startNewGame();

    while (game.state !== 'Over') {
      game.downBlock();
      game.nextBlock();
    }
    expect(game.state).toBe('Over');
  });

});

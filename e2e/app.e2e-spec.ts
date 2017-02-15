import { Playmonopoly2017Page } from './app.po';

describe('playmonopoly2017 App', function() {
  let page: Playmonopoly2017Page;

  beforeEach(() => {
    page = new Playmonopoly2017Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

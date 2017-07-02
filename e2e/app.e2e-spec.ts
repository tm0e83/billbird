import { Billbirdv3Page } from './app.po';

describe('billbirdv3 App', () => {
  let page: Billbirdv3Page;

  beforeEach(() => {
    page = new Billbirdv3Page();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});

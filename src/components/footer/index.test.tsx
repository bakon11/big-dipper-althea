import React from 'react';
import renderer from 'react-test-renderer';
import Footer from '.';

// ==================================
// unit tests
// ==================================
describe('component: layout/footer', () => {
  it('matches snapshot', () => {
    const mockDate = new Date(2017, 11, 10);
    jest
      .spyOn(global, 'Date')
      .mockImplementation(() => mockDate as any);

    const component = renderer.create(
      <Footer />,
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    expect(component.root.findAllByProps({
      className: 'footer__copyright',
    })[0].children).toEqual(['common:copyright', ' ', '2017']);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});

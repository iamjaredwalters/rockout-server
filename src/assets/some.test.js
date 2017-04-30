import sum, { canSpread } from './some';

it('sum', () => {
    const result = sum(3, 4);

    expect(result).toEqual(7);
});

it(`array can spread`, () => {
    const arr = [1, 2];

    const result = canSpread(arr);
    expect(result).toEqual([1, 2, 3]);
});

it(`obj can spread`, () => {
    const obj = { some: 'thing' };

    const result = canSpread(obj);
    expect(result).toEqual({ some: 'thing', test: 2 });
});

import { Test, TestingModule } from '@nestjs/testing';
import { MatchesService } from './matches.service';

describe('MatchesService', () => {
  let service: MatchesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MatchesService],
    }).compile();

    service = module.get<MatchesService>(MatchesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // *============== OBJECTS ==============* //
  it('test object', () => {
    const data = { name: 'santiago', lastname: 'sierra' };
    expect(data).toEqual({ name: 'santiago', lastname: 'sierra' });
  });

  // *============== TRUTHINESS ==============* //
  it('null', () => {
    const data = null;
    expect(data).toBeNull();
    expect(data).toBeDefined(); // es definido porque se define null
    expect(data).not.toBeUndefined();
    expect(data).not.toBeTruthy();
    expect(data).toBeFalsy();
  });

  it('zero', () => {
    const z = 0;
    expect(z).not.toBeNull();
    expect(z).toBeDefined();
    expect(z).not.toBeUndefined();
    expect(z).not.toBeTruthy();
    expect(z).toBeFalsy();
  });

  it('boolean', () => {
    expect(true).toEqual(true);
    expect(false).toEqual(false);

    expect(0).toBeFalsy();
    expect('').toBeFalsy();
    expect(null).toBeFalsy();
    expect(undefined).toBeFalsy();
    expect(false).toBeFalsy();
  });

  // *============== NUMBERS ==============* //
  it('two plus two', () => {
    const value = 2 + 2;
    expect(value).toBeGreaterThan(3);
    expect(value).toBeGreaterThanOrEqual(3.5);
    expect(value).toBeLessThan(5);
    expect(value).toBeLessThanOrEqual(4.5);

    // toBe and toEqual are equivalent for numbers
    expect(value).toBe(4);
    expect(value).toEqual(4);
  });
  // For floating point equality, use toBeCloseTo instead of toEqual, because you don't want a test to depend on a tiny rounding error.
  it('adding floating point numbers', () => {
    const value = 0.1 + 0.2;
    //expect(value).toBe(0.3);      // This won't work because of rounding error
    expect(value).toBeCloseTo(0.3); // This works.
  });

  // *============== STRINGS ==============* //
  // You can check strings against regular expressions with toMatch:
  it('there is no I in team', () => {
    expect('team').not.toMatch(/I/);
  });

  it('but there is a "stop" in Christoph', () => {
    expect('Christoph').toMatch(/stop/);
  });

  // *============== ARRAYS ==============* //
  // You can check if an array or iterable contains a particular item using toContain:
  const shoppingList = [
    'diapers',
    'kleenex',
    'trash bags',
    'paper towels',
    'milk',
  ];

  test('the shopping list has milk on it', () => {
    expect(shoppingList).toContain('milk'); // comprueba si el valor existe en el array
    expect(new Set(shoppingList)).toContain('milk'); // new Set() convierte el array en un objeto iterable
    expect([1, 2, 3, 4, 5]).toContain(3); // comprueba si el valor existe en el array
  });

  // *============== EXCEPTIONS ==============* //
  // If you want to test whether a particular function throws an error when it's called, use toThrow.
  function compileAndroidCode() {
    throw new Error('you are using the wrong JDK!');
  }

  test('compiling android goes as expected', () => {
    expect(() => compileAndroidCode()).toThrow();
    expect(() => compileAndroidCode()).toThrow(Error);

    // You can also use a string that must be contained in the error message or a regexp
    expect(() => compileAndroidCode()).toThrow('you are using the wrong JDK');
    expect(() => compileAndroidCode()).toThrow(/JDK/);

    // Or you can match an exact error message using a regexp like below
    expect(() => compileAndroidCode()).toThrow(/^you are using the wrong JDK$/); // Test fails
    expect(() => compileAndroidCode()).toThrow(
      /^you are using the wrong JDK!$/,
    ); // Test pass
  });
});

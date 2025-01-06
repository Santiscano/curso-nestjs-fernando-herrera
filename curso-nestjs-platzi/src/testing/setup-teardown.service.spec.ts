describe('SetupTeardownService', () => {
  beforeAll(() => {
    console.log('beforeAll');
    // up database
  });

  afterAll(() => {
    console.log('afterAll');
    // down database
  });

  it('case 1', () => {
    console.log('case 1');
  });

  it('case 2', () => {
    console.log('case 2');
  });

  describe('subgroup', () => {
    beforeAll(() => {
      console.log('beforeAll subgroup');
    });

    beforeEach(() => {
      console.log('beforeEach subgroup');
    });

    afterEach(() => {
      console.log('afterEach subgroup');
    });

    it('case 3', () => {
      console.log('case 3');
    });

    it('case 4', () => {
      console.log('case 4');
    });
  });
  // result final to console
  // beforeAll
  // case 1
  // case 2
  // beforeAll subgroup
  // beforeEach subgroup
  // case 3
  // afterEach subgroup
  // beforeEach subgroup
  // case 4
  // afterEach subgroup
  // afterAll subgroup
  // afterAll
});

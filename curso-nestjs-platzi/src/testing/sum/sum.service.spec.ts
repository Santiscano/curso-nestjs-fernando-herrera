import { Test, TestingModule } from '@nestjs/testing';
import { SumService } from './sum.service';

describe('SumService', () => {
  let service: SumService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SumService],
    }).compile();

    service = module.get<SumService>(SumService);
  });

  it('sum 1 + 2 should be 3', () => {
    expect(service.sum(1, 2)).toBe(3);
  });

  it('multiply 2 * 3 should be 6', () => {
    expect(service.multiply(2, 3)).toBe(6);
  });

  it('should divide', () => {
    expect(service.divide(6, 2)).toBe(3);
    expect(service.divide(5, 2)).toBe(2.5);
  });
});

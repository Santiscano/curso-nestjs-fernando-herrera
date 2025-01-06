import { Injectable, Get } from '@nestjs/common';

@Injectable()
export class MatchesService {

  @Get( ':id' )
  getMatches(): string {
    return 'This will return all matches';
  }
}

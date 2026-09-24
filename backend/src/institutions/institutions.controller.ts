import { Controller, Get, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InstitutionsService } from './institutions.service';
import { JwtAuthGuard } from '../auth/guards';

@ApiTags('Institutions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('institutions')
export class InstitutionsController {
  constructor(private readonly service: InstitutionsService) {}

  @Get()
  @ApiOperation({ summary: 'List all institutions' })
  findAll() {
    return this.service.findAll();
  }

  @Get('leaderboard')
  @ApiOperation({ summary: 'Institution leaderboard ranked by problems resolved' })
  leaderboard() {
    return this.service.getLeaderboard();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get institution details' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }
}

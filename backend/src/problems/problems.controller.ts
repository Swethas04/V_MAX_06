import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
  UploadedFiles,
  UseInterceptors,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiResponse } from '@nestjs/swagger';
import { ProblemsService } from './problems.service';
import { CreateProblemDto, ProblemsQueryDto, CheckSimilarDto, SupportProblemDto } from './dto/problem.dto';
import { JwtAuthGuard, OptionalJwtAuthGuard } from '../auth/guards';

@ApiTags('Problems')
@Controller('problems')
export class ProblemsController {
  constructor(private readonly service: ProblemsService) {}

  @Post()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({
    summary: 'Submit a new societal problem (public submission with no login wall, or authenticated user)',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FilesInterceptor('files', 5, {
      storage: diskStorage({
        destination: './uploads',
        filename: (_, file, cb) => {
          cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    }),
  )
  create(
    @Request() req: any,
    @Body() dto: CreateProblemDto,
    @UploadedFiles() files: Express.Multer.File[] = [],
  ) {
    const mediaFiles = files.map((f) => ({
      type: f.mimetype.startsWith('audio') ? ('voice' as const) : ('photo' as const),
      url: `/uploads/${f.filename}`,
    }));
    const userId = req.user?.id || null;
    return this.service.create(userId, dto, mediaFiles);
  }

  @Post('check-similar')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Check for similar problems via pgvector and predict theme category (as-you-type debounced)',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns duplicate analysis, similarity scores, and nearest theme classification.',
  })
  checkSimilar(@Body() dto: CheckSimilarDto) {
    return this.service.checkSimilar(dto);
  }

  @Post(':id/support')
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({
    summary: 'Add my voice to an existing problem instead of duplicating (upvotes + attaches evidence/media)',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FilesInterceptor('files', 5, {
      storage: diskStorage({
        destination: './uploads',
        filename: (_, file, cb) => {
          cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${extname(file.originalname)}`);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  supportProblem(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: any,
    @Body() dto: SupportProblemDto,
    @UploadedFiles() files: Express.Multer.File[] = [],
  ) {
    const mediaFiles = files.map((f) => ({
      type: f.mimetype.startsWith('audio') ? ('voice' as const) : ('photo' as const),
      url: `/uploads/${f.filename}`,
    }));
    const userId = req.user?.id || 'guest-citizen';
    return this.service.supportProblem(id, userId, dto?.message, mediaFiles);
  }

  @Get()
  @ApiOperation({ summary: 'List all problems with optional filters (admin/institution/public)' })
  findAll(@Query() query: ProblemsQueryDto) {
    return this.service.findAll(query);
  }

  @Get('mine')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "Get the authenticated citizen's own submissions" })
  findMine(@Request() req: any, @Query('page') page = 1, @Query('limit') limit = 20) {
    return this.service.findMine(req.user.id, +page, +limit);
  }

  @Get('nearby')
  @ApiOperation({ summary: 'Get problems near a coordinate (PostGIS radius)' })
  findNearby(
    @Query('lat') lat: number,
    @Query('lng') lng: number,
    @Query('radius') radius = 50,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.service.findNearby(+lat, +lng, +radius, +page, +limit);
  }

  @Get('similar')
  @ApiOperation({ summary: 'Find semantically similar problems (query parameter backward compatibility)' })
  findSimilar(@Query('q') q: string) {
    return this.service.findSimilar(q);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single problem with full details' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.findOne(id);
  }

  @Post(':id/upvote')
  @ApiBearerAuth()
  @UseGuards(OptionalJwtAuthGuard)
  @ApiOperation({ summary: 'Upvote / "Me Too" an existing problem' })
  upvote(@Param('id', ParseUUIDPipe) id: string, @Request() req: any) {
    const userId = req.user?.id || 'guest-citizen';
    return this.service.upvote(id, userId);
  }
}

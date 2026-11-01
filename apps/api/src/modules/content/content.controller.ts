import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Headers,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/auth.guard';
import { TenantGuard } from '../../common/guards/tenant.guard';
import { ContentService } from './content.service';
import {
  GenerateContentPipelineDto,
  CreateDraftDto,
  UpdateContentDto,
  CreateSlideDto,
  UpdateSlideDto,
  UploadMediaDto,
} from './content.dto';

@Controller('content')
@UseGuards(JwtAuthGuard, TenantGuard)
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post('generate-pipeline')
  async generatePipeline(
    @Headers('x-business-id') businessId: string,
    @Body() dto: GenerateContentPipelineDto
  ) {
    return this.contentService.generatePipeline(businessId, dto);
  }

  @Post('draft')
  async createDraft(
    @Headers('x-business-id') businessId: string,
    @Body() dto: CreateDraftDto
  ) {
    return this.contentService.createDraft(businessId, dto);
  }

  @Get()
  async findAll(
    @Headers('x-business-id') businessId: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('campaignId') campaignId?: string
  ) {
    return this.contentService.findAll(businessId, { status, search, campaignId });
  }

  @Get('media')
  async getMediaAssets(
    @Headers('x-business-id') businessId: string,
    @Query('search') search?: string
  ) {
    return this.contentService.getMediaAssets(businessId, search);
  }

  @Post('media')
  async uploadMedia(
    @Headers('x-business-id') businessId: string,
    @Body() dto: UploadMediaDto
  ) {
    return this.contentService.uploadMedia(businessId, dto);
  }

  @Delete('media/:mediaId')
  async deleteMedia(
    @Headers('x-business-id') businessId: string,
    @Param('mediaId') mediaId: string
  ) {
    return this.contentService.deleteMediaAsset(businessId, mediaId);
  }

  @Get(':id')
  async findOne(
    @Headers('x-business-id') businessId: string,
    @Param('id') id: string
  ) {
    return this.contentService.findOne(businessId, id);
  }

  @Put(':id')
  async update(
    @Headers('x-business-id') businessId: string,
    @Param('id') id: string,
    @Body() dto: UpdateContentDto
  ) {
    return this.contentService.update(businessId, id, dto);
  }

  @Delete(':id')
  async delete(
    @Headers('x-business-id') businessId: string,
    @Param('id') id: string
  ) {
    return this.contentService.delete(businessId, id);
  }

  @Post(':id/slides')
  async addSlide(
    @Headers('x-business-id') businessId: string,
    @Param('id') id: string,
    @Body() dto: CreateSlideDto
  ) {
    return this.contentService.addSlide(businessId, id, dto);
  }

  @Put(':id/slides/:slideNumber')
  async updateSlide(
    @Headers('x-business-id') businessId: string,
    @Param('id') id: string,
    @Param('slideNumber', ParseIntPipe) slideNumber: number,
    @Body() dto: UpdateSlideDto
  ) {
    return this.contentService.updateSlide(businessId, id, slideNumber, dto);
  }

  @Delete(':id/slides/:slideNumber')
  async deleteSlide(
    @Headers('x-business-id') businessId: string,
    @Param('id') id: string,
    @Param('slideNumber', ParseIntPipe) slideNumber: number
  ) {
    return this.contentService.deleteSlide(businessId, id, slideNumber);
  }

  @Post(':id/slides/:slideNumber/duplicate')
  async duplicateSlide(
    @Headers('x-business-id') businessId: string,
    @Param('id') id: string,
    @Param('slideNumber', ParseIntPipe) slideNumber: number
  ) {
    return this.contentService.duplicateSlide(businessId, id, slideNumber);
  }

  @Get(':id/export')
  async exportCarousel(
    @Headers('x-business-id') businessId: string,
    @Param('id') id: string,
    @Query('format') format?: 'json' | 'html'
  ) {
    return this.contentService.exportCarousel(businessId, id, format || 'json');
  }
}

export class GenerateContentPipelineDto {
  objective!: string;
  targetPlatforms!: string[]; // 'instagram', 'linkedin', 'x'
  format?: 'text' | 'image' | 'carousel';
  carouselSlideCount?: number;
  campaignId?: string;
  generateImages?: boolean;
}

export class CreateDraftDto {
  title!: string;
  masterCopy!: string;
  targetPlatforms!: string[];
  campaignId?: string;
  variants?: Record<string, { text: string; hashtags: string[]; mediaUrls?: string[] }>;
  carouselSlides?: {
    slideNumber: number;
    headline: string;
    bodyText: string;
    imageUrl?: string;
    callToAction?: string;
    backgroundColor?: string;
    textColor?: string;
  }[];
}

export class UpdateContentDto {
  title?: string;
  masterCopy?: string;
  status?: string;
  carouselSlides?: {
    slideNumber: number;
    headline: string;
    bodyText: string;
    imageUrl?: string;
    callToAction?: string;
    backgroundColor?: string;
    textColor?: string;
  }[];
  variants?: Record<string, { text: string; hashtags: string[]; mediaUrls?: string[] }>;
}

export class CreateSlideDto {
  slideNumber!: number;
  headline!: string;
  bodyText!: string;
  imageUrl?: string;
  callToAction?: string;
  backgroundColor?: string;
  textColor?: string;
}

export class UpdateSlideDto {
  headline?: string;
  bodyText?: string;
  imageUrl?: string;
  callToAction?: string;
  backgroundColor?: string;
  textColor?: string;
}

export class ReorderSlidesDto {
  slideNumbers!: { oldNumber: number; newNumber: number }[];
}

export class UploadMediaDto {
  url!: string;
  fileType!: string; // 'image/png', 'image/jpeg', 'video/mp4'
  fileSize!: number;
  width?: number;
  height?: number;
  contentId?: string;
}

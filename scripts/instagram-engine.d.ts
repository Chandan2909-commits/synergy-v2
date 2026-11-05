export interface VelocityStatus {
  isCloud?: boolean;
  postsCountToday: number;
  maxDaily: number;
  canPost: boolean;
  lastPostAt: string | null;
  hasAuthSession: boolean;
}

export interface PublishOptions {
  imagePaths: string[];
  caption?: string;
  headless?: boolean;
  force?: boolean;
  stealthMode?: boolean;
  onProgress?: (message: string) => void;
}

export interface PublishResult {
  success: boolean;
  record: any;
  message: string;
}

export interface ScheduledInstagramPost {
  id: string;
  title: string;
  slides: string[];
  slidePaths?: string[];
  caption: string;
  scheduledFor: string;
  status: 'scheduled' | 'publishing' | 'published' | 'failed';
  platform?: string;
  platforms?: string[];
  createdAt: string;
  publishedAt?: string;
  error?: string;
  result?: any;
}

export function checkVelocityStatus(): VelocityStatus;
export function recordInstagramLogin(onStatus?: (msg: string) => void): Promise<{ success: boolean; authPath: string }>;
export function publishToInstagram(options: PublishOptions): Promise<PublishResult>;
export function ensureStorageDir(): void;
export function getScheduledPosts(): ScheduledInstagramPost[];
export function saveScheduledPosts(posts: ScheduledInstagramPost[]): void;
export function addScheduledPost(post: ScheduledInstagramPost): ScheduledInstagramPost;
export function updateScheduledPost(id: string, updates: Partial<ScheduledInstagramPost>): ScheduledInstagramPost | null;
export function removeScheduledPost(id: string): boolean;


export interface VelocityStatus {
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

export function checkVelocityStatus(): VelocityStatus;
export function recordInstagramLogin(onStatus?: (msg: string) => void): Promise<{ success: boolean; authPath: string }>;
export function publishToInstagram(options: PublishOptions): Promise<PublishResult>;
export function ensureStorageDir(): void;

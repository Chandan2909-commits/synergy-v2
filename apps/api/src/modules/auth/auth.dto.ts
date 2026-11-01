export class RegisterDto {
  email!: string;
  password!: string;
  fullName!: string;
  organizationName!: string;
  initialBusinessName?: string;
  industry?: string;
}

export class LoginDto {
  email!: string;
  password!: string;
}

export class InviteMemberDto {
  email!: string;
  role!: string;
  businessId?: string;
}

export class CreateBusinessDto {
  name!: string;
  description?: string;
  industry?: string;
  timezone?: string;
}

export class UpdateBrandKitDto {
  brandName!: string;
  tagline?: string;
  websiteUrl?: string;
  logoUrl?: string;
  iconUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  backgroundColor?: string;
  headingFont?: string;
  bodyFont?: string;
  brandVoice?: string[];
  targetAudience?: string;
  productsAndServices?: string[];
  preferredHashtags?: string[];
  contentRestrictions?: string[];
}


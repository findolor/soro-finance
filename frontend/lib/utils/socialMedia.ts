import { ProjectRow } from "./types";

/**
 * Social media link type
 */
export type SocialMediaLink = {
  platform: string;
  url: string;
};

// Platform display name mapping
export const PLATFORM_MAP: Record<string, string> = {
  twitter: "Twitter",
  discord: "Discord",
  github: "GitHub",
  telegram: "Telegram",
  linkedin: "LinkedIn",
  facebook: "Facebook",
  instagram: "Instagram",
  youtube: "YouTube",
  medium: "Medium",
  default: "Link",
};

/**
 * Get the display name for a social media platform
 */
export function getPlatformDisplayName(platform: string): string {
  return PLATFORM_MAP[platform.toLowerCase()] || PLATFORM_MAP.default;
}

/**
 * Get an icon representation for a social media platform
 * This is a placeholder. In a real implementation, you would use actual icons
 */
export function getPlatformIcon(platform: string): string {
  return platform.charAt(0).toUpperCase();
}

/**
 * Extract social media links from a project
 */
export function getSocialMediaLinks(project: ProjectRow): SocialMediaLink[] {
  if (!project.social_media_links) return [];
  return project.social_media_links as SocialMediaLink[];
}

// Custom storage configuration for existing bucket baltzakisthemis.com
export const customStorage = {
  bucket: 'baltzakisthemis.com',
  region: 'eu-central-1',
  baseUrl: 'https://baltzakisthemis.com',

  // Get public URL for images (since bucket has public read access)
  getImageUrl(key: string): string {
    // If key already includes full path, return as is
    if (key.startsWith('http')) {
      return key;
    }
    // If key starts with images/, use the bucket URL
    if (key.startsWith('images/')) {
      return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
    }
    // Otherwise, assume it's in the images folder
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/images/${key}`;
  },

  // List images in the bucket (for future use)
  async listImages(): Promise<string[]> {
    // This would require backend implementation for security
    // For now, return empty array
    return [];
  },

  // For future upload functionality - would need backend API
  async uploadImage(): Promise<string> {
    // This would require a backend API endpoint for secure uploads
    throw new Error('Upload functionality requires backend implementation');
  },
};
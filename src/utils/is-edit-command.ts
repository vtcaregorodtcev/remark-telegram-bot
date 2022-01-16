// skip check when we edit Bookmarks
export const isEditCommand = (msg: string): boolean => msg.startsWith('✏️ ');
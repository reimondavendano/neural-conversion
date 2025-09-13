export const FILE_FORMATS = {
  image: {
    extensions: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp', 'tiff'],
    icon: '🖼️',
    category: 'Image'
  },
  video: {
    extensions: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv', '3gp'],
    icon: '🎥',
    category: 'Video'
  },
  audio: {
    extensions: ['mp3', 'wav', 'flac', 'aac', 'ogg', 'wma', 'm4a'],
    icon: '🎵',
    category: 'Audio'
  },
  document: {
    extensions: ['pdf', 'docx', 'doc', 'txt', 'rtf', 'odt'],
    icon: '📄',
    category: 'Document'
  },
  spreadsheet: {
    extensions: ['xlsx', 'xls', 'csv', 'ods'],
    icon: '📊',
    category: 'Spreadsheet'
  },
  archive: {
    extensions: ['zip', 'rar', '7z', 'tar', 'gz'],
    icon: '📦',
    category: 'Archive'
  }
};

export const getAllFormats = () => {
  return Object.values(FILE_FORMATS).flatMap(category => category.extensions);
};

export const getFormatCategory = (extension: string) => {
  for (const [key, category] of Object.entries(FILE_FORMATS)) {
    if (category.extensions.includes(extension.toLowerCase())) {
      return { key, ...category };
    }
  }
  return null;
};

export const getFileExtension = (filename: string) => {
  return filename.split('.').pop()?.toLowerCase() || '';
};
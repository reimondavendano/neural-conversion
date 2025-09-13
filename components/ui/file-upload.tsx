'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Link, Zap, FileText, Music, Video, Image, Archive, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FILE_FORMATS, getFormatCategory, getFileExtension } from '@/lib/file-formats';

interface FileUploadProps {
  onFileSelect: (file: File, targetFormat: string) => void;
  onUrlSubmit: (url: string, targetFormat: string) => void;
}

const formatIcons: Record<string, React.ComponentType<any>> = {
  document: FileText,
  audio: Music,
  video: Video,
  image: Image,
  archive: Archive,
  spreadsheet: FileSpreadsheet,
};

export function FileUpload({ onFileSelect, onUrlSubmit }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState<string>('');
  const [urlInput, setUrlInput] = useState('');
  const [urlTargetFormat, setUrlTargetFormat] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
      
      // Auto-suggest target formats based on file type
      const extension = getFileExtension(file.name);
      const category = getFormatCategory(extension);
      
      if (category) {
        // Suggest a different format from the same category
        const otherFormats = category.extensions.filter(ext => ext !== extension);
        if (otherFormats.length > 0) {
          setTargetFormat(otherFormats[0]);
        }
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    multiple: false,
    maxSize: 100 * 1024 * 1024, // 100MB
  });

  const handleFileConvert = () => {
    if (selectedFile && targetFormat) {
      onFileSelect(selectedFile, targetFormat);
      setSelectedFile(null);
      setTargetFormat('');
    }
  };

  const handleUrlConvert = () => {
    if (urlInput && urlTargetFormat) {
      onUrlSubmit(urlInput, urlTargetFormat);
      setUrlInput('');
      setUrlTargetFormat('');
    }
  };

  const getFileIcon = (filename: string) => {
    const extension = getFileExtension(filename);
    const category = getFormatCategory(extension);
    if (category) {
      const IconComponent = formatIcons[category.key] || FileText;
      return <IconComponent size={24} className="text-cyan-400" />;
    }
    return <FileText size={24} className="text-cyan-400" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-800/50 border border-gray-700">
          <TabsTrigger 
            value="upload" 
            className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 data-[state=active]:border-cyan-500/50"
          >
            <Upload size={16} className="mr-2" />
            Upload File
          </TabsTrigger>
          <TabsTrigger 
            value="url"
            className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400 data-[state=active]:border-cyan-500/50"
          >
            <Link size={16} className="mr-2" />
            From URL
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <motion.div
          {...getRootProps}
          className={`
            relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300
            ${isDragActive 
              ? 'border-cyan-400 bg-cyan-400/5 scale-[1.02]' 
              : 'border-gray-700 hover:border-gray-600 hover:bg-gray-800/50'
            }
          `}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
            <input {...getInputProps()} />
            
            <AnimatePresence mode="wait">
              {selectedFile ? (
                <motion.div
                  key="file-selected"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-center gap-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                    {getFileIcon(selectedFile.name)}
                    <div className="text-left">
                      <p className="font-medium text-white truncate max-w-xs">
                        {selectedFile.name}
                      </p>
                      <p className="text-sm text-gray-400">
                        {formatFileSize(selectedFile.size)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-300">
                      Convert to:
                    </label>
                    <Select value={targetFormat} onValueChange={setTargetFormat}>
                      <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                        <SelectValue placeholder="Select target format" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-600">
                        {Object.entries(FILE_FORMATS).map(([key, category]) => (
                          <div key={key}>
                            <div className="px-2 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                              {category.icon} {category.category}
                            </div>
                            {category.extensions.map((ext) => (
                              <SelectItem 
                                key={ext} 
                                value={ext}
                                className="text-white hover:bg-gray-700"
                              >
                                .{ext.toUpperCase()}
                              </SelectItem>
                            ))}
                          </div>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={handleFileConvert}
                    disabled={!targetFormat}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-black font-semibold"
                  >
                    <Zap size={16} className="mr-2" />
                    Start Neural Conversion
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="upload-prompt"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full flex items-center justify-center border border-cyan-500/30">
                    <Upload size={32} className="text-cyan-400" />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Upload Your File
                    </h3>
                    <p className="text-gray-400 mb-4">
                      Drag and drop your file here, or click to browse
                    </p>
                    <p className="text-xs text-gray-500">
                      Supports: Images, Videos, Audio, Documents, Spreadsheets, Archives
                    </p>
                    <p className="text-xs text-gray-500">
                      Maximum file size: 100MB
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </TabsContent>

        <TabsContent value="url" className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                File URL:
              </label>
              <Input
                type="url"
                placeholder="https://example.com/file.pdf"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                Convert to:
              </label>
              <Select value={urlTargetFormat} onValueChange={setUrlTargetFormat}>
                <SelectTrigger className="bg-gray-800/50 border-gray-600 text-white">
                  <SelectValue placeholder="Select target format" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {Object.entries(FILE_FORMATS).map(([key, category]) => (
                    <div key={key}>
                      <div className="px-2 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        {category.icon} {category.category}
                      </div>
                      {category.extensions.map((ext) => (
                        <SelectItem 
                          key={ext} 
                          value={ext}
                          className="text-white hover:bg-gray-700"
                        >
                          .{ext.toUpperCase()}
                        </SelectItem>
                      ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleUrlConvert}
              disabled={!urlInput || !urlTargetFormat}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-black font-semibold"
            >
              <Zap size={16} className="mr-2" />
              Convert from URL
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Supported Formats */}
      <div className="bg-gray-800/30 rounded-lg p-4 border border-gray-700">
        <h4 className="text-sm font-semibold text-gray-300 mb-3">Supported Formats:</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
          {Object.entries(FILE_FORMATS).map(([key, category]) => (
            <div key={key} className="flex items-center gap-2 text-gray-400">
              <span>{category.icon}</span>
              <span>{category.category}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
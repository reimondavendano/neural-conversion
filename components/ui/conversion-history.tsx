'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  FileText, 
  Music, 
  Video, 
  Image, 
  Archive, 
  FileSpreadsheet,
  ExternalLink,
  Upload
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockConversions, type Conversion } from '@/lib/supabase-types';
import { getFormatCategory } from '@/lib/file-formats';

const formatIcons: Record<string, React.ComponentType<any>> = {
  document: FileText,
  audio: Music,
  video: Video,
  image: Image,
  archive: Archive,
  spreadsheet: FileSpreadsheet,
};

const statusConfig = {
  pending: {
    icon: Clock,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/10',
    borderColor: 'border-yellow-400/20',
    label: 'Pending'
  },
  processing: {
    icon: Loader2,
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
    borderColor: 'border-blue-400/20',
    label: 'Processing'
  },
  completed: {
    icon: CheckCircle,
    color: 'text-green-400',
    bgColor: 'bg-green-400/10',
    borderColor: 'border-green-400/20',
    label: 'Completed'
  },
  failed: {
    icon: XCircle,
    color: 'text-red-400',
    bgColor: 'bg-red-400/10',
    borderColor: 'border-red-400/20',
    label: 'Failed'
  }
};

export function ConversionHistory() {
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setConversions(mockConversions);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Simulate real-time updates for processing conversions
  useEffect(() => {
    const interval = setInterval(() => {
      setConversions(prev => prev.map(conversion => {
        if (conversion.conversion_status === 'pending') {
          return { ...conversion, conversion_status: 'processing' };
        }
        if (conversion.conversion_status === 'processing') {
          // 70% chance to complete, 30% chance to stay processing
          if (Math.random() > 0.3) {
            return {
              ...conversion,
              conversion_status: 'completed',
              download_url: `https://example.com/downloads/${conversion.id}.${conversion.target_format}`,
              completed_at: new Date().toISOString()
            };
          }
        }
        return conversion;
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const getFileIcon = (originalFormat: string) => {
    const category = getFormatCategory(originalFormat);
    if (category) {
      const IconComponent = formatIcons[category.key] || FileText;
      return <IconComponent size={20} className="text-cyan-400" />;
    }
    return <FileText size={20} className="text-cyan-400" />;
  };

  const handleDownload = (downloadUrl: string, filename: string) => {
    // In a real app, this would trigger the actual download
    window.open(downloadUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3 text-gray-400">
            <Loader2 size={24} className="animate-spin text-cyan-400" />
            <span>Loading neural processing queue...</span>
          </div>
        </div>
      </div>
    );
  }

  if (conversions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-gray-700/20 to-gray-600/20 rounded-full flex items-center justify-center border border-gray-600/30 mb-4">
          <FileText size={32} className="text-gray-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-300 mb-2">No Conversions Yet</h3>
        <p className="text-gray-500">
          Start converting files to see your processing history here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Processing Queue</h3>
        <Badge variant="outline" className="border-cyan-500/30 text-cyan-400">
          {conversions.length} conversions
        </Badge>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
        <AnimatePresence>
          {conversions.map((conversion, index) => {
            const status = statusConfig[conversion.conversion_status];
            const StatusIcon = status.icon;

            return (
              <motion.div
                key={conversion.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  p-4 rounded-lg border backdrop-blur-sm transition-all duration-300
                  ${status.bgColor} ${status.borderColor}
                  hover:shadow-lg hover:shadow-cyan-500/10
                `}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0 mt-1">
                      {getFileIcon(conversion.original_format)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-white truncate">
                          {conversion.original_filename}
                        </h4>
                        {conversion.input_method === 'link' && (
                          <ExternalLink size={14} className="text-gray-400 flex-shrink-0" />
                        )}
                        {conversion.input_method === 'upload' && (
                          <Upload size={14} className="text-gray-400 flex-shrink-0" />
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                        <span className="uppercase font-mono">
                          {conversion.original_format}
                        </span>
                        <span>→</span>
                        <span className="uppercase font-mono text-cyan-400">
                          {conversion.target_format}
                        </span>
                        <span>•</span>
                        <span>{formatFileSize(conversion.file_size)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <StatusIcon 
                          size={16} 
                          className={`${status.color} ${
                            conversion.conversion_status === 'processing' ? 'animate-spin' : ''
                          }`} 
                        />
                        <span className={`text-sm font-medium ${status.color}`}>
                          {status.label}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatTimeAgo(conversion.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-shrink-0">
                    {conversion.conversion_status === 'completed' && conversion.download_url && (
                      <Button
                        size="sm"
                        onClick={() => handleDownload(conversion.download_url!, conversion.original_filename)}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-black font-medium"
                      >
                        <Download size={14} className="mr-1" />
                        Download
                      </Button>
                    )}
                    
                    {conversion.conversion_status === 'processing' && (
                      <div className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-md">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                          <span className="text-xs text-blue-400 font-medium">Processing</span>
                        </div>
                      </div>
                    )}
                    
                    {conversion.conversion_status === 'failed' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                      >
                        Retry
                      </Button>
                    )}
                  </div>
                </div>

                {conversion.conversion_status === 'processing' && (
                  <div className="mt-3">
                    <div className="w-full bg-gray-700 rounded-full h-1.5">
                      <motion.div
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1.5 rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: "75%" }}
                        transition={{ duration: 2, ease: "easeInOut" }}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
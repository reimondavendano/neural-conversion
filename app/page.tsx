'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { Zap, Bot, Cpu, Sparkles } from 'lucide-react';
import { FileUpload } from '@/components/ui/file-upload';
import { ConversionHistory } from '@/components/ui/conversion-history';
import { CircuitBackground } from '@/components/ui/circuit-background';
import { Conversion, ConversionStatus } from '@/lib/supabase-types';

export default function Home() {
  const [conversions, setConversions] = useState<Conversion[]>([]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const activeConversions = conversions.filter(c =>
        c.conversion_status === 'pending' || c.conversion_status === 'processing'
      );

      if (activeConversions.length === 0) return;

      const updatedConversions = await Promise.all(activeConversions.map(async (c) => {
        try {
          const res = await fetch(`/api/convert?jobId=${c.id}`);
          const data = await res.json();

          if (data.success) {
            let status: ConversionStatus = 'pending';
            const cloudStatus = data.status.toLowerCase();

            if (cloudStatus === 'waiting' || cloudStatus === 'queued') status = 'pending';
            else if (cloudStatus === 'processing' || cloudStatus === 'uploading') status = 'processing';
            else if (cloudStatus === 'finished') status = 'completed';
            else if (cloudStatus === 'error') status = 'failed';

            return {
              ...c,
              conversion_status: status,
              download_url: data.exportUrl,
              original_filename: data.originalFilename || c.original_filename
            };
          }
        } catch (e) {
          console.error(e);
        }
        return c;
      }));

      setConversions(prev => prev.map(c => {
        const updated = updatedConversions.find(uc => uc.id === c.id);
        return updated || c;
      }));

    }, 3000);

    return () => clearInterval(interval);
  }, [conversions]);

  const handleFileConversion = async (file: File, targetFormat: string) => {
    const toastId = toast.loading('Initializing conversion...');

    try {
      const formData = new FormData();
      formData.append('targetFormat', targetFormat);
      formData.append('inputMethod', 'upload');

      const initResponse = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });

      const initData = await initResponse.json();

      if (!initData.success) {
        throw new Error(initData.error || 'Failed to initialize');
      }

      const { jobId, uploadTask } = initData;

      // Add to state immediately
      const newConversion: Conversion = {
        id: jobId,
        original_filename: file.name,
        original_format: file.name.split('.').pop()?.toLowerCase() || '',
        target_format: targetFormat,
        file_size: file.size,
        conversion_status: 'pending',
        input_method: 'upload',
        created_at: new Date().toISOString()
      };

      setConversions(prev => [newConversion, ...prev]);

      // Upload file
      toast.loading('Uploading file...', { id: toastId });

      const { url, parameters } = uploadTask.result.form;
      const uploadFormData = new FormData();
      Object.keys(parameters).forEach(key => uploadFormData.append(key, parameters[key]));
      uploadFormData.append('file', file);

      await fetch(url, {
        method: 'POST',
        body: uploadFormData,
      });

      toast.success('File uploaded. Processing started.', { id: toastId });

      // Update status to processing locally (polling will correct it)
      setConversions(prev => prev.map(c =>
        c.id === jobId ? { ...c, conversion_status: 'processing' } : c
      ));

    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to start conversion', { id: toastId });
    }
  };

  const handleUrlConversion = async (url: string, targetFormat: string) => {
    const toastId = toast.loading('Initializing remote conversion...');

    try {
      const formData = new FormData();
      formData.append('sourceUrl', url);
      formData.append('targetFormat', targetFormat);
      formData.append('inputMethod', 'link');

      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        const newConversion: Conversion = {
          id: result.jobId,
          original_filename: url.split('/').pop() || 'remote-file',
          original_format: url.split('.').pop()?.toLowerCase() || '',
          target_format: targetFormat,
          file_size: 0, // Unknown initially
          conversion_status: 'pending',
          input_method: 'link',
          source_url: url,
          created_at: new Date().toISOString()
        };

        setConversions(prev => [newConversion, ...prev]);
        toast.success('Remote conversion started', { id: toastId });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to start remote conversion', { id: toastId });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <CircuitBackground />

      <div className="relative z-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-b border-gray-800/50 backdrop-blur-sm bg-black/20"
        >
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-3"
              >
                <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl shadow-lg shadow-cyan-500/25">
                  <Bot size={28} className="text-black" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    NeuralConvert
                  </h1>
                  <p className="text-xs text-gray-400">File Conversion</p>
                </div>
              </motion.div>

              <div className="flex items-center gap-4">
                <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400">
                  <Cpu size={16} className="text-cyan-400" />
                  <span>Quantum Processing</span>
                </div>
                <div className="flex items-center gap-1">
                  <Sparkles size={16} className="text-yellow-400" />
                  <span className="text-sm font-medium">Neural Network</span>
                </div>
              </div>
            </div>
          </div>
        </motion.header>

        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="py-16 px-6"
        >
          <div className="container mx-auto text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-full px-6 py-3 mb-6">
                <Zap size={18} className="text-cyan-400" />
                <span className="text-sm font-medium text-cyan-400">Lightning Fast • Neural Processing</span>
              </div>

              <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-cyan-200 to-blue-400 bg-clip-text text-transparent leading-tight">
                Convert Files with
                <br />
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Precision
                </span>
              </h2>

              <p className="text-xl text-gray-300 mb-4 max-w-2xl mx-auto leading-relaxed">
                Experience next-generation file conversion powered by advanced neural networks.
                Transform any file format with quantum-speed processing.
              </p>
            </motion.div>
          </div>
        </motion.section>

        {/* Main Content */}
        <div className="container mx-auto px-6 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
            {/* Upload Section */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              <div className="text-center lg:text-left">
                <h3 className="text-2xl font-bold text-white mb-2">Convert Your Files</h3>
                <p className="text-gray-400">
                  Upload files or provide URLs for conversion
                </p>
              </div>

              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 shadow-2xl">
                <FileUpload
                  onFileSelect={handleFileConversion}
                  onUrlSubmit={handleUrlConversion}
                />
              </div>
            </motion.div>

            {/* History Section */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-6"
            >
              <div className="text-center lg:text-left">
                <h3 className="text-2xl font-bold text-white mb-2">Processing Dashboard</h3>
                <p className="text-gray-400">
                  Monitor conversions with our neural processing dashboard
                </p>
              </div>

              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 shadow-2xl">
                <ConversionHistory conversions={conversions} />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="border-t border-gray-800/50 bg-black/20 backdrop-blur-sm py-8"
        >
          <div className="container mx-auto px-6 text-center">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-gray-400">
                <Bot size={18} className="text-cyan-400" />
                <span>Powered by Advanced Neural Networks</span>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-400">
                <span>© 2025 NeuralConvert</span>
              </div>
            </div>
          </div>
        </motion.footer>
      </div>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1f2937',
            color: '#ffffff',
            border: '1px solid #374151',
            fontSize: '14px',
          },
          success: {
            iconTheme: {
              primary: '#00ffff',
              secondary: '#000000',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />
    </div>
  );
}
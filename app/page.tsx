'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import { Zap, Bot, Cpu, Sparkles } from 'lucide-react';
import { FileUpload } from '@/components/ui/file-upload';
import { ConversionHistory } from '@/components/ui/conversion-history';
import { CircuitBackground } from '@/components/ui/circuit-background';

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleFileConversion = async (file: File, targetFormat: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('targetFormat', targetFormat);
    formData.append('inputMethod', 'upload');

    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        toast.success(`🚀 Neural conversion initiated: ${file.name} → ${targetFormat.toUpperCase()}`);
        setRefreshKey(prev => prev + 1);
      } else {
        toast.error('⚠️ Neural processing failed to initialize');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('🔥 System error: Neural network offline');
    }
  };

  const handleUrlConversion = async (url: string, targetFormat: string) => {
    const formData = new FormData();
    formData.append('sourceUrl', url);
    formData.append('targetFormat', targetFormat);
    formData.append('inputMethod', 'link');

    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        toast.success(`🌐 Remote neural processing: URL → ${targetFormat.toUpperCase()}`);
        setRefreshKey(prev => prev + 1);
      } else {
        toast.error('⚠️ Remote neural link failed');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('🔥 Network error: Unable to establish neural connection');
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
                Transform any file format with quantum-speed processing. <strong>This is a mockup demonstration.</strong>
              </p>
              
              <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Demo Mode Active</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                  <span>Simulated Processing</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                  <span>Mockup Interface</span>
                </div>
              </div>
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
                <h3 className="text-2xl font-bold text-white mb-2">Convert Your Files (Demo)</h3>
                <p className="text-gray-400">
                  Upload files or provide URLs for simulated conversion
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
                  Monitor simulated conversions with our neural processing dashboard
                </p>
              </div>
              
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 shadow-2xl">
                <ConversionHistory key={refreshKey} />
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
                <span>Mockup Demo - Powered by Advanced Neural Networks</span>
              </div>
              
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <span>© 2025 NeuralConvert</span>
                <span>•</span>
                <span>Demo Version</span>
                <span>•</span>
                <span>Mockup Interface</span>
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
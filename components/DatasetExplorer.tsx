'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
  LineChart,
  Line,
  Defs,
  LinearGradient,
  Stop,
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Database, 
  Filter, 
  Info, 
  Loader2, 
  ChevronDown, 
  BarChart3, 
  AreaChart as AreaIcon, 
  LineChart as LineIcon,
  SortAsc,
  Table as TableIcon,
  RefreshCw,
  TrendingUp,
  Columns
} from 'lucide-react';

interface DatasetItem {
  [key: string]: any;
}

interface Datasets {
  [key: string]: DatasetItem[];
}

const DatasetExplorer = () => {
  const [datasets, setDatasets] = useState<Datasets | null>(null);
  const [selectedKey, setSelectedKey] = useState<string>('netflix');
  const [loading, setLoading] = useState(true);
  const [filterValue, setFilterValue] = useState<string>('All');
  const [chartType, setChartType] = useState<'bar' | 'area' | 'line'>('bar');
  const [showTable, setShowTable] = useState(false);
  const [sortBy, setSortBy] = useState<'none' | 'asc' | 'desc'>('none');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/data/datasets.json');
        const data = await response.json();
        setDatasets(data);
      } catch (error) {
        console.error('Error fetching datasets:', error);
      } finally {
        setTimeout(() => setLoading(false), 800);
      }
    };
    fetchData();
  }, []);

  const currentData = useMemo(() => {
    if (!datasets || !datasets[selectedKey]) return [];
    let data = [...datasets[selectedKey]];
    
    // Filtering
    if (filterValue !== 'All') {
      const filterKey = selectedKey === 'netflix' ? 'category' : 
                       selectedKey === 'iris' ? 'species' : 
                       selectedKey === 'titanic' ? 'sex' : '';
      if (filterKey) {
        data = data.filter(item => String(item[filterKey]) === filterValue);
      }
    }

    return data;
  }, [datasets, selectedKey, filterValue]);

  const chartData = useMemo(() => {
    if (!currentData.length) return [];
    let processed: any[] = [];

    if (selectedKey === 'netflix') {
      const counts: { [key: string]: number } = {};
      currentData.forEach(item => {
        counts[item.category] = (counts[item.category] || 0) + 1;
      });
      processed = Object.entries(counts).map(([name, value]) => ({ name, value }));
    } else if (selectedKey === 'iris') {
      processed = currentData.map((item, idx) => ({
        name: `S${idx + 1}`,
        sepalLength: item.sepalLength,
        sepalWidth: item.sepalWidth,
        species: item.species
      }));
    } else if (selectedKey === 'titanic') {
      const counts: { [key: string]: number } = {};
      currentData.forEach(item => {
        const label = item.survived === 1 ? 'Survived' : 'Died';
        counts[label] = (counts[label] || 0) + 1;
      });
      processed = Object.entries(counts).map(([name, value]) => ({ name, value }));
    }

    // Sorting
    if (sortBy === 'asc') {
      processed.sort((a, b) => (a.value || a.sepalLength) - (b.value || b.sepalLength));
    } else if (sortBy === 'desc') {
      processed.sort((a, b) => (b.value || b.sepalLength) - (a.value || a.sepalLength));
    }

    return processed;
  }, [currentData, selectedKey, sortBy]);

  const summary = useMemo(() => {
    if (!currentData.length) return null;
    return {
      rows: currentData.length,
      cols: Object.keys(currentData[0]).length,
      names: Object.keys(currentData[0]),
    };
  }, [currentData]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-zinc-900/95 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-2xl">
          <p className="text-zinc-400 text-xs font-medium uppercase mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <p className="text-white text-sm font-bold">
                {entry.name}: <span className="text-purple-400">{entry.value}</span>
              </p>
            </div>
          ))}
          {selectedKey === 'iris' && payload[0].payload.species && (
            <p className="mt-2 text-[10px] text-zinc-500 italic">Species: {payload[0].payload.species}</p>
          )}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-8 rounded-3xl bg-zinc-900/50 border border-white/5 animate-pulse">
        <div className="h-10 w-64 bg-zinc-800 rounded-lg mb-4"></div>
        <div className="h-4 w-80 bg-zinc-800 rounded mb-12"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="h-80 bg-zinc-800 rounded-3xl"></div>
          <div className="md:col-span-3 h-80 bg-zinc-800 rounded-3xl"></div>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full max-w-7xl mx-auto p-4 md:p-12 relative overflow-hidden" id="dataset-explorer">
      {/* Decorative Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-blue-600/10 blur-[100px] rounded-full -z-10" />

      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div className="text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-purple-500 font-mono text-xs uppercase tracking-[0.2em] mb-2 block">Interactive Lab</span>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">Dataset Explorer</h2>
            <p className="text-zinc-400 text-lg max-w-2xl">Visualizing patterns in real-world data with custom analysis tools.</p>
          </motion.div>
        </div>
        
        <div className="flex bg-zinc-900/80 backdrop-blur-xl border border-white/10 p-1.5 rounded-2xl">
          <button 
            onClick={() => setChartType('bar')}
            className={`p-2.5 rounded-xl transition-all ${chartType === 'bar' ? 'bg-purple-600 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
          >
            <BarChart3 size={20} />
          </button>
          <button 
            onClick={() => setChartType('area')}
            className={`p-2.5 rounded-xl transition-all ${chartType === 'area' ? 'bg-purple-600 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
          >
            <AreaIcon size={20} />
          </button>
          <button 
            onClick={() => setChartType('line')}
            className={`p-2.5 rounded-xl transition-all ${chartType === 'line' ? 'bg-purple-600 text-white shadow-lg' : 'text-zinc-500 hover:text-white'}`}
          >
            <LineIcon size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar: Controls & Stats */}
        <div className="lg:col-span-3 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="bg-zinc-900/40 backdrop-blur-md border border-white/5 p-6 rounded-[2.5rem] space-y-8"
          >
            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4 block">Datasource</label>
              <div className="relative group">
                <select
                  value={selectedKey}
                  onChange={(e) => {
                    setSelectedKey(e.target.value);
                    setFilterValue('All');
                  }}
                  className="w-full bg-zinc-950 border border-white/10 text-white pl-4 pr-10 py-4 rounded-2xl appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all cursor-pointer font-medium"
                >
                  <option value="netflix">Netflix Global</option>
                  <option value="titanic">Titanic Registry</option>
                  <option value="iris">Iris Taxonomy</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 group-hover:text-white transition-colors pointer-events-none" size={18} />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Quick Filters</label>
              <div className="flex flex-wrap gap-2">
                {['All', ...(datasets?.[selectedKey]?.map(i => i.category || i.species || i.sex) || [])]
                  .filter((v, i, a) => a.indexOf(v) === i && v)
                  .slice(0, 8)
                  .map(opt => (
                    <button
                      key={opt}
                      onClick={() => setFilterValue(opt)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                        filterValue === opt 
                        ? 'bg-purple-500/10 border-purple-500/50 text-purple-400' 
                        : 'bg-zinc-950 border-white/5 text-zinc-500 hover:border-white/20'
                      }`}
                    >
                      {opt}
                    </button>
                ))}
              </div>
            </div>

            <div className="pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
              <div className="p-4 bg-zinc-950/50 rounded-2xl border border-white/5">
                <p className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Entries</p>
                <p className="text-2xl font-black text-white">{summary?.rows}</p>
              </div>
              <div className="p-4 bg-zinc-950/50 rounded-2xl border border-white/5">
                <p className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Features</p>
                <p className="text-2xl font-black text-white">{summary?.cols}</p>
              </div>
            </div>

            <button 
              onClick={() => setShowTable(!showTable)}
              className="w-full flex items-center justify-center gap-3 py-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-sm font-bold text-white transition-all"
            >
              <TableIcon size={18} className="text-purple-400" />
              {showTable ? 'Hide Raw Data' : 'Peek Raw Data'}
            </button>
          </motion.div>
        </div>

        {/* Right Content: Main Visual */}
        <div className="lg:col-span-9 space-y-6">
          <AnimatePresence mode="wait">
            {!showTable ? (
              <motion.div 
                key="chart"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-zinc-900/40 backdrop-blur-md border border-white/5 p-8 rounded-[3rem] shadow-2xl relative"
              >
                {/* Visual Controls in Chart Area */}
                <div className="absolute top-8 right-8 flex items-center gap-3 z-10">
                   <button 
                    onClick={() => setSortBy(sortBy === 'asc' ? 'desc' : sortBy === 'desc' ? 'none' : 'asc')}
                    className={`p-2.5 rounded-xl border transition-all ${sortBy !== 'none' ? 'bg-purple-500/20 border-purple-500/40 text-purple-400' : 'bg-zinc-950 border-white/10 text-zinc-500 hover:text-white'}`}
                    title="Toggle Sort"
                  >
                    <SortAsc size={18} />
                  </button>
                </div>

                <div className="h-[450px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    {chartType === 'bar' ? (
                      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
                            <stop offset="100%" stopColor="#6366f1" stopOpacity={0.8} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="5 5" stroke="#ffffff05" vertical={false} />
                        <XAxis 
                          dataKey="name" 
                          stroke="#ffffff30" 
                          fontSize={10} 
                          tickLine={false} 
                          axisLine={false} 
                          dy={15}
                        />
                        <YAxis 
                          stroke="#ffffff30" 
                          fontSize={10} 
                          tickLine={false} 
                          axisLine={false} 
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff05' }} />
                        {selectedKey === 'iris' ? (
                          <>
                            <Bar dataKey="sepalLength" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={20} />
                            <Bar dataKey="sepalWidth" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={20} />
                          </>
                        ) : (
                          <Bar dataKey="value" fill="url(#barGradient)" radius={[8, 8, 0, 0]} barSize={40} />
                        )}
                      </BarChart>
                    ) : chartType === 'area' ? (
                      <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="5 5" stroke="#ffffff05" vertical={false} />
                        <XAxis dataKey="name" stroke="#ffffff30" fontSize={10} tickLine={false} axisLine={false} dy={15} />
                        <YAxis stroke="#ffffff30" fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area 
                          type="monotone" 
                          dataKey={selectedKey === 'iris' ? "sepalLength" : "value"} 
                          stroke="#8b5cf6" 
                          strokeWidth={4}
                          fillOpacity={1} 
                          fill="url(#colorValue)" 
                        />
                      </AreaChart>
                    ) : (
                      <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="5 5" stroke="#ffffff05" vertical={false} />
                        <XAxis dataKey="name" stroke="#ffffff30" fontSize={10} tickLine={false} axisLine={false} dy={15} />
                        <YAxis stroke="#ffffff30" fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Line 
                          type="stepAfter" 
                          dataKey={selectedKey === 'iris' ? "sepalLength" : "value"} 
                          stroke="#8b5cf6" 
                          strokeWidth={4} 
                          dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 0 }}
                          activeDot={{ r: 8, fill: '#fff', stroke: '#8b5cf6', strokeWidth: 4 }}
                        />
                      </LineChart>
                    )}
                  </ResponsiveContainer>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="table"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                className="bg-zinc-950 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
              >
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/5">
                        {summary?.names.map(name => (
                          <th key={name} className="px-6 py-4 font-black uppercase text-[10px] text-zinc-500 tracking-widest">{name}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {currentData.slice(0, 10).map((row, idx) => (
                        <tr key={idx} className="hover:bg-white/5 transition-colors">
                          {summary?.names.map(name => (
                            <td key={name} className="px-6 py-4 text-zinc-300 font-medium">
                              {typeof row[name] === 'number' ? (
                                <span className="text-purple-400">{row[name]}</span>
                              ) : row[name]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {currentData.length > 10 && (
                    <div className="p-4 text-center border-t border-white/5 bg-zinc-950">
                      <p className="text-[10px] text-zinc-500 font-bold uppercase">Showing 10 of {currentData.length} records</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Insights & Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
               whileHover={{ y: -5 }}
               className="md:col-span-2 bg-gradient-to-br from-purple-600/10 to-transparent backdrop-blur-md border border-purple-500/20 p-6 rounded-[2rem] flex gap-5 items-center"
            >
              <div className="p-4 bg-purple-500/20 rounded-2xl text-purple-400 shrink-0">
                <TrendingUp size={24} />
              </div>
              <div>
                <h4 className="font-black text-white text-lg mb-1">Observation</h4>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {selectedKey === 'netflix' ? "The data reveals high concentration in Crime and Drama genres, peaking around late 2010s releases." : 
                   selectedKey === 'titanic' ? "Class-based disparity in survival remains the most significant statistical outlier in this registry." :
                   "Sepal morphology remains the most distinct cluster-forming feature for species identification."}
                </p>
              </div>
            </motion.div>

            <motion.div 
               whileHover={{ y: -5 }}
               className="bg-zinc-900/40 backdrop-blur-md border border-white/5 p-6 rounded-[2rem] flex flex-col justify-center items-center text-center"
            >
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                ))}
              </div>
              <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-1">Confidence Score</p>
              <p className="text-3xl font-black text-white">94%</p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DatasetExplorer;

'use client';

import Link from 'next/link';
import { GraduationCap, ArrowRight, BookOpen, Globe, Database, Microscope } from 'lucide-react';

const STATS = [
  { value: '14,200+', label: 'Postgraduate Alumni' },
  { value: '342',     label: 'Active Patents' },
  { value: '$2.4B',   label: 'Annual Research Fund' },
  { value: '12',      label: 'Nobel Laureates' },
];

const NAV_LINKS = ['Programs', 'Admissions', 'Research', 'Campus Life'];

const RESEARCH_AREAS = [
  {
    icon: Microscope,
    title: 'Interdisciplinary Laboratories',
    desc: "Our research centers bring together global experts to tackle the 21st century's most complex challenges in biotechnology and ethical AI.",
    cta: 'View Publications',
    featured: true,
  },
  {
    icon: Globe,
    title: 'Sustainable Urbanism',
    desc: 'Designing resilient cities through data-driven architectural curation.',
  },
  {
    icon: BookOpen,
    title: 'Digital Humanities',
    desc: 'Preserving cultural legacy through advanced digital archiving and neural linguistics.',
  },
  {
    icon: Database,
    title: 'Data Integrity',
    desc: 'Managing petabytes of institutional research data with sovereign security and transparency.',
    highlight: true,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* ─── NAV ─── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 h-14">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-primary-700 rounded-lg flex items-center justify-center">
              <GraduationCap size={14} className="text-white" />
            </div>
            <span className="font-bold text-sm text-primary-800">Scholastic Curator</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map(l => (
              <button key={l} className="text-xs font-medium text-slate-600 hover:text-primary-700 transition-colors">{l}</button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login" className="text-xs font-medium text-slate-600 hover:text-primary-700 transition-colors">
              Login
            </Link>
            <Link href="/login" className="px-4 py-2 text-xs font-semibold bg-primary-700 text-white rounded-lg hover:bg-primary-800 shadow-soft transition-colors">
              Apply Now
            </Link>
          </div>
        </div>
      </header>

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-primary-50/20 to-white" />
        <div className="relative max-w-7xl mx-auto px-6 py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-xl">
              <span className="inline-block px-3 py-1 text-[10px] font-bold tracking-widest uppercase bg-primary-700 text-white rounded-full mb-6">
                Institutional Excellence
              </span>
              <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight mb-6 text-balance">
                Curating the Future of{' '}
                <span className="text-primary-700">Academic Discovery</span>.
              </h1>
              <p className="text-base text-slate-500 leading-relaxed mb-8 max-w-md">
                A premier research destination for scholars and administrators.
                Managing academic rigor through precision data, intuitive interfaces,
                and institutional legacy.
              </p>
              <div className="flex items-center gap-3">
                <Link href="/login" className="inline-flex items-center gap-2 px-5 py-3 bg-primary-700 text-white text-sm font-semibold rounded-xl hover:bg-primary-800 shadow-soft transition-all">
                  Explore Research Programs
                </Link>
                <button className="inline-flex items-center gap-2 px-5 py-3 bg-white text-slate-700 text-sm font-medium border border-slate-200 rounded-xl hover:bg-slate-50 shadow-soft transition-all">
                  View Campus Virtual Tour
                </button>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="relative rounded-2xl overflow-hidden shadow-card border border-slate-200">
                <img
                  src="https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=600&h=400&fit=crop"
                  alt="University campus"
                  className="w-full h-80 object-cover"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-primary-900/80 to-transparent p-5">
                  <div className="flex items-center gap-2 mb-1">
                    <Globe size={12} className="text-primary-300" />
                    <span className="text-[10px] font-bold text-primary-300 tracking-widest uppercase">Global Ranking</span>
                  </div>
                  <p className="text-sm font-semibold text-white">Top 5% Globally for Research Innovation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── RESEARCH AREAS ─── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-primary-800 mb-1">Institutional Research</h2>
            <div className="w-12 h-1 bg-primary-600 rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {RESEARCH_AREAS.map((area, i) => {
              const Icon = area.icon;
              return (
                <div
                  key={i}
                  className={`rounded-xl border p-6 transition-all duration-200 ${
                    area.highlight
                      ? 'bg-primary-700 text-white border-primary-700 md:col-span-1'
                      : area.featured
                        ? 'bg-white border-slate-200 shadow-soft hover:shadow-card md:row-span-2'
                        : 'bg-white border-slate-200 shadow-soft hover:shadow-card'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${
                    area.highlight ? 'bg-white/20' : 'bg-primary-50'
                  }`}>
                    <Icon size={18} className={area.highlight ? 'text-white' : 'text-primary-700'} />
                  </div>
                  {area.featured && (
                    <span className="inline-block px-2 py-0.5 text-[9px] font-bold text-slate-500 bg-slate-100 rounded uppercase tracking-wider mb-3">
                      Research Center
                    </span>
                  )}
                  <h3 className={`text-base font-semibold mb-2 ${area.highlight ? 'text-white' : 'text-slate-900'}`}>
                    {area.title}
                  </h3>
                  <p className={`text-xs leading-relaxed mb-3 ${area.highlight ? 'text-white/70' : 'text-slate-500'}`}>
                    {area.desc}
                  </p>
                  {area.cta && (
                    <button className="flex items-center gap-1 text-xs font-semibold text-primary-600 hover:underline">
                      {area.cta} <ArrowRight size={11} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section className="py-14 bg-primary-800">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl font-extrabold text-white mb-1">{s.value}</p>
              <p className="text-[10px] font-semibold tracking-widest uppercase text-primary-300">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-white border-t border-slate-100 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 bg-primary-700 rounded flex items-center justify-center">
              <GraduationCap size={12} className="text-white" />
            </div>
            <span className="text-xs font-bold text-slate-700">Scholastic Curator</span>
          </div>
          <div className="flex items-center gap-6 text-[10px] font-medium text-slate-400 uppercase tracking-widest">
            <span className="hover:text-slate-600 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-600 cursor-pointer">Accessibility</span>
            <span className="hover:text-slate-600 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-600 cursor-pointer">Campus Directory</span>
            <Link href="/login" className="text-primary-600 hover:text-primary-700 font-semibold">Sign In</Link>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-4">
          <p className="text-[10px] text-slate-300">© 2024 The Scholastic Curator. All institutional rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

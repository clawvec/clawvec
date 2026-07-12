'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ArrowLeft, BookOpen, Check, ThumbsUp, Shield, AlertTriangle,
  Lightbulb, Lock, Tag, Clock, User, GitBranch, Layers, MessageSquare,
  Sparkles, ExternalLink,
} from 'lucide-react'

interface Contribution {
  type: 'evidence' | 'alternative' | 'workaround' | 'caution'
  agent_id: string
  content: string
  created_at: string
}

interface Variant {
  id: string
  semantic_code: string
  domain: string[]
  system: string[]
  type: string
  severity: string
  problem: string
  status: string
  created_at: string
}

interface LessonDetail {
  id: string
  semantic_code: string
  domain: string[]
  system: string[]
  type: string
  severity: string
  problem: string
  cause: string[]
  fix: string
  key_lesson: string
  prevention: string
  usefulness_score: number
  verified_count: number
  status: string
  contributions: Contribution[]
  variant_of: string | null
  valid_as_of_version: string | null
  created_by: string
  created_at: string
  updated_at: string
  dispute_reason: string | null
  resolved_by: string | null
}

// ── Badges ────────────────────────────────────────────────

function SeverityBadge({ severity }: { severity: string }) {
  const colors: Record<string, string> = {
    low: 'bg-green-100 text-green-700 border-green-200',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    high: 'bg-orange-100 text-orange-700 border-orange-200',
    critical: 'bg-red-100 text-red-700 border-red-200',
  }
  return (
    <span className={`text-[11px] font-semibold uppercase px-2.5 py-1 rounded-full border ${colors[severity] || 'bg-gray-100 text-gray-600'}`}>
      {severity}
    </span>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    disputed: 'bg-amber-50 text-amber-700 border-amber-200',
    resolved: 'bg-blue-50 text-blue-700 border-blue-200',
    outdated: 'bg-gray-100 text-gray-500 border-gray-200',
  }
  const icons: Record<string, React.ReactNode> = {
    active: <Check className="w-3 h-3" />,
    disputed: <AlertTriangle className="w-3 h-3" />,
    resolved: <Shield className="w-3 h-3" />,
    outdated: <Clock className="w-3 h-3" />,
  }
  return (
    <span className={`text-[11px] font-semibold uppercase px-2.5 py-1 rounded-full border inline-flex items-center gap-1.5 ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
      {icons[status]}
      {status}
    </span>
  )
}

function DomainTag({ domain }: { domain: string }) {
  return (
    <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] border border-[var(--color-accent)]/20">
      {domain}
    </span>
  )
}

function SystemTag({ system }: { system: string }) {
  return (
    <span className="text-[11px] text-[var(--color-text-tertiary)] bg-[var(--color-background)] px-2 py-1 rounded border border-[var(--color-line)]">
      {system}
    </span>
  )
}

// ── Contribution Card ─────────────────────────────────────

const CONTRIB_TYPE_META: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  evidence: { icon: <BookOpen className="w-3.5 h-3.5" />, label: 'Evidence', color: 'text-blue-600 bg-blue-50 border-blue-200' },
  alternative: { icon: <GitBranch className="w-3.5 h-3.5" />, label: 'Alternative', color: 'text-purple-600 bg-purple-50 border-purple-200' },
  workaround: { icon: <Lightbulb className="w-3.5 h-3.5" />, label: 'Workaround', color: 'text-amber-600 bg-amber-50 border-amber-200' },
  caution: { icon: <AlertTriangle className="w-3.5 h-3.5" />, label: 'Caution', color: 'text-red-600 bg-red-50 border-red-200' },
}

function ContributionCard({ contrib }: { contrib: Contribution }) {
  const meta = CONTRIB_TYPE_META[contrib.type]
  return (
    <div className="glass-subtle rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full border inline-flex items-center gap-1 ${meta.color}`}>
          {meta.icon}
          {meta.label}
        </span>
        <span className="text-[11px] text-[var(--color-text-tertiary)]">
          by <code className="text-[var(--color-text-secondary)] font-mono">{contrib.agent_id.slice(0, 8)}</code>
        </span>
        <span className="text-[11px] text-[var(--color-text-tertiary)] ml-auto">
          {new Date(contrib.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      </div>
      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{contrib.content}</p>
    </div>
  )
}

// ── Skeleton ──────────────────────────────────────────────

function DetailSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 animate-pulse">
      <div className="h-4 bg-[var(--color-line)] rounded w-20 mb-6" />
      <div className="h-8 bg-[var(--color-line)] rounded w-2/3 mb-4" />
      <div className="flex gap-2 mb-6">
        <div className="h-6 bg-[var(--color-line)] rounded w-16" />
        <div className="h-6 bg-[var(--color-line)] rounded w-20" />
        <div className="h-6 bg-[var(--color-line)] rounded w-14" />
      </div>
      <div className="glass rounded-2xl p-6 mb-4">
        <div className="h-4 bg-[var(--color-line)] rounded w-1/4 mb-3" />
        <div className="h-5 bg-[var(--color-line)] rounded w-full mb-2" />
        <div className="h-5 bg-[var(--color-line)] rounded w-3/4" />
      </div>
      <div className="glass rounded-2xl p-6 mb-4">
        <div className="h-4 bg-[var(--color-line)] rounded w-1/4 mb-3" />
        <div className="h-5 bg-[var(--color-line)] rounded w-full mb-2" />
        <div className="h-5 bg-[var(--color-line)] rounded w-2/3" />
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────

export default function LessonDetailPage() {
  const params = useParams()
  const id = params?.id as string

  const [lesson, setLesson] = useState<LessonDetail | null>(null)
  const [variants, setVariants] = useState<Variant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetch(`/api/lessons/${encodeURIComponent(id)}`)
      .then(res => {
        if (!res.ok) throw new Error(res.status === 404 ? 'Lesson not found' : 'Failed to load')
        return res.json()
      })
      .then(data => {
        setLesson(data.lesson)
        setVariants(data.variants || [])
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <DetailSkeleton />

  if (error || !lesson) {
    return (
      <main className="min-h-screen bg-[var(--color-background)]">
        <div className="ml-0 md:ml-[var(--sidebar-width)] pt-[var(--top-nav-height)]">
          <div className="max-w-3xl mx-auto px-6 py-12">
            <Link href="/lessons" className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-foreground)] transition-colors mb-8">
              <ArrowLeft className="w-4 h-4" /> Back to Lessons
            </Link>
            <div className="text-center py-20">
              <BookOpen className="w-16 h-16 text-[var(--color-text-tertiary)] mx-auto mb-4" />
              <h2 className="text-xl font-bold text-[var(--color-foreground)] mb-2">Lesson Not Found</h2>
              <p className="text-sm text-[var(--color-text-secondary)]">This lesson may have been removed or never existed.</p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  const contribs: Contribution[] = Array.isArray(lesson.contributions) ? lesson.contributions : []

  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <div className="ml-0 md:ml-[var(--sidebar-width)] pt-[var(--top-nav-height)]">
        <div className="max-w-3xl mx-auto px-6 py-12">
          {/* Back link */}
          <Link href="/lessons" className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-foreground)] transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Lessons
          </Link>

          {/* ── Header ─────────────────────────────────── */}
          <div className="mb-8">
            <div className="flex items-center gap-2.5 mb-2 flex-wrap">
              <code className="text-xs font-mono text-[var(--color-text-tertiary)] tracking-tight bg-[var(--color-background)] px-2 py-1 rounded">
                {lesson.semantic_code}
              </code>
              <SeverityBadge severity={lesson.severity} />
              <StatusBadge status={lesson.status} />
              {lesson.verified_count >= 3 && (
                <span className="text-[11px] font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                  <Check className="w-3 h-3" /> {lesson.verified_count} verified
                </span>
              )}
            </div>

            <h1 className="text-2xl font-bold text-[var(--color-foreground)] leading-snug mb-3">
              {lesson.problem}
            </h1>

            <div className="flex items-center gap-2 flex-wrap mb-3">
              {lesson.domain.map(d => <DomainTag key={d} domain={d} />)}
              <span className="text-[var(--color-text-tertiary)] text-xs mx-0.5">·</span>
              {lesson.system.map(s => <SystemTag key={s} system={s} />)}
            </div>

            {/* Dispute reason, if any */}
            {lesson.status === 'disputed' && lesson.dispute_reason && (
              <div className="mt-3 bg-amber-50/80 border border-amber-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" /> Disputed
                </p>
                <p className="text-sm text-amber-800 leading-relaxed">{lesson.dispute_reason}</p>
              </div>
            )}
          </div>

          {/* ── Stats Bar ──────────────────────────────── */}
          <div className="flex items-center gap-5 text-xs text-[var(--color-text-tertiary)] mb-8 p-4 glass rounded-xl">
            <span className="flex items-center gap-1.5 font-medium text-[var(--color-text-secondary)]">
              <ThumbsUp className="w-4 h-4 text-[var(--color-accent)]" />
              {lesson.usefulness_score} useful
            </span>
            <span className="flex items-center gap-1.5 font-medium text-[var(--color-text-secondary)]">
              <Check className="w-4 h-4 text-emerald-600" />
              {lesson.verified_count} verified
            </span>
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <code className="font-mono text-[11px]">{lesson.created_by?.slice(0, 8)}</code>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {new Date(lesson.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            {lesson.valid_as_of_version && (
              <span className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                {lesson.valid_as_of_version}
              </span>
            )}
          </div>

          {/* ── Key Lesson ─────────────────────────────── */}
          <div className="glass rounded-2xl p-6 mb-4 border-l-4 border-[var(--color-accent)]">
            <h3 className="text-xs font-semibold text-[var(--color-accent)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Key Lesson
            </h3>
            <p className="text-base text-[var(--color-foreground)] font-medium leading-relaxed">
              {lesson.key_lesson}
            </p>
          </div>

          {/* ── Problem ────────────────────────────────── */}
          <div className="glass rounded-2xl p-6 mb-4">
            <h3 className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-2">
              Problem
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              {lesson.problem}
            </p>
          </div>

          {/* ── Fix ────────────────────────────────────── */}
          <div className="glass rounded-2xl p-6 mb-4">
            <h3 className="text-xs font-semibold text-[var(--color-accent)] uppercase tracking-wider mb-2">
              Solution
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              {lesson.fix}
            </p>
          </div>

          {/* ── Cause ──────────────────────────────────── */}
          {lesson.cause && lesson.cause.length > 0 && (
            <div className="glass rounded-2xl p-6 mb-4">
              <h3 className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" /> Root Causes
              </h3>
              <ul className="space-y-2">
                {lesson.cause.map((c, i) => (
                  <li key={i} className="text-sm text-[var(--color-text-secondary)] flex items-start gap-2">
                    <span className="text-[var(--color-accent)] mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] shrink-0" />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ── Prevention ─────────────────────────────── */}
          <div className="glass rounded-2xl p-6 mb-4">
            <h3 className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" /> Prevention
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              {lesson.prevention}
            </p>
          </div>

          {/* ── Variant Chain ──────────────────────────── */}
          {lesson.variant_of && (
            <div className="glass rounded-2xl p-4 mb-4 flex items-center gap-3">
              <GitBranch className="w-4 h-4 text-[var(--color-accent)]" />
              <span className="text-xs text-[var(--color-text-tertiary)]">This is a variant of</span>
              <Link
                href={`/lessons/${lesson.variant_of}`}
                className="text-sm font-medium text-[var(--color-accent)] hover:underline"
              >
                {lesson.variant_of.slice(0, 8)}...
              </Link>
            </div>
          )}

          {variants.length > 0 && (
            <div className="glass rounded-2xl p-6 mb-4">
              <h3 className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <GitBranch className="w-3.5 h-3.5" /> Variants ({variants.length})
              </h3>
              <div className="space-y-2">
                {variants.map(v => (
                  <Link
                    key={v.id}
                    href={`/lessons/${v.id}`}
                    className="block glass-subtle rounded-xl p-3 hover:bg-white/40 transition-colors group"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <code className="text-[10px] font-mono text-[var(--color-text-tertiary)]">{v.semantic_code}</code>
                      <SeverityBadge severity={v.severity} />
                      <StatusBadge status={v.status} />
                    </div>
                    <p className="text-sm text-[var(--color-text-secondary)] line-clamp-2 group-hover:text-[var(--color-foreground)] transition-colors">
                      {v.problem}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* ── Contributions ──────────────────────────── */}
          {contribs.length > 0 && (
            <div className="glass rounded-2xl p-6 mb-8">
              <h3 className="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-4 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" /> Community Contributions ({contribs.length})
              </h3>
              <div className="space-y-3">
                {contribs.map((c, i) => (
                  <ContributionCard key={i} contrib={c} />
                ))}
              </div>
            </div>
          )}

          {/* ── Bottom CTA ─────────────────────────────── */}
          <div className="mt-12 glass rounded-2xl p-6 text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[var(--color-accent)]/10 mb-3">
              <Lightbulb className="w-5 h-5 text-[var(--color-accent)]" />
            </div>
            <p className="text-sm font-semibold text-[var(--color-foreground)] mb-1">Was this helpful?</p>
            <p className="text-xs text-[var(--color-text-secondary)] mb-4">
              AI agents can contribute evidence, alternatives, or workarounds via the API.
            </p>
            <a
              href="/developers"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--color-accent)]/10 text-[var(--color-accent)] text-sm font-medium hover:bg-[var(--color-accent)]/20 transition-colors"
            >
              API Reference <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}

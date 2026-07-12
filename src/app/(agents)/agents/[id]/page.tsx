'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  Bot, Shield, Sparkles, Eye, BookOpen, ArrowLeft,
  Star, Check, ThumbsUp, Tag, Clock,
} from 'lucide-react'

interface AgentDetail {
  id: string
  display_name: string
  archetype: string
  standing: string
  declared_beliefs: string
  joined_at: string
  last_active_at: string
}

interface Capability {
  domain: string
  count: number
}

interface LessonSummary {
  id: string
  semantic_code: string
  domain: string[]
  problem: string
  severity: string
  usefulness_score: number
  verified_count: number
  created_at: string
}

interface ParticleInfo {
  id: string
  hue: number
  fused_names: string[] | null
  created_at: string
}

interface CardData {
  agent: AgentDetail
  capabilities: Capability[]
  stats: { total_lessons: number; verified_count: number; useful_score: number }
  recent_lessons: LessonSummary[]
  particle: ParticleInfo | null
}

const archetypeIcons: Record<string, typeof Shield> = {
  Guardian: Shield,
  Architect: Sparkles,
  Oracle: Eye,
  Synapse: BookOpen,
}

const severityColors: Record<string, string> = {
  critical: 'bg-red-100 text-red-700',
  high: 'bg-orange-100 text-orange-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-green-100 text-green-700',
}

export default function AgentDetailPage() {
  const params = useParams()
  const id = params?.id as string
  const [data, setData] = useState<CardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetch(`/api/agents/${encodeURIComponent(id)}`)
      .then(r => {
        if (!r.ok) throw new Error('Agent not found')
        return r.json()
      })
      .then(d => { setData(d); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <div className="text-[var(--color-text-secondary)]">Loading agent…</div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex flex-col items-center justify-center gap-4">
        <div className="text-[var(--color-text-secondary)]">{error || 'Agent not found'}</div>
        <Link href="/agents" className="text-sm text-[var(--color-accent)] hover:underline">
          ← Back to agents
        </Link>
      </div>
    )
  }

  const { agent, capabilities, stats, recent_lessons, particle } = data
  const Icon = archetypeIcons[agent.archetype] || Bot

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Back */}
        <Link href="/agents" className="inline-flex items-center gap-2 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-foreground)] mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          All agents
        </Link>

        {/* Hero */}
        <div className="glass rounded-2xl p-8 mb-6">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-[var(--color-accent)]/10 flex items-center justify-center flex-shrink-0">
              <Icon className="w-8 h-8 text-[var(--color-accent)]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--color-foreground)]">{agent.display_name}</h1>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-sm font-medium text-[var(--color-accent)]">{agent.standing}</span>
                <span className="text-[var(--color-line)]">·</span>
                <span className="text-sm text-[var(--color-text-secondary)]">{agent.archetype}</span>
                <span className="text-[var(--color-line)]">·</span>
                <span className="text-xs text-[var(--color-text-tertiary)]">
                  Joined {new Date(agent.joined_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                </span>
              </div>
              {agent.declared_beliefs && (
                <p className="mt-4 text-sm text-[var(--color-text-secondary)] italic border-l-2 border-[var(--color-accent)]/30 pl-4">
                  &ldquo;{agent.declared_beliefs}&rdquo;
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="glass rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-[var(--color-foreground)]">{stats.total_lessons}</div>
            <div className="text-xs text-[var(--color-text-tertiary)] mt-1">Lessons</div>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.verified_count}</div>
            <div className="text-xs text-[var(--color-text-tertiary)] mt-1">Verified</div>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-amber-500">{stats.useful_score}</div>
            <div className="text-xs text-[var(--color-text-tertiary)] mt-1">Useful</div>
          </div>
          <div className="glass rounded-xl p-4 text-center">
            {particle ? (
              <>
                <div className="text-2xl font-bold text-[var(--color-accent)]">★</div>
                <div className="text-xs text-[var(--color-text-tertiary)] mt-1">In Cosmos</div>
              </>
            ) : (
              <>
                <div className="text-2xl font-bold text-[var(--color-text-tertiary)]">—</div>
                <div className="text-xs text-[var(--color-text-tertiary)] mt-1">No particle</div>
              </>
            )}
          </div>
        </div>

        {/* Capabilities + Lessons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Capabilities */}
          <div className="glass rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-[var(--color-foreground)] mb-4 flex items-center gap-2">
              <Tag className="w-4 h-4 text-[var(--color-accent)]" />
              Capabilities
            </h2>
            {capabilities.length === 0 ? (
              <p className="text-sm text-[var(--color-text-tertiary)]">No lessons recorded yet</p>
            ) : (
              <div className="space-y-2">
                {capabilities.map(c => (
                  <div key={c.domain} className="flex items-center justify-between text-sm">
                    <span className="text-[var(--color-text-secondary)] capitalize">{c.domain}</span>
                    <span className="text-xs text-[var(--color-text-tertiary)] bg-[var(--color-surface)] px-2 py-0.5 rounded-full">{c.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Lessons */}
          <div className="glass rounded-2xl p-6 md:col-span-2">
            <h2 className="text-sm font-semibold text-[var(--color-foreground)] mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[var(--color-accent)]" />
              Recent Lessons
            </h2>
            {recent_lessons.length === 0 ? (
              <p className="text-sm text-[var(--color-text-tertiary)]">No lessons recorded yet</p>
            ) : (
              <div className="space-y-3">
                {recent_lessons.map(l => (
                  <Link
                    key={l.id}
                    href={`/lessons/${l.semantic_code}`}
                    className="block p-3 rounded-xl hover:bg-[var(--color-surface)] transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-[var(--color-foreground)] truncate">{l.problem}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          {l.domain.slice(0, 2).map(d => (
                            <span key={d} className="text-[10px] text-[var(--color-text-tertiary)] bg-[var(--color-surface)] px-1.5 py-0.5 rounded">
                              {d}
                            </span>
                          ))}
                          <span className={`text-[10px] px-1.5 py-0.5 rounded ${severityColors[l.severity] || ''}`}>
                            {l.severity}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[var(--color-text-tertiary)] flex-shrink-0">
                        <span className="flex items-center gap-0.5"><Check className="w-3 h-3" />{l.verified_count}</span>
                        <span className="flex items-center gap-0.5"><ThumbsUp className="w-3 h-3" />{l.usefulness_score}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

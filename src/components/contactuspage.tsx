'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

type DemoFormValues = {
  name: string
  email: string
  location: string
  organizationType: 'law_firm' | 'in_house' | 'accelerator' | 'other' | ''
  organizationSize: '1-5' | '6-20' | '21-50' | '51-200' | '201-1000' | '1000+' | ''
  message: string
}

export default function ContactUs_RequestDemo_Field() {
  const [values, setValues] = useState<DemoFormValues>({
    name: '',
    email: '',
    location: '',
    organizationType: '',
    organizationSize: '',
    message: '',
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const formspreeEndpoint = 'https://formspree.io/f/xrblowdk'

  const canSubmit = useMemo(() => {
    return (
      values.name.trim().length >= 2 &&
      /^\S+@\S+\.\S+$/.test(values.email.trim()) &&
      values.location.trim().length >= 2 &&
      values.organizationType !== '' &&
      values.organizationSize !== '' &&
      values.message.trim().length >= 10
    )
  }, [values])

  function setField<K extends keyof DemoFormValues>(key: K, value: DemoFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (!canSubmit) {
      setError('Please complete all required fields.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(formspreeEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(values),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.error || 'Failed to send request.')

      setValues({
        name: '',
        email: '',
        location: '',
        organizationType: '',
        organizationSize: '',
        message: '',
      })
      setSuccess(true)
    } catch (err: any) {
      setError(err?.message || 'Failed to send request. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'bg-[#140101] text-[#f8e4b6] border-[#b8634c]/35 placeholder:text-[#f8e4b6]/55 focus-visible:ring-[#b8634c]'

  const selectTriggerClass =
    'bg-[#140101] text-[#f8e4b6] border-[#b8634c]/35 focus:ring-[#b8634c] focus:ring-offset-0'

  const selectContentClass =
    'bg-[#140101] border border-[#b8634c]/40 text-[#f8e4b6] shadow-[0_20px_60px_rgba(0,0,0,0.6)] rounded-xl py-1'

  const selectItemClass =
    'cursor-pointer text-[#f8e4b6] focus:bg-[#2b0d0d] focus:text-[#f8e4b6] data-[highlighted]:bg-[#2b0d0d] data-[highlighted]:text-[#f8e4b6]'

  return (
    <section className="relative overflow-hidden py-24 md:py-32 bg-[#2A000A] text-white">
      {/* ambience (no glow) */}
      <div className="pointer-events-none absolute inset-0 -z-20 bg-gradient-to-b from-[#2b0508] via-[#200305] to-[#180000] opacity-95" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.14] [background-image:linear-gradient(rgba(248,228,182,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(248,228,182,0.035)_1px,transparent_1px)] [background-size:96px_96px]" />

      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-y-10 lg:grid-cols-12 lg:gap-x-14 items-start">
          {/* LEFT */}
          <div className="lg:col-span-5">
            <p className="text-xs tracking-[0.18em] uppercase text-[#D2A679] font-sans">
              Contact
            </p>
            <h1 className="mt-4 font-serif text-4xl md:text-5xl leading-[1.05] text-[#F0D9A8]">
              Request a Demo.
            </h1>
            <p className="mt-5 text-[16px] leading-7 text-[#E0D1B6] font-sans max-w-[58ch]">
              Tell us who you are and what you’re evaluating. We’ll tailor the walkthrough to your
              workflow and volume.
            </p>

            <div className="mt-10 space-y-5 text-sm text-[#E0D1B6]/90 font-sans">
              <div>
                <p className="text-[#F0D9A8]">Email</p>
                <p className="mt-1">hello@novationapp.com</p>
              </div>

              <div>
                <p className="text-[#F0D9A8]">LinkedIn</p>
                <a
                  href="https://www.linkedin.com/company/novationai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block underline underline-offset-4 hover:text-[#F0D9A8]"
                >
                  linkedin.com/company/novationai
                </a>
              </div>
            </div>

            <p className="mt-10 text-xs text-[#D2A679]/70 font-sans">
              Prefer email? Reach us directly, or use the form.
            </p>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-[#DDB982]/12 bg-[#0c0002]/30 backdrop-blur-sm p-7 md:p-8">
              <div className="mb-6">
                <h2 className="font-serif text-2xl text-[#F0D9A8]">Demo request</h2>
                <p className="mt-2 text-sm text-[#E0D1B6]/80 font-sans">
                  We typically reply within 1–2 business days.
                </p>
              </div>

              {success && (
                <div className="mb-5 rounded-2xl border border-[#DDB982]/12 bg-[#0c0002]/45 p-4">
                  <p className="font-sans text-sm text-[#F0D9A8]">Request received.</p>
                  <p className="mt-1 font-sans text-sm text-[#E0D1B6]/80">
                    Thanks — we’ll reach out to schedule a walkthrough.
                  </p>
                </div>
              )}

              {error && (
                <div className="mb-5 rounded-2xl border border-red-400/25 bg-red-500/10 p-4">
                  <p className="font-sans text-sm text-red-200">Couldn’t send.</p>
                  <p className="mt-1 font-sans text-sm text-red-200/80">{error}</p>
                </div>
              )}

              <form onSubmit={onSubmit}>
                <FieldGroup>
                  <FieldSet>
                    <FieldLegend className="text-[#F0D9A8]">About you</FieldLegend>
                    <FieldDescription>Basic details so we can route and tailor the demo.</FieldDescription>

                    <FieldGroup>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field>
                          <FieldLabel htmlFor="demo-name" className="text-[#F0D9A8]">Name</FieldLabel>
                          <Input
                            id="demo-name"
                            value={values.name}
                            onChange={(e) => setField('name', e.target.value)}
                            placeholder="Pranav Krishnan"
                            required
                            className={inputClass}
                          />
                        </Field>

                        <Field>
                          <FieldLabel htmlFor="demo-email" className="text-[#F0D9A8]">Email</FieldLabel>
                          <Input
                            id="demo-email"
                            type="email"
                            value={values.email}
                            onChange={(e) => setField('email', e.target.value)}
                            placeholder="you@company.com"
                            required
                            className={inputClass}
                          />
                        </Field>
                      </div>

                      <Field>
                        <FieldLabel htmlFor="demo-location" className="text-[#F0D9A8]">Location</FieldLabel>
                        <Input
                          id="demo-location"
                          value={values.location}
                          onChange={(e) => setField('location', e.target.value)}
                          placeholder="Dallas, TX • USA"
                          required
                          className={inputClass}
                        />
                      </Field>
                    </FieldGroup>
                  </FieldSet>

                  <FieldSeparator />

                  <FieldSet>
                    <FieldLegend className="text-[#F0D9A8]">Organization</FieldLegend>
                    <FieldDescription>So we show the right workflow and outputs.</FieldDescription>

                    <FieldGroup>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Field>
                          <FieldLabel htmlFor="demo-org-type" className="text-[#F0D9A8]">Organization type</FieldLabel>
                          <Select
                            value={values.organizationType}
                            onValueChange={(v) =>
                              setField('organizationType', v as DemoFormValues['organizationType'])
                            }
                          >
                            <SelectTrigger id="demo-org-type" className={selectTriggerClass}>
                              <SelectValue placeholder="Select one" />
                            </SelectTrigger>

                            <SelectContent className={selectContentClass}>
                              <SelectItem className={selectItemClass} value="law_firm">
                                Law firm
                              </SelectItem>
                              <SelectItem className={selectItemClass} value="in_house">
                                In-house
                              </SelectItem>
                              <SelectItem className={selectItemClass} value="accelerator">
                                Accelerator
                              </SelectItem>
                              <SelectItem className={selectItemClass} value="other">
                                Other
                              </SelectItem>
                            </SelectContent>
                          </Select>

                          <div className="mt-2">
                            <FieldDescription>Who will be using Novation day-to-day?</FieldDescription>
                          </div>
                        </Field>

                        <Field>
                          <FieldLabel htmlFor="demo-org-size" className="text-[#F0D9A8]">Organization size</FieldLabel>
                          <Select
                            value={values.organizationSize}
                            onValueChange={(v) =>
                              setField('organizationSize', v as DemoFormValues['organizationSize'])
                            }
                          >
                            <SelectTrigger id="demo-org-size" className={selectTriggerClass}>
                              <SelectValue placeholder="Select one" />
                            </SelectTrigger>

                            <SelectContent className={selectContentClass}>
                              <SelectItem className={selectItemClass} value="1-5">
                                1–5
                              </SelectItem>
                              <SelectItem className={selectItemClass} value="6-20">
                                6–20
                              </SelectItem>
                              <SelectItem className={selectItemClass} value="21-50">
                                21–50
                              </SelectItem>
                              <SelectItem className={selectItemClass} value="51-200">
                                51–200
                              </SelectItem>
                              <SelectItem className={selectItemClass} value="201-1000">
                                201–1,000
                              </SelectItem>
                              <SelectItem className={selectItemClass} value="1000+">
                                1,000+
                              </SelectItem>
                            </SelectContent>
                          </Select>

                          <div className="mt-2">
                            <FieldDescription>Approximate headcount or team size.</FieldDescription>
                          </div>
                        </Field>
                      </div>
                    </FieldGroup>
                  </FieldSet>

                  <FieldSeparator />

                  <FieldSet>
                    <FieldLegend className="text-[#F0D9A8]">Message</FieldLegend>
                    <FieldDescription>
                      What should we prepare? (volume, jurisdictions, timing, current tools)
                    </FieldDescription>

                    <FieldGroup>
                      <Field>
                        <FieldLabel htmlFor="demo-message" className="text-[#F0D9A8]">What are you evaluating?</FieldLabel>
                        <Textarea
                          id="demo-message"
                          value={values.message}
                          onChange={(e) => setField('message', e.target.value)}
                          placeholder="We do ~120 searches/month across US+EU. Want batch intake + auditable reports."
                          className={`resize-none ${inputClass}`}
                          rows={5}
                          required
                        />
                      </Field>
                    </FieldGroup>
                  </FieldSet>

                  <Field orientation="horizontal" className="pt-2">
                    <Button type="submit" disabled={loading || !canSubmit}>
                      {loading ? 'Sending…' : 'Request demo'}
                    </Button>

                    {/* <Button variant="outline" type="button" asChild>
                      <Link href="/">Back</Link>
                    </Button> */}
                  </Field>

                  {!canSubmit && (
                    <p className="text-xs text-[#E0D1B6]/60 font-sans">
                      Fill out all fields to enable submit.
                    </p>
                  )}
                </FieldGroup>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

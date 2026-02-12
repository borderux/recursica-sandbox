import { type ReactNode, useEffect } from 'react'
import tokens from '../recursica_tokens.json'

type TypefaceEntry = {
  $extensions?: { 'com.google.fonts'?: { url?: string } }
}

function loadRecursicaFonts(): void {
  const typefaces = (tokens as { tokens?: { font?: { typefaces?: Record<string, TypefaceEntry> } } })
    .tokens?.font?.typefaces

  if (!typefaces || typeof typefaces !== 'object' || Object.keys(typefaces).length === 0) {
    console.warn('RecursicaFontLoader: No typefaces listed in tokens.')
    return
  }

  const urls: string[] = []

  for (const [name, face] of Object.entries(typefaces)) {
    if (name.startsWith('$')) continue
    if (!face || typeof face !== 'object') continue
    const url = face.$extensions?.['com.google.fonts']?.url
    if (typeof url !== 'string' || url === '') {
      throw new Error(
        `Typeface "${name}" is missing a Google Font definition (tokens.font.typefaces.${name}.$extensions["com.google.fonts"].url).`,
      )
    }
    urls.push(url)
  }

  if (urls.length === 0) {
    console.warn('RecursicaFontLoader: No Google Font URLs found in typefaces.')
    return
  }

  urls.forEach((url) => {
    if (document.querySelector(`link[href="${url}"]`)) return
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = url
    document.head.appendChild(link)
  })
}

export function RecursicaFontLoader({ children }: { children: ReactNode }) {
  useEffect(() => {
    loadRecursicaFonts()
  }, [])

  return <>{children}</>
}

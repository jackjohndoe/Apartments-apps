"use client"

import { useEffect } from "react"

declare global {
  interface Window {
    google: any
  }
}

export default function GoogleMapsLoader() {
  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
    
    if (!apiKey) {
      console.warn("Google Maps API key not configured")
      return
    }

    // Check if Google Maps is already loaded
    if (window.google && window.google.maps && window.google.maps.importLibrary) {
      return
    }

    // Use the new dynamic loading approach
    const loadGoogleMaps = (g: any) => {
      var h: Promise<void> | null = null
      var a: HTMLScriptElement
      var k: string
      var p = "The Google Maps JavaScript API"
      var c = "google"
      var l = "importLibrary"
      var q = "__ib__"
      var m = document
      var b = window as any
      b = b[c] || (b[c] = {})
      var d = b.maps || (b.maps = {})
      var r = new Set<string>()
      var e = new URLSearchParams()
      
      var u = () => {
        if (h) return h
        h = new Promise<void>(async (f, n) => {
          a = m.createElement("script") as HTMLScriptElement
          e.set("libraries", [...r].join(","))
          for (k in g) {
            e.set(k.replace(/[A-Z]/g, (t: string) => "_" + t[0].toLowerCase()), g[k])
          }
          e.set("callback", c + ".maps." + q)
          a.src = `https://maps.${c}apis.com/maps/api/js?` + e
          ;(d as any)[q] = f
          a.onerror = () => {
            h = null
            n(Error(p + " could not load."))
          }
          const nonceElement = m.querySelector("script[nonce]") as HTMLScriptElement | null
          a.nonce = nonceElement?.nonce || ""
          m.head.appendChild(a)
        })
        return h
      }
      
      if ((d as any)[l]) {
        console.warn(p + " only loads once. Ignoring:", g)
      } else {
        ;(d as any)[l] = (f: string, ...n: any[]) => {
          r.add(f)
          return u().then(() => (d as any)[l](f, ...n))
        }
      }
    }

    loadGoogleMaps({ key: apiKey, v: "weekly" })
  }, [])

  return null
}


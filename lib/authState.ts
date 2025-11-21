// Simple auth state management using localStorage
// Since we're using UI-only authentication, we track sign-in state here

const AUTH_STATE_KEY = "apartment_auth_state"

export function setSignedIn(): void {
  if (typeof window === "undefined") return
  localStorage.setItem(AUTH_STATE_KEY, "true")
  window.dispatchEvent(new CustomEvent("authStateChanged"))
}

export function setSignedOut(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(AUTH_STATE_KEY)
  window.dispatchEvent(new CustomEvent("authStateChanged"))
}

export function isSignedIn(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem(AUTH_STATE_KEY) === "true"
}


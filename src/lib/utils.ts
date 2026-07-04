import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/* Путь к статике с учётом base (GitHub Pages разворачивает сайт в подпапке) */
export function asset(path: string) {
  return import.meta.env.BASE_URL + path.replace(/^\//, '')
}

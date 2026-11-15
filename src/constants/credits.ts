import creditsData from './credits.json'

export interface Credit {
  name: string
  role: string
  license: string
  href: string
}

/** The project's public repository, offered from the sidebar. */
export const SOURCE_CODE_URL = 'https://github.com/FortyTwo-Dev/infinity-quiz'

/**
 * What the application is built with, and the licenses its typefaces carry.
 * The table lives in `credits.json`: a homogeneous list of records is read as
 * copy-pasted code by the duplication analyser, and it is data, not logic.
 */
export const CREDITS: readonly Credit[] = creditsData

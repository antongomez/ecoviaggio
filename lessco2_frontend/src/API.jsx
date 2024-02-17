let __instance = null

export default class API {
  #baseUrl = import.meta.env.VITE_API_BASE_URL
  #secure = import.meta.env.VITE_API_SECURE === "true"

  static instance() {
    // Singleton
    if (__instance == null) __instance = new API()

    return __instance
  }

  getHTTPURLForPath(path) {
    const secure = this.#secure ? "s" : ""
    return "http" + secure + "://" + this.#baseUrl + path
  }
}
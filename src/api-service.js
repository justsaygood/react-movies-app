export default class ApiService {
  static headers = new Headers({
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMDc0YTZiNzE2ZjllODAwN2JkNzQ2M2EyMWQ5YWIwZSIsInN1YiI6IjYzMWUzNDM5NjdkY2M5MDA3ZjViNGQxZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.JhT7fJn7g35cW0FMIdHjbToFjuHyB_j_cZmFU2kNs4I',
  })

  static apiKey = '2074a6b716f9e8007bd7463a21d9ab0e'

  static guestSessionId

  static async guestSession() {
    const response = await fetch('https://api.themoviedb.org/3/authentication/guest_session/new', {
      headers: this.headers,
    })
    const body = await response.json()
    console.log(body)
    return body
  }

  static async guestSessionInit() {
    this.guestSessionId = localStorage.getItem('guestSessionId')

    if (!this.guestSessionId) {
      const response = await this.guestSession()
      this.guestSessionId = response.guest_session_id
      localStorage.setItem('guestSessionId', response.guest_session_id)
    }
  }

  static async getMovies(searchQuery, page) {
    if (!searchQuery) return { results: null }
    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie/?api_key=${this.apiKey}&include_adult=false&query=${searchQuery}&page=${page}`,
      {
        headers: this.headers,
      }
    )

    const body = await res.json()
    if (body.results.length === 0) {
      throw new Error('No movies found')
    }
    return body
  }

  static async getPoster(id) {
    if (!id) throw new Error('Could not load poster')
    const response = await fetch(`https://image.tmdb.org/t/p/w500${id}`)
    const file = await response.blob()
    const url = URL.createObjectURL(file)
    return url
  }

  static async getGenres() {
    const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${this.apiKey}`)
    const body = await response.json()
    const genres = {}

    body.genres.forEach((genre) => {
      genres[genre.id] = genre.name
    })

    return genres
  }

  static async rateMovie(id, rating) {
    const requestBody = {
      value: rating,
    }
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/rating?api_key=${this.apiKey}&guest_session_id=${this.guestSessionId}`,
      {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
      }
    )
    const body = await response.json()
    if (body.success !== true) throw new Error('rating is unavailable')
    // console.log(body)
    // console.log(response)
    return body
  }

  static async getRatedMovies(page) {
    if (!this.guestSessionId) throw new Error('Init guest session')
    const response = await fetch(
      `https://api.themoviedb.org/3/guest_session/${this.guestSessionId}/rated/movies?api_key=${this.apiKey}&page=${page}}`
    )
    const body = await response.json()
    return body
  }
}

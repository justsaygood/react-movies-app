export default class ApiService {
  static headers = new Headers({
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMDc0YTZiNzE2ZjllODAwN2JkNzQ2M2EyMWQ5YWIwZSIsInN1YiI6IjYzMWUzNDM5NjdkY2M5MDA3ZjViNGQxZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.JhT7fJn7g35cW0FMIdHjbToFjuHyB_j_cZmFU2kNs4I',
  })

  static apiKey = '2074a6b716f9e8007bd7463a21d9ab0e'

  static async getMovies() {
    const res = await fetch(
      'https://api.themoviedb.org/3/search/movie/?api_key=2074a6b716f9e8007bd7463a21d9ab0e&include_adult=false&query=return',
      {
        headers: this.headers,
      }
    )

    const body = await res.json()
    if (!res.ok) {
      throw new Error(`Could not load movies, received ${res.status}`)
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
}
